import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TaskTable from "./TaskTable"; 
import TaskModal from "./TaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import AssignTaskModal from "./AssignTaskModal"; 
import ChangeStatusModal from "./ChangeStatusModal";
import ViewTaskModal from "./ViewTaskModal";

import { getTasks, myTasks, deleteTask } from "../../services/task"; 
import { useAuth } from "../../context/AuthContext"; 

let taskCache = { all: {}, my: {}, currentUserId: null };

function Tasks() {
  const { user } = useAuth(); 

 
  if (user && taskCache.currentUserId !== user._id) {
    taskCache = { all: {}, my: {}, currentUserId: user._id };
  }

  const [viewMode, setViewMode] = useState("all"); 
  const [tasks, setTasks] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchTasksData = async (page = 1, mode = viewMode, forceRefresh = false) => {
    if (taskCache[mode][page] && !forceRefresh) {
      setTasks(taskCache[mode][page].tasks);
      setPaginationData(taskCache[mode][page].pagination);
      setLoading(false);
      return;
    }

    try {
      if (!taskCache[mode][page]) setLoading(true);

      const fetchFunction = mode === "my" ? myTasks : getTasks;
      const res = await fetchFunction({ page, limit: 10 });
      
      const fetchedTasks = res.success ? res.data.tasks : res.tasks || [];
      const fetchedPagination = res.success ? res.data.pagination : res.pagination || null;
      
      taskCache[mode][page] = { tasks: fetchedTasks, pagination: fetchedPagination };
      
      setTasks(fetchedTasks);
      setPaginationData(fetchedPagination);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData(currentPage, viewMode);
  }, [currentPage, viewMode]);

  const refreshAfterAction = () => {
    taskCache = { all: {}, my: {}, currentUserId: user?._id }; 
    fetchTasksData(currentPage, viewMode, true);
  };

  const handleTabChange = (mode) => {
    if (viewMode === mode) return; 
    setViewMode(mode);
    setCurrentPage(1);
  };

  const openView = (task) => { setSelectedTask(task); setShowViewModal(true); };
  const openEdit = (task) => { setSelectedTask(task); setShowModal(true); };
  const openStatus = (task) => { setSelectedTask(task); setShowStatusModal(true); };
  const openAssign = (task) => { setSelectedTask(task); setShowAssignModal(true); };
  const openDelete = (task) => { setSelectedTask(task); setShowDeleteModal(true); };

  const confirmDelete = async (task) => {
    try {
      await deleteTask(task._id);
      refreshAfterAction();
      setShowDeleteModal(false);
    } catch (err) {
      alert("Failed to delete task: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const term = search.toLowerCase();
    return (
      (t.title || "").toLowerCase().includes(term) ||
      (t.description || "").toLowerCase().includes(term) ||
      (t.project?.name || "").toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-3 d-flex flex-column" style={{ minHeight: "calc(100vh - 80px)" }}>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Task Board</h3>
            <p className="text-muted mb-0 small">Track and manage project tasks efficiently.</p>
          </div>
          <button 
            className="btn text-white fw-semibold shadow-sm px-4 rounded-pill d-flex align-items-center gap-2" 
            style={{ backgroundColor: "#FF6600" }} 
            onClick={() => { setSelectedTask(null); setShowModal(true); }}
          >
            <i className="bi bi-plus-lg"></i> Create Task
          </button>
        </div>

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 bg-white p-3 rounded-4 shadow-sm">
          
          <div className="d-flex gap-2">
            <button 
              className={`btn rounded-pill px-4 fw-bold shadow-none ${viewMode === 'all' ? 'text-white' : 'btn-light text-muted'}`}
              style={viewMode === 'all' ? { backgroundColor: "#FF6600" } : { border: "1px solid #e9ecef" }}
              onClick={() => handleTabChange('all')}
            >
              <i className="bi bi-list-task me-2"></i> All Tasks
            </button>
            <button 
              className={`btn rounded-pill px-4 fw-bold shadow-none ${viewMode === 'my' ? 'text-white' : 'btn-light text-muted'}`}
              style={viewMode === 'my' ? { backgroundColor: "#FF6600" } : { border: "1px solid #e9ecef" }}
              onClick={() => handleTabChange('my')}
            >
              <i className="bi bi-person-workspace me-2"></i> My Tasks
            </button>
          </div>

          {/* Search & Refresh Actions */}
          <div className="d-flex gap-2 align-items-center">
            {/* Sync Button */}
            <button 
              className="btn btn-light border rounded-circle d-flex justify-content-center align-items-center text-secondary shadow-sm"
              style={{ width: "42px", height: "42px" }}
              onClick={refreshAfterAction}
              title="Sync Latest Data"
            >
              <i className="bi bi-arrow-clockwise fs-5"></i>
            </button>

            <div className="input-group" style={{ maxWidth: "350px", minWidth: "250px" }}>
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-3">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 bg-light rounded-end-pill py-2 shadow-none"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
        </div>

        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center w-100 flex-grow-1" style={{ minHeight: "50vh" }}>
            <div className="spinner-border" style={{ color: "#FF6600", width: "3rem", height: "3rem" }} role="status"></div>
            <p className="text-muted mt-3 fw-semibold">Loading tasks...</p>
          </div>
        ) : (
          <TaskTable 
            tasks={filteredTasks} 
            onView={openView}
            onEdit={openEdit} 
            onAssign={openAssign}
            onStatus={openStatus}
            onDelete={openDelete} 
            pagination={paginationData} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        )}

        <TaskModal show={showModal} selectedTask={selectedTask} onClose={() => setShowModal(false)} refreshData={refreshAfterAction} />
        <DeleteTaskModal show={showDeleteModal} task={selectedTask} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
        <AssignTaskModal show={showAssignModal} task={selectedTask} onClose={() => setShowAssignModal(false)} refreshData={refreshAfterAction} />
        <ChangeStatusModal show={showStatusModal} task={selectedTask} onClose={() => setShowStatusModal(false)} refreshData={refreshAfterAction} />
        <ViewTaskModal show={showViewModal} task={selectedTask} onClose={() => setShowViewModal(false)} />

      </div>
    </DashboardLayout>
  );
}

export default Tasks;