import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useDashboard from "../../../../hooks/useDashboard";
import useAuth from "../../../../hooks/useAuth";
import { useAlert } from "../../../../hooks/useAlert";
import useHandleError from "../../../../hooks/useHandleError";

type UserReportType = {
  reportId: number;
  report: string;
  cycleId: number;
  startDate: string;
  acknowledged: false;
};

const UserReport = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const handleError = useHandleError();
  const { setAlert } = useAlert();
  const [report, setReport] = useState<UserReportType | null>(null);
  const { selectedCycle } = useDashboard();

  async function getReport() {
    if (!auth) return;
    if (!auth?.userInfo?.userId) return;
    try {
      const response = await axiosPrivate.get(`/reports`, {
        params: { cycleId: selectedCycle, userId: auth.userInfo.userId },
      });

      const userReportData: UserReportType[] = response.data;
      if (userReportData.length) {
        setReport(userReportData[0]);
      }
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    getReport();
  }, []);

  async function acknowledgeReport() {
    if (!report) return;
    const { reportId } = report;
    let { userId } = auth?.userInfo ?? { userId: 0 };
    userId = parseInt(userId as unknown as string);
    try {
      await axiosPrivate({
        url: `/reports/acknowledge/${reportId}`,
        method: "patch",
        data: { userId },
      });

      getReport();
      setAlert("Report Acknowledged", "success");
    } catch (err) {
      handleError(err);
    }
  }

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
              onClick={acknowledgeReport}
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
