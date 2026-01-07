import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import './FeatureDiagram.css'

/**
 * Simplified Feature Diagram Component for TryYourself page
 * Renders feature models using SVG
 * Based on FeatureDiagram from webview-react but simplified for web usage
 */

// Feature node colors - Dark theme
const featureColorsDark = {
  default: { bg: '#2d3748', border: '#4a5568', text: '#e2e8f0' },
  selected: { bg: '#1e4620', border: '#38a169', text: '#9ae6b4' },
  excluded: { bg: '#4a1e1e', border: '#c53030', text: '#feb2b2' },
  abstract: { bg: '#1e293b', border: '#3b82f6', text: '#93c5fd' }
}

// Feature node colors - Light theme
const featureColorsLight = {
  default: { bg: '#f7fafc', border: '#cbd5e0', text: '#2d3748' },
  selected: { bg: '#c6f6d5', border: '#38a169', text: '#22543d' },
  excluded: { bg: '#fed7d7', border: '#c53030', text: '#742a2a' },
  abstract: { bg: '#bee3f8', border: '#3b82f6', text: '#1e3a8a' }
}

export default function FeatureDiagram({ featureTree, currentConfiguration = {}, onFeatureClick }) {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [shouldAutoFit, setShouldAutoFit] = useState(false)
  const { theme } = useTheme()

  // Get colors based on theme
  const featureColors = useMemo(() => {
    return theme === 'light' ? featureColorsLight : featureColorsDark
  }, [theme])

  // Improved tree layout algorithm with better spacing calculation
  const layoutTree = useCallback((node, x = 0, y = 0, level = 0, parentId = null, parentGroupType = null) => {
    if (!node) {
      return []
    }

    const nodeWidth = Math.max(120, node.name.length * 8 + 20)
    const nodeHeight = 40
    const minHorizontalSpacing = 180
    const verticalSpacing = 100

    // Handle children - can be null, undefined, or array
    const children = node.children || []
    const hasChildren = Array.isArray(children) && children.length > 0

    // Determine connector type (mandatory/optional) based on node's optional flag
    const nodeGroupType = node.groupType || node.group_type || 'and'
    const nodeGroupLower = nodeGroupType.toLowerCase()
    const parentGroupLower = parentGroupType?.toLowerCase() || 'and'

    // Check if the node itself is marked as optional
    let childConnectorType = 'mandatory'
    if (node.is_optional === true || node.optional === true) {
      childConnectorType = 'optional'
      console.log(`[FeatureDiagram] Node "${node.name}" is OPTIONAL (is_optional: ${node.is_optional}, optional: ${node.optional})`)
    } else {
      childConnectorType = 'mandatory'
      console.log(`[FeatureDiagram] Node "${node.name}" is MANDATORY (is_optional: ${node.is_optional}, optional: ${node.optional})`)
    }

    // Helper to calculate subtree width recursively
    const calculateSubtreeWidth = (n) => {
      const nodeChildren = n.children || []
      if (nodeChildren.length === 0) {
        return Math.max(120, (n.name || '').length * 8 + 20)
      }
      let totalWidth = 0
      nodeChildren.forEach((child, idx) => {
        // child might be an object or just an ID/name, use the actual child node
        const childNode = typeof child === 'object' ? child : n
        const childWidth = calculateSubtreeWidth(childNode)
        totalWidth += childWidth
        if (idx < nodeChildren.length - 1) {
          totalWidth += minHorizontalSpacing
        }
      })
      return Math.max(Math.max(120, (n.name || '').length * 8 + 20), totalWidth)
    }

    const layouted = [{
      id: node.id || node.name,
      name: node.name || 'Unknown',
      x: x,
      y: y,
      width: nodeWidth,
      height: nodeHeight,
      groupType: nodeGroupType,
      isAbstract: hasChildren,
      isSelected: currentConfiguration[node.id || node.name] === true,
      isExcluded: currentConfiguration[node.id || node.name] === false,
      children: Array.isArray(children) ? children.map(child => child?.id || child?.name || child) : [],
      parentId: parentId,
      childConnectorType: childConnectorType
    }]

    if (hasChildren) {
      const childY = y + verticalSpacing
      
      // Calculate optimal spacing based on subtree widths
      // children are actual node objects here
      const subtreeWidths = children.map(child => calculateSubtreeWidth(child))
      const totalSubtreeWidth = subtreeWidths.reduce((sum, w) => sum + w, 0) + (children.length - 1) * minHorizontalSpacing
      
      // Center children under parent
      const startX = totalSubtreeWidth > 0 
        ? x - totalSubtreeWidth / 2 + subtreeWidths[0] / 2
        : x - (children.length * minHorizontalSpacing) / 2
      let currentX = startX

      children.forEach((child, index) => {
        const childSubtreeWidth = subtreeWidths[index]
        const childX = currentX
        const childLayout = layoutTree(child, childX, childY, level + 1, node.id || node.name, nodeGroupType)
        layouted.push(...childLayout)
        
        // Move to next position
        if (index < children.length - 1) {
          currentX += childSubtreeWidth / 2 + minHorizontalSpacing + subtreeWidths[index + 1] / 2
        }
      })
    }

    return layouted
  }, [currentConfiguration])

  // State to trigger layout recalculation
  const [layoutKey, setLayoutKey] = useState(0)

  // Calculate layout - recalculate when layoutKey changes
  const layoutedFeatures = React.useMemo(() => {
    if (!featureTree) {
      return []
    }
    if (!featureTree.root) {
      return []
    }

    // Calculate layout starting from center-top
    // First pass: calculate total width to center root
    const calculateTotalWidth = (node) => {
      if (!node.children || node.children.length === 0) {
        return Math.max(120, (node.name || '').length * 8 + 20)
      }
      let total = 0
      node.children.forEach((child, idx) => {
        total += calculateTotalWidth(child)
        if (idx < node.children.length - 1) {
          total += 180 // min spacing
        }
      })
      return Math.max(Math.max(120, (node.name || '').length * 8 + 20), total)
    }

    const totalWidth = calculateTotalWidth(featureTree.root)
    const rootX = totalWidth / 2 - Math.max(120, (featureTree.root.name || '').length * 8 + 20) / 2
    const rootY = 50

    const features = layoutTree(featureTree.root, rootX, rootY, 0, null, null)
    return features
  }, [featureTree, layoutTree, layoutKey])

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button === 0 && !e.target.closest('[data-feature-id]')) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }, [pan])

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((z) => Math.max(0.3, Math.min(3, z * delta)))
  }, [])

  const handleFeatureClick = useCallback((featureId, event) => {
    event.stopPropagation()
    setSelectedFeature(featureId)
    onFeatureClick?.(featureId)
  }, [onFeatureClick])

  // Render feature node
  const renderFeature = (feature) => {
    let colors = featureColors.default
    if (feature.isSelected) {
      colors = featureColors.selected
    } else if (feature.isExcluded) {
      colors = featureColors.excluded
    } else if (feature.isAbstract) {
      colors = featureColors.abstract
    }

    const isCurrentSelected = selectedFeature === feature.id

    return (
      <g
        key={feature.id}
        data-feature-id={feature.id}
        transform={`translate(${feature.x}, ${feature.y})`}
        onClick={(e) => handleFeatureClick(feature.id, e)}
        className="cursor-pointer uvl-feature-node"
        style={{ cursor: 'pointer' }}
      >
        {/* Selection highlight */}
        {isCurrentSelected && (
          <rect
            x={-3}
            y={-3}
            width={feature.width + 6}
            height={feature.height + 6}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="4,4"
            rx="6"
          />
        )}

        {/* Hover highlight */}
        <rect
          x={-2}
          y={-2}
          width={feature.width + 4}
          height={feature.height + 4}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          rx="4"
          className="uvl-feature-hover-highlight"
          style={{ opacity: 0, transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => {
            if (!isCurrentSelected) {
              e.currentTarget.style.opacity = '1'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0'
          }}
        />

        {/* Feature rectangle */}
        <rect
          x={0}
          y={0}
          width={feature.width}
          height={feature.height}
          fill={colors.bg}
          stroke={colors.border}
          strokeWidth="2"
          rx="4"
        />

        {/* Feature name */}
        <text
          x={feature.width / 2}
          y={feature.height / 2 + 5}
          fill={colors.text}
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
        >
          {feature.name}
        </text>

        {/* Abstract indicator */}
        {feature.isAbstract && (
          <line
            x1={10}
            y1={feature.height - 5}
            x2={feature.width - 10}
            y2={feature.height - 5}
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />
        )}
      </g>
    )
  }

  // Collect constraints from feature tree
  const constraints = useMemo(() => {
    if (!featureTree?.root) return []
    const allConstraints = []
    
    const collectConstraints = (node) => {
      if (node.constraints && Array.isArray(node.constraints)) {
        console.log(`[FeatureDiagram] Found ${node.constraints.length} constraints on node "${node.name}":`, node.constraints)
        allConstraints.push(...node.constraints)
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(collectConstraints)
      }
    }
    
    collectConstraints(featureTree.root)
    console.log(`[FeatureDiagram] Total constraints collected: ${allConstraints.length}`, allConstraints)
    return allConstraints
  }, [featureTree])

  // Render group arc (OR or Alternative)
  const renderGroupArc = (parentFeature) => {
    if (!parentFeature.children || parentFeature.children.length < 2) return null
    if (parentFeature.groupType !== 'or' && parentFeature.groupType !== 'alternative') return null

    const childFeatures = parentFeature.children
      .map(id => layoutedFeatures.find(f => f.id === id))
      .filter(f => f !== undefined)

    if (childFeatures.length < 2) return null

    // Get leftmost and rightmost child positions
    const leftChild = childFeatures.reduce((a, b) => (a.x < b.x ? a : b))
    const rightChild = childFeatures.reduce((a, b) => (a.x > b.x ? a : b))

    const parentCenterX = parentFeature.x + parentFeature.width / 2
    const parentBottomY = parentFeature.y + parentFeature.height

    // Get the top corners of the children (where the arc should connect)
    const leftX = leftChild.x + leftChild.width / 2
    const rightX = rightChild.x + rightChild.width / 2
    const childTopY = leftChild.y  // Top edge of children

    // Calculate the distance between parent and children
    const parentChildDistance = childTopY - parentBottomY

    // Position arc close to the parent (Engine), in the upper part of the space
    // Place arc center near the parent: use 25% of the distance from parent to children
    const arcCenterX = parentCenterX  // Center horizontally on parent
    const arcCenterY = parentBottomY + (parentChildDistance * 0.25)  // Close to parent
    
    // Use smaller radius - make the arc compact and close to parent
    const horizontalSpan = rightX - leftX
    const arcRadius = Math.min(12, horizontalSpan / 4)  // Smaller, more compact radius

    // Calculate start and end points on the arc
    // The arc should connect near the parent, so calculate angles from arc center to children
    const startAngle = Math.atan2(childTopY - arcCenterY, leftX - arcCenterX)
    const endAngle = Math.atan2(childTopY - arcCenterY, rightX - arcCenterX)

    const arcStartX = arcCenterX + arcRadius * Math.cos(startAngle)
    const arcStartY = arcCenterY + arcRadius * Math.sin(startAngle)
    const arcEndX = arcCenterX + arcRadius * Math.cos(endAngle)
    const arcEndY = arcCenterY + arcRadius * Math.sin(endAngle)

    const isFilled = parentFeature.groupType === 'or'
    const arcColor = theme === 'light' ? '#cbd5e0' : '#4a5568'

    // Use sweep-flag 0 to curve upward (counter-clockwise from start to end)
    return (
      <path
        key={`arc-${parentFeature.id}`}
        d={`M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`}
        fill={isFilled ? arcColor : 'none'}
        stroke={arcColor}
        strokeWidth="2"
      />
    )
  }

  // Helper function to find intersection point between line and rectangle edge
  const getEdgeIntersection = (rect, centerX, centerY, targetX, targetY) => {
    const { x, y, width, height } = rect
    const dx = targetX - centerX
    const dy = targetY - centerY
    
    // Calculate intersection with rectangle edges
    let intersectX = centerX
    let intersectY = centerY
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal intersection
      intersectX = dx > 0 ? x + width : x
      if (Math.abs(dx) > 0.001) {
        intersectY = centerY + (dy / dx) * (intersectX - centerX)
      } else {
        intersectY = centerY
      }
      
      // Clamp to top/bottom edges if needed
      if (intersectY < y) {
        intersectY = y
        if (Math.abs(dy) > 0.001) {
          intersectX = centerX + (dx / dy) * (intersectY - centerY)
        } else {
          intersectX = centerX
        }
      } else if (intersectY > y + height) {
        intersectY = y + height
        if (Math.abs(dy) > 0.001) {
          intersectX = centerX + (dx / dy) * (intersectY - centerY)
        } else {
          intersectX = centerX
        }
      }
    } else {
      // Vertical intersection
      intersectY = dy > 0 ? y + height : y
      if (Math.abs(dy) > 0.001) {
        intersectX = centerX + (dx / dy) * (intersectY - centerY)
      } else {
        intersectX = centerX
      }
      
      // Clamp to left/right edges if needed
      if (intersectX < x) {
        intersectX = x
        if (Math.abs(dx) > 0.001) {
          intersectY = centerY + (dy / dx) * (intersectX - centerX)
        } else {
          intersectY = centerY
        }
      } else if (intersectX > x + width) {
        intersectX = x + width
        if (Math.abs(dx) > 0.001) {
          intersectY = centerY + (dy / dx) * (intersectX - centerX)
        } else {
          intersectY = centerY
        }
      }
    }
    
    return { x: intersectX, y: intersectY }
  }

  // Render constraint edges (requires/excludes) with proper bezier curves
  const renderConstraintEdges = () => {
    if (constraints.length === 0) {
      console.log('[FeatureDiagram] No constraints to render')
      return null
    }
    
    console.log(`[FeatureDiagram] Rendering ${constraints.length} constraints`)
    console.log('[FeatureDiagram] Available features:', layoutedFeatures.map(f => ({ id: f.id, name: f.name })))
    
    return constraints.map((constraint, idx) => {
      const sourceFeature = layoutedFeatures.find(f => f.id === constraint.featureId || f.name === constraint.featureId)
      const targetFeature = layoutedFeatures.find(f => f.id === constraint.targetFeatureId || f.name === constraint.targetFeatureId)

      if (!sourceFeature) {
        console.warn(`[FeatureDiagram] Source feature not found for constraint:`, constraint, 'Looking for:', constraint.featureId)
        return null
      }
      if (!targetFeature) {
        console.warn(`[FeatureDiagram] Target feature not found for constraint:`, constraint, 'Looking for:', constraint.targetFeatureId)
        return null
      }
      
      console.log(`[FeatureDiagram] Rendering constraint ${idx}: ${constraint.featureId} => ${constraint.targetFeatureId} (${constraint.type})`)

      const constraintType = constraint.type || 'requires'
      const color = constraintType === 'requires' ? '#38a169' : '#c53030'

      const sourceCenterX = sourceFeature.x + sourceFeature.width / 2
      const sourceCenterY = sourceFeature.y + sourceFeature.height / 2
      const targetCenterX = targetFeature.x + targetFeature.width / 2
      const targetCenterY = targetFeature.y + targetFeature.height / 2

      // Find intersection points on rectangle edges
      const sourcePoint = getEdgeIntersection(
        sourceFeature,
        sourceCenterX,
        sourceCenterY,
        targetCenterX,
        targetCenterY
      )
      const targetPoint = getEdgeIntersection(
        targetFeature,
        targetCenterX,
        targetCenterY,
        sourceCenterX,
        sourceCenterY
      )

      // Calculate distance for bezier control points
      const dx = targetPoint.x - sourcePoint.x
      const dy = targetPoint.y - sourcePoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Handle edge case when distance is very small
      if (distance < 1) {
        // Fallback to simple straight line if features are too close
        return (
          <g key={`constraint-${idx}`}>
            <line
              x1={sourcePoint.x}
              y1={sourcePoint.y}
              x2={targetPoint.x}
              y2={targetPoint.y}
              stroke={color}
              strokeWidth="2"
              strokeDasharray="5,5"
              markerEnd={`url(#arrow-${constraintType})`}
            />
          </g>
        )
      }
      
      // Control points for smooth bezier curve
      // Use perpendicular offset for better curve shape
      const controlOffset = Math.min(distance * 0.3, 80)
      const perpX = -dy / distance * controlOffset
      const perpY = dx / distance * controlOffset
      
      const control1X = sourcePoint.x + dx * 0.3 + perpX
      const control1Y = sourcePoint.y + dy * 0.3 + perpY
      const control2X = targetPoint.x - dx * 0.3 + perpX
      const control2Y = targetPoint.y - dy * 0.3 + perpY

      // Calculate label position (midpoint of curve)
      const labelX = (sourcePoint.x + targetPoint.x) / 2 + perpX
      const labelY = (sourcePoint.y + targetPoint.y) / 2 + perpY

      return (
        <g key={`constraint-${idx}`}>
          <path
            d={`M ${sourcePoint.x} ${sourcePoint.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetPoint.x} ${targetPoint.y}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd={`url(#arrow-${constraintType})`}
          />
          {/* Constraint label */}
          <text
            x={labelX}
            y={labelY}
            fill={color}
            fontSize="10"
            textAnchor="middle"
            style={{ pointerEvents: 'none' }}
          >
            {constraintType}
          </text>
        </g>
      )
    })
  }

  // Render edges with mandatory/optional connectors
  const renderEdges = () => {
    const edges = []
    
    layoutedFeatures.forEach(feature => {
      if (feature.children && feature.children.length > 0) {
        feature.children.forEach(childId => {
          const child = layoutedFeatures.find(f => f.id === childId)
          if (child) {
            const sourceX = feature.x + feature.width / 2
            const sourceY = feature.y + feature.height
            const targetX = child.x + child.width / 2
            const targetY = child.y
            const connectorY = targetY - 10

            // Get connector type from child (how it connects to parent)
            const connectorType = child.childConnectorType || 'mandatory'
            const connectorColor = theme === 'light' ? '#cbd5e0' : '#4a5568'
            const connectorFill = connectorType === 'mandatory' 
              ? connectorColor 
              : (theme === 'light' ? '#ffffff' : '#1e1e1e')

            edges.push(
              <g key={`edge-${feature.id}-${childId}`}>
                {/* Main line from parent to connector */}
                <line
                  x1={sourceX}
                  y1={sourceY}
                  x2={targetX}
                  y2={connectorY}
                  stroke={connectorColor}
                  strokeWidth="2"
                />
                {/* Line from connector to child node */}
                <line
                  x1={targetX}
                  y1={connectorY}
                  x2={targetX}
                  y2={targetY}
                  stroke={connectorColor}
                  strokeWidth="2"
                />
                {/* Mandatory/Optional connector circle */}
                <circle
                  cx={targetX}
                  cy={connectorY}
                  r="6"
                  fill={connectorFill}
                  stroke={connectorColor}
                  strokeWidth="2"
                />
              </g>
            )
          }
        })
      }
    })

    return edges
  }

  // Auto-fit to view when layout changes after auto-layout trigger
  useEffect(() => {
    if (!shouldAutoFit || layoutedFeatures.length === 0) return

    const features = layoutedFeatures
    const minX = Math.min(...features.map(f => f.x))
    const maxX = Math.max(...features.map(f => f.x + f.width))
    const minY = Math.min(...features.map(f => f.y))
    const maxY = Math.max(...features.map(f => f.y + f.height))
    
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const width = maxX - minX
    const height = maxY - minY

    const svgElement = canvasRef.current
    if (svgElement) {
      const svgWidth = svgElement.clientWidth || 800
      const svgHeight = svgElement.clientHeight || 600
      
      // Calculate zoom to fit with some padding
      const zoomX = (svgWidth * 0.85) / width
      const zoomY = (svgHeight * 0.85) / height
      const newZoom = Math.min(zoomX, zoomY, 2) // Max zoom of 200%
      
      setZoom(newZoom)
      setPan({
        x: (svgWidth / 2) - (centerX * newZoom),
        y: (svgHeight / 2) - (centerY * newZoom),
      })
    }
    
    setShouldAutoFit(false)
  }, [layoutedFeatures, shouldAutoFit])

  // Auto-layout: Recalculate layout and fit to view
  const handleAutoLayout = useCallback(() => {
    // Trigger layout recalculation
    setLayoutKey(prev => prev + 1)
    // Mark that we should auto-fit after layout updates
    setShouldAutoFit(true)
  }, [])

  if (!featureTree?.root) {
    return (
      <div className="feature-diagram-empty">
        <h3>Feature Model Diagram</h3>
        <p>No feature tree available.</p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px', fontSize: '0.875rem' }}>
          <strong>Diagnostic Info:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Feature Tree: {featureTree ? 'Present' : 'Missing'}</li>
            <li>Root Node: {featureTree?.root ? 'Present' : 'Missing'}</li>
            <li>Layouted Features: {layoutedFeatures.length} nodes</li>
          </ul>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
            {!featureTree && 'Enter UVL code in the editor to generate a feature model diagram.'}
            {featureTree && !featureTree.root && 'Feature tree structure is invalid (missing root).'}
          </p>
        </div>
      </div>
    )
  }

  // Calculate bounds for viewbox
  const bounds = layoutedFeatures.reduce((acc, f) => {
    return {
      minX: Math.min(acc.minX, f.x),
      maxX: Math.max(acc.maxX, f.x + f.width),
      minY: Math.min(acc.minY, f.y),
      maxY: Math.max(acc.maxY, f.y + f.height)
    }
  }, { minX: 0, maxX: 0, minY: 0, maxY: 0 })

  const width = Math.max(800, bounds.maxX - bounds.minX + 100)
  const height = Math.max(600, bounds.maxY - bounds.minY + 100)

  return (
    <div className="feature-diagram">
      <div className="feature-diagram-header">
        <h3>Feature Model Diagram</h3>
        <div className="feature-diagram-controls">
          <button 
            onClick={handleAutoLayout}
            className="feature-diagram-button"
            title="Auto-layout: Fit all features to view"
          >
            Auto-Layout for Changes
          </button>
          <button 
            onClick={() => { setZoom(1); setPan({ x: 50, y: 50 }); }}
            className="feature-diagram-button"
          >
            Reset Zoom
          </button>
          <span className="feature-diagram-zoom">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      <div className="feature-diagram-legend">
        <div className="feature-diagram-legend-item">
          <svg width="20" height="20">
            <circle cx="10" cy="10" r="5" fill={theme === 'light' ? '#cbd5e0' : '#4a5568'} stroke={theme === 'light' ? '#cbd5e0' : '#4a5568'} strokeWidth="2" />
          </svg>
          <span>Mandatory</span>
        </div>
        <div className="feature-diagram-legend-item">
          <svg width="20" height="20">
            <circle cx="10" cy="10" r="5" fill={theme === 'light' ? '#ffffff' : '#1e1e1e'} stroke={theme === 'light' ? '#cbd5e0' : '#4a5568'} strokeWidth="2" />
          </svg>
          <span>Optional</span>
        </div>
        <div className="feature-diagram-legend-item">
          <svg width="30" height="20">
            <path d="M 5 5 A 10 10 0 0 0 25 5" fill={theme === 'light' ? '#cbd5e0' : '#4a5568'} stroke={theme === 'light' ? '#cbd5e0' : '#4a5568'} strokeWidth="2" />
          </svg>
          <span>OR Group</span>
        </div>
        <div className="feature-diagram-legend-item">
          <svg width="30" height="20">
            <path d="M 5 5 A 10 10 0 0 0 25 5" fill="none" stroke={theme === 'light' ? '#cbd5e0' : '#4a5568'} strokeWidth="2" />
          </svg>
          <span>Alternative (XOR)</span>
        </div>
        <div className="feature-diagram-legend-item">
          <svg width="30" height="10">
            <line x1="0" y1="5" x2="30" y2="5" stroke="#38a169" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          <span style={{ color: '#38a169' }}>Requires</span>
        </div>
        <div className="feature-diagram-legend-item">
          <svg width="30" height="10">
            <line x1="0" y1="5" x2="30" y2="5" stroke="#c53030" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          <span style={{ color: '#c53030' }}>Excludes</span>
        </div>
      </div>
      <div className="feature-diagram-canvas">
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          viewBox={`${bounds.minX - 50} ${bounds.minY - 50} ${width} ${height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ touchAction: 'none' }}
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M 20 0 L 0 0 0 20" 
                fill="none" 
                stroke={theme === 'light' ? '#e0e0e0' : '#333'} 
                strokeWidth="0.5" 
                opacity="0.3" 
              />
            </pattern>
            {/* Arrow markers for constraints */}
            <marker
              id="arrow-requires"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38a169" stroke="#38a169" strokeWidth="0.5" />
            </marker>
            <marker
              id="arrow-excludes"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c53030" stroke="#c53030" strokeWidth="0.5" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Background grid */}
            <rect x={bounds.minX - 1000} y={bounds.minY - 1000} width="2000" height="2000" fill="url(#grid)" />

            {/* Constraint edges (render first so they're behind nodes) */}
            {renderConstraintEdges()}

            {/* Parent-child edges */}
            {renderEdges()}

            {/* Group arcs */}
            {layoutedFeatures.map(renderGroupArc)}

            {/* Feature nodes */}
            {layoutedFeatures.map(renderFeature)}
          </g>
        </svg>
      </div>
    </div>
  )
}











