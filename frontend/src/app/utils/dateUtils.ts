/**
 * Devuelve la fecha actual (o la de un objeto Date específico)
 * en la zona horaria de Colombia (America/Bogota)
 * formateada como YYYY-MM-DD.
 */
export const getColombiaDateString = (date = new Date()): string => {
  // 'en-CA' produce formato YYYY-MM-DD nativamente
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
};

/**
 * Devuelve la fecha actual con hora (o de un Date específico)
 * en la zona horaria de Colombia (America/Bogota)
 * en formato ISO-like: YYYY-MM-DDTHH:mm:ss.SSSZ
 * 
 * Útil para campos de base de datos que requieren timestamps completos.
 * Usamos un approach manual para evitar desajustes.
 */
export const getColombiaIsoString = (date = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false
  }).formatToParts(date);
  
  // Reconstruimos a formato ISO
  const obj: Record<string, string> = {};
  for (const part of parts) {
    obj[part.type] = part.value;
  }
  // En vez de enviar 'Z' (que es UTC), si el backend espera un string como el ISO
  // Podemos enviar la hora colombiana. Pero por simplicidad, si la BD acepta strings sin zona, 
  // armamos el ISO así:
  return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}.${obj.fractionalSecond}Z`;
};
