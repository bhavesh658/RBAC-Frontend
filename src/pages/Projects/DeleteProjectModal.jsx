import React, { useState } from "react";

function DeleteProjectModal({ show, project, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  if (!show || !project) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(project);
    setLoading(false);
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            
            {/* Warning Header */}
            <div className="modal-header bg-danger bg-opacity-10 border-bottom-0 pb-3 pt-4 px-4 d-flex align-items-center">
              <div className="rounded-circle bg-danger text-white d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: "45px", height: "45px" }}>
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              </div>
              <div>
                <h5 className="fw-bold text-danger mb-0">Delete Project?</h5>
                <p className="text-danger opacity-75 small mb-0">This action cannot be undone.</p>
              </div>
              <button type="button" className="btn-close shadow-none position-absolute top-0 end-0 mt-3 me-3" onClick={onClose} disabled={loading}></button>
            </div>

            {/* Project Details */}
            <div className="modal-body px-4 py-4">
              <p className="text-dark mb-4">
                You are about to permanently delete the following project and all its associations from the system:
              </p>
              
              <div className="card bg-light border-0 rounded-3 p-3 mb-2">
                <div className="fw-bold text-dark fs-5 mb-1">{project.name}</div>
                
                <div className="d-flex align-items-center text-muted small mt-2 gap-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-badge me-2"></i>
                    Manager: <span className="fw-semibold text-dark ms-1">{project.manager?.firstName || 'Unassigned'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-people me-2"></i>
                    Team: <span className="fw-semibold text-dark ms-1">{project.members?.length || 0} Members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="modal-footer border-top-0 pt-0 px-4 pb-4 d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-light rounded-pill px-4 fw-semibold flex-grow-1" 
                onClick={onClose} 
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm flex-grow-1" 
                onClick={handleConfirm} 
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-trash3-fill me-2"></i>
                )}
                Yes, Delete Project
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default DeleteProjectModal;