import React, { useEffect, useRef } from 'react'
import './PhysicsGauges.css'

/**
 * PhysicsGauges Component
 *
 * Displays real-time physics data with beautiful circular gauges:
 * - State of Charge (SOC)
 * - Voltage
 * - Current
 * - Temperature
 *
 * Uses Canvas for smooth gauge rendering
 */
export default function PhysicsGauges({ physicsData }) {
  const socCanvasRef = useRef(null)
  const voltageCanvasRef = useRef(null)
  const currentCanvasRef = useRef(null)
  const tempCanvasRef = useRef(null)

  const {
    soc = 20,
    voltage = 350,
    current = 120,
    temperature = 25,
    phase = 'Idle'
  } = physicsData || {}

  // Draw circular gauge
  const drawGauge = (canvas, value, max, color1, color2, unit = '%') => {
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI)
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)'
    ctx.lineWidth = 20
    ctx.stroke()

    // Value arc with gradient
    const angle = 0.75 * Math.PI + (value / max) * 1.5 * Math.PI
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, color1)
    gradient.addColorStop(1, color2)

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.stroke()

    // Glow effect
    ctx.shadowBlur = 15
    ctx.shadowColor = color2
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  useEffect(() => {
    // Draw SOC gauge
    if (socCanvasRef.current) {
      const canvas = socCanvasRef.current
      canvas.width = 200
      canvas.height = 200
      drawGauge(canvas, soc, 100, '#10b981', '#34d399', '%')
    }

    // Draw Voltage gauge
    if (voltageCanvasRef.current) {
      const canvas = voltageCanvasRef.current
      canvas.width = 200
      canvas.height = 200
      drawGauge(canvas, voltage, 420, '#3b82f6', '#60a5fa', 'V')
    }

    // Draw Current gauge
    if (currentCanvasRef.current) {
      const canvas = currentCanvasRef.current
      canvas.width = 200
      canvas.height = 200
      drawGauge(canvas, current, 140, '#f59e0b', '#fbbf24', 'A')
    }

    // Draw Temperature gauge
    if (tempCanvasRef.current) {
      const canvas = tempCanvasRef.current
      canvas.width = 200
      canvas.height = 200
      const tempColor = temperature > 40 ? ['#ef4444', '#f87171'] : ['#10b981', '#34d399']
      drawGauge(canvas, temperature, 60, tempColor[0], tempColor[1], '°C')
    }
  }, [soc, voltage, current, temperature])

  return (
    <div className="physics-gauges">
      <h3 className="gauges-title">Real-Time Physics</h3>

      <div className="gauges-grid">
        {/* SOC Gauge */}
        <div className="gauge-container">
          <h4>State of Charge</h4>
          <div className="gauge">
            <canvas ref={socCanvasRef}></canvas>
            <div className="gauge-value">{Math.round(soc)}%</div>
          </div>
          <div className="gauge-label">Battery SOC</div>
          <div className="gauge-sublabel">{phase}</div>
        </div>

        {/* Voltage Gauge */}
        <div className="gauge-container">
          <h4>Voltage</h4>
          <div className="gauge">
            <canvas ref={voltageCanvasRef}></canvas>
            <div className="gauge-value">{Math.round(voltage)}V</div>
          </div>
          <div className="gauge-label">Battery Voltage</div>
          <div className="gauge-sublabel">CC-CV Charging</div>
        </div>

        {/* Current Gauge */}
        <div className="gauge-container">
          <h4>Current</h4>
          <div className="gauge">
            <canvas ref={currentCanvasRef}></canvas>
            <div className="gauge-value">{Math.round(current)}A</div>
          </div>
          <div className="gauge-label">Charging Current</div>
          <div className="gauge-sublabel">
            {current > 100 ? 'Constant Current' : current > 10 ? 'Tapering' : 'Complete'}
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="gauge-container">
          <h4>Temperature</h4>
          <div className="gauge">
            <canvas ref={tempCanvasRef}></canvas>
            <div className="gauge-value">{Math.round(temperature)}°C</div>
          </div>
          <div className="gauge-label">Battery Temperature</div>
          <div className="gauge-sublabel" style={{
            color: temperature > 40 ? '#ef4444' : '#10b981'
          }}>
            {temperature > 40 ? 'Elevated' : 'Normal'}
          </div>
        </div>
      </div>

      {/* Energy Flow Diagram */}
      <div className="energy-flow">
        <h4>Energy Flow Visualization</h4>
        <div className="flow-diagram">
          <div className="flow-component">
            <div className="flow-icon charger">⚡</div>
            <div className="flow-name">Charger</div>
            <div className="flow-power">
              {((voltage * current) / 1000).toFixed(1)} kW
            </div>
          </div>
          <div className="flow-arrow"></div>
          <div className="flow-component">
            <div className="flow-icon battery">🔋</div>
            <div className="flow-name">Battery</div>
            <div className="flow-capacity">75 kWh</div>
          </div>
        </div>
      </div>

      {/* Physics Calculations Dashboard */}
      <div className="physics-dashboard">
        <h4>Real-Time Calculations</h4>
        <div className="physics-cards">
          <div className="physics-card">
            <h5>Power</h5>
            <div className="physics-value">
              {((voltage * current) / 1000).toFixed(1)} kW
            </div>
            <div className="physics-formula">P = V × I</div>
          </div>

          <div className="physics-card">
            <h5>Energy Delivered</h5>
            <div className="physics-value">
              {((soc - 20) * 0.75).toFixed(2)} kWh
            </div>
            <div className="physics-formula">E = ∫ P dt</div>
          </div>

          <div className="physics-card">
            <h5>Charging Phase</h5>
            <div className="physics-value" style={{ fontSize: '1.5em' }}>
              {phase}
            </div>
            <div className="physics-formula">
              {soc < 80 ? 'CC Mode' : soc < 100 ? 'CV Mode' : 'Complete'}
            </div>
          </div>

          <div className="physics-card">
            <h5>Efficiency</h5>
            <div className="physics-value">95%</div>
            <div className="physics-formula">η = E_out / E_in</div>
          </div>
        </div>
      </div>
    </div>
  )
}
