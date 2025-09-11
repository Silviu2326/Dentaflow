import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FileText, Plus, Euro, Calendar, User, Phone, Mail, Eye, Edit, X, Save, TrendingUp, PieChart, Clock } from 'lucide-react';
import NewBudgetModal from '../components/NewBudgetModal';

const PresupuestosPipeline = () => {
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [presupuestos, setPresupuestos] = useState({
    pendiente: [
      {
        id: '1',
        patient: 'Ana García López',
        treatment: 'Ortodoncia completa',
        amount: 2500,
        date: '2024-01-20',
        professional: 'Dra. Martinez',
        phone: '+34 600 123 456',
        email: 'ana.garcia@email.com',
        priority: 'high'
      },
      {
        id: '2',
        patient: 'Carlos López',
        treatment: 'Implante dental',
        amount: 1200,
        date: '2024-01-18',
        professional: 'Dr. Rodriguez',
        phone: '+34 600 789 012',
        email: 'carlos.lopez@email.com',
        priority: 'medium'
      }
    ],
    presentado: [
      {
        id: '3',
        patient: 'María Fernández',
        treatment: 'Blanqueamiento + Carillas',
        amount: 800,
        date: '2024-01-15',
        professional: 'Dr. Lopez',
        phone: '+34 600 345 678',
        email: 'maria.fernandez@email.com',
        priority: 'high'
      },
      {
        id: '4',
        patient: 'José Martín',
        treatment: 'Prótesis dental',
        amount: 1800,
        date: '2024-01-12',
        professional: 'Dra. Martinez',
        phone: '+34 600 901 234',
        email: 'jose.martin@email.com',
        priority: 'low'
      }
    ],
    aceptado: [
      {
        id: '5',
        patient: 'Laura Ruiz',
        treatment: 'Endodoncia + Corona',
        amount: 650,
        date: '2024-01-10',
        professional: 'Dr. Rodriguez',
        phone: '+34 600 567 890',
        email: 'laura.ruiz@email.com',
        priority: 'medium'
      }
    ],
    perdido: [
      {
        id: '6',
        patient: 'Pedro Santos',
        treatment: 'Cirugía periodontal',
        amount: 1400,
        date: '2024-01-08',
        professional: 'Dr. Lopez',
        phone: '+34 600 234 567',
        email: 'pedro.santos@email.com',
        priority: 'low'
      }
    ]
  });

  const columns = [
    { id: 'pendiente', title: 'Pendiente', color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300', headerColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500', textColor: 'text-yellow-700' },
    { id: 'presentado', title: 'Presentado', color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300', headerColor: 'bg-gradient-to-r from-blue-400 to-blue-500', textColor: 'text-blue-700' },
    { id: 'aceptado', title: 'Aceptado', color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300', headerColor: 'bg-gradient-to-r from-green-400 to-green-500', textColor: 'text-green-700' },
    { id: 'perdido', title: 'Perdido', color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300', headerColor: 'bg-gradient-to-r from-red-400 to-red-500', textColor: 'text-red-700' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
      case 'low': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = presupuestos[source.droppableId as keyof typeof presupuestos];
      const destColumn = presupuestos[destination.droppableId as keyof typeof presupuestos];
      const sourceItems = [...sourceColumn];
      const destItems = [...destColumn];
      
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      
      setPresupuestos({
        ...presupuestos,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      });
    } else {
      const column = presupuestos[source.droppableId as keyof typeof presupuestos];
      const copiedItems = [...column];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setPresupuestos({
        ...presupuestos,
        [source.droppableId]: copiedItems
      });
    }
  };

  const getTotalAmount = (columnId: string) => {
    return presupuestos[columnId as keyof typeof presupuestos].reduce((total, item) => total + item.amount, 0);
  };

  const handleNewBudget = (budgetData: any) => {
    console.log('Nuevo presupuesto creado:', budgetData);
  };

  const handleViewBudget = (budget: any) => {
    setSelectedBudget(budget);
    setShowViewModal(true);
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget({ ...budget });
    setShowEditModal(true);
  };

  const handleSaveBudget = () => {
    // Aquí iría la lógica para guardar el presupuesto editado
    setShowEditModal(false);
    setEditingBudget(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pipeline de Presupuestos
            </h1>
            <p className="text-gray-600 text-lg">Seguimiento visual del estado de presupuestos</p>
          </div>
          <button 
            onClick={() => setShowNewBudgetModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Presupuesto
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {columns.map((column) => (
            <div key={column.id} className={`${column.headerColor} border-2 border-white rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium opacity-90">{column.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {presupuestos[column.id as keyof typeof presupuestos].length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white opacity-75">Total</p>
                  <p className="text-xl font-bold text-white">
                    €{getTotalAmount(column.id).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-2">
                <div className="flex items-center text-white text-xs">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="opacity-90">+12% vs mes anterior</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className={`${column.headerColor} px-6 py-4 text-white`}>
                <h3 className="font-semibold text-white text-lg">{column.title}</h3>
                <p className="text-white text-sm opacity-90">
                  {presupuestos[column.id as keyof typeof presupuestos].length} presupuestos
                </p>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-6 min-h-96 ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}
                  >
                    <div className="space-y-4">
                      {presupuestos[column.id as keyof typeof presupuestos].map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${column.color} border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                                snapshot.isDragging ? 'shadow-2xl transform rotate-2 scale-105' : 'shadow-lg hover:shadow-xl hover:-translate-y-1'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                    {item.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{item.patient}</h4>
                                    <p className="text-xs text-gray-500">ID: {item.id}</p>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                                  {getPriorityText(item.priority)}
                                </span>
                              </div>
                              
                              <p className="text-sm font-medium text-gray-800 mb-4 bg-white bg-opacity-50 rounded-lg p-2">{item.treatment}</p>
                              
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white bg-opacity-60 rounded-lg p-2">
                                  <div className="flex items-center text-sm">
                                    <Euro className="h-4 w-4 mr-1 text-green-600" />
                                    <span className="font-bold text-green-700">€{item.amount.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="bg-white bg-opacity-60 rounded-lg p-2">
                                  <div className="flex items-center text-xs text-gray-600">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(item.date).toLocaleDateString('es-ES')}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-white bg-opacity-60 rounded-lg p-2 mb-4">
                                <div className="flex items-center text-xs text-gray-600">
                                  <User className="h-3 w-3 mr-1" />
                                  <span className="font-medium">{item.professional}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center pt-3 border-t border-white border-opacity-30">
                                <div className="flex space-x-2">
                                  <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition-colors">
                                    <Phone className="h-4 w-4" />
                                  </button>
                                  <button className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-lg transition-colors">
                                    <Mail className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex space-x-1">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewBudget(item);
                                    }}
                                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition-colors"
                                    title="Ver detalles"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditBudget(item);
                                    }}
                                    className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-lg transition-colors"
                                    title="Editar"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Pipeline Statistics */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl mr-4">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Estadísticas del Pipeline</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
              <h4 className="text-lg font-semibold text-green-800">Tasa de Conversión</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Presentado → Aceptado</span>
                <span className="font-bold text-green-800">65%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-sm" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-green-600">+8% vs mes anterior</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <Euro className="h-6 w-6 text-blue-600 mr-2" />
              <h4 className="text-lg font-semibold text-blue-800">Valor Total Pipeline</h4>
            </div>
            <p className="text-3xl font-bold text-blue-900 mb-2">
              €{Object.values(presupuestos).flat().reduce((total, item) => total + item.amount, 0).toLocaleString()}
            </p>
            <p className="text-xs text-blue-600">Potencial de ingresos</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-purple-600 mr-2" />
              <h4 className="text-lg font-semibold text-purple-800">Tiempo Promedio</h4>
            </div>
            <p className="text-sm text-purple-700 mb-2">Pendiente → Aceptado</p>
            <p className="text-3xl font-bold text-purple-900 mb-2">12 días</p>
            <p className="text-xs text-purple-600">-2 días vs mes anterior</p>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Presupuesto */}
      <NewBudgetModal
        isOpen={showNewBudgetModal}
        onClose={() => setShowNewBudgetModal(false)}
        onSubmit={handleNewBudget}
      />

      {/* Modal para ver detalles */}
      {showViewModal && selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Detalles del Presupuesto</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información del Paciente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {selectedBudget.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedBudget.patient}</p>
                        <p className="text-sm text-gray-600">ID: {selectedBudget.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white p-3 rounded-lg">
                        <Phone className="h-4 w-4 text-blue-600 mb-1" />
                        <p className="text-xs text-gray-500">Teléfono</p>
                        <p className="text-sm font-medium">{selectedBudget.phone}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <Mail className="h-4 w-4 text-green-600 mb-1" />
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{selectedBudget.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Información del Presupuesto
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Tratamiento</p>
                      <p className="font-semibold text-gray-900">{selectedBudget.treatment}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <Euro className="h-4 w-4 text-green-600 mb-1" />
                        <p className="text-xs text-gray-500">Importe</p>
                        <p className="text-lg font-bold text-green-700">€{selectedBudget.amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600 mb-1" />
                        <p className="text-xs text-gray-500">Fecha</p>
                        <p className="text-sm font-medium">{new Date(selectedBudget.date).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profesional Asignado
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedBudget.professional}</p>
                    <p className="text-sm text-gray-600">Doctor especialista</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedBudget.priority)}`}>
                      Prioridad: {getPriorityText(selectedBudget.priority)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Estados</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-600">Creado como pendiente</span>
                    <span className="ml-auto text-gray-500">{new Date(selectedBudget.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-gray-600">Estado actual: En proceso</span>
                    <span className="ml-auto text-gray-500">Hoy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {showEditModal && editingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Editar Presupuesto</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Paciente
                  </label>
                  <input
                    type="text"
                    value={editingBudget.patient}
                    onChange={(e) => setEditingBudget({...editingBudget, patient: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesional
                  </label>
                  <input
                    type="text"
                    value={editingBudget.professional}
                    onChange={(e) => setEditingBudget({...editingBudget, professional: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento
                </label>
                <input
                  type="text"
                  value={editingBudget.treatment}
                  onChange={(e) => setEditingBudget({...editingBudget, treatment: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importe (€)
                  </label>
                  <input
                    type="number"
                    value={editingBudget.amount}
                    onChange={(e) => setEditingBudget({...editingBudget, amount: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={editingBudget.date}
                    onChange={(e) => setEditingBudget({...editingBudget, date: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={editingBudget.priority}
                    onChange={(e) => setEditingBudget({...editingBudget, priority: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={editingBudget.phone}
                    onChange={(e) => setEditingBudget({...editingBudget, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingBudget.email}
                    onChange={(e) => setEditingBudget({...editingBudget, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveBudget}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresupuestosPipeline;