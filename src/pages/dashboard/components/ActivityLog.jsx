import React from 'react';
import { Link } from 'react-router-dom'; 

const ActivityLog = ({ logs }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-dark mb-0">Live Activity Log</h5>
        
        <Link 
          to="/Activities" 
          className="small text-decoration-none fw-semibold" 
          style={{ color: "#FF6600" }}
        >
          View All <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
      
      <div className="card-body px-4 pt-2">
        <div className="position-relative mt-3">
          {/* Timeline Line */}
          <div className="position-absolute h-100 border-start" style={{ left: "20px", top: 0, borderColor: "#e9ecef" }}></div>
          
          {logs && logs.map((log) => (
            <div key={log.id} className="d-flex mb-4 position-relative z-1">
              <div className={`rounded-circle ${log.bg} bg-opacity-10 ${log.color} d-flex align-items-center justify-content-center flex-shrink-0 mt-1`} style={{ width: "40px", height: "40px", border: "4px solid white" }}>
                <i className={`bi ${log.icon}`}></i>
              </div>
              <div className="ms-3 pt-1 w-100">
                <p className="mb-1 text-dark">
                  <span className="fw-bold">{log.user}</span> {log.action} <span className="fw-semibold text-dark">{log.target}</span>
                </p>
                
                {/* Description */}
                {log.description && (
                  <p className="small text-secondary mb-1" style={{ lineHeight: "1.4" }}>
                    {log.description}
                  </p>
                )}
                
                <p className="small text-muted mb-0 mt-1">
                  <i className="bi bi-clock me-1"></i>{log.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;