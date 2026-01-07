import React, { useEffect, useRef, useState, useCallback } from 'react'
import './ChargingCharts.css'

/**
 * ChargingCharts Component
 * 
 * Displays three charts:
 * 1. State of Charge Over Time
 * 2. Voltage & Current Profile (CC-CV)
 * 3. Power & Temperature
 */
export default function ChargingCharts({ history }) {
  const socChartRef = useRef(null)
  const vcChartRef = useRef(null)
  const powerChartRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 })

  // Handle window resize
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const newWidth = Math.max(300, Math.min(1200, containerWidth - 40))
      const newHeight = Math.max(200, Math.floor(newWidth * 0.375)) // 3:8 aspect ratio
      setDimensions({ width: newWidth, height: newHeight })
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [updateDimensions])

  useEffect(() => {
    if (!history || history.length === 0) {
      // Clear canvases if no history
      [socChartRef, vcChartRef, powerChartRef].forEach(ref => {
        if (ref.current) {
          const ctx = ref.current.getContext('2d')
          ctx.clearRect(0, 0, ref.current.width, ref.current.height)
        }
      })
      return
    }

    // Validate history data
    const validHistory = history.filter(h => 
      h && 
      typeof h.soc === 'number' && 
      typeof h.voltage === 'number' && 
      typeof h.current === 'number' &&
      typeof h.temperature === 'number' &&
      typeof h.power === 'number' &&
      typeof h.time === 'number'
    )

    if (validHistory.length === 0) {
      console.warn('No valid history data to display')
      return
    }

    // Draw line chart helper
    const drawLineChart = (canvas, data, labels, colors, yMax, yLabel) => {
      if (!canvas || !data || data.length === 0 || data[0].length === 0) return
      
      try {
        const ctx = canvas.getContext('2d')
        const width = canvas.width
        const height = canvas.height
        const padding = 50
        const graphWidth = Math.max(0, width - 2 * padding)
        const graphHeight = Math.max(0, height - 2 * padding)

        if (graphWidth <= 0 || graphHeight <= 0) return

        ctx.clearRect(0, 0, width, height)

        // Grid
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)'
        ctx.lineWidth = 1
        for (let i = 0; i <= 5; i++) {
          const y = padding + (graphHeight / 5) * i
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(width - padding, y)
          ctx.stroke()

          // Y-axis labels
          ctx.fillStyle = '#94a3b8'
          ctx.font = '12px monospace'
          ctx.textAlign = 'right'
          ctx.fillText(Math.round(yMax * (1 - i / 5)), padding - 10, y + 5)
        }

        // X-axis labels
        ctx.fillStyle = '#94a3b8'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        const step = Math.max(1, Math.ceil(data[0].length / 10))
        for (let i = 0; i < data[0].length; i += step) {
          const x = padding + (graphWidth / Math.max(1, data[0].length - 1)) * i
          ctx.fillText(labels[i] || i, x, height - padding + 20)
        }

        // Y-axis label
        ctx.save()
        ctx.translate(15, height / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillStyle = '#94a3b8'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(yLabel, 0, 0)
        ctx.restore()

        // Draw lines
        data.forEach((dataset, index) => {
          if (!dataset || dataset.length === 0) return
          
          ctx.beginPath()
          ctx.strokeStyle = colors[index] || '#667eea'
          ctx.lineWidth = 3
          ctx.shadowBlur = 10
          ctx.shadowColor = colors[index] || '#667eea'

          dataset.forEach((value, i) => {
            if (typeof value !== 'number' || !isFinite(value)) return
            
            const x = padding + (graphWidth / Math.max(1, dataset.length - 1)) * i
            const y = padding + graphHeight - (value / yMax) * graphHeight
            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          })

          ctx.stroke()
          ctx.shadowBlur = 0
        })
      } catch (error) {
        console.error('Error drawing chart:', error)
      }
    }

    // Extract data from valid history
    const socHistory = validHistory.map(h => Math.max(0, Math.min(100, h.soc)))
    const voltageHistory = validHistory.map(h => Math.max(0, h.voltage))
    const currentHistory = validHistory.map(h => Math.max(0, h.current))
    const powerHistory = validHistory.map(h => Math.max(0, h.power))
    const tempHistory = validHistory.map(h => Math.max(0, h.temperature))
    const timeLabels = validHistory.map((h, i) => {
      const minutes = Math.floor(h.time / 60)
      return minutes > 0 ? `${minutes}m` : `${Math.floor(h.time)}s`
    })

    // Setup canvases with responsive dimensions
    const setupCanvas = (ref) => {
      if (ref.current) {
        // Use device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1
        ref.current.width = dimensions.width * dpr
        ref.current.height = dimensions.height * dpr
        const ctx = ref.current.getContext('2d')
        ctx.scale(dpr, dpr)
        ref.current.style.width = `${dimensions.width}px`
        ref.current.style.height = `${dimensions.height}px`
      }
    }

    setupCanvas(socChartRef)
    setupCanvas(vcChartRef)
    setupCanvas(powerChartRef)

    // Draw SOC chart
    if (socChartRef.current && socHistory.length > 0) {
      drawLineChart(
        socChartRef.current,
        [socHistory],
        timeLabels,
        ['#10b981'],
        100,
        'SOC (%)'
      )
    }

    // Draw Voltage/Current chart
    if (vcChartRef.current && voltageHistory.length > 0 && currentHistory.length > 0) {
      const maxVoltage = Math.max(...voltageHistory, 1)
      const scaledCurrent = currentHistory.map(c => c * 3) // Scale current for visibility
      drawLineChart(
        vcChartRef.current,
        [voltageHistory, scaledCurrent],
        timeLabels,
        ['#3b82f6', '#f59e0b'],
        maxVoltage,
        'Voltage (V) / Current (A×3)'
      )
    }

    // Draw Power/Temperature chart
    if (powerChartRef.current && powerHistory.length > 0 && tempHistory.length > 0) {
      const maxValue = Math.max(...powerHistory, ...tempHistory, 1)
      drawLineChart(
        powerChartRef.current,
        [powerHistory, tempHistory],
        timeLabels,
        ['#a78bfa', '#ef4444'],
        maxValue,
        'Power (kW) / Temp (°C)'
      )
    }
  }, [history, dimensions])

  if (!history || history.length === 0) {
    return (
      <div className="charging-charts">
        <div className="charts-empty">
          Start the simulation to see charging curves
        </div>
      </div>
    )
  }

  return (
    <div className="charging-charts" ref={containerRef}>
      <h3>Charging Curves</h3>
      
      <div className="chart-container">
        <h4>State of Charge Over Time</h4>
        <canvas ref={socChartRef} className="chart-canvas"></canvas>
      </div>

      <div className="chart-container">
        <h4>Voltage & Current Profile (CC-CV)</h4>
        <canvas ref={vcChartRef} className="chart-canvas"></canvas>
      </div>

      <div className="chart-container">
        <h4>Power & Temperature</h4>
        <canvas ref={powerChartRef} className="chart-canvas"></canvas>
      </div>
    </div>
  )
}

