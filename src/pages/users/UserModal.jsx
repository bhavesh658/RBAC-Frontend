import { useEffect, useState, useMemo } from "react";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { getDepartments } from "../../services/department";
import { getRoles } from "../../services/role"; 

function UserModal({ show, title, selectedUser, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "", 
    department: "",
    role: "",
    isActive: true,
  });

  const [departmentsList, setDepartmentsList] = useState([]);
  const [rolesList, setRolesList] = useState([]); 
  const [loadingData, setLoadingData] = useState(false);

  // 🚀 Helper function to safely extract arrays from API responses
  const extractArrayData = (res, key) => {
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.data?.[key] && Array.isArray(res.data[key])) return res.data[key];
    if (res?.[key] && Array.isArray(res[key])) return res[key];
    return [];
  };

  useEffect(() => {
    if (show) {
      const fetchDropdownData = async () => {
        setLoadingData(true);
        try {
          const [deptRes, roleRes] = await Promise.all([
            getDepartments(1, 100),
            getRoles()
          ]);
          
          // 🚀 Safely setting states ensuring they are always arrays
          setDepartmentsList(extractArrayData(deptRes, 'departments'));
          setRolesList(extractArrayData(roleRes, 'roles'));

        } catch (err) {
          console.error("Failed to fetch dropdown data", err);
          // Fallback to empty arrays on error to prevent crashes
          setDepartmentsList([]);
          setRolesList([]);
        } finally {
          setLoadingData(false);
        }
      };
      
      fetchDropdownData();
    }
  }, [show]);

  // Format data for Dropdowns with safety checks
  const formattedDepartments = useMemo(() => {
    // 🚀 Extra safety: Only map if it's an array
    if (!Array.isArray(departmentsList)) return [];
    return departmentsList.map(d => ({
      value: d._id,
      label: d.name || 'Unknown',
      subLabel: `Code: ${d.code || 'N/A'}`,
      avatar: d.name ? d.name.charAt(0).toUpperCase() : 'D'
    }));
  }, [departmentsList]);

  const formattedRoles = useMemo(() => {
    // 🚀 Extra safety: Only map if it's an array
    if (!Array.isArray(rolesList)) return [];
    return rolesList.map(r => ({
      value: r._id,
      label: r.name || 'Unknown',
      subLabel: r.description ? (r.description.substring(0, 25) + '...') : 'System Role',
      avatar: r.name ? r.name.charAt(0).toUpperCase() : 'R'
    }));
  }, [rolesList]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        phone: selectedUser.phone || "",
        password: "", 
        department: typeof selectedUser.department === 'object' ? selectedUser.department?._id : selectedUser.department || "",
        role: typeof selectedUser.role === 'object' ? selectedUser.role?._id : selectedUser.role || "",
        isActive: selectedUser.isActive ?? true,
      });
    } else {
      setFormData({
        firstName: "", lastName: "", email: "", phone: "", password: "", department: "", role: "", isActive: true,
      });
    }
  }, [selectedUser, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const value = e.target.name === 'isActive' ? e.target.value === 'true' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (selectedUser) delete payload.password;
    onSave(payload);
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ overflow: 'visible' }}>
          <div className="modal-content border-0 shadow-lg rounded-4" style={{ overflow: 'visible' }}>
            
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
              <h5 className="fw-bold text-dark mb-0">{title}</h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-4">
                <div className="row g-4">
                  
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold mb-1">First Name</label>
                    <input required className="form-control bg-light shadow-none" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold mb-1">Last Name</label>
                    <input className="form-control bg-light shadow-none" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold mb-1">Email Address</label>
                    <input required type="email" className="form-control bg-light shadow-none" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold mb-1">Phone Number</label>
                    <input className="form-control bg-light shadow-none" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" />
                  </div>

                  {!selectedUser && (
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Temporary Password</label>
                      <input required type="password" className="form-control bg-light shadow-none" name="password" value={formData.password} onChange={handleChange} placeholder="Enter temporary password" minLength="6" />
                    </div>
                  )}

                  {/* Departments Dropdown */}
                  <div className="col-md-6 position-relative">
                    <SearchableDropdown
                      label={loadingData ? "Loading..." : "Assign Department (Optional)"}
                      placeholder="Search Department..."
                      options={formattedDepartments}
                      value={formData.department}
                      onSelect={(val) => handleDropdownChange('department', val)}
                    />
                  </div>

                  {/* Roles Dropdown */}
                  <div className="col-md-6 position-relative">
                    <SearchableDropdown
                      label={loadingData ? "Loading..." : "Assign Role"}
                      placeholder="Search Role..."
                      options={formattedRoles} 
                      value={formData.role}
                      onSelect={(val) => handleDropdownChange('role', val)}
                    />
                  </div>

                  {!selectedUser && (
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Account Status</label>
                      <select className="form-select bg-light shadow-none" name="isActive" value={formData.isActive} onChange={handleChange}>
                        <option value="true">Active (Can Login)</option>
                        <option value="false">Inactive (Blocked)</option>
                      </select>
                    </div>
                  )}

                </div>
              </div>

              <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn text-white rounded-pill px-4 fw-semibold shadow-sm" style={{ backgroundColor: "#FF6600" }}>
                  {selectedUser ? "Update User" : "Create User"}
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

export default UserModal;