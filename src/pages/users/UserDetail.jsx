import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getUserById } from "../../services/user";

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);

        console.log("API Response for getUserById:", response);

        if (response && response.success && response.data) {
          setUser(response.data);
        } else if (response && response._id) {
          setUser(response);
        } else {
          setError("Invalid user data received.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: "80vh" }}>
          <div className="spinner-border text-primary" role="status"></div>
          <span className="ms-3 fw-semibold text-muted">Loading user profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger m-4 rounded-4 shadow-sm border-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error || "User not found"}
          <button className="btn btn-link fw-bold ms-3" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </DashboardLayout>
    );
  }

  const department = user.department || {};
  const role = user.role || {};
  const permissions = role.permissions || [];

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-3 flex-grow-1 w-100" style={{ overflowX: "hidden" }}>

        <button
          className="btn btn-white bg-white mb-4 d-flex align-items-center gap-2 fw-semibold shadow-sm border rounded-pill px-4"
          onClick={() => navigate("/users")}
        >
          <i className="bi bi-arrow-left"></i> Back to User List
        </button>

        <div className="card shadow-lg border-0 rounded-4 overflow-visible mb-4">

          <div className="rounded-top-4" style={{ backgroundColor: "#FF6600", height: "120px", position: "relative" }}>
            <div style={{ position: "absolute", top: "15px", right: "20px" }}>
              <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'} px-3 py-2 rounded-pill shadow-sm fs-6 border border-white border-2`}>
                {user.isActive ? "🟢 Active Account" : "🔴 Inactive Account"}
              </span>
            </div>
          </div>

          <div className="card-body position-relative px-4 pb-4 pt-0 bg-white rounded-bottom-4">

            <div
              className="position-absolute d-flex align-items-center justify-content-center text-white shadow-lg fw-bold rounded-circle"
              style={{
                width: "110px", height: "110px", backgroundColor: "#2c3e50",
                top: "-55px", left: "20px", fontSize: "40px", border: "5px solid #fff", zIndex: 2
              }}
            >
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="mt-5 pt-3 ps-sm-3">
              <h2 className="fw-bold mb-1 text-dark">
                {user.fullName || `${user.firstName} ${user.lastName || ""}`}
              </h2>
              <div className="d-flex flex-wrap align-items-center gap-4 text-muted mt-2">
                <span><i className="bi bi-envelope-fill me-2 text-primary"></i>{user.email}</span>
                {user.phone && <span><i className="bi bi-telephone-fill me-2 text-success"></i>{user.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">

          <div className="col-12 col-lg-6">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                <h6 className="fw-bold text-uppercase text-secondary mb-0">
                  <i className="bi bi-building-fill me-2 text-primary"></i>Department Information
                </h6>
              </div>
              <div className="card-body px-4 py-3">
                {department._id ? (
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom-dashed">
                      <span className="text-muted fw-medium">Name</span>
                      <span className="fw-bold text-dark">{department.name}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom-dashed">
                      <span className="text-muted fw-medium">Department Code</span>
                      <span className="badge bg-light text-dark border border-secondary px-2 py-1">{department.code}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom-dashed">
                      <span className="text-muted fw-medium">Description</span>
                      <span className="text-dark text-end ms-4">{department.description || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                      <span className="text-muted fw-medium">Status</span>
                      <span className={`badge ${department.isActive ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${department.isActive ? 'success' : 'danger'} border-0`}>
                        {department.isActive ? "Active Dept" : "Inactive Dept"}
                      </span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted mb-0 fst-italic">No department assigned to this user.</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                <h6 className="fw-bold text-uppercase text-secondary mb-0">
                  <i className="bi bi-shield-shaded me-2 text-success"></i>Role Configuration
                </h6>
              </div>
              <div className="card-body px-4 py-3">
                {role._id ? (
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom-dashed">
                      <span className="text-muted fw-medium">Assigned Role</span>
                      <span className="fw-bold text-primary">{role.name}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom-dashed">
                      <span className="text-muted fw-medium">Role Type</span>
                      {role.isSystemRole ? (
                        <span className="badge bg-warning text-dark"><i className="bi bi-star-fill me-1"></i> System Role</span>
                      ) : (
                        <span className="badge bg-secondary">Custom Role</span>
                      )}
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom-dashed">
                      <span className="text-muted fw-medium">Description</span>
                      <span className="text-dark text-end ms-4">{role.description || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                      <span className="text-muted fw-medium">Total Permissions</span>
                      <span className="fw-bold text-dark">{permissions.length} Assigned</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted mb-0 fst-italic">No role assigned to this user.</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Permissions Section */}
          {permissions.length > 0 && (
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold text-uppercase text-secondary mb-0">
                    <i className="bi bi-key-fill me-2 text-warning"></i>Access Permissions ({permissions.length})
                  </h6>
                </div>
                <div className="card-body px-4 py-4 bg-light rounded-bottom-4">
                  <div className="d-flex flex-wrap gap-2">
                    {permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="badge bg-white text-dark border shadow-sm px-3 py-2"
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        {perm.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 bg-dark text-white mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-uppercase text-white-50 mb-4">
                  <i className="bi bi-activity me-2"></i>System Audit Logs
                </h6>
                <div className="row g-4 font-monospace" style={{ fontSize: "13px" }}>

                  {/* <div className="col-md-6 col-lg-3">
                    <div className="text-white-50 mb-1">Created By</div>
                    <div className="text-warning text-break">{user.createdBy || "System"}</div>
                  </div> */}
                  <div className="col-md-6 col-lg-3">
                    <div className="text-white-50 mb-1">Account Created At</div>
                    <div className="text-white">{formatDate(user.createdAt)}</div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="text-white-50 mb-1">Last System Login</div>
                    <div className="text-success fw-bold">{formatDate(user.lastLoginAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDetail;