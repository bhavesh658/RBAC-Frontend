import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#10B981', '#FF6600', '#F59E0B', '#6B7280'];

const ProjectStatusChart = ({ data }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
        <h5 className="fw-bold text-dark mb-0">Project Status</h5>
      </div>
      <div className="card-body d-flex flex-column justify-content-center align-items-center" style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={70} outerRadius={90}
              paddingAngle={5} dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-2 w-100 px-3">
          {data.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center small text-muted">
              <span className="d-inline-block rounded-circle me-2" style={{ width: "10px", height: "10px", backgroundColor: COLORS[idx] }}></span>
              {item.name} ({item.value}%)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProjectStatusChart;