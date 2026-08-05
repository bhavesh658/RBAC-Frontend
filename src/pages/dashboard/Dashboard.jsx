import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getDashboardSummary } from "../../services/dashboardService";

import DashboardHeader from "./components/DashboardHeader";
import KPICards from "./components/KPICards";
import LeadsAnalyticsChart from "./components/LeadsAnalyticsChart";
import ProjectStatusChart from "./components/ProjectStatusChart";
import ActivityLog from "./components/ActivityLog";
import RecentLeadsTable from "./components/RecentLeadsTable";

let cachedDashboardData = null;

function Dashboard() {
  const { user } = useAuth();
  
  // 🚀 1. Permission Check Logic
  const storedPerms = JSON.parse(localStorage.getItem("user_permissions") || "[]");
  const roleName = user?.role?.name || user?.role || "";
  
  // Check: Kya Admin hai YA uske paas dashboard.read hai?
  const hasDashboardAccess = roleName === "Super Admin" || roleName === "Admin" || storedPerms.includes("dashboard.read");

  const [dashboardData, setDashboardData] = useState(cachedDashboardData);
  // 🚀 2. Loading tabhi true hogi jab access ho aur cache na ho
  const [loading, setLoading] = useState(hasDashboardAccess && !cachedDashboardData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🚀 3. Agar access nahi hai, toh yahin se wapas mud jao (API call block ho gayi)
    if (!hasDashboardAccess) return;

    const fetchDashboardData = async () => {
      if (cachedDashboardData) {
        return; 
      }

      try {
        setLoading(true);
        const data = await getDashboardSummary(); 
        
        cachedDashboardData = data; 
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [hasDashboardAccess]);

  const handleRefresh = async () => {
    // 🚀 Refresh button par bhi access check
    if (!hasDashboardAccess) return; 

    try {
      setLoading(true);
      setError(null); 
      const data = await getDashboardSummary(); 
      
      cachedDashboardData = data; 
      setDashboardData(data);
    } catch (err) {
      setError("Failed to refresh dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 4. "Access Denied" UI (Agar permission nahi hai toh ye page dikhega)
  if (!hasDashboardAccess) {
    return (
      <DashboardLayout>
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
          <i className="bi bi-shield-lock-fill text-danger mb-3" style={{ fontSize: "4rem" }}></i>
          <h2 className="fw-bold text-dark">Access Denied</h2>
          <p className="text-muted text-center" style={{ maxWidth: "400px" }}>
            You don't have permission to view the Dashboard. Please contact your administrator if you need access.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border" style={{ color: "#FF6600" }} role="status"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger m-4" role="alert">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 px-3 bg-light min-vh-100">
        
        <DashboardHeader user={user} onRefresh={handleRefresh} />

        {/* 🚀 Optional safety mapping (?.) lagaya hai taaki undefined data crash na kare */}
        {/* Row 1: KPI Cards */}
        <KPICards stats={dashboardData?.stats} />

        {/* Row 2: Charts */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <LeadsAnalyticsChart data={dashboardData?.leadsAnalytics} />
          </div>
          <div className="col-lg-4">
            <ProjectStatusChart data={dashboardData?.projectStatus} />
          </div>
        </div>

        {/* Row 3: Activity Log & Recent Leads */}
        <div className="row g-4">
          <div className="col-lg-6">
            <ActivityLog logs={dashboardData?.activityLogs} />
          </div>
          <div className="col-lg-6">
            <RecentLeadsTable leads={dashboardData?.recentLeads} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;