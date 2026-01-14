import React, { useMemo } from 'react'
import GenericGraph from '../Graph/GenericGraph'
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

    // Helper to get short name from FQN
    const getShortName = (name) => {
      if (!name) return ''
      const parts = name.split('::')
      return parts[parts.length - 1].replace(/'/g, '')
    }

    // Helper to check if two requirement names match (definition vs usage vs FQN)
    const isMatch = (relTo, nodeLabel) => {
      const relShort = getShortName(relTo).toLowerCase().replace('req', '')
      const nodeShort = getShortName(nodeLabel).toLowerCase().replace('req', '')
      return relShort === nodeShort || relShort.includes(nodeShort) || nodeShort.includes(relShort)
    }

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
      const reqNode = nodes.find(n => isMatch(rel.to, n.label))

      if (reqNode) {
        // Create or reuse implementation node
        const shortFrom = getShortName(rel.from)
        let implNode = implementationMap.get(shortFrom)
        if (!implNode) {
          implNode = {
            id: `impl-${implementationMap.size}`,
            label: shortFrom,
            type: 'implementation',
            x: 100, // Left side
            y: 100 + implementationMap.size * 80,
          }
          nodes.push(implNode)
          implementationMap.set(shortFrom, implNode)
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
      const reqNode = nodes.find(n => isMatch(rel.to, n.label))

      if (reqNode) {
        // Create or reuse verification node
        const shortFrom = getShortName(rel.from)
        let verifNode = verificationMap.get(shortFrom)
        if (!verifNode) {
          verifNode = {
            id: `verif-${verificationMap.size}`,
            label: shortFrom,
            type: 'verification',
            x: 700, // Right side
            y: 100 + verificationMap.size * 80,
          }
          nodes.push(verifNode)
          verificationMap.set(shortFrom, verifNode)
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

      <GenericGraph
        nodes={graphData.nodes}
        edges={graphData.edges}
        width={width}
        height={height}
      />
    </div>
  )
}
