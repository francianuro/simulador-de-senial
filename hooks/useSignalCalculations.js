import { useState, useMemo } from 'react';

// Datos completos de medios de transmisión
const MEDIUM_DATA = {
  'cable-coaxial': {
    name: 'Cable Coaxial',
    icon: 'Cable',
    type: 'guiado',
    lossPerKm: 10,
    maxCapacity: 1000,
    bandwidth: 750,
    color: 'bg-orange-600'
  },
  'fibra-optica': {
    name: 'Fibra Óptica',
    icon: 'Zap',
    type: 'guiado',
    lossPerKm: 0.2,
    maxCapacity: 10000,
    bandwidth: 1000,
    color: 'bg-red-500'
  },
  'cable-par-trenzado': {
    name: 'Cable Par Trenzado',
    icon: 'Cable',
    type: 'guiado',
    lossPerKm: 15,
    maxCapacity: 100,
    bandwidth: 250,
    color: 'bg-blue-500'
  },
  'wifi': {
    name: 'WiFi (2.4GHz)',
    icon: 'Wifi',
    type: 'no-guiado',
    lossPerKm: 50,
    maxCapacity: 300,
    bandwidth: 20,
    color: 'bg-purple-500'
  },
  'radio': {
    name: 'Ondas de Radio',
    icon: 'Radio',
    type: 'no-guiado',
    lossPerKm: 30,
    maxCapacity: 50,
    bandwidth: 10,
    color: 'bg-green-500'
  }
};

// Medio predeterminado para evitar undefined
const DEFAULT_MEDIUM = MEDIUM_DATA['cable-coaxial'];

export function useSignalCalculations() {
  const [inputVoltage, setInputVoltage] = useState(1);
  const [distance, setDistance] = useState(1);
  const [attenuation, setAttenuation] = useState(1);
  const [amplification, setAmplification] = useState(1);
  const [transmissionMedium, setTransmissionMedium] = useState('cable-coaxial');
  const [signalType, setSignalType] = useState('analogica');
  const [ambientNoise, setAmbientNoise] = useState(1);

  // Usar medio predeterminado si no se encuentra
  const mediumCharacteristics = MEDIUM_DATA[transmissionMedium] || DEFAULT_MEDIUM;

  const calculationResult = useMemo(() => {
    // 1. Pérdida en el medio (manejo seguro)
    const mediumLoss = (mediumCharacteristics.lossPerKm * distance) || 0;
    
    // 2. Ganancia/pérdida total (dB)
    const totalLoss = mediumLoss + attenuation - amplification;
    
    // 3. Voltaje de salida (V = V₀ × 10^(dB/20))
    const outputVoltage = inputVoltage * Math.pow(10, totalLoss / 20);
    
    // 4. SNR (dB) - Modelo simplificado
    const snr = 20 * Math.log10(outputVoltage / Math.max(0.01, ambientNoise));
    
    // 5. Capacidad de canal (Shannon-Hartley)
    const bandwidth = mediumCharacteristics.bandwidth || 1;
    const snrLinear = Math.pow(10, snr / 10);
    const channelCapacity = bandwidth * Math.log2(1 + snrLinear);
    
    // 6. Eficiencia (porcentaje)
    const efficiency = Math.min(100, Math.max(0, (outputVoltage / inputVoltage) * 100));
    
    // 7. Nivel de ruido (dBm)
    const noiseLevel = 10 * Math.log10(Math.max(0.01, ambientNoise));
    
    return {
      inputVoltage,
      outputVoltage,
      totalLoss: Math.abs(totalLoss),
      mediumLoss,
      finalGain: -totalLoss,
      snr,
      channelCapacity,
      efficiency,
      noiseLevel
    };
  }, [
    inputVoltage,
    distance,
    attenuation,
    amplification,
    ambientNoise,
    mediumCharacteristics
  ]);

  return {
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
    mediumCharacteristics
  };
}