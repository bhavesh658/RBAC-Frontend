import React, { useState, useEffect } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import ActivityLogTable from "./ActivityLogTable";

import ViewActivityLogModal from "./ViewActivityLogModal";

import { getActivityLogs } from "../../services/activityLog";



let cachedLogsByPage = {};



function ActivityLogs() {

  const [logs, setLogs] = useState(cachedLogsByPage[1]?.logs || []);

  const [paginationData, setPaginationData] = useState(cachedLogsByPage[1]?.pagination || null);

  const [loading, setLoading] = useState(!cachedLogsByPage[1]);

  const [currentPage, setCurrentPage] = useState(1);

 

  const [search, setSearch] = useState("");

 

  const [selectedLog, setSelectedLog] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);



  const fetchLogsData = async (page = 1) => {

    if (cachedLogsByPage[page]) {

      setLogs(cachedLogsByPage[page].logs);

      setPaginationData(cachedLogsByPage[page].pagination);

      setLoading(false);

    }

   

    try {

      if (!cachedLogsByPage[page] && Object.keys(cachedLogsByPage).length === 0) setLoading(true);

     

      const res = await getActivityLogs({ page, limit: 8 });

      const fetchedLogs = res.success ? res.data.logs || res.data : res.logs || [];

      const fetchedPagination = res.success ? res.data.pagination : res.pagination || null;

     

      cachedLogsByPage[page] = { logs: fetchedLogs, pagination: fetchedPagination };

      setLogs(fetchedLogs);

      setPaginationData(fetchedPagination);

    } catch (err) {

      console.error("Error fetching activity logs", err);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchLogsData(currentPage);

  }, [currentPage]);



  // Search Logic

  const filteredLogs = logs.filter((log) => {

    const term = search.toLowerCase();

    const performer = log.performedBy?.fullName || "";

    const module = log.module || "";

    const action = log.action || "";

    const desc = log.description || "";

   

    return (

      performer.toLowerCase().includes(term) ||

      module.toLowerCase().includes(term) ||

      action.toLowerCase().includes(term) ||

      desc.toLowerCase().includes(term)

    );

  });



  return (

    <DashboardLayout>

      <div className="container-fluid py-4 px-2 d-flex flex-column" style={{ minHeight: "calc(100vh - 80px)" }}>

       

        {/* Header Section */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

          <div>

            <h3 className="fw-bold text-dark mb-1">System Activity Logs</h3>

            <p className="text-muted mb-0 small">Monitor all actions and changes across the system.</p>

          </div>

          <button className="btn btn-light border shadow-sm px-4 rounded-pill d-flex align-items-center gap-2" onClick={() => fetchLogsData(currentPage)}>

            <i className="bi bi-arrow-clockwise"></i> Refresh Logs

          </button>

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

                placeholder="Search logs by user, module, action, or description..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

              />

            </div>

          </div>

        </div>



        {/* Table / Loader */}

        {loading ? (

          <div className="d-flex flex-column justify-content-center align-items-center w-100 flex-grow-1" style={{ minHeight: "50vh" }}>

            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status"></div>

          </div>

        ) : (

          <ActivityLogTable

            logs={filteredLogs}

            onView={(log) => { setSelectedLog(log); setShowViewModal(true); }}

            pagination={paginationData}

            onPageChange={(page) => setCurrentPage(page)}

          />

        )}



        {/* View Modal */}

        <ViewActivityLogModal

          show={showViewModal}

          log={selectedLog}

          onClose={() => setShowViewModal(false)}

        />



      </div>

    </DashboardLayout>

  );

}

export default ActivityLogs;