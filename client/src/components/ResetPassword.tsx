import { useState } from "react";
import { useAlert } from "../hooks/useAlert";
import { Link } from "react-router-dom";
import { ROUTE_PREFIX, USERS } from "../constants/constants";
import useUserService from "../hooks/services/useUserService";

export type ResetInfo = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

const RESET_DATA: ResetInfo = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

const ResetPassword = () => {
  const { setAlert } = useAlert();
  const { resetPassword } = useUserService();

  const [resetInfo, setResetInfo] = useState<ResetInfo>(RESET_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setResetInfo((data) => {
      return {
        ...data,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { password, password2, username, email } = resetInfo;

    if (password !== password2) {
      setAlert("Passwords do not match");
      return;
    }

    if (password.length < USERS.PASSWORD_MIN) {
      setAlert(`Password must be at least ${USERS.PASSWORD_MIN} characters`);
      return;
    }

    if (password.length > USERS.PASSWORD_MAX) {
      setAlert(
        `Password length cannot exceed ${USERS.PASSWORD_MAX} characters`
      );
      return;
    }

    if (email.trim().length < 1) {
      setAlert("Email cannot be empty");
      return;
    }

    if (email.length > USERS.EMAIL) {
      setAlert(`Email is more than ${USERS.EMAIL} characters`);
      return;
    }

    if (username.trim().length < 1) {
      setAlert("Username cannot be empty");
      return;
    }

    if (username.length > USERS.USERNAME) {
      setAlert(`Username is more than ${USERS.USERNAME} characters`);
      return;
    }

    resetPassword(resetInfo);
  };

  return (
    <>
      <div className="center-fixed-container login-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={resetInfo.email}
            onChange={handleChange}
          />
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="form-control mb-2"
            placeholder="Username"
            value={resetInfo.username}
            onChange={handleChange}
          />
          <label htmlFor="password" className="form-group">
            New Password - ({resetInfo.password.length}/{USERS.PASSWORD_MAX})
          </label>
          <input
            placeholder="Password"
            id="password"
            type="password"
            minLength={USERS.PASSWORD_MIN}
            maxLength={USERS.PASSWORD_MAX}
            className="form-control mb-2"
            required={true}
            value={resetInfo.password}
            onChange={handleChange}
          />
          <label htmlFor="password2" className="form-group">
            Re-enter Password
          </label>
          <input
            id="password2"
            type="password"
            minLength={USERS.PASSWORD_MIN}
            maxLength={USERS.PASSWORD_MAX}
            className="form-control mb-2"
            required={true}
            value={resetInfo.password2}
            onChange={handleChange}
          />
          <button
            className="btn btn-outline-light w-100 mb-1"
            disabled={
              !resetInfo.email ||
              !resetInfo.password ||
              !resetInfo.email ||
              !resetInfo.username
            }
          >
            Reset
          </button>
        </form>
        <div className="reset-links">
          <Link
            to={`${ROUTE_PREFIX}/login`}
            className="btn btn-link text-decoration-none"
          >
            Login
          </Link>
          <Link
            to={`${ROUTE_PREFIX}/register`}
            className="btn btn-link text-decoration-none"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
