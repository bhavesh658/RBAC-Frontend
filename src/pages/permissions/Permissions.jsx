import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getPermissions } from "../../services/permission"; 

// 🌟 SMART CACHE FOR PERMISSIONS
let cachedPermissions = [];

function Permissions() {
  const [permissions, setPermissions] = useState(cachedPermissions);
  const [loading, setLoading] = useState(cachedPermissions.length === 0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        if (cachedPermissions.length === 0) setLoading(true);
        const response = await getPermissions(1000); // 1000 limit pass kar rahe hain
        
        // Handle API wrapper structure
        if (response && response.success && response.data) {
          setPermissions(response.data);
          cachedPermissions = response.data;
        } else if (Array.isArray(response)) {
          setPermissions(response);
          cachedPermissions = response;
        } else {
          setError("Invalid permissions data format.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const getBadgeColor = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes('read') || lower.includes('view') || lower.includes('get')) return 'bg-info bg-opacity-10 text-info border-info';
    if (lower.includes('create') || lower.includes('add') || lower.includes('post')) return 'bg-success bg-opacity-10 text-success border-success';
    if (lower.includes('update') || lower.includes('edit') || lower.includes('put')) return 'bg-warning bg-opacity-10 text-warning border-warning';
    if (lower.includes('delete') || lower.includes('remove') || lower.includes('destroy')) return 'bg-danger bg-opacity-10 text-danger border-danger';
    return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
  };

  const groupedPermissions = useMemo(() => {
    const filtered = permissions.filter((perm) => {
      const term = search.toLowerCase();
      const name = (perm.name || "").toLowerCase();
      const desc = (perm.description || "").toLowerCase();
      return name.includes(term) || desc.includes(term);
    });

    return filtered.reduce((acc, perm) => {
      const moduleNameRaw = perm.module || (perm.name ? perm.name.split('.')[0] : 'General');
      const moduleName = moduleNameRaw.charAt(0).toUpperCase() + moduleNameRaw.slice(1);
      
      if (!acc[moduleName]) acc[moduleName] = [];
      acc[moduleName].push(perm);
      return acc;
    }, {});
  }, [permissions, search]);

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-2 d-flex flex-column" style={{ minHeight: "calc(100vh - 80px)" }}>
        
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">System Permissions</h3>
            <p className="text-muted mb-0 small">Master list of all available access rights in the system.</p>
          </div>
          <div>
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm">
              <i className="bi bi-shield-lock-fill text-primary me-2"></i>
              Read-Only Master List
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 flex-shrink-0">
          <div className="card-body p-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-4">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 bg-light rounded-end-pill py-2 shadow-none"
                placeholder="Search permissions by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          /* 🚀 FIX 1: Fixed height for loading state so sidebar doesn't shrink */
          <div className="d-flex flex-column justify-content-center align-items-center w-100" style={{ height: "70vh" }}>
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status"></div>
            <p className="text-muted mt-3 fw-semibold">Loading permissions map...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4 shadow-sm border-0 border-start border-danger border-4 flex-shrink-0">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        ) : Object.keys(groupedPermissions).length === 0 ? (
          /* 🚀 FIX 1: Fixed height for empty state */
          <div className="d-flex flex-column justify-content-center align-items-center bg-white rounded-4 shadow-sm border-0 w-100" style={{ height: "70vh" }}>
            <i className="bi bi-shield-x text-muted" style={{ fontSize: "4rem" }}></i>
            <h5 className="text-dark fw-bold mt-3">No Permissions Found</h5>
            <p className="text-muted mb-0">Try adjusting your search terms.</p>
          </div>
        ) : (
          /* 🚀 FIX 2: Masonry Layout (Pinterest style) prevents cards from stretching */
          <div className="permissions-masonry-grid flex-grow-1" style={{ columnGap: "1.5rem" }}>
            
            <style>
              {`
                .permissions-masonry-grid { 
                  column-count: 2; 
                }
                @media (max-width: 1200px) { 
                  .permissions-masonry-grid { column-count: 1; } 
                }
              `}
            </style>

            {Object.entries(groupedPermissions).map(([moduleName, perms], index) => (
              <div 
                className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4" 
                key={index} 
                style={{ breakInside: "avoid", display: "inline-block", width: "100%" }}
              >
                
                {/* Module Header */}
                <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center">
                    <div 
                      className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3 shadow-sm border"
                      style={{ width: "35px", height: "35px" }}
                    >
                      <i className="bi bi-box-seam-fill text-primary"></i>
                    </div>
                    {moduleName} Module
                  </h6>
                  <span className="badge bg-light text-secondary border rounded-pill">
                    {perms.length} Rights
                  </span>
                </div>

                {/* Permissions List */}
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {perms.map((perm) => (
                      <li key={perm._id} className="list-group-item px-4 py-3 border-bottom-0 border-top bg-transparent hover-bg-light" style={{ transition: "0.2s" }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-bold text-dark fs-6 d-flex align-items-center gap-2 mb-1">
                              {perm.name}
                              {/* Smart Badge */}
                              <span className={`badge rounded-pill border px-2 py-1 ${getBadgeColor(perm.name)}`} style={{ fontSize: "0.65rem" }}>
                                {perm.name.split('.').pop().toUpperCase()}
                              </span>
                            </div>
                            <p className="text-muted small mb-0 lh-sm">
                              {perm.description || "No specific description available."}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default Permissions;