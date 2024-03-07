import { useEffect, useState } from "react";
import useUserMetricService, { Ranking } from "../../../hooks/services/useUserMetricService";

const Rankings = () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const { getRankings } = useUserMetricService();

  useEffect(() => {
    const handleRanking = async () => {
      const rnkings: Ranking[] = await getRankings();
      setRankings(rnkings);
    };

    handleRanking();
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
