import { useEffect, useState, useMemo } from "react";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { getDepartments } from "../../services/department";
import { getPermissions } from "../../services/permission";

// 🚀 CACHE MEMORY - Data ek hi baar load hoga
let cachedDepartments = null;
let cachedPermissions = null;

function RoleModal({ show, title, selectedRole, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    description: "",
    isActive: true,
    permissions: [],
  });

  const [departmentsList, setDepartmentsList] = useState(cachedDepartments || []);
  const [allPermissions, setAllPermissions] = useState(cachedPermissions || []);
  const [loadingData, setLoadingData] = useState(!cachedDepartments);

 
  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        if (cachedDepartments && cachedPermissions) {
          setDepartmentsList(cachedDepartments);
          setAllPermissions(cachedPermissions);
          return;
        }

        setLoadingData(true);
        try {
          const [deptRes, permRes] = await Promise.all([
            getDepartments(1, 100),
            getPermissions(1000)
          ]);
          
          // Fetch hone ke baad cache variables mein save kar lo
          cachedDepartments = deptRes.success || deptRes.data ? (deptRes.data || []) : [];
          let fetchedPerms = permRes.success ? permRes.data : permRes;
          cachedPermissions = Array.isArray(fetchedPerms) ? fetchedPerms : [];
          
          setDepartmentsList(cachedDepartments);
          setAllPermissions(cachedPermissions);
        } catch (err) {
          console.error("Failed to fetch dependencies", err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [show]);

  // Group permissions by module for the UI Grid
  const groupedPermissions = useMemo(() => {
    return allPermissions.reduce((acc, perm) => {
      const moduleNameRaw = perm.module || (perm.name ? perm.name.split('.')[0] : 'General');
      const moduleName = moduleNameRaw.charAt(0).toUpperCase() + moduleNameRaw.slice(1);
      if (!acc[moduleName]) acc[moduleName] = [];
      acc[moduleName].push(perm);
      return acc;
    }, {});
  }, [allPermissions]);

  // Format departments for the dropdown
  const formattedDepartments = useMemo(() => {
    return departmentsList.map(d => ({
      value: d._id,
      label: d.name,
      subLabel: `Code: ${d.code}`,
      avatar: d.name.charAt(0).toUpperCase()
    }));
  }, [departmentsList]);

  // Initialize form when Edit/Add opens
  useEffect(() => {
    if (selectedRole) {
      setFormData({
        name: selectedRole.name || "",
        department: typeof selectedRole.department === 'object' ? selectedRole.department?._id : selectedRole.department || "",
        description: selectedRole.description || "",
        isActive: selectedRole.isActive ?? true,
        permissions: selectedRole.permissions?.map(p => p._id || p) || [], 
      });
    } else {
      setFormData({
        name: "", department: "", description: "", isActive: true, permissions: [],
      });
    }
  }, [selectedRole, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const value = e.target.name === 'isActive' ? e.target.value === 'true' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handlePermissionToggle = (permId) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: isSelected 
          ? prev.permissions.filter(id => id !== permId) 
          : [...prev.permissions, permId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-xl modal-dialog-centered" style={{ overflow: 'visible' }}>
          <div className="modal-content border-0 shadow-lg rounded-4" style={{ overflow: 'visible' }}>
            
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
              <h5 className="fw-bold text-dark mb-0">{title}</h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-4">
                {loadingData ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                  <div className="row g-4">
                    
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Role Name</label>
                      <input required className="form-control bg-light shadow-none" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Area Manager" />
                    </div>

                    <div className="col-md-6 position-relative">
                      <SearchableDropdown label="Assign to Department (Optional)" placeholder="Global Role (Applies to all) or Select..." options={formattedDepartments} value={formData.department} onSelect={(val) => setFormData({...formData, department: val})} />
                    </div>

                    <div className="col-md-9">
                      <label className="form-label text-muted small fw-semibold mb-1">Description</label>
                      <input required className="form-control bg-light shadow-none" name="description" value={formData.description} onChange={handleChange} placeholder="What does this role do?" />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-muted small fw-semibold mb-1">Status</label>
                      <select className="form-select bg-light shadow-none" name="isActive" value={formData.isActive} onChange={handleChange}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>

                    <div className="col-12 mt-4">
                      <hr className="text-muted opacity-25 mb-4" />
                      <h6 className="fw-bold text-dark mb-3"><i className="bi bi-shield-check text-primary me-2"></i>Access Permissions</h6>
                      
                      <div className="row g-4">
                        {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                          <div className="col-12 col-md-6 col-lg-4" key={moduleName}>
                            <div className="card h-100 border bg-light shadow-sm rounded-3">
                              <div className="card-header bg-white border-bottom py-2 fw-bold text-secondary small">
                                {moduleName} Module
                              </div>
                              <div className="card-body p-3">
                                {perms.map(perm => (
                                  <div className="form-check form-switch mb-2" key={perm._id}>
                                    <input 
                                      className="form-check-input" 
                                      type="checkbox" 
                                      id={`perm-${perm._id}`}
                                      checked={formData.permissions.includes(perm._id)}
                                      onChange={() => handlePermissionToggle(perm._id)}
                                    />
                                    <label className="form-check-label text-dark small ms-1" htmlFor={`perm-${perm._id}`} title={perm.description}>
                                      {perm.name.split('.').pop().toUpperCase()} 
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              <div className="modal-footer border-top-0 pt-0 px-4 pb-4 mt-3">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" style={{ backgroundColor: "#FF6600" }} disabled={loadingData}>
                  {selectedRole ? "Update Role & Permissions" : "Create Role"}
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

export default RoleModal;