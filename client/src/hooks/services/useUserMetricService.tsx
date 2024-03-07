import { FilteredUser } from "../../components/authenticated/role2/Dashboard/Dashboard";
import { DashboardResultsType } from "../../contexts/DashboardResultsContext";
import { CurrentCycleType, CycleType } from "../../contexts/Role1Context";
import { useAlert } from "../useAlert";
import useAxiosPrivate from "../useAxiosPrivate";
import { useCreateCycle } from "../useCreateCycle";
import { MetricsCriterionId } from "../useCreateCycleMetrics";
import useDashboardResults from "../useDashboardResults";
import useHandleError from "../useHandleError";
import useRole1 from "../useRole1";
import useCurrentCycleService from "./useCurrentCycleService";

type RankingData = {
  email: string;
  startDate: string;
  value: number;
  weight: number;
  threshold: number;
};

type RankingObj = {
  [key: string]: Ranking;
};

export type Ranking = {
  email: string;
  score: number;
};

type UseUpdateDashboardResults = {
  updated: DashboardResultsType[];
};

const useUserMetricService = () => {
  const { state } = useCreateCycle();
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { currentCycle } = useRole1();
  const { getCurrentCycle } = useCurrentCycleService();
  const { setAlert, hideAlert } = useAlert();
  const { refreshDashboard } = useDashboardResults();

  async function getCycleUsers(cycleId: number): Promise<FilteredUser[]> {
    try {
      const cycleUsersResponse = await axiosPrivate.get(
        `/user_metrics/cycle_users/${cycleId}`
      );
      let cycleUsersData: FilteredUser[] = cycleUsersResponse.data;
      cycleUsersData.sort((userA, userB) => userA.userId - userB.userId);
      if (!cycleUsersData.length) {
        setAlert("Cycle doesn't have any users", "warning");
        return [];
      }
      return cycleUsersData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function getUserCycles(userId: number): Promise<CycleType[]> {
    if (!userId) return [];
    try {
      const userCyclesDataResponse = await axiosPrivate.get(
        `/user_metrics/user_cycles/${userId}`
      );

      let userCyclesData: CycleType[] = userCyclesDataResponse.data;
      userCyclesData.sort((cycleA, cycleB) => {
        return (
          new Date(cycleB.startDate).getTime() -
          new Date(cycleA.startDate).getTime()
        );
      });

      userCyclesData = userCyclesData.map((cycle) => {
        return {
          ...cycle,
          startDate: new Date(cycle.startDate).toDateString(),
        };
      });

      if (!userCyclesData.length) {
        setAlert("User is not in any cycles", "warning");
        return [];
      }

      return userCyclesData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function getCycleUserMetrics(
    userId: number,
    cycleId: number
  ): Promise<DashboardResultsType[]> {
    try {
      if (cycleId === 0) {
        if (currentCycle?.cycleId) {
          cycleId = currentCycle.cycleId ?? cycleId;
        }
      }

      const userCycleMetricsResponse = await axiosPrivate(
        `/user_metrics?userId=${userId}&cycleId=${cycleId}`
      );
      let userCycleMetricsData: DashboardResultsType[] =
        userCycleMetricsResponse.data;
      userCycleMetricsData.sort(
        (metricA, metricsB) => metricA.metricId - metricsB.metricId
      );

      if (!userCycleMetricsData.length) {
        setAlert("Could not get user metrics");
        return [];
      }

      return userCycleMetricsData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function getRankings(): Promise<Ranking[]> {
    const { cycleId } = currentCycle;
    let currentCycleId: number = cycleId;

    if (!currentCycleId) {
      const currentCycle: CurrentCycleType = await getCurrentCycle();
      if (currentCycle.cycleId === 0) return [];
      currentCycleId = currentCycle.cycleId;
    }

    try {
      const response = await axiosPrivate.get(
        `/user_metrics/rankings/${currentCycleId}`
      );

      const rankingData: RankingData[] = response.data;

      let rankingObj: RankingObj = {};
      for (let data of rankingData) {
        const { email, value, weight, threshold } = data;

        if (!(email in rankingObj)) {
          rankingObj[email] = {
            email,
            score: 0,
          };
        }
        let currentSum = (value / threshold) * weight;
        rankingObj[email].score += currentSum;
      }

      const sortedRanks = Object.values(rankingObj).sort(
        (rankingA, rankingB) => rankingB.score - rankingA.score
      );

      return sortedRanks;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function createUserCycleMetrics(
    criteriaData: MetricsCriterionId[],
    newCycleData: CycleType
  ) {
    const { metrics, users } = state;
    const { cycleId } = newCycleData;

    const metricItems = metrics.map((metric, index) => {
      const { metricId } = metric;
      const metricCriterionId = criteriaData[index];
      return { metricId, metricCriterionId };
    });

    const createCycleMetricsOptions = {
      url: "/user_metrics/createcycle",
      method: "post",
      data: {
        cycleId,
        metricItems,
        userIds: Array.from(users),
      },
    };

    await axiosPrivate(createCycleMetricsOptions);
  }

  async function updateDashboardUserMetrics({
    updated,
  }: UseUpdateDashboardResults) {
    hideAlert();
    try {
      const updateUserMetricsOptions = {
        url: "/user_metrics/dashboard",
        method: "patch",
        data: { updated },
      };

      let promiseArray = [];

      if (updated.length > 0)
        promiseArray.push(await axiosPrivate(updateUserMetricsOptions));

      await Promise.all(promiseArray);
      setAlert("Metrics Updated", "success");
      refreshDashboard();
    } catch (err) {
      handleError(err);
    }
  }

  return {
    getRankings,
    getCycleUsers,
    getUserCycles,
    getCycleUserMetrics,
    createUserCycleMetrics,
    updateDashboardUserMetrics,
  };
};

export default useUserMetricService;
