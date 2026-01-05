import React, { useState, useMemo } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLTraceability } from '../../hooks/useSysMLTraceability'
import SpotlightCard from '../SpotlightCard'
import TraceabilityGraph from './TraceabilityGraph'
import './RequirementsView.css'

/**
 * Requirements View Component
 *
 * Extracts and displays requirements from SysML v2 code using WASM
 */
export default function RequirementsView({ code }) {
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const { traceability, loading: traceLoading } = useSysMLTraceability(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('requirements')

  // Extract requirements from documentation (excluding satisfy/verify relationship nodes)
  const requirements = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const reqList = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          // Only include actual requirement definitions/usages, not satisfy/verify relationships
          if (sub.kind && (sub.kind.includes('Requirement') || sub.kind.includes('requirement'))) {
            // Exclude SatisfyRequirementUsage and VerifyRequirementUsage
            if (!sub.kind.includes('SatisfyRequirement') && !sub.kind.includes('VerifyRequirement')) {
              reqList.push({
                ...sub,
                packageName: chapter.title,
                packageKind: chapter.kind,
              })
            }
          }
        })
      }
    })
    return reqList
  }, [documentation])

  // Extract verifications from documentation
  const verifications = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const verifList = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          // Check both kind and stable_id for verification definitions
          const isVerification =
            (sub.kind && (sub.kind.includes('Verification') || sub.kind.includes('verification'))) ||
            (sub.stable_id && sub.stable_id.includes('/VerificationDefinition'))

          if (isVerification) {
            verifList.push({
              ...sub,
              packageName: chapter.title,
            })
          }
        })
      }
    })
    return verifList
  }, [documentation])

  // Extract satisfy and verify relationships from traceability data
  const relationships = useMemo(() => {
    console.log('🔍 [RequirementsView] relationships useMemo called');
    console.log('🔍 [RequirementsView] traceability:', traceability);

    if (!traceability || !traceability.rows) {
      console.warn('⚠️ [RequirementsView] No traceability data!', { traceability });
      return { satisfy: [], verify: [] }
    }

    console.log('🔍 [RequirementsView] Processing traceability rows:', traceability.rows.length)
    console.log('🔍 [RequirementsView] First row:', traceability.rows[0])

    const satisfy = []
    const verify = []

    // Extract relationships from traceability rows
    // Backend structure: { requirement_fqn, satisfied_by: [FQNs], verified_by: [FQNs] }
    traceability.rows.forEach((row, idx) => {
      console.log(`🔍 [RequirementsView] Row ${idx}:`, {
        req: row.requirement_fqn,
        satisfied_by: row.satisfied_by,
        verified_by: row.verified_by
      });
      // satisfied_by contains FQNs of elements that satisfy this requirement
      if (row.satisfied_by && row.satisfied_by.length > 0) {
        row.satisfied_by.forEach(satisfyingFqn => {
          satisfy.push({
            from: satisfyingFqn,
            to: row.requirement_fqn,
            kind: 'Satisfy',
          })
        })
      }

      // verified_by contains FQNs of verification cases
      if (row.verified_by && row.verified_by.length > 0) {
        row.verified_by.forEach(verifyingFqn => {
          verify.push({
            from: verifyingFqn,
            to: row.requirement_fqn,
            kind: 'Verify',
          })
        })
      }
    })

    console.log('✅ [RequirementsView] Final relationships:', {
      satisfy: satisfy.length,
      verify: verify.length,
      satisfyDetails: satisfy,
      verifyDetails: verify
    })

    return { satisfy, verify }
  }, [traceability])

  // Calculate coverage metrics with smart name matching
  const coverageMetrics = useMemo(() => {
    const totalReqs = requirements.length
    if (totalReqs === 0) return { verified: 0, satisfied: 0, total: 0 }

    // Smart matching function to correlate definitions and usages
    const checkMatch = (relName, reqTitle) => {
      if (relName === reqTitle) return true
      // Check if requirement definition matches usage (e.g., VehicleSafetyReq <-> vehicleSafety)
      const reqLower = reqTitle.toLowerCase().replace('req', '')
      const relLower = relName.toLowerCase().replace('req', '')
      return reqLower === relLower ||
             reqLower.includes(relLower) ||
             relLower.includes(reqLower)
    }

    // Count how many requirements have verification links
    let verifiedCount = 0
    requirements.forEach(req => {
      const isVerified = relationships.verify.some(rel => checkMatch(rel.to, req.title))
      if (isVerified) verifiedCount++
    })

    // Count how many requirements have satisfaction links
    let satisfiedCount = 0
    requirements.forEach(req => {
      const isSatisfied = relationships.satisfy.some(rel => checkMatch(rel.to, req.title))
      if (isSatisfied) satisfiedCount++
    })

    return {
      verified: (verifiedCount / totalReqs) * 100,
      satisfied: (satisfiedCount / totalReqs) * 100,
      total: totalReqs,
      verifiedCount: verifiedCount,
      satisfiedCount: satisfiedCount
    }
  }, [requirements, relationships])

  if (docLoading || analyticsLoading || traceLoading) {
    return (
      <div className="requirements-view">
        <div className="requirements-loading">Extracting requirements from code...</div>
      </div>
    )
  }

  // TEMPORARY DEBUG: Show traceability data status
  const debugInfo = traceability ? {
    rows: traceability.rows?.length || 0,
    hasRows: traceability.rows && traceability.rows.length > 0,
    firstRow: traceability.rows?.[0]
  } : null;

  if (!code || code.trim().length === 0) {
    return (
      <div className="requirements-view">
        <div className="requirements-empty">
          Write SysML v2 requirements in the editor to see live extraction and analysis.
        </div>
      </div>
    )
  }

  return (
    <div className="requirements-view">
      <div className="requirements-header">
        <h3>Requirements Analysis</h3>
        {analytics && analytics.metrics && (
          <div className="requirements-stats">
            <span className="req-stat">
              <strong>{requirements.length}</strong> Requirements
            </span>
            <span className="req-stat">
              <strong>{verifications.length}</strong> Verifications
            </span>
            <span className="req-stat">
              <strong>{relationships.satisfy.length + relationships.verify.length}</strong> Links
            </span>
          </div>
        )}
      </div>

      <div className="requirements-tabs">
        <button
          className={`req-tab ${activeTab === 'requirements' ? 'active' : ''}`}
          onClick={() => setActiveTab('requirements')}
        >
          Requirements
        </button>
        <button
          className={`req-tab ${activeTab === 'verifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('verifications')}
        >
          Verifications
        </button>
        <button
          className={`req-tab ${activeTab === 'traceability' ? 'active' : ''}`}
          onClick={() => setActiveTab('traceability')}
        >
          Traceability
        </button>
        <button
          className={`req-tab ${activeTab === 'graph' ? 'active' : ''}`}
          onClick={() => setActiveTab('graph')}
        >
          Graph
        </button>
        <button
          className={`req-tab ${activeTab === 'coverage' ? 'active' : ''}`}
          onClick={() => setActiveTab('coverage')}
        >
          Coverage
        </button>
        <button
          className={`req-tab ${activeTab === 'debug' ? 'active' : ''}`}
          onClick={() => setActiveTab('debug')}
        >
          Debug
        </button>
      </div>

      <div className="requirements-content">
        {activeTab === 'requirements' && (
          <div className="requirements-list">
            {requirements.length > 0 ? (
              <div className="requirements-table-container">
                <table className="requirements-table">
                  <thead>
                    <tr>
                      <th>Requirement</th>
                      <th>Type</th>
                      <th>Package</th>
                      <th>Description</th>
                      <th>Trace Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((req, index) => {
                      // Check if this requirement is satisfied/verified
                      // Match both exact title and variations (e.g., "VehicleSafetyReq" matches "vehicleSafety")
                      const checkMatch = (relName) => {
                        if (relName === req.title) return true;
                        // Check if requirement definition matches usage (e.g., VehicleSafetyReq <-> vehicleSafety)
                        const reqLower = req.title.toLowerCase().replace('req', '');
                        const relLower = relName.toLowerCase().replace('req', '');
                        return reqLower === relLower ||
                               reqLower.includes(relLower) ||
                               relLower.includes(reqLower);
                      };

                      const isSatisfied = relationships.satisfy.some(rel => checkMatch(rel.to));
                      const isVerified = relationships.verify.some(rel => checkMatch(rel.to));
                      const status = isSatisfied && isVerified ? 'Complete' :
                                     isSatisfied ? 'Satisfied' :
                                     isVerified ? 'Verified' : 'Pending';

                      return (
                        <tr key={index} className={`req-row status-${status.toLowerCase()}`}>
                          <td className="req-title">
                            <strong>{req.title}</strong>
                          </td>
                          <td className="req-type">
                            <span className="type-badge">{req.kind.replace(/[\[\]]/g, '')}</span>
                          </td>
                          <td className="req-package">
                            <code>{req.packageName}</code>
                          </td>
                          <td className="req-description">
                            {req.doc_comment || req.comment_text || (req.doc_declarations && req.doc_declarations.length > 0
                              ? req.doc_declarations[0][1]
                              : 'No description')}
                          </td>
                          <td className="req-status">
                            <span className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="requirements-empty">
                No requirements found. Define requirements using <code>requirement def</code> syntax.
              </div>
            )}
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="verifications-list">
            {verifications.length > 0 ? (
              verifications.map((verif, index) => (
                <SpotlightCard key={index}>
                  <div className="verification-item">
                    <div className="verification-header">
                      <span className="verification-kind">{verif.kind}</span>
                      <h4 className="verification-title">{verif.title}</h4>
                    </div>
                    {(verif.doc_comment || verif.comment_text) && (
                      <div className="verification-doc">{verif.doc_comment || verif.comment_text}</div>
                    )}
                    {!verif.doc_comment && !verif.comment_text && verif.doc_declarations && verif.doc_declarations.length > 0 && (
                      <div className="verification-doc">
                        {verif.doc_declarations.map((decl, i) => (
                          <div key={i}>{decl[1]}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="verifications-empty">
                No verifications found. Define verification cases using <code>verification def</code> syntax.
              </div>
            )}
          </div>
        )}

        {activeTab === 'traceability' && (
          <div className="traceability-view">
            <h4>Traceability Matrix</h4>
            <p className="traceability-description">
              Bidirectional traceability showing relationships between requirements, implementations, and verifications.
            </p>

            {(relationships.satisfy.length > 0 || relationships.verify.length > 0) ? (
              <div className="traceability-table-container">
                <table className="traceability-table">
                  <thead>
                    <tr>
                      <th>Source Element</th>
                      <th>Relationship</th>
                      <th>Target Requirement</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relationships.satisfy.map((rel, index) => (
                      <tr key={`sat-${index}`} className="trace-row satisfy-row">
                        <td className="trace-source">{rel.from}</td>
                        <td className="trace-relationship">
                          <span className="relationship-badge satisfy">satisfies</span>
                        </td>
                        <td className="trace-target">{rel.to}</td>
                        <td className="trace-type">Implementation</td>
                      </tr>
                    ))}
                    {relationships.verify.map((rel, index) => (
                      <tr key={`ver-${index}`} className="trace-row verify-row">
                        <td className="trace-source">{rel.from}</td>
                        <td className="trace-relationship">
                          <span className="relationship-badge verify">verifies</span>
                        </td>
                        <td className="trace-target">{rel.to}</td>
                        <td className="trace-type">Verification</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="traceability-empty">
                <p>No traceability links found.</p>
                <ul>
                  <li>Use <code>satisfy requirement by implementation</code> to trace implementations</li>
                  <li>Use <code>verify requirement</code> in verification definitions</li>
                </ul>
              </div>
            )}

            <div className="traceability-summary">
              <div className="summary-card">
                <span className="summary-value">{relationships.satisfy.length}</span>
                <span className="summary-label">Satisfaction Links</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">{relationships.verify.length}</span>
                <span className="summary-label">Verification Links</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">{relationships.satisfy.length + relationships.verify.length}</span>
                <span className="summary-label">Total Traces</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="coverage-view">
            <h4>Requirements Coverage Analysis</h4>

            <div className="coverage-stats">
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Requirements Defined</div>
                  <div className="coverage-value">{requirements.length}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Verifications Defined</div>
                  <div className="coverage-value">{verifications.length}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Satisfy Links</div>
                  <div className="coverage-value">{relationships.satisfy.length}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Verify Links</div>
                  <div className="coverage-value">{relationships.verify.length}</div>
                </div>
              </SpotlightCard>
            </div>

            <div className="coverage-progress-section">
              <div className="coverage-detail">
                <div className="coverage-detail-header">
                  <h5>Verification Coverage</h5>
                  <span className="coverage-percentage">{coverageMetrics.verified.toFixed(1)}%</span>
                </div>
                <div className="coverage-bar">
                  <div
                    className="coverage-bar-fill verify"
                    style={{ width: `${coverageMetrics.verified}%` }}
                  />
                </div>
                <div className="coverage-info">
                  {coverageMetrics.verifiedCount} of {coverageMetrics.total} requirements have verification links
                </div>
              </div>

              <div className="coverage-detail">
                <div className="coverage-detail-header">
                  <h5>Satisfaction Coverage</h5>
                  <span className="coverage-percentage">{coverageMetrics.satisfied.toFixed(1)}%</span>
                </div>
                <div className="coverage-bar">
                  <div
                    className="coverage-bar-fill satisfy"
                    style={{ width: `${coverageMetrics.satisfied}%` }}
                  />
                </div>
                <div className="coverage-info">
                  {coverageMetrics.satisfiedCount} of {coverageMetrics.total} requirements have satisfaction links
                </div>
              </div>

              {analytics && analytics.metrics && analytics.metrics.doc_coverage && (
                <div className="coverage-detail">
                  <div className="coverage-detail-header">
                    <h5>Documentation Coverage</h5>
                    <span className="coverage-percentage">{analytics.metrics.doc_coverage.toFixed(1)}%</span>
                  </div>
                  <div className="coverage-bar">
                    <div
                      className="coverage-bar-fill doc"
                      style={{ width: `${analytics.metrics.doc_coverage}%` }}
                    />
                  </div>
                  <div className="coverage-info">
                    Elements with documentation comments
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="graph-view">
            <h4>Traceability Graph Visualization</h4>
            <p className="graph-description">
              Visual representation of requirements traceability. Implementations (left) satisfy requirements (center),
              while verifications (right) verify requirements.
            </p>
            <TraceabilityGraph
              requirements={requirements}
              relationships={relationships}
              verifications={verifications}
            />
          </div>
        )}

        {activeTab === 'debug' && (
          <div className="debug-view">
            <h4>Debug: Raw WASM Output</h4>

            <details open>
              <summary><strong>Documentation Chapters ({documentation?.chapters?.length || 0})</strong></summary>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '0.85rem'
              }}>
                {JSON.stringify(documentation?.chapters, null, 2)}
              </pre>
            </details>

            <details style={{ marginTop: '1rem' }}>
              <summary><strong>Extracted Requirements ({requirements.length})</strong></summary>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '0.85rem'
              }}>
                {JSON.stringify(requirements, null, 2)}
              </pre>
            </details>

            <details style={{ marginTop: '1rem' }}>
              <summary><strong>Extracted Verifications ({verifications.length})</strong></summary>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '0.85rem'
              }}>
                {JSON.stringify(verifications, null, 2)}
              </pre>
            </details>

            <details style={{ marginTop: '1rem' }}>
              <summary><strong>Relationships</strong></summary>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '0.85rem'
              }}>
                {JSON.stringify(relationships, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
