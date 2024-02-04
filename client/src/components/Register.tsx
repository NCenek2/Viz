import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultistepForm } from "../hooks/useMultistepForm";
import { EmailForm } from "./signin_forms/EmailForm";
import { PasswordForm } from "./signin_forms/PasswordForm";
import { Password2Form } from "./signin_forms/Password2Form";
import axios from "../api/axios";
import { UsernameForm } from "./signin_forms/UsernameForm";
import { useAlert } from "../hooks/useAlert";
import { USERS } from "../constants/constants";
import useHandleError from "../hooks/useHandleError";
import { CompanyKeyForm } from "./signin_forms/CompanyKey";

type FormData = {
  email: string;
  username: string;
  password: string;
  password2: string;
  companyKey: string;
};

const INITIAL_DATA: FormData = {
  email: "",
  username: "",
  password: "",
  password2: "",
  companyKey: "",
};

const SignUp = () => {
  const handleError = useHandleError();
  const { setAlert, hideAlert } = useAlert();
  const navigate = useNavigate();
  const [data, setData] = useState(INITIAL_DATA);

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { steps, currentStepIndex, step, isFirstStep, back, next, isLastStep } =
    useMultistepForm([
      <EmailForm {...data} updateFields={updateFields} />,
      <UsernameForm {...data} updateFields={updateFields} />,
      <PasswordForm {...data} updateFields={updateFields} />,
      <Password2Form {...data} updateFields={updateFields} />,
      <CompanyKeyForm {...data} updateFields={updateFields} />,
    ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) return next();

    if (data.password !== data.password2) {
      setAlert("Passwords do not match");
      return;
    }

    if (data.password.length < USERS.PASSWORD_MIN) {
      setAlert(`Password must be at least ${USERS.PASSWORD_MIN} characters`);
      return;
    }

    if (data.password.length > USERS.PASSWORD_MAX) {
      setAlert(
        `Password length cannot exceed ${USERS.PASSWORD_MAX} characters`
      );
      return;
    }

    if (data.username.trim().length < 1) {
      setAlert("Username should not contain only spaces");
      return;
    }

    if (data.username.length > USERS.USERNAME) {
      setAlert(`Username is more than ${USERS.USERNAME} characters`);
      return;
    }

    hideAlert();
    register();
  };

  const register = async (): Promise<any> => {
    try {
      const result = await axios({
        url: "/register",
        method: "post",
        data,
      });

      if (result?.status === 201) {
        setAlert("Account Created", "success");
        navigate("/login");
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <div className="center-fixed-container register-container">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
            }}
          >
            {currentStepIndex + 1} / {steps.length}
          </div>
          {step}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            {!isFirstStep && (
              <button
                type="button"
                onClick={back}
                className="btn btn-sm btn-outline-light"
              >
                Back
              </button>
            )}
            <button type="submit" className="btn btn-sm btn-outline-light">
              {isLastStep ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
