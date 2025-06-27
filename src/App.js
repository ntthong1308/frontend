import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { ToastContainer } from 'react-toastify';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import "./style/booking.css";
import "./style/dashboard.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Common component
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy load components for better performance
// Public pages
const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const RegisterPage = lazy(() => import("./pages/auth/Register"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPassword"));
const Services = lazy(() => import("./pages/public/Services"));
const Equipment = lazy(() => import("./pages/public/Equipment"));
const News = lazy(() => import("./pages/public/News"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Specialties = lazy(() => import("./pages/Specialties"));
const ChatBot = lazy(() => import("./pages/ChatBot")); // Updated to match correct capitalization

// Patient pages
const DoctorSearch = lazy(() => import("./pages/patient/DoctorSearch"));
const DoctorDetails = lazy(() => import("./pages/patient/DoctorDetail"));
const BookAppointment = lazy(() => import("./pages/patient/BookAppointment"));
const PatientAppointments = lazy(() => import("./pages/patient/PatientAppointments"));
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));

// Doctor pages
const DoctorAppointments = lazy(() => import("./pages/doctor/DoctorAppointment"));
const DoctorProfile = lazy(() => import("./pages/doctor/DoctorProfile"));
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const DepartmentManager = lazy(() => import("./pages/admin/department"));

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Đang tải...</span>
    </Spinner>
  </div>
);

// Utility Components
const AppointmentConfirmation = () => {
  return (
    <Container className="py-5">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill display-1 text-success"></i>
        </div>
        <h2 className="mb-3">Xác nhận đặt lịch thành công!</h2>
        <p className="text-muted mb-4">
          Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn để xác nhận thời gian cụ thể.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/patient/appointments" className="btn btn-primary">
            <i className="bi bi-calendar-check me-1"></i>
            Xem lịch hẹn
          </Link>
          <Link to="/doctors" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Đặt lịch khác
          </Link>
        </div>
      </div>
    </Container>
  );
};

const UnauthorizedPage = () => {
  return (
    <Container className="py-5">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-shield-exclamation display-1 text-warning"></i>
        </div>
        <h2 className="mb-3">Không có quyền truy cập</h2>
        <p className="text-muted mb-4">
          Bạn không có quyền để truy cập trang này. Vui lòng đăng nhập với tài khoản phù hợp.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house me-1"></i>
            Về trang chủ
          </Link>
          <Link to="/login" className="btn btn-outline-secondary">
            <i className="bi bi-person me-1"></i>
            Đăng nhập
          </Link>
        </div>
      </div>
    </Container>
  );
};

const NotFoundPage = () => {
  return (
    <Container className="py-5">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-question-circle display-1 text-muted"></i>
        </div>
        <h2 className="mb-3">Trang không tồn tại</h2>
        <p className="text-muted mb-4">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house me-1"></i>
          Về trang chủ
        </Link>
      </div>
    </Container>
  );
};

// APP COMPONENT
function AppWithRouter() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      <main className="main-content flex-grow-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            {/* Information pages */}
            <Route path="/services" element={<Services />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/departments" element={<Specialties />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/chat" element={<ChatBot />} />

            {/* Doctor Search routes */}
            <Route path="/doctors" element={<DoctorSearch />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />

            {/* Appointment routes */}
            <Route path="/appointments/confirmation" element={<AppointmentConfirmation />} />

            {/* Admin Routes Group */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/managedepartments" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DepartmentManager />
              </ProtectedRoute>
            } />

            {/* Patient Routes Group */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={["PATIENT", "ADMIN"]}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patient/dashboard" element={
              <ProtectedRoute allowedRoles={["PATIENT", "ADMIN"]}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patient/appointments" element={
              <ProtectedRoute allowedRoles={["PATIENT", "ADMIN"]}>
                <PatientAppointments />
              </ProtectedRoute>
            } />
            <Route path="/patient/profile" element={
              <ProtectedRoute allowedRoles={["PATIENT", "ADMIN"]}>
                <PatientProfile />
              </ProtectedRoute>
            } />
            <Route path="/book-appointment/:id" element={
              <ProtectedRoute allowedRoles={["PATIENT", "ADMIN"]}>
                <BookAppointment />
              </ProtectedRoute>
            } />

            {/* Doctor Routes Group */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={["DOCTOR", "ADMIN"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute allowedRoles={["DOCTOR", "ADMIN"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/appointments" element={
              <ProtectedRoute allowedRoles={["DOCTOR", "ADMIN"]}>
                <DoctorAppointments />
              </ProtectedRoute>
            } />
            <Route path="/doctor/profile" element={
              <ProtectedRoute allowedRoles={["DOCTOR", "ADMIN"]}>
                <DoctorProfile />
              </ProtectedRoute>
            } />

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;