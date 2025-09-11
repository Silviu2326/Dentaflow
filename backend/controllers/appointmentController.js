const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Crear nueva cita
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const {
      paciente, pacienteNombre, pacienteTelefono, pacienteEmail,
      fecha, horaInicio, duracion, tratamiento, profesional,
      sede, notas, prioridad, origen, salaAsignada
    } = req.body;

    // Calcular hora fin
    const [hora, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = hora * 60 + minutos + duracion;
    const horaFin = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;

    // Verificar disponibilidad
    const disponible = await Appointment.verificarDisponibilidad(
      fecha, horaInicio, horaFin, profesional, sede
    );

    if (!disponible) {
      return res.status(400).json({
        success: false,
        message: 'El horario seleccionado no está disponible'
      });
    }

    // Obtener nombre del profesional
    const profesionalDoc = await User.findById(profesional);
    if (!profesionalDoc) {
      return res.status(404).json({
        success: false,
        message: 'Profesional no encontrado'
      });
    }

    // Crear cita
    const appointment = await Appointment.create({
      paciente,
      pacienteNombre,
      pacienteTelefono,
      pacienteEmail,
      fecha,
      horaInicio,
      horaFin,
      duracion,
      tratamiento,
      profesional,
      profesionalNombre: profesionalDoc.nombreCompleto,
      sede,
      notas,
      prioridad: prioridad || 'normal',
      origen: origen || 'presencial',
      salaAsignada,
      creadoPor: req.user.id,
      estado: 'pendiente'
    });

    // Poblar referencias
    await appointment.populate('profesional', 'nombre apellidos especialidad');
    
    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error en createAppointment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todas las citas
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const {
      fecha, sede, profesional, estado, paciente,
      page = 1, limit = 50
    } = req.query;

    // Construir filtros
    const filters = {};

    if (fecha) {
      const inicioDelDia = new Date(fecha);
      inicioDelDia.setHours(0, 0, 0, 0);
      const finDelDia = new Date(fecha);
      finDelDia.setHours(23, 59, 59, 999);
      
      filters.fecha = {
        $gte: inicioDelDia,
        $lte: finDelDia
      };
    }

    if (sede) filters.sede = sede;
    if (profesional) filters.profesional = profesional;
    if (estado) filters.estado = estado;
    if (paciente) filters.paciente = paciente;

    // Filtrar por sede si el usuario tiene sede específica
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filters.sede = req.user.sede;
    }

    // Ejecutar consulta
    const appointments = await Appointment.find(filters)
      .populate('paciente', 'nombre apellidos telefono email')
      .populate('profesional', 'nombre apellidos especialidad')
      .populate('creadoPor', 'nombre apellidos')
      .sort({ fecha: 1, horaInicio: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error en getAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener cita por ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('paciente', 'nombre apellidos telefono email')
      .populate('profesional', 'nombre apellidos especialidad')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('historialCambios.realizadoPor', 'nombre apellidos');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (appointment.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a esta cita'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error en getAppointmentById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar cita
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const {
      fecha, horaInicio, duracion, tratamiento, profesional,
      sede, notas, prioridad, salaAsignada, estado
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (appointment.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar esta cita'
        });
      }
    }

    // Si se cambian fecha/hora/profesional, verificar disponibilidad
    if (fecha || horaInicio || duracion || profesional) {
      const nuevaFecha = fecha || appointment.fecha;
      const nuevaHoraInicio = horaInicio || appointment.horaInicio;
      const nuevaDuracion = duracion || appointment.duracion;
      const nuevoProfesional = profesional || appointment.profesional;
      const nuevaSede = sede || appointment.sede;

      // Calcular nueva hora fin
      const [hora, minutos] = nuevaHoraInicio.split(':').map(Number);
      const totalMinutos = hora * 60 + minutos + nuevaDuracion;
      const nuevaHoraFin = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;

      const disponible = await Appointment.verificarDisponibilidad(
        nuevaFecha, nuevaHoraInicio, nuevaHoraFin, 
        nuevoProfesional, nuevaSede, appointment._id
      );

      if (!disponible) {
        return res.status(400).json({
          success: false,
          message: 'El nuevo horario no está disponible'
        });
      }
    }

    // Registrar cambio en historial
    const cambios = [];
    if (fecha && fecha !== appointment.fecha) cambios.push('fecha');
    if (horaInicio && horaInicio !== appointment.horaInicio) cambios.push('hora');
    if (tratamiento && tratamiento !== appointment.tratamiento) cambios.push('tratamiento');
    if (profesional && profesional !== appointment.profesional) cambios.push('profesional');
    if (estado && estado !== appointment.estado) cambios.push('estado');

    if (cambios.length > 0) {
      appointment.historialCambios.push({
        cambio: `Modificado: ${cambios.join(', ')}`,
        realizadoPor: req.user.id
      });
    }

    // Actualizar campos
    if (fecha) appointment.fecha = fecha;
    if (horaInicio) appointment.horaInicio = horaInicio;
    if (duracion) appointment.duracion = duracion;
    if (tratamiento) appointment.tratamiento = tratamiento;
    if (profesional) {
      appointment.profesional = profesional;
      const profesionalDoc = await User.findById(profesional);
      if (profesionalDoc) {
        appointment.profesionalNombre = profesionalDoc.nombreCompleto;
      }
    }
    if (sede) appointment.sede = sede;
    if (notas !== undefined) appointment.notas = notas;
    if (prioridad) appointment.prioridad = prioridad;
    if (salaAsignada) appointment.salaAsignada = salaAsignada;
    if (estado) appointment.estado = estado;

    appointment.actualizadoPor = req.user.id;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error en updateAppointment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancelar cita
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const { motivo } = req.body;

    if (!motivo) {
      return res.status(400).json({
        success: false,
        message: 'El motivo de cancelación es obligatorio'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (appointment.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para cancelar esta cita'
        });
      }
    }

    await appointment.cancelar(motivo, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Cita cancelada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error en cancelAppointment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirmar cita
// @route   PUT /api/appointments/:id/confirm
// @access  Private
const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    await appointment.confirmar(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Cita confirmada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error en confirmAppointment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Marcar llegada del paciente
// @route   PUT /api/appointments/:id/checkin
// @access  Private
const checkinAppointment = async (req, res) => {
  try {
    const { horaLlegada } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    await appointment.marcarLlegada(horaLlegada);

    res.status(200).json({
      success: true,
      message: 'Llegada del paciente registrada',
      data: appointment
    });

  } catch (error) {
    console.error('Error en checkinAppointment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener citas del día
// @route   GET /api/appointments/today
// @access  Private
const getTodayAppointments = async (req, res) => {
  try {
    const { sede, profesional } = req.query;
    const hoy = new Date();

    // Filtrar por sede del usuario si corresponde
    let filtroSede = sede;
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtroSede = req.user.sede;
    }

    const appointments = await Appointment.obtenerCitasDelDia(
      hoy, filtroSede, profesional
    );

    res.status(200).json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error('Error en getTodayAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener disponibilidad
// @route   GET /api/appointments/availability
// @access  Private
const getAvailability = async (req, res) => {
  try {
    const { fecha, profesional, sede, duracion = 60 } = req.query;

    if (!fecha || !profesional || !sede) {
      return res.status(400).json({
        success: false,
        message: 'Fecha, profesional y sede son obligatorios'
      });
    }

    // Obtener citas del día
    const citas = await Appointment.find({
      fecha: new Date(fecha),
      profesional,
      sede,
      estado: { $nin: ['cancelada', 'no_asistio'] }
    }).sort({ horaInicio: 1 });

    // Generar slots disponibles (8:00 - 20:00)
    const slotsDisponibles = [];
    const horaInicio = 8;
    const horaFin = 20;
    const intervalo = 30; // intervalos de 30 minutos

    for (let hora = horaInicio * 60; hora < horaFin * 60; hora += intervalo) {
      const horaSlot = Math.floor(hora / 60);
      const minutosSlot = hora % 60;
      const slot = `${String(horaSlot).padStart(2, '0')}:${String(minutosSlot).padStart(2, '0')}`;
      
      // Calcular fin del slot
      const finSlot = hora + duracion;
      const horaFinSlot = Math.floor(finSlot / 60);
      const minutosFinSlot = finSlot % 60;
      const slotFin = `${String(horaFinSlot).padStart(2, '0')}:${String(minutosFinSlot).padStart(2, '0')}`;

      // Verificar si el slot está disponible
      const ocupado = citas.some(cita => {
        const [citaHoraInicio, citaMinutosInicio] = cita.horaInicio.split(':').map(Number);
        const [citaHoraFin, citaMinutosFin] = cita.horaFin.split(':').map(Number);
        const citaInicio = citaHoraInicio * 60 + citaMinutosInicio;
        const citaFin = citaHoraFin * 60 + citaMinutosFin;

        return (hora < citaFin && finSlot > citaInicio);
      });

      if (!ocupado && finSlot <= horaFin * 60) {
        slotsDisponibles.push({
          hora: slot,
          horaFin: slotFin,
          disponible: true
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        fecha,
        profesional,
        sede,
        slotsDisponibles,
        citasExistentes: citas.map(c => ({
          id: c._id,
          horaInicio: c.horaInicio,
          horaFin: c.horaFin,
          paciente: c.pacienteNombre
        }))
      }
    });

  } catch (error) {
    console.error('Error en getAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar cita
// @route   DELETE /api/appointments/:id
// @access  Private (Solo owner y admin_sede)
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'owner' && req.user.role !== 'admin_sede') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar citas'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Cita eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  checkinAppointment,
  getTodayAppointments,
  getAvailability,
  deleteAppointment
};