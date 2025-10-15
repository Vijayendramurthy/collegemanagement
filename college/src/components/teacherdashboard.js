import React, { useEffect, useState } from 'react';

const API_BASE = "http://localhost:5000";

const TeacherDashboard = ({ teacherDetails, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState('home');
  // --- New state for modal and marks entry ---
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marksInputs, setMarksInputs] = useState([]);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksError, setMarksError] = useState('');
  const [marksSuccess, setMarksSuccess] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');

  useEffect(() => {
    if (teacherDetails && teacherDetails.section) {
      fetch(`${API_BASE}/api/students?section=${encodeURIComponent(teacherDetails.section)}`)
        .then(res => res.json())
        .then(data => setStudents(data.filter(s => s.studentdetails)));
    }
  }, [teacherDetails]);

  useEffect(() => {
    if (page === 'events') {
      setEventsLoading(true);
      setEventsError('');
      fetch(`${API_BASE}/api/events`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch events');
          return res.json();
        })
        .then(data => setEvents(data))
        .catch(err => setEventsError(err.message))
        .finally(() => setEventsLoading(false));
    }
  }, [page]);

  // --- Handle row click: open modal and fetch subjects ---
  const handleStudentRowClick = async (student) => {
    setMarksError('');
    setMarksSuccess('');
    setSelectedStudent(student);
    setShowMarksModal(true);
    setMarksLoading(true);
    // Fetch subjects for student's branch and semester (assuming semester=1 for demo, adjust as needed)
    const branch = student.branch;
    const semester = student.semester || 1; // Replace with actual semester if available
    try {
      const res = await fetch(`${API_BASE}/api/subjects?branch=${encodeURIComponent(branch)}&semester=${semester}`);
      if (!res.ok) throw new Error('Subjects not found for this branch/semester');
      const subjectsData = await res.json();
      setSubjects(subjectsData);
      setMarksInputs(subjectsData.map(sub => ({
        subjectCode: sub.code,
        subjectName: sub.name,
        credits: sub.maxCredits,
        marksObtained: ''
      })));
    } catch (err) {
      setSubjects([]);
      setMarksInputs([]);
      setMarksError('Could not load subjects: ' + err.message);
    }
    setMarksLoading(false);
  };

  // --- Handle marks input change ---
  const handleMarksChange = (idx, value) => {
    setMarksInputs(inputs =>
      inputs.map((input, i) =>
        i === idx ? { ...input, marksObtained: value } : input
      )
    );
  };

  // --- Handle save marks ---
  const handleSaveMarks = async () => {
    setMarksError('');
    setMarksSuccess('');
    if (!selectedStudent) return;
    // Validate all marks are entered and within maxMarks
    for (let i = 0; i < marksInputs.length; i++) {
      const val = marksInputs[i].marksObtained;
      if (val === '' || isNaN(val)) {
        setMarksError('Please enter valid marks for all subjects.');
        return;
      }
      const max = subjects[i].maxMarks;
      if (Number(val) < 0 || Number(val) > max) {
        setMarksError(`Marks for ${subjects[i].name} must be between 0 and ${max}.`);
        return;
      }
    }
    // Prepare payload
    const payload = {
      allotedRegistrationName: selectedStudent.allotedRegistrationName,
      branch: selectedStudent.branch,
      semester: selectedStudent.semester || 1, // Replace with actual semester if available
      marks: marksInputs.map((m, i) => ({
        subjectCode: m.subjectCode,
        subjectName: m.subjectName,
        credits: m.credits,
        marksObtained: Number(m.marksObtained)
      }))
    };
    setMarksLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/marks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save marks');
      setMarksSuccess('Marks saved successfully!');
      setTimeout(() => {
        setShowMarksModal(false);
        setSelectedStudent(null);
        setMarksInputs([]);
        setSubjects([]);
        setMarksSuccess('');
      }, 1200);
    } catch (err) {
      setMarksError('Error saving marks: ' + err.message);
    }
    setMarksLoading(false);
  };

  // --- Modal for marks entry ---
  const renderMarksModal = () => {
    if (!showMarksModal || !selectedStudent) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}>
        <div style={{
          background: '#fff', borderRadius: 8, padding: 32, minWidth: 400, boxShadow: '0 2px 16px #0002'
        }}>
          <h3>Enter Marks for {selectedStudent.firstName} ({selectedStudent.allotedRegistrationName})</h3>
          <p>Branch: {selectedStudent.branch} | Semester: {selectedStudent.semester || 1}</p>
          {marksLoading ? (
            <p>Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p style={{ color: 'red' }}>{marksError || 'No subjects found.'}</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleSaveMarks(); }}>
              <table style={{ width: '100%', marginTop: 16 }}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Max Marks</th>
                    <th>Credits</th>
                    <th>Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub, idx) => (
                    <tr key={sub.code || sub.name}>
                      <td>{sub.name}</td>
                      <td>{sub.maxMarks}</td>
                      <td>{sub.maxCredits}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={sub.maxMarks}
                          value={marksInputs[idx]?.marksObtained}
                          onChange={e => handleMarksChange(idx, e.target.value)}
                          style={{ width: 80 }}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {marksError && <div style={{ color: 'red', marginTop: 8 }}>{marksError}</div>}
              {marksSuccess && <div style={{ color: 'green', marginTop: 8 }}>{marksSuccess}</div>}
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setShowMarksModal(false)} style={{ padding: '8px 16px' }}>Cancel</button>
                <button type="submit" style={{
                  background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500
                }}>Save Marks</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Navbar
  const renderNavbar = () => (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      height: 60,
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 'bold', color: '#6366f1', fontSize: '1.3rem' }}>
          EduTech College (Teacher)
        </span>
        <button onClick={() => setPage('home')} style={navBtnStyle}>Home</button>
        <button onClick={() => setPage('events')} style={navBtnStyle}>Events</button>
        <button onClick={() => setPage('performance')} style={navBtnStyle}>Student Performance</button>
      </div>
      <div>
        <button onClick={() => setPage('profile')} style={navBtnStyle}>Profile</button>
        <button onClick={onLogout} style={{
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginLeft: 16
        }}>🔓 Logout</button>
      </div>
    </nav>
  );

  const navBtnStyle = {
    background: 'none',
    border: 'none',
    color: '#374151',
    fontWeight: 500,
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '8px 12px'
  };

  // Home page
  const renderHome = () => (
    <div style={{ padding: 40 }}>
      <h2>Welcome, {teacherDetails.firstName} (Teacher)</h2>
      <p style={{ color: '#374151', marginTop: 16 }}>
        Use the navigation bar to view events, your profile, or student performance for your section.
      </p>
    </div>
  );

  // Events page (placeholder)
  const renderEvents = () => (
    <div style={{ padding: 40 }}>
      <h2>Events</h2>
      {eventsLoading && <p>Loading events...</p>}
      {eventsError && <p style={{ color: 'red' }}>{eventsError}</p>}
      {!eventsLoading && !eventsError && events.length === 0 && (
        <p>No events found.</p>
      )}
      {!eventsLoading && !eventsError && events.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map(event => (
            <li key={event._id} style={{ marginBottom: 24, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <h3 style={{ margin: 0 }}>{event.title}</h3>
              <p style={{ margin: '8px 0' }}>
                <strong>Date:</strong> {event.date}
                {event.endDate && ` - ${event.endDate}`}
              </p>
              {event.location && <p style={{ margin: '8px 0' }}><strong>Location:</strong> {event.location}</p>}
              {event.description && <p style={{ margin: '8px 0' }}>{event.description}</p>}
              {event.registrationDeadline && (
                <p style={{ margin: '8px 0', color: '#b91c1c' }}>
                  <strong>Registration Deadline:</strong> {event.registrationDeadline}
                </p>
              )}
              {event.image && (
                <img src={event.image} alt={event.title} style={{ maxWidth: 200, marginTop: 8, borderRadius: 4 }} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Profile page
  const renderProfile = () => (
    <div style={{ padding: 40 }}>
      <h2>Profile</h2>
      <table style={{ marginTop: 16 }}>
        <tbody>
          {Object.entries(teacherDetails).map(([key, value]) => (
            <tr key={key}>
              <td style={{ fontWeight: 600, padding: 8, textTransform: 'capitalize' }}>{key}</td>
              <td style={{ padding: 8 }}>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Student Performance page (students list)
  const renderPerformance = () => (
    <div style={{ padding: 40 }}>
      <h2>Students of Section {teacherDetails.section} ({teacherDetails.branch})</h2>
      {students.length === 0 ? (
        <p style={{ color: '#888', marginTop: 24 }}>No students found for this section.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg. No</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {students.map(item => {
              const s = item.studentdetails || item;
              if (!s) return null;
              return (
                <tr
                  key={item._id || s._id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleStudentRowClick(s)}
                  title="Click to enter marks"
                >
                  <td>{s.initial} {s.firstName}</td>
                  <td>{s.allotedRegistrationName}</td>
                  <td>{s.gmail}</td>
                  <td>{s.phoneNumber}</td>
                  <td>{s.section}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {renderMarksModal()}
    </div>
  );

  // Main render
  return (
    <div>
      {renderNavbar()}
      <main>
        {page === 'home' && renderHome()}
        {page === 'events' && renderEvents()}
        {page === 'performance' && renderPerformance()}
        {page === 'profile' && renderProfile()}
      </main>
    </div>
  );
};

export default TeacherDashboard;