import React, { useState, useEffect } from "react";
import { assignLead } from "../../services/lead";
import { getUsers } from "../../services/user";

function AssignLeadModal({ show, lead, onClose, refreshData }) {
  const [assignedTo, setAssignedTo] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      getUsers()
        .then(res => setUsersList(res.success ? res.data : (Array.isArray(res) ? res : [])))
        .catch(() => {});
      if (lead) setAssignedTo(lead.assignedTo?._id || lead.assignedTo || "");
    }
  }, [show, lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await assignLead(lead._id, { assignedTo: assignedTo || null });
      refreshData();
      onClose();
    } catch (err) { 
      alert("Error assigning lead: " + (err.response?.data?.message || err.message)); 
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
              <h6 className="fw-bold text-dark mb-0">Assign Lead</h6>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-3">
                <p className="small text-muted mb-3">
                  Lead: <strong className="text-dark">{lead.firstName} {lead.lastName}</strong>
                </p>
                
                <label className="form-label small fw-semibold">Select Sales Rep</label>
                <select 
                  className="form-select bg-light shadow-none fw-medium" 
                  value={assignedTo} 
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">-- Unassigned --</option>
                  {usersList.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button 
                  type="button" 
                  className="btn btn-light rounded-pill px-4 fw-semibold shadow-sm border" 
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
                  {loading ? "Assigning..." : "Assign"}
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

export default AssignLeadModal;