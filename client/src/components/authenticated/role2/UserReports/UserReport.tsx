import { useEffect, useState } from "react";
import useReportService from "../../../../hooks/services/useReportService";

export type UserReportType = {
  reportId: number;
  report: string;
  cycleId: number;
  startDate: string;
  acknowledged: false;
};

const UserReport = () => {
  const [report, setReport] = useState<UserReportType | null>(null);
  const { getUserReport, acknowledgeReport } = useReportService();

  const handleReport = async () => {
    const userReport = await getUserReport();
    setReport(userReport);
  };

  useEffect(() => {
    handleReport();
  }, []);

  const handleAcknowledge = async () => {
    acknowledgeReport(report);
    handleReport();
  };

  return (
    <>
      {report !== null && (
        <div className="report-container">
          <div className="mb-3">
            <label
              htmlFor="exampleFormControlTextarea1"
              className="form-label text-white"
            >
              Report
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={10}
              readOnly={true}
              value={report.report}
            ></textarea>
          </div>
          {report.acknowledged === false && (
            <button
              className="btn btn-outline-light"
              onClick={handleAcknowledge}
            >
              Acknowledge
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default UserReport;
