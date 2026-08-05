import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext"; // 🚀 Added AuthContext
import { getUserComprehensiveReport } from "../../services/report";

function UserReport() {
  const { id: paramId } = useParams(); // URL se aane wali ID
  const { user } = useAuth(); // 🚀 Logged-in user ki details
  const navigate = useNavigate();

  // 🚀 Logic: Agar URL me ID hai toh wo lo, warna logged-in user ki ID use karo
  const targetId = paramId || user?._id || user?.id;

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date filters state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    if (!targetId) return; // Prevent call if no ID exists

    setLoading(true);
    setError(null);
    try {
      const response = await getUserComprehensiveReport(targetId, startDate, endDate);
      if (response?.success) {
        setReportData(response.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      fetchReport();
    } else {
      setLoading(false);
      setError("User ID not found.");
    }
  }, [targetId]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger p-4 rounded-4 shadow-sm border-0">{error}</div>
          <button className="btn btn-dark mt-3 px-4 rounded-pill" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { userDetails, attendanceSummary, workProfile } = reportData || {};

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-3">
        
        {/* Header & Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">User Comprehensive Report</h3>
            <p className="text-muted small mb-0">Detailed performance, attendance and work logs.</p>
          </div>
          {paramId && (
            <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill shadow-sm" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          )}
        </div>

        {/* Date Filter Bar */}
        <div className="card shadow-sm border-0 mb-4 rounded-4 bg-white">
          <div className="card-body p-3">
            <form onSubmit={handleFilterSubmit} className="row g-3 align-items-center">
              <div className="col-auto fw-semibold text-secondary">Filter by Date Range:</div>
              <div className="col-auto">
                <input 
                  type="date" 
                  className="form-control" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className="col-auto text-muted">to</div>
              <div className="col-auto">
                <input 
                  type="date" 
                  className="form-control" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn text-white fw-semibold rounded-pill px-4" style={{ backgroundColor: "#FF6600" }}>
                  Apply Filter
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden bg-white">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h4 className="fw-bold text-dark mb-1">{userDetails?.name}</h4>
                <p className="text-muted mb-3">{userDetails?.email}</p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    Department: {userDetails?.department}
                  </span>
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    Role: {userDetails?.role}
                  </span>
                  <span className={`badge px-3 py-2 rounded-pill ${userDetails?.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                    {userDetails?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white text-center h-100">
              <span className="text-muted small fw-bold text-uppercase tracking-wide">Total Days Present</span>
              <h1 className="fw-bold text-dark mt-2 mb-0 display-5">{attendanceSummary?.totalDaysPresent}</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white text-center h-100">
              <span className="text-muted small fw-bold text-uppercase tracking-wide">Total Hours Worked</span>
              <h1 className="fw-bold text-success mt-2 mb-0 display-5">{attendanceSummary?.totalHoursWorked}</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white text-center h-100">
              <span className="text-muted small fw-bold text-uppercase tracking-wide">Avg Hours / Day</span>
              <h1 className="fw-bold text-primary mt-2 mb-0 display-5">{attendanceSummary?.averageHoursPerDay}</h1>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Active Projects Table */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold text-dark mb-0">Assigned Projects ({workProfile?.activeProjectsCount || 0})</h5>
              </div>
              <div className="card-body p-4">
                {workProfile?.projects?.length > 0 ? (
                  <div className="list-group list-group-flush gap-2">
                    {workProfile.projects.map((proj, idx) => (
                      <div key={idx} className="list-group-item px-3 py-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">{proj.name}</h6>
                          <span className="badge bg-secondary">{proj.status}</span>
                        </div>
                        <span className="fw-bold text-primary">{proj.progress}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-folder-x fs-1 text-muted opacity-50 mb-2 d-block"></i>
                    <p className="text-muted small">No active projects assigned.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Tasks Table */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold text-dark mb-0">Pending Tasks ({workProfile?.pendingTasksCount || 0})</h5>
              </div>
              <div className="card-body p-4">
                {workProfile?.tasks?.length > 0 ? (
                  <div className="list-group list-group-flush gap-2">
                    {workProfile.tasks.map((task, idx) => (
                      <div key={idx} className="list-group-item px-3 py-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">{task.title}</h6>
                          <span className={`badge ${task.priority === 'High' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {task.priority} Priority
                          </span>
                        </div>
                        <span className="badge bg-white text-dark border shadow-sm">{task.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-check2-circle fs-1 text-muted opacity-50 mb-2 d-block"></i>
                    <p className="text-muted small">No pending tasks found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default UserReport;