import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const LeadsAnalyticsChart = ({ data }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-dark mb-0">Leads Analytics</h5>
      </div>
      <div className="card-body px-4" style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#adb5bd" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#adb5bd" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6600" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#FF6600" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6c757d" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6c757d" }} />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" name="Leads Generated" dataKey="generated" stroke="#adb5bd" fillOpacity={1} fill="url(#colorGenerated)" />
            <Area type="monotone" name="Leads Converted" dataKey="converted" stroke="#FF6600" strokeWidth={3} fillOpacity={1} fill="url(#colorConverted)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default LeadsAnalyticsChart;