"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Zap, Radio, Wifi, Cable, Activity, Signal } from "lucide-react"
import { useSignalCalculations } from "@/hooks/useSignalCalculations"

export default function SignalTransmissionSimulator() {
  const [isTransmitting, setIsTransmitting] = useState(false)

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

  const mediumOptions = [
    { value: "cable-coaxial", label: "Cable Coaxial", icon: Cable, type: "guiado" },
    { value: "fibra-optica", label: "Fibra Óptica", icon: Zap, type: "guiado" },
    { value: "cable-par-trenzado", label: "Cable Par Trenzado", icon: Cable, type: "guiado" },
    { value: "wifi", label: "WiFi (2.4GHz)", icon: Wifi, type: "no-guiado" },
    { value: "radio", label: "Ondas de Radio", icon: Radio, type: "no-guiado" },
  ]

  const signalOptions = [
    { value: "analogica", label: "Señal Analógica" },
    { value: "digital", label: "Señal Digital" },
  ]

  const startTransmission = () => {
    setIsTransmitting(true)
  }

  const stopTransmission = () => {
    setIsTransmitting(false)
  }

  const resetSimulation = () => {
    setIsTransmitting(false)
    setInputVoltage(1)
    setDistance(1)
    setAttenuation(1)
    setAmplification(1)
    setAmbientNoise(1)
  }

  const getIconComponent = (iconName) => {
    const icons = {
      Cable,
      Zap,
      Wifi,
      Radio,
    }
    return icons[iconName] || Cable
  }

  const MediumIcon = getIconComponent(mediumCharacteristics?.icon || "Cable")

  const formatNumber = (value, decimals = 2) => {
    if (isNaN(value) || !isFinite(value)) return "0.00"
    return value.toFixed(decimals)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Simulador Avanzado de Transmisión de Señales</h1>
          <p className="text-slate-600">
            Simula la transmisión considerando características reales de medios guiados y no guiados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MediumIcon className="w-5 h-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>Configura los parámetros de transmisión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="medium">Medio de Transmisión</Label>
                <Select value={transmissionMedium} onValueChange={setTransmissionMedium}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el medio" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediumOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                            <Badge variant={option.type === "guiado" ? "default" : "secondary"}>{option.type}</Badge>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {mediumCharacteristics && (
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>
                      Tipo:{" "}
                      <Badge variant={mediumCharacteristics.type === "guiado" ? "default" : "secondary"}>
                        {mediumCharacteristics.type}
                      </Badge>
                    </div>
                    <div>Pérdida: {mediumCharacteristics.lossPerKm} dB/km</div>
                    <div>Capacidad máx: {mediumCharacteristics.maxCapacity} Mbps</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signal-type">Tipo de Señal</Label>
                <Select value={signalType} onValueChange={setSignalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {signalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Parámetros de Entrada</h3>

                <div className="space-y-2">
                  <Label htmlFor="input-voltage">Voltaje de Entrada (V)</Label>
                  <Input
                    id="input-voltage"
                    type="number"
                    value={inputVoltage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setInputVoltage(Math.max(0.1, Math.min(100, value)));
                    }}
                    min="0.1"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distancia (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={distance}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setDistance(Math.max(0.1, Math.min(100, value)));
                    }}
                    min="0.1"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ambient-noise">Factor de Ruido Ambiental</Label>
                  <Input
                    id="ambient-noise"
                    type="number"
                    value={ambientNoise}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setAmbientNoise(Math.max(1, Math.min(10, value)));
                    }}
                    min="1"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Atenuador/Amplificador</h3>

                <div className="space-y-2">
                  <Label htmlFor="attenuation">Atenuación Adicional (dB)</Label>
                  <Input
                    id="attenuation"
                    type="number"
                    value={attenuation}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setAttenuation(Math.max(0, Math.min(60, value)));
                    }}
                    min="0"
                    max="60"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amplification">Amplificación (dB)</Label>
                  <Input
                    id="amplification"
                    type="number"
                    value={amplification}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setAmplification(Math.max(0, Math.min(60, value)));
                    }}
                    min="0"
                    max="60"
                    step="0.1"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  onClick={isTransmitting ? stopTransmission : startTransmission}
                  className="flex-1"
                  variant={isTransmitting ? "destructive" : "default"}
                >
                  {isTransmitting ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Detener
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Transmitir
                    </>
                  )}
                </Button>
                <Button onClick={resetSimulation} variant="outline">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Visualización de la Transmisión
              </CardTitle>
              <CardDescription>
                Medio {mediumCharacteristics?.type || "guiado"} - {mediumCharacteristics?.name || "Cable Coaxial"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Signal className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-white mt-1 text-center">TX</div>
                  <div className="text-xs text-green-400 text-center">
                    {formatNumber(calculationResult.inputVoltage, 1)}V
                  </div>
                </div>

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-white mt-1 text-center">RX</div>
                  <div className="text-xs text-blue-400 text-center">
                    {formatNumber(calculationResult.outputVoltage, 1)}V
                  </div>
                </div>

                <div className="absolute left-16 right-16 top-1/2 transform -translate-y-1/2">
                  <div
                    className={`h-3 ${mediumCharacteristics?.color || "bg-gray-600"} rounded-full relative overflow-hidden`}
                  >
                    {isTransmitting && (
                      <>
                        {signalType === "analogica" && (
                          <div className="absolute inset-0">
                            <div
                              className="w-8 h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80"
                              style={{
                                animation: "slideSignal 3s linear infinite",
                              }}
                            />
                          </div>
                        )}

                        {signalType === "digital" && (
                          <div className="absolute inset-0">
                            <div
                              className="w-4 h-full bg-cyan-400 opacity-90"
                              style={{
                                animation: "slideSignal 2s linear infinite",
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-xs text-white text-center mt-1">{formatNumber(distance, 1)} km</div>
                </div>

                {(attenuation > 0 || amplification > 0) && (
                  <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        calculationResult.finalGain > 0
                          ? "bg-green-600"
                          : calculationResult.finalGain < 0
                            ? "bg-red-600"
                            : "bg-gray-600"
                      }`}
                    >
                      {calculationResult.finalGain > 0 ? "+" : ""}
                      {formatNumber(calculationResult.finalGain, 0)}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs text-yellow-400 text-center">
                    SNR: {formatNumber(calculationResult.snr, 1)} dB
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Señal</CardTitle>
              <CardDescription>Análisis detallado de la transmisión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(calculationResult.inputVoltage)}V
                  </div>
                  <div className="text-sm text-slate-600">Voltaje Entrada</div>
                </div>

                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(calculationResult.outputVoltage)}V
                  </div>
                  <div className="text-sm text-slate-600">Voltaje Salida</div>
                </div>

                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    -{formatNumber(calculationResult.totalLoss, 1)}dB
                  </div>
                  <div className="text-sm text-slate-600">Pérdida Total</div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(calculationResult.snr, 1)}dB</div>
                  <div className="text-sm text-slate-600">SNR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Características del Canal</CardTitle>
              <CardDescription>Capacidad y eficiencia del medio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatNumber(calculationResult.channelCapacity, 0)}
                  </div>
                  <div className="text-sm text-slate-600">Capacidad (Mbps)</div>
                </div>

                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatNumber(calculationResult.efficiency, 1)}%
                  </div>
                  <div className="text-sm text-slate-600">Eficiencia</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{mediumCharacteristics?.bandwidth || 0}</div>
                  <div className="text-sm text-slate-600">Ancho Banda (MHz)</div>
                </div>

                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatNumber(calculationResult.noiseLevel, 1)}
                  </div>
                  <div className="text-sm text-slate-600">Ruido (dBm)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cálculos Aplicados</CardTitle>
            <CardDescription>Fórmulas utilizadas en la simulación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">Ganancia/Pérdida en dB:</h4>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  dB = 20 × log₁₀(V₂/V₁) = {formatNumber(calculationResult.finalGain)} dB
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">Capacidad de Shannon:</h4>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  C = B × log₂(1 + SNR) = {formatNumber(calculationResult.channelCapacity, 0)} Mbps
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">Pérdida del Medio:</h4>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  L = {mediumCharacteristics?.lossPerKm || 0} × {formatNumber(distance, 1)} ={" "}
                  {formatNumber(calculationResult.mediumLoss, 1)} dB
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">SNR (Signal-to-Noise):</h4>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  SNR = P_señal - P_ruido = {formatNumber(calculationResult.snr, 1)} dB
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes slideSignal {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(calc(100vw - 300px));
          }
        }
      `}</style>
    </div>
  )
}