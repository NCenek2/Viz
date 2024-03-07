import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PREFIX } from "../constants/constants";
import useAuthService from "../hooks/services/useAuthService";

export type LoginInfo = {
  email: string;
  password: string;
};

const LOGIN_DATA: LoginInfo = {
  email: "",
  password: "",
};

const Login = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>(LOGIN_DATA);
  const { login } = useAuthService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setLoginInfo((data) => {
      return {
        ...data,
        [id]: value,
      };
    });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginInfo);
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
            className="form-control mb-3"
            placeholder="Email"
            value={loginInfo.email}
            onChange={handleChange}
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            minLength={10}
            value={loginInfo.password}
            onChange={handleChange}
          />
          <button
            className="btn btn-outline-light w-100 mb-1"
            disabled={!loginInfo.email || !loginInfo.password}
          >
            Login
          </button>
        </form>
        <div className="login-links">
          <Link
            to={`${ROUTE_PREFIX}/register`}
            className="btn btn-link text-decoration-none"
          >
            Register
          </Link>
          <Link
            to={`${ROUTE_PREFIX}/reset`}
            className="btn btn-link text-decoration-none"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
