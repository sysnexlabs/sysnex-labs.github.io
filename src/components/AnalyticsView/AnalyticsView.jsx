import React from 'react'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import SpotlightCard from '../SpotlightCard'
import './AnalyticsView.css'

export default function AnalyticsView({ code }) {
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')

  // Debug: Log analytics data
  console.log('📊 [AnalyticsView] analytics:', analytics)
  console.log('📊 [AnalyticsView] documentation:', documentation)

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
                <div className="metric-card">
                  <div className="metric-label">Relationships</div>
                  <div className="metric-value">{analytics.metrics.total_relationships || 0}</div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar"
                      style={{ width: `${Math.min(100, ((analytics.metrics.total_relationships || 0) / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="metric-card metric-card-highlight">
                  <div className="metric-label">Documentation Coverage</div>
                  <div className="metric-value metric-value-large">
                    {analytics.metrics.documentation_coverage?.toFixed(1) || 0}%
                  </div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar metric-progress-bar-coverage"
                      style={{ width: `${analytics.metrics.documentation_coverage || 0}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="metric-card metric-card-highlight">
                  <div className="metric-label">Naming Quality</div>
                  <div className="metric-value metric-value-large">
                    {analytics.metrics.naming_quality?.toFixed(1) || 0}%
                  </div>
                  <div className="metric-progress">
                    <div
                      className="metric-progress-bar metric-progress-bar-quality"
                      style={{ width: `${analytics.metrics.naming_quality || 0}%` }}
                    />
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        )}

        {/* Element Distribution */}
        {analytics?.metrics?.element_distribution && Object.keys(analytics.metrics.element_distribution).length > 0 && (
          <div className="analytics-section">
            <h4>Element Distribution</h4>
            <div className="distribution-grid">
              {Object.entries(analytics.metrics.element_distribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([type, count]) => (
                  <SpotlightCard key={type}>
                    <div className="distribution-card">
                      <div className="distribution-type">{type}</div>
                      <div className="distribution-count">{count}</div>
                    </div>
                  </SpotlightCard>
                ))}
            </div>
          </div>
        )}

        {/* Coupling & Inheritance Metrics */}
        {(analytics?.metrics?.coupling || analytics?.metrics?.inheritance) && (
          <div className="analytics-section">
            <h4>Advanced Metrics</h4>
            <div className="advanced-metrics-grid">
              {analytics.metrics.coupling && (
                <SpotlightCard>
                  <div className="advanced-metric-card">
                    <h5>Coupling Analysis</h5>
                    <div className="metric-row">
                      <span>Avg Afferent (Ca):</span>
                      <strong>{analytics.metrics.coupling.avg_afferent?.toFixed(2) || '0.00'}</strong>
                    </div>
                    <div className="metric-row">
                      <span>Avg Efferent (Ce):</span>
                      <strong>{analytics.metrics.coupling.avg_efferent?.toFixed(2) || '0.00'}</strong>
                    </div>
                    <div className="metric-row">
                      <span>Avg Instability:</span>
                      <strong>{analytics.metrics.coupling.avg_instability?.toFixed(2) || '0.00'}</strong>
                    </div>
                    <div className="metric-row">
                      <span>High Coupling:</span>
                      <strong className="warning">{analytics.metrics.coupling.high_coupling_count || 0}</strong>
                    </div>
                  </div>
                </SpotlightCard>
              )}

              {analytics.metrics.inheritance && (
                <SpotlightCard>
                  <div className="advanced-metric-card">
                    <h5>Inheritance Analysis</h5>
                    <div className="metric-row">
                      <span>Specializations:</span>
                      <strong>{analytics.metrics.inheritance.total_specializations || 0}</strong>
                    </div>
                    <div className="metric-row">
                      <span>Redefinitions:</span>
                      <strong>{analytics.metrics.inheritance.total_redefinitions || 0}</strong>
                    </div>
                    <div className="metric-row">
                      <span>Max Depth:</span>
                      <strong>{analytics.metrics.inheritance.max_inheritance_depth || 0}</strong>
                    </div>
                    <div className="metric-row">
                      <span>Multiple Inheritance:</span>
                      <strong className="warning">{analytics.metrics.inheritance.multiple_inheritance_count || 0}</strong>
                    </div>
                  </div>
                </SpotlightCard>
              )}
            </div>
          </div>
        )}

        {/* Complexity Analysis */}
        {analytics?.complexity && (
          <div className="analytics-section">
            <h4>Complexity Analysis</h4>
            <div className="complexity-grid">
              <SpotlightCard>
                <div className="complexity-card">
                  <div className="complexity-label">Overall Score</div>
                  <div className="complexity-value">{analytics.complexity.overall_score?.toFixed(1) || 'N/A'}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="complexity-card">
                  <div className="complexity-label">Cyclomatic</div>
                  <div className="complexity-value">{analytics.complexity.cyclomatic?.score?.toFixed(1) || 'N/A'}</div>
                  <div className="complexity-detail">Avg: {analytics.complexity.cyclomatic?.average?.toFixed(1) || '0'}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="complexity-card">
                  <div className="complexity-label">Structural</div>
                  <div className="complexity-value">{analytics.complexity.structural?.score?.toFixed(1) || 'N/A'}</div>
                  <div className="complexity-detail">Avg: {analytics.complexity.structural?.average?.toFixed(1) || '0'}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="complexity-card">
                  <div className="complexity-label">Cognitive</div>
                  <div className="complexity-value">{analytics.complexity.cognitive?.score?.toFixed(1) || 'N/A'}</div>
                  <div className="complexity-detail">Avg: {analytics.complexity.cognitive?.average?.toFixed(1) || '0'}</div>
                </div>
              </SpotlightCard>
            </div>

            {/* Complexity Hotspots */}
            {analytics.complexity.hotspots && analytics.complexity.hotspots.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h5>Complexity Hotspots</h5>
                <div className="hotspots-list">
                  {analytics.complexity.hotspots.slice(0, 5).map((hotspot, index) => (
                    <div key={index} className={`hotspot-card severity-${hotspot.severity?.toLowerCase() || 'info'}`}>
                      <div className="hotspot-header">
                        <strong>{hotspot.name}</strong>
                        <span className="hotspot-type">{hotspot.kind}</span>
                      </div>
                      <div className="hotspot-score">
                        {hotspot.complexity_type}: {hotspot.score?.toFixed(1)}
                      </div>
                      <div className="hotspot-recommendation">{hotspot.recommendation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
