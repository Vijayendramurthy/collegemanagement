import React, { useState, useEffect } from 'react';

// Dummy semesters
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const color = '#6366f1'; // student

const PerformancePage = ({ studentDetails, onNavigateBack }) => {
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch marks for student only
  useEffect(() => {
    if (!studentDetails) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/performance?reg=${studentDetails.allotedRegistrationName}&sem=${selectedSemester}`)
      .then(res => res.json())
      .then(data => {
        setStudentMarks(data.studentMarks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studentDetails, selectedSemester]);

  // Simple line graph using SVG
  const renderLineGraph = () => {
    if (!studentMarks.length) return <p>No data available.</p>;
    const marksArray = studentMarks.map(m => m.marksObtained);
    const maxMark = Math.max(...marksArray, 100);
    const width = 400, height = 200, padding = 40;
    const points = marksArray.map((m, i) => ({
      x: padding + (i * (width - 2 * padding)) / (marksArray.length - 1),
      y: height - padding - ((m / maxMark) * (height - 2 * padding))
    }));
    const toPath = arr => arr.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    return (
      <svg width={width} height={height} style={{ background: '#f8fafc', borderRadius: 12 }}>
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" />
        {/* Student line */}
        <path d={toPath(points)} fill="none" stroke={color} strokeWidth="3" />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
        ))}
        {/* Label */}
        <text x={padding} y={padding - 10} fill={color} fontSize="0.9rem">You</text>
      </svg>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '16px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onNavigateBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginRight: '16px',
              color: '#6366f1'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>Performance Analysis</h1>
        </div>
      </header>
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, color: '#374151', marginRight: 12 }}>Select Semester:</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: '1rem' }}
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          {loading ? <p>Loading...</p> : renderLineGraph()}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ color: '#1f2937', fontSize: '1.2rem', marginBottom: 8 }}>Semester Results</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9fafb' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Subject Code</th>
                  <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Subject Name</th>
                  <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Credits</th>
                  <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Your Marks</th>
                </tr>
              </thead>
              <tbody>
                {(studentMarks.length ? studentMarks : []).map((mark, i) => (
                  <tr key={mark._id || i}>
                    <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{mark.subjectCode}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{mark.subjectName}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{mark.credits}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{mark.marksObtained}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformancePage;