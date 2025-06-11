/**
 * Servicio de cálculos de transmisión basado en teoría de la información
 */

// Constantes para diferentes medios de transmisión (atenuación en dB/km/MHz)
const ATTENUATION_CONSTANTS = {
  coaxial: 0.05,
  fibra: 0.0002,
  radiofrecuencia: 0.1,
  par_trenzado: 0.08,
  microondas: 0.15,
}

// Constantes de ruido térmico
const BOLTZMANN_CONSTANT = 1.38e-23 // J/K
const TEMPERATURE = 290 // K (temperatura ambiente)

/**
 * Calcula la atenuación en dB basada en el medio, distancia y frecuencia
 * @param {string} medio - Tipo de medio de transmisión
 * @param {number} distancia - Distancia en metros
 * @param {number} frecuencia - Frecuencia en MHz
 * @returns {number} Atenuación en dB
 */
export function calcularAtenuacion(medio, distancia, frecuencia) {
  const alpha = ATTENUATION_CONSTANTS[medio] || 0.05
  const distanciaKm = distancia / 1000

  // Fórmula: Atenuación = α * distancia * √frecuencia
  const atenuacion = alpha * distanciaKm * Math.sqrt(frecuencia)

  return Math.max(0, atenuacion)
}

/**
 * Calcula la potencia de ruido térmico
 * @param {number} anchoBanda - Ancho de banda en MHz
 * @returns {number} Potencia de ruido en dBm
 */
export function calcularRuidoTermico(anchoBanda) {
  const anchoBandaHz = anchoBanda * 1e6
  const potenciaRuidoWatts = BOLTZMANN_CONSTANT * TEMPERATURE * anchoBandaHz
  const potenciaRuidoDbm = 10 * Math.log10(potenciaRuidoWatts * 1000)

  return potenciaRuidoDbm
}

/**
 * Calcula la relación señal-ruido (SNR)
 * @param {number} potenciaSenal - Potencia de señal en dBm
 * @param {number} nivelRuido - Nivel de ruido adicional en dB
 * @param {number} anchoBanda - Ancho de banda en MHz
 * @param {number} atenuacion - Atenuación en dB
 * @returns {number} SNR en dB
 */
export function calcularSNR(potenciaSenal = 0, nivelRuido, anchoBanda, atenuacion) {
  const ruidoTermico = calcularRuidoTermico(anchoBanda)
  const ruidoTotal = ruidoTermico + nivelRuido
  const potenciaRecibida = potenciaSenal - atenuacion

  const snr = potenciaRecibida - ruidoTotal

  return snr
}

/**
 * Calcula la capacidad del canal usando el teorema de Shannon-Hartley
 * @param {number} anchoBanda - Ancho de banda en MHz
 * @param {number} snr - SNR en dB
 * @returns {number} Capacidad en bps
 */
export function calcularCapacidadShannon(anchoBanda, snr) {
  const anchoBandaHz = anchoBanda * 1e6
  const snrLineal = Math.pow(10, snr / 10)

  // Fórmula de Shannon: C = B * log2(1 + SNR)
  const capacidad = anchoBandaHz * Math.log2(1 + snrLineal)

  return Math.max(0, capacidad)
}

/**
 * Calcula la velocidad efectiva considerando el tipo de señal y eficiencia
 * @param {number} capacidadShannon - Capacidad teórica en bps
 * @param {string} tipoSenal - Tipo de señal (analogica/digital)
 * @param {number} snr - SNR en dB
 * @returns {number} Velocidad efectiva en bps
 */
export function calcularVelocidadEfectiva(capacidadShannon, tipoSenal, snr) {
  let eficiencia = 1

  if (tipoSenal === "digital") {
    // Para señales digitales, la eficiencia depende del SNR
    if (snr > 20) eficiencia = 0.9
    else if (snr > 10) eficiencia = 0.7
    else if (snr > 0) eficiencia = 0.5
    else eficiencia = 0.1
  } else {
    // Para señales analógicas, menor eficiencia
    if (snr > 15) eficiencia = 0.6
    else if (snr > 5) eficiencia = 0.4
    else eficiencia = 0.2
  }

  return capacidadShannon * eficiencia
}

/**
 * Determina el tipo de interferencia predominante
 * @param {number} snr - SNR en dB
 * @param {number} nivelRuido - Nivel de ruido en dB
 * @param {number} frecuencia - Frecuencia en MHz
 * @param {number} distancia - Distancia en metros
 * @param {string} medio - Tipo de medio
 * @returns {string} Tipo de interferencia
 */
export function determinarInterferencia(snr, nivelRuido, frecuencia, distancia, medio) {
  if (snr < 0) {
    return "Ruido excesivo"
  }

  if (nivelRuido > 15) {
    return "Ruido térmico"
  }

  if (distancia > 1000 && medio === "radiofrecuencia") {
    return "Desvanecimiento"
  }

  if (frecuencia > 100 && medio === "coaxial") {
    return "Dispersión"
  }

  if (distancia > 500) {
    return "Atenuación"
  }

  if (frecuencia > 50) {
    return "Intermodulación"
  }

  return "Mínima"
}

/**
 * Función principal que realiza todos los cálculos
 * @param {Object} parametros - Parámetros de entrada
 * @returns {Object} Resultados calculados
 */
export function simularTransmision(parametros) {
  const {
    medioTransmision,
    distancia,
    tipoSenal,
    anchoBanda,
    nivelRuido,
    frecuencia = anchoBanda, // Si no se especifica frecuencia, usar ancho de banda
  } = parametros

  // Validar parámetros
  if (!medioTransmision || distancia <= 0 || anchoBanda <= 0) {
    throw new Error("Parámetros inválidos")
  }

  // Cálculos
  const atenuacion = calcularAtenuacion(medioTransmision, distancia, frecuencia)
  const snr = calcularSNR(0, nivelRuido, anchoBanda, atenuacion)
  const capacidadShannon = calcularCapacidadShannon(anchoBanda, snr)
  const velocidadEfectiva = calcularVelocidadEfectiva(capacidadShannon, tipoSenal, snr)
  const interferencia = determinarInterferencia(snr, nivelRuido, frecuencia, distancia, medioTransmision)

  return {
    atenuacion: Number.parseFloat(atenuacion.toFixed(2)),
    snr: Number.parseFloat(snr.toFixed(2)),
    velocidadEfectiva: Math.round(velocidadEfectiva),
    interferencia,
    capacidadTeorica: Math.round(capacidadShannon),
  }
}
