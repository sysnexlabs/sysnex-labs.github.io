import React from 'react'
import './BatterySimulationControls.css'

/**
 * BatterySimulationControls Component
 *
 * Provides interactive controls for the battery charging simulation:
 * - Start/Pause button
 * - Speed slider (0.5x to 10x)
 * - Restart button
 */
export default function BatterySimulationControls({
  isRunning = false,
  speed = 1,
  onToggleRunning,
  onSpeedChange,
  onRestart
}) {
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' }
  ]

  return (
    <div className="battery-sim-controls">
      <div className="controls-header">
        <h3>Simulation Controls</h3>
      </div>

      <div className="controls-grid">
        {/* Start/Pause Button */}
        <div className="control-item">
          <button
            className={`control-button ${isRunning ? 'pause' : 'start'}`}
            onClick={onToggleRunning}
            style={{
              background: isRunning
                ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: isRunning
                ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                : '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = isRunning
                ? '0 6px 16px rgba(245, 158, 11, 0.4)'
                : '0 6px 16px rgba(16, 185, 129, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = isRunning
                ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                : '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <span style={{ fontSize: '1.2em' }}>{isRunning ? '⏸' : '▶'}</span>
            <span>{isRunning ? 'Pause' : 'Start'} Simulation</span>
          </button>
        </div>

        {/* Speed Control */}
        <div className="control-item">
          <label className="control-label">
            Simulation Speed: <strong>{speed}x</strong>
          </label>
          <div className="speed-control">
            <input
              type="range"
              min="0"
              max={speedOptions.length - 1}
              step="1"
              value={speedOptions.findIndex(opt => opt.value === speed)}
              onChange={(e) => {
                const index = parseInt(e.target.value, 10)
                onSpeedChange(speedOptions[index].value)
              }}
              className="speed-slider"
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <div className="speed-labels">
              {speedOptions.map((opt, idx) => (
                <span
                  key={idx}
                  className={`speed-label ${speed === opt.value ? 'active' : ''}`}
                  style={{
                    fontSize: '0.75em',
                    opacity: speed === opt.value ? 1 : 0.5,
                    fontWeight: speed === opt.value ? '600' : '400',
                    color: speed === opt.value ? '#667eea' : '#6b7280',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {opt.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="control-item">
          <button
            className="control-button restart"
            onClick={onRestart}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            <span style={{ fontSize: '1.2em' }}>🔄</span>
            <span>Restart</span>
          </button>
        </div>
      </div>

      <div className="controls-info">
        <p style={{
          fontSize: '0.85em',
          opacity: 0.7,
          margin: '0.5rem 0 0 0',
          padding: '0.5rem',
          background: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '4px',
          borderLeft: '3px solid #667eea'
        }}>
          <strong>Tip:</strong> Adjust the speed to see the charging process in slow motion or fast forward.
          The simulation uses real CC-CV (Constant Current - Constant Voltage) charging physics.
        </p>
      </div>
    </div>
  )
}
