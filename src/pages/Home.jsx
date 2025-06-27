import React, { useState, useEffect } from "react"
import { Container, Row, Col, Button, Card, Badge, Modal, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { doctorAPI } from '../services/api';

const Home = () => {
  const { currentUser } = useAuth()
  const [showQuickBookModal, setShowQuickBookModal] = useState(false)
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    happyPatients: 0
  })
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  // Animate numbers on load
  useEffect(() => {
    const animateValue = (start, end, duration, setValue) => {
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        setValue(Math.floor(progress * (end - start) + start))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }

    setTimeout(() => {
      animateValue(0, 150, 2000, (val) => setStats(prev => ({ ...prev, totalDoctors: val })))
      animateValue(0, 15000, 2200, (val) => setStats(prev => ({ ...prev, totalAppointments: val })))
      animateValue(0, 8500, 1800, (val) => setStats(prev => ({ ...prev, happyPatients: val })))
    }, 500)
  }, [])

  useEffect(() => {
    const fetchFeaturedDoctors = async () => {
      try {
        const res = await doctorAPI.getAll();
        let doctors = res.data || [];
        // Nếu có rating, lấy top 3 rating cao nhất, nếu không thì lấy 3 bác sĩ đầu tiên
        if (doctors.length > 0) {
          // Nếu có trường rating
          if (doctors.some(doc => doc.rating !== undefined)) {
            doctors = [...doctors].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }
          setFeaturedDoctors(doctors.slice(0, 3));
        } else {
          setFeaturedDoctors([]);
        }
      } catch (err) {
        setFeaturedDoctors([]);
      }
    };
    fetchFeaturedDoctors();
  }, []);

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>)
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>)
    }
    return stars
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section bg-white text-dark py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <div className="hero-content">
                <Badge bg="primary" className="mb-3 px-3 py-2">
                  <i className="bi bi-award me-2"></i>
                  Đáng tin cậy #1 Việt Nam
                </Badge>
                <h1 className="display-4 fw-bold mb-4">
                  Đặt lịch khám bệnh dễ dàng với 
                  <span className="text-primary"> MediSched</span>
                </h1>
                <p className="lead mb-4 text-muted">
                  Hệ thống đặt lịch khám bệnh trực tuyến hiện đại, kết nối bạn với các bác sĩ chuyên khoa hàng đầu.
                </p>
                
                {/* Mini Stats */}
                <Row className="mb-4 stats-row">
                  <Col xs={4}>
                    <div className="text-center">
                      <h5 className="fw-bold text-primary mb-0">{stats.totalDoctors}+</h5>
                      <small className="text-muted">Bác sĩ</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="text-center">
                      <h5 className="fw-bold text-success mb-0">{stats.totalAppointments.toLocaleString()}+</h5>
                      <small className="text-muted">Lịch hẹn</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="text-center">
                      <h5 className="fw-bold text-info mb-0">{stats.happyPatients.toLocaleString()}+</h5>
                      <small className="text-muted">Bệnh nhân</small>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  {currentUser ? (
                    <>
                      <Button as={Link} to="/doctors" size="lg" variant="primary" className="btn-hover">
                        <i className="bi bi-search me-2"></i>
                        Tìm bác sĩ ngay
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button as={Link} to="/doctors" size="lg" variant="primary" className="btn-hover">
                        <i className="bi bi-search me-2"></i>
                        Tìm bác sĩ
                      </Button>
                      <Button as={Link} to="/register" size="lg" variant="outline-primary" className="btn-hover">
                        <i className="bi bi-person-plus me-2"></i>
                        Đăng ký ngay
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image-container">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                  alt="Medical consultation"
                  className="img-fluid rounded shadow-sm main-image"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=400&width=600"
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Doctors - Simple Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Bác sĩ nổi bật</h2>
              <p className="lead text-muted">Gặp gỡ những bác sĩ uy tín và được đánh giá cao nhất</p>
            </Col>
          </Row>
          <Row>
            {featuredDoctors.map((doctor) => (
              <Col key={doctor.id} lg={4} md={6} className="mb-4">
                <Card className="doctor-card border-0 shadow-sm h-100">
                  <div className="position-relative">
                    <img
                      src={doctor.imageUrl || doctor.avatar || 'https://via.placeholder.com/200x200?text=Doctor'}
                      alt={doctor.fullName || doctor.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                    <Badge bg="primary" className="position-absolute top-0 end-0 m-3">
                      {doctor.specialty}
                    </Badge>
                  </div>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-2">{doctor.fullName || doctor.name}</h5>
                    <p className="text-muted mb-2">
                      <i className="bi bi-briefcase me-2"></i>
                      {doctor.experience ? `${doctor.experience} kinh nghiệm` : ''}
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-2">
                        {renderStars(doctor.rating || 0)}
                      </div>
                      <span className="text-muted small">
                        {doctor.rating || 0} {doctor.reviews ? `(${doctor.reviews} đánh giá)` : ''}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">Phí khám từ</small>
                        <div className="fw-bold text-success">{doctor.fee ? doctor.fee.toLocaleString('vi-VN') + 'đ' : ''}</div>
                      </div>
                      <Button variant="primary" size="sm" as={Link} to={`/doctors/${doctor.id}`}>
                        Đặt lịch
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="text-center mt-4">
            <Col>
              <Button as={Link} to="/doctors" variant="outline-primary" size="lg">
                Xem tất cả bác sĩ
                <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section - Keep Original Style */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold">Tại sao chọn MediSched?</h2>
              <p className="lead text-muted">Chúng tôi mang đến trải nghiệm đặt lịch khám bệnh tốt nhất</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <div className="text-center feature-item">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 feature-icon"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-calendar-check fs-2"></i>
                </div>
                <h4>Đặt lịch dễ dàng</h4>
                <p className="text-muted">Đặt lịch khám bệnh chỉ với vài cú click, tiết kiệm thời gian và công sức.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="text-center feature-item">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 feature-icon"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-people fs-2"></i>
                </div>
                <h4>Bác sĩ chuyên khoa</h4>
                <p className="text-muted">Đội ngũ bác sĩ giàu kinh nghiệm, chuyên khoa đa dạng phục vụ mọi nhu cầu.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="text-center feature-item">
                <div
                  className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 feature-icon"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-shield-check fs-2"></i>
                </div>
                <h4>An toàn & Bảo mật</h4>
                <p className="text-muted">Thông tin cá nhân được bảo mật tuyệt đối theo tiêu chuẩn quốc tế.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section - Keep Original Style */}
      <section className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-4">Bắt đầu chăm sóc sức khỏe của bạn ngay hôm nay</h2>
              <p className="lead text-muted mb-4">
                Tham gia cùng hàng nghìn bệnh nhân đã tin tưởng MediSched
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                {!currentUser && (
                  <Button as={Link} to="/register" size="lg" variant="primary" className="btn-hover">
                    <i className="bi bi-person-plus me-2"></i>
                    Đăng ký miễn phí
                  </Button>
                )}
                <Button as={Link} to="/doctors" size="lg" variant="outline-primary" className="btn-hover">
                  <i className="bi bi-search me-2"></i>
                  Tìm bác sĩ ngay
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Subtle CSS Styles */}
      <style jsx>{`
        .hero-content {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .stats-row {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
        
        .main-image {
          animation: fadeInRight 0.8s ease-out 0.2s both;
          transition: transform 0.3s ease;
        }
        
        .main-image:hover {
          transform: translateY(-5px);
        }
        
        .floating-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          animation: float 2s ease-in-out infinite;
        }
        
        .feature-item {
          transition: transform 0.3s ease;
        }
        
        .feature-item:hover {
          transform: translateY(-5px);
        }
        
        .feature-icon {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-item:hover .feature-icon {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .doctor-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .doctor-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        
        .btn-hover {
          transition: all 0.3s ease;
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
        
        .min-vh-50 {
          min-height: 60vh;
        }
        
        @media (max-width: 768px) {
          .floating-badge {
            display: none;
          }
          
          .display-4 {
            font-size: 2.2rem;
          }
          
          .stats-row {
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Home