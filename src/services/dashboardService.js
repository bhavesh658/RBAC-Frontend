
import { getUsers } from './user'; 
import { getLeads } from './lead';
import { getProjects } from './project';
import { getActivityLogs } from './activityLog';

export const getDashboardSummary = async () => {
  try {
    const [usersRes, leadsRes, projectsRes, logsRes] = await Promise.all([
      getUsers(1,50),
      getLeads({ limit: 10, sort: 'desc' }), 
      getProjects({ limit: 50 }), 
      getActivityLogs({ limit: 5 }) 
    ]);

    // 1. EXACT ARRAY EXTRACTION (Based on your JSON response)
    const usersArray = usersRes?.data || [];
    const leadsArray = leadsRes?.data?.leads || [];
    const projectsArray = projectsRes?.data?.projects || [];
    // Activity logs ka array ya to logs ya activityLogs key me hoga
    const logsArray = logsRes?.data?.logs || logsRes?.data?.activityLogs || logsRes?.data?.data || [];

    // 2. KPI CALCULATIONS
    // Users API me 'totalPages' hai par total count nahi dikha, toh array length fallback liya hai
    const totalUsers = usersRes?.totalRecords || usersArray.length || 0; 
    // Leads API se exact totalLeads nikal liya
    const totalLeads = leadsRes?.data?.counts?.totalLeads || leadsArray.length || 0;
    
    // Active Projects Filter
    const activeProjects = projectsArray.filter(
      p => p.status === 'Active' || p.status === 'In Progress'
    ).length;

    // 3. PROJECT STATUS CHART FORMATTING
    const projectStatusCounts = projectsArray.reduce((acc, project) => {
      const status = project.status || 'Planning'; 
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const formattedProjectStatus = Object.keys(projectStatusCounts).map(key => ({
      name: key,
      value: projectStatusCounts[key]
    }));

    // 4. RECENT LEADS TABLE FORMATTING
    const formattedRecentLeads = leadsArray.slice(0, 5).map(lead => ({
      id: lead._id,
      name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unknown',
      company: lead.company || "N/A",
      status: lead.status || "New",
      date: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : "Today"
    }));

    // 5. ACTIVITY LOGS FORMATTING
    const formattedLogs = logsArray.slice(0, 5).map((log, index) => ({
      id: log._id || index,
      user: log.user?.firstName || log.userName || "System",
      action: log.action || log.message || "performed an action",
      target: log.target || "",
      description: log.description || log.details || "",
      time: log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Just now",
      icon: "bi-info-circle-fill",
      color: "text-primary",
      bg: "bg-primary"
    }));

    // 6. FINAL DATA RETURN
    return {
      stats: {
        totalUsers: totalUsers,
        totalLeads: totalLeads,
        activeProjects: activeProjects,
        conversionRate: "24%" // Abhi ke liye static, agar API me aaye toh yahan replace kar dein
      },
      // Leads Chart (Mock data rakha hai kyunki iska array JSON me nahi tha)
      leadsAnalytics: [
        { month: "Jan", generated: 65, converted: 28 },
        { month: "Feb", generated: 85, converted: 38 },
        { month: "Mar", generated: 73, converted: 43 },
        { month: "Apr", generated: 95, converted: 55 },
        { month: "May", generated: 110, converted: 65 },
      ],
      projectStatus: formattedProjectStatus.length > 0 ? formattedProjectStatus : [
        { name: "No Data", value: 100 }
      ],
      activityLogs: formattedLogs.length > 0 ? formattedLogs : [
        { id: 1, user: "System", action: "No recent activity", target: "", time: "Just now", icon: "bi-clock", color: "text-muted", bg: "bg-light"}
      ],
      recentLeads: formattedRecentLeads
    };

  } catch (error) {
    console.error("Error fetching dashboard summary data:", error);
    throw error;
  }
};