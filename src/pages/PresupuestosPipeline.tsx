import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FileText, Plus, Euro, Calendar, User, Phone, Mail } from 'lucide-react';

const PresupuestosPipeline = () => {
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
    { id: 'pendiente', title: 'Pendiente', color: 'bg-yellow-100 border-yellow-300', headerColor: 'bg-yellow-50' },
    { id: 'presentado', title: 'Presentado', color: 'bg-blue-100 border-blue-300', headerColor: 'bg-blue-50' },
    { id: 'aceptado', title: 'Aceptado', color: 'bg-green-100 border-green-300', headerColor: 'bg-green-50' },
    { id: 'perdido', title: 'Perdido', color: 'bg-red-100 border-red-300', headerColor: 'bg-red-50' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pipeline de Presupuestos</h1>
            <p className="text-gray-600">Seguimiento del estado de presupuestos</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Presupuesto
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {columns.map((column) => (
            <div key={column.id} className={`${column.headerColor} border border-gray-200 rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{column.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {presupuestos[column.id as keyof typeof presupuestos].length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    €{getTotalAmount(column.id).toLocaleString()}
                  </p>
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
            <div key={column.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className={`${column.headerColor} px-4 py-3 border-b border-gray-200`}>
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <p className="text-sm text-gray-600">
                  {presupuestos[column.id as keyof typeof presupuestos].length} presupuestos
                </p>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-96 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                  >
                    <div className="space-y-3">
                      {presupuestos[column.id as keyof typeof presupuestos].map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${column.color} border rounded-lg p-4 cursor-pointer transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900 text-sm">{item.patient}</h4>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                  {getPriorityText(item.priority)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-3">{item.treatment}</p>
                              
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Euro className="h-4 w-4 mr-1" />
                                  <span className="font-semibold">€{item.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(item.date).toLocaleDateString('es-ES')}
                                </div>
                              </div>
                              
                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <User className="h-3 w-3 mr-1" />
                                {item.professional}
                              </div>
                              
                              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Phone className="h-4 w-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-800">
                                    <Mail className="h-4 w-4" />
                                  </button>
                                </div>
                                <button className="text-xs text-gray-600 hover:text-gray-800">
                                  Ver detalles
                                </button>
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
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas del Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tasa de Conversión</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Presentado → Aceptado</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Valor Total Pipeline</h4>
            <p className="text-2xl font-bold text-gray-900">
              €{Object.values(presupuestos).flat().reduce((total, item) => total + item.amount, 0).toLocaleString()}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tiempo Promedio</h4>
            <p className="text-sm text-gray-600">Pendiente → Aceptado</p>
            <p className="text-xl font-semibold text-gray-900">12 días</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresupuestosPipeline;