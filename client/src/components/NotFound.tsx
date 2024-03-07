import { Link } from "react-router-dom";
import { ROUTE_PREFIX } from "../constants/constants";

const NotFound = () => {
  return (
    <section className="center-fixed-container not-found">
      <h2>Not Found</h2>
      <Link className="btn btn-outline-light btn-sm" to={`${ROUTE_PREFIX}/`}>
        To Home
      </Link>
    </section>
  );
};

export default NotFound;
