import React from "react";

function TaskTable({ tasks, onView, onEdit, onAssign, onStatus, onDelete, pagination, onPageChange }) {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-danger fw-bold';
      case 'High': return 'text-warning fw-bold';
      case 'Medium': return 'text-primary';
      default: return 'text-secondary';
    }
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light text-secondary small text-uppercase">
            <tr>
              <th className="py-3 px-4 fw-semibold border-bottom-0" style={{ width: "60px" }}>#</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Task Details</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Project</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Assigned To</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Status</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0 text-end" style={{ width: "200px" }}>Actions</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {tasks && tasks.length > 0 ? (
              tasks.map((task, index) => {
                const serialNumber = pagination ? (pagination.currentPage - 1) * pagination.limit + index + 1 : index + 1;
                const overdue = isOverdue(task);

                return (
                  <tr key={task._id} className="hover-bg-light" style={{ transition: "0.2s" }}>
                    <td className="px-4 text-muted fw-semibold">{serialNumber}</td>
                    
                    <td className="px-4">
                      <div className="d-flex align-items-start gap-2">
                        <div>
                          <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                            {task.title}
                            {overdue && <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.65rem" }}>Overdue</span>}
                          </div>
                          <div className="small text-muted d-flex gap-3">
                            <span className={getPriorityColor(task.priority)}><i className="bi bi-flag-fill me-1"></i>{task.priority}</span>
                            {task.dueDate && <span><i className="bi bi-calendar-event me-1"></i>{new Date(task.dueDate).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4">
                      <div className="fw-semibold text-dark small">{task.project?.name || "N/A"}</div>
                    </td>

                    <td className="px-4">
                      {task.assignedTo ? (
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center small fw-bold" style={{ width: "28px", height: "28px" }}>
                            {task.assignedTo.firstName?.charAt(0) || "U"}
                          </div>
                          <span className="small fw-semibold text-dark">
                            {task.assignedTo.firstName} {task.assignedTo.lastName || ''}
                          </span>
                        </div>
                      ) : (
                        <span className="badge bg-light text-muted border">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4">
                      <span className={`badge px-3 py-1 rounded-pill border ${getStatusBadge(task.status)}`}>
                        {task.status || "Todo"}
                      </span>
                    </td>

                    {/* 🚀 New Actions Column for Permissions */}
                    <td className="px-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm" onClick={() => onView(task)} title="View Details">
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        
                        <button className="btn btn-sm btn-light text-success rounded-circle shadow-sm" onClick={() => onStatus(task)} title="Update Status">
                          <i className="bi bi-check-circle-fill"></i>
                        </button>
                        
                        <button className="btn btn-sm btn-light text-dark rounded-circle shadow-sm" onClick={() => onAssign(task)} title="Assign Task">
                          <i className="bi bi-person-plus-fill"></i>
                        </button>
                        
                        <button className="btn btn-sm btn-light text-warning rounded-circle shadow-sm" onClick={() => onEdit(task)} title="Edit Task Info">
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        
                        <button className="btn btn-sm btn-light text-danger rounded-circle shadow-sm" onClick={() => onDelete(task)} title="Delete Task">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <i className="bi bi-list-check text-muted" style={{ fontSize: "2.5rem" }}></i>
                  <h5 className="mt-3 text-dark fw-bold">No Tasks Found</h5>
                  <p className="text-muted mb-0">Click "Create Task" to add a new task.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="card-footer bg-white border-top py-3 px-4 d-flex justify-content-between align-items-center">
          <span className="text-muted small fw-semibold">
            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} Tasks)
          </span>
          <nav>
            <ul className="pagination pagination-sm mb-0 shadow-sm">
              <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-dark" onClick={() => onPageChange(pagination.currentPage - 1)}>Previous</button>
              </li>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" style={pagination.currentPage === i + 1 ? { backgroundColor: "#FF6600", borderColor: "#FF6600", color: "white" } : {}} onClick={() => onPageChange(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-dark" onClick={() => onPageChange(pagination.currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default TaskTable;