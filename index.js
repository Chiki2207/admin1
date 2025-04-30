const express = require('express');
const path = require('path');

const authRoutes = require('./src/server/routes/RAuth');
const userRoutes = require('./src/server/routes/RUsuarios');
const pplRoutes = require('./src/server/routes/RPPL');
const connectDB = require('./src/database/mongobd');

const app = express();
const PORT = 3001;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views/admin')));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/admin/index.html'));
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ppl', pplRoutes);
app.use('/api/v1', (req, res) => {
  res.send('API de presos');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
