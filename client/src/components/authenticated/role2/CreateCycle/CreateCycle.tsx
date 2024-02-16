import { ChangeEvent, useState } from "react";
import CreateCycleItem from "./CreateCycleItem";
import { useCreateCycle } from "../../../../hooks/useCreateCycle";
import useRole2 from "../../../../hooks/useRole2";
import { useAlert } from "../../../../hooks/useAlert";
import SetCriteria from "./SetCriteria";

const CreateCycle = () => {
  const { users, metrics } = useRole2();
  const { setAlert } = useAlert();
  const { state, dispatch, CREATE_CYCLE_ACTIONS } = useCreateCycle();
  const [settingCriteria, setSettingCriteria] = useState<boolean>(false);

  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch({ type: CREATE_CYCLE_ACTIONS.SELECT_DATE, payload: value });
  };

  const handleNext = () => {
    if (!state.metrics.length || !state.users.size || !state.startDate) {
      return setAlert("Each criteria should have at least one option selected");
    }

    dispatch({ type: CREATE_CYCLE_ACTIONS.HANDLE_NEXT });
    setSettingCriteria(true);
  };

  return (
    <>
      {settingCriteria ? (
        <SetCriteria setSettingCriteria={setSettingCriteria} />
      ) : (
        <div className="create-cycle-container">
          <h2 className="mt-3 create-cycle-title">Create Cycle</h2>
          <ul className="list-group text-white">
            Users
            <div className="create-cycle-height">
              {users.map((user) => {
                const { userId, email } = user;
                return (
                  <CreateCycleItem
                    key={userId}
                    value={userId}
                    description={email}
                    type="users"
                  />
                );
              })}
            </div>
          </ul>
          <ul className="list-group bg-transparent">
            Metrics
            <div className="create-cycle-height">
              {metrics.map((cycle) => {
                const { metricId, metricName, metricUnit } = cycle;
                return (
                  <CreateCycleItem
                    key={metricId}
                    value={metricId}
                    description={`${metricName} (${metricUnit})`}
                    type="metrics"
                  />
                );
              })}
            </div>
          </ul>
          <div className="d-flex flex-column align-items-center create-cycle-date">
            <label htmlFor="cycle-date">Date</label>
            <input
              id="cycle-date"
              type="date"
              value={state.startDate}
              onChange={handleDate}
            />
          </div>
          <button
            className="btn btn-light create-cycle-btn"
            onClick={handleNext}
          >
            Continue
          </button>
        </div>
      )}
    </>
  );
};

export default CreateCycle;
