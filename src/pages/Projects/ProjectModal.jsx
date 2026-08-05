import React, { useEffect, useState, useMemo } from "react";
import SearchableDropdown from "../../components/common/SearchableDropdown"; 
import { 
  createProject, 
  updateProject, 
  changeManager, 
  assignMembers, 
  removeMember 
} from "../../services/project";
import { getUsers } from "../../services/user"; 

const PROJECT_STATUSES = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'];
const PROJECT_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

function ProjectModal({ show, selectedProject, onClose, refreshData }) {
  const [activeTab, setActiveTab] = useState("basic"); 
  const [loading, setLoading] = useState(false);
  
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    startDate: "",
    endDate: "",
    projectManager: "",
    teamMembers: [],
  });

  const [localManager, setLocalManager] = useState(null); 
  const [selectedNewManager, setSelectedNewManager] = useState(""); 
  
  const [localMembers, setLocalMembers] = useState([]); 
  const [selectedNewMember, setSelectedNewMember] = useState("");

  useEffect(() => {
    if (show) {
      if (selectedProject) {
        setFormData({
          name: selectedProject.name || "",
          description: selectedProject.description || "",
          status: selectedProject.status || "Planning",
          priority: selectedProject.priority || "Medium",
          startDate: selectedProject.startDate ? selectedProject.startDate.split('T')[0] : "",
          endDate: selectedProject.endDate ? selectedProject.endDate.split('T')[0] : "",
          projectManager: selectedProject.projectManager?._id || selectedProject.projectManager || "",
          teamMembers: selectedProject.teamMembers?.map(m => m._id || m) || [],
        });
        
        setLocalManager(selectedProject.projectManager || null);
        setLocalMembers(selectedProject.teamMembers || []);
        setActiveTab("basic"); 
      } else {
        setFormData({ 
          name: "", description: "", status: "Planning", priority: "Medium", 
          startDate: "", endDate: "", projectManager: "", teamMembers: [] 
        });
        setLocalManager(null);
        setLocalMembers([]);
        setActiveTab("basic");
      }
      setSelectedNewManager("");
      setSelectedNewMember("");
    }
  }, [selectedProject, show]);

  // 2. Fetch Users List
  useEffect(() => {
    if (show && usersList.length === 0) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await getUsers();
          setUsersList(res.success ? res.data : (Array.isArray(res) ? res : []));
        } catch (err) {
          console.error("Failed to fetch users", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [show, usersList.length]);

  useEffect(() => {
    if (show && selectedProject && usersList.length > 0) {
      // Find Manager Object from ID
      const mId = selectedProject.projectManager?._id || selectedProject.projectManager;
      if (mId) {
        const mObj = usersList.find(u => u._id === mId);
        if (mObj) setLocalManager(mObj);
      }

      // Find Members Objects from IDs
      const tIds = selectedProject.teamMembers?.map(m => m._id || m) || [];
      if (tIds.length > 0) {
        const tObjs = tIds.map(id => usersList.find(u => u._id === id)).filter(Boolean);
        if (tObjs.length > 0) setLocalMembers(tObjs);
      }
    }
  }, [usersList, selectedProject, show]);

  const managerOptions = useMemo(() => {
    return usersList.map(u => {
      const isCurrent = (localManager?._id || localManager) === u._id;
      return {
        value: u._id,
        label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        subLabel: isCurrent ? "Current Manager" : u.email,
        avatar: (u.firstName?.charAt(0) || u.email?.charAt(0) || 'U').toUpperCase(),
        disabled: isCurrent 
      };
    });
  }, [usersList, localManager]);

  const teamOptions = useMemo(() => {
    return usersList.map(u => {
      const isAdded = localMembers.some(m => (m._id || m) === u._id);
      return {
        value: u._id,
        label: isAdded ? `${u.firstName || ''} ${u.lastName || ''} (Already Added)` : `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        subLabel: isAdded ? "Already in team" : u.email,
        avatar: (u.firstName?.charAt(0) || u.email?.charAt(0) || 'U').toUpperCase(),
        disabled: isAdded 
      };
    });
  }, [usersList, localMembers]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedProject) {
        const updatePayload = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        };
        await updateProject(selectedProject._id, updatePayload);
      } else {
        const createPayload = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          projectManager: formData.projectManager || null,
          teamMembers: formData.teamMembers 
        };
        if (!createPayload.startDate) delete createPayload.startDate;
        if (!createPayload.endDate) delete createPayload.endDate;
        if (!createPayload.projectManager) delete createPayload.projectManager;

        await createProject(createPayload);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert("Error saving project: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateManager = async () => {
    if (!selectedNewManager) return alert("Please select a new manager first.");
    try {
      await changeManager(selectedProject._id, { projectManager: selectedNewManager });
      const newManagerData = usersList.find(u => u._id === selectedNewManager);
      setLocalManager(newManagerData); 
      setSelectedNewManager(""); 
      refreshData(); 
    } catch (err) {
      alert("Failed to update manager: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddMember = async () => {
    if (!selectedNewMember) return alert("Please select a user to add.");
    if (localMembers.some(m => (m._id || m) === selectedNewMember)) return alert("User is already in the team.");
    try {
      await assignMembers(selectedProject._id, { teamMembers: [selectedNewMember] });
      const newMemberData = usersList.find(u => u._id === selectedNewMember);
      setLocalMembers([...localMembers, newMemberData]); 
      setSelectedNewMember(""); 
      refreshData(); 
    } catch (err) {
      alert("Failed to add member: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await removeMember(selectedProject._id, { teamMember: memberId });
      setLocalMembers(localMembers.filter(m => m._id !== memberId)); 
      refreshData();
    } catch (err) {
      alert("Failed to remove member: " + (err.response?.data?.message || err.message));
    }
  };

  const getManagerDisplay = () => {
    if (localManager && localManager.firstName) {
      return `${localManager.firstName} ${localManager.lastName || ''}`;
    }
    if (typeof localManager === 'string') return "Loading name...";
    return "Unassigned";
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ overflow: "visible" }}>
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-visible">
            
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-center">
              <h5 className="fw-bold text-dark mb-0">
                {selectedProject ? "Manage Project" : "Create New Project"}
              </h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            {selectedProject && (
              <div className="px-4 mt-3">
                <ul className="nav nav-pills gap-2 border-bottom pb-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link rounded-pill px-4 py-2 fw-semibold ${activeTab === 'basic' ? 'active shadow-sm' : 'bg-light text-muted'}`}
                      style={activeTab === 'basic' ? { backgroundColor: "#FF6600", color: "white" } : {}}
                      onClick={() => setActiveTab('basic')}
                    >
                      <i className="bi bi-info-circle me-2"></i> Basic Info
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link rounded-pill px-4 py-2 fw-semibold ${activeTab === 'team' ? 'active shadow-sm' : 'bg-light text-muted'}`}
                      style={activeTab === 'team' ? { backgroundColor: "#FF6600", color: "white" } : {}}
                      onClick={() => setActiveTab('team')}
                    >
                      <i className="bi bi-people me-2"></i> Team & Manager
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <div className="modal-body px-4 py-4">
              
              {activeTab === "basic" && (
                <form id="basic-form" onSubmit={handleBasicSubmit}>
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold mb-1">Project Name</label>
                      <input required type="text" className="form-control bg-light shadow-none" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold mb-1">Description</label>
                      <textarea required rows="3" className="form-control bg-light shadow-none" name="description" value={formData.description} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Status</label>
                      <select className="form-select bg-light shadow-none" name="status" value={formData.status} onChange={handleChange}>
                        {PROJECT_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Priority</label>
                      <select className="form-select bg-light shadow-none" name="priority" value={formData.priority} onChange={handleChange}>
                        {PROJECT_PRIORITIES.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Start Date</label>
                      <input type="date" className="form-control bg-light shadow-none text-muted" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">End Date</label>
                      <input type="date" className="form-control bg-light shadow-none text-muted" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </div>

                    {!selectedProject && (
                      <div className="col-md-12 position-relative">
                        <SearchableDropdown
                          label="Assign Project Manager (Optional)"
                          placeholder={loadingUsers ? "Loading users..." : "Search user by name or email..."}
                          options={managerOptions} 
                          value={formData.projectManager}
                          onSelect={(val) => handleDropdownChange('projectManager', val)}
                        />
                      </div>
                    )}
                  </div>
                </form>
              )}

              {activeTab === "team" && (
                <div className="row g-4">
                  <div className="col-12">
                    <div className="card bg-light border-0 rounded-4 p-3">
                      <h6 className="fw-bold text-dark mb-3"><i className="bi bi-person-badge text-primary me-2"></i>Project Manager</h6>
                      
                      <div className="d-flex align-items-center mb-3 p-2 bg-white rounded-3 shadow-sm border">
                        <div className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center fw-bold me-3" style={{ width: "40px", height: "40px" }}>
                          {localManager?.firstName?.charAt(0) || "M"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-0">{getManagerDisplay()}</div>
                          <div className="small text-muted">{localManager?.email || "No manager assigned"}</div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <div className="flex-grow-1 position-relative">
                          <SearchableDropdown
                            label=""
                            placeholder={loadingUsers ? "Loading users..." : "Search user to assign as manager..."}
                            options={managerOptions} 
                            value={selectedNewManager}
                            onSelect={(val) => setSelectedNewManager(val)}
                          />
                        </div>
                        <button className="btn btn-dark fw-semibold px-4 rounded-3 shadow-sm" onClick={handleUpdateManager}>
                          Update
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <hr className="text-muted opacity-25 my-1" />
                    <h6 className="fw-bold text-dark mb-3 mt-2"><i className="bi bi-people text-primary me-2"></i>Team Members ({localMembers.length})</h6>
                    
                    <div className="d-flex gap-2 mb-3">
                      <div className="flex-grow-1 position-relative">
                        <SearchableDropdown
                          label=""
                          placeholder={loadingUsers ? "Loading users..." : "Search user to add to team..."}
                          options={teamOptions} 
                          value={selectedNewMember}
                          onSelect={(val) => setSelectedNewMember(val)}
                        />
                      </div>
                      <button className="btn fw-semibold text-white px-4 rounded-3 shadow-sm" style={{ backgroundColor: "#FF6600" }} onClick={handleAddMember}>
                        Add Member
                      </button>
                    </div>

                    <div className="card border rounded-3 overflow-hidden">
                      <ul className="list-group list-group-flush">
                        {localMembers.length > 0 ? localMembers.map(member => (
                          <li key={member._id || member} className="list-group-item d-flex justify-content-between align-items-center p-3 hover-bg-light" style={{ transition: "0.2s" }}>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex justify-content-center align-items-center fw-bold me-3" style={{ width: "35px", height: "35px" }}>
                                {member.firstName?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
                                  {member.firstName ? `${member.firstName} ${member.lastName || ''}` : "Loading name..."}
                                </div>
                                <div className="small text-muted">{member.email || `ID: ${member._id || member}`}</div>
                              </div>
                            </div>
                            <button className="btn btn-sm btn-light text-danger rounded-circle shadow-sm" onClick={() => handleRemoveMember(member._id || member)} title="Remove Member">
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </li>
                        )) : (
                          <li className="list-group-item text-center text-muted py-4 small bg-light">
                            No team members added yet. Search above to add one.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold shadow-sm" onClick={onClose} disabled={loading}>
                {activeTab === "basic" ? "Cancel" : "Close"}
              </button>
              
              {activeTab === "basic" && (
                <button type="submit" form="basic-form" className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" style={{ backgroundColor: "#FF6600" }} disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : selectedProject ? "Update Info" : "Create Project"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ProjectModal;