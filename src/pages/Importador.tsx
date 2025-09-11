import React, { useState, useContext } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, RefreshCw, User, FileSpreadsheet, FolderOpen } from 'lucide-react';
import { DarkModeContext } from '../contexts/DarkModeContext';

interface ImportStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface ValidationError {
  row: number;
  column: string;
  error: string;
  value: string;
}

interface ImportResult {
  total: number;
  imported: number;
  errors: number;
  warnings: number;
}

const Importador: React.FC = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [importType, setImportType] = useState<'pacientes' | 'presupuestos' | 'documentos'>('pacientes');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const steps: ImportStep[] = [
    { id: 1, title: 'Seleccionar Tipo', description: 'Elige qué datos importar', completed: importType !== '', active: currentStep === 1 },
    { id: 2, title: 'Cargar Archivo', description: 'Sube tu archivo CSV/Excel', completed: file !== null, active: currentStep === 2 },
    { id: 3, title: 'Validar Datos', description: 'Revisa errores y advertencias', completed: validationErrors.length === 0 && file !== null, active: currentStep === 3 },
    { id: 4, title: 'Importar', description: 'Confirma e importa los datos', completed: importResult !== null, active: currentStep === 4 }
  ];

  const sampleData = {
    pacientes: [
      { nombre: 'Juan', apellidos: 'Pérez García', email: 'juan@email.com', telefono: '666123456', fechaNacimiento: '1980-05-15' },
      { nombre: 'María', apellidos: 'López Ruiz', email: 'maria@email.com', telefono: '666234567', fechaNacimiento: '1975-12-20' },
      { nombre: 'Carlos', apellidos: 'Sánchez Martín', email: 'carlos@email.com', telefono: '666345678', fechaNacimiento: '1990-08-10' }
    ],
    presupuestos: [
      { pacienteEmail: 'juan@email.com', tratamiento: 'Limpieza dental', precio: 50, fecha: '2024-01-15', estado: 'aceptado' },
      { pacienteEmail: 'maria@email.com', tratamiento: 'Empaste composite', precio: 80, fecha: '2024-01-16', estado: 'pendiente' },
      { pacienteEmail: 'carlos@email.com', tratamiento: 'Corona porcelana', precio: 450, fecha: '2024-01-17', estado: 'enviado' }
    ],
    documentos: [
      { pacienteEmail: 'juan@email.com', tipo: 'consentimiento', nombre: 'Consentimiento Limpieza.pdf', fecha: '2024-01-15' },
      { pacienteEmail: 'maria@email.com', tipo: 'radiografia', nombre: 'RX_Panoramica.jpg', fecha: '2024-01-16' },
      { pacienteEmail: 'carlos@email.com', tipo: 'informe', nombre: 'Informe_Tratamiento.pdf', fecha: '2024-01-17' }
    ]
  };

  const requiredFields = {
    pacientes: ['nombre', 'apellidos', 'email', 'telefono'],
    presupuestos: ['pacienteEmail', 'tratamiento', 'precio'],
    documentos: ['pacienteEmail', 'tipo', 'nombre']
  };

  const optionalFields = {
    pacientes: ['fechaNacimiento', 'direccion', 'dni', 'observaciones'],
    presupuestos: ['fecha', 'estado', 'observaciones', 'descuento'],
    documentos: ['fecha', 'descripcion', 'categoria']
  };

  const mockValidationErrors: ValidationError[] = [
    { row: 5, column: 'email', error: 'Email inválido', value: 'email_incorrecto' },
    { row: 8, column: 'telefono', error: 'Formato de teléfono incorrecto', value: '123abc' },
    { row: 12, column: 'fechaNacimiento', error: 'Fecha inválida', value: '32/13/2020' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setCurrentStep(3);
      // Simular validación
      setTimeout(() => {
        setValidationErrors(mockValidationErrors);
      }, 1500);
    }
  };

  const handleValidate = () => {
    setIsProcessing(true);
    // Simular validación
    setTimeout(() => {
      setIsProcessing(false);
      if (validationErrors.length === 0) {
        setCurrentStep(4);
      }
    }, 2000);
  };

  const handleImport = () => {
    setIsProcessing(true);
    // Simular importación
    setTimeout(() => {
      setIsProcessing(false);
      setImportResult({
        total: 100,
        imported: 95,
        errors: 3,
        warnings: 2
      });
    }, 3000);
  };

  const downloadTemplate = () => {
    console.log(`Descargando plantilla para ${importType}`);
  };

  const getStepIcon = (step: ImportStep) => {
    if (step.completed) return <CheckCircle className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />;
    if (step.active) return <div className={`h-6 w-6 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>;
    return <div className={`h-6 w-6 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>;
  };

  const getImportTypeIcon = (type: string) => {
    switch (type) {
      case 'pacientes': return <User className="h-6 w-6" />;
      case 'presupuestos': return <FileText className="h-6 w-6" />;
      case 'documentos': return <FolderOpen className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-700/50 shadow-xl shadow-blue-900/20' 
            : 'bg-gradient-to-r from-white/80 to-blue-50/80 border-blue-200/50 shadow-xl shadow-blue-200/20'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Importador de Datos
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            Wizard para importar pacientes, presupuestos y documentos desde CSV/Excel
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-xl shadow-gray-900/20' 
            : 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/50 shadow-xl shadow-gray-200/20'
        }`}>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-4 transition-all duration-300 ${
                  step.active 
                    ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                    : step.completed 
                      ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    step.active 
                      ? isDarkMode ? 'bg-blue-900/50 ring-2 ring-blue-400/50' : 'bg-blue-100 ring-2 ring-blue-500/50'
                      : step.completed
                        ? isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                        : isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                  }`}>
                    {getStepIcon(step)}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-6 rounded-full transition-all duration-300 ${
                    step.completed 
                      ? isDarkMode ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-green-500 to-green-600'
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-xl shadow-gray-900/20' 
          : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 shadow-xl shadow-gray-200/20'
      }`}>
        {/* Step 1: Seleccionar Tipo */}
        {currentStep === 1 && (
          <div className="p-8">
            <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ¿Qué datos deseas importar?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(['pacientes', 'presupuestos', 'documentos'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setImportType(type);
                    setCurrentStep(2);
                  }}
                  className={`group p-8 border-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    importType === type 
                      ? isDarkMode 
                        ? 'border-blue-400 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 shadow-xl shadow-blue-900/30' 
                        : 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-200/30'
                      : isDarkMode
                        ? 'border-gray-600 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-500 hover:from-gray-700/40 hover:to-gray-800/40'
                        : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-gray-300 hover:from-gray-50 hover:to-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                      importType === type 
                        ? isDarkMode ? 'bg-blue-800/50 text-blue-300' : 'bg-blue-100 text-blue-600'
                        : isDarkMode ? 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      {getImportTypeIcon(type)}
                    </div>
                    <div className="text-center">
                      <h3 className={`font-bold text-lg capitalize mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {type}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {type === 'pacientes' && 'Importar información de pacientes'}
                        {type === 'presupuestos' && 'Importar presupuestos y tratamientos'}
                        {type === 'documentos' && 'Importar referencias a documentos'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className={`mt-8 p-6 rounded-2xl border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700/50' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50'
            }`}>
              <h4 className={`font-bold text-lg mb-4 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                Información sobre {importType}
              </h4>
              <div className={`text-sm space-y-3 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-800'
              }`}>
                <p>
                  <strong className={isDarkMode ? 'text-blue-100' : 'text-blue-900'}>
                    Campos obligatorios:
                  </strong>{' '}
                  {requiredFields[importType].join(', ')}
                </p>
                <p>
                  <strong className={isDarkMode ? 'text-blue-100' : 'text-blue-900'}>
                    Campos opcionales:
                  </strong>{' '}
                  {optionalFields[importType].join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Cargar Archivo */}
        {currentStep === 2 && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Cargar archivo de {importType}
              </h2>
              <button
                onClick={downloadTemplate}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-200/30'
                }`}
              >
                <Download className="h-5 w-5 mr-2" />
                Descargar Plantilla
              </button>
            </div>

            {/* Upload Area */}
            <div className={`group border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isDarkMode 
                ? 'border-gray-600 bg-gradient-to-br from-gray-800/20 to-gray-900/20 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-900/20 hover:to-indigo-900/20' 
                : 'border-gray-300 bg-gradient-to-br from-gray-50/50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50'
            }`}>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-6">
                  <div className={`p-6 rounded-full transition-all duration-300 group-hover:scale-110 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 group-hover:from-blue-800/60 group-hover:to-indigo-800/60' 
                      : 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                  }`}>
                    <Upload className={`h-16 w-16 transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
                    }`} />
                  </div>
                  <div className="space-y-2">
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Arrastra tu archivo aquí
                    </p>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      o haz clic para seleccionar
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} bg-opacity-80 rounded-lg px-4 py-2 inline-block ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      Formatos admitidos: CSV, Excel (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {file && (
              <div className={`mt-8 p-6 rounded-2xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
                  }`}>
                    <FileSpreadsheet className={`h-10 w-10 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB - {file.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Data Preview */}
            <div className="mt-8">
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Ejemplo de datos para {importType}
              </h3>
              <div className={`rounded-2xl p-6 border overflow-x-auto transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50' 
                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-200/50'
              }`}>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={`border-b-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      {Object.keys(sampleData[importType][0]).map(key => (
                        <th key={key} className={`text-left py-4 px-6 font-bold capitalize ${
                          isDarkMode ? 'text-blue-300' : 'text-blue-700'
                        }`}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData[importType].map((row, index) => (
                      <tr key={index} className={`border-b transition-colors duration-200 hover:bg-opacity-50 ${
                        isDarkMode 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className={`py-4 px-6 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Validar Datos */}
        {currentStep === 3 && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Validación de datos
              </h2>
              <button
                onClick={handleValidate}
                disabled={isProcessing}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center disabled:opacity-50 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
                }`}
              >
                {isProcessing ? (
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                {isProcessing ? 'Validando...' : 'Revalidar'}
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-900/40 to-indigo-800/40 border-blue-700/50 shadow-blue-900/20' 
                  : 'bg-gradient-to-br from-blue-50 to-indigo-100/50 border-blue-200/50 shadow-blue-200/20'
              }`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100'
                  }`}>
                    <FileText className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Total Registros
                    </p>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      100
                    </p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-700/50 shadow-green-900/20' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-200/50 shadow-green-200/20'
              }`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
                  }`}>
                    <CheckCircle className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                      Válidos
                    </p>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                      97
                    </p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/40 to-pink-800/40 border-red-700/50 shadow-red-900/20' 
                  : 'bg-gradient-to-br from-red-50 to-pink-100/50 border-red-200/50 shadow-red-200/20'
              }`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    isDarkMode ? 'bg-red-800/50' : 'bg-red-100'
                  }`}>
                    <AlertCircle className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                      Errores
                    </p>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-red-900'}`}>
                      3
                    </p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-yellow-900/40 to-orange-800/40 border-yellow-700/50 shadow-yellow-900/20' 
                  : 'bg-gradient-to-br from-yellow-50 to-orange-100/50 border-yellow-200/50 shadow-yellow-200/20'
              }`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100'
                  }`}>
                    <AlertCircle className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                      Advertencias
                    </p>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-yellow-900'}`}>
                      2
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className={`rounded-2xl p-6 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/30 to-pink-900/30 border-red-700/50' 
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-red-300' : 'text-red-900'
                }`}>
                  Errores encontrados
                </h3>
                <div className="space-y-4">
                  {validationErrors.map((error, index) => (
                    <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-red-800/30 to-pink-800/30 border-red-600/50' 
                        : 'bg-gradient-to-r from-white to-red-50/50 border-red-200'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-red-800/50' : 'bg-red-100'
                      }`}>
                        <AlertCircle className={`h-5 w-5 ${
                          isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${
                          isDarkMode ? 'text-white' : 'text-red-900'
                        }`}>
                          Fila {error.row}, Columna "{error.column}"
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-red-200' : 'text-red-700'
                        }`}>
                          {error.error}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          Valor: "{error.value}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validationErrors.length === 0 && !isProcessing && (
              <div className={`rounded-2xl p-8 text-center border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
              }`}>
                <div className={`p-4 rounded-full inline-block mb-6 ${
                  isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
                }`}>
                  <CheckCircle className={`h-16 w-16 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-green-900'
                }`}>
                  ¡Validación exitosa!
                </h3>
                <p className={`text-lg mb-6 ${
                  isDarkMode ? 'text-green-200' : 'text-green-700'
                }`}>
                  Todos los datos son válidos y están listos para importar.
                </p>
                <button
                  onClick={() => setCurrentStep(4)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-200/30'
                  }`}
                >
                  Continuar a Importación
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Importar */}
        {currentStep === 4 && (
          <div className="p-8">
            <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Importar datos
            </h2>

            {!importResult ? (
              <div className="text-center py-12">
                <div className="mb-8">
                  <div className={`p-6 rounded-full inline-block mb-6 ${
                    isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                  }`}>
                    <FileText className={`h-20 w-20 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ¿Confirmas la importación de {importType}?
                  </h3>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Se van a importar 97 registros válidos. Esta acción no se puede deshacer.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className={`px-8 py-4 border-2 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center disabled:opacity-50 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
                    }`}
                  >
                    {isProcessing ? (
                      <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6 mr-3" />
                    )}
                    {isProcessing ? 'Importando...' : 'Confirmar Importación'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={`p-6 rounded-full inline-block mb-6 ${
                  isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <CheckCircle className={`h-20 w-20 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <h3 className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ¡Importación completada!
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                  <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50' 
                      : 'bg-gradient-to-br from-gray-50 to-white border-gray-200/50'
                  }`}>
                    <p className={`text-3xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {importResult.total}
                    </p>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total
                    </p>
                  </div>
                  <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-700/50' 
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
                  }`}>
                    <p className={`text-3xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-green-900'
                    }`}>
                      {importResult.imported}
                    </p>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      Importados
                    </p>
                  </div>
                  <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-700/50' 
                      : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50'
                  }`}>
                    <p className={`text-3xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-red-900'
                    }`}>
                      {importResult.errors}
                    </p>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-red-300' : 'text-red-600'
                    }`}>
                      Errores
                    </p>
                  </div>
                  <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-700/50' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50'
                  }`}>
                    <p className={`text-3xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-yellow-900'
                    }`}>
                      {importResult.warnings}
                    </p>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                    }`}>
                      Advertencias
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setFile(null);
                      setImportResult(null);
                      setValidationErrors([]);
                    }}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
                    }`}
                  >
                    Nueva Importación
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Importador;