import React, { useState } from 'react';
import './authentication.css';
import { Eye, EyeOff, User, Mail, Phone, Calendar, MapPin, GraduationCap, CreditCard } from 'lucide-react';
import { API_BASE } from '../config';

const StudentAuthPages = ({ onLoginSuccess }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');

  const [formData, setFormData] = useState({
    firstName: '',
    initial: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    fathersName: '',
    mothersName: '',
    allotedRegistrationName: '',
    branch: '',
    section: '', // <-- Add this line
    feesPerYear: '',
    sscHallTicket: '',
    sscPercentage: '',
    sscPassOutYear: '',
    interHallTicket: '',
    interPercentage: '',
    interPassOutYear: '',
    yearOfAdmission: '',
    gmail: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [loginData, setLoginData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
  const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert(data.error); // This will show "User is already registered with this registration number."
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
  const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: loginData.emailOrPhone,
          password: loginData.password
        }),
      });
      const data = await response.json();
      if (response.ok && data.teacher) {
        onLoginSuccess(data.teacher, false, true);
      } else if (data.admin) {
        onLoginSuccess(data.admin, true, false);
      } else if (data.student) {
        onLoginSuccess(data.student, false, false);
      } else {
        alert(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      alert('Login failed. Please try again.');
    }
  };

  const branches = [
    'CSE',    // Computer Science Engineering
    'ECE',    // Electronics and Communication Engineering
    'EEE',    // Electrical and Electronics Engineering
    'MECH',   // Mechanical Engineering
    'CIVIL'   // Civil Engineering
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Prevent form button default for icon buttons
  const preventDefault = (e) => e.preventDefault();

  return (
    <div className="auth-bg">
      <div className="auth-container">
        {currentPage === 'login' ? (
          <div className="auth-card">
            <div className="auth-grid">
              {/* Left Side - Branding */}
              <div className="auth-branding">
                <GraduationCap className="auth-icon" />
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Access your student portal</p>
                <ul className="auth-features">
                  <li>Manage your academic records</li>
                  <li>Track your progress</li>
                  <li>Access course materials</li>
                </ul>
              </div>
              {/* Right Side - Login Form */}
              <div className="auth-form-wrapper">
                <div className="auth-form">
                  <h2 className="auth-form-title">Sign In</h2>
                  <p className="auth-form-desc">Enter your credentials to access your account</p>
                  {/* Login Method Toggle */}
                  <div className="auth-toggle">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`auth-toggle-btn${loginMethod === 'email' ? ' active' : ''}`}
                      aria-pressed={loginMethod === 'email'}
                      aria-label="Login with Email"
                    >
                      <Mail className="auth-toggle-icon" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`auth-toggle-btn${loginMethod === 'phone' ? ' active' : ''}`}
                      aria-pressed={loginMethod === 'phone'}
                      aria-label="Login with Phone"
                    >
                      <Phone className="auth-toggle-icon" />
                      Phone
                    </button>
                  </div>
                  <form onSubmit={handleLoginSubmit} className="auth-form-fields" autoComplete="off">
                    <div className="auth-field">
                      <label htmlFor="login-email-or-phone">
                        {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      </label>
                      <div className="auth-input-icon">
                        {loginMethod === 'email' ? (
                          <Mail className="auth-input-svg" />
                        ) : (
                          <Phone className="auth-input-svg" />
                        )}
                        <input
                          id="login-email-or-phone"
                          type={loginMethod === 'email' ? 'email' : 'tel'}
                          name="emailOrPhone"
                          value={loginData.emailOrPhone}
                          onChange={handleLoginChange}
                          placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                          required
                          autoComplete="username"
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="login-password">Password</label>
                      <div className="auth-input-icon">
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-eye-btn"
                          tabIndex={0}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onMouseDown={preventDefault}
                        >
                          {showPassword ? <EyeOff className="auth-eye-icon" /> : <Eye className="auth-eye-icon" />}
                        </button>
                      </div>
                    </div>
                    <div className="auth-row">
                      <label className="auth-checkbox">
                        <input type="checkbox" />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => { /* handle forgot password logic here */ }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button type="submit" className="auth-submit-btn">
                      Sign In
                    </button>
                  </form>
                  <div className="auth-footer">
                    <p>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentPage('register')}
                        className="auth-link-btn"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Registration Page
          <div className="auth-card">
            <div className="auth-register-header">
              <GraduationCap className="auth-icon" />
              <h1 className="auth-title">Student Registration</h1>
              <p className="auth-subtitle">Join our academic community</p>
            </div>
            <form onSubmit={handleRegistrationSubmit} className="auth-register-form" autoComplete="off">
              <div className="auth-register-grid">
                {/* Personal Information */}
                <div className="auth-section">
                  <h3 className="auth-section-title">
                    <User className="auth-section-icon" />
                    Personal Information
                  </h3>
                  <div className="auth-section-fields">
                    <div className="auth-field">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label htmlFor="initial">Initial</label>
                      <input
                        id="initial"
                        type="text"
                        name="initial"
                        value={formData.initial}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <div className="auth-input-icon">
                        <Calendar className="auth-input-svg" />
                        <input
                          id="dateOfBirth"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="not-preferred">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="address">Address</label>
                      <div className="auth-input-icon">
                        <MapPin className="auth-input-svg" />
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="fathersName">Father's Name</label>
                      <input
                        id="fathersName"
                        type="text"
                        name="fathersName"
                        value={formData.fathersName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label htmlFor="mothersName">Mother's Name</label>
                      <input
                        id="mothersName"
                        type="text"
                        name="mothersName"
                        value={formData.mothersName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Academic Information */}
                <div className="auth-section">
                  <h3 className="auth-section-title">
                    <GraduationCap className="auth-section-icon" />
                    Academic Information
                  </h3>
                  <div className="auth-section-fields">
                    <div className="auth-field">
                      <label htmlFor="allotedRegistrationName">Alloted Registration Name</label>
                      <input
                        id="allotedRegistrationName"
                        type="text"
                        name="allotedRegistrationName"
                        value={formData.allotedRegistrationName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label htmlFor="branch">Branch</label>
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="section">Section:</label>
                      <input
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        placeholder="Section"
                        required
                        style={{ width: '100%', marginBottom: 8, padding: 8 }}
                      />
                    </div>
                    <div className="auth-field">
                      <label htmlFor="feesPerYear">Fees (Per Year)</label>
                      <div className="auth-input-icon">
                        <CreditCard className="auth-input-svg" />
                        <input
                          id="feesPerYear"
                          type="number"
                          name="feesPerYear"
                          value={formData.feesPerYear}
                          onChange={handleInputChange}
                          placeholder="Amount in ₹"
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="yearOfAdmission">Year of Admission</label>
                      <select
                        id="yearOfAdmission"
                        name="yearOfAdmission"
                        value={formData.yearOfAdmission}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    {/* SSC Details */}
                    <div className="auth-subsection">
                      <h4>SSC Details</h4>
                      <input
                        type="text"
                        name="sscHallTicket"
                        value={formData.sscHallTicket}
                        onChange={handleInputChange}
                        placeholder="SSC Hall Ticket No"
                        required
                      />
                      <div className="auth-row">
                        <input
                          type="number"
                          name="sscPercentage"
                          value={formData.sscPercentage}
                          onChange={handleInputChange}
                          placeholder="SSC %"
                          min={0}
                          max={100}
                          step={0.01}
                          required
                        />
                        <select
                          name="sscPassOutYear"
                          value={formData.sscPassOutYear}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Pass Out Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Intermediate Details */}
                    <div className="auth-subsection">
                      <h4>Intermediate Details</h4>
                      <input
                        type="text"
                        name="interHallTicket"
                        value={formData.interHallTicket}
                        onChange={handleInputChange}
                        placeholder="Inter Hall Ticket No"
                        required
                      />
                      <div className="auth-row">
                        <input
                          type="number"
                          name="interPercentage"
                          value={formData.interPercentage}
                          onChange={handleInputChange}
                          placeholder="Inter %"
                          min={0}
                          max={100}
                          step={0.01}
                          required
                        />
                        <select
                          name="interPassOutYear"
                          value={formData.interPassOutYear}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Pass Out Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Contact & Security */}
                <div className="auth-section">
                  <h3 className="auth-section-title">
                    <Mail className="auth-section-icon" />
                    Contact & Security
                  </h3>
                  <div className="auth-section-fields">
                    <div className="auth-field">
                      <label htmlFor="gmail">Gmail</label>
                      <div className="auth-input-icon">
                        <Mail className="auth-input-svg" />
                        <input
                          id="gmail"
                          type="email"
                          name="gmail"
                          value={formData.gmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="auth-input-icon">
                        <Phone className="auth-input-svg" />
                        <input
                          id="phoneNumber"
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="register-password">Password</label>
                      <div className="auth-input-icon">
                        <input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-eye-btn"
                          tabIndex={0}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onMouseDown={preventDefault}
                        >
                          {showPassword ? <EyeOff className="auth-eye-icon" /> : <Eye className="auth-eye-icon" />}
                        </button>
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="auth-input-icon">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="auth_eye-btn"
                          tabIndex={0}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          onMouseDown={preventDefault}
                        >
                          {showConfirmPassword ? <EyeOff className="auth-eye-icon" /> : <Eye className="auth-eye-icon" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="auth-register-actions">
                <button
                  type="button"
                  onClick={() => setCurrentPage('login')}
                  className="auth-back-btn"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="auth-submit-btn"
                >
                  Register Student
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAuthPages;