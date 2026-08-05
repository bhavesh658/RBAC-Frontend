import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../../services/task";
import { getProjects } from "../../services/project";
import { getUsers } from "../../services/user";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import toast from "react-hot-toast"; 

const TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Testing', 'Completed', 'Blocked'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

function TaskModal({ show, selectedTask, onClose, refreshData }) {
  const [formData, setFormData] = useState({
    title: "", description: "", project: "", assignedTo: "",
    status: "Todo", priority: "Medium", startDate: "", dueDate: ""
  });
  
  const [projectsList, setProjectsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      getProjects({ limit: 100 }).then(res => setProjectsList(res.data?.projects || res.projects || []));
      getUsers(1,100    ).then(res => setUsersList(res.success ? res.data : (Array.isArray(res) ? res : [])));

      if (selectedTask) {
        setFormData({
          title: selectedTask.title || "",
          description: selectedTask.description || "",
          project: selectedTask.project?._id || selectedTask.project || "",
          assignedTo: selectedTask.assignedTo?._id || selectedTask.assignedTo || "",
          status: selectedTask.status || "Todo",
          priority: selectedTask.priority || "Medium",
          startDate: selectedTask.startDate ? selectedTask.startDate.split('T')[0] : "",
          dueDate: selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : "",
        });
      } else {
        setFormData({ title: "", description: "", project: "", assignedTo: "", status: "Todo", priority: "Medium", startDate: "", dueDate: "" });
      }
    }
  }, [show, selectedTask]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Custom handler for Searchable Dropdown
  const handleDropdownSelect = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Manual validation for Project since native 'required' won't work on custom component
    if (!formData.project) {
      alert("Please select a project.");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.startDate) delete payload.startDate;
      if (!payload.dueDate) delete payload.dueDate;

      if (selectedTask) {
        await updateTask(selectedTask._id, payload);
      } else {
        await createTask(payload);
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

  // Format data for SearchableDropdown
  const projectOptions = projectsList.map(p => ({
    value: p._id,
    label: p.name
  }));

  const userOptions = usersList.map(u => ({
    value: u._id,
    label: `${u.firstName} ${u.lastName}`,
    subLabel: u.email || "" // Extra UI detail for your dropdown
  }));

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pt-4 px-4">
              <h5 className="fw-bold text-dark mb-0">{selectedTask ? "Edit Task" : "Create New Task"}</h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Task Title *</label>
                    <input required type="text" className="form-control bg-light shadow-none" name="title" value={formData.title} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea rows="2" className="form-control bg-light shadow-none" name="description" value={formData.description} onChange={handleChange}></textarea>
                  </div>
                  
                  {/* Integrated SearchableDropdown for Project */}
                  <div className="col-md-6">
                    <SearchableDropdown
                      label="Project *"
                      placeholder="Select Project..."
                      options={projectOptions}
                      value={formData.project}
                      onSelect={(val) => handleDropdownSelect("project", val)}
                    />
                  </div>

                  {/* Integrated SearchableDropdown for Assign To */}
                  <div className="col-md-6">
                    <SearchableDropdown
                      label="Assign To"
                      placeholder="Unassigned"
                      options={userOptions}
                      value={formData.assignedTo}
                      onSelect={(val) => handleDropdownSelect("assignedTo", val)}
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <label className="form-label small fw-semibold">Status</label>
                    <select className="form-select bg-light shadow-none" name="status" value={formData.status} onChange={handleChange}>
                      {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mt-3">
                    <label className="form-label small fw-semibold">Priority</label>
                    <select className="form-select bg-light shadow-none" name="priority" value={formData.priority} onChange={handleChange}>
                      {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Start Date</label>
                    <input type="date" className="form-control bg-light shadow-none text-muted" name="startDate" value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Due Date</label>
                    <input type="date" className="form-control bg-light shadow-none text-muted" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-top-0 px-4 pb-4">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" style={{ backgroundColor: "#FF6600" }} disabled={loading}>
                  {loading ? "Saving..." : "Save Task"}
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

export default TaskModal;