import { ChangeEvent, useEffect, useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
import useDashboard from "../../../../hooks/useDashboard";
import UserReport from "./UserReport";
import { CyclesType } from "../../../../contexts/Role1Context";
import useHandleError from "../../../../hooks/useHandleError";

const UserReports = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { auth } = useAuth();
  const { selectedCycle, setSelectedCycle } = useDashboard();
  const [filteredCycles, setFilteredCycles] = useState<CyclesType[]>([]);
  const [showReport, setShowReport] = useState(false);

  async function getCycles() {
    if (!auth?.userInfo?.user_id) return;
    try {
      const cyclesResponse = await axiosPrivate.get(
        `/reports/user/${auth.userInfo.user_id}`
      );

      let cyclesData: CyclesType[] = cyclesResponse.data;
      cyclesData.sort((cycleA, cycleB) => {
        return (
          new Date(cycleB.start_date).getTime() -
          new Date(cycleA.start_date).getTime()
        );
      });

      cyclesData = cyclesData.map((cycle) => {
        return {
          ...cycle,
          start_date: new Date(cycle.start_date).toDateString(),
        };
      });
      setFilteredCycles(cyclesData);
    } catch (err) {
      handleError(err);
    }
  }

  const getReport = () => {
    if (!selectedCycle) return;
    setShowReport(true);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setShowReport(false);
    const { value } = e.target;
    let newChange = parseInt(value);
    if (!newChange) newChange = 0;
    setSelectedCycle(newChange);
  };

  useEffect(() => {
    getCycles();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Reports</h2>
          <button className="btn add-color btn-search" onClick={getReport}>
            View
          </button>
        </div>
        <div className="d-flex px-2">
          <select
            className="form-select form-select-md mb-3 me-2"
            aria-label=".form-select-md example"
            onChange={handleChange}
          >
            <option value={"0"}>Cycles</option>
            {filteredCycles.map((cycle) => {
              const { cycle_id, start_date } = cycle;
              return (
                <option key={cycle_id} value={cycle_id}>
                  {start_date}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {showReport && <UserReport />}
    </>
  );
};

export default UserReports;
