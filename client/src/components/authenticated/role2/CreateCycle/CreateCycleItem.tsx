import { useState } from "react";
import { useCreateCycle } from "../../../../hooks/useCreateCycle";
import { MetricsType } from "../../../../contexts/Role2Context";

type CreateCycleTypes = "users" | "metrics";

type CreateCycleItemProps = {
  value: number;
  description: string;
  type: CreateCycleTypes;
};

const CreateCycleItem = ({
  value,
  type,
  description,
}: CreateCycleItemProps) => {
  const { state, dispatch, CREATE_CYCLE_ACTIONS } = useCreateCycle();
  const [selected, setSelected] = useState<boolean>(
    type === "users"
      ? state.users.has(value)
      : state.metrics.some((metric) => metric.metricId === value)
  );
  const handleChange = () => {
    const added = !selected;

    if (type === "users") {
      const payload = value;
      if (added) {
        dispatch({ type: CREATE_CYCLE_ACTIONS.ADD_USER, payload });
      } else {
        dispatch({ type: CREATE_CYCLE_ACTIONS.REMOVE_USER, payload });
      }
    } else {
      const payload: MetricsType = {
        metricId: value,
        metricName: description,
        metricUnit: "",
      };
      if (added) {
        dispatch({ type: CREATE_CYCLE_ACTIONS.ADD_METRIC, payload });
      } else {
        dispatch({ type: CREATE_CYCLE_ACTIONS.REMOVE_METRIC, payload });
      }
    }

    setSelected(added);
  };

  return (
    <li
      className={`list-group-item list-group-item-action ${
        selected && "active"
      }`}
      value={value}
      onClick={handleChange}
    >
      {description}
    </li>
  );
};

export default CreateCycleItem;
