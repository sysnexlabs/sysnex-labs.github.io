import React from 'react'

/**
 * Comparison Chart Component
 *
 * Visualizes attribute comparisons across variants using SVG bar charts
 */
export default function ComparisonChart({ comparison }) {
  if (!comparison || !comparison.allValues || comparison.allValues.length === 0) {
    return null
  }

  const { attributeName, allValues } = comparison

  // Chart dimensions
  const width = 600
  const height = 300
  const margin = { top: 40, right: 30, bottom: 80, left: 120 }
  const chartWidth = width - margin.left - margin.right
  const barHeight = 30
  const barSpacing = 15

  return (
    <div className="comparison-chart">
      <h5 className="chart-title">{attributeName} Comparison</h5>
      <svg width={width} height={height} className="chart-svg">
        {/* Title */}
        <text
          x={margin.left + chartWidth / 2}
          y={20}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="var(--text-primary)"
        >
          {attributeName}
        </text>

        {/* Bars */}
        {allValues.map((item, index) => {
          const y = margin.top + index * (barHeight + barSpacing)
          // Use pre-calculated bar width from backend (0-100%)
          // Ensure barWidthPercent is a valid number, default to 0 if invalid
          const barWidthPercent = typeof item.barWidthPercent === 'number' && !isNaN(item.barWidthPercent) 
            ? item.barWidthPercent 
            : 0
          const barWidth = Math.max(0, (barWidthPercent / 100) * chartWidth)
          const isBest = item.isBest
          const isWorst = item.isWorst
          const rank = item.rank || 0
          
          // Ensure value is valid for display
          const displayValue = typeof item.value === 'number' && !isNaN(item.value) 
            ? item.value 
            : 0

          return (
            <g key={index}>
              {/* Variant label */}
              <text
                x={margin.left - 10}
                y={y + barHeight / 2}
                textAnchor="end"
                alignmentBaseline="middle"
                fontSize="12"
                fill="var(--text-primary)"
                fontWeight={isBest ? 'bold' : 'normal'}
              >
                {item.name}
                {rank > 0 && ` (#${rank})`}
              </text>

              {/* Bar background */}
              <rect
                x={margin.left}
                y={y}
                width={chartWidth}
                height={barHeight}
                fill="var(--bg-tertiary)"
                rx="4"
              />

              {/* Bar */}
              <rect
                x={margin.left}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={isBest ? 'var(--color-success)' : isWorst ? 'var(--color-warning)' : 'var(--brand-purple)'}
                rx="4"
                opacity="0.8"
              />

              {/* Value label */}
              <text
                x={Math.max(margin.left, margin.left + barWidth + 5)}
                y={y + barHeight / 2}
                alignmentBaseline="middle"
                fontSize="11"
                fill="var(--text-secondary)"
                fontWeight="600"
              >
                {displayValue.toFixed(1)}
              </text>

              {/* Best/Worst indicator */}
              {isBest && (
                <text
                  x={Math.max(margin.left, margin.left + barWidth + 50)}
                  y={y + barHeight / 2}
                  alignmentBaseline="middle"
                  fontSize="10"
                  fill="var(--color-success)"
                  fontWeight="bold"
                >
                  ✓ Best
                </text>
              )}
              {isWorst && (
                <text
                  x={Math.max(margin.left, margin.left + barWidth + 50)}
                  y={y + barHeight / 2}
                  alignmentBaseline="middle"
                  fontSize="10"
                  fill="var(--color-warning)"
                  fontWeight="bold"
                >
                  Worst
                </text>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g transform={`translate(${margin.left}, ${height - 40})`}>
          <rect x="0" y="0" width="20" height="12" fill="var(--color-success)" rx="2" />
          <text x="25" y="10" fontSize="10" fill="var(--text-secondary)">Best</text>

          <rect x="80" y="0" width="20" height="12" fill="var(--brand-purple)" rx="2" />
          <text x="105" y="10" fontSize="10" fill="var(--text-secondary)">Average</text>

          <rect x="180" y="0" width="20" height="12" fill="var(--color-warning)" rx="2" />
          <text x="205" y="10" fontSize="10" fill="var(--text-secondary)">Worst</text>
        </g>
      </svg>
    </div>
  )
}
