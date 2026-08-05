import React from "react";



function ActivityLogTable({ logs, onView, pagination, onPageChange }) {

  const getActionBadge = (action) => {

    const act = action?.toLowerCase() || '';

    if (act.includes('create') || act.includes('add')) return 'bg-success bg-opacity-10 text-success border border-success';

    if (act.includes('update') || act.includes('edit')) return 'bg-warning bg-opacity-10 text-warning border border-warning';

    if (act.includes('delete') || act.includes('remove')) return 'bg-danger bg-opacity-10 text-danger border border-danger';

    return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';

  };



  const formatDate = (dateString) => {

    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleString('en-US', {

      year: 'numeric', month: 'short', day: 'numeric',

      hour: '2-digit', minute: '2-digit'

    });

  };



  return (

    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead className="bg-light text-secondary small text-uppercase">

            <tr>

              <th className="py-3 px-4 fw-semibold border-bottom-0">Date & Time</th>

              <th className="py-3 px-4 fw-semibold border-bottom-0">Performed By</th>

              <th className="py-3 px-4 fw-semibold border-bottom-0">Module</th>

              <th className="py-3 px-4 fw-semibold border-bottom-0">Action</th>

              <th className="py-3 px-4 fw-semibold border-bottom-0">Description</th>

              <th className="py-3 px-4 fw-semibold border-bottom-0 text-end">Details</th>

            </tr>

          </thead>

          <tbody className="border-top-0">

            {logs && logs.length > 0 ? (

              logs.map((log) => (

                <tr key={log._id} className="hover-bg-light" style={{ transition: "0.2s" }}>

                 

                  {/* Date Time */}

                  <td className="px-4">

                    <div className="fw-semibold text-dark small">{formatDate(log.createdAt)}</div>

                  </td>



                  {/* User Info */}

                  <td className="px-4">

                    <div className="d-flex align-items-center gap-2">

                      <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}>

                        {log.performedBy?.firstName?.charAt(0) || "U"}

                      </div>

                      <div>

                        <div className="fw-bold text-dark small">{log.performedBy?.fullName || "System"}</div>

                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>{log.performedBy?.email || "N/A"}</div>

                      </div>

                    </div>

                  </td>



                  {/* 🚀 Module Column */}

                  <td className="px-4">

                    <div className="fw-bold text-dark small">{log.module || "System"}</div>

                  </td>



                  {/* 🚀 Action Column */}

                  <td className="px-4">

                    <span className={`badge rounded-pill px-3 ${getActionBadge(log.action)}`}>

                      {log.action}

                    </span>

                  </td>



                  {/* Description */}

                  <td className="px-4">

                    <div className="small text-muted text-truncate" style={{ maxWidth: "300px" }} title={log.description}>

                      {log.description}

                    </div>

                  </td>



                  {/* Actions */}

                  <td className="px-4 text-end">

                    <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm" onClick={() => onView(log)} title="View Metadata">

                      <i className="bi bi-eye-fill"></i>

                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                {/* 🚀 ColSpan ko 5 se 6 kar diya kyunki ek column badh gaya hai */}

                <td colSpan="6" className="text-center py-5">

                  <i className="bi bi-clock-history text-muted mb-2" style={{ fontSize: "2rem" }}></i>

                  <h6 className="mt-3 text-dark fw-bold">No Activity Found</h6>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

     

      {/* Pagination Footer */}

      {pagination && pagination.totalPages > 1 && (

        <div className="card-footer bg-white border-top py-3 px-4 d-flex justify-content-between align-items-center">

          <span className="text-muted small fw-semibold">

            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} Logs)

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



export default ActivityLogTable; 

