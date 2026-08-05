import Header from "./Header";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Header />

        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;