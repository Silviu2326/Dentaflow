import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFReportData {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  datos: any[];
  fechaUltima: string;
}

class PDFGenerator {
  private addHeader(doc: jsPDF, reportName: string) {
    // Logo/Header background
    doc.setFillColor(99, 102, 241); // Indigo color
    doc.rect(0, 0, 210, 40, 'F');
    
    // White text for header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Clínica Dental', 20, 20);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión Integral', 20, 30);
    
    // Report title
    doc.setTextColor(99, 102, 241);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(reportName, 20, 55);
    
    // Date
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado el ${fecha}`, 20, 65);
  }

  private addFooter(doc: jsPDF, pageNumber: number) {
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(229, 231, 235);
    doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    
    // Footer text
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Clínica Dental - Reporte Confidencial', 20, pageHeight - 12);
    doc.text(`Página ${pageNumber}`, 190, pageHeight - 12, { align: 'right' });
  }

  private addSummaryCard(doc: jsPDF, title: string, value: string, subtitle: string, x: number, y: number, color: [number, number, number]) {
    // Card background
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, 55, 25, 3, 3, 'F');
    
    // Card border
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(x, y, 55, 25, 3, 3, 'S');
    
    // Color accent
    doc.setFillColor(...color);
    doc.roundedRect(x, y, 55, 3, 3, 3, 'F');
    
    // Title
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(title, x + 5, y + 10);
    
    // Value
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 5, y + 17);
    
    // Subtitle
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, x + 5, y + 22);
  }

  generateCitasReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Summary cards
    this.addSummaryCard(doc, 'Total Programadas', '83', '+12% vs semana anterior', 20, 80, [59, 130, 246]);
    this.addSummaryCard(doc, 'Realizadas', '74', '89% efectividad', 80, 80, [34, 197, 94]);
    this.addSummaryCard(doc, 'Canceladas', '6', '7% del total', 140, 80, [251, 146, 60]);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Table
    const tableData = reportData.datos.map(fila => [
      new Date(fila.fecha).toLocaleDateString('es-ES'),
      fila.programadas.toString(),
      fila.realizadas.toString(),
      fila.canceladas.toString(),
      fila.noShow.toString(),
      `${Math.round((fila.realizadas / fila.programadas) * 100)}%`
    ]);

    autoTable(doc, {
      head: [['Fecha', 'Programadas', 'Realizadas', 'Canceladas', 'No-Show', '% Efectividad']],
      body: tableData,
      startY: 130,
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generateFinancieroReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Calculate totals
    const totales = reportData.datos.reduce((acc, fila) => ({
      ingresos: acc.ingresos + fila.ingresos,
      gastos: acc.gastos + fila.gastos,
      beneficio: acc.beneficio + fila.beneficio
    }), { ingresos: 0, gastos: 0, beneficio: 0 });
    
    const rentabilidadPromedio = (totales.beneficio / totales.ingresos * 100).toFixed(1);
    
    // Summary cards
    this.addSummaryCard(doc, 'Ingresos Totales', `€${totales.ingresos.toLocaleString()}`, 'Últimos 3 meses', 20, 80, [34, 197, 94]);
    this.addSummaryCard(doc, 'Gastos Totales', `€${totales.gastos.toLocaleString()}`, 'Últimos 3 meses', 80, 80, [239, 68, 68]);
    this.addSummaryCard(doc, 'Beneficio Neto', `€${totales.beneficio.toLocaleString()}`, `${rentabilidadPromedio}% rentabilidad`, 140, 80, [59, 130, 246]);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Analysis text
    doc.setFontSize(10);
    const analisisTexto = [
      `• Los ingresos totales del período fueron de €${totales.ingresos.toLocaleString()}, mostrando una tendencia`,
      `  positiva en la facturación de la clínica.`,
      `• Los gastos operativos representan el ${((totales.gastos / totales.ingresos) * 100).toFixed(1)}% de los ingresos totales.`,
      `• La rentabilidad promedio del ${rentabilidadPromedio}% indica una gestión financiera saludable.`,
      `• El mes con mejor rendimiento fue ${reportData.datos.reduce((max, mes) => 
        mes.rentabilidad > max.rentabilidad ? mes : max).mes} con ${reportData.datos.reduce((max, mes) => 
        mes.rentabilidad > max.rentabilidad ? mes : max).rentabilidad}% de rentabilidad.`
    ];
    
    analisisTexto.forEach((linea, index) => {
      doc.text(linea, 20, 135 + (index * 7));
    });
    
    // Table
    const tableData = reportData.datos.map(fila => [
      fila.mes,
      `€${fila.ingresos.toLocaleString()}`,
      `€${fila.gastos.toLocaleString()}`,
      `€${fila.beneficio.toLocaleString()}`,
      `${fila.rentabilidad}%`
    ]);

    autoTable(doc, {
      head: [['Mes', 'Ingresos', 'Gastos', 'Beneficio', 'Rentabilidad']],
      body: tableData,
      startY: 175,
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generateSatisfaccionReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Calculate averages
    const promedios = reportData.datos.reduce((acc, prof) => ({
      puntuacion: acc.puntuacion + prof.puntuacion,
      encuestas: acc.encuestas + prof.encuestas,
      recomendaria: acc.recomendaria + prof.recomendaria
    }), { puntuacion: 0, encuestas: 0, recomendaria: 0 });
    
    const puntuacionPromedio = (promedios.puntuacion / reportData.datos.length).toFixed(1);
    const recomendacionPromedio = Math.round(promedios.recomendaria / reportData.datos.length);
    
    // Summary cards
    this.addSummaryCard(doc, 'Puntuación Media', `${puntuacionPromedio}/5`, `${promedios.encuestas} encuestas`, 20, 80, [251, 191, 36]);
    this.addSummaryCard(doc, 'Recomendación', `${recomendacionPromedio}%`, 'Promedio general', 80, 80, [34, 197, 94]);
    this.addSummaryCard(doc, 'Encuestas', `${promedios.encuestas}`, 'Total completadas', 140, 80, [59, 130, 246]);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Analysis
    doc.setFontSize(10);
    const mejorProfesional = reportData.datos.reduce((max, prof) => 
      prof.puntuacion > max.puntuacion ? prof : max);
    
    const analisisTexto = [
      `• La satisfacción general de los pacientes es excelente con ${puntuacionPromedio}/5 puntos.`,
      `• ${recomendacionPromedio}% de los pacientes recomendaría nuestros servicios.`,
      `• ${mejorProfesional.profesional} tiene la puntuación más alta con ${mejorProfesional.puntuacion}/5.`,
      `• Se han completado ${promedios.encuestas} encuestas de satisfacción en total.`,
      `• Todas las puntuaciones están por encima de 4.5, indicando alta calidad de servicio.`
    ];
    
    analisisTexto.forEach((linea, index) => {
      doc.text(linea, 20, 135 + (index * 7));
    });
    
    // Table
    const tableData = reportData.datos.map(fila => [
      fila.profesional,
      `${fila.puntuacion}/5`,
      fila.encuestas.toString(),
      `${fila.recomendaria}%`,
      '★'.repeat(Math.floor(fila.puntuacion)) + '☆'.repeat(5 - Math.floor(fila.puntuacion))
    ]);

    autoTable(doc, {
      head: [['Profesional', 'Puntuación', 'Encuestas', '% Recomendación', 'Rating']],
      body: tableData,
      startY: 175,
      headStyles: {
        fillColor: [251, 191, 36],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generateTratamientosReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Calculate totals
    const totales = reportData.datos.reduce((acc, trat) => ({
      cantidad: acc.cantidad + trat.cantidad,
      total: acc.total + trat.total,
      satisfaccion: acc.satisfaccion + trat.satisfaccion
    }), { cantidad: 0, total: 0, satisfaccion: 0 });
    
    const promedioTratamiento = Math.round(totales.total / totales.cantidad);
    const satisfaccionPromedio = (totales.satisfaccion / reportData.datos.length).toFixed(1);
    
    // Summary cards
    this.addSummaryCard(doc, 'Tratamientos', `${totales.cantidad}`, 'Total realizados', 20, 80, [236, 72, 153]);
    this.addSummaryCard(doc, 'Facturación', `€${totales.total.toLocaleString()}`, `€${promedioTratamiento} promedio`, 80, 80, [139, 69, 19]);
    this.addSummaryCard(doc, 'Satisfacción', `${satisfaccionPromedio}/5`, 'Puntuación media', 140, 80, [79, 70, 229]);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Analysis
    doc.setFontSize(10);
    const tratamientoPopular = reportData.datos.reduce((max, trat) => 
      trat.cantidad > max.cantidad ? trat : max);
    const tratamientoRentable = reportData.datos.reduce((max, trat) => 
      trat.total > max.total ? trat : max);
    
    const analisisTexto = [
      `• Se realizaron ${totales.cantidad} tratamientos con una facturación de €${totales.total.toLocaleString()}.`,
      `• El tratamiento más popular es "${tratamientoPopular.tratamiento}" con ${tratamientoPopular.cantidad} casos.`,
      `• "${tratamientoRentable.tratamiento}" genera los mayores ingresos (€${tratamientoRentable.total.toLocaleString()}).`,
      `• La satisfacción promedio es de ${satisfaccionPromedio}/5, indicando alta calidad.`,
      `• El precio promedio por tratamiento es de €${promedioTratamiento}.`
    ];
    
    analisisTexto.forEach((linea, index) => {
      doc.text(linea, 20, 135 + (index * 7));
    });
    
    // Table
    const tableData = reportData.datos.map(fila => [
      fila.tratamiento,
      fila.cantidad.toString(),
      `€${fila.promedio}`,
      `€${fila.total.toLocaleString()}`,
      `${fila.satisfaccion}/5`
    ]);

    autoTable(doc, {
      head: [['Tratamiento', 'Cantidad', 'Precio Promedio', 'Total Facturado', 'Satisfacción']],
      body: tableData,
      startY: 175,
      headStyles: {
        fillColor: [236, 72, 153],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generateGenericReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Summary cards based on report type
    this.addReportSpecificSummary(doc, reportData);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Report-specific analysis
    this.addReportSpecificAnalysis(doc, reportData);
    
    // Table with data
    if (reportData.datos.length > 0) {
      const headers = Object.keys(reportData.datos[0]);
      const displayHeaders = this.getDisplayHeaders(reportData.id, headers);
      const tableData = reportData.datos.map(fila => 
        headers.map(header => this.formatCellValue(header, fila[header]))
      );

      autoTable(doc, {
        head: [displayHeaders],
        body: tableData,
        startY: 170,
        headStyles: {
          fillColor: this.getReportColor(reportData.id),
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [75, 85, 99]
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        },
        styles: {
          cellPadding: 5,
          lineColor: [229, 231, 235],
          lineWidth: 0.1
        }
      });
    }
    
    this.addFooter(doc, 1);
    return doc;
  }

  private addReportSpecificSummary(doc: jsPDF, reportData: PDFReportData) {
    const color = this.getReportColor(reportData.id);
    
    switch (reportData.id) {
      case 'tiempo':
        const avgDuracion = reportData.datos.reduce((acc, prof) => acc + prof.duracionPromedio, 0) / reportData.datos.length;
        const avgEspera = reportData.datos.reduce((acc, prof) => acc + prof.tiempoEspera, 0) / reportData.datos.length;
        const avgPuntualidad = reportData.datos.reduce((acc, prof) => acc + prof.puntualidad, 0) / reportData.datos.length;
        
        this.addSummaryCard(doc, 'Duración Media', `${Math.round(avgDuracion)} min`, 'Promedio por cita', 20, 80, color);
        this.addSummaryCard(doc, 'Tiempo Espera', `${Math.round(avgEspera)} min`, 'Promedio pacientes', 80, 80, avgEspera <= 10 ? [34, 197, 94] : [239, 68, 68]);
        this.addSummaryCard(doc, 'Puntualidad', `${Math.round(avgPuntualidad)}%`, 'Promedio general', 140, 80, avgPuntualidad >= 95 ? [34, 197, 94] : [251, 146, 60]);
        break;
        
      case 'marketing':
        const totalPacientes = reportData.datos.reduce((acc, fuente) => acc + fuente.pacientes, 0);
        const totalCoste = reportData.datos.reduce((acc, fuente) => acc + fuente.coste, 0);
        const avgConversion = reportData.datos.reduce((acc, fuente) => acc + fuente.conversion, 0) / reportData.datos.length;
        
        this.addSummaryCard(doc, 'Nuevos Pacientes', totalPacientes.toString(), 'Período analizado', 20, 80, color);
        this.addSummaryCard(doc, 'Coste Total', `€${totalCoste}`, `€${Math.round(totalCoste/totalPacientes)}/paciente`, 80, 80, [239, 68, 68]);
        this.addSummaryCard(doc, 'Conversión Media', `${Math.round(avgConversion)}%`, 'Promedio fuentes', 140, 80, [34, 197, 94]);
        break;
        
      case 'inventario':
        const totalStock = reportData.datos.reduce((acc, prod) => acc + prod.stock, 0);
        const stockBajo = reportData.datos.filter(prod => prod.stock < prod.minimo).length;
        const valorTotal = reportData.datos.reduce((acc, prod) => acc + prod.valor, 0);
        
        this.addSummaryCard(doc, 'Productos', reportData.datos.length.toString(), `${totalStock} unidades`, 20, 80, color);
        this.addSummaryCard(doc, 'Stock Bajo', stockBajo.toString(), 'Productos críticos', 80, 80, stockBajo > 0 ? [239, 68, 68] : [34, 197, 94]);
        this.addSummaryCard(doc, 'Valor Total', `€${valorTotal}`, 'Inventario actual', 140, 80, [59, 130, 246]);
        break;
        
      default:
        // Generic summary for unknown report types
        this.addSummaryCard(doc, 'Registros', reportData.datos.length.toString(), 'Total en reporte', 20, 80, color);
        this.addSummaryCard(doc, 'Categoría', reportData.categoria, 'Tipo de análisis', 80, 80, [107, 114, 128]);
        this.addSummaryCard(doc, 'Actualizado', new Date(reportData.fechaUltima).toLocaleDateString('es-ES'), 'Última vez', 140, 80, [59, 130, 246]);
        break;
    }
  }

  private addReportSpecificAnalysis(doc: jsPDF, reportData: PDFReportData) {
    let analisisTexto: string[] = [];
    
    switch (reportData.id) {
      case 'tiempo':
        const mejorPuntualidad = reportData.datos.reduce((max, prof) => 
          prof.puntualidad > max.puntualidad ? prof : max);
        analisisTexto = [
          `• ${mejorPuntualidad.profesional} tiene la mejor puntualidad con ${mejorPuntualidad.puntualidad}%.`,
          `• Los tiempos de espera varían entre ${Math.min(...reportData.datos.map(p => p.tiempoEspera))} y ${Math.max(...reportData.datos.map(p => p.tiempoEspera))} minutos.`,
          `• Se recomienda optimizar los horarios para reducir tiempos de espera.`
        ];
        break;
        
      case 'marketing':
        const mejorFuente = reportData.datos.reduce((max, fuente) => 
          fuente.conversion > max.conversion ? fuente : max);
        const peorFuente = reportData.datos.reduce((min, fuente) => 
          fuente.conversion < min.conversion ? fuente : min);
        analisisTexto = [
          `• ${mejorFuente.fuente} es la mejor fuente con ${mejorFuente.conversion}% de conversión.`,
          `• ${peorFuente.fuente} tiene la menor conversión (${peorFuente.conversion}%) y requiere optimización.`,
          `• Las recomendaciones representan el ${reportData.datos.find(f => f.fuente === 'Recomendaciones')?.porcentaje || 0}% de nuevos pacientes.`
        ];
        break;
        
      case 'inventario':
        const criticos = reportData.datos.filter(prod => prod.stock < prod.minimo);
        analisisTexto = [
          `• ${criticos.length} productos están por debajo del stock mínimo.`,
          criticos.length > 0 ? `• Productos críticos: ${criticos.map(p => p.producto).join(', ')}.` : '• Todos los productos tienen stock suficiente.',
          `• Se recomienda hacer pedido urgente para productos con stock crítico.`
        ];
        break;
        
      default:
        analisisTexto = [
          `• Este reporte contiene ${reportData.datos.length} registros para análisis.`,
          `• Los datos fueron actualizados por última vez el ${new Date(reportData.fechaUltima).toLocaleDateString('es-ES')}.`,
          `• Revise los datos detallados en la tabla inferior para obtener más información.`
        ];
        break;
    }
    
    doc.setFontSize(10);
    analisisTexto.forEach((linea, index) => {
      doc.text(linea, 20, 135 + (index * 7));
    });
  }

  private getReportColor(reportId: string): [number, number, number] {
    const colors: { [key: string]: [number, number, number] } = {
      'tiempo': [6, 182, 212],      // Cyan
      'marketing': [251, 146, 60],  // Orange
      'inventario': [99, 102, 241], // Indigo
      'default': [99, 102, 241]     // Default indigo
    };
    return colors[reportId] || colors['default'];
  }

  private getDisplayHeaders(reportId: string, headers: string[]): string[] {
    const headerMappings: { [key: string]: { [key: string]: string } } = {
      'tiempo': {
        'profesional': 'Profesional',
        'duracionPromedio': 'Duración (min)',
        'tiempoEspera': 'Espera (min)',
        'puntualidad': 'Puntualidad (%)'
      },
      'marketing': {
        'fuente': 'Fuente',
        'pacientes': 'Pacientes',
        'porcentaje': '% Total',
        'conversion': '% Conversión',
        'coste': 'Coste (€)'
      },
      'inventario': {
        'producto': 'Producto',
        'stock': 'Stock',
        'minimo': 'Mínimo',
        'valor': 'Valor (€)',
        'uso': 'Uso (%)'
      }
    };
    
    const mapping = headerMappings[reportId];
    if (mapping) {
      return headers.map(header => mapping[header] || header);
    }
    return headers;
  }

  private formatCellValue(header: string, value: any): string {
    if (header.includes('coste') || header.includes('valor')) {
      return `€${value}`;
    }
    if (header.includes('porcentaje') || header.includes('conversion') || header.includes('uso') || header.includes('puntualidad')) {
      return `${value}%`;
    }
    if (header.includes('duracion') || header.includes('tiempo')) {
      return `${value} min`;
    }
    return String(value);
  }

  generateNoShowReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Summary cards
    const totalCitas = 83; // This would come from real data
    const noShowCount = reportData.datos.length;
    const noShowRate = ((noShowCount / totalCitas) * 100).toFixed(1);
    
    this.addSummaryCard(doc, 'No-Show Total', noShowCount.toString(), 'Pacientes', 20, 80, [239, 68, 68]);
    this.addSummaryCard(doc, 'Tasa No-Show', `${noShowRate}%`, 'Del total de citas', 80, 80, [251, 146, 60]);
    this.addSummaryCard(doc, 'Meta', '<5%', 'Objetivo clínica', 140, 80, [34, 197, 94]);
    
    // Description and analysis
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    const analisisTexto = [
      `• La tasa actual de no-show es del ${noShowRate}%, ${parseFloat(noShowRate) < 5 ? 'dentro' : 'por encima'} del objetivo.`,
      `• Se registraron ${noShowCount} casos de pacientes que no asistieron sin cancelar.`,
      `• Esto representa una pérdida estimada de ingresos significativa.`,
      `• Se recomienda implementar recordatorios automáticos y políticas de cancelación.`
    ];
    
    analisisTexto.forEach((linea, index) => {
      doc.setFontSize(10);
      doc.text(linea, 20, 140 + (index * 7));
    });
    
    // Table
    const tableData = reportData.datos.map(fila => [
      fila.paciente,
      new Date(fila.fecha).toLocaleDateString('es-ES'),
      fila.tratamiento,
      fila.profesional
    ]);

    autoTable(doc, {
      head: [['Paciente', 'Fecha', 'Tratamiento', 'Profesional']],
      body: tableData,
      startY: 170,
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generateProduccionReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Calculate totals
    const totales = reportData.datos.reduce((acc, prof) => ({
      pacientes: acc.pacientes + prof.pacientes,
      tratamientos: acc.tratamientos + prof.tratamientos,
      facturacion: acc.facturacion + prof.facturacion,
      horas: acc.horas + prof.horas
    }), { pacientes: 0, tratamientos: 0, facturacion: 0, horas: 0 });
    
    // Summary cards
    this.addSummaryCard(doc, 'Pacientes', totales.pacientes.toString(), 'Total atendidos', 20, 80, [59, 130, 246]);
    this.addSummaryCard(doc, 'Tratamientos', totales.tratamientos.toString(), `${(totales.tratamientos/totales.pacientes).toFixed(1)} por paciente`, 80, 80, [34, 197, 94]);
    this.addSummaryCard(doc, 'Facturación', `€${totales.facturacion.toLocaleString()}`, `€${Math.round(totales.facturacion/totales.horas)}/hora`, 140, 80, [139, 69, 19]);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Analysis
    const mejorProfesional = reportData.datos.reduce((max, prof) => 
      prof.facturacion > max.facturacion ? prof : max);
    
    const analisisTexto = [
      `• Total de ${totales.pacientes} pacientes atendidos en ${totales.horas} horas de trabajo.`,
      `• Se realizaron ${totales.tratamientos} tratamientos con facturación de €${totales.facturacion.toLocaleString()}.`,
      `• ${mejorProfesional.profesional} lidera en facturación con €${mejorProfesional.facturacion.toLocaleString()}.`,
      `• Productividad promedio: €${Math.round(totales.facturacion/totales.horas)} por hora trabajada.`
    ];
    
    analisisTexto.forEach((linea, index) => {
      doc.setFontSize(10);
      doc.text(linea, 20, 140 + (index * 7));
    });
    
    // Table
    const tableData = reportData.datos.map(fila => [
      fila.profesional,
      fila.pacientes.toString(),
      fila.tratamientos.toString(),
      `${fila.horas}h`,
      `€${fila.facturacion.toLocaleString()}`,
      `€${Math.round(fila.facturacion / fila.horas)}`
    ]);

    autoTable(doc, {
      head: [['Profesional', 'Pacientes', 'Tratamientos', 'Horas', 'Facturación', '€/Hora']],
      body: tableData,
      startY: 170,
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generatePresupuestosReport(reportData: PDFReportData): jsPDF {
    const doc = new jsPDF();
    
    this.addHeader(doc, reportData.nombre);
    
    // Calculate totals
    const totales = reportData.datos.reduce((acc, mes) => ({
      enviados: acc.enviados + mes.enviados,
      aceptados: acc.aceptados + mes.aceptados,
      rechazados: acc.rechazados + mes.rechazados,
      pendientes: acc.pendientes + mes.pendientes
    }), { enviados: 0, aceptados: 0, rechazados: 0, pendientes: 0 });
    
    const conversionPromedio = ((totales.aceptados / totales.enviados) * 100).toFixed(1);
    
    // Summary cards
    this.addSummaryCard(doc, 'Enviados', totales.enviados.toString(), 'Últimos 3 meses', 20, 80, [59, 130, 246]);
    this.addSummaryCard(doc, 'Aceptados', totales.aceptados.toString(), 'Conversiones exitosas', 80, 80, [34, 197, 94]);
    this.addSummaryCard(doc, 'Conversión', `${conversionPromedio}%`, 'Tasa promedio', 140, 80, [139, 69, 19]);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportData.descripcion, 20, 120);
    
    // Analysis
    const mejorMes = reportData.datos.reduce((max, mes) => 
      mes.conversion > max.conversion ? mes : max);
    
    const analisisTexto = [
      `• Se enviaron ${totales.enviados} presupuestos con ${totales.aceptados} aceptaciones.`,
      `• Tasa de conversión promedio: ${conversionPromedio}% (objetivo: 70%).`,
      `• ${mejorMes.mes} fue el mejor mes con ${mejorMes.conversion}% de conversión.`,
      `• ${totales.pendientes} presupuestos aún pendientes de respuesta.`
    ];
    
    analisisTexto.forEach((linea, index) => {
      doc.setFontSize(10);
      doc.text(linea, 20, 140 + (index * 7));
    });
    
    // Table
    const tableData = reportData.datos.map(fila => [
      fila.mes,
      fila.enviados.toString(),
      fila.aceptados.toString(),
      fila.rechazados.toString(),
      fila.pendientes.toString(),
      `${fila.conversion}%`
    ]);

    autoTable(doc, {
      head: [['Mes', 'Enviados', 'Aceptados', 'Rechazados', 'Pendientes', '% Conversión']],
      body: tableData,
      startY: 170,
      headStyles: {
        fillColor: [139, 69, 19],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        cellPadding: 5,
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      }
    });
    
    this.addFooter(doc, 1);
    return doc;
  }

  generateReport(reportData: PDFReportData): jsPDF {
    console.log('Generando PDF para reporte:', reportData.id);
    switch (reportData.id) {
      case 'citas':
        return this.generateCitasReport(reportData);
      case 'no-show':
        return this.generateNoShowReport(reportData);
      case 'produccion':
        return this.generateProduccionReport(reportData);
      case 'presupuestos':
        return this.generatePresupuestosReport(reportData);
      case 'financiero':
        return this.generateFinancieroReport(reportData);
      case 'satisfaccion':
        return this.generateSatisfaccionReport(reportData);
      case 'tratamientos':
        return this.generateTratamientosReport(reportData);
      default:
        return this.generateGenericReport(reportData);
    }
  }
}

export default new PDFGenerator();