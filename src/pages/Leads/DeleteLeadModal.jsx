import React, { useState } from "react";

function DeleteLeadModal({ show, lead, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  if (!show || !lead) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(lead);
    setLoading(false);
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            
            <div className="modal-body p-4 text-center">
              <div className="mb-4 mt-2">
                <div 
                  className="rounded-circle bg-danger bg-opacity-10 d-flex justify-content-center align-items-center mx-auto" 
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-trash3-fill text-danger" style={{ fontSize: "2.5rem" }}></i>
                </div>
              </div>
              
              <h4 className="fw-bold text-dark mb-2">Delete Lead?</h4>
              <p className="text-muted mb-4 px-3">
                Are you sure you want to remove <br/>
                <strong className="text-dark fs-5">"{lead.firstName} {lead.lastName}"</strong>?<br/>
                
                {/* Updated Warning Text matching Soft Delete logic */}
                <span className="small text-danger d-block mt-2 fw-medium">
                  <i className="bi bi-info-circle-fill me-1"></i>
                  This will remove the lead from your active pipeline.
                </span>
              </p>
              
              <div className="d-flex justify-content-center gap-3 mb-2">
                <button 
                  type="button" 
                  className="btn btn-light rounded-pill px-4 fw-semibold shadow-sm border" 
                  onClick={onClose} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center gap-2" 
                  onClick={handleConfirm} 
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm"></span> Deleting...</>
                  ) : (
                    <><i className="bi bi-trash3-fill"></i> Yes, Delete</>
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

export default DeleteLeadModal;