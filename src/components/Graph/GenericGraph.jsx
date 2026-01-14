import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Generic Graph Component for SysML Visualizations
 * 
 * Renders a directed graph using SVG.
 * Supports:
 * - Custom node filtering and positioning
 * - Curved bezier edges with arrows
 * - Node type styling (requirement, implementation, verification, system, etc.)
 * - Framer motion animations
 * 
 * @param {Array} nodes - Array of { id, label, type, x, y, data }
 * @param {Array} edges - Array of { id, from, to, label, type }
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @param {Function} onNodeClick - Callback when node is clicked
 */
export default function GenericGraph({
    nodes = [],
    edges = [],
    width = 900,
    height = 600,
    onNodeClick
}) {

    // Define node styles based on type
    const getNodeStyle = (type) => {
        switch (type) {
            case 'requirement':
                return { fill: '#1e293b', stroke: '#e2e8f0', text: '#f8fafc' }; // Slate-800/200
            case 'implementation':
            case 'part':
            case 'system':
                return { fill: '#1e3a8a', stroke: '#60a5fa', text: '#bfdbfe' }; // Blue-900/400
            case 'verification':
            case 'test':
                return { fill: '#3f2c06', stroke: '#facc15', text: '#fef08a' }; // Yellow-950/400
            case 'connection':
            case 'hub':
                return { fill: '#312e81', stroke: '#818cf8', text: '#e0e7ff' }; // Indigo-900/400
            case 'external':
                return { fill: '#3f2e3e', stroke: '#c084fc', text: '#f3e8ff' }; // Purple-900/400
            default:
                return { fill: '#0f172a', stroke: '#94a3b8', text: '#cbd5e1' }; // Slate-900/400
        }
    }

    // Edge coloring
    const getEdgeColor = (type) => {
        switch (type) {
            case 'satisfy': return '#60a5fa'; // Blue
            case 'verify': return '#facc15'; // Yellow
            case 'connect': return '#818cf8'; // Indigo
            case 'flow': return '#34d399'; // Emerald
            default: return '#64748b'; // Slate
        }
    }

    return (
        <div className="sysml-graph-container" style={{ overflow: 'auto', border: '1px solid #334155', borderRadius: '8px', background: '#020617' }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    {/* Define markers for different edge types */}
                    <marker id="arrow-satisfy" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                    </marker>
                    <marker id="arrow-verify" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
                    </marker>
                    <marker id="arrow-connect" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#818cf8" />
                    </marker>
                    <marker id="arrow-default" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                </defs>

                {/* Edges Layer */}
                {edges.map((edge) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);

                    if (!fromNode || !toNode) return null;

                    // Simple curve logic: 
                    // If layers (x difference), curve horizontally.
                    // If purely vertical, curve slightly.
                    const dx = toNode.x - fromNode.x;
                    const dy = toNode.y - fromNode.y;

                    let path = '';
                    const nodeW = 180;
                    const nodeH = 40;

                    // Calculate attach points
                    const startX = fromNode.x + nodeW; // Right side of source
                    const startY = fromNode.y + nodeH / 2;
                    const endX = toNode.x; // Left side of target
                    const endY = toNode.y + nodeH / 2;

                    // Generic Bezier
                    const ctrl1X = startX + (endX - startX) / 2;
                    const ctrl1Y = startY;
                    const ctrl2X = startX + (endX - startX) / 2;
                    const ctrl2Y = endY;

                    // Adjust for "hub and spoke" (KRAKEN) vs "layered" (Traceability)
                    // If KRAKEN (radial), we might need center-to-center. 
                    // For now, assume layered left-to-right logic is dominant, or tweak based on type.
                    if (edge.type === 'connect') {
                        // For KRAKEN, draw direct lines or center-based
                        // Since visualization is custom, let's keep simple curve
                        const cx1 = fromNode.x + nodeW / 2;
                        const cy1 = fromNode.y + nodeH / 2;
                        const cx2 = toNode.x + nodeW / 2;
                        const cy2 = toNode.y + nodeH / 2;
                        path = `M ${cx1},${cy1} L ${cx2},${cy2}`;
                    } else {
                        path = `M ${startX},${startY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${endX},${endY}`;
                    }

                    const color = getEdgeColor(edge.type);
                    const markerId = `url(#arrow-${edge.type === 'satisfy' || edge.type === 'verify' || edge.type === 'connect' ? edge.type : 'default'})`;

                    return (
                        <g key={edge.id}>
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                d={path}
                                stroke={color}
                                strokeWidth="2"
                                fill="none"
                                markerEnd={markerId}
                            />
                            {edge.label && (
                                <text
                                    x={(fromNode.x + toNode.x + nodeW) / 2}
                                    y={(fromNode.y + toNode.y + nodeH) / 2 - 10}
                                    textAnchor="middle"
                                    fill={color}
                                    fontSize="12px"
                                    style={{ background: '#020617' }} // Poor man's background
                                >
                                    {edge.label}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Nodes Layer */}
                {nodes.map((node) => {
                    const style = getNodeStyle(node.type);
                    return (
                        <motion.g
                            key={node.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onNodeClick && onNodeClick(node)}
                            style={{ cursor: 'pointer' }}
                        >
                            <rect
                                x={node.x}
                                y={node.y}
                                width={180}
                                height={40}
                                rx={6}
                                fill={style.fill}
                                stroke={style.stroke}
                                strokeWidth="1.5"
                                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                            />
                            <text
                                x={node.x + 90}
                                y={node.y + 25}
                                textAnchor="middle"
                                fill={style.text}
                                fontSize="13px"
                                fontWeight="500"
                                style={{ pointerEvents: 'none' }}
                            >
                                {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                            </text>
                        </motion.g>
                    );
                })}
            </svg>
        </div>
    )
}
