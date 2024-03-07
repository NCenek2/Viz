import { ChangeEvent } from "react";
import useDashboard from "../../../../hooks/useDashboard";
import useChangeCycle from "../../../../hooks/useChangeCycle";
import useRole1 from "../../../../hooks/useRole1";
import useCurrentCycleService from "../../../../hooks/services/useCurrentCycleService";

const ChangeCurrentCycle = () => {
  const { cycles } = useRole1();
  const { setSelectedCycle } = useDashboard();
  const { current_date } = useChangeCycle();
  const { changeCurrentCycle } = useCurrentCycleService();

  const handleCycle = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const newCycle = parseInt(value);
    if (!newCycle) return setSelectedCycle(0);
    setSelectedCycle(newCycle);
  };

  return (
    <>
      <div className="center-fixed-container change-cycle-container">
        <h2>Current Cycle:</h2>
        <h3>{current_date}</h3>
        <select
          className="form-select form-select-md form-select-md mb-2"
          aria-label=".form-select-lg example"
          onChange={handleCycle}
        >
          <option value={"0"}>Cycles</option>
          {cycles.map((cycle) => {
            const { cycleId, startDate } = cycle;
            return (
              <option key={cycleId} value={cycleId}>
                {startDate}
              </option>
            );
          })}
        </select>
        <button className="btn btn-outline-light" onClick={changeCurrentCycle}>
          Change
        </button>
      </div>
    </>
  );
};

export default ChangeCurrentCycle;
