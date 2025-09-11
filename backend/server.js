const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const consentRoutes = require('./routes/consentRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const billingRoutes = require('./routes/billingRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes');
const arqueoCajaRoutes = require('./routes/arqueoCajaRoutes');
const documentRoutes = require('./routes/documentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const costesRoutes = require('./routes/costesRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tempRoutes = require('./routes/tempRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dental-clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado exitosamente'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/consents', consentRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/arqueos', arqueoCajaRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/costes', costesRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/temp', tempRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
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
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
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
  console.log(`Server is running on port ${PORT}`);
});