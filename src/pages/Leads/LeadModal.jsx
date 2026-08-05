import React, { useState, useEffect } from "react";
import { createLead, updateLead } from "../../services/lead";
import { getUsers } from "../../services/user";
import { getDepartments } from "../../services/department"; 

const LEAD_SOURCES = ['Website', 'Facebook', 'Google Ads', 'Referral', 'Cold Call', 'WhatsApp', 'Other'];
// Updated Statuses matching backend
const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost', 'Junk'];
const LEAD_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

function LeadModal({ show, selectedLead, onClose, refreshData }) {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    source: "Website", status: "New", priority: "Medium",
    assignedTo: "", departmentId: "", estimatedValue: 0, 
    tags: "", notes: "", followUpDate: "" 
  });
  
  const [usersList, setUsersList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      // Fetch dropdown data
      getUsers().then(res => setUsersList(res.success ? res.data : (Array.isArray(res) ? res : []))).catch(() => {});
      if (getDepartments) {
        getDepartments().then(res => setDepartmentsList(res.success ? res.data : (Array.isArray(res) ? res : []))).catch(() => {});
      }

      if (selectedLead) {
        setFormData({
          firstName: selectedLead.firstName || "",
          lastName: selectedLead.lastName || "",
          email: selectedLead.email || "",
          phone: selectedLead.phone || "",
          company: selectedLead.company || "",
          source: selectedLead.source || "Website",
          status: selectedLead.status || "New",
          priority: selectedLead.priority || "Medium",
          assignedTo: selectedLead.assignedTo?._id || selectedLead.assignedTo || "",
          departmentId: selectedLead.department?._id || selectedLead.department || "",
          
          // Array to Comma-Separated String
          tags: selectedLead.tags && Array.isArray(selectedLead.tags) ? selectedLead.tags.join(", ") : "",
          estimatedValue: selectedLead.estimatedValue || 0,
          notes: selectedLead.notes || "",
          followUpDate: selectedLead.followUpDate ? selectedLead.followUpDate.split('T')[0] : "",
        });
      } else {
        setFormData({ 
          firstName: "", lastName: "", email: "", phone: "", company: "", 
          source: "Website", status: "New", priority: "Medium", 
          assignedTo: "", departmentId: "", estimatedValue: 0, 
          tags: "", notes: "", followUpDate: ""
        });
      }
    }
  }, [show, selectedLead]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.followUpDate) delete payload.followUpDate;
      
      // Map departmentId to department field for backend schema
      if (payload.departmentId) {
        payload.department = payload.departmentId;
      }
      delete payload.departmentId;

      //  Tags String ko wapas Array me convert karna
      if (payload.tags && typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
      } else {
        payload.tags = [];
      }

      if (selectedLead) {
        await updateLead(selectedLead._id, payload);
      } else {
        await createLead(payload);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0">
                {selectedLead ? "Edit Lead Details" : "Create New Lead"}
              </h5>
              
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  {/* Basic Info */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">First Name *</label>
                    <input required type="text" className="form-control bg-light shadow-none" name="firstName" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Last Name</label>
                    <input type="text" className="form-control bg-light shadow-none" name="lastName" value={formData.lastName} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number *</label>
                    <input required type="text" className="form-control bg-light shadow-none" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input type="email" className="form-control bg-light shadow-none" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Company Name</label>
                    <input type="text" className="form-control bg-light shadow-none" name="company" value={formData.company} onChange={handleChange} />
                  </div>

                  <hr className="my-4 text-muted" />

                  {/* CRM Info */}
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Lead Source</label>
                    <select className="form-select bg-light shadow-none" name="source" value={formData.source} onChange={handleChange}>
                      {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Status</label>
                    <select className="form-select bg-light shadow-none" name="status" value={formData.status} onChange={handleChange}>
                      {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Priority</label>
                    <select className="form-select bg-light shadow-none" name="priority" value={formData.priority} onChange={handleChange}>
                      {LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Estimated Value (₹)</label>
                    <input type="number" min="0" className="form-control bg-light shadow-none" name="estimatedValue" value={formData.estimatedValue} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Follow Up Date</label>
                    <input type="date" className="form-control bg-light shadow-none text-muted" name="followUpDate" value={formData.followUpDate} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Assign User</label>
                    <select className="form-select bg-light shadow-none" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                      <option value="">Unassigned</option>
                      {usersList.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Department</label>
                    <select className="form-select bg-light shadow-none" name="departmentId" value={formData.departmentId} onChange={handleChange}>
                      <option value="">Select Department</option>
                      {departmentsList.map(d => <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label small fw-semibold">Tags <span className="text-muted fw-normal">(comma separated)</span></label>
                    <input type="text" className="form-control bg-light shadow-none" name="tags" placeholder="e.g. CRM, Hot Lead, B2B" value={formData.tags} onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Notes</label>
                    <textarea rows="3" className="form-control bg-light shadow-none" name="notes" value={formData.notes} onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" style={{ backgroundColor: "#FF6600" }} disabled={loading}>
                  {loading ? "Saving..." : "Save Lead"}
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

export default LeadModal;