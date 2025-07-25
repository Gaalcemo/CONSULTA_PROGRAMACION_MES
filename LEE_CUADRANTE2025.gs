49131072-J


function doGet(e) {
  const dni = e.parameter.dni;
  if (!dni) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "DNI requerido" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const file = DriveApp.getFilesByName("2025CUADRANTEMSA").next();
  const ss = SpreadsheetApp.open(file);

  const today = new Date();
  const currentMonth = today.getMonth();
  const day = today.getDate();
  const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

  const meses = day >= 20 ? [currentMonth, (currentMonth + 1) % 12] : [currentMonth];
  let resultados = [];

  for (let m of meses) {
    const nombreHoja = monthNames[m];
    const sheet = ss.getSheetByName(nombreHoja);
    if (!sheet) continue;

    const data = sheet.getDataRange().getValues();
    const header = data[1].slice(2, 33); // C–AG
    const dniColIndex = 34; // columna AI

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (String(row[dniColIndex]).trim() === dni.trim()) {
        const nombre = row[1]; // columna B
        const asignaciones = row.slice(2, 33);

        const esMesSiguiente = (m === (currentMonth + 1) % 12 && day >= 20);
        const mostrarDias = esMesSiguiente ? header.slice(0, 14) : header;
        const mostrarAsig = esMesSiguiente ? asignaciones.slice(0, 14) : asignaciones;

        resultados.push({
          mes: nombreHoja,
          nombre: nombre,
          dias: mostrarDias,
          asignaciones: mostrarAsig
        });
        break;
      }
    }
  }

  if (resultados.length === 0) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "DNI no encontrado" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(
    JSON.stringify(resultados)
  ).setMimeType(ContentService.MimeType.JSON);
}