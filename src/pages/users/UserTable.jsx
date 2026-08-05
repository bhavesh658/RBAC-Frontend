import { useNavigate } from "react-router-dom";

function UserTable({ users, onEdit, onDelete }) {
  const navigate = useNavigate(); // Page change karne ke liye hook

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-nowrap">
          <thead className="table-light">
            <tr>
              <th className="py-3 px-4 text-muted small text-uppercase">User</th>
              <th className="py-3 text-muted small text-uppercase">Contact</th>
              <th className="py-3 text-muted small text-uppercase">Department</th>
              <th className="py-3 text-muted small text-uppercase">Role</th>
              <th className="py-3 text-muted small text-uppercase">Status</th>
              <th className="py-3 text-end px-4 text-muted small text-uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="border-top-0">
            {users.length > 0 ? (
              users.map((user) => {
                const fullName = user.fullName || `${user.firstName} ${user.lastName || ""}`;
                return (
                  <tr key={user._id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                          style={{ width: "40px", height: "40px", backgroundColor: "#FF6600" }}
                        >
                          {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="fw-semibold text-dark">{fullName}</span>
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="d-flex flex-column">
                        <span className="text-dark small"><i className="bi bi-envelope text-muted me-1"></i>{user.email}</span>
                        {user.phone && <span className="text-muted small mt-1"><i className="bi bi-telephone text-muted me-1"></i>{user.phone}</span>}
                      </div>
                    </td>

                    <td className="py-3">
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {user.department?.name || user.department || "-"}
                      </span>
                    </td>

                    <td className="py-3 fw-medium text-secondary">
                      {user.role?.name || user.role || "-"}
                    </td>

                    <td className="py-3">
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          user.isActive
                            ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                            : "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
                        }`}
                      >
                        {user.isActive ? "🟢 Active" : "🔴 Inactive"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-end">
                      
                      {/* Naya View Button */}
                      <button
                        className="btn btn-light btn-sm rounded-circle me-2 text-success shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => navigate(`/users/${user._id}`)} 
                        title="View Details"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>

                      {/* Purana Edit Button */}
                      <button
                        className="btn btn-light btn-sm rounded-circle me-2 text-primary shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => onEdit(user)}
                        title="Edit User"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>

                      {/* Purana Toggle Status Button */}
                      <button
                        className="btn btn-light btn-sm rounded-circle text-danger shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => onDelete(user)}
                        title="Toggle Status"
                      >
                        <i className={user.isActive ? "bi bi-person-x-fill" : "bi bi-person-check-fill"}></i>
                      </button>

                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="text-muted mb-2"><i className="bi bi-inbox fs-1"></i></div>
                  <h6 className="fw-semibold">No Users Found</h6>
                  <p className="text-muted small mb-0">Try adjusting your search criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card-footer bg-white border-top py-3 text-muted small text-center">
        Showing {users.length} {users.length === 1 ? "user" : "users"} on this page.
      </div>
    </div>
  );
}

export default UserTable;