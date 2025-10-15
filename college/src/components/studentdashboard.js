import React, { useEffect, useState } from 'react';
// Use environment variable REACT_APP_API_BASE (defined in college/.env or your deploy env)
const API_BASE = process.env.REACT_APP_API_BASE;

const StudentDashboard = ({
  studentDetails,
  showStudentDashboard,
  setShowStudentDashboard,
  page,
  setPage,
}) => {
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [studentEvents, setStudentEvents] = useState([]);

  useEffect(() => {
    if (showStudentDashboard && studentDetails) {
  fetch(`${API_BASE}/api/achievements?reg=${studentDetails.allotedRegistrationName}`)
        .then(res => res.json())
        .then(data => setStudentAchievements(data))
        .catch(() => setStudentAchievements([]));

  fetch(`${API_BASE}/api/events?reg=${studentDetails.allotedRegistrationName}`)
        .then(res => res.json())
        .then(data => setStudentEvents(data))
        .catch(() => setStudentEvents([]));
    }
  }, [showStudentDashboard, studentDetails]);

  const renderNavBar = () => (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      padding: '0 20px',
      height: '64px'
    }}>
      <button 
        onClick={() => { 
          console.log('Events clicked'); // Debug
          setShowStudentDashboard(false); 
          setPage('events'); 
        }} 
        style={{ 
          background: page === 'events' ? '#6366f1' : 'transparent', 
          border: page === 'events' ? 'none' : '1px solid #e5e7eb',
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
        onClick={() => { 
          console.log('Performance clicked'); // Debug
          setShowStudentDashboard(false); 
          setPage('performance'); 
        }} 
        style={{ 
          background: page === 'performance' ? '#6366f1' : 'transparent', 
          border: page === 'performance' ? 'none' : '1px solid #e5e7eb',
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
        onClick={() => { 
          console.log('Achievements clicked'); // Debug
          setShowStudentDashboard(false); 
          setPage('achievements'); 
        }} 
        style={{ 
          background: page === 'achievements' ? '#6366f1' : 'transparent', 
          border: page === 'achievements' ? 'none' : '1px solid #e5e7eb',
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
        onClick={() => { 
          console.log('Home clicked'); // Debug
          setShowStudentDashboard(false); 
          setPage('home'); 
        }} 
        style={{ 
          background: page === 'home' ? '#6366f1' : 'transparent', 
          border: page === 'home' ? 'none' : '1px solid #e5e7eb',
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
    </nav>
  );

  const renderStudentDashboard = () => (
    <main style={{ minHeight: 'calc(100vh - 80px)', background: '#f8fafc', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: 32 }}>
        <h2 style={{ color: '#6366f1', fontWeight: 700, marginBottom: 24 }}>Student Dashboard</h2>

        {/* Student Details Card - directly below heading */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          background: '#f1f5f9',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(99,102,241,0.15)'
          }}>
            {studentDetails.firstName ? studentDetails.firstName.charAt(0).toUpperCase() : '👤'}
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
              {studentDetails.firstName} {studentDetails.initial}
            </div>
            <div style={{ color: '#6366f1', fontWeight: 500, marginBottom: 2 }}>
              {studentDetails.allotedRegistrationName}
            </div>
            <div style={{ color: '#64748b', fontSize: '1rem' }}>
              <span style={{ marginRight: 16 }}><b>Branch:</b> {studentDetails.branch}</span>
              <span><b>Section:</b> {studentDetails.section}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: '1rem', marginTop: 2 }}>
              <span style={{ marginRight: 16 }}><b>Email:</b> {studentDetails.gmail}</span>
              <span><b>Phone:</b> {studentDetails.phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Columns */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Achievements Column */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: 12 }}>Your Achievements</h3>
            {studentAchievements.length === 0 ? (
              <p style={{ color: '#888' }}>No achievements posted.</p>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                {studentAchievements.map(a => (
                  <li key={a._id} style={{ marginBottom: 12 }}>
                    <b>{a.title}</b> <br />
                    <span style={{ fontSize: '0.95rem', color: '#64748b' }}>{a.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Registered Events Column */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: 12 }}>Events Registered</h3>
            {studentEvents.length === 0 ? (
              <p style={{ color: '#888' }}>No events registered.</p>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                {studentEvents.map(e => (
                  <li key={e._id} style={{ marginBottom: 12 }}>
                    <b>{e.title}</b> <br />
                    <span style={{ fontSize: '0.95rem', color: '#64748b' }}>{e.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={() => setShowStudentDashboard(false)}
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
            ← Back
          </button>
          <button
            onClick={() => {
              setShowStudentDashboard(false);
              setPage('achievements');
            }}
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              marginLeft: 16
            }}
            onMouseEnter={e => e.target.style.background = '#4f46e5'}
            onMouseLeave={e => e.target.style.background = '#6366f1'}
          >
            Post New Achievement
          </button>
        </div>
      </div>
    </main>
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
          {renderNavBar()}
        </div>
      </header>
      {renderStudentDashboard()}
    </div>
  );
};

export default StudentDashboard;