import { initialReport } from "../../components/authenticated/role2/Reports/Report";
import { UserReportType } from "../../components/authenticated/role2/UserReports/UserReport";
import { CycleType } from "../../contexts/Role1Context";
import { useAlert } from "../useAlert";
import useAuth from "../useAuth";
import useAxiosPrivate from "../useAxiosPrivate";
import useDashboard from "../useDashboard";
import useHandleError from "../useHandleError";

export type ReportType = {
  report: string;
  cycleId: number;
  userId: number;
  reportId?: number;
  acknowledged: boolean;
};

const useReportService = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { setAlert } = useAlert();
  const { selectedCycle, selectedUser } = useDashboard();
  const { auth } = useAuth();

  async function getReport(): Promise<ReportType> {
    if (!selectedCycle || !selectedUser) return initialReport;

    try {
      const response = await axiosPrivate.get(
        `/reports?userId=${selectedUser}&cycleId=${selectedCycle}`
      );

      const reportData: ReportType[] = response.data;
      if (!reportData.length)
        return {
          ...initialReport,
          reportId: -1,
          userId: selectedUser,
          cycleId: selectedCycle,
        };
      return { ...initialReport, ...reportData[0] };
    } catch (err) {
      handleError(err);
      return initialReport;
    }
  }

  async function getUserReport(): Promise<UserReportType | null> {
    if (!auth) return null;
    if (!auth?.userInfo?.userId) return null;

    try {
      const response = await axiosPrivate.get(`/reports`, {
        params: { cycleId: selectedCycle, userId: auth.userInfo.userId },
      });

      const userReportData: UserReportType[] = response.data;
      if (userReportData.length) {
        return userReportData[0];
      }
      return null;
    } catch (err) {
      handleError(err);
      return null;
    }
  }

  async function getUserReportCycles() {
    if (!auth?.userInfo?.userId) return [];
    try {
      const cyclesResponse = await axiosPrivate.get(
        `/reports/user/${auth.userInfo.userId}`
      );

      let cyclesData: CycleType[] = cyclesResponse.data;
      cyclesData.sort((cycleA, cycleB) => {
        return (
          new Date(cycleB.startDate).getTime() -
          new Date(cycleA.startDate).getTime()
        );
      });

      cyclesData = cyclesData.map((cycle) => {
        return {
          ...cycle,
          startDate: new Date(cycle.startDate).toDateString(),
        };
      });
      return cyclesData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function acknowledgeReport(report: UserReportType | null) {
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

      await getUserReport();
      setAlert("Report Acknowledged", "success");
    } catch (err) {
      handleError(err);
    }
  }

  async function createReport(report: ReportType) {
    try {
      await axiosPrivate({
        url: "/reports",
        method: "post",
        data: report,
      });
      setAlert("Report Created", "success");
    } catch (err) {
      handleError(err);
    }
  }

  async function updateReport(report: ReportType) {
    const { reportId } = report;
    try {
      await axiosPrivate({
        url: `/reports/${reportId}`,
        method: "patch",
        data: { report: report.report },
      });
      setAlert("Report Updated", "success");
    } catch (err) {
      handleError(err);
    }
  }

  return {
    getReport,
    getUserReport,
    getUserReportCycles,
    acknowledgeReport,
    createReport,
    updateReport,
  };
};

export default useReportService;
