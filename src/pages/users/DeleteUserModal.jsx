function DeleteUserModal({ show, user, onClose, onConfirm }) {
  if (!show) return null;

  const isCurrentlyActive = user?.isActive;
  const actionWord = isCurrentlyActive ? "Deactivate" : "Activate";
  const themeClass = isCurrentlyActive ? "danger" : "success";

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            
            <div className={`modal-header border-bottom-0 bg-${themeClass} bg-opacity-10 pb-0 pt-4 px-4`}>
              <h5 className={`modal-title fw-bold text-${themeClass}`}>
                Confirm {actionWord}
              </h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <div className={`modal-body px-4 py-4 bg-${themeClass} bg-opacity-10`}>
              <p className="fs-5 mb-4 text-dark">
                Are you sure you want to <strong>{actionWord.toLowerCase()}</strong> this user account?
              </p>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div 
                      className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                      style={{ width: "45px", height: "45px", backgroundColor: "#FF6600" }}
                    >
                      {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{user?.firstName} {user?.lastName}</h6>
                      <span className="text-muted small">{user?.email}</span>
                    </div>
                  </div>

                  <div className="row g-2 small text-muted">
                    <div className="col-6">
                      <strong>Dept:</strong> {typeof user?.department === "object" ? user?.department?.name : user?.department || "-"}
                    </div>
                    <div className="col-6">
                      <strong>Role:</strong> {typeof user?.role === "object" ? user?.role?.name : user?.role || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top-0 pt-0 px-4 pb-4 bg-white mt-3">
              <button className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose}>
                Cancel
              </button>
              <button 
                className={`btn btn-${themeClass} rounded-pill px-4 fw-semibold shadow-sm`} 
                onClick={onConfirm}
              >
                Yes, {actionWord}
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default DeleteUserModal;