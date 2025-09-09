import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Pacientes from './pages/Pacientes';
import PacienteDetalle from './pages/PacienteDetalle';
import HistoriaClinica from './pages/HistoriaClinica';
import Presupuestos from './pages/Presupuestos';
import PacientePresupuestos from './pages/PacientePresupuestos';
import Facturacion from './pages/Facturacion';
import PacienteFacturacion from './pages/PacienteFacturacion';
import ImagenesPaciente from './pages/ImagenesPaciente';
import Citas from './pages/Citas';
import PresupuestosPipeline from './pages/PresupuestosPipeline';
import Documentos from './pages/Documentos';
import Tratamientos from './pages/Tratamientos';
import HistoriaClinicaDental from './pages/HistoriaClinicaDental';
import Consentimientos from './pages/Consentimientos';
import Caja from './pages/Caja';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import CitaOnline from './pages/CitaOnline';
import Importador from './pages/Importador';
import Inventario from './pages/Inventario';
import Costes from './pages/Costes';
import Pagos from './pages/Pagos';
import Integraciones from './pages/Integraciones';
import PortalPaciente from './pages/PortalPaciente';
import PortalEmpleado from './pages/PortalEmpleado';
import HQOverview from './pages/HQOverview';
import HQComisiones from './pages/HQComisiones';
import MarketingFunnels from './pages/MarketingFunnels';
import MarketingComunicaciones from './pages/MarketingComunicaciones';
import DAM from './pages/DAM';
import Telefonia from './pages/Telefonia';
import Financiacion from './pages/Financiacion';
import AnalyticsCohortes from './pages/AnalyticsCohortes';
import AnalyticsForecast from './pages/AnalyticsForecast';
import Webhooks from './pages/Webhooks';
import API from './pages/API';
import Status from './pages/Status';
import Auditoria from './pages/Auditoria';
import AjustesPrivacidad from './pages/AjustesPrivacidad';
import Branding from './pages/Branding';
import CamposPersonalizados from './pages/CamposPersonalizados';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id" element={<PacienteDetalle />} />
          <Route path="/pacientes/:id/historia" element={<HistoriaClinica />} />
          <Route path="/pacientes/:id/presupuestos" element={<PacientePresupuestos />} />
          <Route path="/pacientes/:id/facturacion" element={<PacienteFacturacion />} />
          <Route path="/pacientes/:id/imagenes" element={<ImagenesPaciente />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/tratamientos" element={<Tratamientos />} />
          <Route path="/historia-clinica" element={<HistoriaClinicaDental />} />
          <Route path="/consentimientos" element={<Consentimientos />} />
          <Route path="/presupuestos" element={<PresupuestosPipeline />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/caja" element={<Caja />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/cita-online" element={<CitaOnline />} />
          <Route path="/importador" element={<Importador />} />
          <Route path="/documentos" element={<Documentos />} />
          
          {/* Operations Routes */}
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/costes" element={<Costes />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/integraciones" element={<Integraciones />} />
          
          {/* External Portal Routes */}
          <Route path="/portal-paciente" element={<PortalPaciente />} />
          <Route path="/portal-empleado" element={<PortalEmpleado />} />
          
          {/* HQ Routes */}
          <Route path="/hq/overview" element={<HQOverview />} />
          <Route path="/hq/comisiones" element={<HQComisiones />} />
          
          {/* Marketing Routes */}
          <Route path="/marketing/funnels" element={<MarketingFunnels />} />
          <Route path="/marketing/comunicaciones" element={<MarketingComunicaciones />} />
          
          {/* Digital & Analytics Routes */}
          <Route path="/dam" element={<DAM />} />
          <Route path="/telefonia" element={<Telefonia />} />
          <Route path="/financiacion" element={<Financiacion />} />
          <Route path="/analytics/cohortes" element={<AnalyticsCohortes />} />
          <Route path="/analytics/forecast" element={<AnalyticsForecast />} />
          
          {/* System & API Routes */}
          <Route path="/webhooks" element={<Webhooks />} />
          <Route path="/api" element={<API />} />
          <Route path="/status" element={<Status />} />
          <Route path="/auditoria" element={<Auditoria />} />
          
          {/* Settings Routes */}
          <Route path="/ajustes/privacidad" element={<AjustesPrivacidad />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/campos-personalizados" element={<CamposPersonalizados />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;