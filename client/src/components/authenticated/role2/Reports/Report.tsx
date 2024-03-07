import { ChangeEvent, useEffect, useState } from "react";
import useDashboard from "../../../../hooks/useDashboard";
import { REPORTS } from "../../../../constants/constants";
import { useAlert } from "../../../../hooks/useAlert";
import useReportService, {
  ReportType,
} from "../../../../hooks/services/useReportService";

export const initialReport = {
  report: "",
  cycleId: 0,
  userId: 0,
  acknowledged: false,
};

const Report = () => {
  const { setAlert } = useAlert();
  const { selectedCycle, selectedUser } = useDashboard();
  const [report, setReport] = useState<ReportType>({
    ...initialReport,
    cycleId: selectedCycle,
    userId: selectedUser,
  });
  const { getReport, createReport, updateReport } = useReportService();

  const [madeChanges, setMadeChanges] = useState(false);

  const handleGetReport = async () => {
    const newReport: ReportType = await getReport(initialReport);
    setReport((prevReport) => {
      return { ...prevReport, ...newReport };
    });
    setMadeChanges(false);
  };

  useEffect(() => {
    handleGetReport();
  }, []);

  const failedChecks = (): boolean => {
    if (report === null) return true;

    if (report.report.length <= 0) {
      setAlert("Report cannot be empty");
      return true;
    }

    if (report.report.length > REPORTS.report) {
      setAlert(`Report cannot exceed ${REPORTS.report} characters`);
      return true;
    }

    return false;
  };

  const handleClick = async () => {
    if (failedChecks()) return;

    const { reportId } = report;

    if (reportId === -1) {
      createReport(report);
    } else {
      updateReport(report);
    }
    handleGetReport();
    setMadeChanges(false);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMadeChanges(true);

    const { value } = e.target;
    setReport((prevReport) => {
      return { ...prevReport, report: value };
    });
  };

  const reportTitle = report.reportId === -1 ? "New " : "";

  const reportAcknowledged = report.acknowledged
    ? "✔ "
    : report.acknowledged === false && report.reportId !== -1
    ? "❌ "
    : "";

  if (!report.reportId) {
    return (
      <div className="center-fixed-container">
        <h2>No Report</h2>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="mb-3">
        <label
          htmlFor="exampleFormControlTextarea1"
          className="form-label text-white"
        >
          {reportTitle} {reportAcknowledged}
          Report - ({report.report.length}/{REPORTS.report})
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={10}
          maxLength={REPORTS.report}
          value={report.report}
          onChange={handleChange}
        ></textarea>
      </div>
      <button
        className="btn btn-outline-light"
        disabled={!report.report.length || !madeChanges}
        onClick={handleClick}
      >
        {report.reportId === -1 ? "Create" : "Update"}
      </button>
    </div>
  );
};

export default Report;
