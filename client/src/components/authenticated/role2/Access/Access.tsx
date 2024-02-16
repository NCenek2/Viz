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
            const { userId } = user;
            return <AccessItem key={userId} {...user} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Access;
