import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RoleTable from "./RoleTable";
import RoleModal from "./RoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import { getRoles, createRole, updateRole, deleteRole, toggleRoleStatus } from "../../services/role";
import { toast } from "react-toastify";

let cachedRolesByPage = {};

function Roles() {
  const [roles, setRoles] = useState(cachedRolesByPage[1]?.roles || []);
  const [paginationData, setPaginationData] = useState(cachedRolesByPage[1]?.pagination || null);

  const [loading, setLoading] = useState(!cachedRolesByPage[1]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchRolesData = async (page = 1, forceRefresh = false) => {
    if (cachedRolesByPage[page] && !forceRefresh) {
      setRoles(cachedRolesByPage[page].roles);
      setPaginationData(cachedRolesByPage[page].pagination);
      setLoading(false);
    }

    try {
      if (!cachedRolesByPage[page] && Object.keys(cachedRolesByPage).length === 0) {
        setLoading(true);
      }

      const res = await getRoles({ page, limit: 10 });

      const fetchedRoles = res.success ? res.data.roles : res.roles || [];
      const fetchedPagination = res.success ? res.data.pagination : res.pagination || null;

      cachedRolesByPage[page] = { roles: fetchedRoles, pagination: fetchedPagination };

      setRoles(fetchedRoles);
      setPaginationData(fetchedPagination);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData(currentPage);
  }, [currentPage]);

  const refreshAfterAction = () => {
    cachedRolesByPage = {};
    fetchRolesData(currentPage, true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    setSelectedRole(null);
    setShowModal(true);
  };


  const handleToggleStatus = async (role) => {
    try {
      const newStatus = !role.isActive;

      const response = await toggleRoleStatus(role._id, newStatus);

      toast.success(response?.message || `Role ${newStatus ? 'activated' : 'deactivated'} successfully`);

      const updatedRoles = roles.map((r) =>
        r._id === role._id ? { ...r, isActive: newStatus } : r
      );

      setRoles(updatedRoles);

      if (cachedRolesByPage[currentPage]) {
        cachedRolesByPage[currentPage].roles = updatedRoles;
      }


    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role status.");
    }
  };

  const handleSaveRole = async (formData) => {
    try {
      let response;
      if (selectedRole) {
        response = await updateRole(selectedRole._id, formData);
      } else {
        response = await createRole(formData);
      }

      if (response && (response.success || response.message || response.data)) {
        toast.success(response.message || (selectedRole ? "Role updated successfully" : "New role created successfully"));
        setShowModal(false);
        refreshAfterAction();
      } else {
        toast.error(response?.message || "Failed to save role.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while saving role.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    try {
      const response = await deleteRole(selectedRole._id);
      
      toast.success(response?.message || "Role deleted successfully");
      setShowDeleteModal(false);
      
      const updatedRoles = roles.filter(r => r._id !== selectedRole._id);
      setRoles(updatedRoles); 
      
      if (cachedRolesByPage[currentPage]) {
        cachedRolesByPage[currentPage].roles = updatedRoles;
      }
      
      refreshAfterAction(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while deleting role.");
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-2 d-flex flex-column" style={{ minHeight: "calc(100vh - 80px)" }}>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Roles Management</h3>
            <p className="text-muted mb-0 small">Define and manage access levels and permissions.</p>
          </div>
          <button
            className="btn text-white fw-semibold shadow-sm px-4 rounded-pill d-flex align-items-center gap-2"
            style={{ backgroundColor: "#FF6600", transition: "0.3s" }}
            onClick={openAddModal}
            onMouseOver={(e) => e.target.style.backgroundColor = "#E05500"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#FF6600"}
          >
            <i className="bi bi-shield-plus"></i> Add Role
          </button>
        </div>

        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center w-100 flex-grow-1" style={{ minHeight: "50vh" }}>
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status"></div>
            <p className="text-muted mt-3 fw-semibold">Loading roles...</p>
          </div>
        ) : (
          <RoleTable
            roles={roles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            pagination={paginationData}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        <RoleModal
          show={showModal}
          title={selectedRole ? "Edit Role" : "Create New Role"}
          selectedRole={selectedRole}
          onClose={() => setShowModal(false)}
          onSave={handleSaveRole}
        />

        <DeleteRoleModal
          show={showDeleteModal}
          role={selectedRole}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />

      </div>
    </DashboardLayout>
  );
}

export default Roles;