import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { punchIn, punchOut } from "../../services/attendance";
import toast from "react-hot-toast";

function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // State
  const [loading, setLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem("attendance_status") === "true";
  });

  const { canPunchIn, canPunchOut } = useMemo(() => {
    try {
      const permissions = JSON.parse(localStorage.getItem("user_permissions")) || [];
      return {
        canPunchIn: permissions.includes("attendance.punchin"),
        canPunchOut: permissions.includes("attendance.punchout")
      };
    } catch (e) {
      return { canPunchIn: false, canPunchOut: false };
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleAttendanceToggle = async () => {
    setLoading(true);
    try {
      if (!isCheckedIn) {
        await punchIn();
        setIsCheckedIn(true);
        localStorage.setItem("attendance_status", "true");
        toast.success("Punched in successfully!");
      } else {
        await punchOut();
        setIsCheckedIn(false);
        localStorage.setItem("attendance_status", "false");
        toast.success("Punched out successfully!");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to mark attendance.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showAttendanceButton = (!isCheckedIn && canPunchIn) || (isCheckedIn && canPunchOut);

  return (
    <header className="bg-white border-bottom px-4 py-4 d-flex align-items-center justify-content-between shadow-sm sticky-top">

      {/* Brand / Title */}
      <div
        className="d-inline-flex align-items-center gap-3 px-3 py-2 rounded-pill"
        style={{
          background: "rgba(255, 102, 0, 0.08)", 
          border: "1px solid rgba(255, 102, 0, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: "32px", height: "32px" }}>
          <i className="bi bi-fingerprint" style={{ color: "#FF6600", fontSize: "1.2rem" }}></i>
        </div>
        <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>Syandrix</h5>
        <span
          className="badge rounded-pill bg-white text-dark shadow-sm px-3 py-1"
          style={{ fontSize: "0.65rem", letterSpacing: "1px", border: "1px solid #eee" }}
        >
         MANAGEMENT CONSOLE
        </span>
      </div>

      {/* Actions & Profile */}
      <div className="d-flex align-items-center gap-3">

        {showAttendanceButton && (
          <button
            onClick={handleAttendanceToggle}
            disabled={loading}
            className={`btn d-flex align-items-center gap-2 fw-bold text-white shadow-sm rounded-pill px-3 py-1 ${isCheckedIn ? "btn-danger" : "btn-success"
              }`}
            style={{ transition: "all 0.2s ease" }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className={`bi ${isCheckedIn ? "bi-stop-circle-fill" : "bi-play-circle-fill"}`}></i>
            )}
            <span className="d-none d-sm-inline">
              {loading ? "Processing..." : isCheckedIn ? "Punch Out" : "Punch In"}
            </span>
          </button>
        )}

        {/* User Profile Capsule */}
        <div
          className="d-flex align-items-center gap-2 py-1 px-3 rounded-pill bg-light border"
          style={{ cursor: "pointer", transition: "all 0.2s ease" }}
          onClick={() => navigate("/profile")}
          onMouseOver={(e) => e.currentTarget.classList.add("bg-secondary-subtle")}
          onMouseOut={(e) => e.currentTarget.classList.remove("bg-secondary-subtle")}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
            style={{ width: "34px", height: "34px", backgroundColor: "#FF6600" }}
          >
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : <i className="bi bi-person-fill fs-5"></i>}
          </div>

          <span className="fw-semibold text-dark d-none d-sm-inline" style={{ fontSize: "14px" }}>
            {user?.fullName || user?.firstName || "User"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="btn d-flex align-items-center gap-2 fw-bold text-white shadow-sm"
          style={{
            backgroundColor: "#FF6600",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#E05500"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#FF6600"}
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
          <span className="d-none d-sm-inline">Logout</span>
        </button>

      </div>
    </header>
  );
}

export default Header;