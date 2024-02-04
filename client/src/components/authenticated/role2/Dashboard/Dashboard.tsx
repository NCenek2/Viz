import useDashboard from "../../../../hooks/useDashboard";
import { ChangeEvent, useState } from "react";
import DashboardResultsWrapper from "./DashboardResultsWrapper";
import useRole2 from "../../../../hooks/useRole2";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useAlert } from "../../../../hooks/useAlert";
import useRole1 from "../../../../hooks/useRole1";
import useHandleError from "../../../../hooks/useHandleError";

type FilteredUser = {
  user_id: number;
  email: string;
};

type FilteredCycle = {
  cycle_id: number;
  start_date: string;
};

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { cycles } = useRole1();
  const { users } = useRole2();
  const { setAlert } = useAlert();
  const { selectedCycle, setSelectedCycle, selectedUser, setSelectedUser } =
    useDashboard();
  const [search, setSearch] = useState(false);

  const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
  const [filteredCycles, setFilteredCycles] = useState<FilteredCycle[]>([]);

  async function updateUsers(cycle_id: number) {
    try {
      const cycleUsersResponse = await axiosPrivate.get(
        `/metric/cycle_users/${cycle_id}`
      );
      let cycleUsersData: FilteredUser[] = cycleUsersResponse.data;
      cycleUsersData.sort((userA, userB) => userA.user_id - userB.user_id);
      if (!cycleUsersData.length) {
        reset();
        return setAlert("Cycle doesn't have any users", "warning");
      }
      return setFilteredUsers(cycleUsersData);
    } catch (err) {
      handleError(err);
    }
  }

  async function updateCycles(user_id: number) {
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
        reset();
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
    setFilteredUsers((p) => []);
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

  const handleUser = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let newUser = parseInt(value);
    if (!newUser) newUser = 0;

    const didReset = checkFilters(newUser, selectedCycle);
    if (didReset) return;

    setSelectedUser((p) => newUser);

    if (newUser === 0) return updateUsers(selectedCycle);

    updateCycles(newUser);
  };

  const handleCycle = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let newCycle = parseInt(value);
    if (!newCycle) newCycle = 0;

    const didReset = checkFilters(selectedUser, newCycle);
    if (didReset) return;

    setSelectedCycle((p) => newCycle);

    if (newCycle === 0) return updateCycles(selectedUser);
    updateUsers(newCycle);
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <button className="btn btn-green btn-search" onClick={handleSearch}>
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
            {filteredCycles.length
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
            {filteredUsers.length
              ? filteredUsers.map((user) => {
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
      {search && <DashboardResultsWrapper />}
    </>
  );
};

export default Dashboard;
