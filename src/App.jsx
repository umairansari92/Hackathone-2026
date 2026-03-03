import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Role Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import PatientDashboard from "./pages/PatientDashboard";

// Admin pages
import ManageDoctors from "./pages/ManageDoctors";
import ManageUsers from "./pages/ManageUsers";

// Doctor pages
import SmartDiagnosis from "./pages/SmartDiagnosis";
import NewPrescription from "./pages/NewPrescription";

// Receptionist pages
import BookAppointment from "./pages/BookAppointment";
import TokenQueue from "./pages/TokenQueue";
import DoctorScheduleView from "./pages/DoctorScheduleView";

// Shared pages
import PatientsList from "./pages/PatientsList";
import AppointmentsList from "./pages/AppointmentsList";
import PrescriptionsList from "./pages/PrescriptionsList";
import PrescriptionViewer from "./pages/PrescriptionViewer";

// Patient module pages
import PatientBookAppointment from "./pages/PatientBookAppointment";
import MedicalHistory from "./pages/MedicalHistory";
import PatientQueueStatus from "./pages/PatientQueueStatus";
import PatientProfile from "./pages/PatientProfile";

// Onboarding pages
import InviteDoctor from "./pages/InviteDoctor";
import DoctorRequests from "./pages/DoctorRequests";
import DoctorRegister from "./pages/DoctorRegister";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            borderRadius: 12,
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "#0d9488", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate
                    to={`/${user.role?.toLowerCase()}-dashboard`}
                    replace
                  />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate
                    to={`/${user.role?.toLowerCase()}-dashboard`}
                    replace
                  />
                ) : (
                  <Signup />
                )
              }
            />
            <Route path="/doctor-register" element={<DoctorRegister />} />
          </Route>

          {/* Protected layout */}
          <Route element={<Layout />}>
            {/* ── Admin ── */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/manage-doctors" element={<ManageDoctors />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/admin/invite-doctor" element={<InviteDoctor />} />
              <Route
                path="/admin/doctor-requests"
                element={<DoctorRequests />}
              />
            </Route>

            {/* ── Doctor ── */}
            <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/smart-diagnosis" element={<SmartDiagnosis />} />
              <Route path="/prescriptions/new" element={<NewPrescription />} />
            </Route>

            {/* ── Receptionist ── */}
            <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
              <Route
                path="/receptionist-dashboard"
                element={<ReceptionistDashboard />}
              />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/token-queue" element={<TokenQueue />} />
              <Route path="/doctor-schedule" element={<DoctorScheduleView />} />
            </Route>

            {/* ── Patient ── */}
            <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route
                path="/patient/book"
                element={<PatientBookAppointment />}
              />
              <Route
                path="/patient/my-appointments"
                element={<AppointmentsList />}
              />
              <Route path="/medical-history" element={<MedicalHistory />} />
              <Route
                path="/patient/my-queue"
                element={<PatientQueueStatus />}
              />
              <Route path="/patient-profile" element={<PatientProfile />} />
            </Route>

            {/* ── Shared (multi-role) ── */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Doctor", "Receptionist", "Patient"]}
                />
              }
            >
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/prescriptions" element={<PrescriptionsList />} />
              <Route
                path="/prescriptions/:id"
                element={<PrescriptionViewer />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
