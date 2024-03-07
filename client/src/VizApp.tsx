import "./VizInit.css";
import "./Viz.css";
import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/NotFound";
import RequireRole from "./components/RequireRole";
import Unauthorized from "./components/authenticated/Unauthorized";
import Access from "./components/authenticated/role2/Access/Access";
import CreateCycleWrapper from "./components/authenticated/role2/CreateCycle/CreateCycleWrapper";
import ChangeCycleWrapper from "./components/authenticated/role2/ChangeCycle/ChangeCycleWrapper";
import DashboardWrapper from "./components/authenticated/role2/Dashboard/DashboardWrapper";
import MetricsWrapper from "./components/authenticated/role2/Metrics/MetricsWrapper";
import Rankings from "./components/authenticated/role1/Rankings";
import AppDataWrapper from "./components/authenticated/AppDataWrapper";
import Role2Wrapper from "./components/authenticated/role2/Role2Wrapper";
import ReportsWrapper from "./components/authenticated/role2/Reports/ReportsWrapper";
import UserReportsWrapper from "./components/authenticated/role2/UserReports/UserWrapper";
import ResetPassword from "./components/ResetPassword";

function VizApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppDataWrapper />}>
              <Route path="/reports" element={<UserReportsWrapper />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route element={<RequireRole roleLimit={2} />}>
                <Route element={<Role2Wrapper />}>
                  <Route path="/r2/dashboard" element={<DashboardWrapper />} />
                  <Route path="/r2/access" element={<Access />} />
                  <Route
                    path="/r2/createcycle"
                    element={<CreateCycleWrapper />}
                  />
                  <Route
                    path="/r2/changecycle"
                    element={<ChangeCycleWrapper />}
                  />
                  <Route path="/r2/reports" element={<ReportsWrapper />} />
                  <Route path="/r2/metrics" element={<MetricsWrapper />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default VizApp;
