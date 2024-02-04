import { useAlert } from "../hooks/useAlert";

const Alert = () => {
  const { alertType, alert, showAlert, hideAlert } = useAlert();
  return (
    <>
      {showAlert && (
        <div
          className={`alert alert-${alertType} text-center alert-dismissible fade show alert-alert alert-comp`}
          role="alert"
        >
          {alert}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={hideAlert}
          ></button>
        </div>
      )}
    </>
  );
};

export default Alert;
