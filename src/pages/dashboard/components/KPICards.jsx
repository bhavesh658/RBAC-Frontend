import React from 'react';

const KPICards = ({ stats }) => {
  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: "bi-people-fill", color: "primary" },
    { title: "Total Leads", value: stats.totalLeads, icon: "bi-funnel-fill", color: "warning" },
    { title: "Active Projects", value: stats.activeProjects, icon: "bi-kanban-fill", color: "success" },
    { title: "Conversion Rate", value: stats.conversionRate, icon: "bi-graph-up-arrow", color: "danger" }
  ];

  return (
    <div className="row g-4 mb-4">
      {cards.map((card, index) => (
        <div className="col-12 col-sm-6 col-xl-3" key={index}>
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100 hover-lift">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-bold small text-uppercase tracking-wide">{card.title}</span>
              <div className={`rounded-circle d-flex align-items-center justify-content-center bg-${card.color} bg-opacity-10 text-${card.color}`} style={{ width: "45px", height: "45px" }}>
                <i className={`bi ${card.icon} fs-5`}></i>
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-0">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};
export default KPICards;