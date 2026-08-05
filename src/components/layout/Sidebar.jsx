import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import HasPermission from "../common/HasPermission";

function Sidebar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `nav-link fw-semibold p-2 mb-1 rounded transition-all ${isActive ? "text-white" : "text-dark"
      }`;
  };

  const getLinkStyle = (path) => {
    return location.pathname === path
      ? { backgroundColor: "#FF6600", transition: "0.3s" }
      : { transition: "0.3s" };
  };

  const menuItems = [
    {path: "/dashboard", label: "Dashboard", icon: "bi bi-speedometer2", permission: "dashboard.read"},
    { path: "/users", label: "Users", icon: "bi bi-people", permission: "users.read" },
    { path: "/departments", label: "Departments", icon: "bi bi-building", permission: "departments.read" },
    { path: "/roles", label: "Roles", icon: "bi bi-shield-lock", permission: "roles.read" },
    { path: "/permissions", label: "Permissions", icon: "bi bi-key", permission: "permissions.read" },
    { path: "/projects", label: "Projects", icon: "bi bi-briefcase", permission: "projects.read" },
    { path: "/tasks", label: "Tasks", icon: "bi bi-check2-square", permission: "tasks.read" },
    { path: "/leads", label: "Leads", icon: "bi bi-graph-up-arrow", permission: "leads.read" },
    { path: "/Activities", label: "Activities", icon: "bi bi-activity", permission: "activitylogs.read" },
    { path: "/Reports", label: "Reports", icon: "bi bi-bar-chart", permission: "reports.read" }
  ];

  return (
    <aside
      className="bg-white border-end p-3 shadow-sm"
      style={{
        width: "260px",
        minWidth: "260px",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        zIndex: 1000
      }}
    >
      <div className="d-flex flex-column align-items-center mb-4 mt-2 text-center">
        <img
          src={logo}
          alt="Company Logo"
          style={{ height: "80px", width: "auto", objectFit: "contain" }}
          className="mb-2"
        />
      </div>

      {/* Navigation List */}
      <ul className="nav flex-column">
        {menuItems.map((item, index) => (
          <HasPermission key={index} requiredPermission={item.permission}>
            <li className="nav-item">
              <Link
                to={item.path}
                className={getLinkClass(item.path)}
                style={getLinkStyle(item.path)}
                onMouseOver={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = "#FFF3EB";
                    e.target.style.color = "#FF6600";
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#212529";
                  }
                }}
              >
                <i className={`${item.icon} me-2 fs-5 alignment-icon`}></i>
                {item.label}
              </Link>
            </li>
          </HasPermission>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;