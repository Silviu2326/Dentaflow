const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = 3002; // Puerto diferente para test

// Definir el esquema User aquí para que esté disponible
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Registrar el modelo User
const User = mongoose.model('User', userSchema);

// Solo importar las rutas temporales
const tempRoutes = require('./routes/tempRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dental-clinic')
.then(() => console.log('MongoDB conectado exitosamente'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Solo rutas temporales
app.use('/api/temp', tempRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`Test Server is running on port ${PORT}`);
});