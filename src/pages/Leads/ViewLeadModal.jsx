import React from "react";

function ViewLeadModal({ show, lead, onClose }) {
  if (!show || !lead) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': 
        return 'bg-info bg-opacity-10 text-info border border-info';
      case 'Contacted': 
        return 'bg-primary bg-opacity-10 text-primary border border-primary';
      case 'Qualified': 
        return 'bg-warning bg-opacity-10 text-warning border border-warning text-dark';
      case 'Converted': 
        return 'bg-success text-white shadow-sm';
      case 'Lost': 
        return 'bg-danger text-white shadow-sm';
      case 'Junk': 
        return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
      default: 
        return 'bg-light text-dark border';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Set";
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
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
                  <i className="bi bi-person-bounding-box me-2" style={{ color: "#FF6600" }}></i>
                  {lead.firstName} {lead.lastName}
                  
                  {/* isActive removed, only showing Deleted if applicable */}
                  {lead.isDeleted && (
                    <span className="badge bg-dark rounded-pill ms-2" style={{ fontSize: "0.7rem" }}>
                      <i className="bi bi-trash3-fill me-1"></i>Deleted
                    </span>
                  )}
                </h5>
                <p className="text-muted small mb-0">{lead.company || "Individual Client"}</p>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            {/* Body */}
            <div className="modal-body px-4 py-4" style={{ maxHeight: "75vh", overflowY: "auto" }}>
              
              {/* Badges Section */}
              <div className="d-flex gap-2 mb-4 flex-wrap align-items-center">
                <span className={`badge px-3 py-2 rounded-pill ${getStatusBadge(lead.status)}`}>
                  Status: {lead.status}
                </span>
                <span className="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill px-3 py-2 shadow-sm">
                  Priority: {lead.priority}
                </span>
                <span className="badge bg-success bg-opacity-10 text-success border-success border rounded-pill px-3 py-2 fw-bold ms-auto">
                  Value: ₹{lead.estimatedValue?.toLocaleString() || 0}
                </span>
              </div>

              <div className="row g-4">
                {/* Left Column: Lead Info */}
                <div className="col-md-6">
                  <div className="card border rounded-3 mb-4 shadow-sm">
                    <div className="card-header bg-white fw-bold py-2 border-bottom">
                      <i className="bi bi-telephone-outbound me-2" style={{ color: "#FF6600" }}></i> Contact Details
                    </div>
                    <div className="card-body">
                      <p className="mb-2 small"><strong className="text-dark">Phone:</strong> {lead.phone}</p>
                      <p className="mb-2 small"><strong className="text-dark">Email:</strong> {lead.email || "N/A"}</p>
                      <p className="mb-0 small">
                        <strong className="text-dark">Source:</strong> 
                        <span className="badge bg-light text-dark border ms-2">{lead.source}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tags and Notes */}
                  <div className="card bg-light border-0 rounded-3 mb-4">
                    <div className="card-body p-3">
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="mb-4">
                          <strong className="small text-dark d-block mb-2"><i className="bi bi-tags-fill me-1 text-muted"></i> Tags:</strong>
                          <div className="d-flex gap-1 flex-wrap">
                            {lead.tags.map((tag, idx) => (
                              <span key={idx} className="badge bg-dark rounded-pill px-2 py-1">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <h6 className="fw-bold text-dark mb-2">Notes & Remarks</h6>
                      <p className="text-muted small mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {lead.notes || "No additional notes provided for this lead."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Tracking & Assignments */}
                <div className="col-md-6">
                  
                  {/* Assignee Card */}
                  <div className="card border rounded-3 mb-4 shadow-sm">
                    <div className="card-header bg-white fw-bold py-2 border-bottom">
                      <i className="bi bi-person-badge me-2" style={{ color: "#FF6600" }}></i> Assigned Sales Rep
                    </div>
                    <div className="card-body py-3">
                      {lead.assignedTo ? (
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="rounded-circle text-white d-flex justify-content-center align-items-center fw-bold shadow-sm" 
                            style={{ width: "45px", height: "45px", fontSize: "1.2rem", backgroundColor: "#2C3E50" }}
                          >
                            {lead.assignedTo.firstName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{lead.assignedTo.firstName} {lead.assignedTo.lastName}</div>
                            <div className="small text-muted">{lead.assignedTo.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">Not assigned to anyone yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Metadata & Dates */}
                  <div className="card border-0 bg-light rounded-3 p-3">
                    <div className="mb-3">
                      <div className="text-muted small fw-semibold">Next Follow-Up Date</div>
                      <div className="text-danger small fw-bold">
                        <i className="bi bi-calendar-event me-1"></i> {formatDate(lead.followUpDate)}
                      </div>
                    </div>
                    <hr className="my-3 text-muted opacity-25" />
                    
                    <div className="mb-3">
                      <div className="text-muted small fw-semibold">Record Status</div>
                      <div className="small fw-bold mt-1">
                        {lead.isDeleted ? (
                          <span className="text-danger"><i className="bi bi-x-circle-fill me-1"></i> Deleted (Recycle Bin)</span>
                        ) : (
                          <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i> Active Record</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-muted small fw-semibold">Created By</div>
                      <div className="text-dark small fw-bold">
                        {lead.createdBy ? `${lead.createdBy.firstName} ${lead.createdBy.lastName}` : "System"} <br/>
                        <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>{formatDate(lead.createdAt)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-muted small fw-semibold">Last Updated By</div>
                      <div className="text-dark small fw-bold">
                        {lead.updatedBy ? `${lead.updatedBy.firstName} ${lead.updatedBy.lastName}` : "System"} <br/>
                        <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>{formatDate(lead.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            
            {/* Footer */}
            <div className="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
              <button type="button" className="btn btn-secondary rounded-pill px-4 fw-semibold shadow-sm" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ViewLeadModal;