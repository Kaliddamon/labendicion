/**
 * Devuelve la fecha actual (o la de un objeto Date específico)
 * en la zona horaria de Colombia (America/Bogota)
 * formateada como YYYY-MM-DD.
 */
export const getColombiaDateString = (date = new Date()): string => {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
};

/**
 * Devuelve la fecha actual con hora en la zona horaria de Colombia.
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
    hour12: false,
  }).formatToParts(date);

  const obj: Record<string, string> = {};
  for (const part of parts) {
    obj[part.type] = part.value;
  }
  return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}.${obj.fractionalSecond}Z`;
};

// ─── Utilidades de quincena ────────────────────────────────────────────────

export type Quincena = 'Q1' | 'Q2';

export interface QuincenaInfo {
  quincena: Quincena;
  /** Etiqueta corta: "Q1 (1–15 jun)" */
  label: string;
  /** Primer día del período YYYY-MM-DD */
  inicio: string;
  /** Último día del período YYYY-MM-DD */
  fin: string;
  /** "Junio 2026" */
  mesLabel: string;
}

const MES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** Determina la quincena a la que pertenece una fecha "YYYY-MM-DD". */
export const getQuincenaOfDate = (fecha: string): Quincena => {
  const day = parseInt(fecha.split('-')[2] ?? '1', 10);
  return day <= 15 ? 'Q1' : 'Q2';
};

/** Devuelve la quincena actual basada en la fecha colombiana. */
export const getQuincenaActual = (): Quincena =>
  getQuincenaOfDate(getColombiaDateString());

/**
 * Dado un mes "YYYY-MM" y una quincena, retorna el detalle completo del período.
 */
export const getQuincenaInfo = (mes: string, quincena: Quincena): QuincenaInfo => {
  const [year, m] = mes.split('-');
  const mesIdx = parseInt(m, 10) - 1;
  const mesNombre = MES_NOMBRES[mesIdx] ?? m;
  const mesAbrev = mesNombre.toLowerCase().slice(0, 3);
  const ultimoDia = new Date(parseInt(year, 10), parseInt(m, 10), 0).getDate();

  if (quincena === 'Q1') {
    return {
      quincena: 'Q1',
      label: `Q1 (1–15 ${mesAbrev})`,
      inicio: `${mes}-01`,
      fin: `${mes}-15`,
      mesLabel: `${mesNombre} ${year}`,
    };
  }
  return {
    quincena: 'Q2',
    label: `Q2 (16–${ultimoDia} ${mesAbrev})`,
    inicio: `${mes}-16`,
    fin: `${mes}-${String(ultimoDia).padStart(2, '0')}`,
    mesLabel: `${mesNombre} ${year}`,
  };
};

export const redondearHora = (horaStr: string): number => {
  if (!horaStr || horaStr === '--:--') return 0;
  const [hStr, mStr] = horaStr.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);

  if (isNaN(h) || isNaN(m)) return 0;

  if (m < 15) {
    m = 0;
  } else if (m >= 15 && m < 45) {
    m = 30;
  } else {
    m = 0;
    h += 1;
  }

  return h + (m / 60);
};

export const calcularHorasTrabajadasRedondeadas = (horaEntrada: string, horaSalida: string): number => {
  if (!horaEntrada || horaEntrada === '--:--' || !horaSalida || horaSalida === '--:--') return 0;
  const hEntrada = redondearHora(horaEntrada);
  const hSalida = redondearHora(horaSalida);
  return Math.max(0, hSalida - hEntrada);
};
