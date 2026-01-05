import React, { useState, useMemo } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLTradeStudy } from '../../hooks/useSysMLTradeStudy'
import SpotlightCard from '../SpotlightCard'
import ComparisonChart from './ComparisonChart'
import './TradeStudyView.css'

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

  // Extract analysis definitions (trade studies)
  const tradeStudies = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const studies = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.toLowerCase().includes('analysis') || sub.kind.includes('AnalysisDef'))) {
            studies.push({
              ...sub,
              packageName: chapter.title,
            })
          }
        })
      }
    })
    return studies
  }, [documentation])

  // Extract part variants (different configurations)
  const variants = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const variantList = []
    const baseTypes = new Set()

    // First pass: identify base types
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('PartDef') || sub.kind.includes('part def'))) {
            // Check if it's a specialization (has :> in signature)
            if (sub.signature && sub.signature.includes(':>')) {
              const match = sub.signature.match(/:>\s*(\w+)/)
              if (match) {
                baseTypes.add(match[1])
              }
            }
          }
        })
      }
    })

    // Second pass: extract variants
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('PartDef') || sub.kind.includes('part def'))) {
            // Extract base type
            let baseType = null
            if (sub.signature && sub.signature.includes(':>')) {
              const match = sub.signature.match(/:>\s*(\w+)/)
              if (match) {
                baseType = match[1]
              }
            }

            // Extract attributes with values
            const attributes = []
            if (sub.nested_elements) {
              sub.nested_elements.forEach(nested => {
                if (nested.kind && nested.kind.toLowerCase().includes('attribute')) {
                  // Extract attribute name and value from signature
                  if (nested.signature) {
                    const valueMatch = nested.signature.match(/=\s*([\d.]+)/)
                    if (valueMatch) {
                      attributes.push({
                        name: nested.title,
                        value: parseFloat(valueMatch[1]),
                        signature: nested.signature
                      })
                    }
                  }
                }
              })
            }

            if (baseType && baseTypes.has(baseType)) {
              variantList.push({
                ...sub,
                baseType,
                attributes,
                packageName: chapter.title,
              })
            }
          }
        })
      }
    })
    return variantList
  }, [documentation])

  // Extract objectives from analysis definitions
  const objectives = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const objList = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && sub.kind.toLowerCase().includes('analysis')) {
            // Extract objectives from nested elements
            if (sub.nested_elements) {
              sub.nested_elements.forEach(nested => {
                if (nested.kind && nested.kind.toLowerCase().includes('objective')) {
                  objList.push({
                    ...nested,
                    analysisName: sub.title,
                    packageName: chapter.title,
                  })
                }
              })
            }
          }
        })
      }
    })
    return objList
  }, [documentation])

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
        <div className="trade-study-loading">Extracting trade study data...</div>
      </div>
    )
  }

  if (!code || code.trim().length === 0) {
    return (
      <div className="trade-study-view">
        <div className="trade-study-empty">
          Write SysML v2 trade study code to see variant analysis and decision support.
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
                    {variant.attributes.length > 0 && (
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
                                <td>{attr.name}</td>
                                <td className="attribute-value">{attr.value}</td>
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
                No variants found. Define variant parts using <code>part def ... :&gt; BaseType</code>.
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
                No objectives found. Define objectives in <code>analysis def</code> blocks.
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
                        <ComparisonChart
                          comparison={comparison}
                          scores={tradeStudy.scores}
                        />
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
                                  ? decisionMatrix.data[i][attr].toFixed(1)
                                  : '-'}
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
                <p>Decision matrix requires variants with comparable attributes.</p>
                <p>Define multiple part variants with attribute values to generate the matrix.</p>
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
                No analysis definitions found. Define trade studies using <code>analysis def</code>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
