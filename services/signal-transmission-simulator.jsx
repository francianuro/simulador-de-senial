import React from "react"
import { useSignalCalculations } from "../hooks/useSignalCalculations"

function formatNumber(num, decimals = 2) {
  return num?.toFixed(decimals) ?? "N/A"
}

export default function SignalTransmissionSimulator() {
  const {
    inputVoltage,
    setInputVoltage,
    distance,
    setDistance,
    attenuation,
    setAttenuation,
    amplification,
    setAmplification,
    transmissionMedium,
    setTransmissionMedium,
    signalType,
    setSignalType,
    ambientNoise,
    setAmbientNoise,
    calculationResult,
    mediumCharacteristics,
  } = useSignalCalculations()

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simulador de Transmisión de Señal</h1>

      <div className="grid grid-cols-2 gap-4">
        <label>
          Voltaje de entrada (V)
          <input
            type="number"
            value={inputVoltage}
            onChange={(e) => setInputVoltage(parseFloat(e.target.value))}
            className="input"
          />
        </label>

        <label>
          Distancia (km)
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="input"
          />
        </label>

        <label>
          Atenuación (dB)
          <input
            type="number"
            value={attenuation}
            onChange={(e) => setAttenuation(parseFloat(e.target.value))}
            className="input"
          />
        </label>

        <label>
          Amplificación (dB)
          <input
            type="number"
            value={amplification}
            onChange={(e) => setAmplification(parseFloat(e.target.value))}
            className="input"
          />
        </label>

        <label>
          Ruido ambiental
          <input
            type="number"
            value={ambientNoise}
            onChange={(e) => setAmbientNoise(parseFloat(e.target.value))}
            className="input"
          />
        </label>

        <label>
          Medio de transmisión
          <select
            value={transmissionMedium}
            onChange={(e) => setTransmissionMedium(e.target.value)}
            className="input"
          >
            {Object.entries(mediumCharacteristics ? mediumCharacteristics : {}).map(([key, val]) => (
              <option key={key} value={key}>
                {val?.name ?? key}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo de señal
          <select
            value={signalType}
            onChange={(e) => setSignalType(e.target.value)}
            className="input"
          >
            <option value="analogica">Analógica</option>
            <option value="digital">Digital</option>
          </select>
        </label>
      </div>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Resultados</h2>
        <ul className="space-y-1">
          <li><strong>Voltaje de salida:</strong> {formatNumber(calculationResult.outputVoltage)} V</li>
          <li><strong>Pérdida total:</strong> {formatNumber(calculationResult.totalLoss)} dB</li>
          <li><strong>Ganancia final:</strong> {formatNumber(calculationResult.finalGain)} dB</li>
          <li><strong>Ruido total:</strong> {formatNumber(calculationResult.noiseLevel)} dBm</li>
          <li><strong>Relación Señal/Ruido:</strong> {formatNumber(calculationResult.snr)} dB</li>
          <li><strong>Capacidad del canal:</strong> {formatNumber(calculationResult.channelCapacity)} Mbps</li>
          <li><strong>Eficiencia estimada:</strong> {formatNumber(calculationResult.efficiency)}%</li>
        </ul>
      </div>
    </div>
  )
}
