import React from 'react';

const DashboardHeader = ({ user, onRefresh }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h3 className="fw-bold text-dark mb-1">Overview Dashboard</h3>
        <p className="text-muted small mb-0">Welcome back, {user?.firstName || "Admin"}! Here is your system summary.</p>
      </div>
      
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn btn-light border rounded-circle d-flex justify-content-center align-items-center text-secondary shadow-sm"
          style={{ width: "42px", height: "42px", transition: "0.3s" }}
          onClick={onRefresh}
          title="Sync Latest Data"
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#FF6600";
            e.currentTarget.style.borderColor = "#FF6600";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#6c757d";
            e.currentTarget.style.borderColor = "#dee2e6";
          }}
        >
          <i className="bi bi-arrow-clockwise fs-5"></i>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;