import { useNavigate } from "react-router-dom";
import HasPermission from "../../components/common/HasPermission"; 

function DepartmentTable({ departments, onEdit, onDelete }) {
  const navigate = useNavigate(); 
  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-nowrap">
          <thead className="table-light">
            <tr>
              <th className="py-3 px-4 text-muted small text-uppercase" style={{ width: "60px" }}>#</th>
              <th className="py-3 text-muted small text-uppercase">Department Info</th>
              <th className="py-3 text-muted small text-uppercase">Department Head</th>
              <th className="py-3 text-muted small text-uppercase">Status</th>
              <th className="py-3 text-end px-4 text-muted small text-uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="border-top-0">
            {departments.length > 0 ? (
              departments.map((department, index) => (
                <tr key={department._id || index}>
                  <td className="px-4 py-3 text-muted fw-medium">{index + 1}</td>

                  <td className="py-3">
                    <div className="d-flex flex-column">
                      <span className="fw-bold text-dark">{department.name}</span>
                      <span className="text-muted small">Code: <span className="badge bg-light text-dark border px-1">{department.code}</span></span>
                    </div>
                  </td>

                  <td className="py-3">
                    {department.head ? (
                      <span className="fw-medium text-secondary">
                        <i className="bi bi-person-badge text-primary me-2"></i>
                        {department.head.name || department.head.firstName || department.head}
                      </span>
                    ) : (
                      <span className="text-muted small fst-italic">Not Assigned</span>
                    )}
                  </td>

                  <td className="py-3">
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        department.isActive !== false
                          ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                          : "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
                      }`}
                    >
                      {department.isActive !== false ? "🟢 Active" : "🔴 Inactive"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-end">
                    
                    {/*  View Button protected with departments.read */}
                    <HasPermission requiredPermission="departments.read">
                      <button
                        className="btn btn-light btn-sm rounded-circle me-2 text-success shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => navigate(`/departments/${department._id}`)} 
                        title="View Details"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </HasPermission>

                    {/*  Edit Button protected with departments.update */}
                    <HasPermission requiredPermission="departments.update">
                      <button
                        className="btn btn-light btn-sm rounded-circle me-2 text-primary shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => onEdit(department)}
                        title="Edit Department"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    </HasPermission>

                    {/*  Status/Delete Button protected with departments.delete */}
                    <HasPermission requiredPermission="departments.update">
                      <button
                        className="btn btn-light btn-sm rounded-circle text-danger shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => onDelete(department)}
                        title="Toggle Status"
                      >
                         <i className={department.isActive !== false ? "bi bi-toggle-on text-success" : "bi bi-toggle-off text-danger"}></i>
                      </button>
                    </HasPermission>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div className="text-muted mb-2"><i className="bi bi-inbox fs-1"></i></div>
                  <h6 className="fw-semibold">No Departments Found</h6>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card-footer bg-white border-top py-3 text-muted small text-center">
        Showing {departments.length} {departments.length === 1 ? "department" : "departments"} on this page.
      </div>
    </div>
  );
}

export default DepartmentTable;