import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useAlert } from "../hooks/useAlert";
import { AuthState } from "../contexts/AuthContext";
import useHandleError from "../hooks/useHandleError";

type LoginInfo = {
  email: string;
  password: string;
};

const LOGIN_DATA: LoginInfo = {
  email: "",
  password: "",
};

const Login = () => {
  const { setAuth } = useAuth();
  const handleError = useHandleError();
  const { hideAlert } = useAlert();

  const [loginInfo, setLoginInfo] = useState<LoginInfo>(LOGIN_DATA);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/rankings";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setLoginInfo((data) => {
      return {
        ...data,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  const login = async () => {
    try {
      const response = await axios({
        url: "/auth/login",
        method: "post",
        data: loginInfo,
      });

      const authData: AuthState = response.data;

      if (response?.status === 200) {
        hideAlert();
        setAuth(authData);
        navigate(from, { replace: true });
      }
    } catch (err) {
      handleError(err);
    }
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
          <Link to="/register" className="btn btn-link text-decoration-none">
            Register
          </Link>
          <Link to="" className="btn btn-link text-decoration-none">
            Forgot Password
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
