import React, { useMemo } from 'react'
import './TraceabilityGraph.css'

/**
 * Traceability Graph Visualization
 *
 * Displays requirements traceability as a hierarchical graph:
 * - Requirements (center)
 * - Implementations (left) connected by "satisfy" edges
 * - Verifications (right) connected by "verify" edges
 */
export default function TraceabilityGraph({ requirements, relationships, verifications }) {
  // Generate graph data structure
  const graphData = useMemo(() => {
    const nodes = []
    const edges = []

    // Create requirement nodes (center column)
    requirements.forEach((req, idx) => {
      nodes.push({
        id: `req-${idx}`,
        label: req.title,
        type: 'requirement',
        x: 400, // Center
        y: 100 + idx * 80,
      })
    })

    // Track implementations and verifications we've seen
    const implementationMap = new Map()
    const verificationMap = new Map()

    // Process satisfy relationships (left side)
    relationships.satisfy.forEach((rel, idx) => {
      // Find the requirement node this satisfies
      const reqNode = nodes.find(n => n.label === rel.to ||
        n.label.toLowerCase().replace('req', '') === rel.to.toLowerCase().replace('req', ''))

      if (reqNode) {
        // Create or reuse implementation node
        let implNode = implementationMap.get(rel.from)
        if (!implNode) {
          implNode = {
            id: `impl-${implementationMap.size}`,
            label: rel.from,
            type: 'implementation',
            x: 100, // Left side
            y: 100 + implementationMap.size * 80,
          }
          nodes.push(implNode)
          implementationMap.set(rel.from, implNode)
        }

        // Create edge from implementation to requirement
        edges.push({
          id: `satisfy-${idx}`,
          from: implNode.id,
          to: reqNode.id,
          type: 'satisfy',
          label: 'satisfies',
        })
      }
    })

    // Process verify relationships (right side)
    relationships.verify.forEach((rel, idx) => {
      // Find the requirement node being verified
      const reqNode = nodes.find(n => n.label === rel.to ||
        n.label.toLowerCase().replace('req', '') === rel.to.toLowerCase().replace('req', ''))

      if (reqNode) {
        // Create or reuse verification node
        let verifNode = verificationMap.get(rel.from)
        if (!verifNode) {
          verifNode = {
            id: `verif-${verificationMap.size}`,
            label: rel.from,
            type: 'verification',
            x: 700, // Right side
            y: 100 + verificationMap.size * 80,
          }
          nodes.push(verifNode)
          verificationMap.set(rel.from, verifNode)
        }

        // Create edge from verification to requirement (verification verifies requirement)
        edges.push({
          id: `verify-${idx}`,
          from: verifNode.id,
          to: reqNode.id,
          type: 'verify',
          label: 'verifies',
        })
      }
    })

    return { nodes, edges }
  }, [requirements, relationships, verifications])

  // Calculate SVG dimensions
  const width = 900
  const height = Math.max(400, graphData.nodes.length * 80 + 100)

  if (requirements.length === 0) {
    return (
      <div className="traceability-graph-empty">
        <p>No requirements found. Add requirements to see the traceability graph.</p>
      </div>
    )
  }

  return (
    <div className="traceability-graph">
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color implementation"></div>
          <span>Implementation (Part/System)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color requirement"></div>
          <span>Requirement</span>
        </div>
        <div className="legend-item">
          <div className="legend-color verification"></div>
          <span>Verification (Test)</span>
        </div>
      </div>

      <svg
        className="graph-svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Render edges first (so they appear behind nodes) */}
        {graphData.edges.map(edge => {
          const fromNode = graphData.nodes.find(n => n.id === edge.from)
          const toNode = graphData.nodes.find(n => n.id === edge.to)

          if (!fromNode || !toNode) return null

          // Calculate edge path (with arrow)
          // Start point: right edge of implementation/verification nodes, left edge of requirement
          const x1 = fromNode.type === 'implementation' ? fromNode.x + 120 :
                     fromNode.type === 'verification' ? fromNode.x :
                     fromNode.x + 180
          const y1 = fromNode.y + 20
          // End point: left edge of requirement nodes, right edge for verifications
          const x2 = toNode.type === 'requirement' ?
                     (fromNode.type === 'verification' ? toNode.x + 180 : toNode.x) :
                     toNode.x
          const y2 = toNode.y + 20

          // Control point for curved edge
          const midX = (x1 + x2) / 2
          const curve = `M ${x1},${y1} Q ${midX},${y1} ${midX},${(y1+y2)/2} T ${x2},${y2}`

          return (
            <g key={edge.id}>
              <path
                d={curve}
                className={`graph-edge ${edge.type}`}
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 5}
                className="edge-label"
                textAnchor="middle"
              >
                {edge.label}
              </text>
            </g>
          )
        })}

        {/* Define arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#666" />
          </marker>
        </defs>

        {/* Render nodes */}
        {graphData.nodes.map(node => (
          <g key={node.id} className={`graph-node ${node.type}`}>
            <rect
              x={node.x}
              y={node.y}
              width={node.type === 'requirement' ? 180 : 120}
              height={40}
              rx={4}
            />
            <text
              x={node.x + (node.type === 'requirement' ? 90 : 60)}
              y={node.y + 25}
              textAnchor="middle"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
