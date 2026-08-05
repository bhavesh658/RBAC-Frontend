import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/users/Users";
import Departments from "../pages/departments/Departments";
import Roles from "../pages/roles/Roles";
import Permissions from "../pages/permissions/Permissions";
import Profile from "../pages/auth/Profile";
import UserDetail from "../pages/users/UserDetail";
import DepartmentDetail from "../pages/departments/DepartmentDetail";
import Project from "../pages/Projects/Projects";
import Tasks from "../pages/Tasks/Tasks";
import Leads from "../pages/leads/Leads";
import Activities from "../pages/activityLogs/ActivityLogs";
import UserReport from "../pages/reports/UserReport";
import Reports from "../pages/reports/Reports"; // Naya List component

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/users" element={
          <ProtectedRoute requiredPermission="users.read"><Users /></ProtectedRoute>
        } />

        <Route path="/users/:id" element={
          <ProtectedRoute requiredPermission="users.read"><UserDetail /></ProtectedRoute>
        } />

        <Route path="/departments" element={
          <ProtectedRoute requiredPermission="departments.read"><Departments /></ProtectedRoute>
        } />

        <Route path="/departments/:id" element={
          <ProtectedRoute requiredPermission="departments.read"><DepartmentDetail /></ProtectedRoute>
        } />

        <Route path="/roles" element={
          <ProtectedRoute requiredPermission="roles.read"><Roles /></ProtectedRoute>
        } />

        <Route path="/permissions" element={
          <ProtectedRoute requiredPermission="permissions.read"><Permissions /></ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute requiredPermission="projects.read"><Project /></ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute requiredPermission="tasks.read"><Tasks /></ProtectedRoute>
        } />

        <Route path="/leads" element={
          <ProtectedRoute requiredPermission="leads.read"><Leads /></ProtectedRoute>
        } />

        <Route path="/Activities" element={
          <ProtectedRoute requiredPermission="activitylogs.read"><Activities /></ProtectedRoute>
        } />


        <Route path="/reports" element={
          <ProtectedRoute requiredPermission="reports.read"><UserReport /></ProtectedRoute>
        } />


        <Route path="/reports/user/:id" element={
          <ProtectedRoute requiredPermission="reports.read"><UserReport /></ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<h2 className="text-center mt-5">404 Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;