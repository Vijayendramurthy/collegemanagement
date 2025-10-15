import React, { useState, useEffect } from 'react';
import PostAchievementPage from './achievement';
import PerformancePage from './performance'; // import at the top
// Use environment variable REACT_APP_API_BASE (defined in college/.env or your deploy env)
const API_BASE = process.env.REACT_APP_API_BASE;

const CollegeDashboard = ({
  isLoggedIn,
  studentDetails,
  onLoginOrRegister,
  onLogout,
  onNavigateToEvents,
  onNavigateToPerformance,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [page, setPage] = useState('home'); // 'home', 'achievements', 'performance'
  const [events, setEvents] = useState([]);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [studentEvents, setStudentEvents] = useState([]);
  const [showStudentDashboard, setShowStudentDashboard] = useState(false); // New state for student dashboard

  const handleProfileClick = () => setShowProfileDropdown((prev) => !prev);
  const handleCloseDropdown = () => setShowProfileDropdown(false);

  const handleEventsClick = () => {
    if (onNavigateToEvents) {
      onNavigateToEvents();
    } else {
      window.location.href = '/events';
    }
  };

  const handlePerformanceClick = () => {
    if (onNavigateToPerformance) {
      onNavigateToPerformance();
    } else {
      window.location.href = '/performance';
    }
  };

  // Navigation handler for Achievements
  const handleAchievementsClick = () => setPage('achievements');
  const handleHomeClick = () => setPage('home');
  const handlePerformanceNavClick = () => setPage('performance');

  // Fetch events when the page is 'events'
  useEffect(() => {
    if (page === 'events') {
  fetch(`${API_BASE}/api/events`)
        .then(res => res.json())
        .then(setEvents);
    }
  }, [page]);

  useEffect(() => {
    if (showStudentDashboard && studentDetails) {
      // Fetch achievements
  fetch(`${API_BASE}/api/achievements?reg=${studentDetails.allotedRegistrationName}`)
        .then(res => res.json())
        .then(data => setStudentAchievements(data))
        .catch(() => setStudentAchievements([]));

      // Fetch registered events (assuming you have a registration collection or field)
  fetch(`${API_BASE}/api/events?reg=${studentDetails.allotedRegistrationName}`)
        .then(res => res.json())
        .then(data => setStudentEvents(data))
        .catch(() => setStudentEvents([]));
    }
  }, [showStudentDashboard, studentDetails]);

  // Render homepage content (your existing renderHomePage function)
  const renderHomePage = () => (
    <main style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Welcome to EduTech College
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '40px',
            opacity: 0.9,
            maxWidth: '800px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Empowering minds, shaping futures. Join our community of learners and innovators in a journey of academic excellence and personal growth.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>15,000+</div>
              <div style={{ fontSize: '1rem', opacity: 0.8 }}>Students</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>500+</div>
              <div style={{ fontSize: '1rem', opacity: 0.8 }}>Faculty</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>95%</div>
              <div style={{ fontSize: '1rem', opacity: 0.8 }}>Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Placement Section */}
      <section style={{ padding: '80px 20px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '40px'
          }}>
            {/* About Section */}
            <div style={{
              background: '#fff',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                About Our College
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                EduTech College is a premier institution committed to providing world-class education and fostering innovation. With state-of-the-art facilities and experienced faculty, we prepare students for success in their chosen careers.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, color: '#374151' }}>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  NAAC A+ Accredited
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  50+ Years of Excellence
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Modern Infrastructure
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Research-Focused Learning
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Industry Partnerships
                </li>
              </ul>
            </div>

            {/* Placement Section */}
            <div style={{
              background: '#fff',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💼</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                Placement Opportunities
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                Our dedicated placement cell ensures excellent career opportunities for our graduates. We maintain strong relationships with top companies and provide comprehensive career support.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, color: '#374151' }}>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Top MNC Recruiters
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Average Package: ₹8.5 LPA
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Highest Package: ₹45 LPA
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Career Counseling
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  Interview Preparation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#1f2937'
          }}>
            Our Departments
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              'Computer Science & Engineering',
              'Electronics & Communication',
              'Mechanical Engineering',
              'Civil Engineering',
              'Electrical Engineering',
              'Information Technology',
              'Biotechnology',
              'Chemical Engineering'
            ].map((dept, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  {dept}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  4-Year B.Tech Program
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  const handleSubmitAchievement = async (achievementData) => {
    if (!studentDetails) {
      alert('You must be logged in to post an achievement.');
      return;
    }
    // Add student info to achievement
    const dataToSend = {
      ...achievementData,
      studentName: studentDetails.firstName,
      allotedRegistrationName: studentDetails.allotedRegistrationName,
    };
    try {
  const response = await fetch(`${API_BASE}/api/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Achievement posted successfully!');
        setPage('home');
      } else {
        alert(data.error || 'Failed to post achievement');
      }
    } catch (err) {
      alert('Server error while posting achievement');
    }
  };

  // Render events page
  const renderEventsPage = () => (
    <main style={{ minHeight: 'calc(100vh - 64px)', background: '#f8fafc', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          color: '#1f2937',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '32px',
          textAlign: 'center'
        }}>College Events</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px'
        }}>
          {events.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280' }}>No events found.</div>
          ) : (
            events.map(event => (
              <div key={event._id} style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative'
              }}>
                {event.image && (
                  <img src={event.image} alt={event.title} style={{
                    width: '100%',
                    maxHeight: '180px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '18px'
                  }} />
                )}
                <h3 style={{ color: '#6366f1', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  {event.title}
                </h3>
                <div style={{ color: '#374151', marginBottom: '8px', fontWeight: 500 }}>
                  📍 {event.location}
                </div>
                <div style={{ color: '#6b7280', marginBottom: '8px', fontSize: '0.95rem' }}>
                  <span style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '8px',
                    padding: '2px 10px',
                    marginRight: 8
                  }}>
                    {event.date && new Date(event.date).toLocaleDateString()}
                    {event.endDate && event.endDate !== event.date
                      ? ' - ' + new Date(event.endDate).toLocaleDateString()
                      : ''}
                  </span>
                  {event.registrationDeadline && (
                    <span style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      borderRadius: '8px',
                      padding: '2px 10px',
                      marginLeft: 8
                    }}>
                      Registration Deadline: {new Date(event.registrationDeadline).toLocaleString()}
                    </span>
                  )}
                </div>
                <div style={{
                  color: '#374151',
                  fontSize: '1rem',
                  marginBottom: '8px',
                  fontStyle: 'italic'
                }}>
                  {event.description}
                </div>
                {isLoggedIn && studentDetails && (
                  event.registeredStudents && event.registeredStudents.includes(studentDetails.allotedRegistrationName) ? (
                    <div style={{ color: '#10b981', fontWeight: 600, marginTop: 8 }}>Registered</div>
                  ) : (
                    <button
                      style={{
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 20px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: 8
                      }}
                      onClick={async () => {
                        const res = await fetch(`${API_BASE}/api/events/${event._id}/register`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ reg: studentDetails.allotedRegistrationName })
                        });
                        if (res.ok) {
                          // Refresh events list
                          fetch(`${API_BASE}/api/events`)
                            .then(res => res.json())
                            .then(setEvents);
                        } else {
                          alert('Failed to register for event');
                        }
                      }}
                    >
                      Register
                    </button>
                  )
                )}
              </div>
            ))
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={() => setPage('home')}
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontWeight: '500',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );

  // Render student dashboard
  const renderStudentDashboard = () => (
    <div style={{ padding: '40px 20px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          color: '#1f2937',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '32px',
          textAlign: 'center'
        }}>Student Dashboard</h2>
        
        {/* Achievements Section */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: '#6366f1', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
            Your Achievements
          </h3>
          {studentAchievements.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
              No achievements found. Start by posting your first achievement!
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {studentAchievements.map(ach => (
                <li key={ach._id} style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1f2937' }}>
                    {ach.title}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>
                    {new Date(ach.date).toLocaleDateString()}
                  </div>
                  <div style={{ color: '#374151', fontSize: '1rem', marginBottom: '8px' }}>
                    {ach.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => setPage('achievements')}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4f46e5'}
              onMouseLeave={(e) => e.target.style.background = '#6366f1'}
            >
              Post New Achievement
            </button>
          </div>
        </div>

        {/* Registered Events Section */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{ color: '#6366f1', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
            Your Registered Events
          </h3>
          {studentEvents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
              No registered events found. Explore upcoming events and register now!
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {studentEvents.map(event => (
                <li key={event._id} style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1f2937' }}>
                    {event.title}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>
                    {new Date(event.date).toLocaleDateString()}
                    {event.endDate && event.endDate !== event.date
                      ? ' - ' + new Date(event.endDate).toLocaleDateString()
                      : ''}
                  </div>
                  <div style={{ color: '#374151', fontSize: '1rem', marginBottom: '8px' }}>
                    {event.location}
                  </div>
                  <div style={{
                    color: '#10b981',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Registered
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <header style={{
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <a href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#6366f1',
            textDecoration: 'none'
          }}>
            EduTech College
          </a>
          
          {/* Navigation Menu */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <button
              onClick={() => setPage('events')}
              style={{
                background: page === 'events' ? '#6366f1' : 'none',
                border: 'none',
                color: page === 'events' ? '#fff' : '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              Events
            </button>
            
            <button
              onClick={handlePerformanceNavClick}
              style={{
                background: page === 'performance' ? '#6366f1' : 'none',
                border: 'none',
                color: page === 'performance' ? '#fff' : '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              Performance
            </button>

            <button
              onClick={handleAchievementsClick}
              style={{
                background: page === 'achievements' ? '#6366f1' : 'none',
                border: 'none',
                color: page === 'achievements' ? '#fff' : '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              Achievements
            </button>
            <button
              onClick={handleHomeClick}
              style={{
                background: page === 'home' ? '#6366f1' : 'none',
                border: 'none',
                color: page === 'home' ? '#fff' : '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              Home
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={onLoginOrRegister}
                    style={{
                      background: 'none',
                      border: '2px solid #6366f1',
                      color: '#6366f1',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={onLoginOrRegister}
                    style={{
                      background: '#6366f1',
                      border: '2px solid #6366f1',
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Register
                  </button>
                </>
              ) : (
                <div style={{ position: 'relative' }}>
                  <span
                    title={studentDetails?.firstName || 'Student'}
                    style={{
                      display: 'inline-block',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      color: '#fff',
                      textAlign: 'center',
                      lineHeight: '36px',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => { handleProfileClick(); setShowStudentDashboard(true); }}
                  >
                    {studentDetails?.firstName ? studentDetails.firstName.charAt(0).toUpperCase() : '👤'}
                  </span>
                  {showProfileDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '260px',
                        zIndex: 1000,
                        padding: '16px'
                      }}
                    >
                      <h4 style={{ margin: '0 0 12px 0', color: '#6366f1', fontSize: '1rem' }}>
                        Student Profile
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.6' }}>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Name:</strong> {studentDetails.firstName} {studentDetails.initial}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Registration No:</strong> {studentDetails.allotedRegistrationName}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Branch:</strong> {studentDetails.branch}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Email:</strong> {studentDetails.gmail}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Phone:</strong> {studentDetails.phoneNumber}
                        </div>
                      </div>
                      <button
                        onClick={() => { handleCloseDropdown(); onLogout(); }}
                        style={{
                          width: '100%',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '10px 16px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      {showStudentDashboard
        ? renderStudentDashboard()
        : (
          page === 'performance' ? (
            <PerformancePage
              studentDetails={studentDetails}
              onNavigateBack={() => setPage('home')}
            />
          ) : page === 'achievements' ? (
            <PostAchievementPage
              onNavigateBack={handleHomeClick}
              onSubmitAchievement={handleSubmitAchievement}
            />
          ) : page === 'events' ? (
            renderEventsPage()
          ) : (
            renderHomePage()
          )
        )}
    </div>
  );
};

export default CollegeDashboard;