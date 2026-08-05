import React from "react";
import HasPermission from "../../components/common/HasPermission";

function ProjectTable({ projects, onView, onEdit, onDelete, pagination, onPageChange }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-success bg-opacity-10 text-success border-success';
      case 'completed': return 'bg-primary bg-opacity-10 text-primary border-primary';
      case 'on hold': return 'bg-warning bg-opacity-10 text-warning border-warning';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light text-secondary small text-uppercase">
            <tr>
              <th className="py-3 px-4 fw-semibold border-bottom-0" style={{ width: "60px" }}>#</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Project Name</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Manager</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Team Size</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Status</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0 text-end" style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {projects && projects.length > 0 ? (
              projects.map((project, index) => {
                // Calculation for proper serial number based on current page
                const serialNumber = pagination
                  ? (pagination.currentPage - 1) * pagination.limit + index + 1
                  : index + 1;

                return (
                  <tr key={project._id} className="hover-bg-light" style={{ transition: "0.2s" }}>
                    <td className="px-4 text-muted fw-semibold">{serialNumber}</td>

                    <td className="px-4">
                      <div className="fw-bold text-dark mb-1">{project.name}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: "250px" }}>
                        {project.description || "No description provided."}
                      </div>
                    </td>

                    <td className="px-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center small fw-bold" style={{ width: "30px", height: "30px" }}>
                          {project.projectManager?.firstName?.charAt(0) || "M"}
                        </div>
                        <span className="small fw-semibold text-dark">
                          {project.projectManager?.firstName ? `${project.projectManager.firstName} ${project.projectManager.lastName || ''}` : "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4">
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {project.teamMembers?.length || 0} Members
                      </span>
                    </td>

                    <td className="px-4">
                      <span className={`badge px-3 py-1 rounded-pill border ${getStatusBadge(project.status)}`}>
                        {project.status || "Planning"}
                      </span>
                    </td>

                
                    <td className="px-4 text-end">
                      <div className="d-flex justify-content-end gap-1">
                  

                       <HasPermission requiredPermission="projects.read">
                        <button className="btn btn-sm btn-light text-success rounded-circle shadow-sm me-1" onClick={() => onView(project)} title="View Project Details">
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        </HasPermission>              
                      
                     <HasPermission requiredPermission="projects.update">
                        <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm me-1" onClick={() => onEdit(project)} title="Manage Project">
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                      </HasPermission>
                       
                       <HasPermission requiredPermission="projects.delete">
                        <button className="btn btn-sm btn-light text-danger rounded-circle shadow-sm" onClick={() => onDelete(project)} title="Delete Project">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </HasPermission>
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <i className="bi bi-folder-x text-muted" style={{ fontSize: "2.5rem" }}></i>
                  <h5 className="mt-3 text-dark fw-bold">No Projects Found</h5>
                  <p className="text-muted mb-0">Click "Create Project" to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🚀 PAGINATION FOOTER */}
      {pagination && pagination.totalPages > 1 && (
        <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <span className="text-muted small fw-semibold">
            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} Total Projects)
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

export default ProjectTable;