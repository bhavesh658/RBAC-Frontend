import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDailyReport } from "../../services/report";

function Reports() {
  const navigate = useNavigate();
  
  // Default date aaj ki set kar rahe hain
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDailyReport(selectedDate);
          const reportsData = response?.data || [];
      setReports(reportsData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  // Time format karne ka chota function
  const formatTime = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-3">
        
        {/* Header & Date Filter */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Daily Attendance Reports</h3>
            <p className="text-muted small mb-0">Overview of today's punch-in, punch-out and working hours.</p>
          </div>
          <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
            <label className="fw-semibold text-secondary small mb-0">Select Date:</label>
            <input 
              type="date" 
              className="form-control form-control-sm border-0 bg-light rounded-pill px-3" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              max={today}
            />
          </div>
        </div>

        {error && <div className="alert alert-danger rounded-4 shadow-sm border-0">{error}</div>}

        {/* Reports Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase tracking-wide">
                <tr>
                  <th className="py-3 px-4 fw-semibold border-0">Employee Name</th>
                  <th className="py-3 px-4 fw-semibold border-0">Department</th>
                  <th className="py-3 px-4 fw-semibold border-0 text-center">Punch In</th>
                  <th className="py-3 px-4 fw-semibold border-0 text-center">Punch Out</th>
                  <th className="py-3 px-4 fw-semibold border-0 text-center">Today's Hours</th>
                  <th className="py-3 px-4 fw-semibold border-0 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                    </td>
                  </tr>
                ) : reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report._id}>
                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="fw-bold text-dark">
                          {report.user?.firstName} {report.user?.lastName}
                        </div>
                        <div className="small text-muted">{report.user?.email}</div>
                      </td>
                      
                      {/* Department */}
                      <td className="px-4 py-3">
                        <span className="badge bg-light text-dark border px-2 py-1">
                          {report.user?.department?.name || "N/A"}
                        </span>
                      </td>

                      {/* Punch In */}
                      <td className="px-4 py-3 text-center fw-semibold text-success">
                        {formatTime(report.punchIn)}
                      </td>

                      {/* Punch Out */}
                      <td className={`px-4 py-3 text-center fw-semibold ${report.punchOut ? 'text-secondary' : 'text-danger'}`}>
                        {formatTime(report.punchOut)}
                      </td>

                      {/* Today's Hours */}
                      <td className="px-4 py-3 text-center">
                        <span className={`badge ${report.totalHours ? 'bg-primary' : 'bg-warning text-dark'} rounded-pill px-3 py-2`}>
                          {report.totalHours ? `${report.totalHours} hrs` : "Working..."}
                        </span>
                      </td>

                      {/* Action - Eye Button */}
                      <td className="px-4 py-3 text-end">
                        <button
                          onClick={() => navigate(`/reports/user/${report.user?._id}`)}
                          className="btn btn-sm btn-light rounded-circle shadow-sm border"
                          title="View Full Report"
                          style={{ width: "35px", height: "35px", transition: "0.2s" }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#FF6600"; e.currentTarget.style.color = "white"; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f8f9fa"; e.currentTarget.style.color = "black"; }}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-calendar-x fs-1 text-muted opacity-50 mb-3 d-block"></i>
                      <p className="text-muted fw-medium">No attendance records found for {new Date(selectedDate).toDateString()}.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;