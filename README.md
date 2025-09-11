# Sistema Integral de Gestión de Clínicas Dentales 🦷

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

## 📋 Descripción General

Sistema completo de gestión para clínicas dentales multi-sede que abarca todas las operaciones desde la gestión de pacientes hasta la inteligencia de negocio. Diseñado para prácticas dentales de cualquier tamaño, desde consultorios individuales hasta grandes grupos multi-ubicación.

### 🎯 Características Principales

- **Gestión Completa del Paciente**: Historias clínicas digitales, odontogramas, periodontogramas
- **Sistema de Citas Multi-Profesional**: Agenda compartida con confirmaciones automáticas
- **Gestión Financiera Integral**: Facturación, presupuestos, caja diaria, pagos
- **Portal del Paciente**: Autogestión de citas, historial médico, comunicaciones
- **Business Intelligence**: Analytics avanzado, forecasting, análisis de cohortes
- **Integraciones**: Contabilidad, pasarelas de pago, telefonía, firmas digitales
- **Cumplimiento RGPD**: Gestión de consentimientos y privacidad de datos

## 🏗️ Arquitectura del Sistema

### Frontend (React + TypeScript)
```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Context API para estado global
├── hooks/             # Hooks personalizados
├── pages/             # Páginas principales de la aplicación
├── types/             # Definiciones de TypeScript
└── utils/             # Utilidades y helpers
```

### Backend (Node.js + Express + MongoDB)
```
backend/
├── controllers/       # Controladores de rutas
├── models/           # Modelos de MongoDB
├── routes/           # Definición de rutas API
├── middleware/       # Middleware personalizado
└── utils/            # Utilidades del servidor
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal con hooks y componentes funcionales
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de utilidades CSS para diseño responsivo
- **Vite** - Herramienta de build ultrarrápida
- **React Router DOM** - Enrutamiento del lado del cliente
- **Lucide React** - Iconografía consistente
- **React Beautiful DnD** - Funcionalidad drag & drop
- **Date-fns** - Manipulación de fechas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js 5** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas
- **CORS** - Configuración de políticas de origen cruzado

## 👥 Sistema de Roles y Permisos

### 10 Roles Especializados

| Rol | Descripción | Permisos Principales |
|-----|-------------|---------------------|
| **Owner/HQ Admin** | Administrador principal | Acceso completo a todas las funcionalidades |
| **HQ Analyst** | Analista de negocio | Business Intelligence, reportes consolidados |
| **Admin de Sede** | Administrador local | Gestión completa de una ubicación específica |
| **Recepción** | Personal de recepción | Gestión de pacientes, citas, pagos |
| **Profesional Clínico** | Dentistas/Especialistas | Workflow clínico, historias, tratamientos |
| **Asistente/Enfermera** | Personal de apoyo | Asistencia clínica, preparación |
| **Finance** | Departamento financiero | Facturación, caja, reconciliación |
| **Marketing** | Departamento marketing | Campañas, leads, comunicaciones |
| **Operations** | Operaciones | Inventario, suministros, logística |
| **External Auditor** | Auditor externo | Acceso de solo lectura para cumplimiento |

### Sistema RBAC (Role-Based Access Control)
- Permisos granulares por módulo y acción (create, read, update, delete, admin)
- Control de acceso basado en sede y especialidad
- Auditoría completa de acciones por usuario

## 📱 Módulos Funcionales

### 1. 👤 Gestión de Pacientes
**Archivos**: `Pacientes.tsx`, `PacienteDetalle.tsx`, `PacienteFacturacion.tsx`, `PacientePresupuestos.tsx`

**Funcionalidades**:
- Base de datos completa con demografía y contacto
- Historial médico con alergias y medicaciones
- Gestión de seguros y métodos de pago preferidos
- Tracking de estado del paciente (activo/inactivo/pendiente)
- Integración con sistema de citas
- Facturación específica por paciente

**Interfaces Principales**:
```typescript
interface Patient {
  id: string;
  personalInfo: PersonalInfo;
  medicalHistory: MedicalHistory;
  insuranceInfo: InsuranceInfo;
  appointmentHistory: Appointment[];
  financialInfo: FinancialInfo;
}
```

### 2. 🏥 Operaciones Clínicas
**Archivos**: `HistoriaClinica.tsx`, `HistoriaClinicaDental.tsx`, `Tratamientos.tsx`, `Consentimientos.tsx`

**Funcionalidades**:
- Registros médicos digitales con historial completo
- Odontograma interactivo para mapeo visual dental
- Periodontograma para seguimiento de salud periodontal
- Catálogo de tratamientos con precios, duración y materiales
- Gestión de consentimientos digitales con firmas electrónicas
- Templates clínicos específicos por especialidad

**Interfaces Principales**:
```typescript
interface ClinicalRecord {
  patientId: string;
  odontogram: ToothStatus[];
  periodontogram: PeriodontalReading[];
  treatments: Treatment[];
  consents: ConsentRecord[];
}
```

### 3. 📅 Gestión de Citas
**Archivos**: `Agenda.tsx`, `Citas.tsx`, `CitaOnline.tsx`

**Funcionalidades**:
- Vista de calendario multi-formato (día/semana/mes)
- Programación multi-profesional y multi-sede
- Ciclo completo de citas (programada/confirmada/completada/ausente)
- Sistema de reserva online para pacientes
- Lista de espera y gestión de overbooking
- Tracking de origen de citas (web/teléfono/referencia)

**Interfaces Principales**:
```typescript
interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  datetime: Date;
  duration: number;
  treatment: string;
  status: AppointmentStatus;
  source: AppointmentSource;
}
```

### 4. 💰 Gestión Financiera
**Archivos**: `Facturacion.tsx`, `Caja.tsx`, `Pagos.tsx`, `Costes.tsx`

**Funcionalidades**:
- Generación y gestión de facturas
- Gestión de recibos de pagos
- Operaciones de caja diaria con arqueos
- Procesamiento de pagos múltiples métodos
- Análisis de costes y rentabilidad por tratamiento
- Reconciliación con pasarelas de pago

**Interfaces Principales**:
```typescript
interface PaymentTransaction {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  patientId: string;
  invoiceId?: string;
}

interface CashRegister {
  id: string;
  date: Date;
  openingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  closingBalance: number;
  difference: number;
}
```

### 5. 📊 Pipeline de Ventas y Presupuestos
**Archivos**: `PresupuestosPipeline.tsx`, `MarketingFunnels.tsx`

**Funcionalidades**:
- Creación y gestión de presupuestos de tratamientos
- Pipeline estilo Kanban para seguimiento de estados
- Gestión de leads a través del funnel de conversión
- Tracking de oportunidades de venta desde lead hasta aceptación
- Analytics de tasas de conversión y métricas de pipeline

**Interfaces Principales**:
```typescript
interface Budget {
  id: string;
  patientId: string;
  treatments: BudgetTreatment[];
  totalAmount: number;
  status: BudgetStatus;
  validUntil: Date;
  acceptanceRate: number;
}
```

### 6. 📦 Gestión de Inventario
**Archivos**: `Inventario.tsx`

**Funcionalidades**:
- Catálogo de productos con niveles de stock
- Seguimiento por lotes con fechas de caducidad
- Alertas automáticas para stock bajo y productos próximos a caducar
- Inventario multi-sede con transferencias
- Gestión de órdenes de compra y proveedores

**Interfaces Principales**:
```typescript
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  supplier: string;
  currentStock: number;
  minStock: number;
  expirationDate?: Date;
  location: string;
}
```

### 7. 👨‍⚕️ Gestión de Personal
**Archivos**: `Usuarios.tsx`, `HQComisiones.tsx`

**Funcionalidades**:
- Gestión de personal profesional con roles y permisos
- Administración de horarios y disponibilidad
- Sistema de cálculo de comisiones por tratamientos
- Tracking de rendimiento e integración con nóminas
- Gestión de licencias profesionales y especializaciones

**Interfaces Principales**:
```typescript interface User {
  id: string;
  personalInfo: UserPersonalInfo;
  professionalInfo: ProfessionalInfo;
  role: UserRole;
  permissions: Permission[];
  schedule: Schedule;
  performance: PerformanceMetrics;
}
```

### 8. 📄 Gestión Documental
**Archivos**: `Documentos.tsx`, `DAM.tsx`

**Funcionalidades**:
- Gestión de plantillas para documentos clínicos
- Workflows de firma digital con integración DocuSign
- Digital Asset Management (DAM) para imágenes clínicas
- Herramientas de comparación antes/después
- Gestión de permisos de imagen para marketing
- Control de versiones para plantillas

**Interfaces Principales**:
```typescript
interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentCategory;
  template: string;
  requiredFields: TemplateField[];
  signatureRequired: boolean;
}

interface DigitalAsset {
  id: string;
  patientId: string;
  type: AssetType;
  url: string;
  metadata: AssetMetadata;
  permissions: AssetPermissions;
}
```

### 9. 🔗 Integraciones y APIs
**Archivos**: `Integraciones.tsx`, `Webhooks.tsx`, `API.tsx`

**Funcionalidades**:
- Integración con software contable (A3 Software, Sage)
- Pasarelas de pago (Stripe, RedSys)
- Servicios de firma digital (DocuSign)
- Sistemas de telefonía (Asterisk)
- Herramientas de Business Intelligence (Power BI)
- Gestión de webhooks y playground de APIs

**Integraciones Soportadas**:
| Servicio | Tipo | Funcionalidad |
|----------|------|---------------|
| Stripe | Pagos | Procesamiento de pagos online |
| RedSys | Pagos | Pasarela española de pagos |
| A3 Software | Contabilidad | Sincronización contable |
| Sage 50 | Contabilidad | ERP y gestión financiera |
| DocuSign | Digital | Firmas electrónicas |
| Asterisk | Telefonía | PBX y gestión de llamadas |
| Power BI | Analytics | Business Intelligence |

### 10. 📈 Business Intelligence y Analytics
**Archivos**: `Dashboard.tsx`, `AnalyticsCohortes.tsx`, `AnalyticsForecast.tsx`, `Reportes.tsx`, `HQOverview.tsx`

**Funcionalidades**:
- Dashboards específicos por rol con KPIs clave
- Análisis de cohortes de pacientes para estudios de retención
- Forecasting financiero y análisis predictivo
- Reportes consolidados multi-sede
- Métricas de negocio en tiempo real con alertas

**Métricas Principales**:
- Tasa de retención de pacientes
- Valor de vida del cliente (CLV)
- Conversión de leads a pacientes
- Rentabilidad por tratamiento
- Eficiencia operacional por sede

### 11. 📢 Marketing y Comunicaciones
**Archivos**: `MarketingComunicaciones.tsx`, `PortalPaciente.tsx`, `PortalEmpleado.tsx`

**Funcionalidades**:
- Campañas de comunicación con pacientes vía email y SMS
- Portal del paciente para autogestión y engagement
- Portal del empleado para comunicaciones internas
- Tracking y analytics de campañas de marketing
- Encuestas de satisfacción y gestión de feedback

### 12. 🔧 Funciones Especializadas
**Archivos**: `Telefonia.tsx`, `Importador.tsx`, `Auditoria.tsx`, `Status.tsx`

**Funcionalidades**:
- Integración VoIP con logging de llamadas
- Herramientas de importación/exportación para migración de datos
- Auditoría y tracking de cumplimiento
- Dashboard de estado y monitoreo del sistema
- Gestión de cumplimiento RGPD y privacidad

## 🛠️ Configuración e Instalación

### Prerrequisitos
- Node.js 18+ 
- MongoDB 6+
- npm o yarn

### Instalación Frontend
```bash
# Clonar el repositorio
git clone [repository-url]
cd project

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

### Instalación Backend
```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor
npm run dev
```

### Variables de Entorno

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_DOCUSIGN_CLIENT_ID=your_docusign_client_id
```

#### Backend (.env)
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/dental-clinic

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Integraciones
STRIPE_SECRET_KEY=your_stripe_secret_key
DOCUSIGN_PRIVATE_KEY=your_docusign_private_key
REDSYS_MERCHANT_CODE=your_redsys_code

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 📊 Base de Datos y Modelos

### Modelos Principales

#### Patient (Paciente)
- Información demográfica y de contacto
- Historial médico y alergias
- Información de seguros
- Preferencias de comunicación
- Estados y seguimiento

#### Appointment (Cita)
- Programación temporal
- Asignación de profesional y sede
- Estado y tipo de tratamiento
- Información de confirmación

#### Treatment (Tratamiento)
- Catálogo de servicios
- Precios y duraciones
- Materiales requeridos
- Especialidades asociadas

#### User (Usuario)
- Información personal y profesional
- Roles y permisos
- Configuraciones y preferencias
- Métricas de rendimiento

#### Financial Models
- **Invoice**: Facturas emitidas
- **Payment**: Transacciones de pago
- **CashRegister**: Arqueos de caja
- **Budget**: Presupuestos de tratamiento

#### Inventory Models
- **Product**: Catálogo de productos
- **Batch**: Lotes con caducidades
- **InventoryAlert**: Alertas de stock

#### Integration Models
- **Integration**: Configuraciones de integraciones
- **IntegrationLog**: Logs de sincronización
- **PaymentLink**: Enlaces de pago generados

## 🔐 Seguridad y Cumplimiento

### Autenticación y Autorización
- JWT tokens con expiración configurable
- Refresh tokens para sesiones prolongadas
- Middleware de autenticación en todas las rutas protegidas
- Rate limiting para prevenir ataques

### RBAC (Control de Acceso Basado en Roles)
```typescript
// Ejemplo de verificación de permisos
const requiredPermissions = ['patients:read', 'patients:update'];
if (!userHasPermissions(user, requiredPermissions)) {
  throw new UnauthorizedError();
}
```

### Cumplimiento RGPD
- Consentimientos granulares por tipo de datos
- Right to be forgotten (derecho al olvido)
- Portabilidad de datos
- Auditoría completa de acceso a datos personales
- Anonimización de datos para analytics

### Auditoría y Logging
- Log completo de todas las acciones de usuario
- Tracking de cambios en registros sensibles
- Monitoreo de accesos no autorizados
- Backup automático con retención configurable

## 🚀 Despliegue

### Desarrollo
```bash
# Frontend
npm run dev

# Backend
cd backend && npm run dev
```

### Producción
```bash
# Build frontend
npm run build

# Servir archivos estáticos
npm run preview

# Producción backend
cd backend && npm start
```

### Docker (Recomendado)
```dockerfile
# Dockerfile ejemplo para backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📱 API Documentation

### Endpoints Principales

#### Autenticación
```
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/refresh-token
POST /api/auth/logout
```

#### Pacientes
```
GET    /api/patients
POST   /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
GET    /api/patients/search?q=term
```

#### Citas
```
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
GET    /api/appointments/calendar
POST   /api/appointments/:id/confirm
```

#### Pagos
```
GET    /api/payments
POST   /api/payments
GET    /api/payments/:id
POST   /api/payments/links
POST   /api/payments/process
GET    /api/payments/history
```

#### Inventario
```
GET    /api/inventory/products
POST   /api/inventory/products
PUT    /api/inventory/products/:id/stock
GET    /api/inventory/alerts
POST   /api/inventory/orders
```

### Códigos de Estado
- `200` - Éxito
- `201` - Creado
- `400` - Error de cliente
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error del servidor

## 🧪 Testing

### Testing Strategy
```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

### Estructura de Tests
```
tests/
├── unit/              # Tests unitarios
├── integration/       # Tests de integración
├── e2e/              # Tests end-to-end
├── fixtures/         # Datos de prueba
└── helpers/          # Utilidades de testing
```

## 🎯 Roadmap y Futuras Funcionalidades

### Versión 2.0
- [ ] Aplicación móvil nativa (React Native)
- [ ] Integración con dispositivos IoT (sensores de sala)
- [ ] AI para diagnóstico asistido
- [ ] Blockchain para registros médicos inmutables

### Versión 2.1
- [ ] Telemedicina y consultas remotas
- [ ] Integración con labs externos
- [ ] Sistema de referidos automatizado
- [ ] Analytics predictivo avanzado

### Versión 2.2
- [ ] Multi-idioma completo
- [ ] PWA con funcionalidad offline
- [ ] Integración con wearables
- [ ] Marketplace de tratamientos

## 🤝 Contribución

### Proceso de Desarrollo
1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Crear Pull Request

### Convenciones de Código
- ESLint + Prettier para formateo
- Convención de commits: `type(scope): description`
- Tests requeridos para nuevas funcionalidades
- Documentación actualizada

### Issues y Bugs
- Usar templates de issue proporcionados
- Incluir pasos para reproducir
- Especificar versión y entorno
- Adjuntar logs relevantes

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Equipo de Desarrollo

Desarrollado con ❤️ para modernizar la gestión de clínicas dentales.

### Contacto
- 📧 Email: [contact@dental-management.com]
- 📱 Teléfono: [+34 XXX XXX XXX]
- 🌐 Website: [https://dental-management.com]

### Soporte Técnico
- 📋 Documentación: [docs.dental-management.com]
- 🐛 Reporte de Bugs: [GitHub Issues]
- 💬 Chat de Soporte: [Discord/Slack]
- 📖 Wiki: [GitHub Wiki]

---

**Nota**: Esta aplicación maneja datos sensibles de salud. Asegúrese de cumplir con todas las regulaciones locales de protección de datos (RGPD, HIPAA, etc.) antes del despliegue en producción.

## 📊 Estadísticas del Proyecto

- **Líneas de Código**: 50,000+
- **Componentes React**: 200+
- **Endpoints API**: 150+
- **Modelos de Base de Datos**: 25+
- **Integraciones**: 15+
- **Idiomas Soportados**: Español (más en desarrollo)

---
*Última actualización: Septiembre 2024*