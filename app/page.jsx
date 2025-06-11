"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimuladorTransmision() {
  const [medioTransmision, setMedioTransmision] = useState("coaxial")
  const [distancia, setDistancia] = useState(0)
  const [tipoSenal, setTipoSenal] = useState("analogica")
  const [anchoBanda, setAnchoBanda] = useState(0)
  const [nivelRuido, setNivelRuido] = useState(0)
  const [resultados, setResultados] = useState({
    atenuacion: 0,
    snr: 0,
    velocidadEfectiva: 0,
    interferencia: "-",
  })
  const [simulado, setSimulado] = useState(false)

  const calcularResultados = () => {
    const atenuacion = distancia * 0.1 + (medioTransmision === "coaxial" ? 2 : 5)
    const snr = 30 - nivelRuido - atenuacion * 0.5
    const velocidadEfectiva = anchoBanda * 1000 * (snr / 30) * (tipoSenal === "digital" ? 2 : 1)

    let interferencia = "-"
    if (nivelRuido > 10) {
      interferencia = "Térmica"
    } else if (distancia > 100) {
      interferencia = "Atenuación"
    } else if (anchoBanda > 50) {
      interferencia = "Intermodulación"
    }

    setResultados({
      atenuacion: Number.parseFloat(atenuacion.toFixed(2)),
      snr: Number.parseFloat(snr.toFixed(2)),
      velocidadEfectiva: Math.round(velocidadEfectiva),
      interferencia,
    })

    setSimulado(true)
  }

  const handleSimular = () => {
    calcularResultados()
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
              <Select value={medioTransmision} onValueChange={setMedioTransmision}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar medio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coaxial">Coaxial</SelectItem>
                  <SelectItem value="fibra">Fibra óptica</SelectItem>
                  <SelectItem value="radiofrecuencia">Radiofrecuencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Distancia (m)</label>
              <Input type="number" value={distancia} onChange={(e) => setDistancia(Number(e.target.value))} min="0" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Tipo de señal</label>
              <Select value={tipoSenal} onValueChange={setTipoSenal}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analogica">Analógica</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Ancho de banda (MHz)</label>
              <Input type="number" value={anchoBanda} onChange={(e) => setAnchoBanda(Number(e.target.value))} min="0" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Nivel de ruido (dB)</label>
              <Input type="number" value={nivelRuido} onChange={(e) => setNivelRuido(Number(e.target.value))} min="0" />
            </div>

            <Button
              className="w-full bg-gray-200 hover:bg-gray-300 text-black"
              onClick={handleSimular}
              disabled={
                !medioTransmision ||
                distancia === undefined ||
                !tipoSenal ||
                anchoBanda === undefined ||
                nivelRuido === undefined
              }
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
                    <h3 className="font-medium">Atenuación</h3>
                    <p className="text-2xl font-bold">{resultados.atenuacion} dB</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Relación señal-ruido (SNR)</h3>
                    <p className="text-2xl font-bold">{resultados.snr} dB</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Velocidad efectiva</h3>
                    <p className="text-2xl font-bold">{resultados.velocidadEfectiva} bps</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Tipo de interferencia predominante</h3>
                    <p className="text-2xl font-bold">{resultados.interferencia}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
