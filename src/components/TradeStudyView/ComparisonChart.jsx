import React, { useState, useEffect, useRef } from 'react'

/**
 * Comparison Chart Component
 *
 * Visualizes attribute comparisons across variants using SVG bar charts
 */
export default function ComparisonChart({ comparison }) {
  const chartRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const containerWidth = chartRef.current.clientWidth || 600
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        
        // For vertical bars, we need width to accommodate all bars
        // Use full container width, with minimum for readability
        const width = mobile ? Math.max(containerWidth, 320) : Math.min(containerWidth, 700)
        setDimensions({ width, height: 400 })
      }
    }

    // Initial update
    updateDimensions()
    
    // Update on resize with debounce
    let timeoutId
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 150)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  if (!comparison || !comparison.allValues || comparison.allValues.length === 0) {
    return null
  }

  const { attributeName, allValues } = comparison

  // Chart dimensions for vertical bars - responsive
  const width = dimensions.width
  // Height based on number of variants - vertical bars need more height
  const minBarWidth = isMobile ? 60 : 80
  const barSpacing = isMobile ? 12 : 16
  const numBars = allValues.length
  
  // Increased bottom margin for labels (name + rank + spacing)
  const bottomMarginForLabels = isMobile ? 60 : 70
  const chartHeight = Math.max(350, numBars * (minBarWidth + barSpacing) + 200)
  const height = chartHeight
  
  // Margins - more space at top for title/legend, more at bottom for labels
  const margin = { 
    top: isMobile ? 50 : 60,  // Space for title and legend
    right: isMobile ? 20 : 30, 
    bottom: bottomMarginForLabels,  // Space for variant names and ranks
    left: isMobile ? 30 : 40  // Reduced since we don't need Y-axis label
  }
  const chartWidth = width - margin.left - margin.right
  const chartHeightInner = height - margin.top - margin.bottom
  
  // Calculate bar dimensions
  const availableWidth = chartWidth - (barSpacing * (numBars - 1))
  const barWidth = Math.max(minBarWidth, availableWidth / numBars)
  
  // Find max value for scaling
  const maxValue = Math.max(...allValues.map(item => {
    const val = typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0
    return val
  }), 1) // At least 1 to avoid division by zero

  return (
    <div className="comparison-chart" ref={chartRef}>
      <h5 className="chart-title">{attributeName} Comparison</h5>
      <div className="chart-container">
        <svg 
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMinYMin meet"
          className="chart-svg"
        >
        {/* Title - positioned at top center, below legend area */}
        <text
          x={margin.left + chartWidth / 2}
          y={isMobile ? 18 : 22}
          textAnchor="middle"
          fontSize={isMobile ? "13" : "15"}
          fontWeight="600"
          fill="var(--accent-primary)"
        >
          {attributeName} Comparison
        </text>

        {/* Bars - vertical */}
        {allValues.map((item, index) => {
          const isBest = item.isBest
          const isWorst = item.isWorst
          const rank = item.rank || 0
          
          // Ensure value is valid for display
          const displayValue = typeof item.value === 'number' && !isNaN(item.value) 
            ? item.value 
            : 0
          
          // Calculate bar height as percentage of max value
          const barHeightPercent = (displayValue / maxValue) * 100
          const barHeight = (barHeightPercent / 100) * chartHeightInner
          
          // Calculate x position (bars spread horizontally)
          const x = margin.left + index * (barWidth + barSpacing)
          
          // Bar starts from bottom
          const barY = margin.top + chartHeightInner - barHeight
          
          // Center text in bar
          const barCenterX = x + barWidth / 2

          return (
            <g key={index}>
              {/* Bar background (full height) */}
              <rect
                x={x}
                y={margin.top}
                width={barWidth}
                height={chartHeightInner}
                fill="var(--bg-tertiary)"
                rx="4"
                opacity="0.3"
              />

              {/* Bar (actual value) */}
              <rect
                x={x}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={isBest ? 'var(--color-success)' : isWorst ? 'var(--color-warning)' : 'var(--brand-purple)'}
                rx="4"
                opacity="0.9"
              >
                <title>{item.name}: {displayValue.toFixed(1)}</title>
              </rect>

              {/* Best/Worst indicator at very top - above value */}
              {(isBest || isWorst) && (
                <text
                  x={barCenterX}
                  y={margin.top - 8}
                  textAnchor="middle"
                  alignmentBaseline="baseline"
                  fontSize={isMobile ? "9" : "10"}
                  fill={isBest ? 'var(--color-success)' : 'var(--color-warning)'}
                  fontWeight="bold"
                >
                  {isBest ? "✓ Best" : "⚠ Worst"}
                </text>
              )}

              {/* Value label at top of bar */}
              {barHeight > 30 ? (
                // Value above bar if bar is tall enough
                <text
                  x={barCenterX}
                  y={barY - 8}
                  textAnchor="middle"
                  alignmentBaseline="baseline"
                  fontSize={isMobile ? "10" : "11"}
                  fill="var(--text-primary)"
                  fontWeight="600"
                  fontFamily="'Courier New', monospace"
                >
                  {displayValue >= 1000 
                    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(displayValue)
                    : displayValue.toFixed(1)}
                </text>
              ) : (
                // If bar is too short, put value inside
                <text
                  x={barCenterX}
                  y={barY + barHeight / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={isMobile ? "9" : "10"}
                  fill="white"
                  fontWeight="600"
                  fontFamily="'Courier New', monospace"
                >
                  {displayValue >= 1000 
                    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(displayValue)
                    : displayValue.toFixed(1)}
                </text>
              )}

              {/* Variant name below bar - with proper spacing */}
              <text
                x={barCenterX}
                y={margin.top + chartHeightInner + 15}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={isMobile ? "10" : "11"}
                fill="var(--text-primary)"
                fontWeight={isBest ? 'bold' : 'normal'}
              >
                {item.name}
              </text>
              
              {/* Rank below name - with spacing */}
              {rank > 0 && (
                <text
                  x={barCenterX}
                  y={margin.top + chartHeightInner + (isMobile ? 30 : 35)}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={isMobile ? "9" : "10"}
                  fill="var(--text-secondary)"
                  fontWeight="500"
                >
                  #{rank}
                </text>
              )}
            </g>
          )
        })}

        {/* Legend - positioned at top right, below title */}
        <g transform={`translate(${width - margin.right - (isMobile ? 120 : 150)}, ${isMobile ? 32 : 38})`}>
          <rect x="0" y="0" width="14" height="10" fill="var(--color-success)" rx="2" />
          <text x="18" y="8" fontSize="9" fill="var(--text-secondary)">Best</text>

          <rect x={isMobile ? 50 : 55} y="0" width="14" height="10" fill="var(--brand-purple)" rx="2" />
          <text x={isMobile ? 68 : 73} y="8" fontSize="9" fill="var(--text-secondary)">Avg</text>

          <rect x={isMobile ? 105 : 115} y="0" width="14" height="10" fill="var(--color-warning)" rx="2" />
          <text x={isMobile ? 123 : 133} y="8" fontSize="9" fill="var(--text-secondary)">Worst</text>
        </g>
      </svg>
      </div>
    </div>
  )
}
