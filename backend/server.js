const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB Atlas connection string
mongoose.connect('mongodb://localhost:27017/studentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define a schema and model
const studentSchema = new mongoose.Schema({
  firstName: String,
  initial: String,
  dateOfBirth: String,
  gender: String,
  address: String,
  fathersName: String,
  mothersName: String,
  allotedRegistrationName: String,
  branch: String,
  section: String, // <-- Add this line
  feesPerYear: String,
  sscHallTicket: String,
  sscPercentage: String,
  sscPassOutYear: String,
  interHallTicket: String,
  interPercentage: String,
  interPassOutYear: String,
  yearOfAdmission: String,
  gmail: String,
  password: String,
  confirmPassword: String,
  phoneNumber: String,
});

const Student = mongoose.model('Student', studentSchema);

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    // Check if user already exists with the same allotedRegistrationName
    const existing = await UserDetails.findOne({ 'studentdetails.allotedRegistrationName': req.body.allotedRegistrationName });
    if (existing) {
      return res.status(400).json({ error: 'User is already registered with this registration number.' });
    }
    const user = new UserDetails({
      studentdetails: req.body
    });
    await user.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  try {
    // Try admin login
    const adminUser = await UserDetails.findOne({
      $or: [
        { 'admindetails.gmail': emailOrPhone },
        { 'admindetails.phoneNumber': emailOrPhone }
      ]
    });
    if (adminUser && adminUser.admindetails && adminUser.admindetails.password === password) {
      const adminObj = { ...adminUser.admindetails.toObject() };
      delete adminObj.password;
      return res.json({ admin: adminObj });
    }

    // Try student login
    const studentUser = await UserDetails.findOne({
      $or: [
        { 'studentdetails.gmail': emailOrPhone },
        { 'studentdetails.phoneNumber': emailOrPhone }
      ]
    });
    if (studentUser && studentUser.studentdetails && studentUser.studentdetails.password === password) {
      const studentObj = { ...studentUser.studentdetails.toObject() };
      delete studentObj.password;
      return res.json({ student: studentObj });
    }

    // Try teacher login
    const teacherUser = await UserDetails.findOne({
      $or: [
        { 'teacherdetails.gmail': emailOrPhone },
        { 'teacherdetails.phoneNumber': emailOrPhone }
      ]
    });
    if (teacherUser && teacherUser.teacherdetails && teacherUser.teacherdetails.password === password) {
      const teacherObj = { ...teacherUser.teacherdetails.toObject(), _id: teacherUser._id };
      delete teacherObj.password;
      return res.json({ teacher: teacherObj });
    }

    return res.status(400).json({ error: 'User not found or incorrect password' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Define achievement schema and model
const achievementSchema = new mongoose.Schema({
  title: String,
  certification: String,
  place: String,
  date: String,
  description: String,
  photo: String,
  category: String,
  studentName: String,
  allotedRegistrationName: String
});
const Achievement = mongoose.model('Achievement', achievementSchema, 'achievements');

// Achievement POST endpoint
app.post('/api/achievements', async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json({ message: 'Achievement added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example schema for marks (add to your models if needed)
const marksSchema = new mongoose.Schema({
  allotedRegistrationName: String,
  branch: String,
  semester: Number,
  marks: [
    {
      subjectCode: String,
      subjectName: String,
      credits: Number,
      marksObtained: Number
    }
  ]
});
const Marks = mongoose.model('Marks', marksSchema, 'marks');

// API to get student and topper marks for a semester
app.get('/api/performance', async (req, res) => {
  const { reg, sem } = req.query;
  try {
    const studentDoc = await Marks.findOne({ allotedRegistrationName: reg, semester: sem });
    const topperDoc = await Marks.findOne({ semester: sem }).sort({ 'marks.0': -1 }); // assuming marks[0] is total or use your logic
    res.json({
      studentMarks: studentDoc ? studentDoc.marks : [],
      topperMarks: topperDoc ? topperDoc.marks : []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// server.js

const studentDetailsSchema = new mongoose.Schema({
  firstName: String,
  initial: String,
  dateOfBirth: String,
  gender: String,
  address: String,
  fathersName: String,
  mothersName: String,
  allotedRegistrationName: String,
  branch: String,
  section: String, // <-- Add this line
  feesPerYear: String,
  sscHallTicket: String,
  sscPercentage: String,
  sscPassOutYear: String,
  interHallTicket: String,
  interPercentage: String,
  interPassOutYear: String,
  yearOfAdmission: String,
  gmail: String,
  password: String,
  confirmPassword: String,
  phoneNumber: String,
}, { _id: false });

const teacherDetailsSchema = new mongoose.Schema({
  firstName: String,
  initial: String,
  dateOfBirth: String,
  gender: String,
  address: String,
  gmail: String,
  password: String,
  branch: String,
  section: String,
  phoneNumber: String
}, { _id: false });

// 1. Add adminDetailsSchema
const adminDetailsSchema = new mongoose.Schema({
  firstName: String,
  gmail: String,
  password: String,
  phoneNumber: String
}, { _id: false });

// 2. Update userDetailsSchema to include admindetails
const userDetailsSchema = new mongoose.Schema({
  studentdetails: studentDetailsSchema,
  teacherdetails: teacherDetailsSchema,
  admindetails: adminDetailsSchema // <-- add this line
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema, 'userdetails');

// Teacher registration endpoint
app.post('/api/register-teacher', async (req, res) => {
  try {
    const user = new UserDetails({
      teacherdetails: req.body.teacherdetails
    });
    await user.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add an endpoint to register an admin (or insert one manually in MongoDB)
app.post('/api/register-admin', async (req, res) => {
  try {
    const user = new UserDetails({
      admindetails: req.body
    });
    await user.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students (with search, only those with studentdetails)
app.get('/api/students', async (req, res) => {
  const { q, section, branch } = req.query;
  let filter = { studentdetails: { $ne: null } };

  if (q) {
    filter.$or = [
      { 'studentdetails.firstName': { $regex: q, $options: 'i' } },
      { 'studentdetails.allotedRegistrationName': { $regex: q, $options: 'i' } },
      { 'studentdetails.gmail': { $regex: q, $options: 'i' } },
      { 'studentdetails.phoneNumber': { $regex: q, $options: 'i' } }
    ];
  }
  if (section) filter['studentdetails.section'] = section;
  if (branch) filter['studentdetails.branch'] = branch;

  const students = await UserDetails.find(filter, { studentdetails: 1, _id: 1 });
  res.json(students.map(s => ({ _id: s._id, studentdetails: s.studentdetails })));
});

// Get single student by ID (return only studentdetails)
app.get('/api/students/:id', async (req, res) => {
  const user = await UserDetails.findById(req.params.id, { studentdetails: 1 });
  if (!user || !user.studentdetails) return res.status(404).json({ error: 'Not found' });
  res.json(user.studentdetails);
});

// Get all teachers (with search)
app.get('/api/teachers', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { 'teacherdetails.firstName': { $regex: q, $options: 'i' } },
        { 'teacherdetails.gmail': { $regex: q, $options: 'i' } },
        { 'teacherdetails.phoneNumber': { $regex: q, $options: 'i' } }
      ]
    };
  }
  const teachers = await UserDetails.find(filter, { teacherdetails: 1, _id: 1 });
  res.json(teachers.map(t => ({ ...t.teacherdetails?.toObject(), _id: t._id })));
});

// Get single teacher by ID (return full user document)
app.get('/api/teachers/:id', async (req, res) => {
  const user = await UserDetails.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user); // Return the full user document
});

// Events collection and endpoints
const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  endDate: String,
  location: String,
  description: String,
  image: String,
  registrationDeadline: String,
  registeredStudents: [String] // <-- Add this line
});
const Event = mongoose.model('Event', eventSchema, 'events');

// Get all events
app.get('/api/events', async (req, res) => {
  const { reg } = req.query;
  let filter = {};
  if (reg) filter.registeredStudents = reg;
  const events = await Event.find(filter);
  res.json(events);
});

// Add new event
app.post('/api/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ error: 'Not found' });
  res.json(event);
});

app.post('/api/events/:id/register', async (req, res) => {
  const { reg } = req.body;
  if (!reg) return res.status(400).json({ error: 'Registration number required' });
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { registeredStudents: reg } },
    { new: true }
  );
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

const branchSubjects = {
  'CSE': ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'],
  'ECE': ['Analog Circuits', 'Digital Electronics', 'Signals & Systems', 'Microprocessors', 'Communication Systems'],
  'ME': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing', 'Heat Transfer'],
  'CE': ['Structural Analysis', 'Geotechnical Engg', 'Transportation Engg', 'Surveying', 'Construction Materials'],
  'EE': ['Circuit Theory', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics'],
  'IT': ['Web Technologies', 'Software Engg', 'Computer Networks', 'Database Systems', 'Cloud Computing']
};
const branches = Object.keys(branchSubjects);

// Subject schema for semesters
const semesterSubjectSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  subjects: [
   {
      code: String,
      name: String,
      maxMarks: Number,    // <-- Add this
      maxCredits: Number   // <-- Add this
    }
  ]
});
const SemesterSubject = mongoose.model('SemesterSubject', semesterSubjectSchema, 'semestersubjects');

// Get subjects for a specific branch and semester
app.get('/api/subjects', async (req, res) => {
  const { branch, semester } = req.query;
  if (!branch || !semester) return res.status(400).json({ error: 'branch and semester required' });
  const doc = await SemesterSubject.findOne({ branch, semester: Number(semester) });
  if (!doc) return res.status(404).json({ error: 'Subjects not found' });
  res.json(doc.subjects);
});

// Save or update marks for a student for a semester
app.post('/api/marks', async (req, res) => {
  const { allotedRegistrationName, branch, semester, marks } = req.body;
  if (!allotedRegistrationName || !branch || !semester || !marks) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const doc = await Marks.findOneAndUpdate(
    { allotedRegistrationName, branch, semester },
    { $set: { marks } },
    { upsert: true, new: true }
  );
  res.json(doc);
});

// Get marks for a student for a semester
app.get('/api/marks', async (req, res) => {
  const { allotedRegistrationName, branch, semester } = req.query;
  if (!allotedRegistrationName || !branch || !semester) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const doc = await Marks.findOne({ allotedRegistrationName, branch, semester: Number(semester) });
  if (!doc) return res.json({ marks: [] });
  res.json(doc);
});

// Assuming you have a SemesterSubject model like:
// { branch: String, semester: Number, subjects: [ { code, name, maxMarks, maxCredits } ] }
 
app.post('/api/subjects', async (req, res) => {
  const { branch, semester, subjects } = req.body;
  if (!branch || !semester || !Array.isArray(subjects)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Upsert: update if exists, else create
    const updated = await SemesterSubject.findOneAndUpdate(
      { branch, semester },
      { $set: { subjects } },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Error saving subjects:', err);
    res.status(500).json({ error: 'Failed to save subjects' });
  }
});

// In server.js
app.get('/api/achievements', async (req, res) => {
  const { reg } = req.query;
  let filter = {};
  if (reg) filter.allotedRegistrationName = reg;
  const achievements = await Achievement.find(filter);
  res.json(achievements);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
