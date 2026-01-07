import React, { useState, useMemo } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLTradeStudy } from '../../hooks/useSysMLTradeStudy'
import SpotlightCard from '../SpotlightCard'
import ComparisonChart from './ComparisonChart'
import './TradeStudyView.css'

// Utility function to format numbers with appropriate precision and units
const formatValue = (value, attributeName = '') => {
  if (typeof value !== 'number' || isNaN(value)) return String(value || '-')
  
  // Format based on attribute name patterns
  const name = attributeName.toLowerCase()
  if (name.includes('cost') || name.includes('price')) {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value)
  }
  if (name.includes('emission') || name.includes('co2')) {
    return `${value.toFixed(1)} g/km`
  }
  if (name.includes('range') || name.includes('distance')) {
    return `${value.toFixed(0)} km`
  }
  if (name.includes('power') || name.includes('capacity')) {
    return `${value.toFixed(1)} kW`
  }
  if (name.includes('efficiency') || name.includes('ratio')) {
    return value.toFixed(2)
  }
  
  // Default: show 1 decimal place for small numbers, 0 for large
  return value >= 1000 
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
    : value.toFixed(1)
}

/**
 * Trade Study View Component
 *
 * Extracts and displays trade studies, variants, and objectives from SysML v2 code using WASM
 */
export default function TradeStudyView({ code }) {
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const { tradeStudy, loading: tradeStudyLoading } = useSysMLTradeStudy(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('variants')

  // Extract analysis definitions (trade studies) from WASM backend
  const tradeStudies = useMemo(() => {
    if (!tradeStudy || !tradeStudy.analysisDefs) {
      console.log('⚠️ [TradeStudyView] No analysisDefs from tradeStudy hook')
      return []
    }
    console.log('✅ [TradeStudyView] Analysis defs from hook:', tradeStudy.analysisDefs)
    return tradeStudy.analysisDefs
  }, [tradeStudy])

  // Use variants from tradeStudy hook (has proper :>> pattern matching)
  const variants = useMemo(() => {
    if (!tradeStudy || !tradeStudy.variants) {
      console.log('⚠️ [TradeStudyView] No tradeStudy or variants:', { tradeStudy })
      return []
    }
    console.log('✅ [TradeStudyView] Variants from hook:', tradeStudy.variants)
    return tradeStudy.variants
  }, [tradeStudy])

  // Extract objectives from WASM backend
  const objectives = useMemo(() => {
    if (!tradeStudy || !tradeStudy.objectives) {
      console.log('⚠️ [TradeStudyView] No objectives from tradeStudy hook')
      return []
    }
    console.log('✅ [TradeStudyView] Objectives from hook:', tradeStudy.objectives)
    return tradeStudy.objectives
  }, [tradeStudy])

  // Build decision matrix
  const decisionMatrix = useMemo(() => {
    if (variants.length === 0 || objectives.length === 0) return null

    // Extract common attributes across all variants
    const attributeNames = new Set()
    variants.forEach(variant => {
      variant.attributes.forEach(attr => {
        attributeNames.add(attr.name)
      })
    })

    return {
      variants: variants.map(v => v.title),
      attributes: Array.from(attributeNames),
      data: variants.map(variant => {
        const row = {}
        variant.attributes.forEach(attr => {
          row[attr.name] = attr.value
        })
        return row
      })
    }
  }, [variants, objectives])

  if (docLoading || analyticsLoading || tradeStudyLoading) {
    return (
      <div className="trade-study-view">
        <div className="trade-study-loading">
          <div className="loading-spinner"></div>
          <p>Extracting trade study data...</p>
          <p className="loading-subtitle">Analyzing variants, objectives, and attributes</p>
        </div>
      </div>
    )
  }

  if (!code || code.trim().length === 0) {
    return (
      <div className="trade-study-view">
        <div className="trade-study-empty">
          <div className="empty-icon">📊</div>
          <h4>Ready to Analyze</h4>
          <p>Write SysML v2 trade study code in the editor to see:</p>
          <ul className="empty-features">
            <li>✨ Variant extraction and comparison</li>
            <li>🎯 Objective tracking and analysis</li>
            <li>📈 Decision matrix generation</li>
            <li>🔍 Automated trade-off analysis</li>
          </ul>
          <p className="empty-hint">
            <strong>Tip:</strong> Define variants using <code>part def ... :&gt; BaseType</code> with <code>:&gt;&gt;</code> attribute assignments
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="trade-study-view">
      <div className="trade-study-header">
        <h3>Trade Study Analysis</h3>
        <div className="trade-study-stats">
          <span className="trade-stat">
            <strong>{variants.length}</strong> Variants
          </span>
          <span className="trade-stat">
            <strong>{objectives.length}</strong> Objectives
          </span>
          <span className="trade-stat">
            <strong>{tradeStudies.length}</strong> Studies
          </span>
        </div>
      </div>

      <div className="trade-study-tabs">
        <button
          className={`trade-tab ${activeTab === 'variants' ? 'active' : ''}`}
          onClick={() => setActiveTab('variants')}
        >
          Variants
        </button>
        <button
          className={`trade-tab ${activeTab === 'objectives' ? 'active' : ''}`}
          onClick={() => setActiveTab('objectives')}
        >
          Objectives
        </button>
        <button
          className={`trade-tab ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          Decision Matrix
        </button>
        <button
          className={`trade-tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
      </div>

      <div className="trade-study-content">
        {activeTab === 'variants' && (
          <div className="variants-list">
            {variants.length > 0 ? (
              variants.map((variant, index) => (
                <SpotlightCard key={index}>
                  <div className="variant-item">
                    <div className="variant-header">
                      <span className="variant-badge">{variant.kind}</span>
                      <h4 className="variant-title">{variant.title}</h4>
                      {variant.baseType && (
                        <span className="variant-base-type">:&gt; {variant.baseType}</span>
                      )}
                    </div>
                    {variant.doc_comment && (
                      <div className="variant-doc">{variant.doc_comment}</div>
                    )}
                    {variant.attributes && variant.attributes.length > 0 && (
                      <div className="variant-attributes">
                        <strong>Attributes:</strong>
                        <table className="attributes-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variant.attributes.map((attr, i) => (
                              <tr key={i}>
                                <td className="attribute-name">
                                  <span className="attribute-name-text">{attr.name}</span>
                                </td>
                                <td className="attribute-value">
                                  {formatValue(attr.value, attr.name)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="trade-study-empty">
                <div className="empty-icon">🔍</div>
                <h4>No Variants Found</h4>
                <p>Define variant parts using inheritance and attribute assignments:</p>
                <pre className="empty-code-example"><code>{`part def ElectricVariant :> BaseType {
    :>> cost = 35000.0;
    :>> range = 400.0;
}`}</code></pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'objectives' && (
          <div className="objectives-list">
            {objectives.length > 0 ? (
              objectives.map((objective, index) => (
                <SpotlightCard key={index}>
                  <div className="objective-item">
                    <div className="objective-header">
                      <span className="objective-badge">OBJECTIVE</span>
                      <h4 className="objective-title">{objective.title}</h4>
                    </div>
                    <div className="objective-context">
                      Analysis: <code>{objective.analysisName}</code>
                    </div>
                    {objective.doc_comment && (
                      <div className="objective-doc">{objective.doc_comment}</div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="trade-study-empty">
                <div className="empty-icon">🎯</div>
                <h4>No Objectives Found</h4>
                <p>Define objectives within <code>analysis def</code> blocks:</p>
                <pre className="empty-code-example"><code>{`analysis def TradeStudy {
    objective costObjective {
        doc /* Minimize cost */
    }
    objective performanceObjective {
        doc /* Maximize performance */
    }
}`}</code></pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="decision-matrix-view">
            <h4>Visual Decision Matrix</h4>
            {tradeStudy && tradeStudy.scores && tradeStudy.scores.length > 0 ? (
              <>
                {/* Recommendation */}
                {tradeStudy.recommendation && (
                  <SpotlightCard>
                    <div className="trade-recommendation">
                      <strong>Recommendation:</strong> {tradeStudy.recommendation}
                    </div>
                  </SpotlightCard>
                )}

                {/* Overall Scores */}
                <div className="overall-scores">
                  <h5>Overall Rankings</h5>
                  <div className="scores-grid">
                    {tradeStudy.scores.map((score, i) => (
                      <SpotlightCard key={i}>
                        <div className="score-item">
                          <div className="score-header">
                            <span className="score-rank">#{score.rank}</span>
                            <h4>{score.variantName}</h4>
                          </div>
                          <div className="score-bar-container">
                            <div
                              className="score-bar"
                              style={{ width: `${score.overallScore * 100}%` }}
                            />
                          </div>
                          <div className="score-value">{(score.overallScore * 100).toFixed(0)}%</div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                </div>

                {/* Comparison Charts */}
                <div className="comparison-charts">
                  <h5>Attribute Comparisons</h5>
                  <div className="charts-grid">
                    {tradeStudy.comparisons.map((comparison, i) => (
                      <SpotlightCard key={i}>
                        <ComparisonChart comparison={comparison} />
                      </SpotlightCard>
                    ))}
                  </div>
                </div>

                {/* Data Table */}
                {decisionMatrix && decisionMatrix.variants.length > 0 && (
                  <div className="matrix-container">
                    <h5>Data Table</h5>
                    <table className="decision-matrix">
                      <thead>
                        <tr>
                          <th>Variant</th>
                          {decisionMatrix.attributes.map((attr, i) => (
                            <th key={i}>{attr}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {decisionMatrix.variants.map((variant, i) => (
                          <tr key={i}>
                            <td className="variant-name">{variant}</td>
                            {decisionMatrix.attributes.map((attr, j) => (
                              <td key={j} className="matrix-value">
                                {decisionMatrix.data[i][attr] !== undefined
                                  ? formatValue(decisionMatrix.data[i][attr], attr)
                                  : <span className="matrix-empty">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="trade-study-empty">
                <div className="empty-icon">📊</div>
                <h4>Decision Matrix Unavailable</h4>
                <p>To generate a decision matrix, you need:</p>
                <ul className="empty-features">
                  <li>Multiple variants with comparable attributes</li>
                  <li>Attribute values assigned using <code>:&gt;&gt;</code></li>
                  <li>At least one objective defined</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-list">
            {tradeStudies.length > 0 ? (
              tradeStudies.map((study, index) => (
                <SpotlightCard key={index}>
                  <div className="analysis-item">
                    <div className="analysis-header">
                      <span className="analysis-badge">{study.kind}</span>
                      <h4 className="analysis-title">{study.title}</h4>
                    </div>
                    {study.doc_comment && (
                      <div className="analysis-doc">{study.doc_comment}</div>
                    )}
                    {study.nested_elements && study.nested_elements.length > 0 && (
                      <div className="analysis-elements">
                        <strong>Elements:</strong>
                        <ul>
                          {study.nested_elements.map((el, i) => (
                            <li key={i}>
                              <code>{el.title}</code> - {el.kind}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="trade-study-empty">
                <div className="empty-icon">📋</div>
                <h4>No Analysis Definitions Found</h4>
                <p>Define trade studies using <code>analysis def</code> blocks with objectives:</p>
                <pre className="empty-code-example"><code>{`analysis def MyTradeStudy {
    subject system : System;
    objective costObjective {
        doc /* Minimize cost */
    }
}`}</code></pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
