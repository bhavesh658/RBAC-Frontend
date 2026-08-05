import React from "react";

function ViewProjectModal({ show, project, onClose }) {
  if (!show || !project) return null;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-success bg-opacity-10 text-success border-success';
      case 'completed': return 'bg-primary bg-opacity-10 text-primary border-primary';
      case 'on hold': return 'bg-warning bg-opacity-10 text-warning border-warning';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-danger text-white';
      case 'medium': return 'bg-warning text-dark';
      case 'low': return 'bg-info text-dark';
      default: return 'bg-primary text-white';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Set";
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric'
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
                  <i className="bi bi-folder-fill text-warning me-2"></i>
                  {project.name}
                </h5>
               
              </div>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            {/* Body */}
            <div className="modal-body px-4 py-4" style={{ maxHeight: "75vh", overflowY: "auto" }}>
              
              {/* Badges Row */}
              <div className="d-flex gap-2 mb-4">
                <span className={`badge px-3 py-2 border rounded-pill ${getStatusBadge(project.status)}`}>
                  Status: {project.status || "N/A"}
                </span>
                <span className={`badge px-3 py-2 rounded-pill shadow-sm ${getPriorityBadge(project.priority)}`}>
                  Priority: {project.priority || "N/A"}
                </span>
              </div>

              <div className="row g-4">
                {/* Left Column (Details & Dates) */}
                <div className="col-md-6">
                  
                  {/* Description Card */}
                  <div className="card bg-light border-0 rounded-3 mb-4">
                    <div className="card-body p-3">
                      <h6 className="fw-bold text-dark mb-2">Description</h6>
                      <p className="text-muted small mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Dates Details */}
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-3 border rounded-3 bg-white h-100 shadow-sm">
                        <div className="text-muted small fw-semibold mb-1"><i className="bi bi-calendar-play me-1"></i> Start Date</div>
                        <div className="text-dark fw-bold small">{formatDate(project.startDate)}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 border rounded-3 bg-white h-100 shadow-sm">
                        <div className="text-muted small fw-semibold mb-1"><i className="bi bi-calendar-check me-1"></i> End Date</div>
                        <div className="text-dark fw-bold small">{formatDate(project.endDate)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata (Created / Updated) */}
                  <div className="card border-0 bg-light rounded-3 p-3 mt-4">
                    <div className="mb-3">
                      <div className="text-muted small fw-semibold">Created By</div>
                      <div className="text-dark small fw-bold">
                        {project.createdBy?.fullName || "System"} <br/>
                        <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted small fw-semibold">Last Updated By</div>
                      <div className="text-dark small fw-bold">
                        {project.updatedBy?.fullName || "System"} <br/>
                        <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (People / Teams) */}
                <div className="col-md-6">
                  
                  {/* Project Manager Card */}
                  <div className="card border-primary border-opacity-25 rounded-3 mb-4 shadow-sm">
                    <div className="card-header bg-primary bg-opacity-10 text-primary fw-bold py-2 border-bottom-0">
                      <i className="bi bi-person-workspace me-2"></i> Project Manager
                    </div>
                    <div className="card-body py-3">
                      {project.projectManager ? (
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center fw-bold shadow-sm" style={{ width: "45px", height: "45px", fontSize: "1.2rem" }}>
                            {project.projectManager.firstName?.charAt(0) || "M"}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{project.projectManager.fullName}</div>
                            <div className="small text-muted">{project.projectManager.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">No Manager Assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Team Members List */}
                  <div className="card border rounded-3 shadow-sm">
                    <div className="card-header bg-white fw-bold py-3 d-flex justify-content-between align-items-center border-bottom">
                      <span><i className="bi bi-people-fill text-info me-2"></i> Team Members</span>
                      <span className="badge bg-light text-dark border rounded-pill">{project.teamMemberCount || 0}</span>
                    </div>
                    <div className="card-body p-0" style={{ maxHeight: "250px", overflowY: "auto" }}>
                      {project.teamMembers && project.teamMembers.length > 0 ? (
                        <ul className="list-group list-group-flush">
                          {project.teamMembers.map((member) => (
                            <li key={member._id} className="list-group-item d-flex align-items-center gap-3 py-3 border-bottom">
                              <div className="rounded-circle bg-secondary bg-opacity-25 text-dark d-flex justify-content-center align-items-center fw-bold" style={{ width: "35px", height: "35px" }}>
                                {member.firstName?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark small">{member.fullName}</div>
                                <div className="text-muted" style={{ fontSize: "0.75rem" }}>{member.email}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4">
                          <span className="text-muted small fst-italic">No team members added yet.</span>
                        </div>
                      )}
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

export default ViewProjectModal;