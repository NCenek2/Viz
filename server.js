const express = require("express");
const keys = require("./config/keys");
const cors = require("cors");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const allowedOrigins = require("./config/allowedOrigins");
const hasToken = require("./middlewares/hasToken");
const httpStatusCodes = require("./errors/HttpCodes");
require("dotenv").config();

const app = express();
let pool = null;
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    user: keys.POSTGRES_USER,
    host: keys.POSTGRES_HOST,
    database: keys.POSTGRES_DATABASE,
    password: keys.POSTGRES_PASSWORD,
    port: keys.POSTGRES_PORT,
  });
}

const corsOptions = {
  origin: allowedOrigins,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  return res.sendStatus(200);
});

require("./routes/auth")(pool, app);
require("./routes/register")(pool, app);
require("./routes/refresh")(app);
require("./routes/logout")(pool, app);

app.use(hasToken);
require("./routes/metrics")(pool, app);
require("./routes/metricsCriteria")(pool, app);
require("./routes/currentCycle")(pool, app);
require("./routes/cycles")(pool, app);
require("./routes/users")(pool, app);
require("./routes/metric")(pool, app);
require("./routes/reports")(pool, app);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const { status, message } = err;
  if (!status) {
    return res
      .status(httpStatusCodes.INTERNAL_SERVER)
      .json({ status: httpStatusCodes.INTERNAL_SERVER, message: err?.message });
  }
  return res.status(status).json({ status, message });
}

app.use(errorHandler);

process.on("uncaughtException", function (err) {
  // console.log("Caught exception: " + err);
  throw new Error(err);
});

if (process.env.NODE_ENV === "production") {
  // Express with serve up production assests
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));
  // See if some file is in client/build

  // Expres will serve up the index.html file
  // if it doesn't recognize the rout
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT);

// Handle server shutdown
process.on("SIGINT", () => {
  // console.log("Server is shutting down");

  // Release the database pool before exiting
  pool.end(() => {
    // console.log("Database pool has been closed");
    app.close(() => {
      // console.log("Server has been closed");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  // console.log("Server is shutting down");

  // Release the database pool before exiting
  pool.end(() => {
    // console.log("Database pool has been closed");
    app.close(() => {
      // console.log("Server has been closed");
      process.exit(0);
    });
  });
});
