import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const AdminDashboard = ({ adminDetails, onLogout }) => {
  const [page, setPage] = useState('home');
  const [search, setSearch] = useState('');
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  // Event management state
  const [eventMode, setEventMode] = useState('manage'); // 'manage' or 'add'
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    endDate: '',
    location: '',
    description: '',
    image: '',
    registrationDeadline: '',
    _id: null
  });

  // Teacher management state
  const [teacherMode, setTeacherMode] = useState('manage'); // 'manage' or 'add'
  const [teacherForm, setTeacherForm] = useState({
    firstName: '',
    initial: '',
    dob: '',
    gender: '',
    dateJoined: '',
    branch: '',
    address: '',
    gmail: '',
    password: '',
    subjects: [],
    classTeacherFor: '',
    section: '',
    phoneNumber: '',
    _id: null
  });

  // Branches management state
  const [showBranchManager, setShowBranchManager] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', maxMarks: '', maxCredits: '', _editIndex: null });
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Dummy branches and subjects data
  const branches = ['CSE', 'ECE', 'ME', 'CE','EE', 'IT'];
  const branchSubjects = {
 'CSE': ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'],
  'ECE': ['Analog Circuits', 'Digital Electronics', 'Signals & Systems', 'Microprocessors', 'Communication Systems'],
  'ME': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing', 'Heat Transfer'],
  'CE': ['Structural Analysis', 'Geotechnical Engg', 'Transportation Engg', 'Surveying', 'Construction Materials'],
  'EE': ['Circuit Theory', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics'],
  'IT': ['Web Technologies', 'Software Engg', 'Computer Networks', 'Database Systems', 'Cloud Computing']
  };

  const allBranches = [
    'CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'
  ];
  const allSemesters = [
    '1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'
  ];

  // Helper: Convert "1-1" to 1, "2-2" to 4, etc.
  const semesterToNumber = (sem) => {
    const [year, part] = sem.split('-').map(Number);
    return (year - 1) * 2 + part;
  };

  // Fetch subjects for branch/semester
  const fetchSubjects = async (branch, semester) => {
    setLoadingSubjects(true);
    setSubjects([]);
    setSubjectForm({ code: '', name: '', maxMarks: '', maxCredits: '', _editIndex: null });
    try {
      const res = await fetch(`${API_BASE}/api/subjects?branch=${encodeURIComponent(branch)}&semester=${semesterToNumber(semester)}`);
      if (res.ok) {
        const data = await res.json();
        setSubjects(data.map(s => ({
          code: s.code || '',
          name: s.name || '',
          maxMarks: s.maxMarks || '',
          maxCredits: s.maxCredits || '',
        })));
      } else {
        setSubjects([]);
      }
    } catch {
      setSubjects([]);
    }
    setLoadingSubjects(false);
  };

  // Save subjects for branch/semester
  const saveSubjects = async () => {
    // Validate all subjects
    for (const subj of subjects) {
      if (!subj.code || !subj.name || !subj.maxMarks || !subj.maxCredits) {
        alert('All subject fields are required.');
        return;
      }
    }
    const payload = {
      branch: selectedBranch,
      semester: semesterToNumber(selectedSemester),
      subjects: subjects.map(s => ({
        code: s.code,
        name: s.name,
        maxMarks: Number(s.maxMarks),
        maxCredits: Number(s.maxCredits)
      }))
    };
    const res = await fetch(`${API_BASE}/api/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert('Subjects saved!');
      fetchSubjects(selectedBranch, selectedSemester);
    } else {
      alert('Failed to save subjects');
    }
  };

  // Add or update subject in the list
  const handleSubjectFormSubmit = (e) => {
    e.preventDefault();
    const { code, name, maxMarks, maxCredits, _editIndex } = subjectForm;
    if (!code || !name || !maxMarks || !maxCredits) {
      alert('All fields required');
      return;
    }
    const newSubject = { code, name, maxMarks, maxCredits };
    if (_editIndex !== null) {
      // Edit
      setSubjects(subjects.map((s, i) => i === _editIndex ? newSubject : s));
    } else {
      // Add
      setSubjects([...subjects, newSubject]);
    }
    setSubjectForm({ code: '', name: '', maxMarks: '', maxCredits: '', _editIndex: null });
  };

  // Edit subject
  const handleEditSubject = (idx) => {
    const subj = subjects[idx];
    setSubjectForm({ ...subj, _editIndex: idx });
  };

  // Delete subject
  const handleDeleteSubject = (idx) => {
    if (window.confirm('Delete this subject?')) {
      setSubjects(subjects.filter((_, i) => i !== idx));
    }
  };

  useEffect(() => {
    if (page === 'students' || page === 'teachers') {
      fetch(`${API_BASE}/api/${page}?q=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(setList);
    }
    if (page === 'events' && eventMode === 'manage') {
      fetch(`${API_BASE}/api/events`)
        .then(res => res.json())
        .then(setList);
    }
  }, [page, search, eventMode]);

  const handleRowClick = (id) => {
    fetch(`${API_BASE}/api/${page}/${id}`)
      .then(res => res.json())
      .then(setSelected);
  };

  // Event form handlers
  const handleEventFormChange = e => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleEventSubmit = async e => {
    e.preventDefault();
    const method = eventForm._id ? 'PUT' : 'POST';
    const url = eventForm._id
      ? `${API_BASE}/api/events/${eventForm._id}`
      : `${API_BASE}/api/events`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm)
    });
    if (res.ok) {
      alert(eventForm._id ? 'Event updated!' : 'Event added!');
      setEventForm({ title: '', date: '', endDate: '', location: '', description: '', image: '', registrationDeadline: '', _id: null });
      setEventMode('manage');
    } else {
      alert('Failed to save event');
    }
  };

  const handleEditEvent = (event) => {
    setEventForm(event);
    setEventMode('add');
  };

  // Cloudinary config
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dtiniasq3/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // You must create an unsigned upload preset in your Cloudinary dashboard

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Upload to Cloudinary
    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      setEventForm(prev => ({ ...prev, image: data.secure_url }));
      alert('Image uploaded!');
    } else {
      alert('Image upload failed');
    }
  };

  // Handles changes in the teacher form fields
  const handleTeacherFormChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'subjects') {
      setTeacherForm(prev => ({
        ...prev,
        subjects: checked
          ? [...prev.subjects, value]
          : prev.subjects.filter(s => s !== value)
      }));
    } else {
      setTeacherForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handles teacher form submission
  const handleTeacherSubmit = async e => {
    e.preventDefault();
    const payload = { teacherdetails: { ...teacherForm } };
    const method = teacherForm._id ? 'PUT' : 'POST';
    const url = teacherForm._id
      ? `${API_BASE}/api/teachers/${teacherForm._id}`
      : `${API_BASE}/api/register-teacher`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert(teacherForm._id ? 'Teacher updated!' : 'Teacher added!');
      setTeacherForm({
        firstName: '', initial: '', dob: '', gender: '', dateJoined: '', branch: '', address: '', gmail: '', password: '', subjects: [], classTeacherFor: '', section: '', phoneNumber: '', _id: null
      });
      setTeacherMode('manage');
      setPage('teachers');
    } else {
      alert('Failed to save teacher');
    }
  };

  // Render event management UI
  const renderEvents = () => (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => { setEventMode('add'); setEventForm({ title: '', date: '', endDate: '', location: '', description: '', image: '', registrationDeadline: '', _id: null }); }}
          style={{
            background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px',
            padding: '10px 20px', fontWeight: '500', marginRight: 12, cursor: 'pointer'
          }}
        >Add an Event</button>
        <button
          onClick={() => setEventMode('manage')}
          style={{
            background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px',
            padding: '10px 20px', fontWeight: '500', cursor: 'pointer'
          }}
        >Manage Events</button>
      </div>
      {eventMode === 'add' ? (
        <form onSubmit={handleEventSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 500 }}>
          <h3>{eventForm._id ? 'Edit Event' : 'Add Event'}</h3>
          <input name="title" value={eventForm.title} onChange={handleEventFormChange} placeholder="Title" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
          <label style={{ display: 'block', marginBottom: 4 }}>Start Date:</label>
          <input
            name="date"
            type="date"
            value={eventForm.date}
            onChange={handleEventFormChange}
            required
            style={{ width: '100%', marginBottom: 8, padding: 8 }}
          />
          <label style={{ display: 'block', marginBottom: 4 }}>End Date:</label>
          <input
            name="endDate"
            type="date"
            value={eventForm.endDate}
            onChange={handleEventFormChange}
            required
            style={{ width: '100%', marginBottom: 8, padding: 8 }}
          />
          <label style={{ display: 'block', marginBottom: 4 }}>Registration Deadline (Date & Time):</label>
          <input
            name="registrationDeadline"
            type="datetime-local"
            value={eventForm.registrationDeadline}
            onChange={handleEventFormChange}
            required
            style={{ width: '100%', marginBottom: 8, padding: 8 }}
          />
          <input name="location" value={eventForm.location} onChange={handleEventFormChange} placeholder="Location" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
          <textarea name="description" value={eventForm.description} onChange={handleEventFormChange} placeholder="Description" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 8 }} />
          {eventForm.image && (
            <div style={{ marginBottom: 8 }}>
              <img src={eventForm.image} alt="Event" style={{ maxWidth: 200, maxHeight: 120 }} />
            </div>
          )}
          <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '500', cursor: 'pointer' }}>
            {eventForm._id ? 'Update' : 'Add'}
          </button>
          {eventForm._id && (
            <button type="button" onClick={() => { setEventForm({ title: '', date: '', endDate: '', location: '', description: '', image: '', registrationDeadline: '', _id: null }); setEventMode('manage'); }} style={{ marginLeft: 12 }}>
              Cancel
            </button>
          )}
        </form>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Description</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {list.map(event => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>{event.description}</td>
                <td>
                  <button onClick={() => handleEditEvent(event)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderTeacherForm = () => (
    <form onSubmit={handleTeacherSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 500 }}>
      <h3>{teacherForm._id ? 'Edit Teacher' : 'Add Teacher'}</h3>
      <input name="firstName" value={teacherForm.firstName} onChange={handleTeacherFormChange} placeholder="First Name" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <input name="initial" value={teacherForm.initial} onChange={handleTeacherFormChange} placeholder="Initial" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Date of Birth:</label>
      <input name="dob" type="date" value={teacherForm.dob} onChange={handleTeacherFormChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Gender:</label>
      <select name="gender" value={teacherForm.gender} onChange={handleTeacherFormChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }}>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <label>Date Joined:</label>
      <input name="dateJoined" type="date" value={teacherForm.dateJoined} onChange={handleTeacherFormChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Branch:</label>
      <select name="branch" value={teacherForm.branch} onChange={handleTeacherFormChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }}>
        <option value="">Select Branch</option>
        {branches.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <label>Subjects Taught:</label>
      <div style={{ marginBottom: 8 }}>
        {branchSubjects[teacherForm.branch]?.map(subj => (
          <label key={subj} style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              name="subjects"
              value={subj}
              checked={teacherForm.subjects.includes(subj)}
              onChange={handleTeacherFormChange}
            /> {subj}
          </label>
        ))}
      </div>
      <label>Class Teacher For:</label>
      <input name="classTeacherFor" value={teacherForm.classTeacherFor} onChange={handleTeacherFormChange} placeholder="Class Teacher For" style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Section:</label>
      <input name="section" value={teacherForm.section} onChange={handleTeacherFormChange} placeholder="Section" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Address:</label>
      <input name="address" value={teacherForm.address} onChange={handleTeacherFormChange} placeholder="Address" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Email:</label>
      <input name="gmail" value={teacherForm.gmail} onChange={handleTeacherFormChange} placeholder="Email" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Password:</label>
      <input name="password" type="password" value={teacherForm.password} onChange={handleTeacherFormChange} placeholder="Password" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <label>Phone Number:</label>
      <input name="phoneNumber" value={teacherForm.phoneNumber} onChange={handleTeacherFormChange} placeholder="Phone Number" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '500', cursor: 'pointer' }}>
        {teacherForm._id ? 'Update' : 'Add'}
      </button>
      {teacherForm._id && (
        <button type="button" onClick={() => { setTeacherForm({ firstName: '', initial: '', dob: '', gender: '', dateJoined: '', branch: '', address: '', gmail: '', password: '', subjects: [], classTeacherFor: '', section: '', phoneNumber: '', _id: null }); setTeacherMode('manage'); }} style={{ marginLeft: 12 }}>
          Cancel
        </button>
      )}
    </form>
  );

  // Branches management UI
  const renderBranchManager = () => (
    <div style={{ background: '#fff', padding: 24, borderRadius: 10, maxWidth: 700, margin: '32px auto' }}>
      <h2 style={{ marginBottom: 16 }}>Branch & Semester Subject Management</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div>
          <label>Branch:</label>
          <select
            value={selectedBranch}
            onChange={e => {
              setSelectedBranch(e.target.value);
              setSelectedSemester('');
              setSubjects([]);
              setSubjectForm({ code: '', name: '', maxMarks: '', maxCredits: '', _editIndex: null });
            }}
            style={{ marginLeft: 8, padding: 6 }}
          >
            <option value="">Select Branch</option>
            {allBranches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label>Semester:</label>
          <select
            value={selectedSemester}
            onChange={e => {
              setSelectedSemester(e.target.value);
              if (selectedBranch && e.target.value) {
                fetchSubjects(selectedBranch, e.target.value);
              }
            }}
            style={{ marginLeft: 8, padding: 6 }}
            disabled={!selectedBranch}
          >
            <option value="">Select Semester</option>
            {allSemesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {selectedBranch && selectedSemester && (
        <div>
          <h4>Subjects for {selectedBranch} - {selectedSemester}</h4>
          {loadingSubjects ? (
            <div>Loading...</div>
          ) : (
            <>
              <form onSubmit={handleSubjectFormSubmit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  placeholder="Subject Code"
                  value={subjectForm.code}
                  onChange={e => setSubjectForm(f => ({ ...f, code: e.target.value }))}
                  style={{ width: 120, padding: 6 }}
                />
                <input
                  placeholder="Subject Name"
                  value={subjectForm.name}
                  onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: 180, padding: 6 }}
                />
                <input
                  placeholder="Max Marks"
                  type="number"
                  value={subjectForm.maxMarks}
                  onChange={e => setSubjectForm(f => ({ ...f, maxMarks: e.target.value }))}
                  style={{ width: 100, padding: 6 }}
                />
                <input
                  placeholder="Max Credits"
                  type="number"
                  value={subjectForm.maxCredits}
                  onChange={e => setSubjectForm(f => ({ ...f, maxCredits: e.target.value }))}
                  style={{ width: 100, padding: 6 }}
                />
                <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 500 }}>
                  {subjectForm._editIndex !== null ? 'Update' : 'Add'}
                </button>
                {subjectForm._editIndex !== null && (
                  <button type="button" onClick={() => setSubjectForm({ code: '', name: '', maxMarks: '', maxCredits: '', _editIndex: null })} style={{ marginLeft: 6 }}>
                    Cancel
                  </button>
                )}
              </form>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Max Marks</th>
                    <th>Max Credits</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subj, idx) => (
                    <tr key={idx}>
                      <td>{subj.code}</td>
                      <td>{subj.name}</td>
                      <td>{subj.maxMarks}</td>
                      <td>{subj.maxCredits}</td>
                      <td>
                        <button onClick={() => handleEditSubject(idx)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => handleDeleteSubject(idx)} style={{ color: 'red' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={saveSubjects} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 500 }}>
                Save All Subjects
              </button>
            </>
          )}
        </div>
      )}
      <button onClick={() => setShowBranchManager(false)} style={{ marginTop: 24, background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 500 }}>
        Close
      </button>
    </div>
  );

  const renderList = () => (
    <div>
      <input
        type="text"
        placeholder={`Search ${page}...`}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {page === 'students' && (
              <>
                <th>Name</th>
                <th>Reg. No</th>
                <th>Email</th>
                <th>Phone</th>
              </>
            )}
            {page === 'teachers' && (
              <>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </>
            )}
            {page === 'events' && (
              <>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {page === 'students' && list
            .filter(item => item.studentdetails)
            .map(item => {
              const s = item.studentdetails;
              return (
                <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
                  <td>{s.initial} {s.firstName}</td>
                  <td>{s.allotedRegistrationName}</td>
                  <td>{s.gmail}</td>
                  <td>{s.phoneNumber}</td>
                </tr>
              );
            })}
          {page === 'teachers' && list
            .map(item => {
              // Support both {teacherdetails: {...}} and direct teacher objects
              const t = item.teacherdetails || item;
              if (!t || !t.firstName) return null;
              return (
                <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
                  <td>{t.initial} {t.firstName}</td>
                  <td>{t.gmail}</td>
                  <td>{t.phoneNumber}</td>
                </tr>
              );
            })}
          {page === 'events' && list.map(item => (
            <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div style={{
          marginTop: 32,
          background: '#f0f4f8',
          padding: 24,
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <h3 style={{ marginBottom: 16 }}>
            {page === 'students' ? '📋 Student Details' : page === 'teachers' ? '👨‍🏫 Teacher Details' : '📅 Event Details'}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(selected).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ padding: '8px', fontWeight: '600', textTransform: 'capitalize' }}>{key}</td>
                  <td style={{ padding: '8px' }}>
                    {Array.isArray(value)
                      ? value.join(', ')
                      : (typeof value === 'object' && value !== null)
                        ? Object.entries(value).map(([k, v]) => (
                            <div key={k}><b>{k}:</b> {Array.isArray(v) ? v.join(', ') : String(v)}</div>
                          ))
                      : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setSelected(null)} style={{
            marginTop: 20,
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>❌ Close</button>
        </div>
      )}
    </div>
  );

  const renderTeachers = () => (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => { setTeacherMode('add'); setTeacherForm({ firstName: '', initial: '', dob: '', gender: '', dateJoined: '', branch: '', address: '', gmail: '', password: '', subjects: [], classTeacherFor: '', section: '', phoneNumber: '', _id: null }); }}
          style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '500', marginRight: 12, cursor: 'pointer' }}
        >Add Teacher</button>
        <button
          onClick={() => setTeacherMode('manage')}
          style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '500', cursor: 'pointer' }}
        >Manage Teachers</button>
      </div>
      {teacherMode === 'add' ? renderTeacherForm() : renderList()}
    </div>
  );

  return (
    <div>
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
            EduTech College (Admin)
          </a>
          <button
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={onLogout}
          >
            🔓 Logout
          </button>
        </div>
      </header>
      <main style={{ padding: '40px 20px' }}>
        <h2>Welcome, {adminDetails.firstName} (Admin)</h2>
        <div style={{ marginTop: 32 }}>
          <button onClick={() => setPage('students')} style={{
            marginRight: 16,
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            🎓 Students
          </button>
          <button onClick={() => setPage('teachers')} style={{
            marginRight: 16,
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            👨‍🏫 Teachers
          </button>
          <button onClick={() => setPage('events')} style={{
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            📅 Events
          </button>
          <button onClick={() => setShowBranchManager(true)} style={{
            background: '#6366f1',
            color: '#fff',
            borderRadius: '6px',
            padding: '8px 20px',
            fontWeight: 500
          }}>
            Branches
          </button>
        </div>

        <div style={{ marginTop: 32 }}>
          {page === 'events' ? renderEvents() : page === 'teachers' ? renderTeachers() : page !== 'home' && renderList()}
          {showBranchManager && renderBranchManager()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
