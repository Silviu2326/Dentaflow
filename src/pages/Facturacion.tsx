import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewInvoiceModal from '../components/NewInvoiceModal';
import FacturacionTabs from '../components/FacturacionTabs';
import FacturasTable from '../components/FacturasTable';
import RecibosSection from '../components/RecibosSection';
import ArqueosSection from '../components/ArqueosSection';
import ViewInvoiceModal from '../components/ViewInvoiceModal';
import EditInvoiceModal from '../components/EditInvoiceModal';

interface Factura {
  id: string;
  patient: string;
  amount: number;
  status: 'Pagada' | 'Pendiente' | 'Vencida';
  date: string;
  dueDate: string;
  treatment: string;
  paymentMethod: string;
}

const Facturacion = () => {
  const [activeTab, setActiveTab] = useState('facturas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Factura | null>(null);

  const facturas: Factura[] = [
    {
      id: 'F-2024-001',
      patient: 'Ana García López',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 450.00,
      status: 'Pagada',
      treatment: 'Limpieza + Endodoncia',
      paymentMethod: 'card'
    },
    {
      id: 'F-2024-002',
      patient: 'Carlos Rodríguez',
      date: '2024-01-18',
      dueDate: '2024-02-18',
      amount: 280.00,
      status: 'Pendiente',
      treatment: 'Revisión + Radiografía',
      paymentMethod: 'cash'
    },
    {
      id: 'F-2024-003',
      patient: 'María Fernández',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      amount: 800.00,
      status: 'Vencida',
      treatment: 'Ortodoncia',
      paymentMethod: 'transfer'
    },
    {
      id: 'F-2024-004',
      patient: 'Juan Martínez',
      date: '2024-01-22',
      dueDate: '2024-02-22',
      amount: 320.00,
      status: 'Pagada',
      treatment: 'Empaste',
      paymentMethod: 'card'
    },
    {
      id: 'F-2024-005',
      patient: 'Laura Sánchez',
      date: '2024-01-25',
      dueDate: '2024-02-25',
      amount: 150.00,
      status: 'Pendiente',
      treatment: 'Limpieza',
      paymentMethod: 'cash'
    }
  ];

  const handleNewInvoice = (invoiceData: any) => {
    console.log('Nueva factura creada:', invoiceData);
    setShowNewInvoiceModal(false);
  };

  const handleViewInvoice = (invoice: Factura) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice: Factura) => {
    setEditingInvoice({...invoice});
    setShowEditModal(true);
  };

  const handleSaveInvoice = (updatedInvoice: Factura) => {
    console.log('Guardando factura editada:', updatedInvoice);
    // Aquí actualizarías la lista de facturas
  };

  const handleEditInvoiceChange = (updatedInvoice: Factura) => {
    setEditingInvoice(updatedInvoice);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facturas':
        return (
          <FacturasTable
            facturas={facturas}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
          />
        );
      case 'recibos':
        return <RecibosSection />;
      case 'arqueos':
        return <ArqueosSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Facturación
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona facturas, recibos y arqueos de caja
            </p>
          </div>
          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-600 text-white rounded-xl hover:from-blue-600 hover:to-green-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <FacturacionTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[600px]">
        <div className="p-8">
          {renderTabContent()}
        </div>

        {/* Modals */}
        <NewInvoiceModal
          isOpen={showNewInvoiceModal}
          onClose={() => setShowNewInvoiceModal(false)}
          onSubmit={handleNewInvoice}
        />

        <ViewInvoiceModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          invoice={selectedInvoice}
        />

        <EditInvoiceModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onChange={handleEditInvoiceChange}
        />
      </div>
    </div>
  );
};

export default Facturacion;