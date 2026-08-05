import React, { useState, useEffect } from "react";
import { assignTask } from "../../services/task";
import { getUsers } from "../../services/user";

function AssignTaskModal({ show, task, onClose, refreshData }) {
  const [assignedTo, setAssignedTo] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      getUsers().then(res => setUsersList(res.success ? res.data : (Array.isArray(res) ? res : [])));
      if (task) {
        setAssignedTo(task.assignedTo?._id || task.assignedTo || "");
      }
    }
  }, [show, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await assignTask(task._id, { assignedTo: assignedTo || null });
      refreshData();
      onClose();
    } catch (err) {
      alert("Failed to assign task: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!show || !task) return null;

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pt-4 px-4">
              <h6 className="fw-bold text-dark mb-0">Assign Task</h6>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-3">
                <p className="small text-muted mb-3">Task: <strong className="text-dark">{task.title}</strong></p>
                <label className="form-label small fw-semibold">Select User</label>
                <select className="form-select bg-light shadow-none" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">Unassigned</option>
                  {usersList.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
              
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-dark rounded-pill px-4 fw-semibold shadow-sm" disabled={loading}>
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

export default AssignTaskModal;