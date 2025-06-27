import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalDepartments: 0,
    todayAppointments: 0,
    pendingDoctorRequests: 0,
  });
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDoctorsModal, setShowDoctorsModal] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [patientsList, setPatientsList] = useState([]);
  const [showTodayAppointmentsModal, setShowTodayAppointmentsModal] = useState(false);
  const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);
  const [showDepartmentsModal, setShowDepartmentsModal] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Lấy danh sách bác sĩ chờ duyệt
        const doctorReqRes = await axios.get('http://localhost:8080/doctor/get-all-requests', config);
        setDoctorRequests(doctorReqRes.data);

        // Lấy tổng số bác sĩ
        const doctorsRes = await axios.get('http://localhost:8080/doctor/get-all', config);
        // Lấy tổng số bệnh nhân
        const patientsRes = await axios.get('http://localhost:8080/patient/get-all', config);
        // Lấy tổng số khoa
        const departmentsRes = await axios.get('http://localhost:8080/department/get-all', config);
        // Lấy tất cả lịch hẹn
        const appointmentsRes = await axios.get('http://localhost:8080/appointment/get-all', config);

        // Thống kê số lịch hẹn hôm nay
        const today = new Date().toISOString().slice(0, 10);
        const todayAppointments = appointmentsRes.data.filter(app => app.appointmentDate && app.appointmentDate.startsWith(today)).length;

        setStats({
          totalDoctors: doctorsRes.data.length,
          totalPatients: patientsRes.data.length,
          totalDepartments: departmentsRes.data.length,
          todayAppointments,
          pendingDoctorRequests: doctorReqRes.data.filter(req => req.status === 'pending').length,
        });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setDoctorRequests([]);
        setStats({
          totalDoctors: 0,
          totalPatients: 0,
          totalDepartments: 0,
          todayAppointments: 0,
          pendingDoctorRequests: 0,
        });
      }
    };
    fetchData();
  }, []);

  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:8080/doctor/decide-request', {
        id: requestId,
        status: 'approved'
      }, config);
      setDoctorRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req));
      setStats(prev => ({
        ...prev,
        totalDoctors: prev.totalDoctors + 1,
        pendingDoctorRequests: prev.pendingDoctorRequests - 1
      }));
      setShowRequestModal(false);
    } catch (error) {}
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:8080/doctor/decide-request', {
        id: requestId,
        status: 'rejected'
      }, config);
      setDoctorRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));
      setStats(prev => ({
        ...prev,
        pendingDoctorRequests: prev.pendingDoctorRequests - 1
      }));
      setShowRequestModal(false);
    } catch (error) {}
  };

  const fetchDoctorsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8080/doctor/get-all', config);
      setDoctorsList(res.data);
    } catch (error) {
      setDoctorsList([]);
    }
  };

  const fetchPatientsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8080/patient/get-all', config);
      setPatientsList(res.data);
    } catch (error) {
      setPatientsList([]);
    }
  };

  const fetchTodayAppointmentsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8080/appointment/get-all', config);
      const today = new Date().toISOString().slice(0, 10);
      const filtered = res.data.filter(app => app.appointmentDate && app.appointmentDate.startsWith(today));
      setTodayAppointmentsList(filtered);
    } catch (error) {
      setTodayAppointmentsList([]);
    }
  };

  const fetchDepartmentsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8080/department/get-all', config);
      setDepartmentsList(res.data);
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Bảng điều khiển Quản trị viên</h2>
      <Row className="mb-4 justify-content-center gap-2">
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-primary">
            <Card.Body>
              <div className="display-6 text-primary mb-2"><i className="bi bi-person-badge"></i></div>
              <div className="display-6 mb-2">{stats.totalDoctors}</div>
              <Card.Title className="h6">Bác sĩ</Card.Title>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  fetchDoctorsList();
                  setShowDoctorsModal(true);
                }}
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-success">
            <Card.Body>
              <div className="display-6 text-success mb-2"><i className="bi bi-people"></i></div>
              <div className="display-6 mb-2">{stats.totalPatients}</div>
              <Card.Title className="h6">Bệnh nhân</Card.Title>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  fetchPatientsList();
                  setShowPatientsModal(true);
                }}
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-info">
            <Card.Body>
              <div className="display-6 text-info mb-2"><i className="bi bi-building"></i></div>
              <div className="display-6 mb-2">{stats.totalDepartments}</div>
              <Card.Title className="h6">Chuyên khoa</Card.Title>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => {
                  fetchDepartmentsList();
                  setShowDepartmentsModal(true);
                }}
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-warning">
            <Card.Body>
              <div className="display-6 text-warning mb-2"><i className="bi bi-calendar-check"></i></div>
              <div className="display-6 mb-2">{stats.todayAppointments}</div>
              <Card.Title className="h6">Hẹn hôm nay</Card.Title>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => {
                  fetchTodayAppointmentsList();
                  setShowTodayAppointmentsModal(true);
                }}
              >
                Xem chi tiết
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-danger">
            <Card.Body>
              <div className="display-6 text-danger mb-2"><i className="bi bi-exclamation-circle"></i></div>
              <div className="display-6 mb-2">{stats.pendingDoctorRequests}</div>
              <Card.Title className="h6">Yêu cầu BS</Card.Title>
              <Button variant="outline-danger" size="sm">Xem ngay</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0"><i className="bi bi-person-plus me-2"></i>Yêu cầu làm bác sĩ mới ({stats.pendingDoctorRequests})</h5>
            </Card.Header>
            <Card.Body>
              {doctorRequests.filter(req => req.status === 'pending').length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle display-1 text-success"></i>
                  <p className="text-muted mt-3">Không có yêu cầu mới nào</p>
                </div>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Chuyên khoa</th>
                      <th>Kinh nghiệm</th>
                      <th>Ngày gửi</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorRequests.filter(req => req.status === 'pending').map(request => (
                      <tr key={request.id}>
                        <td>{request.name}</td>
                        <td>{request.specialty}</td>
                        <td>{request.experience}</td>
                        <td>{request.submittedAt ? new Date(request.submittedAt).toLocaleDateString('vi-VN') : ''}</td>
                        <td>
                          <Badge bg="warning">Chờ duyệt</Badge>
                        </td>
                        <td>
                          <Button variant="success" size="sm" onClick={() => handleApproveRequest(request.id)}>Duyệt</Button>{' '}
                          <Button variant="danger" size="sm" onClick={() => handleRejectRequest(request.id)}>Từ chối</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showDoctorsModal} onHide={() => setShowDoctorsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-person-badge me-2"></i>
            <span className="fw-bold">Danh sách Bác sĩ</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-primary">
              <tr className="text-center">
                <th>Họ tên</th>
                <th>Email</th>
                <th>Chuyên khoa</th>
                <th>Kinh nghiệm</th>
              </tr>
            </thead>
            <tbody>
              {doctorsList.map((doctor) => (
                <tr key={doctor.id} className="text-center">
                  <td>{doctor.fullName || doctor.name || doctor.username || doctor.email}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.experience}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showPatientsModal} onHide={() => setShowPatientsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-people me-2"></i>
            <span className="fw-bold">Danh sách Bệnh nhân</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-success">
              <tr className="text-center">
                <th>Họ tên</th>
                <th>Email</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
              </tr>
            </thead>
            <tbody>
              {patientsList.map((patient) => (
                <tr key={patient.id} className="text-center">
                  <td>{patient.fullName || patient.name || patient.username || patient.email}</td>
                  <td>{patient.email}</td>
                  <td>{patient.dob}</td>
                  <td>{patient.gender}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showTodayAppointmentsModal} onHide={() => setShowTodayAppointmentsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-calendar-check me-2"></i>
            <span className="fw-bold">Lịch hẹn hôm nay</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-warning">
              <tr className="text-center">
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Chuyên khoa</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointmentsList.map((app) => (
                <tr key={app.id} className="text-center">
                  <td>{app.patientName}</td>
                  <td>{app.doctorName}</td>
                  <td>{app.departmentName || app.specialty}</td>
                  <td>{app.appointmentDate} {app.appointmentTime}</td>
                  <td>
                    {app.status === 'confirmed' && <span className="badge bg-success">Đã xác nhận</span>}
                    {app.status === 'pending' && <span className="badge bg-warning text-dark">Chờ xác nhận</span>}
                    {app.status === 'cancelled' && <span className="badge bg-danger">Đã hủy</span>}
                    {!['confirmed','pending','cancelled'].includes(app.status) && <span className="badge bg-secondary">{app.status}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showDepartmentsModal} onHide={() => setShowDepartmentsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-building me-2"></i>
            <span className="fw-bold">Danh sách Chuyên khoa</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-info">
              <tr className="text-center">
                <th>Tên chuyên khoa</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {departmentsList.map((dep) => (
                <tr key={dep.id} className="text-center">
                  <td>{dep.name}</td>
                  <td>{dep.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;