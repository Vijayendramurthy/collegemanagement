import React, { useState, useEffect } from 'react';
import './App.css';
import CollegeDashboard from './components/homepage';
import StudentAuthPages from './components/authentication';
import AdminDashboard from './components/admindashboard'; // Import AdminDashboard
import TeacherDashboard from './components/teacherdashboard';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  // On mount, check localStorage for login state
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedStudent = localStorage.getItem('studentDetails');
    const storedAdmin = localStorage.getItem('isAdmin');
    const storedTeacher = localStorage.getItem('isTeacher'); // <-- add this
    if (storedLogin === 'true' && storedStudent) {
      setIsLoggedIn(true);
      setStudentDetails(JSON.parse(storedStudent));
    }
    if (storedAdmin === 'true') setIsAdmin(true);
    if (storedTeacher === 'true') setIsTeacher(true); // <-- add this
  }, []);

  // Update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    if (studentDetails) {
      localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
    } else {
      localStorage.removeItem('studentDetails');
    }
  }, [isLoggedIn, studentDetails]);

  // Called after successful login
  const handleLoginSuccess = (user, admin = false, teacher = false) => {
    setIsLoggedIn(true);
    setStudentDetails(user);
    setIsAdmin(admin);
    setIsTeacher(teacher);
    setShowAuthPage(false);
    localStorage.setItem('isAdmin', admin);
    localStorage.setItem('isTeacher', teacher);
    localStorage.setItem('studentDetails', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', true);
  };

  // Called when Login/Register is clicked on homepage
  const handleShowAuthPage = () => {
    setShowAuthPage(true);
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentDetails(null);
    setIsAdmin(false);
    setIsTeacher(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('studentDetails');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTeacher');
  };

  return (
    <div>
      {/* Authentication Modal */}
      {showAuthPage && (
        <div
          className="auth-modal-overlay"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowAuthPage(false)}
        >
          <div
            className="auth-modal-content"
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
              padding: '32px',
              minWidth: '350px',
              maxWidth: '95vw',
              maxHeight: '95vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthPage(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: '1.7rem',
                color: '#888',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <StudentAuthPages onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* Main homepage, pass login handler and login state */}
      {isTeacher ? (
        <TeacherDashboard
          teacherDetails={studentDetails}
          onLogout={handleLogout}
        />
      ) : isAdmin ? (
        <AdminDashboard
          adminDetails={studentDetails}
          onLogout={handleLogout}
        />
      ) : (
        <CollegeDashboard
          isLoggedIn={isLoggedIn}
          studentDetails={studentDetails}
          onLoginOrRegister={handleShowAuthPage}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
