import { MetricsType } from "../../../../contexts/Role2Context";

const MetricsItem = ({ metricName, metricUnit }: MetricsType) => {
  return (
    <li className="list-group-item">
      {metricName} - {metricUnit}
    </li>
  );
};

export default MetricsItem;
