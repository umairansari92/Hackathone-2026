import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar remains fixed on the left */}
      <Sidebar />

      {/* Main Content Area filling the rest of the screen */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Placeholder */}
        <header className="bg-white shadow-sm h-16 shrink-0 flex items-center px-8 z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            Al Shifa Hospital
          </h1>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
