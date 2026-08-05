import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProjectTable from "./ProjectTable"; 
import ProjectModal from "./ProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import ViewProjectModal from "./ViewProjectModal"; 
import { getProjects, deleteProject } from "../../services/project";
import HasPermission from "../../components/common/HasPermission";

let cachedProjectsByPage = {};

function Projects() {
  const [projects, setProjects] = useState(cachedProjectsByPage[1]?.projects || []);
  const [paginationData, setPaginationData] = useState(cachedProjectsByPage[1]?.pagination || null);
  
  const [loading, setLoading] = useState(!cachedProjectsByPage[1]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false); 

  const fetchProjectsData = async (page = 1, forceRefresh = false) => {

    if (cachedProjectsByPage[page] && !forceRefresh) {
      setProjects(cachedProjectsByPage[page].projects);
      setPaginationData(cachedProjectsByPage[page].pagination);
      setLoading(false);
    }

    try {
      if (!cachedProjectsByPage[page] && Object.keys(cachedProjectsByPage).length === 0) {
        setLoading(true);
      }

      // API Call
      const res = await getProjects({ page, limit: 10 });
      
      const fetchedProjects = res.success ? res.data.projects : res.projects || [];
      const fetchedPagination = res.success ? res.data.pagination : res.pagination || null;
      
      // 2. Data Cache karna
      cachedProjectsByPage[page] = { projects: fetchedProjects, pagination: fetchedPagination };
      
      setProjects(fetchedProjects);
      setPaginationData(fetchedPagination);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData(currentPage);
  }, [currentPage]);

  const handleAdd = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const confirmDelete = async (project) => {
    try {
      await deleteProject(project._id);
      cachedProjectsByPage = {}; 
      await fetchProjectsData(currentPage, true); 
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      alert("Failed to delete project: " + (err.response?.data?.message || err.message));
    }
  };

  // Search filter logic
  const filteredProjects = projects.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-2 d-flex flex-column" style={{ minHeight: "calc(100vh - 80px)" }}>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Projects Hub</h3>
            <p className="text-muted mb-0 small">Manage your organization's projects, teams, and timelines.</p>
          </div>
          <HasPermission requiredPermission="projects.create">
          <button
            className="btn text-white fw-semibold shadow-sm px-4 rounded-pill d-flex align-items-center gap-2"
            style={{ backgroundColor: "#FF6600" }}
            onClick={handleAdd}
          >
            <i className="bi bi-folder-plus"></i> Create Project
          </button>
          </HasPermission>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4 flex-shrink-0">
          <div className="card-body p-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-4">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 bg-light rounded-end-pill py-2 shadow-none"
                placeholder="Search projects on current page..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center w-100 flex-grow-1" style={{ minHeight: "50vh" }}>
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status"></div>
            <p className="text-muted mt-3 fw-semibold">Loading projects...</p>
          </div>
        ) : (
          <ProjectTable 
            projects={filteredProjects} 
            onView={handleView} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            pagination={paginationData}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        <ProjectModal 
          show={showModal} 
          selectedProject={selectedProject} 
          onClose={() => setShowModal(false)} 
          refreshData={() => {
             cachedProjectsByPage = {}; 
             fetchProjectsData(currentPage, true);
          }}
        />
        
        <DeleteProjectModal 
          show={showDeleteModal} 
          project={projectToDelete} 
          onClose={() => {
            setShowDeleteModal(false);
            setProjectToDelete(null);
          }} 
          onConfirm={confirmDelete}
        />

        <ViewProjectModal 
          show={showViewModal} 
          project={selectedProject} 
          onClose={() => setShowViewModal(false)} 
        />
      
      </div>
    </DashboardLayout>
  );
}

export default Projects;