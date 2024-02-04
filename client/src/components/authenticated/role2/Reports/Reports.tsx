import { ChangeEvent, useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useDashboard from "../../../../hooks/useDashboard";
import { useAlert } from "../../../../hooks/useAlert";
import useRole1 from "../../../../hooks/useRole1";
import useRole2 from "../../../../hooks/useRole2";
import Report from "./Report";
import useHandleError from "../../../../hooks/useHandleError";

type FilteredCycle = {
  cycle_id: number;
  start_date: string;
};

const Reports = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setAlert } = useAlert();
  const handleError = useHandleError();
  const { cycles } = useRole1();
  const { users } = useRole2();
  const { selectedCycle, setSelectedCycle, selectedUser, setSelectedUser } =
    useDashboard();
  const [search, setSearch] = useState(false);
  const [filteredCycles, setFilteredCycles] = useState<FilteredCycle[] | null>(
    []
  );

  async function updateCycles(user_id: number) {
    if (!user_id) return;
    try {
      const userCyclesDataResponse = await axiosPrivate.get(
        `/metric/user_cycles/${user_id}`
      );

      let userCyclesData: FilteredCycle[] = userCyclesDataResponse.data;
      userCyclesData.sort((cycleA, cycleB) => {
        return (
          new Date(cycleB.start_date).getTime() -
          new Date(cycleA.start_date).getTime()
        );
      });

      userCyclesData = userCyclesData.map((cycle) => {
        return {
          ...cycle,
          start_date: new Date(cycle.start_date).toDateString(),
        };
      });

      if (!userCyclesData.length) {
        setFilteredCycles(null);
        return setAlert("User is not in any cycles", "warning");
      }

      return setFilteredCycles(userCyclesData);
    } catch (err) {
      handleError(err);
    }
  }

  function reset(): boolean {
    setSelectedCycle((p) => 0);
    setSelectedUser((p) => 0);
    setFilteredCycles((p) => []);
    return true;
  }

  const checkFilters = (user_id: number, cycle_id: number) => {
    setSearch(false);

    if (user_id === 0 && cycle_id === 0) {
      return reset();
    }
    return false;
  };

  const handleSearch = () => {
    if (!selectedCycle || !selectedUser) return;
    setSearch(true);
  };

  const handleCycle = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let newCycle = parseInt(value);
    if (!newCycle) newCycle = 0;

    const didReset = checkFilters(selectedUser, newCycle);
    if (didReset) return;

    setSelectedCycle((p) => newCycle);

    if (newCycle === 0) return updateCycles(selectedUser);
  };

  const handleUser = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let newUser = parseInt(value);
    if (!newUser) newUser = 0;

    const didReset = checkFilters(newUser, selectedCycle);
    if (didReset) return;

    setSelectedUser((p) => newUser);
    updateCycles(newUser);
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Reports</h2>
          <button className="btn add-color btn-search" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="d-flex px-2">
          <select
            className="form-select form-select-md mb-3 me-2"
            aria-label=".form-select-md example"
            onChange={handleCycle}
          >
            <option value={"0"}>Cycles</option>
            {filteredCycles === null
              ? ""
              : filteredCycles.length
              ? filteredCycles.map((cycle) => {
                  const { cycle_id, start_date } = cycle;
                  return (
                    <option key={cycle_id} value={cycle_id}>
                      {start_date}
                    </option>
                  );
                })
              : cycles.map((cycle) => {
                  const { cycle_id, start_date } = cycle;
                  return (
                    <option key={cycle_id} value={cycle_id}>
                      {start_date}
                    </option>
                  );
                })}
          </select>

          <select
            className="form-select form-select-md mb-3"
            aria-label=".form-select-md example"
            onChange={handleUser}
          >
            <option value={"0"}>Users</option>
            {users.length
              ? users.map((user) => {
                  const { user_id, email } = user;
                  return (
                    <option key={user_id} value={user_id}>
                      {email}
                    </option>
                  );
                })
              : users.map((user) => {
                  const { user_id, email } = user;
                  return (
                    <option key={user_id} value={user_id}>
                      {email}
                    </option>
                  );
                })}
          </select>
        </div>
      </div>
      {search && <Report />}
    </>
  );
};

export default Reports;
