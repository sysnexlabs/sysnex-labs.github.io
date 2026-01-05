import React from 'react'

/**
 * Execution Timeline Component
 *
 * Visualizes simulation execution events over time
 */
export default function ExecutionTimeline({ timeline, totalDuration }) {
  if (!timeline || timeline.length === 0) {
    return <div className="timeline-empty">No execution events found.</div>
  }

  const width = 800
  const height = Math.max(400, timeline.length * 40)
  const margin = { top: 40, right: 30, bottom: 50, left: 200 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // Time scale
  const maxTime = totalDuration || Math.max(...timeline.map(e => e.time)) + 100
  const timeScale = (time) => (time / maxTime) * chartWidth

  // Group events by type for color coding
  const getEventColor = (type) => {
    switch (type) {
      case 'transition':
        return 'var(--color-success)'
      case 'action_start':
        return 'var(--brand-cyan)'
      case 'calculation':
        return 'var(--brand-purple)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getEventLabel = (event) => {
    switch (event.type) {
      case 'transition':
        return `${event.from} → ${event.to}`
      case 'action_start':
        return `Action: ${event.action}`
      case 'calculation':
        return `Calc: ${event.calculation}`
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="execution-timeline">
      <h5>Execution Timeline</h5>
      <p className="timeline-description">
        Simulated execution sequence showing state transitions, actions, and calculations over time.
      </p>

      <svg width={width} height={height} className="timeline-svg">
        {/* Timeline axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left + chartWidth}
          y2={margin.top}
          stroke="var(--border-color)"
          strokeWidth="2"
        />

        {/* Time markers */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
          const x = margin.left + chartWidth * fraction
          const time = Math.round(maxTime * fraction)
          return (
            <g key={i}>
              <line
                x1={x}
                y1={margin.top}
                x2={x}
                y2={margin.top + 10}
                stroke="var(--border-color)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={margin.top - 10}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-secondary)"
              >
                {time}ms
              </text>
            </g>
          )
        })}

        {/* Events */}
        {timeline.map((event, idx) => {
          const x = margin.left + timeScale(event.time)
          const y = margin.top + 30 + idx * 35
          const color = getEventColor(event.type)
          const label = getEventLabel(event)

          return (
            <g key={idx}>
              {/* Event marker */}
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />

              {/* Event label */}
              <text
                x={margin.left - 10}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                fontSize="11"
                fill="var(--text-primary)"
              >
                {label}
              </text>

              {/* Time label */}
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-secondary)"
              >
                {event.time}ms
              </text>

              {/* Duration bar for actions */}
              {event.duration && (
                <rect
                  x={x}
                  y={y - 3}
                  width={timeScale(event.duration)}
                  height="6"
                  fill={color}
                  opacity="0.3"
                  rx="3"
                />
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g transform={`translate(${margin.left}, ${height - 30})`}>
          <circle cx="0" cy="0" r="5" fill="var(--color-success)" />
          <text x="10" y="0" alignmentBaseline="middle" fontSize="10" fill="var(--text-secondary)">
            State Transition
          </text>

          <circle cx="120" cy="0" r="5" fill="var(--brand-cyan)" />
          <text x="130" y="0" alignmentBaseline="middle" fontSize="10" fill="var(--text-secondary)">
            Action
          </text>

          <circle cx="200" cy="0" r="5" fill="var(--brand-purple)" />
          <text x="210" y="0" alignmentBaseline="middle" fontSize="10" fill="var(--text-secondary)">
            Calculation
          </text>
        </g>
      </svg>
    </div>
  )
}
