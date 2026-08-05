import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import DeleteUserModal from "./DeleteUserModal";
import { getUsers, createUser, updateUser, toggleUserStatus } from "../../services/user";
import { toast } from "react-toastify"; // 🚀 Toastify import kiya gaya hai

let userCache = {};
let globalTotalPages = 1;

function Users() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(globalTotalPages);

  // State ko sidha cache se initialize kar rahe hain
  const [users, setUsers] = useState(userCache[page] || []);
  const [loading, setLoading] = useState(!userCache[page]);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  // Helper function: Jo UI aur Current Page ke Cache dono ko ek sath update karega
  const updateDataAndCache = (newUsers) => {
    setUsers(newUsers);
    userCache[page] = newUsers;
  };

  const fetchUsers = async (currentPage, isPrefetch = false) => {
    try {
      if (!isPrefetch) {
        if (userCache[currentPage]) {
          setUsers(userCache[currentPage]);
          setLoading(false);
        } else {
          setLoading(true);
        }
        setError("");
      }

      const response = await getUsers(currentPage, limit);
      if (response.success || response.data) {
        const fetchedUsers = response.data || [];
        const fetchedTotalPages = response.totalPages || 1;

        // Data hamesha dictionary (cache) mein save karo
        userCache[currentPage] = fetchedUsers;

        // Sirf tab state update karo jab ye background call (prefetch) na ho
        if (!isPrefetch) {
          setUsers(fetchedUsers);
          setTotalPages(fetchedTotalPages);
          globalTotalPages = fetchedTotalPages;
        }
      }
    } catch (err) {
      if (!isPrefetch) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to fetch users.");
      }
    } finally {
      if (!isPrefetch) setLoading(false);
    }
  };

  // 1. Normal Fetch: Jab bhi user page change kare
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // 2. ⚡ THE MAGIC: BACKGROUND PRE-FETCHING
  useEffect(() => {
    if (page < totalPages && !userCache[page + 1]) {
      fetchUsers(page + 1, true); // true = isPrefetch
    }
  }, [page, totalPages]);

  const handleAdd = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // 🚀 Updated: Alert hatakar Toast add kiya aur API ka message use kiya
  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await toggleUserStatus(selectedUser._id);

      if (response && (response.success || response.message)) {
        toast.success(response.message || "User status updated successfully"); // Dynamic backend message
        
        const updatedUsers = users.map((u) =>
          u._id === selectedUser._id ? { ...u, isActive: !u.isActive } : u
        );
        updateDataAndCache(updatedUsers);
      } else {
        toast.error(response?.message || "Failed to update user status.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while updating status.");
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  // 🚀 Updated: Handle Save me bhi alert hatakar Toast add kiya hai
  const handleSave = async (formData) => {
    try {
      const submitData = { ...formData };
      
      if (submitData.department === "") {
        delete submitData.department;
      }
      if (submitData.role === "") {
        delete submitData.role;
      }

      if (selectedUser) {
        const response = await updateUser(selectedUser._id, submitData);
        if (response.success || response.data) {
          toast.success(response.message || "User details updated successfully");
          const updatedUser = response.data?.user || response.data || response;
          const updatedUsers = users.map((u) => (u._id === selectedUser._id ? updatedUser : u));
          updateDataAndCache(updatedUsers);
        } else {
          toast.error(response?.message || "Failed to update user.");
        }
      } else {
        const response = await createUser(submitData);
        if (response.success || response.data) {
          toast.success(response.message || "New user created successfully");
          const newUser = response.data?.user || response.data || response;
          const updatedUsers = [newUser, ...users];
          updateDataAndCache(updatedUsers);
        } else {
          toast.error(response?.message || "Failed to create user.");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while saving user.");
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search) return users;

    const keyword = search.toLowerCase();

    return users.filter((user) => {
      const fullName = (user.fullName || `${user.firstName || ""} ${user.lastName || ""}`).toLowerCase();
      const email = (user.email || "").toLowerCase();
      const department = (user.department?.name || user.department || "").toLowerCase();
      const role = (user.role?.name || user.role || "").toLowerCase();

      return (
        fullName.includes(keyword) ||
        email.includes(keyword) ||
        department.includes(keyword) ||
        role.includes(keyword)
      );
    });
  }, [users, search]);

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-0">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">User Management</h3>
            <p className="text-muted mb-0 small">Create, update, and manage system users.</p>
          </div>
          <button
            className="btn text-white fw-semibold shadow-sm px-4 rounded-pill d-flex align-items-center gap-2"
            style={{ backgroundColor: "#FF6600", transition: "0.3s" }}
            onClick={handleAdd}
            onMouseOver={(e) => e.target.style.backgroundColor = "#E05500"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#FF6600"}
          >
            <i className="bi bi-plus-lg"></i> Add New User
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-4">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 bg-light rounded-end-pill py-2 shadow-none"
                placeholder="Search by name, email, department, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* UI Rendering Logic */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 small">Loading users...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4 shadow-sm border-0 border-start border-danger border-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        ) : (
          <>
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 bg-white p-3 rounded-4 shadow-sm">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i> Prev
                </button>
                <span className="fw-semibold text-muted small">
                  Page <span className="text-dark">{page}</span> of <span className="text-dark">{totalPages}</span>
                </span>
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            )}
          </>
        )}

        <UserModal
          show={showModal}
          title={selectedUser ? "Edit User Details" : "Create New User"}
          selectedUser={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
        />

        <DeleteUserModal
          show={showDeleteModal}
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={confirmDelete}
        />

      </div>
    </DashboardLayout>
  );
}

export default Users;