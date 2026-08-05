import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DepartmentTable from "./DepartmentTable";
import DepartmentModal from "./DepartmentModal";
import DeleteDepartmentModal from "./DeleteDepartmentModal";
import { getDepartments, createDepartment, updateDepartment, assignDepartmentHead } from "../../services/department";
import HasPermission from "../../components/common/HasPermission"; 
import { toast } from "react-toastify"; // 🚀 Toastify import kiya gaya hai

let departmentCache = {};
let globalTotalPages = 1;
let globalCurrentPage = 1;

function Departments() {
  const [page, setPage] = useState(globalCurrentPage); 
  const limit = 5;
  const [totalPages, setTotalPages] = useState(globalTotalPages);

  const [departments, setDepartments] = useState(departmentCache[page] || []);
  const [loading, setLoading] = useState(!departmentCache[page]);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [search, setSearch] = useState("");

  const updateDataAndCache = (newData) => {
    setDepartments(newData);
    departmentCache[page] = newData;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    globalCurrentPage = newPage;
  };

  const fetchDepartments = async (currentPage, isPrefetch = false) => {
    try {
      if (!isPrefetch) {
        if (departmentCache[currentPage]) {
          setDepartments(departmentCache[currentPage]);
          setLoading(false);
        } else {
          setLoading(true);
        }
        setError("");
      }

      const response = await getDepartments(currentPage, limit);
      
      if (response.success || response.data) {
        const fetchedData = response.data || [];
        const fetchedTotalPages = response.totalPages || 1;

        departmentCache[currentPage] = fetchedData;

        if (!isPrefetch) {
          setDepartments(fetchedData);
          setTotalPages(fetchedTotalPages);
          globalTotalPages = fetchedTotalPages;
        }
      }
    } catch (err) {
      if (!isPrefetch) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to fetch departments.");
      }
    } finally {
      if (!isPrefetch) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDepartments(page);
  }, [page]);

  useEffect(() => {
    if (page < totalPages && !departmentCache[page + 1]) {
      fetchDepartments(page + 1, true); 
    }
  }, [page, totalPages]);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleDelete = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  // 🚀 Updated: Alert hatakar Toast add kiya aur API ka message use kiya
  const confirmDelete = async () => {
    if (!selectedDepartment) return;
    try {
      const updatedStatus = { isActive: !selectedDepartment.isActive };
      const response = await updateDepartment(selectedDepartment._id, updatedStatus);

      if (response && (response.success || response.message)) {
        toast.success(response.message || "Department status updated successfully");
        
        const updatedList = departments.map((d) =>
          d._id === selectedDepartment._id ? { ...d, isActive: !d.isActive } : d
        );
        updateDataAndCache(updatedList); 
      } else {
        toast.error(response?.message || "Failed to update department status.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while updating status.");
    } finally {
      setShowDeleteModal(false);
      setSelectedDepartment(null);
    }
  };

  // 🚀 Updated: Handle Save me bhi alert hatakar Toast add kiya hai
  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        isActive: formData.isActive
      };

      if (selectedDepartment) {
        const response = await updateDepartment(selectedDepartment._id, payload);
        
        if (formData.head && formData.head !== (selectedDepartment.head?._id || selectedDepartment.head)) {
          await assignDepartmentHead(selectedDepartment._id, formData.head);
        }
        
        if (response.success || response.data) {
          toast.success(response.message || "Department updated successfully");
          fetchDepartments(page);
        } else {
          toast.error(response?.message || "Failed to update department.");
        }
      } else {
        const response = await createDepartment(payload);
        
        if (response.success || response.data) {
          toast.success(response.message || "New department created successfully");
          const newData = response.data || response;
          updateDataAndCache([newData, ...departments]);
        } else {
          toast.error(response?.message || "Failed to create department.");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while saving department.");
    } finally {
      setShowModal(false);
      setSelectedDepartment(null);
    }
  };

  const filteredDepartments = useMemo(() => {
    if (!search) return departments;
    const keyword = search.toLowerCase();
    return departments.filter((d) =>
      (d.name || "").toLowerCase().includes(keyword) ||
      (d.code || "").toLowerCase().includes(keyword)
    );
  }, [departments, search]);

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-0">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Departments</h3>
            <p className="text-muted mb-0 small">Manage organizational departments and their heads.</p>
          </div>
          
          <HasPermission requiredPermission="departments.create">
            <button
              className="btn text-white fw-semibold shadow-sm px-4 rounded-pill d-flex align-items-center gap-2"
              style={{ backgroundColor: "#FF6600", transition: "0.3s" }}
              onClick={handleAdd}
            >
              <i className="bi bi-plus-lg"></i> Add Department
            </button>
          </HasPermission>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-4">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 bg-light rounded-end-pill py-2 shadow-none"
                placeholder="Search departments by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4 shadow-sm border-0 border-start border-danger border-4">
            {error}
          </div>
        ) : (
          <>
            <DepartmentTable
              departments={filteredDepartments}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 bg-white p-3 rounded-4 shadow-sm">
                
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i> Prev
                </button>
                <span className="fw-semibold text-muted small">
                  Page <span className="text-dark">{page}</span> of <span className="text-dark">{totalPages}</span>
                </span>
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>

              </div>
            )}
          </>
        )}

        <DepartmentModal
          show={showModal}
          title={selectedDepartment ? "Edit Department" : "Add Department"}
          selectedDepartment={selectedDepartment}
          onClose={() => { setShowModal(false); setSelectedDepartment(null); }}
          onSave={handleSave}
        />

        <DeleteDepartmentModal
          show={showDeleteModal}
          department={selectedDepartment}
          onClose={() => { setShowDeleteModal(false); setSelectedDepartment(null); }}
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}

export default Departments;