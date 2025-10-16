// helpers/date.js (opcional, o ponelo arriba del router)
const TZ_DEFAULT = "America/Argentina/Cordoba";

function formatYMD(date, timeZone = TZ_DEFAULT) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

function formatHM(date, timeZone = TZ_DEFAULT) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hh = parts.find((p) => p.type === "hour").value;
  const mm = parts.find((p) => p.type === "minute").value;
  return `${hh}:${mm}`;
}

function serializeTurno(turno, timeZone = TZ_DEFAULT) {
  // Prisma suele traer Date en JS; aseguramos instancia Date
  const dt = new Date(turno.fechaTurno);

  return {
    id: turno.id,
    estado: turno.estado,
    verificationCode: turno.verificationCode,
    detalle: turno.detalle ?? null,
    datetime: {
      iso_utc: dt.toISOString(), // estándar para almacenamiento/transporte
      date: formatYMD(dt, timeZone), // ej: "2025-10-17" en AR
      time: formatHM(dt, timeZone), // ej: "13:00" en AR
      timeZone, // documentamos la TZ usada para renderizar
    },
    vehiculo: turno.vehiculo,
    revision: turno.revision ?? null,
  };
}
