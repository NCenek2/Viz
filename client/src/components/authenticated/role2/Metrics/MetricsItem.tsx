import { MetricsType } from "../../../../contexts/Role2Context";

const MetricsItem = ({ metrics_name, metrics_unit }: MetricsType) => {
  return (
    <li className="list-group-item">
      {metrics_name} - {metrics_unit}
    </li>
  );
};

export default MetricsItem;
