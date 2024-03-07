import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import { Route, Routes } from "react-router-dom";
import VizApp from "./VizApp";

const VizIndex = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<VizApp />} />
        </Routes>
      </AuthProvider>
    </AlertProvider>
  );
};

export default VizIndex;
