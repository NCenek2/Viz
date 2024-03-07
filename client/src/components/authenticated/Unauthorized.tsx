import { Link } from "react-router-dom";
import { ROUTE_PREFIX } from "../../constants/constants";

const Unauthorized = () => {
  return (
    <>
      <h1>Unauthorized!</h1>
      <h2>You do not have permissions to view this page</h2>
      <Link to={`${ROUTE_PREFIX}/rankings`} replace>
        Go Back
      </Link>
    </>
  );
};

export default Unauthorized;
