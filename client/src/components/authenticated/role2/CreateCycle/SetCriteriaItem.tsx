import { ChangeEvent, useState } from "react";
import { MetricsType } from "../../../../contexts/Role2Context";
import { useCreateCycle } from "../../../../hooks/useCreateCycle";

const SetCriteriaItem = ({ metricId, metricName }: MetricsType) => {
  const [weight, setWeight] = useState("");
  const [threshold, setThreshold] = useState("");
  const { dispatch, CREATE_CYCLE_ACTIONS } = useCreateCycle();

  const handleWeight = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setWeight((_) => value);

    let newWeight = parseFloat(value);
    if (!newWeight || newWeight <= 0) newWeight = 0;

    dispatch({
      type: CREATE_CYCLE_ACTIONS.EDIT_WEIGHT,
      payload: { metricId, weight: newWeight, threshold: 0 },
    });
  };

  const handleThreshold = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setThreshold((_) => value);

    let newThreshold = parseFloat(value);
    if (!newThreshold || newThreshold <= 0) newThreshold = 0;

    dispatch({
      type: CREATE_CYCLE_ACTIONS.EDIT_THRESHOLD,
      payload: { metricId, weight: 0, threshold: newThreshold },
    });
  };

  return (
    <tr>
      <td>{metricName}</td>
      <td>
        <input
          type="text"
          onChange={handleWeight}
          value={weight}
          className="criteria-input"
        />
      </td>
      <td>
        <input
          type="text"
          onChange={handleThreshold}
          value={threshold}
          className="criteria-input"
        />
      </td>
    </tr>
  );
};

export default SetCriteriaItem;
