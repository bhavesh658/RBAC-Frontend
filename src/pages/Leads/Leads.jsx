import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LeadTable from "./LeadTable";
import LeadModal from "./LeadModal";
import DeleteLeadModal from "./DeleteLeadModal";
import AssignLeadModal from "./AssignLeadModal";
import ChangeLeadStatusModal from "./ChangeLeadStatusModal";
import ViewLeadModal from "./ViewLeadModal";
import { getLeads, getMyLeads, deleteLead } from "../../services/lead"; // 🚀 getMyLeads import kiya gaya hai
import HasPermission from "../../components/common/HasPermission";

let cachedAllLeadsByPage = {};
let cachedMyLeadsByPage = {};

function Leads() {
  const [isMyLeadsView, setIsMyLeadsView] = useState(false); // 🚀 Toggle state (All vs My Leads)
  const activeCache = isMyLeadsView ? cachedMyLeadsByPage : cachedAllLeadsByPage;

  const [leads, setLeads] = useState(activeCache[1]?.leads || []);
  const [paginationData, setPaginationData] = useState(activeCache[1]?.pagination || null);
  const [leadCounts, setLeadCounts] = useState(activeCache[1]?.counts || null);
  
  const [loading, setLoading] = useState(!activeCache[1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchLeadsData = async (page = 1, forceRefresh = false, viewMode = isMyLeadsView) => {
    const currentCache = viewMode ? cachedMyLeadsByPage : cachedAllLeadsByPage;

    if (currentCache[page] && !forceRefresh) {
      setLeads(currentCache[page].leads);
      setPaginationData(currentCache[page].pagination);
      setLeadCounts(currentCache[page].counts);
      setLoading(false);
      return;
    }

    try {
      if (!currentCache[page] && Object.keys(currentCache).length === 0) setLoading(true);
      
      // 🚀 View mode ke hisaab se API call change hogi
      const res = viewMode ? await getMyLeads({ page, limit: 10 }) : await getLeads({ page, limit: 10 });
      
      const fetchedLeads = res.success ? res.data?.leads || res.data : res.leads || [];
      const fetchedPagination = res.success ? res.data?.pagination : res.pagination || null;
      const fetchedCounts = res.success ? res.data?.counts : res.counts || null;

      currentCache[page] = { 
        leads: fetchedLeads, 
        pagination: fetchedPagination,
        counts: fetchedCounts 
      };
      
      setLeads(fetchedLeads);
      setPaginationData(fetchedPagination);
      setLeadCounts(fetchedCounts);
    } catch (err) {
      console.error("Error fetching leads", err);
    } finally {
      setLoading(false);
    }
  };

  // Jab page ya view mode (All vs My Leads) change ho
  useEffect(() => {
    fetchLeadsData(currentPage, false, isMyLeadsView);
  }, [currentPage, isMyLeadsView]);

  const refreshAfterAction = () => {
    cachedAllLeadsByPage = {};
    cachedMyLeadsByPage = {};
    fetchLeadsData(currentPage, true, isMyLeadsView);
  };

  const confirmDelete = async (lead) => {
    try {
      await deleteLead(lead._id);
      refreshAfterAction();
      setShowDeleteModal(false);
    } catch (err) {
      alert("Failed to delete lead: " + (err.response?.data?.message || err.message));
    }
  };

  // View mode change handler (Reset page to 1 on switch)
  const handleViewToggle = (myLeadsMode) => {
    if (isMyLeadsView !== myLeadsMode) {
      setIsMyLeadsView(myLeadsMode);
      setCurrentPage(1);
      setSearch("");
    }
  };

  // Search Filter Logic
  const filteredLeads = leads.filter((lead) => {
    const term = search.toLowerCase();
    const fullName = `${lead.firstName || ""} ${lead.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(term) ||
      (lead.email || "").toLowerCase().includes(term) ||
      (lead.company || "").toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-2 d-flex flex-column" style={{ minHeight: "calc(100vh - 80px)" }}>

        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Lead Management</h3>
            <p className="text-muted mb-0 small">
              {isMyLeadsView ? "Viewing leads specifically assigned to you." : "Track and convert your prospective clients."}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* 🚀 All Leads vs My Leads Toggle Buttons */}
            <div className="btn-group shadow-sm rounded-pill p-1 bg-light border" role="group">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${!isMyLeadsView ? 'text-white shadow-sm' : 'text-secondary bg-transparent border-0'}`}
                style={{ backgroundColor: !isMyLeadsView ? "#FF6600" : "transparent" }}
                onClick={() => handleViewToggle(false)}
              >
                All Leads
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${isMyLeadsView ? 'text-white shadow-sm' : 'text-secondary bg-transparent border-0'}`}
                style={{ backgroundColor: isMyLeadsView ? "#FF6600" : "transparent" }}
                onClick={() => handleViewToggle(true)}
              >
                <i className="bi bi-person-fill me-1"></i> My Leads
              </button>
            </div>

            <HasPermission requiredPermission="leads.create">
              <button
                className="btn text-white fw-semibold shadow-sm px-4 rounded-pill d-flex align-items-center gap-2 hover-lift"
                style={{ backgroundColor: "#FF6600", transition: "all 0.2s" }}
                onClick={() => { setSelectedLead(null); setShowModal(true); }}
              >
                <i className="bi bi-person-plus-fill"></i> Add Lead
              </button>
            </HasPermission>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        {!loading && leadCounts && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary" style={{ width: "45px", height: "45px" }}>
                    <i className="bi bi-people-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{leadCounts.totalLeads || 0}</h4>
                    <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.5px" }}>Total Leads</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info" style={{ width: "45px", height: "45px" }}>
                    <i className="bi bi-stars fs-5"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{leadCounts.newLeads || 0}</h4>
                    <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.5px" }}>New</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success" style={{ width: "45px", height: "45px" }}>
                    <i className="bi bi-check-circle-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{leadCounts.convertedLeads || 0}</h4>
                    <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.5px" }}>Converted</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger" style={{ width: "45px", height: "45px" }}>
                    <i className="bi bi-x-circle-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{leadCounts.lostLeads || 0}</h4>
                    <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: "0.5px" }}>Lost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar Component */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 flex-shrink-0">
          <div className="card-body p-2 p-md-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-4">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 bg-light rounded-end-pill py-2 shadow-none"
                placeholder="Search leads by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loader or Table Render */}
        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center w-100 flex-grow-1" style={{ minHeight: "50vh" }}>
            <div className="spinner-border" style={{ width: "3rem", height: "3rem", color: "#FF6600" }} role="status"></div>
            <span className="mt-3 text-muted fw-semibold">Loading Leads...</span>
          </div>
        ) : (
          <LeadTable
            leads={filteredLeads}
            onView={(lead) => { setSelectedLead(lead); setShowViewModal(true); }}
            onEdit={(lead) => { setSelectedLead(lead); setShowModal(true); }}
            onAssign={(lead) => { setSelectedLead(lead); setShowAssignModal(true); }}
            onStatus={(lead) => { setSelectedLead(lead); setShowStatusModal(true); }}
            onDelete={(lead) => { setSelectedLead(lead); setShowDeleteModal(true); }}
            pagination={paginationData}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        {/* Action Modals */}
        <LeadModal show={showModal} selectedLead={selectedLead} onClose={() => setShowModal(false)} refreshData={refreshAfterAction} />
        <DeleteLeadModal show={showDeleteModal} lead={selectedLead} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
        <AssignLeadModal show={showAssignModal} lead={selectedLead} onClose={() => setShowAssignModal(false)} refreshData={refreshAfterAction} />
        <ChangeLeadStatusModal show={showStatusModal} lead={selectedLead} onClose={() => setShowStatusModal(false)} refreshData={refreshAfterAction} />
        <ViewLeadModal show={showViewModal} lead={selectedLead} onClose={() => setShowViewModal(false)} />

      </div>
    </DashboardLayout>
  );
}

export default Leads;