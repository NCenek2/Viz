import useCreateCycleMetrics from "../../../../hooks/useCreateCycleMetrics";
import { useCreateCycle } from "../../../../hooks/useCreateCycle";
import SetCriteriaItem from "./SetCriteriaItem";
import { useAlert } from "../../../../hooks/useAlert";

type SetCriteriaProps = {
  setSettingCriteria: React.Dispatch<React.SetStateAction<boolean>>;
};

const SetCriteria = ({ setSettingCriteria }: SetCriteriaProps) => {
  const { state } = useCreateCycle();
  const { setAlert } = useAlert();
  const createCycleData = useCreateCycleMetrics();

  const handleBack = () => {
    setSettingCriteria(false);
  };

  function customRound(value: number) {
    // Check if the value is close to 1
    if (Math.abs(value - 1) < 0.001) {
      return parseFloat(value.toFixed(2)); // Round to 2 decimal places
    } else {
      return parseFloat(value.toFixed(3)); // Round to 3 decimal places
    }
  }

  const handleCreate = async () => {
    const total = state.criteria.reduce((total, criteria) => {
      return criteria.weight + total;
    }, 0);

    const fixedTotal = customRound(total);

    if (fixedTotal !== 1) {
      return setAlert("Metric weights should add to 1");
    }
    const notProperThreholds = state.criteria.some((criteria) => {
      return criteria.threshold <= 0;
    });

    if (notProperThreholds) {
      return setAlert("Metric thresholds should be greater than 0");
    }

    createCycleData();
  };

  return (
    <div className="set-criteria-container">
      <h2>Set Criteria</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col" className="set-criteria-width">
              Weight
            </th>
            <th scope="col" className="set-criteria-width">
              Threshold
            </th>
          </tr>
        </thead>
        <tbody>
          {state.metrics.map((metric) => {
            const { metricId } = metric;
            return <SetCriteriaItem key={metricId} {...metric} />;
          })}
        </tbody>
      </table>
      <div className="set-criteria-button-container">
        <button
          className="btn btn-light create-cycle-btn me-2"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="btn btn-light create-cycle-btn"
          onClick={handleCreate}
        >
          Create Cycle
        </button>
      </div>
    </div>
  );
};

export default SetCriteria;
