import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useRole1 from "../../../hooks/useRole1";
import { CurrentCycleType } from "../../../contexts/Role1Context";
import useHandleError from "../../../hooks/useHandleError";

type RankingData = {
  email: string;
  startDate: string;
  value: number;
  weight: number;
  threshold: number;
};

type Ranking = {
  email: string;
  score: number;
};

type RankingObj = {
  [key: string]: Ranking;
};

const Rankings = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { currentCycle } = useRole1();
  const [rankings, setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    async function getRankings() {
      try {
        const { cycleId } = currentCycle;
        let currentCycleId: number = cycleId;

        if (!currentCycleId) {
          const response = await axiosPrivate.get("current_cycles");
          const currentCycle: CurrentCycleType = response.data;
          if (!currentCycle?.cycleId) return;
          currentCycleId = currentCycle.cycleId;
        }

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

        setRankings(sortedRanks);
      } catch (err) {
        handleError(err);
      }
    }

    getRankings();
  }, []);

  return (
    <>
      {!rankings.length ? (
        <div className="center-fixed-container ranking-container">
          <h2>No Rankings</h2>
        </div>
      ) : (
        <>
          <div className="center-fixed-container ranking-container">
            <h2 className="mb-2">Rankings</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((rank, index) => {
                    const { email } = rank;
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td className={`${index === 0 && "table-success"}`}>
                          {email}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Rankings;
