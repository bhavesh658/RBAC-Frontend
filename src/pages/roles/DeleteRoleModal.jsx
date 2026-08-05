import React from "react";

function DeleteRoleModal({ show, role, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            
            {/* Modal Header (Hidden standard header for a cleaner look) */}
            <div className="modal-header border-bottom-0 pb-0 pt-3 px-4 justify-content-end">
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <div className="modal-body px-4 pt-0 pb-4 text-center">
              {/* Warning Icon */}
              <div 
                className="mx-auto bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "2.5rem" }}></i>
              </div>
              
              <h4 className="fw-bold text-dark mb-2">Delete Role?</h4>
              <p className="text-muted mb-4">
                Are you sure you want to permanently delete this role? This action cannot be undone and may affect users assigned to this role.
              </p>

              {/* Role Details Card */}
              <div className="bg-light rounded-4 p-3 text-start border shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-white text-dark d-flex justify-content-center align-items-center fw-bold shadow-sm border" style={{ width: "45px", height: "45px" }}>
                    {role?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">{role?.name}</h6>
                    <div className="small text-muted">
                      <i className="bi bi-building me-1"></i> 
                      {/* Handle both populated object and plain string for department */}
                      {role?.department?.name || role?.department || "Global Role"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top-0 pt-0 px-4 pb-4 justify-content-center gap-2">
              <button
                className="btn btn-light rounded-pill px-4 fw-semibold"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center"
                onClick={onConfirm}
              >
                <i className="bi bi-trash-fill me-2"></i> Yes, Delete Role
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default DeleteRoleModal;