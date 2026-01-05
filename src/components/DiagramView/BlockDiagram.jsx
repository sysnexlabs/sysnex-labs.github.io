import React, { useMemo } from 'react'

/**
 * Block Definition Diagram (BDD) Visualization
 *
 * Renders SysML parts as blocks with composition relationships
 */
export default function BlockDiagram({ parts }) {
  // Generate diagram layout
  const diagram = useMemo(() => {
    if (!parts || parts.length === 0) return { blocks: [], connections: [] }

    const blocks = []
    const connections = []

    // Layout configuration
    const blockWidth = 200
    const blockHeaderHeight = 40
    const blockAttributeHeight = 25
    const horizontalSpacing = 80
    const verticalSpacing = 120
    const blocksPerRow = 3

    parts.forEach((part, index) => {
      // Calculate position in grid layout
      const row = Math.floor(index / blocksPerRow)
      const col = index % blocksPerRow
      const x = 50 + col * (blockWidth + horizontalSpacing)
      const y = 50 + row * (blockHeaderHeight + blockAttributeHeight * 5 + verticalSpacing)

      // Extract attributes and ports from nested elements
      const attributes = []
      const ports = []
      let childParts = []

      if (part.nested_elements) {
        part.nested_elements.forEach(nested => {
          if (nested.kind?.includes('Attribute')) {
            attributes.push(nested)
          } else if (nested.kind?.includes('Port')) {
            ports.push(nested)
          } else if (nested.kind?.includes('Part')) {
            childParts.push(nested)
          }
        })
      }

      // Calculate block height based on content
      const contentCount = Math.max(attributes.length, ports.length, 1)
      const blockHeight = blockHeaderHeight + (contentCount * blockAttributeHeight) + 10

      blocks.push({
        id: `block-${index}`,
        name: part.title,
        kind: part.kind,
        x,
        y,
        width: blockWidth,
        height: blockHeight,
        attributes,
        ports,
        childParts,
        packageName: part.packageName,
      })

      // Create composition connections for child parts
      childParts.forEach(child => {
        // Find if child part exists as a top-level block
        const childIndex = parts.findIndex(p => p.title === child.title)
        if (childIndex !== -1) {
          const childRow = Math.floor(childIndex / blocksPerRow)
          const childCol = childIndex % blocksPerRow
          const childX = 50 + childCol * (blockWidth + horizontalSpacing)
          const childY = 50 + childRow * (blockHeaderHeight + blockAttributeHeight * 5 + verticalSpacing)

          connections.push({
            from: `block-${index}`,
            to: `block-${childIndex}`,
            type: 'composition',
            fromX: x + blockWidth / 2,
            fromY: y + blockHeight,
            toX: childX + blockWidth / 2,
            toY: childY,
          })
        }
      })
    })

    return { blocks, connections }
  }, [parts])

  if (!parts || parts.length === 0) {
    return (
      <div className="diagram-empty">
        No parts found. Define parts using <code>part def</code> syntax to see BDD visualization.
      </div>
    )
  }

  // Calculate SVG viewBox dimensions
  const maxX = Math.max(...diagram.blocks.map(b => b.x + b.width), 400)
  const maxY = Math.max(...diagram.blocks.map(b => b.y + b.height), 400)
  const width = maxX + 50
  const height = maxY + 50

  return (
    <div className="block-diagram-container">
      <div className="diagram-legend">
        <div className="legend-item">
          <div className="legend-symbol block-header"></div>
          <span>Part Definition</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol composition-line"></div>
          <span>Composition</span>
        </div>
      </div>

      <svg
        className="block-diagram-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define markers for composition diamond */}
        <defs>
          <marker
            id="composition-diamond"
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            orient="auto"
          >
            <polygon
              points="6,0 12,6 6,12 0,6"
              fill="black"
              stroke="black"
              strokeWidth="1"
            />
          </marker>
        </defs>

        {/* Render connections first (behind blocks) */}
        {diagram.connections.map((conn, index) => {
          // Calculate connection path with some curve
          const midY = (conn.fromY + conn.toY) / 2
          const path = `M ${conn.fromX},${conn.fromY} L ${conn.fromX},${midY} L ${conn.toX},${midY} L ${conn.toX},${conn.toY}`

          return (
            <g key={`conn-${index}`}>
              <path
                d={path}
                stroke="#666"
                strokeWidth="2"
                fill="none"
                markerStart="url(#composition-diamond)"
              />
            </g>
          )
        })}

        {/* Render blocks */}
        {diagram.blocks.map((block) => (
          <g key={block.id} className="diagram-block">
            {/* Block header */}
            <rect
              x={block.x}
              y={block.y}
              width={block.width}
              height={40}
              fill="#4a90e2"
              stroke="#2c3e50"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={block.x + block.width / 2}
              y={block.y + 12}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
            >
              «{block.kind?.replace(/[\[\]]/g, '')}»
            </text>
            <text
              x={block.x + block.width / 2}
              y={block.y + 28}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              {block.name}
            </text>

            {/* Block body */}
            <rect
              x={block.x}
              y={block.y + 40}
              width={block.width}
              height={block.height - 40}
              fill="#ecf0f1"
              stroke="#2c3e50"
              strokeWidth="2"
              rx="4"
            />

            {/* Attributes */}
            {block.attributes.map((attr, i) => (
              <text
                key={`attr-${i}`}
                x={block.x + 10}
                y={block.y + 40 + 18 + (i * 25)}
                fontSize="11"
                fill="#2c3e50"
              >
                + {attr.title}: {attr.signature || 'type'}
              </text>
            ))}

            {/* Ports */}
            {block.ports.map((port, i) => (
              <g key={`port-${i}`}>
                {/* Port square on side of block */}
                <rect
                  x={block.x + block.width - 12}
                  y={block.y + 50 + (i * 30)}
                  width="12"
                  height="12"
                  fill="#4a90e2"
                  stroke="#2c3e50"
                  strokeWidth="1"
                />
                <text
                  x={block.x + block.width - 18}
                  y={block.y + 50 + (i * 30) + 10}
                  textAnchor="end"
                  fontSize="10"
                  fill="#2c3e50"
                >
                  {port.title}
                </text>
              </g>
            ))}

            {/* Package name (bottom) */}
            {block.packageName && (
              <text
                x={block.x + block.width / 2}
                y={block.y + block.height - 5}
                textAnchor="middle"
                fontSize="9"
                fill="#7f8c8d"
                fontStyle="italic"
              >
                {block.packageName}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
