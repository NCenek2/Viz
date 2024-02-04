import { ChangeEvent, useEffect, useState } from "react";
import useDashboard from "../../../../hooks/useDashboard";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { REPORTS } from "../../../../constants/constants";
import { useAlert } from "../../../../hooks/useAlert";
import useHandleError from "../../../../hooks/useHandleError";

type ReportType = {
  report: string;
  cycle_id: number;
  user_id: number;
  report_id?: number;
  acknowledged: boolean;
};

const initialReport = {
  report: "",
  cycle_id: 0,
  user_id: 0,
  acknowledged: false,
};

const Report = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { setAlert, hideAlert } = useAlert();
  const { selectedCycle, selectedUser } = useDashboard();
  const [report, setReport] = useState<ReportType>({
    ...initialReport,
    cycle_id: selectedCycle,
    user_id: selectedUser,
  });

  const [madeChanges, setMadeChanges] = useState(false);

  const getReport = async () => {
    if (!selectedCycle || !selectedUser) return;

    const result = await axiosPrivate.get(
      `/reports?user_id=${selectedUser}&cycle_id=${selectedCycle}`
    );

    const reportData: ReportType[] = result.data;
    if (reportData.length) {
      return setReport((prevReport) => {
        const newReport = {
          ...prevReport,
          ...result.data[0],
        };
        return newReport;
      });
    }
    setMadeChanges(false);
  };

  useEffect(() => {
    getReport();
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

    async function createReport() {
      try {
        await axiosPrivate({
          url: "/reports",
          method: "post",
          data: report,
        });
        getReport();
        setAlert("Report Created", "success");
      } catch (err) {
        handleError(err);
      }
    }

    async function updateReport() {
      try {
        await axiosPrivate({
          url: `/reports/${report.report_id}`,
          method: "patch",
          data: report,
        });
        getReport();
        setAlert("Report Updated", "success");
      } catch (err) {
        handleError(err);
      }
    }

    if (!report.report_id) {
      createReport();
    } else {
      updateReport();
    }

    setMadeChanges(false);
    hideAlert();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMadeChanges(true);

    const { value } = e.target;
    setReport((prevReport) => {
      return { ...prevReport, report: value };
    });
  };

  const reportTitle = !report.report_id ? "New " : "";

  const reportAcknowledged = report.acknowledged
    ? "✔ "
    : report.acknowledged === false && report.report_id
    ? "❌"
    : "";

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
        {!report.report_id ? "Create" : "Update"}
      </button>
    </div>
  );
};

export default Report;
