import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
