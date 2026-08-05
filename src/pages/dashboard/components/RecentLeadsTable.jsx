import React from 'react';
import { Link } from 'react-router-dom';

const RecentLeadsTable = ({ leads }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between">
        <h5 className="fw-bold text-dark mb-0">Recently Added Leads</h5>

        <Link 
          to="/leads" 
          className="small text-decoration-none fw-semibold" 
          style={{ color: "#FF6600" }}
        >
          View All <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
      <div className="card-body px-4 pt-0">
        <div className="table-responsive mt-3">
          <table className="table table-hover align-middle border-top-0 mb-0">
            <thead className="bg-light text-secondary small text-uppercase">
              <tr>
                <th className="border-0 py-3 rounded-start">Lead Info</th>
                <th className="border-0 py-3 text-center">Status</th>
                <th className="border-0 py-3 text-end rounded-end">Added</th>
              </tr>
            </thead>
            <tbody>
              {leads && leads.map((lead, idx) => (
                <tr key={idx}>
                  <td className="py-3 border-bottom">
                    <div className="fw-bold text-dark">{lead.name}</div>
                    <div className="small text-muted">{lead.company}</div>
                  </td>
                  <td className="py-3 border-bottom text-center">
                    <span className={`badge rounded-pill px-3 py-1 ${
                      lead.status === 'Hot' ? 'bg-danger bg-opacity-10 text-danger' : 
                      lead.status === 'Warm' ? 'bg-warning bg-opacity-10 text-warning' : 
                      'bg-info bg-opacity-10 text-info'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 border-bottom text-end text-muted small">
                    {lead.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentLeadsTable;