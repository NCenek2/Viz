import { CreateCycleProvider } from "../../../../contexts/CreateCycleContext";
import CreateCycle from "./CreateCycle";

const CreateCycleWrapper = () => {
  return (
    <CreateCycleProvider>
      <CreateCycle />
    </CreateCycleProvider>
  );
};

export default CreateCycleWrapper;
