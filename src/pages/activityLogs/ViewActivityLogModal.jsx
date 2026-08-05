import React from "react";

function ViewActivityLogModal({ show, log, onClose }) {
  if (!show || !log) return null;

  const getActionColor = (action) => {
    const act = action?.toLowerCase() || '';
    if (act.includes('create') || act.includes('add')) return 'text-success';
    if (act.includes('update') || act.includes('edit')) return 'text-warning';
    if (act.includes('delete') || act.includes('remove')) return 'text-danger';
    return 'text-primary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            
            {/* Header */}
            <div className="modal-header border-bottom pb-3 pt-4 px-4 bg-light rounded-top-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2 flex-wrap">
                  <i className="bi bi-clock-history text-muted me-1"></i>
                  Activity Details
                </h5>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            {/* Body */}
            <div className="modal-body px-4 py-4" style={{ maxHeight: "75vh", overflowY: "auto" }}>
              
              {/* Summary Section */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light rounded-3 p-3 h-100">
                    <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Event Information</h6>
                    <div className="mb-2 small"><strong className="text-muted me-2">Module:</strong> <span className="fw-bold">{log.module}</span></div>
                    <div className="mb-2 small"><strong className="text-muted me-2">Action:</strong> <span className={`fw-bold ${getActionColor(log.action)}`}>{log.action}</span></div>
                   
                    <div className="small"><strong className="text-muted me-2">Timestamp:</strong> {formatDate(log.createdAt)}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-light rounded-3 p-3 h-100">
                    <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Performed By</h6>
                    {log.performedBy ? (
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center fw-bold" style={{ width: "45px", height: "45px", fontSize: "1.2rem" }}>
                          {log.performedBy.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{log.performedBy.fullName || `${log.performedBy.firstName} ${log.performedBy.lastName}`}</div>
                          <div className="small text-muted">{log.performedBy.email}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted small fst-italic">System Automated Action</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">Description</h6>
                <div className="alert alert-secondary border-0 bg-light py-2 px-3 small text-dark mb-0">
                  {log.description}
                </div>
              </div>

              {/* Metadata JSON Viewer */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div>
                  <h6 className="fw-bold text-dark mb-2">
                    <i className="bi bi-braces text-primary me-1"></i> Data Changes (Metadata)
                  </h6>
                  <div className="bg-dark text-white rounded-3 p-3 overflow-auto" style={{ maxHeight: "300px" }}>
                    <pre className="mb-0" style={{ fontSize: "0.8rem", color: "#a5d6ff" }}>
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
              <button type="button" className="btn btn-secondary rounded-pill px-4 fw-semibold" onClick={onClose}>Close</button>
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ViewActivityLogModal;