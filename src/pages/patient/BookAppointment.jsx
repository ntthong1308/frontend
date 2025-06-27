"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ProgressBar, Modal } from "react-bootstrap"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { doctorAPI, appointmentAPI } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function BookAppointment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const queryParams = new URLSearchParams(location.search)

  // Get date and time from query params if available
  const preSelectedDate = queryParams.get("date") || ""
  const preSelectedTime = queryParams.get("time") || ""

  // State variables
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [doctor, setDoctor] = useState(null)
  const [formData, setFormData] = useState({
    date: preSelectedDate,
    time: preSelectedTime,
    symptoms: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
    paymentMethod: "CASH", // cash, online
    useInsurance: false,
    insuranceProvider: "",
    insuranceNumber: "",
  })
  const [timeSlots, setTimeSlots] = useState([])
  const [success, setSuccess] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState(null)

  // Default time slots available for any date
  const defaultTimeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ]

  // Update form data when user info is available
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
        phone: (currentUser.phoneNumber || currentUser.phone || "").toString(),
        email: currentUser.email || "",
      }))
    }
  }, [currentUser])

  // Fetch doctor data
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await doctorAPI.getById(id)
        const doctorData = response.data

        setDoctor(doctorData)
        setTimeSlots(defaultTimeSlots)

        if (preSelectedTime && defaultTimeSlots.includes(preSelectedTime)) {
          setFormData(prev => ({ ...prev, time: preSelectedTime }))
        }
      } catch (err) {
        setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại.")
        console.error("Error loading doctor:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadDoctor()
    }
  }, [id, preSelectedDate, preSelectedTime])

  const processPayment = async () => {
  if (formData.paymentMethod === 'CASH') {
    return { success: true, method: 'CASH' };
  }

  if (formData.paymentMethod === 'ONLINE') {
    try {
      const appointmentData = {
        doctorId: Number.parseInt(id),
        patientId: currentUser?.id,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        symptoms: formData.symptoms,
        notes: formData.notes,
        patientName: formData.name,
        patientPhone: formData.phone,
        patientEmail: formData.email,
        status: 'PENDING',
        paymentMethod: 'ONLINE',
        paymentStatus: 'PENDING',
        consultationFee: doctor.fee || 0,
      };

      const response = await appointmentAPI.book(appointmentData);
      const appointment = response.data;

      if (appointment.paymentUrl) {
        window.location.href = appointment.paymentUrl;
        return { success: false }; // Dừng lại vì đã chuyển trang
      } else {
        return { success: false, error: 'Không nhận được URL thanh toán từ hệ thống.' };
      }
    } catch (err) {
      console.error('Lỗi khi tạo thanh toán VNPAY:', err);
      return { success: false, error: 'Không thể khởi tạo thanh toán VNPAY.' };
    }
  }

  return { success: false, error: 'Phương thức thanh toán không hợp lệ' };
};


  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }))
  }
  // Format date functions
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000))
    const year = maxDate.getFullYear()
    const month = String(maxDate.getMonth() + 1).padStart(2, '0')
    const day = String(maxDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Check if selected date is weekend
  const isWeekend = (dateString) => {
    if (!dateString) return false
    const date = new Date(dateString)
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    setFormData({
      ...formData,
      date: selectedDate,
      time: "",
    })

    if (isWeekend(selectedDate)) {
      setTimeSlots(["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"])
    } else {
      setTimeSlots(defaultTimeSlots)
    }
  }

  // Handle time selection
  const handleTimeSelect = (selectedTime) => {
    setFormData({
      ...formData,
      time: selectedTime,
    })
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'date') {
      handleDateSelect(value)
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  // Navigation functions
  const goToNextStep = () => {
    const isValid = validateCurrentStep()
    if (isValid) {
      window.scrollTo(0, 0)
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Validate current step
  const validateCurrentStep = () => {
    setError(null)

    if (currentStep === 1) {
      if (!formData.date) {
        setError("Vui lòng chọn ngày khám")
        return false
      }
      if (!formData.time) {
        setError("Vui lòng chọn giờ khám")
        return false
      }
      
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        setError("Không thể chọn ngày trong quá khứ")
        return false
      }
    } else if (currentStep === 2) {
      if (!formData.symptoms || formData.symptoms.trim().length < 5) {
        setError("Vui lòng mô tả triệu chứng hoặc lý do khám (tối thiểu 5 ký tự)")
        return false
      }

      if (formData.email && !formData.email.includes("@")) {
        setError("Địa chỉ email không hợp lệ")
        return false
      }

      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
        setError("Số điện thoại không hợp lệ")
        return false
      }
    } else if (currentStep === 3) {
      if (!formData.paymentMethod) {
        setError("Vui lòng chọn phương thức thanh toán")
        return false
      }
    }

    return true
  }

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateCurrentStep()) return;
  try {
    setSubmitting(true);
    setError(null);

    const paymentResult = await processPayment();
    if (!paymentResult.success) {
      if (paymentResult.error) setError(paymentResult.error);
      return;
    }

    const appointmentData = {
      doctorId: Number.parseInt(id),
      patientId: currentUser?.id,
      appointmentDate: formData.date,
      appointmentTime: formData.time,
      symptoms: formData.symptoms,
      notes: formData.notes,
      patientName: formData.name,
      patientPhone: formData.phone,
      patientEmail: formData.email,
      status: 'PENDING',
      paymentMethod: formData.paymentMethod.toUpperCase(),
      paymentStatus: paymentResult.success ? 'PAID' : 'PENDING',
      consultationFee: doctor.fee || 0,
    };

    const response = await appointmentAPI.book(appointmentData);
    setSuccess(true);
    setRedirecting(true);
    setTimeout(() => {
      navigate('/patient/appointments');
    }, 2500);
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Không thể đặt lịch khám. Vui lòng thử lại.';
    setError(errorMessage);
    console.error('Error booking appointment:', err);
  } finally {
    setSubmitting(false);
  }
 };
  // Calculate progress percentage
  const calculateProgress = () => {
    return (currentStep / 4) * 100 // Updated to 4 steps
  }

  // Render success message
  if (success) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow success-card">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "5rem" }}></i>
                </div>
                <h2 className="mb-3">Đặt lịch thành công!</h2>
                <p className="lead mb-4">
                  Bạn đã đặt lịch khám thành công với {doctor?.title} {doctor?.firstName} {doctor?.lastName}.
                </p>

                <Card className="bg-light border-0 mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={6} className="border-end">
                        <p className="text-muted mb-1">Ngày khám</p>
                        <h5>{formatDate(formData.date)}</h5>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Giờ khám</p>
                        <h5>{formData.time}</h5>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col md={6} className="border-end">
                        <p className="text-muted mb-1">Phương thức thanh toán</p>
                        <h6>
                          {formData.paymentMethod === 'CASH' && (
                            <>
                              <i className="bi bi-cash me-2"></i>Thanh toán tại phòng khám
                            </>
                          )}
                          {formData.paymentMethod === 'ONLINE' && (
                            <>
                              <i className="bi bi-credit-card me-2"></i>Thanh toán qua VNPAY - Đã thanh toán
                            </>
                          )}
                        </h6>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Tổng chi phí</p>
                        <h5 className="text-success">
                          {(doctor.fee || 0).toLocaleString("vi-VN")}đ
                        </h5>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <p className="mb-4">
                  Thông tin chi tiết đã được gửi đến email của bạn. Bạn sẽ được chuyển đến trang quản lý lịch hẹn...
                </p>

                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang chuyển hướng...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  // Render loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="loading-container">
          <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3 lead">Đang tải thông tin bác sĩ...</p>
        </div>
      </Container>
    )
  }

  // Render error state if doctor not found
  if (!doctor) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <Alert.Heading>Không tìm thấy thông tin bác sĩ</Alert.Heading>
          <p>Không thể tìm thấy thông tin của bác sĩ với ID: {id}</p>
          <Button variant="primary" onClick={() => navigate("/doctors")}>
            Quay lại danh sách bác sĩ
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-2">Đặt lịch khám bệnh</h2>
      <p className="text-center text-muted mb-4">Vui lòng hoàn thành các bước sau để đặt lịch khám bệnh với bác sĩ</p>

      {/* Progress bar */}
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <div className="booking-progress">
            <ProgressBar now={calculateProgress()} className="mb-3" />
            <div className="d-flex justify-content-between progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
                <span className="step-number">1</span>
                <span className="step-label d-none d-md-inline">Chọn thời gian</span>
              </div>
              <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
                <span className="step-number">2</span>
                <span className="step-label d-none d-md-inline">Thông tin khám</span>
              </div>
              <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span>
                <span className="step-label d-none d-md-inline">Thanh toán</span>
              </div>
              <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
                <span className="step-number">4</span>
                <span className="step-label d-none d-md-inline">Xác nhận</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          {/* Error alert */}
          {error && (
            <Alert variant="danger" className="mb-4">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          {/* Main booking form card */}
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {/* STEP 1: Choose date and time */}
                {currentStep === 1 && (
                  <div className="step-content">
                    <h4 className="mb-4">
                      <i className="bi bi-calendar-check me-2"></i>
                      Chọn ngày và giờ khám
                    </h4>

                    {/* Date selection - dùng react-datepicker */}
                    <div className="mb-4">
                      <label className="form-label">
                        Chọn ngày khám <span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={date => handleDateSelect(date ? date.toISOString().slice(0, 10) : "")}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        className="form-control"
                        showPopperArrow={false}
                        popperPlacement="bottom"
                        calendarClassName="custom-datepicker"
                      />
                      <Form.Text className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Bạn có thể đặt lịch từ hôm nay đến 3 tháng tới.
                        {isWeekend(formData.date) && formData.date && (
                          <span className="text-warning ms-2">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Cuối tuần có giờ khám hạn chế
                          </span>
                        )}
                      </Form.Text>
                    </div>

                    {/* Time selection - button đẹp */}
                    <div className="mb-4">
                      <label className="form-label">
                        {formData.date ? "Chọn giờ khám" : "Vui lòng chọn ngày khám trước"}
                        {formData.date && <span className="text-danger">*</span>}
                      </label>
                      {formData.date && (
                        <div className="time-slots d-flex flex-wrap gap-2">
                          {timeSlots.length > 0 ? (
                            <>
                              {isWeekend(formData.date) && (
                                <Alert variant="info" className="mb-3">
                                  <i className="bi bi-clock me-2"></i>
                                  Lịch khám cuối tuần: 9:00 - 11:30 và 14:00 - 15:30
                                </Alert>
                              )}
                              {timeSlots.map((time, idx) => (
                                <Button
                                  key={idx}
                                  variant={formData.time === time ? "primary" : "outline-primary"}
                                  className={`rounded-pill px-3 py-2 mb-2 ${formData.time === time ? 'fw-bold shadow' : ''}`}
                                  onClick={() => handleTimeSelect(time)}
                                  style={{ minWidth: 80, transition: 'all 0.2s', fontWeight: formData.time === time ? 'bold' : 'normal' }}
                                >
                                  <i className="bi bi-clock me-1"></i>
                                  {time}
                                </Button>
                              ))}
                            </>
                          ) : (
                            <Alert variant="warning">
                              <i className="bi bi-exclamation-circle me-2"></i>
                              Không có lịch trống vào ngày này. Vui lòng chọn ngày khác.
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected date and time summary */}
                    {formData.date && formData.time && (
                      <Card className="bg-light border-0 mb-4">
                        <Card.Body>
                          <h6>
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Thời gian khám đã chọn:
                          </h6>
                          <p className="mb-0">
                            <i className="bi bi-calendar-event me-2"></i>
                            <strong>{formatDate(formData.date)}</strong> lúc <strong>{formData.time}</strong>
                          </p>
                          {isWeekend(formData.date) && (
                            <small className="text-warning">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              Lịch khám cuối tuần
                            </small>
                          )}
                        </Card.Body>
                      </Card>
                    )}

                    {/* Navigation buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-secondary" onClick={() => navigate("/doctors/" + id)}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Quay lại
                      </Button>
                      <Button variant="primary" onClick={goToNextStep} disabled={!formData.date || !formData.time}>
                        Tiếp tục
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Enter appointment and personal info */}
                {currentStep === 2 && (
                  <div className="step-content">
                    <h4 className="mb-4">
                      <i className="bi bi-file-medical me-2"></i>
                      Thông tin khám bệnh
                    </h4>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        Triệu chứng / Lý do khám <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="symptoms"
                        placeholder="Mô tả triệu chứng hoặc lý do khám của bạn"
                        value={formData.symptoms}
                        onChange={handleChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Vui lòng mô tả chi tiết các triệu chứng để bác sĩ có thể chuẩn bị tốt nhất cho buổi khám
                      </Form.Text>
                    </Form.Group>

                    <h5 className="mb-3">Thông tin liên hệ</h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và tên</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Nhập họ và tên"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-phone"></i>
                            </span>
                            <Form.Control
                              type="tel"
                              name="phone"
                              placeholder="Nhập số điện thoại"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>Email</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Nhập email của bạn"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <Form.Text className="text-muted">Thông tin đặt lịch sẽ được gửi đến email này</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Ghi chú bổ sung</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="notes"
                        placeholder="Nhập các ghi chú bổ sung (nếu có)"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {/* Navigation buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-secondary" onClick={goToPreviousStep}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Quay lại
                      </Button>
                      <Button variant="primary" onClick={goToNextStep}>
                        Tiếp tục
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment Method */}
                {currentStep === 3 && (
                  <div className="step-content">
                    <h4 className="mb-4">
                      <i className="bi bi-credit-card me-2"></i>
                      Chọn phương thức thanh toán
                    </h4>

                    <div className="payment-methods mb-4">
                      {/* Cash Payment */}
                      <Card 
                        className={`payment-method-card mb-3 ${formData.paymentMethod === 'CASH' ? 'border-primary' : ''}`}
                        onClick={() => handlePaymentMethodChange('CASH')}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              type="radio"
                              name="paymentMethod"
                              value="CASH"
                              checked={formData.paymentMethod === 'CASH'}
                              onChange={() => handlePaymentMethodChange('CASH')}
                              className="me-3"
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-cash-coin fs-2 text-success me-3"></i>
                                <div>
                                  <h6 className="mb-1">Thanh toán tại phòng khám</h6>
                                  <small className="text-muted">Thanh toán bằng tiền mặt khi đến khám</small>
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <span className="badge bg-success">Miễn phí</span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                      {/* VNPAY Payment */}
                      <Card 
                        className={`payment-method-card mb-3 ${formData.paymentMethod === 'ONLINE' ? 'border-primary' : ''}`}
                        onClick={() => handlePaymentMethodChange('ONLINE')}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              type="radio"
                              name="paymentMethod"
                              value="ONLINE"
                              checked={formData.paymentMethod === 'ONLINE'}
                              onChange={() => handlePaymentMethodChange('ONLINE')}
                              className="me-3"
                            />
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-credit-card fs-2 text-primary me-3"></i>
                                  <div>
                                    <h6 className="mb-1">Thanh toán qua VNPAY</h6>
                                    <small className="text-muted">Chuyển hướng đến cổng VNPAY để thanh toán</small>
                                  </div>
                                </div>
                              </div>
                              <div className="text-end">
                              <span className="badge bg-primary">An toàn</span>
                              </div>
                          </div>
                        </Card.Body>
                    </Card>

                    </div>

                    {/* Payment Summary */}
                    <Card className="bg-light border-0 mb-4">
                      <Card.Body>
                        <h6 className="mb-3">Chi tiết thanh toán</h6>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Phí khám bệnh</span>
                          <span>{(doctor.fee || 0).toLocaleString("vi-VN")}đ</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Phí dịch vụ</span>
                          <span className="text-success">Miễn phí</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-0">Tổng cộng</h6>
                          <h6 className="mb-0 text-primary">
                            {(doctor.fee || 0).toLocaleString("vi-VN")}đ
                          </h6>
                        </div>
                      </Card.Body>
                    </Card>

                    {formData.paymentMethod === 'ONLINE' && (
                      <Alert variant="info">
                        <i className="bi bi-info-circle me-2"></i>
                        Bạn sẽ được chuyển hướng đến trang thanh toán VNPAY. Vui lòng kiểm tra ứng dụng ngân hàng.
                      </Alert>
                    )}

                    {/* Navigation buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-secondary" onClick={goToPreviousStep}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Quay lại
                      </Button>
                      <Button variant="primary" onClick={goToNextStep}>
                        Tiếp tục
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Confirmation */}
                {currentStep === 4 && (
                  <div className="step-content">
                    <h4 className="mb-4">
                      <i className="bi bi-check-circle me-2"></i>
                      Xác nhận thông tin đặt lịch
                    </h4>

                    <Alert variant="success" className="mb-4">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Tất cả thông tin đã được điền đầy đủ. Vui lòng kiểm tra lại trước khi xác nhận.
                    </Alert>

                    <Card className="border-0 bg-light mb-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Thông tin khám bệnh</h5>
                          <Button variant="link" className="p-0 text-decoration-none" onClick={() => setCurrentStep(1)}>
                            <i className="bi bi-pencil me-1"></i> Chỉnh sửa
                          </Button>
                        </div>

                        <Row className="mb-3">
                          <Col md={6}>
                            <p className="mb-1 text-muted">Ngày khám</p>
                            <p className="fw-bold">{formatDate(formData.date)}</p>
                          </Col>
                          <Col md={6}>
                            <p className="mb-1 text-muted">Giờ khám</p>
                            <p className="fw-bold">{formData.time}</p>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <p className="mb-1 text-muted">Bác sĩ</p>
                            <p className="fw-bold">
                              {doctor.title} {doctor.firstName} {doctor.lastName}
                            </p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    <Card className="border-0 bg-light mb-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Lý do khám bệnh</h5>
                          <Button variant="link" className="p-0 text-decoration-none" onClick={() => setCurrentStep(2)}>
                            <i className="bi bi-pencil me-1"></i> Chỉnh sửa
                          </Button>
                        </div>

                        <p>{formData.symptoms}</p>

                        {formData.notes && (
                          <div className="mt-3">
                            <h6>Ghi chú bổ sung:</h6>
                            <p>{formData.notes}</p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>

                    <Card className="border-0 bg-light mb-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Thông tin liên hệ</h5>
                          <Button variant="link" className="p-0 text-decoration-none" onClick={() => setCurrentStep(2)}>
                            <i className="bi bi-pencil me-1"></i> Chỉnh sửa
                          </Button>
                        </div>

                        <p className="mb-1">
                          <strong>Họ tên:</strong> {formData.name || "Chưa cung cấp"}
                        </p>
                        <p className="mb-1">
                          <strong>Số điện thoại:</strong> {formData.phone || "Chưa cung cấp"}
                        </p>
                        <p>
                          <strong>Email:</strong> {formData.email || "Chưa cung cấp"}
                        </p>
                      </Card.Body>
                    </Card>

                    <Card className="border-0 bg-light mb-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Thanh toán</h5>
                          <Button variant="link" className="p-0 text-decoration-none" onClick={() => setCurrentStep(3)}>
                            <i className="bi bi-pencil me-1"></i> Chỉnh sửa
                          </Button>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                          {formData.paymentMethod === 'CASH' && (
                            <>
                              <i className="bi bi-cash-coin fs-4 text-success me-3"></i>
                              <div>
                                <p className="mb-0 fw-bold">Thanh toán tại phòng khám</p>
                                <small className="text-muted">Thanh toán bằng tiền mặt khi đến khám</small>
                              </div>
                            </>
                          )}
                          {formData.paymentMethod === 'ONLINE' && (
                            <>
                              <i className="bi bi-credit-card fs-4 text-primary me-3"></i>
                              <div>
                                <p className="mb-0 fw-bold">Thanh toán qua VNPAY</p>
                                <small className="text-muted">Bạn sẽ được chuyển hướng đến cổng thanh toán VNPAY</small>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="d-flex justify-content-between">
                          <p className="mb-1">Phí khám</p>
                          <p className="mb-1">{(doctor.fee || 0).toLocaleString("vi-VN")}đ</p>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <p className="fw-bold mb-0">Tổng cộng</p>
                          <p className="fw-bold mb-0 text-primary">
                            {(doctor.fee || 0).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </Card.Body>
                    </Card>

                    <Alert variant="info">
                      <i className="bi bi-info-circle me-2"></i>
                      Bạn có thể hủy lịch hẹn miễn phí trước 24 giờ. Sau thời gian này, sẽ áp dụng phí hủy.
                      {formData.paymentMethod === 'ONLINE' && (
                        <div className="mt-2">
                          <strong>Lưu ý:</strong> Với thanh toán VNPAY, bạn cần hoàn tất thanh toán trong vòng 5 phút.
                        </div>
                      )}
                    </Alert>

                    {/* Navigation buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-secondary" onClick={goToPreviousStep}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Quay lại
                      </Button>
                      <Button variant="success" type="submit" disabled={submitting} size="lg">
                        {submitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-calendar2-check me-2"></i> 
                            {formData.paymentMethod === 'ONLINE' ? 'Thanh toán và Đặt lịch' : 'Xác nhận đặt lịch'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BookAppointment