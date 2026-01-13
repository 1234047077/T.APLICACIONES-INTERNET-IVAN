// Función para descargar el contrato como PDF
async function downloadPDF() {
  // Verificar si las librerías se cargaron correctamente
  if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
    alert('No se cargaron las librerías necesarias. Revisa tu conexión a internet.');
    console.error('html2canvas o jsPDF no están cargadas.');
    return;
  }

  try {
    console.log('Iniciando generación de PDF...');
    
    // Obtener el elemento del contrato
    const element = document.getElementById('contract');
    
    if (!element) {
      alert('No se encontró el contenido del contrato.');
      return;
    }
    
    // Scroll al inicio
    window.scrollTo(0, 0);
    
    // Mostrar mensaje de carga
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Generando PDF...';
    button.disabled = true;
    
    // Capturar el elemento como imagen usando html2canvas
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollY: 0,
      scrollX: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
    
    console.log('Canvas generado, creando PDF...');
    
    // Obtener dimensiones de la imagen
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const imgWidth = 8.5; // Ancho de carta en pulgadas
    const pageHeight = 11; // Alto de carta en pulgadas
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Crear el PDF
    const { jsPDF } = jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter',
      compress: true
    });
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Añadir la primera página
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;
    
    // Añadir páginas adicionales si es necesario
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
    }
    
    // Guardar el PDF
    pdf.save('Contrato_de_Aprendizaje.pdf');
    
    console.log('PDF generado exitosamente');
    
    // Restaurar botón
    button.textContent = originalText;
    button.disabled = false;
      
  } catch (e) {
    alert('Ocurrió un error al generar el PDF: ' + e.message);
    console.error('Error:', e);
    
    // Restaurar botón en caso de error
    const button = event.target;
    button.textContent = 'Descargar en PDF';
    button.disabled = false;
  }
}

// Verificar que las librerías estén cargadas al iniciar
window.addEventListener('load', function() {
  console.log('Página cargada');
  console.log('html2canvas disponible:', typeof html2canvas !== 'undefined');
  console.log('jsPDF disponible:', typeof jspdf !== 'undefined');
});