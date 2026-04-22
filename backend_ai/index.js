const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;
const path = require('path');

require('./conn');
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177']
}));
const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');
app.use('/api/user',UserRoutes)
app.use('/api/resume',ResumeRoutes)

app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log("backend is running on port", PORT);
});