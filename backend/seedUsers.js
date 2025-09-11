const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Modelo de usuario simplificado para el seed
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now }
});

// Middleware para hashear password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

// Mapeo de roles del frontend a roles del backend
const roleMapping = {
  'Owner / HQ Admin': 'owner',
  'HQ Analista': 'hq_analyst', 
  'Admin de Sede': 'admin_sede',
  'Recepción': 'reception',
  'Profesional Clínico': 'clinical_professional',
  'Asistente/Enfermería': 'assistant_nurse',
  'Finanzas / Caja': 'finance',
  'Marketing': 'marketing',
  'Operaciones / Inventario': 'operations',
  'Auditor Externo (RO)': 'external_auditor'
};

// Usuarios a crear
const usuarios = [
  {
    email: 'owner@clinic.com',
    displayRole: 'Owner / HQ Admin',
    nombre: 'Propietario',
    apellidos: 'Clínica Dental'
  },
  {
    email: 'hq.analista@clinic.com', 
    displayRole: 'HQ Analista',
    nombre: 'Analista',
    apellidos: 'Sede Central'
  },
  {
    email: 'admin.sede@clinic.com',
    displayRole: 'Admin de Sede', 
    nombre: 'Administrador',
    apellidos: 'Sede Local'
  },
  {
    email: 'recepcion@clinic.com',
    displayRole: 'Recepción',
    nombre: 'María',
    apellidos: 'Recepcionista'
  },
  {
    email: 'doctor@clinic.com',
    displayRole: 'Profesional Clínico',
    nombre: 'Dr. Juan',
    apellidos: 'Pérez'
  },
  {
    email: 'asistente@clinic.com',
    displayRole: 'Asistente/Enfermería',
    nombre: 'Ana',
    apellidos: 'Asistente'
  },
  {
    email: 'finanzas@clinic.com',
    displayRole: 'Finanzas / Caja',
    nombre: 'Carlos',
    apellidos: 'Financiero'
  },
  {
    email: 'marketing@clinic.com',
    displayRole: 'Marketing',
    nombre: 'Laura',
    apellidos: 'Marketing'
  },
  {
    email: 'operaciones@clinic.com',
    displayRole: 'Operaciones / Inventario', 
    nombre: 'Pedro',
    apellidos: 'Operaciones'
  },
  {
    email: 'auditor@clinic.com',
    displayRole: 'Auditor Externo (RO)',
    nombre: 'Auditor',
    apellidos: 'Externo'
  }
];

const seedUsers = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dental-clinic');
    console.log('Conectado a MongoDB');

    // Limpiar usuarios existentes (opcional - descomenta si quieres empezar desde cero)
    // await User.deleteMany({});
    // console.log('Usuarios existentes eliminados');

    // Crear usuarios
    for (const userData of usuarios) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`Usuario ${userData.email} ya existe - saltando...`);
          continue;
        }

        // Crear nuevo usuario
        const newUser = new User({
          nombre: userData.nombre,
          apellidos: userData.apellidos,
          email: userData.email,
          password: 'password', // Se hasheará automáticamente
          role: roleMapping[userData.displayRole],
          activo: true
        });

        await newUser.save();
        console.log(`✅ Usuario creado: ${userData.email} - Rol: ${userData.displayRole} (${roleMapping[userData.displayRole]})`);
        
      } catch (error) {
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }

    console.log('\n🎉 Proceso de seed completado');
    
    // Mostrar resumen
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total de usuarios en la base de datos: ${totalUsers}`);
    
    // Mostrar todos los usuarios creados
    const allUsers = await User.find({}, 'nombre apellidos email role').lean();
    console.log('\n👥 Usuarios en la base de datos:');
    allUsers.forEach(user => {
      const displayRole = Object.keys(roleMapping).find(key => roleMapping[key] === user.role) || user.role;
      console.log(`   • ${user.email} - ${user.nombre} ${user.apellidos} - ${displayRole}`);
    });

    console.log('\n🔑 Todos los usuarios tienen la contraseña: password');

  } catch (error) {
    console.error('❌ Error en el proceso de seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar el seed
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, User };