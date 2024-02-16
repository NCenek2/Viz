import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useRole2 from "../../../../hooks/useRole2";
import { UsersType } from "../../../../contexts/Role2Context";
import { useAlert } from "../../../../hooks/useAlert";
import useHandleError from "../../../../hooks/useHandleError";

const AccessItem = ({ userId, email, role }: UsersType) => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { refreshRole2 } = useRole2();
  const { setAlert } = useAlert();
  const [checked, setChecked] = useState(role > 1);

  const toggleAdmin = async (isAdmin: boolean) => {
    const role = isAdmin ? 2 : 1;

    try {
      await axiosPrivate({
        url: `/users/access/${userId}`,
        method: "patch",
        data: { role },
      });
      refreshRole2();
      if (isAdmin === true) {
        setAlert(`Admin permissions given to ${email}`, "success");
      } else {
        setAlert(`Removed permissions from ${email}`, "success");
      }
      setChecked(isAdmin === true);
    } catch (err) {
      handleError(err);
    }
  };

  const handleChecked = () => {
    let isAdmin = !checked;
    toggleAdmin(isAdmin);
  };

  return (
    <div className="access-items">
      <div>
        <input
          type="checkbox"
          className="form-check-input my-check"
          id={userId.toString()}
          checked={checked}
          onChange={handleChecked}
        />
      </div>
      <div>
        <p className="access-email">{email}</p>
      </div>
    </div>
  );
};

export default AccessItem;
