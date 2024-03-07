import { ChangeEvent, useEffect, useState } from "react";
import useDashboard from "../../../../hooks/useDashboard";
import UserReport from "./UserReport";
import { CycleType } from "../../../../contexts/Role1Context";
import useReportService from "../../../../hooks/services/useReportService";

const UserReports = () => {
  const { selectedCycle, setSelectedCycle } = useDashboard();
  const [filteredCycles, setFilteredCycles] = useState<CycleType[]>([]);
  const [showReport, setShowReport] = useState(false);
  const { getUserReportCycles } = useReportService();

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
    const handleUserCycleReports = async () => {
      const userReportCycles = await getUserReportCycles();
      setFilteredCycles(userReportCycles);
    };
    handleUserCycleReports();
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
              const { cycleId, startDate } = cycle;
              return (
                <option key={cycleId} value={cycleId}>
                  {startDate}
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
