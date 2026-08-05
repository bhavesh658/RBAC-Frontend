import { useEffect, useState, useMemo } from "react";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Ensure path is correct
import { getUsers } from "../../services/user"; // 👈 User API import ki hai

function DepartmentModal({ show, title, selectedDepartment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    head: "", 
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchUsersData = async () => {
        setLoadingUsers(true);
        try {
          const res = await getUsers();
          const data = res.success ? res.data : (Array.isArray(res) ? res : []);
          setUsersList(data);
        } catch (err) {
          console.error("Failed to fetch users", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsersData();
    }
  }, [show]);

  const formattedUsers = useMemo(() => {
    return usersList.map(u => ({
      value: u._id,
      label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      subLabel: u.email,
      avatar: (u.firstName?.charAt(0) || u.email?.charAt(0) || 'U').toUpperCase()
    }));
  }, [usersList]);

  useEffect(() => {
    if (selectedDepartment) {
      setFormData({
        name: selectedDepartment.name || "",
        code: selectedDepartment.code || "",
        description: selectedDepartment.description || "",
        head: selectedDepartment.head?._id || selectedDepartment.head || "",
        isActive: selectedDepartment.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        head: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [selectedDepartment, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const value = e.target.name === 'isActive' ? e.target.value === 'true' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.code.trim()) newErrors.code = "Department code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ overflow: "visible" }}>
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-visible">
            
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
              <h5 className="fw-bold text-dark mb-0">{title}</h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-4">
                <div className="row g-4">
                  
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold mb-1">Department Name</label>
                    <input
                      type="text"
                      className={`form-control bg-light ${errors.name ? "is-invalid" : ""}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Human Resources"
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold mb-1">Department Code</label>
                    <input
                      type="text"
                      className={`form-control bg-light ${errors.code ? "is-invalid" : ""}`}
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g. HR-01"
                    />
                    <div className="invalid-feedback">{errors.code}</div>
                  </div>

                  <div className="col-md-12 position-relative">
                    <SearchableDropdown
                      label={loadingUsers ? "Loading Users..." : "Assign Head (Select User)"}
                      placeholder="Search User by name or email..."
                      options={formattedUsers}
                      value={formData.head}
                      onSelect={(val) => handleDropdownChange('head', val)}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label text-muted small fw-semibold mb-1">Description</label>
                    <textarea
                      rows="3"
                      className="form-control bg-light shadow-none"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief details about the department..."
                    />
                  </div>

                  {!selectedDepartment && (
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold mb-1">Status</label>
                      <select
                        className="form-select bg-light shadow-none"
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleChange}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  )}

                </div>
              </div>

              <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn text-white rounded-pill px-4 fw-semibold shadow-sm"
                  style={{ backgroundColor: "#FF6600" }}
                >
                  {selectedDepartment ? "Update Department" : "Add Department"}
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

export default DepartmentModal;