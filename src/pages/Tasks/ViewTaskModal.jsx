import React from "react";

function ViewTaskModal({ show, task, onClose }) {
  if (!show || !task) return null;

  // Helper functions for UI
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success bg-opacity-10 text-success border-success';
      case 'Blocked': return 'bg-danger bg-opacity-10 text-danger border-danger';
      case 'In Progress': return 'bg-primary bg-opacity-10 text-primary border-primary';
      case 'Review': return 'bg-warning bg-opacity-10 text-warning border-warning';
      case 'Testing': return 'bg-info bg-opacity-10 text-info border-info';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-danger text-white';
      case 'High': return 'bg-warning text-dark';
      case 'Medium': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
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
            <div className="modal-header border-bottom pb-3 pt-4 px-4 bg-light rounded-top-4">
              <div>
                <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  {task.title}
                  {task.isOverdue && <span className="badge bg-danger rounded-pill ms-2" style={{ fontSize: "0.7rem" }}>Overdue</span>}
                </h5>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            {/* Body */}
            <div className="modal-body px-4 py-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              
              {/* Badges Row */}
              <div className="d-flex gap-2 mb-4">
                <span className={`badge px-3 py-2 border rounded-pill ${getStatusBadge(task.status)}`}>
                  Status: {task.status}
                </span>
                <span className={`badge px-3 py-2 rounded-pill shadow-sm ${getPriorityBadge(task.priority)}`}>
                  Priority: {task.priority}
                </span>
              </div>

              <div className="row g-4">
                {/* Left Column */}
                <div className="col-md-7">
                  {/* Description Card */}
                  <div className="card bg-light border-0 rounded-3 mb-4">
                    <div className="card-body">
                      <h6 className="fw-bold text-dark mb-2">Description</h6>
                      <p className="text-muted small mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {task.description || "No description provided for this task."}
                      </p>
                    </div>
                  </div>

                  {/* Project Info Card */}
                  <div className="card border rounded-3 mb-4">
                    <div className="card-header bg-white fw-bold py-2">
                      <i className="bi bi-folder2-open text-primary me-2"></i> Project Details
                    </div>
                    <div className="card-body py-2">
                      <p className="mb-1 small"><strong className="text-dark">Name:</strong> {task.project?.name || "N/A"}</p>
                      <p className="mb-0 small"><strong className="text-dark">Status:</strong> {task.project?.status || "N/A"}</p>
                    </div>
                  </div>

                  {/* Dates Details */}
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-3 border rounded-3 bg-white h-100">
                        <div className="text-muted small fw-semibold mb-1">Start Date</div>
                        <div className="text-dark fw-bold small">{formatDate(task.startDate)}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 border rounded-3 bg-white h-100">
                        <div className="text-muted small fw-semibold mb-1">Due Date</div>
                        <div className={`fw-bold small ${task.isOverdue ? 'text-danger' : 'text-dark'}`}>
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (People) */}
                <div className="col-md-5">
                  
                  {/* Assignee Card */}
                  <div className="card border rounded-3 mb-4 shadow-sm">
                    <div className="card-header bg-white fw-bold py-2 border-bottom">
                      <i className="bi bi-person-badge text-primary me-2"></i> Assigned To
                    </div>
                    <div className="card-body">
                      {task.assignedTo ? (
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center fw-bold" style={{ width: "45px", height: "45px", fontSize: "1.2rem" }}>
                            {task.assignedTo.firstName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{task.assignedTo.fullName || `${task.assignedTo.firstName} ${task.assignedTo.lastName}`}</div>
                            <div className="small text-muted">{task.assignedTo.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">Unassigned</span>
                      )}
                    </div>
                  </div>

                  {/* Metadata (Created / Updated) */}
                  <div className="card border-0 bg-light rounded-3 p-3">
                    <div className="mb-3">
                      <div className="text-muted small fw-semibold">Created By</div>
                      <div className="text-dark small fw-bold">
                        {task.createdBy?.fullName || "System"} <br/>
                        <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted small fw-semibold">Last Updated By</div>
                      <div className="text-dark small fw-bold">
                        {task.updatedBy?.fullName || "System"} <br/>
                        <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>{formatDate(task.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            
            {/* Footer */}
            <div className="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
              <button type="button" className="btn btn-secondary rounded-pill px-4 fw-semibold" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ViewTaskModal;