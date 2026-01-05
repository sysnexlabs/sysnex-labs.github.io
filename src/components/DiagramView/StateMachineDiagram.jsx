import React, { useMemo } from 'react'

/**
 * State Machine Diagram Visualization
 *
 * Renders SysML state machines with states and transitions
 */
export default function StateMachineDiagram({ states, actions }) {
  // Generate state machine layout
  const diagram = useMemo(() => {
    if (!states || states.length === 0) return { stateNodes: [], transitions: [] }

    const stateNodes = []
    const transitions = []

    // Layout configuration
    const stateWidth = 140
    const stateHeight = 60
    const horizontalSpacing = 120
    const verticalSpacing = 100
    const statesPerRow = Math.min(4, states.length)

    // Add initial pseudo-state
    stateNodes.push({
      id: 'initial',
      name: '',
      type: 'initial',
      x: 80,
      y: 80,
      width: 20,
      height: 20,
    })

    // Position states
    states.forEach((state, index) => {
      const row = Math.floor(index / statesPerRow)
      const col = index % statesPerRow
      const x = 180 + col * (stateWidth + horizontalSpacing)
      const y = 80 + row * (stateHeight + verticalSpacing)

      // Extract entry/exit/do activities from nested elements
      const activities = {
        entry: [],
        exit: [],
        do: [],
      }

      if (state.nested_elements) {
        state.nested_elements.forEach(nested => {
          const nestedKind = nested.kind?.toLowerCase() || ''
          const nestedTitle = nested.title?.toLowerCase() || ''

          if (nestedTitle.includes('entry') || nestedKind.includes('entry')) {
            activities.entry.push(nested.title)
          } else if (nestedTitle.includes('exit') || nestedKind.includes('exit')) {
            activities.exit.push(nested.title)
          } else if (nestedKind.includes('action') || nestedTitle.includes('do')) {
            activities.do.push(nested.title)
          }
        })
      }

      stateNodes.push({
        id: `state-${index}`,
        name: state.title,
        type: 'state',
        x,
        y,
        width: stateWidth,
        height: stateHeight,
        activities,
        doc: state.doc_comment,
      })

      // Connect initial state to first state
      if (index === 0) {
        transitions.push({
          id: 'initial-transition',
          from: 'initial',
          to: `state-0`,
          fromX: 90,
          fromY: 80,
          toX: x,
          toY: y + stateHeight / 2,
          label: '',
        })
      }

      // Create transitions between sequential states
      if (index < states.length - 1) {
        const nextIndex = index + 1
        const nextRow = Math.floor(nextIndex / statesPerRow)
        const nextCol = nextIndex % statesPerRow
        const nextX = 180 + nextCol * (stateWidth + horizontalSpacing)
        const nextY = 80 + nextRow * (stateHeight + verticalSpacing)

        transitions.push({
          id: `trans-${index}-${nextIndex}`,
          from: `state-${index}`,
          to: `state-${nextIndex}`,
          fromX: x + stateWidth,
          fromY: y + stateHeight / 2,
          toX: nextX,
          toY: nextY + stateHeight / 2,
          label: `event_${index + 1}`,
        })
      }
    })

    // Add final pseudo-state connected to last state
    if (states.length > 0) {
      const lastIndex = states.length - 1
      const lastRow = Math.floor(lastIndex / statesPerRow)
      const lastCol = lastIndex % statesPerRow
      const lastX = 180 + lastCol * (stateWidth + horizontalSpacing)
      const lastY = 80 + lastRow * (stateHeight + verticalSpacing)

      const finalX = lastX + stateWidth + horizontalSpacing
      const finalY = lastY + stateHeight / 2

      stateNodes.push({
        id: 'final',
        name: '',
        type: 'final',
        x: finalX,
        y: finalY - 15,
        width: 30,
        height: 30,
      })

      transitions.push({
        id: 'final-transition',
        from: `state-${lastIndex}`,
        to: 'final',
        fromX: lastX + stateWidth,
        fromY: lastY + stateHeight / 2,
        toX: finalX,
        toY: finalY,
        label: 'complete',
      })
    }

    console.log('🎬 [StateMachineDiagram] Generated states:', stateNodes.length)
    console.log('🎬 [StateMachineDiagram] Generated transitions:', transitions.length)

    return { stateNodes, transitions }
  }, [states])

  if (!states || states.length === 0) {
    return (
      <div className="diagram-empty">
        No state machines found. Define states using <code>state def</code> syntax to see STM visualization.
      </div>
    )
  }

  // Calculate SVG dimensions
  const maxX = Math.max(...diagram.stateNodes.map(s => s.x + s.width), 400)
  const maxY = Math.max(...diagram.stateNodes.map(s => s.y + s.height), 400)
  const width = maxX + 100
  const height = maxY + 100

  return (
    <div className="state-diagram-container">
      <div className="diagram-legend">
        <div className="legend-item">
          <div className="legend-symbol initial-state"></div>
          <span>Initial State</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol normal-state"></div>
          <span>State</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol final-state"></div>
          <span>Final State</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol transition-line"></div>
          <span>Transition</span>
        </div>
      </div>

      <svg
        className="state-diagram-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define markers */}
        <defs>
          <marker
            id="transition-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <path
              d="M 0,0 L 10,5 L 0,10 z"
              fill="#2c3e50"
            />
          </marker>
        </defs>

        {/* Render transitions first */}
        {diagram.transitions.map((trans) => {
          const midX = (trans.fromX + trans.toX) / 2
          const midY = (trans.fromY + trans.toY) / 2

          // Curved transition path
          const path = `M ${trans.fromX},${trans.fromY} Q ${midX},${midY - 20} ${trans.toX},${trans.toY}`

          return (
            <g key={trans.id}>
              <path
                d={path}
                stroke="#2c3e50"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#transition-arrow)"
              />
              {trans.label && (
                <text
                  x={midX}
                  y={midY - 25}
                  fontSize="11"
                  fill="#666"
                  textAnchor="middle"
                  fontStyle="italic"
                >
                  {trans.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Render state nodes */}
        {diagram.stateNodes.map((node) => {
          if (node.type === 'initial') {
            // Initial pseudo-state (filled circle)
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill="#2c3e50"
                  stroke="#2c3e50"
                  strokeWidth="2"
                />
              </g>
            )
          } else if (node.type === 'final') {
            // Final pseudo-state (double circle)
            return (
              <g key={node.id}>
                <circle
                  cx={node.x + 15}
                  cy={node.y + 15}
                  r="15"
                  fill="none"
                  stroke="#2c3e50"
                  strokeWidth="2"
                />
                <circle
                  cx={node.x + 15}
                  cy={node.y + 15}
                  r="10"
                  fill="#2c3e50"
                  stroke="#2c3e50"
                  strokeWidth="2"
                />
              </g>
            )
          } else {
            // Normal state (rounded rectangle)
            return (
              <g key={node.id} className="state-node">
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill="#e8f4f8"
                  stroke="#2c3e50"
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x={node.x + node.width / 2}
                  y={node.y + 20}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#2c3e50"
                >
                  {node.name}
                </text>

                {/* Activities */}
                {node.activities.entry.length > 0 && (
                  <text
                    x={node.x + 5}
                    y={node.y + 35}
                    fontSize="10"
                    fill="#666"
                  >
                    entry / {node.activities.entry[0]}
                  </text>
                )}
                {node.activities.do.length > 0 && (
                  <text
                    x={node.x + 5}
                    y={node.y + 48}
                    fontSize="10"
                    fill="#666"
                  >
                    do / {node.activities.do[0]}
                  </text>
                )}
              </g>
            )
          }
        })}
      </svg>
    </div>
  )
}
