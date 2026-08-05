import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/auth";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border" style={{ color: "#FF6600" }} role="status"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccessMsg("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to change password. Please check your old password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-md-11 col-lg-10">
          
          {/* Top Actions */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              className="btn btn-white bg-white shadow-sm d-flex align-items-center gap-2 fw-semibold rounded-pill px-4"
              onClick={() => navigate(-1)} 
              style={{ transition: "0.2s", border: "1px solid #eee" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
            >
              <i className="bi bi-arrow-left text-muted"></i> Back
            </button>

            {/* 🚀 Change Password Button */}
            <button 
              className="btn text-white shadow-sm d-flex align-items-center gap-2 fw-semibold rounded-pill px-4"
              onClick={() => { setShowPasswordModal(true); setErrorMsg(""); setSuccessMsg(""); }}
              style={{ backgroundColor: "#FF6600", transition: "all 0.2s" }}
            >
              <i className="bi bi-key-fill"></i> Change Password
            </button>
          </div>

          <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
            
            <div 
              style={{ 
                height: "160px", 
                backgroundColor: "#FF6600",
                backgroundImage: `
                  radial-gradient(circle at 10% 20%, rgba(255, 170, 80, 0.8) 0%, transparent 50%),
                  radial-gradient(circle at 90% 80%, rgba(200, 70, 0, 0.9) 0%, transparent 50%),
                  url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")
                `,
                backgroundSize: "100% 100%, 100% 100%, 20px 20px",
                position: "relative"
              }}
            >
              <div 
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "40px",
                  background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))"
                }}
              ></div>
            </div>

            <div className="card-body position-relative px-4 px-md-5 pb-5 pt-0">
              
              {/* Header Section (Avatar + Name + Status) */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end" style={{ marginTop: "-65px" }}>
                
                <div className="d-flex flex-column flex-md-row align-items-md-end gap-3 mb-3 mb-md-0">
                  
                  <div 
                    className="d-flex align-items-center justify-content-center text-white fw-bold rounded-circle position-relative"
                    style={{ 
                      width: "120px", 
                      height: "120px", 
                      fontSize: "48px",
                      backgroundColor: "#2C3E50",
                      border: "6px solid #ffffff",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      zIndex: 2
                    }}
                  >
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                    <span 
                      className={`position-absolute bottom-0 end-0 rounded-circle border border-3 border-white ${user.isActive ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: "24px", height: "24px", marginBottom: "8px", marginRight: "8px" }}
                    ></span>
                  </div>
                  
                  <div className="mb-2 ms-md-2 mt-3 mt-md-0">
                    <h2 className="fw-black mb-0 text-dark" style={{ letterSpacing: "-0.5px", fontWeight: "900" }}>
                      {user.fullName || `${user.firstName} ${user.lastName}`}
                    </h2>
                    <p className="text-muted mb-0 d-flex align-items-center gap-2 fw-medium">
                      <i className="bi bi-envelope-at" style={{ color: "#FF6600" }}></i> {user.email}
                    </p>
                  </div>
                </div>

                <div className="mb-3 mt-2 mt-md-0">
                  <span 
                    className={`badge ${user.isActive ? 'bg-success-subtle text-success border-success-subtle' : 'bg-danger-subtle text-danger border-danger-subtle'} px-3 py-2 rounded-pill border shadow-sm fs-6 fw-semibold d-flex align-items-center gap-2`}
                  >
                    <i className={`bi ${user.isActive ? 'bi-shield-check' : 'bi-shield-x'}`}></i>
                    {user.isActive ? "Account Active" : "Account Suspended"}
                  </span>
                </div>
              </div>

              <hr className="text-muted opacity-10 my-4" />

              {/* Information Grid */}
              <div className="row g-4">
                
                {/* 1. Organizational Info Section */}
                <div className="col-12 col-lg-6">
                  <div className="card h-100 border shadow-none bg-light rounded-4">
                    <div className="card-body p-4">
                      <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                        <i className="bi bi-building me-2" style={{ color: "#FF6600" }}></i> Organization Details
                      </h6>
                      <ul className="list-group list-group-flush bg-transparent">
                        <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-bottom border-light">
                          <span className="text-muted fw-medium">Department</span>
                          <span className="fw-bold text-dark">{user.department?.name || "N/A"}</span>
                        </li>
                        <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-bottom border-light">
                          <span className="text-muted fw-medium">Dept Code</span>
                          <span className="badge bg-white text-dark border shadow-sm px-2 py-1">{user.department?.code || "N/A"}</span>
                        </li>
                        <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-0">
                          <span className="text-muted fw-medium">Assigned Role</span>
                          <span className="fw-bold px-3 py-1 rounded-pill shadow-sm" style={{ backgroundColor: "#FF6600", color: "#fff", fontSize: "0.85rem" }}>
                            {user.role?.name || "N/A"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. Contact & Activity Section */}
                <div className="col-12 col-lg-6">
                  <div className="card h-100 border shadow-none bg-light rounded-4">
                    <div className="card-body p-4">
                      <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                        <i className="bi bi-activity me-2" style={{ color: "#FF6600" }}></i> Contact & Activity
                      </h6>
                      <ul className="list-group list-group-flush bg-transparent">
                        <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-bottom border-light">
                          <span className="text-muted fw-medium">Phone Number</span>
                          <span className="fw-bold text-dark">{user.phone ? user.phone : "Not Provided"}</span>
                        </li>
                        <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-bottom border-light">
                          <span className="text-muted fw-medium">Last Login</span>
                          <span className="fw-semibold text-dark small text-end">{formatDate(user.lastLoginAt)}</span>
                        </li>
                        <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-0">
                          <span className="text-muted fw-medium">Account Created</span>
                          <span className="fw-semibold text-dark small text-end">{formatDate(user.createdAt)}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. Permissions Section */}
                <div className="col-12">
                  <div className="card border shadow-none bg-white rounded-4">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-uppercase text-secondary mb-0" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                          <i className="bi bi-shield-lock-fill me-2" style={{ color: "#FF6600" }}></i> Access Permissions
                        </h6>
                        <span className="badge rounded-pill" style={{ backgroundColor: "#FF6600" }}>
                          {user.role?.permissions?.length || 0} Permissions
                        </span>
                      </div>
                      
                      <div className="bg-light p-3 p-md-4 rounded-4 border border-light">
                        {user.role?.permissions && user.role.permissions.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {user.role.permissions.map((perm, index) => (
                              <span 
                                key={index} 
                                className="badge bg-white text-dark shadow-sm px-3 py-2 d-flex align-items-center gap-2"
                                style={{ fontSize: "12px", fontWeight: "600", border: "1px solid #e0e0e0" }}
                              >
                                <i className="bi bi-check2-circle" style={{ color: "#FF6600", fontSize: "14px" }}></i>
                                {typeof perm === 'string' ? perm.replace(/_/g, ' ').toUpperCase() : perm.name || perm}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted mb-0 fst-italic small"><i className="bi bi-info-circle me-1"></i> No specific permissions assigned to this role.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Meta Data */}
              <div className="mt-5 pt-3 border-top text-center">
                <span className="text-muted" style={{ fontSize: "13px" }}>
                  <i className="bi bi-clock-history me-1"></i> Profile Last Updated: <strong className="text-dark">{formatDate(user.updatedAt)}</strong>
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Change Password Modal */}
      {showPasswordModal && (
        <>
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                
                <div className="modal-header border-bottom-0 pt-4 px-4">
                  <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-key" style={{ color: "#FF6600" }}></i> Change Password
                  </h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowPasswordModal(false)}></button>
                </div>
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="modal-body px-4 py-3">
                    
                    {errorMsg && (
                      <div className="alert alert-danger py-2 small mb-3 rounded-3">
                        <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
                      </div>
                    )}
                    
                    {successMsg && (
                      <div className="alert alert-success py-2 small mb-3 rounded-3">
                        <i className="bi bi-check-circle-fill me-1"></i> {successMsg}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Current Password</label>
                      <input 
                        type="password" 
                        required 
                        className="form-control bg-light shadow-none" 
                        placeholder="Enter old password"
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">New Password</label>
                      <input 
                        type="password" 
                        required 
                        className="form-control bg-light shadow-none" 
                        placeholder="Enter new password (min 6 chars)"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Confirm New Password</label>
                      <input 
                        type="password" 
                        required 
                        className="form-control bg-light shadow-none" 
                        placeholder="Re-enter new password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="modal-footer border-top-0 px-4 pb-4">
                    <button 
                      type="button" 
                      className="btn btn-light rounded-pill px-4 fw-semibold border shadow-sm" 
                      onClick={() => setShowPasswordModal(false)} 
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" 
                      style={{ backgroundColor: "#FF6600" }} 
                      disabled={loading}
                    >
                      {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : "Update Password"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </div>
  );
}

export default Profile;