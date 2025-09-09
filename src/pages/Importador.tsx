import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, RefreshCw, User, FileSpreadsheet, FolderOpen } from 'lucide-react';

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
    if (step.completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (step.active) return <div className="h-5 w-5 bg-blue-600 rounded-full"></div>;
    return <div className="h-5 w-5 bg-gray-300 rounded-full"></div>;
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Importador de Datos</h1>
        <p className="text-gray-600">Wizard para importar pacientes, presupuestos y documentos desde CSV/Excel</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center space-x-3 ${step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                {getStepIcon(step)}
                <div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Step 1: Seleccionar Tipo */}
        {currentStep === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">¿Qué datos deseas importar?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['pacientes', 'presupuestos', 'documentos'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setImportType(type);
                    setCurrentStep(2);
                  }}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    importType === type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-lg ${
                      importType === type ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getImportTypeIcon(type)}
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-gray-900 capitalize">{type}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {type === 'pacientes' && 'Importar información de pacientes'}
                        {type === 'presupuestos' && 'Importar presupuestos y tratamientos'}
                        {type === 'documentos' && 'Importar referencias a documentos'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Información sobre {importType}</h4>
              <div className="text-sm text-blue-800">
                <p className="mb-2">
                  <strong>Campos obligatorios:</strong> {requiredFields[importType].join(', ')}
                </p>
                <p>
                  <strong>Campos opcionales:</strong> {optionalFields[importType].join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Cargar Archivo */}
        {currentStep === 2 && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cargar archivo de {importType}</h2>
              <button
                onClick={downloadTemplate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Plantilla
              </button>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Arrastra tu archivo aquí</p>
                    <p className="text-gray-500">o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-400 mt-2">Formatos admitidos: CSV, Excel (.xlsx, .xls)</p>
                  </div>
                </div>
              </label>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB - {file.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Data Preview */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ejemplo de datos para {importType}</h3>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {Object.keys(sampleData[importType][0]).map(key => (
                        <th key={key} className="text-left py-2 px-4 font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData[importType].map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-4 text-gray-600">
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
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Validación de datos</h2>
              <button
                onClick={handleValidate}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Validando...' : 'Revalidar'}
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-600">Total Registros</p>
                    <p className="text-2xl font-bold text-blue-900">100</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-green-600">Válidos</p>
                    <p className="text-2xl font-bold text-green-900">97</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-red-600">Errores</p>
                    <p className="text-2xl font-bold text-red-900">3</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-yellow-600">Advertencias</p>
                    <p className="text-2xl font-bold text-yellow-900">2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-red-900 mb-4">Errores encontrados</h3>
                <div className="space-y-3">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded border border-red-200">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          Fila {error.row}, Columna "{error.column}"
                        </p>
                        <p className="text-sm text-red-700">{error.error}</p>
                        <p className="text-xs text-red-600 mt-1">Valor: "{error.value}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validationErrors.length === 0 && !isProcessing && (
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-900 mb-2">¡Validación exitosa!</h3>
                <p className="text-green-700">Todos los datos son válidos y están listos para importar.</p>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Continuar a Importación
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Importar */}
        {currentStep === 4 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Importar datos</h2>

            {!importResult ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ¿Confirmas la importación de {importType}?
                  </h3>
                  <p className="text-gray-600">
                    Se van a importar 97 registros válidos. Esta acción no se puede deshacer.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Importando...' : 'Confirmar Importación'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-4">¡Importación completada!</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{importResult.total}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-900">{importResult.imported}</p>
                    <p className="text-sm text-green-600">Importados</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-red-900">{importResult.errors}</p>
                    <p className="text-sm text-red-600">Errores</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-900">{importResult.warnings}</p>
                    <p className="text-sm text-yellow-600">Advertencias</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setFile(null);
                      setImportResult(null);
                      setValidationErrors([]);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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