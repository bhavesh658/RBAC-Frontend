import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDepartmentById, assignDepartmentHead } from "../../services/department"; 
import { getUsers } from "../../services/user"; 
import SearchableDropdown from "../../components/common/SearchableDropdown";

let departmentDetailCache = {};

function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(departmentDetailCache[id] || null);
  const [loading, setLoading] = useState(!departmentDetailCache[id]);
  const [error, setError] = useState("");

  const [showHeadModal, setShowHeadModal] = useState(false);
  const [headIdInput, setHeadIdInput] = useState(""); 
  const [isAssigning, setIsAssigning] = useState(false);
  const [usersList, setUsersList] = useState([]);

  const fetchDepartmentDetails = useCallback(async () => {
    try {
      if (!departmentDetailCache[id]) setLoading(true);
      const response = await getDepartmentById(id);
      
      if (response && response.success && response.data) {
        setDepartment(response.data);
        departmentDetailCache[id] = response.data; 
      } else if (response && response._id) {
        setDepartment(response); 
        departmentDetailCache[id] = response; 
      } else {
        setError("Invalid department data received.");
      }
    } catch (err) {
      if (!departmentDetailCache[id]) {
        setError(err.response?.data?.message || "Failed to load department details.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchDepartmentDetails();
  }, [id, fetchDepartmentDetails]);

  useEffect(() => {
    if (showHeadModal) {
      const fetchAllUsers = async () => {
        try {
          const res = await getUsers(1, 100); 
          if (res.success || res.data) setUsersList(res.data || []);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      };
      fetchAllUsers();
    } else {
      setHeadIdInput("");
    }
  }, [showHeadModal]);

  const formattedUsersForDropdown = useMemo(() => {
    return usersList.map(u => ({
      value: u._id,
      label: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`,
      subLabel: u.email,
      avatar: u.firstName ? u.firstName.charAt(0).toUpperCase() : "U"
    }));
  }, [usersList]);

  const handleAssignHead = async (e) => {
    e.preventDefault();
    if (!headIdInput) return alert("Please select a valid User from the dropdown.");
    try {
      setIsAssigning(true);
      await assignDepartmentHead(id, headIdInput); 
      await fetchDepartmentDetails(); 
      setShowHeadModal(false);
    } catch (err) {
      alert("Error assigning Head: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setIsAssigning(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="spinner-border text-primary" role="status"></div>
          <span className="ms-3 fw-semibold text-muted">Loading department details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !department) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger m-4 rounded-4 shadow-sm border-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error || "Department not found"}
          <button className="btn btn-link fw-bold ms-3" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </DashboardLayout>
    );
  }

  const head = department.head || null;
  const createdBy = department.createdBy || null;

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-2">
        
        <button 
          className="btn btn-white mb-4 d-flex align-items-center gap-2 fw-semibold shadow-sm border rounded-pill px-4"
          onClick={() => navigate("/departments")} 
        >
          <i className="bi bi-arrow-left"></i> Back to Departments
        </button>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
          <div style={{ backgroundColor: "#FF6600", height: "100px", position: "relative" }}>
             <div style={{ position: "absolute", top: "15px", right: "20px" }}>
                <span className={`badge ${department.isActive !== false ? 'bg-success' : 'bg-danger'} px-3 py-2 rounded-pill shadow-sm fs-6 border border-white border-2`}>
                  {department.isActive !== false ? "🟢 Active Department" : "🔴 Inactive Department"}
                </span>
             </div>
          </div>
          <div className="card-body position-relative px-4 pb-4 pt-0 bg-white">
            <div 
              className="position-absolute d-flex align-items-center justify-content-center text-white shadow fw-bold rounded-circle"
              style={{ width: "90px", height: "90px", backgroundColor: "#2c3e50", top: "-45px", fontSize: "35px", border: "4px solid #fff" }}
            >
              <i className="bi bi-building"></i>
            </div>
            <div className="mt-5 pt-1">
              <h3 className="fw-bold mb-1 text-dark">{department.name}</h3>
              <div className="d-flex align-items-center gap-3 text-muted mt-2">
                <span className="badge bg-light text-dark border px-2 py-1 fs-6">Code: {department.code}</span>
                <span className="small"><i className="bi bi-diagram-3-fill me-1 text-secondary"></i> Department Profile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          
          {/* Description Card */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom pt-3 pb-2 px-4">
                <h6 className="fw-bold text-uppercase text-secondary mb-0">
                  <i className="bi bi-info-circle-fill me-2 text-primary"></i>Description
                </h6>
              </div>
              <div className="card-body px-4 py-3">
                <p className="text-dark mb-0 fs-6">
                  {department.description || "No description provided for this department."}
                </p>
              </div>
            </div>
          </div>

          {/* HOD Card */}
          <div className="col-12 col-xl-6">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom pt-3 pb-2 px-4 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold text-uppercase text-secondary mb-0">
                  <i className="bi bi-person-badge-fill me-2 text-success"></i>Department Head (HOD)
                </h6>
                {head && (
                  <button 
                    className="btn btn-sm btn-light text-primary rounded-circle shadow-sm" 
                    onClick={() => setShowHeadModal(true)}
                    title="Change Head"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                )}
              </div>
              <div className="card-body px-4 py-4 d-flex align-items-center">
                {head ? (
                  <div className="d-flex align-items-center gap-3 w-100">
                    <div 
                      className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                      style={{ width: "50px", height: "50px", backgroundColor: "#FF6600", fontSize: "20px" }}
                    >
                      {head.firstName ? head.firstName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-1">
                        {head.fullName || `${head.firstName || ""} ${head.lastName || ""}`}
                      </h6>
                      <div className="text-muted small mb-1"><i className="bi bi-envelope-fill me-1"></i>{head.email}</div>
                      <div className="text-muted small"><i className="bi bi-hash me-1"></i>ID: <span className="font-monospace text-secondary">{head._id}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-100 py-3">
                    <i className="bi bi-person-plus text-muted" style={{ fontSize: "2rem" }}></i>
                    <p className="text-muted mt-2 mb-3 fst-italic">No Head assigned to this department yet.</p>
                    <button 
                      className="btn btn-sm fw-semibold text-white rounded-pill px-4 shadow-sm" 
                      style={{ backgroundColor: "#FF6600" }}
                      onClick={() => setShowHeadModal(true)}
                    >
                      Assign Head Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Created By Card */}
          <div className="col-12 col-xl-6">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom pt-3 pb-2 px-4">
                <h6 className="fw-bold text-uppercase text-secondary mb-0">
                  <i className="bi bi-person-gear me-2 text-warning"></i>Created By
                </h6>
              </div>
              <div className="card-body px-4 py-4 d-flex align-items-center">
                {createdBy ? (
                  <div className="d-flex align-items-center gap-3 w-100">
                    <div 
                      className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                      style={{ width: "50px", height: "50px", backgroundColor: "#6c757d", fontSize: "20px" }}
                    >
                      {createdBy.firstName ? createdBy.firstName.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-1">
                        {createdBy.fullName || `${createdBy.firstName || ""} ${createdBy.lastName || ""}`}
                      </h6>
                      <div className="text-muted small mb-1"><i className="bi bi-envelope-fill me-1"></i>{createdBy.email}</div>
                      <div className="text-muted small"><i className="bi bi-hash me-1"></i>ID: <span className="font-monospace text-secondary">{createdBy._id}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-100 py-3">
                    <p className="text-muted mb-0 fst-italic">System Generated / Creator info not available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 bg-dark text-white">
              <div className="card-body p-4">
                <h6 className="fw-bold text-uppercase text-white-50 mb-3">
                  <i className="bi bi-activity me-2"></i>System Metadata
                </h6>
                <div className="row g-3 font-monospace" style={{ fontSize: "12px" }}>
                  
                  <div className="col-md-3">
                    <div className="text-white-50 mb-1">Created At</div>
                    <div className="text-white">{formatDate(department.createdAt)}</div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-white-50 mb-1">Last Updated</div>
                    <div className="text-success fw-bold">{formatDate(department.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showHeadModal && (
        <>
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-visible">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="fw-bold text-dark mb-0">Assign Department Head</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowHeadModal(false)}></button>
                </div>
                
                <form onSubmit={handleAssignHead}>
                  <div className="modal-body px-4 py-4">
                    <p className="text-muted small mb-4">
                      Search for a user by name or email to assign them as the head of <strong>{department.name}</strong>.
                    </p>
                    
                    <div className="mb-4 position-relative">
                      <SearchableDropdown 
                        label="Select User"
                        placeholder="Search user by name or email..."
                        options={formattedUsersForDropdown}
                        value={headIdInput}
                        onSelect={(selectedId) => setHeadIdInput(selectedId)}
                      />
                    </div>
                  </div>

                  <div className="modal-footer border-top-0 pt-0 px-4 pb-4 mt-2">
                    <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={() => setShowHeadModal(false)}>
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn text-white rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center"
                      style={{ backgroundColor: "#FF6600" }}
                      disabled={isAssigning || !headIdInput} 
                    >
                      {isAssigning ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Assigning...</>
                      ) : "Save Changes"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </DashboardLayout>
  );
}

export default DepartmentDetail;