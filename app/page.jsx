"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { simularTransmision } from "../services/transmission-service.js"

export default function SimuladorTransmision() {
  const [medioTransmision, setMedioTransmision] = useState("")
  const [distancia, setDistancia] = useState("")
  const [tipoSenal, setTipoSenal] = useState("")
  const [anchoBanda, setAnchoBanda] = useState("")
  const [nivelRuido, setNivelRuido] = useState("")
  const [resultados, setResultados] = useState({
    atenuacion: 0,
    snr: 0,
    velocidadEfectiva: 0,
    interferencia: "-",
    capacidadTeorica: 0,
  })
  const [simulado, setSimulado] = useState(false)
  const [error, setError] = useState("")

  const handleSimular = () => {
    try {
      setError("")

      // Convertir strings a números, manejando comas como separadores decimales
      const parametros = {
        medioTransmision: medioTransmision.toLowerCase().replace(/\s+/g, "_"),
        distancia: parseFloat(distancia.replace(",", ".")),
        tipoSenal: tipoSenal.toLowerCase(),
        anchoBanda: parseFloat(anchoBanda.replace(",", ".")),
        nivelRuido: parseFloat(nivelRuido.replace(",", ".")),
      }

      // Validar que todos los campos estén completos
      if (
        !parametros.medioTransmision ||
        isNaN(parametros.distancia) ||
        !parametros.tipoSenal ||
        isNaN(parametros.anchoBanda) ||
        isNaN(parametros.nivelRuido)
      ) {
        throw new Error("Por favor complete todos los campos con valores válidos")
      }

      const resultadosCalculados = simularTransmision(parametros)
      setResultados(resultadosCalculados)
      setSimulado(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el cálculo")
      setSimulado(false)
    }
  }

  const isFormValid = () => {
    return (
      medioTransmision.trim() !== "" &&
      distancia.trim() !== "" &&
      tipoSenal.trim() !== "" &&
      anchoBanda.trim() !== "" &&
      nivelRuido.trim() !== ""
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cabecera */}
      <header className="bg-gray-200 p-4">
        <h1 className="text-2xl font-bold text-center">Simulador de Transmisión</h1>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Aside - Controles */}
        <aside className="w-full md:w-1/4 bg-white p-4 border-r">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Medio de transmisión</label>
              <Input
                type="text"
                value={medioTransmision}
                onChange={(e) => setMedioTransmision(e.target.value)}
                placeholder="ej: coaxial, fibra, radiofrecuencia"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opciones: coaxial, fibra, radiofrecuencia, par trenzado, microondas
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">Distancia (m)</label>
              <Input
                type="text"
                value={distancia}
                onChange={(e) => setDistancia(e.target.value)}
                placeholder="ej: 100 o 100,5"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Tipo de señal</label>
              <Input
                type="text"
                value={tipoSenal}
                onChange={(e) => setTipoSenal(e.target.value)}
                placeholder="analógica o digital"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Ancho de banda (MHz)</label>
              <Input
                type="text"
                value={anchoBanda}
                onChange={(e) => setAnchoBanda(e.target.value)}
                placeholder="ej: 20 o 20,5"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Nivel de ruido (dB)</label>
              <Input
                type="text"
                value={nivelRuido}
                onChange={(e) => setNivelRuido(e.target.value)}
                placeholder="ej: 5 o 5,2"
              />
            </div>

            {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

            <Button
              className="w-full bg-gray-200 hover:bg-gray-300 text-black"
              onClick={handleSimular}
              disabled={!isFormValid()}
            >
              Simular
            </Button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 bg-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Área de visualización */}
            <div className="w-full md:w-2/3 bg-white p-4 rounded-lg flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                {simulado ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-black rounded-md"></div>
                        <div className="w-16 h-2 bg-black"></div>
                        <svg width="200" height="100" viewBox="0 0 200 100">
                          <path
                            d="M0,50 Q25,0 50,50 T100,50 T150,50 T200,50"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="3"
                          />
                        </svg>
                        <div className="w-16 h-2 bg-black"></div>
                        <div className="w-6 h-6 border-t-2 border-r-2 border-black transform rotate-45"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Simulación de transmisión {tipoSenal} a través de {medioTransmision}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Distancia: {distancia}m | Ancho de banda: {anchoBanda}MHz
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Complete los parámetros y haga clic en "Simular" para ver la visualización
                  </p>
                )}
              </div>
            </div>

            {/* Resultados */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Resultados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Atenuación (dB)</h3>
                    <p className="text-2xl font-bold">{resultados.atenuacion}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Relación señal-ruido (SNR)</h3>
                    <p className="text-2xl font-bold">{resultados.snr} dB</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Velocidad efectiva (BPS)</h3>
                    <p className="text-2xl font-bold">{resultados.velocidadEfectiva.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Interferencia predominante</h3>
                    <p className="text-2xl font-bold">{resultados.interferencia}</p>
                  </div>
                  {simulado && (
                    <div className="pt-2 border-t">
                      <h3 className="font-medium text-sm">Capacidad teórica (Shannon)</h3>
                      <p className="text-lg font-semibold text-gray-600">
                        {resultados.capacidadTeorica.toLocaleString()} bps
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
