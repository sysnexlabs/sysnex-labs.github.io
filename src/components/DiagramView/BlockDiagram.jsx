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
    const blockWidth = 220
    const blockHeaderHeight = 50
    const blockAttributeHeight = 22
    const horizontalSpacing = 100
    const verticalSpacing = 100
    const blocksPerRow = Math.min(3, parts.length)

    parts.forEach((part, index) => {
      // Calculate position in grid layout
      const row = Math.floor(index / blocksPerRow)
      const col = index % blocksPerRow
      const x = 80 + col * (blockWidth + horizontalSpacing)
      const y = 80 + row * (150 + verticalSpacing)

      // Extract attributes, ports, and child parts from nested elements
      const attributes = []
      const ports = []
      let childParts = []

      if (part.nested_elements) {
        part.nested_elements.forEach(nested => {
          const nestedKind = nested.kind?.toLowerCase() || ''

          if (nestedKind.includes('attribute') || nestedKind.includes('value')) {
            attributes.push(nested)
          } else if (nestedKind.includes('port') || nestedKind.includes('interface')) {
            ports.push(nested)
          } else if (nestedKind.includes('part') || nestedKind.includes('usage')) {
            childParts.push(nested)
          }
        })
      }

      // Calculate block height based on content
      const contentCount = Math.max(attributes.length + ports.length, 2)
      const blockHeight = blockHeaderHeight + (contentCount * blockAttributeHeight) + 20

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
        index,
      })
    })

    // Second pass: create connections after all blocks are positioned
    parts.forEach((part, partIndex) => {
      const block = blocks[partIndex]

      // Create composition connections for child parts
      block.childParts.forEach(child => {
        // Try multiple matching strategies
        const childName = child.title || child.name
        const targetBlock = blocks.find(b => {
          // Direct name match
          if (b.name === childName) return true
          // Case insensitive match
          if (b.name.toLowerCase() === childName.toLowerCase()) return true
          // Match without suffix/prefix
          const baseName = childName.replace(/(Def|Usage)$/i, '')
          if (b.name.replace(/(Def|Usage)$/i, '') === baseName) return true
          return false
        })

        if (targetBlock && targetBlock.id !== block.id) {
          // Calculate connection points
          const fromX = block.x + block.width / 2
          const fromY = block.y + block.height
          const toX = targetBlock.x + targetBlock.width / 2
          const toY = targetBlock.y

          connections.push({
            id: `conn-${block.id}-${targetBlock.id}`,
            from: block.id,
            to: targetBlock.id,
            type: 'composition',
            fromX,
            fromY,
            toX,
            toY,
            label: childName,
          })
        }
      })

      // Also check for reference/specialization relationships
      if (part.signature) {
        // Extract type references from signature (e.g., ": SomeType")
        const typeMatch = part.signature.match(/:\s*([A-Za-z_][A-Za-z0-9_]*)/g)
        if (typeMatch) {
          typeMatch.forEach(match => {
            const typeName = match.replace(/:\s*/, '')
            const targetBlock = blocks.find(b => b.name === typeName)

            if (targetBlock && targetBlock.id !== block.id) {
              const fromX = block.x
              const fromY = block.y + block.height / 2
              const toX = targetBlock.x + targetBlock.width
              const toY = targetBlock.y + targetBlock.height / 2

              connections.push({
                id: `ref-${block.id}-${targetBlock.id}`,
                from: block.id,
                to: targetBlock.id,
                type: 'reference',
                fromX,
                fromY,
                toX,
                toY,
                label: 'type',
              })
            }
          })
        }
      }
    })

    console.log('📊 [BlockDiagram] Generated blocks:', blocks.length)
    console.log('📊 [BlockDiagram] Generated connections:', connections.length)
    connections.forEach(conn => {
      console.log(`  ${conn.type}: ${conn.from} → ${conn.to}`)
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
        {/* Define markers for relationships */}
        <defs>
          {/* Composition diamond (filled) */}
          <marker
            id="composition-diamond"
            markerWidth="14"
            markerHeight="14"
            refX="7"
            refY="7"
            orient="auto"
          >
            <polygon
              points="7,0 14,7 7,14 0,7"
              fill="#2c3e50"
              stroke="#2c3e50"
              strokeWidth="1.5"
            />
          </marker>

          {/* Reference arrow (open) */}
          <marker
            id="reference-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <path
              d="M 0,0 L 10,5 L 0,10"
              fill="none"
              stroke="#7f8c8d"
              strokeWidth="1.5"
            />
          </marker>
        </defs>

        {/* Render connections first (behind blocks) */}
        {diagram.connections.map((conn) => {
          // Calculate connection path
          const dx = conn.toX - conn.fromX
          const dy = conn.toY - conn.fromY
          const dist = Math.sqrt(dx * dx + dy * dy)

          let path
          if (conn.type === 'composition') {
            // Vertical composition line
            const midY = (conn.fromY + conn.toY) / 2
            path = `M ${conn.fromX},${conn.fromY} L ${conn.fromX},${midY} L ${conn.toX},${midY} L ${conn.toX},${conn.toY}`
          } else {
            // Horizontal reference line with curve
            const midX = (conn.fromX + conn.toX) / 2
            path = `M ${conn.fromX},${conn.fromY} C ${midX},${conn.fromY} ${midX},${conn.toY} ${conn.toX},${conn.toY}`
          }

          const marker = conn.type === 'composition' ? 'url(#composition-diamond)' : 'url(#reference-arrow)'
          const strokeStyle = conn.type === 'reference' ? '4,4' : 'none'

          return (
            <g key={conn.id}>
              <path
                d={path}
                stroke={conn.type === 'composition' ? '#2c3e50' : '#7f8c8d'}
                strokeWidth="2"
                strokeDasharray={strokeStyle}
                fill="none"
                markerStart={marker}
              />
              {conn.label && conn.type === 'composition' && (
                <text
                  x={(conn.fromX + conn.toX) / 2 + 10}
                  y={(conn.fromY + conn.toY) / 2}
                  fontSize="10"
                  fill="#666"
                >
                  {conn.label}
                </text>
              )}
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
