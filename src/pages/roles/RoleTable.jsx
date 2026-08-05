import React from "react";

function RoleTable({ roles, onEdit, onDelete, onToggleStatus, pagination, onPageChange }) {
  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light text-secondary small text-uppercase">
            <tr>
              <th className="py-3 px-4 fw-semibold border-bottom-0" style={{ width: "60px" }}>#</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Role Details</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Department</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Permissions</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Status</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0 text-end" style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {roles && roles.length > 0 ? (
              roles.map((role, index) => {
                // Calculation for proper serial number based on current page
                const serialNumber = pagination 
                  ? (pagination.currentPage - 1) * pagination.limit + index + 1 
                  : index + 1;

                return (
                  <tr key={role._id} style={{ transition: "0.2s" }} className="hover-bg-light">
                    <td className="px-4 text-muted fw-semibold">{serialNumber}</td>
                    
                    <td className="px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center fw-bold shadow-sm" style={{ width: "40px", height: "40px" }}>
                          {role.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{role.name}</div>
                          <div className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>{role.description}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4">
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {role.department?.name || "Global / All"}
                      </span>
                    </td>

                    <td className="px-4">
                      <span className="badge bg-info bg-opacity-10 text-info border border-info rounded-pill px-3">
                        {role.permissions?.length || 0} Rights
                      </span>
                    </td>

                    {/* 🚀 UPDATED STATUS COLUMN WITH TOGGLE SWITCH */}
                    <td className="px-4">
                      <div className="form-check form-switch mb-0 d-flex align-items-center gap-2">
                        <input 
                          className="form-check-input mt-0 shadow-none" 
                          type="checkbox" 
                          role="switch" 
                          checked={role.isActive !== false} 
                          onChange={() => onToggleStatus(role)}
                          style={{ cursor: "pointer", width: "35px", height: "18px" }}
                          title={role.isActive !== false ? "Click to Deactivate" : "Click to Activate"}
                        />
                        <span className={`badge px-3 py-2 rounded-pill ${role.isActive !== false ? "bg-success bg-opacity-10 text-success border border-success" : "bg-danger bg-opacity-10 text-danger border border-danger"}`}>
                          {role.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 text-end">
                      <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm me-2" onClick={() => onEdit(role)} title="Edit Role">
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button className="btn btn-sm btn-light text-danger rounded-circle shadow-sm" onClick={() => onDelete(role)} title="Delete Role">
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <i className="bi bi-shield-lock text-muted" style={{ fontSize: "2.5rem" }}></i>
                  <h5 className="mt-3 text-dark fw-bold">No Roles Found</h5>
                  <p className="text-muted mb-0">Click "Add Role" to define access levels.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      {pagination && pagination.totalPages > 1 && (
        <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <span className="text-muted small fw-semibold">
            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} Total Roles)
          </span>
          
          <nav>
            <ul className="pagination pagination-sm mb-0 shadow-sm">
              <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link text-dark fw-semibold" 
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    style={pagination.currentPage === i + 1 ? { backgroundColor: "#FF6600", borderColor: "#FF6600", color: "white" } : { color: "#333" }}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link text-dark fw-semibold" 
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default RoleTable;