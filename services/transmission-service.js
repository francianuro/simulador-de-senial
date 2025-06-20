const MEDIUM_CHARACTERISTICS = {
  "cable-coaxial": {
    name: "Cable Coaxial",
    type: "guiado",
    lossPerKm: 0.5,
    noiseFloor: -90,
    maxCapacity: 1000,
    bandwidth: 100,
  },
  "fibra-optica": {
    name: "Fibra Óptica",
    type: "guiado",
    lossPerKm: 0.2,
    noiseFloor: -95,
    maxCapacity: 10000,
    bandwidth: 1000,
  },
  "cable-par-trenzado": {
    name: "Cable Par Trenzado",
    type: "guiado",
    lossPerKm: 1.0,
    noiseFloor: -85,
    maxCapacity: 100,
    bandwidth: 50,
  },
  wifi: {
    name: "WiFi (2.4GHz)",
    type: "no-guiado",
    lossPerKm: 8.0,
    noiseFloor: -70,
    maxCapacity: 150,
    bandwidth: 20,
  },
  radio: {
    name: "Ondas de Radio",
    type: "no-guiado",
    lossPerKm: 12.0,
    noiseFloor: -65,
    maxCapacity: 50,
    bandwidth: 10,
  },
}

function safeNumber(value, fallback = 0) {
  return isNaN(value) || !isFinite(value) ? fallback : value
}

function safeLog10(value) {
  return value <= 0 ? -Infinity : Math.log10(value)
}

function safeLog2(value) {
  return value <= 0 ? 0 : Math.log2(value)
}

function calculateSignal({
  inputVoltage = 1,
  distance = 1,
  attenuation = 1,
  amplification = 1,
  transmissionMedium = "cable-coaxial",
  ambientNoise = 1,
}) {
  const medium = MEDIUM_CHARACTERISTICS[transmissionMedium]
  if (!medium) throw new Error("Medio inválido")

  const safeInputVoltage = Math.max(0.1, safeNumber(inputVoltage, 1))
  const safeDistance = Math.max(0.1, safeNumber(distance, 1))
  const safeAttenuation = Math.max(0, safeNumber(attenuation, 1))
  const safeAmplification = Math.max(0, safeNumber(amplification, 1))
  const safeAmbientNoise = Math.max(1, safeNumber(ambientNoise, 1))

  // 1. Potencia de entrada en dBm
  const inputPower = safeNumber(20 * safeLog10(safeInputVoltage) + 10, 0)

  // 2. Pérdidas del medio
  const mediumLoss = safeNumber(medium.lossPerKm * safeDistance, 0)

  // 3. Pérdidas de propagación si no es guiado
  const propagationLoss = medium.type === "no-guiado"
    ? safeNumber(20 * safeLog10(safeDistance) + 20 * safeLog10(2400) - 147.55, 0)
    : 0

  // 4. Nivel de ruido total
  const thermalNoise = medium.noiseFloor
  const totalNoise = safeNumber(thermalNoise - 10 * safeLog10(safeAmbientNoise), thermalNoise)

  // 5. Pérdidas y ganancias
  const totalLoss = safeNumber(mediumLoss + propagationLoss + safeAttenuation, 0)
  const totalGain = safeAmplification

  // 6. Potencia de salida
  const outputPower = safeNumber(inputPower - totalLoss + totalGain, inputPower)

  // 7. Relación señal a ruido (SNR)
  const snr = safeNumber(outputPower - totalNoise, 0)

  // 8. Capacidad del canal (Shannon-Hartley)
  const snrLinear = Math.pow(10, snr / 10)
  const rawCapacity = medium.bandwidth * safeLog2(1 + snrLinear)
  const channelCapacity = safeNumber(Math.min(rawCapacity, medium.maxCapacity), 0)

  // 9. Eficiencia
  const baseEfficiency = medium.type === "guiado" ? 95 : 70
  const distancePenalty = Math.max(0, safeDistance * 2)
  const noisePenalty = Math.max(0, (safeAmbientNoise - 1) * 10)
  const efficiency = Math.max(10, baseEfficiency - distancePenalty - noisePenalty)

  // 10. Voltaje de salida desde potencia
  const outputVoltage = safeNumber(Math.pow(10, (outputPower - 10) / 20), 0.1)

  // 11. Ganancia final en dB
  const finalGain = safeNumber(20 * safeLog10(outputVoltage / safeInputVoltage), 0)

  return {
    inputVoltage: safeInputVoltage,
    outputVoltage,
    inputPower,
    outputPower,
    totalLoss: totalLoss + propagationLoss,
    mediumLoss,
    attenuationLoss: safeAttenuation,
    amplificationGain: safeAmplification,
    snr,
    noiseLevel: totalNoise,
    channelCapacity,
    efficiency,
    finalGain,
    distance: safeDistance,
  }
}
