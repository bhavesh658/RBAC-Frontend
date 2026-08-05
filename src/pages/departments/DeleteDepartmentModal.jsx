function DeleteDepartmentModal({ show, department, onClose, onConfirm }) {
  if (!show) return null;

  const isActive = department?.isActive !== false;
  const actionWord = isActive ? "Deactivate" : "Activate";
  const themeClass = isActive ? "danger" : "success";

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
                Are you sure you want to <strong>{actionWord.toLowerCase()}</strong> this department?
              </p>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body bg-white">
                  <h6 className="mb-1 fw-bold text-dark">{department?.name}</h6>
                  <span className="text-muted small d-block mb-2">Code: {department?.code}</span>
                  <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${isActive ? 'success' : 'danger'} border-0 px-2 py-1`}>
                    Currently {isActive ? 'Active' : 'Inactive'}
                  </span>
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

export default DeleteDepartmentModal;