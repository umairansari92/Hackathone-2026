import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import SmartDiagnosis from "./pages/SmartDiagnosis";
import NewPrescription from "./pages/NewPrescription";

// Shared List Views
import PatientsList from "./pages/PatientsList";
import AppointmentsList from "./pages/AppointmentsList";
import PrescriptionsList from "./pages/PrescriptionsList";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={`/${user.role?.toLowerCase() || "patient"}-dashboard`}
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
                  to={`/${user.role?.toLowerCase() || "patient"}-dashboard`}
                  replace
                />
              ) : (
                <Signup />
              )
            }
          />
        </Route>

        {/* Protected Routes Wrapper */}
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/smart-diagnosis" element={<SmartDiagnosis />} />
            <Route path="/prescriptions/new" element={<NewPrescription />} />
          </Route>

          {/* Receptionist Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
            <Route
              path="/receptionist-dashboard"
              element={<ReceptionistDashboard />}
            />
          </Route>

          {/* Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
          </Route>

          {/* Shared Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Doctor", "Receptionist", "Patient"]}
              />
            }
          >
            <Route
              path="/patients"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin", "Doctor", "Receptionist"]}
                >
                  <PatientsList />
                </ProtectedRoute>
              }
            />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/prescriptions" element={<PrescriptionsList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
