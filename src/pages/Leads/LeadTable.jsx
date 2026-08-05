import React from "react";
import HasPermission from "../../components/common/HasPermission";

function LeadTable({ leads, onView, onEdit, onAssign, onStatus, onDelete, pagination, onPageChange }) {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': 
        return 'bg-info bg-opacity-10 text-info border border-info';
      case 'Contacted': 
        return 'bg-primary bg-opacity-10 text-primary border border-primary';
      case 'Qualified': 
        return 'bg-warning bg-opacity-10 text-warning border border-warning text-dark';
      case 'Converted': 
        return 'bg-success text-white shadow-sm'; 
      case 'Lost': 
        return 'bg-danger text-white shadow-sm'; 
      case 'Junk': 
        return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
      default: 
        return 'bg-light text-dark border';
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light text-secondary small text-uppercase">
            <tr>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Lead Details</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Contact Info</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Source / Value</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Status</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0">Assigned To</th>
              <th className="py-3 px-4 fw-semibold border-bottom-0 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {leads && leads.length > 0 ? (
              leads.map((lead) => {
                //  Agar Lead close ho chuki hai (Lost/Junk), toh row thodi fade dikhegi
                const isClosedLead = lead.status === 'Lost' || lead.status === 'Junk';
                
                return (
                  <tr 
                    key={lead._id} 
                    className="hover-bg-light" 
                    style={{ transition: "0.2s", opacity: isClosedLead ? 0.65 : 1 }}
                  >

                    {/* Removed isActive badge from here */}
                    <td className="px-4">
                      <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="small text-muted">{lead.company || "Individual"}</div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-4">
                      <div className="small text-dark mb-1"><i className="bi bi-telephone-fill me-2 text-muted"></i>{lead.phone}</div>
                      {lead.email && <div className="small text-muted"><i className="bi bi-envelope-fill me-2"></i>{lead.email}</div>}
                    </td>

                    {/* Source & Value */}
                    <td className="px-4">
                      <div className="small fw-semibold text-dark mb-1">{lead.source}</div>
                      <div className="small text-success fw-bold">₹{lead.estimatedValue?.toLocaleString() || 0}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4">
                      <span className={`badge px-3 py-1 rounded-pill ${getStatusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="px-4">
                      {lead.assignedTo ? (
                        <span className="small fw-semibold text-dark">
                          {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted border">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 text-end">
                      <div className="d-flex justify-content-end gap-2">

                        {/* View Button */}
                        <HasPermission requiredPermission="leads.read">
                          <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm" onClick={() => onView(lead)} title="View Details">
                            <i className="bi bi-eye-fill"></i>
                          </button>
                        </HasPermission>

                        {/* Update Status Button (Disabled if already Converted/Lost/Junk to prevent illogical changes, optional feature) */}
                        <HasPermission requiredPermission="leads.update">
                          <button 
                            className="btn btn-sm btn-light text-success rounded-circle shadow-sm" 
                            onClick={() => onStatus(lead)} 
                            title="Update Status"
                          >
                            <i className="bi bi-check-circle-fill"></i>
                          </button>
                        </HasPermission>

                        {/* Assign Lead Button */}
                        <HasPermission requiredPermission="leads.assign">
                          <button className="btn btn-sm btn-light text-dark rounded-circle shadow-sm" onClick={() => onAssign(lead)} title="Assign Lead">
                            <i className="bi bi-person-plus-fill"></i>
                          </button>
                        </HasPermission>

                        {/* Edit Full Info Button */}
                        <HasPermission requiredPermission="leads.update">
                          <button className="btn btn-sm btn-light text-warning rounded-circle shadow-sm" onClick={() => onEdit(lead)} title="Edit Full Info">
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                        </HasPermission>

                        {/* Delete Button (Soft Delete) */}
                        <HasPermission requiredPermission="leads.delete">
                          <button className="btn btn-sm btn-light text-danger rounded-circle shadow-sm" onClick={() => onDelete(lead)} title="Delete Lead">
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
                  <div className="text-muted mb-2"><i className="bi bi-inbox-fill fs-1"></i></div>
                  <h5 className="mt-2 text-dark fw-bold">No Leads Found</h5>
                  <p className="text-muted small">Try adjusting your search or add a new lead.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="card-footer bg-white border-top py-3 px-4 d-flex justify-content-between align-items-center">
          <span className="text-muted small fw-semibold">
            Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} Leads)
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

export default LeadTable;