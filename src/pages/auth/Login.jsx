import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo.png";

function Login() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await login(data);

      if (response && response.success) {
        toast.success(response.message || "Authentication successful. Redirecting to dashboard...");
        
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 600);
        
      } else {
        toast.error(response?.message || "Invalid email or password. Please verify your credentials.");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to connect to the authentication server. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeInUp 0.7s ease-out;
          }

          @keyframes slideOutUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100vh); opacity: 0; }
          }
          .animate-slide-out {
            animation: slideOutUp 0.9s cubic-bezier(0.5, 0, 0.2, 1) forwards; 
          }

          .custom-input:focus {
            border-color: #FF6600 !important;
            box-shadow: 0 0 0 0.25rem rgba(255, 102, 0, 0.25) !important;
          }
          .btn-login {
            transition: all 0.3s ease;
          }
          .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(255, 102, 0, 0.3) !important;
          }
        `}
      </style>

      <div 
        className={`container-fluid vh-100 d-flex align-items-center justify-content-center ${isSuccess ? "animate-slide-out" : ""}`}
        style={{ background: "linear-gradient(135deg, #FFF3EB 0%, #F8F9FA 100%)", transition: "background 0.5s ease" }}
      >
        <div
          className="card p-5 shadow-lg border-0 bg-white animate-fade-in"
          style={{ width: "100%", maxWidth: "420px", borderRadius: "16px" }}
        >
          <div className="text-center mb-4 pb-2">
            <img 
              src={logo} 
              alt="Syandrix Infotech Logo" 
              style={{ height: "75px", width: "auto", objectFit: "contain" }} 
              className="mb-3"
            />
            
            <h2 className="fw-bold fs-4 mb-0" style={{ letterSpacing: "0.5px" }}>
              <span style={{ color: "#FF6600" }}>Syandrix</span>
              <span style={{ color: "#333" }}> Infotech</span>
            </h2>
            <p className="fw-semibold text-secondary small mb-2" style={{ letterSpacing: "1px" }}>
              PVT. LTD.
            </p>
            <p className="text-muted small mt-3">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: "#555" }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  className={`form-control custom-input border-start-0 bg-light ${errors.email ? "is-invalid" : ""}`}
                  placeholder="name@syandrix.com"
                  style={{ padding: "12px" }}
                  disabled={loading || isSuccess}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address format",
                    }
                  })}
                />
              </div>
              {errors.email && (
                <div className="text-danger small mt-1 fw-medium">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ color: "#555" }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  className={`form-control custom-input border-start-0 bg-light ${errors.password ? "is-invalid" : ""}`}
                  placeholder="*********"
                  style={{ padding: "12px" }}
                  disabled={loading || isSuccess} 
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    }
                  })}
                />
              </div>
              {errors.password && (
                <div className="text-danger small mt-1 fw-medium">{errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-login w-100 fw-bold text-white d-flex align-items-center justify-content-center"
              disabled={loading || isSuccess}
              style={{
                backgroundColor: (loading || isSuccess) ? "#E05500" : "#FF6600",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                cursor: (loading || isSuccess) ? "not-allowed" : "pointer"
              }}
            >
              {loading && !isSuccess ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : isSuccess ? (
                <>
                  <i className="bi bi-check-circle-fill me-2 fs-5"></i> Redirecting...
                </>
              ) : (
                <>
                  Login to Dashboard <i className="bi bi-arrow-right ms-2 fs-5"></i>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default Login;