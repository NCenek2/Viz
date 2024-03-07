import { UsersType } from "../../../../contexts/Role2Context";
import useUserService from "../../../../hooks/services/useUserService";

const AccessItem = ({ userId, email, role }: UsersType) => {
  const { changeAccess } = useUserService();
  const isAdmin = role > 1;

  const toggleAdmin = async () => {
    changeAccess(!isAdmin, userId, email);
  };
  return (
    <div className="access-items">
      <div>
        <input
          type="checkbox"
          className="form-check-input my-check"
          id={userId.toString()}
          checked={isAdmin}
          onChange={toggleAdmin}
        />
      </div>
      <div>
        <p className="access-email">{email}</p>
      </div>
    </div>
  );
};

export default AccessItem;
