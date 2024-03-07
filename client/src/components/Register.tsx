import React, { useState } from "react";
import { useMultistepForm } from "../hooks/useMultistepForm";
import { EmailForm } from "./signin_forms/EmailForm";
import { PasswordForm } from "./signin_forms/PasswordForm";
import { Password2Form } from "./signin_forms/Password2Form";
import { UsernameForm } from "./signin_forms/UsernameForm";
import { useAlert } from "../hooks/useAlert";
import { USERS } from "../constants/constants";
import { CompanyKeyForm } from "./signin_forms/CompanyKey";
import useUserService from "../hooks/services/useUserService";

export type FormData = {
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
  const { setAlert } = useAlert();
  const [data, setData] = useState(INITIAL_DATA);
  const { register } = useUserService();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) return next();

    const { password, password2, email, username } = data;

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

    register(data);
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
