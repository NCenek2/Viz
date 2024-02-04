import AccessItem from "./AccessItem";
import useRole2 from "../../../../hooks/useRole2";

const Access = () => {
  const { users } = useRole2();

  return (
    <>
      <div className="center-fixed-container access-container">
        <h2 className="mb-3">Admin Access</h2>
        <div className="users-container">
          {users.map((user) => {
            const { user_id } = user;
            return <AccessItem key={user_id} {...user} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Access;
