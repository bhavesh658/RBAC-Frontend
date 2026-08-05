import React, { useState } from "react";

function DeleteTaskModal({ show, task, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  if (!show || !task) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(task);
    setLoading(false);
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            
            <div className="modal-body p-4 text-center">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-danger bg-opacity-10 d-flex justify-content-center align-items-center mx-auto" 
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "2.5rem" }}></i>
                </div>
              </div>
              
              <h4 className="fw-bold text-dark mb-2">Delete Task?</h4>
              <p className="text-muted mb-4">
                Are you sure you want to delete the task <br/>
                <strong className="text-dark">"{task.title}"</strong>?<br/>
                <span className="small text-danger">This action cannot be undone.</span>
              </p>
              
              <div className="d-flex justify-content-center gap-3">
                <button 
                  type="button" 
                  className="btn btn-light rounded-pill px-4 fw-semibold shadow-sm" 
                  onClick={onClose} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm" 
                  onClick={handleConfirm} 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    "Yes, Delete Task"
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default DeleteTaskModal;