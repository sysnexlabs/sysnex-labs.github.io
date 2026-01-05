import React from 'react'

/**
 * State Transition Graph Component
 *
 * Visualizes state machine transitions as a directed graph
 */
export default function StateTransitionGraph({ stateMachine }) {
  if (!stateMachine || !stateMachine.states || stateMachine.states.length === 0) {
    return <div className="graph-empty">No state machine data available.</div>
  }

  const { states, transitions } = stateMachine

  // Layout configuration
  const width = 700
  const stateRadius = 50
  const horizontalSpacing = 150
  const verticalSpacing = 120

  // Calculate layout (simple horizontal flow)
  const statesPerRow = Math.min(4, states.length)
  const rows = Math.ceil(states.length / statesPerRow)
  const height = Math.max(300, 100 + rows * (stateRadius * 2 + verticalSpacing))

  const statePositions = {}
  states.forEach((state, idx) => {
    const row = Math.floor(idx / statesPerRow)
    const col = idx % statesPerRow
    const x = 150 + col * horizontalSpacing
    const y = 100 + row * (stateRadius * 2 + verticalSpacing)
    statePositions[state.id] = { x, y, state }
  })

  return (
    <div className="state-transition-graph">
      <h5>{stateMachine.name}</h5>
      <p className="graph-description">
        Interactive state machine showing {states.length} states and {transitions.length} transitions.
      </p>

      <svg width={width} height={height} className="graph-svg">
        <defs>
          {/* Arrow marker for transitions */}
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0,0 L 10,5 L 0,10 z" fill="var(--brand-cyan)" />
          </marker>
        </defs>

        {/* Transitions (arrows) */}
        {transitions.map((trans, idx) => {
          const from = statePositions[trans.from]
          const to = statePositions[trans.to]

          if (!from || !to) return null

          // Calculate arrow path with curve
          const dx = to.x - from.x
          const dy = to.y - from.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Adjust endpoints to stop at state circle edges
          const angle = Math.atan2(dy, dx)
          const fromX = from.x + stateRadius * Math.cos(angle)
          const fromY = from.y + stateRadius * Math.sin(angle)
          const toX = to.x - stateRadius * Math.cos(angle)
          const toY = to.y - stateRadius * Math.sin(angle)

          // Control point for curve
          const midX = (fromX + toX) / 2
          const midY = (fromY + toY) / 2 - 30

          const path = `M ${fromX},${fromY} Q ${midX},${midY} ${toX},${toY}`

          return (
            <g key={idx}>
              {/* Transition arrow */}
              <path
                d={path}
                stroke="var(--brand-cyan)"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrow)"
              />

              {/* Event label */}
              <text
                x={midX}
                y={midY - 10}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-secondary)"
                fontStyle="italic"
              >
                {trans.event}
              </text>
            </g>
          )
        })}

        {/* States (circles) */}
        {states.map((state) => {
          const pos = statePositions[state.id]
          if (!pos) return null

          const isInitial = state.id === 0
          const isFinal = state.id === states.length - 1

          return (
            <g key={state.id} className="state-node">
              {/* State circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={stateRadius}
                fill={isInitial ? 'var(--color-success)' : isFinal ? 'var(--color-warning)' : 'var(--bg-tertiary)'}
                stroke={isInitial || isFinal ? 'var(--accent-primary)' : 'var(--border-color)'}
                strokeWidth="3"
                opacity="0.9"
              />

              {/* State name */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill={isInitial || isFinal ? 'white' : 'var(--text-primary)'}
              >
                {state.name}
              </text>

              {/* Initial/Final indicator */}
              {isInitial && (
                <text
                  x={pos.x}
                  y={pos.y + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="bold"
                >
                  INITIAL
                </text>
              )}
              {isFinal && (
                <text
                  x={pos.x}
                  y={pos.y + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="bold"
                >
                  FINAL
                </text>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(50, 20)">
          <circle cx="0" cy="0" r="15" fill="var(--color-success)" stroke="var(--accent-primary)" strokeWidth="2" />
          <text x="20" y="0" alignmentBaseline="middle" fontSize="10" fill="var(--text-secondary)">
            Initial State
          </text>

          <circle cx="120" cy="0" r="15" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="2" />
          <text x="140" y="0" alignmentBaseline="middle" fontSize="10" fill="var(--text-secondary)">
            State
          </text>

          <circle cx="200" cy="0" r="15" fill="var(--color-warning)" stroke="var(--accent-primary)" strokeWidth="2" />
          <text x="220" y="0" alignmentBaseline="middle" fontSize="10" fill="var(--text-secondary)">
            Final State
          </text>
        </g>
      </svg>
    </div>
  )
}
