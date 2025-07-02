export default async function handler(req, res) {
  const { dni } = req.query;

  const dniRegex = /^[0-9]{7,8}-[A-Z]$/;
  if (!dni || !dniRegex.test(dni)) {
    return res.status(400).json({ error: "DNI inválido." });
  }

  try {
    const scriptUrl = `https://script.google.com/macros/s/AKfycbz97OzNUEULG_waTarAlESaR6nUXbxxz99L3bIr2nJFf7dpl2mdEmjs4XT6omdr_qj4eA/exec?dni=${encodeURIComponent(dni)}`;
    const response = await fetch(scriptUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al consultar el script:", error);
    res.status(500).json({ error: "Error al consultar el servicio." });
  }
}
