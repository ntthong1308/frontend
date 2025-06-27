import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Logo from '../../assets/logo/logo';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin, isDoctor, isPatient } = useAuth();

  // Hàm xác định đường dẫn profile dựa vào vai trò người dùng
  const getProfilePath = () => {
    if (isDoctor) return "/doctor/profile";
    if (isPatient) return "/patient/profile";
    if (isAdmin) return "/admin/profile";
    return "/profile";
  };

  // Hàm xác định đường dẫn dashboard dựa vào vai trò người dùng
  const getDashboardPath = () => {
    if (isAdmin) return "/admin";
    if (isDoctor) return "/doctor";
    if (isPatient) return "/patient";
    return "/";
  };

  return (
    <header>
      {/* Top Header */}
      <div className="header-top">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Logo />
            </div>
            <div className="header-info">
              <div className="header-contact">
                <i className="bi bi-telephone-fill me-2"></i>
                <span>Hotline: 1900 1080</span>
              </div>
              <div className="header-actions">
                {!isAuthenticated ? (
                  <Link to="/login" className="header-action-btn">
                    <i className="bi bi-person-fill me-1"></i>
                    <span>Đăng nhập</span>
                  </Link>
                ) : (
                  <NavDropdown 
                    title={
                      <div className="d-inline-block">
                        <i className="bi bi-person-fill me-1"></i>
                        <span>
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user?.username || 'User'}
                        </span>
                      </div>
                    } 
                    id="user-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to={getProfilePath()}>
                      <i className="bi bi-person-circle me-2"></i>Thông tin tài khoản
                    </NavDropdown.Item>
                    
                    <NavDropdown.Item as={Link} to={getDashboardPath()}>
                      <i className="bi bi-speedometer2 me-2"></i>
                      {isAdmin && "Bảng điều khiển Admin"}
                      {isDoctor && "Bảng điều khiển Bác sĩ"}
                      {isPatient && "Bảng điều khiển Bệnh nhân"}
                    </NavDropdown.Item>
                    
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                <Link to="/chat" className="header-action-btn">
                  <i className="bi bi-chat-dots-fill me-1"></i>
                  <span>Hỏi đáp</span>
                </Link>
                {!isDoctor && !isAdmin && (
                  <Link to="/book-appointment" className="header-action-btn">
                    <i className="bi bi-calendar-check-fill me-1"></i>
                    <span>Đặt lịch khám</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Menu */}
      <Navbar bg="light" expand="lg" className="main-menu">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="menu-item">Giới thiệu</Nav.Link>
              <Nav.Link as={Link} to="/departments" className="menu-item">Chuyên khoa</Nav.Link>
              <Nav.Link as={Link} to="/doctors" className="menu-item">Bác sĩ</Nav.Link>
              <Nav.Link as={Link} to="/services" className="menu-item">Dịch vụ đặc biệt</Nav.Link>
              <Nav.Link as={Link} to="/equipment" className="menu-item">Trang thiết bị</Nav.Link>
              <Nav.Link as={Link} to="/news" className="menu-item">Tin tức</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="menu-item">Liên hệ</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;