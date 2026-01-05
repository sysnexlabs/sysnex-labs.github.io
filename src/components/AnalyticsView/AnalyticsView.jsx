import React from 'react'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import SpotlightCard from '../SpotlightCard'
import './AnalyticsView.css'

export default function AnalyticsView({ code }) {
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')

  if (analyticsLoading || docLoading) {
    return (
      <div className="analytics-view">
        <div className="analytics-loading">Generating analytics...</div>
      </div>
    )
  }

  if (!code || code.trim().length === 0) {
    return (
      <div className="analytics-view">
        <div className="analytics-empty">
          Write SysML v2 code in the editor to see live analytics and quality metrics.
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-view">
      <div className="analytics-header">
        <h3>Model Analytics Dashboard</h3>
        <p className="analytics-subtitle">Real-time quality metrics powered by WASM</p>
      </div>

      <div className="analytics-content">
        {/* Quality Score Card */}
        {analytics?.quality && (
          <div className="analytics-section">
            <SpotlightCard>
              <div className="quality-score-card">
                <div className="score-value-large">
                  {analytics.quality.overall_score?.toFixed(1) || 'N/A'}
                </div>
                <div className="score-label">Model Quality Score</div>
                <div className="score-subtitle">Based on multiple quality indicators</div>
              </div>
            </SpotlightCard>
          </div>
        )}

        {/* Metrics Grid */}
        {analytics?.metrics && (
          <div className="analytics-section">
            <h4>Model Metrics</h4>
            <div className="metrics-grid">
              <SpotlightCard>
                <div className="metric-card">
                  <div className="metric-label">Total Elements</div>
                  <div className="metric-value">{analytics.metrics.total_elements || 0}</div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar"
                      style={{ width: `${Math.min(100, ((analytics.metrics.total_elements || 0) / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="metric-card">
                  <div className="metric-label">Packages</div>
                  <div className="metric-value">{analytics.metrics.total_packages || 0}</div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar"
                      style={{ width: `${Math.min(100, ((analytics.metrics.total_packages || 0) / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="metric-card">
                  <div className="metric-label">Definitions</div>
                  <div className="metric-value">{analytics.metrics.total_definitions || 0}</div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar"
                      style={{ width: `${Math.min(100, ((analytics.metrics.total_definitions || 0) / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="metric-card metric-card-highlight">
                  <div className="metric-label">Documentation Coverage</div>
                  <div className="metric-value metric-value-large">
                    {analytics.metrics.doc_coverage?.toFixed(1) || 0}%
                  </div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar metric-progress-bar-coverage"
                      style={{ width: `${analytics.metrics.doc_coverage || 0}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        )}

        {/* Complexity Analysis */}
        {analytics?.complexity && (
          <div className="analytics-section">
            <h4>Complexity Analysis</h4>
            <SpotlightCard>
              <div className="complexity-card">
                <div className="complexity-score">
                  <div className="complexity-label">Overall Complexity Score</div>
                  <div className="complexity-value">
                    {analytics.complexity.overall_score?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        )}

        {/* Insights */}
        {analytics?.insights && analytics.insights.length > 0 && (
          <div className="analytics-section">
            <h4>Insights & Recommendations</h4>
            <div className="insights-list">
              {analytics.insights.map((insight, index) => (
                <div key={index} className={`insight-card insight-${insight.severity}`}>
                  <div className="insight-header">
                    <span className="insight-category">{insight.category}</span>
                    <span className={`insight-severity severity-${insight.severity}`}>
                      {insight.severity}
                    </span>
                  </div>
                  <div className="insight-message">{insight.message}</div>
                  {insight.suggestion && (
                    <div className="insight-suggestion">
                      💡 {insight.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Statistics */}
        {documentation && documentation.chapters && (
          <div className="analytics-section">
            <h4>Documentation Structure</h4>
            <div className="doc-stats-grid">
              <SpotlightCard>
                <div className="doc-stat-card">
                  <div className="doc-stat-value">{documentation.chapters.length}</div>
                  <div className="doc-stat-label">Packages</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="doc-stat-card">
                  <div className="doc-stat-value">
                    {documentation.chapters.reduce((sum, ch) => sum + (ch.subchapters?.length || 0), 0)}
                  </div>
                  <div className="doc-stat-label">Definitions</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="doc-stat-card">
                  <div className="doc-stat-value">
                    {documentation.chapters.filter(ch => ch.doc_comment || ch.doc_declarations?.length > 0).length}
                  </div>
                  <div className="doc-stat-label">Documented Packages</div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
