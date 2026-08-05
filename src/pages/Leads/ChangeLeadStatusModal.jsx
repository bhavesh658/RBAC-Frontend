import React, { useState, useEffect } from "react";
import { updateLeadStatus } from "../../services/lead";

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost', 'Junk'];

function ChangeLeadStatusModal({ show, lead, onClose, refreshData }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    if (show && lead) setStatus(lead.status || "New"); 
  }, [show, lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLeadStatus(lead._id, { status });
      refreshData();
      onClose();
    } catch (err) { 
      alert("Error: " + (err.response?.data?.message || err.message)); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!show || !lead) return null;

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            
            <div className="modal-header border-bottom-0 pt-4 px-4">
              <h6 className="fw-bold text-dark mb-0">Update Lead Status</h6>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-3">
                <p className="small text-muted mb-3">
                  Lead: <strong className="text-dark">{lead.firstName} {lead.lastName}</strong>
                </p>
                
                <label className="form-label small fw-semibold">New Status</label>
                <select 
                  className="form-select bg-light shadow-none fw-medium" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button 
                  type="button" 
                  className="btn btn-light rounded-pill px-4 fw-semibold" 
                  onClick={onClose} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" 
                  style={{ backgroundColor: "#FF6600" }} 
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ChangeLeadStatusModal;