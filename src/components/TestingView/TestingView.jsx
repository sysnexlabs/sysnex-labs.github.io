import React, { useState, useMemo } from 'react'
import { useSysMLHir } from '../../hooks/useSysMLHir'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import SpotlightCard from '../SpotlightCard'
import './TestingView.css'

/**
 * Testing View Component
 *
 * Extracts and displays test cases, verification cases, and assertions from SysML v2 code using WASM HIR
 */
export default function TestingView({ code }) {
  const { hirData, loading: hirLoading } = useSysMLHir(code, 'editor://current')
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('verifications')

  // Extract verifications from HIR nodes
  const verifications = useMemo(() => {
    if (!hirData || !hirData.nodes) return []

    const verifList = []

    // Iterate through HIR nodes to find VerificationDefinition nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && node.kind.includes('VerificationDefinition')) {
        // Get package name from parent
        let packageName = 'Unknown Package'
        if (node.parent && hirData.nodes[node.parent]) {
          const parent = hirData.nodes[node.parent]
          if (parent.kind && parent.kind.includes('Package')) {
            packageName = parent.name || 'Unnamed Package'
          }
        }

        // Extract objectives (verify statements within objective blocks)
        const objectives = []
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(childId => {
            const child = hirData.nodes[childId]
            if (child && child.kind && child.kind.includes('Objective')) {
              // Look for verify statements within objective
              if (child.children && Array.isArray(child.children)) {
                child.children.forEach(verifyId => {
                  const verifyNode = hirData.nodes[verifyId]
                  if (verifyNode && verifyNode.kind && verifyNode.kind.includes('VerifyRequirementUsage')) {
                    objectives.push({
                      type: 'verify',
                      target: verifyNode.name || 'unnamed',
                    })
                  }
                })
              }
            }
          })
        }

        // Extract test actions
        const actions = []
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(childId => {
            const child = hirData.nodes[childId]
            if (child && child.kind && (child.kind.includes('ActionDefinition') || child.kind.includes('ActionUsage'))) {
              actions.push({
                name: child.name || 'unnamed action',
                kind: child.kind,
                description: child.doc_comment || '',
              })
            }
          })
        }

        verifList.push({
          title: node.name || 'Unnamed Verification',
          kind: node.kind,
          doc_comment: node.doc_comment,
          stable_id: node.stable_id,
          packageName,
          objectives,
          actions,
        })
      }
    })

    return verifList
  }, [hirData])

  // Extract use cases (test scenarios) from HIR nodes
  const useCases = useMemo(() => {
    if (!hirData || !hirData.nodes) return []

    const caseList = []

    // Iterate through HIR nodes to find UseCase nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && (node.kind.includes('UseCaseDefinition') || node.kind.includes('UseCaseUsage'))) {
        // Get package name from parent
        let packageName = 'Unknown Package'
        if (node.parent && hirData.nodes[node.parent]) {
          const parent = hirData.nodes[node.parent]
          if (parent.kind && parent.kind.includes('Package')) {
            packageName = parent.name || 'Unnamed Package'
          }
        }

        caseList.push({
          title: node.name || 'Unnamed Use Case',
          kind: node.kind,
          doc_comment: node.doc_comment,
          stable_id: node.stable_id,
          packageName,
        })
      }
    })

    return caseList
  }, [hirData])

  // Extract assertions from HIR nodes with validation status
  const assertions = useMemo(() => {
    if (!hirData || !hirData.nodes) return []

    const assertList = []

    // Iterate through HIR nodes to find AssertUsage nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && node.kind.includes('AssertUsage')) {
        // Get parent verification name
        let parentName = 'Unknown Parent'
        let packageName = 'Unknown Package'
        if (node.parent && hirData.nodes[node.parent]) {
          const parent = hirData.nodes[node.parent]
          parentName = parent.name || 'Unnamed Parent'

          // Traverse up to find package
          if (parent.parent && hirData.nodes[parent.parent]) {
            const grandParent = hirData.nodes[parent.parent]
            if (grandParent.kind && grandParent.kind.includes('Package')) {
              packageName = grandParent.name || 'Unnamed Package'
            }
          }
        }

        // Validate assertion: check if it has a constraint child
        let hasConstraint = false
        if (node.children && Array.isArray(node.children)) {
          hasConstraint = node.children.some(childId => {
            const child = hirData.nodes[childId]
            return child && child.kind && child.kind.includes('Constraint')
          })
        }

        const isValid = hasConstraint

        assertList.push({
          title: node.name || 'unnamed assertion',
          kind: node.kind,
          doc_comment: node.doc_comment,
          stable_id: node.stable_id,
          parentName,
          packageName,
          isValid,
          validationMessage: isValid ? 'Has constraint' : 'Missing constraint definition'
        })
      }
    })

    return assertList
  }, [hirData])

  // Extract requirements being verified from HIR nodes
  const requirements = useMemo(() => {
    if (!hirData || !hirData.nodes) return []

    const reqList = []

    // Iterate through HIR nodes to find Requirement nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && node.kind.includes('Requirement')) {
        // Exclude SatisfyRequirementUsage and VerifyRequirementUsage
        if (!node.kind.includes('SatisfyRequirement') && !node.kind.includes('VerifyRequirement')) {
          // Get package name from parent
          let packageName = 'Unknown Package'
          if (node.parent && hirData.nodes[node.parent]) {
            const parent = hirData.nodes[node.parent]
            if (parent.kind && parent.kind.includes('Package')) {
              packageName = parent.name || 'Unnamed Package'
            }
          }

          reqList.push({
            title: node.name || 'Unnamed Requirement',
            kind: node.kind,
            doc_comment: node.doc_comment,
            stable_id: node.stable_id,
            packageName,
          })
        }
      }
    })

    return reqList
  }, [hirData])

  // Extract verify relationships from HIR nodes
  const verifyRelationships = useMemo(() => {
    if (!hirData || !hirData.nodes) return []

    const verify = []

    // Iterate through HIR nodes to find VerifyRequirementUsage nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && node.kind.includes('VerifyRequirementUsage')) {
        // Get the requirement being verified (usually referenced in the node)
        const requirementName = node.name || 'unnamed'

        // Find the parent verification
        let verificationName = 'Unknown Verification'
        if (node.parent && hirData.nodes[node.parent]) {
          const parent = hirData.nodes[node.parent]

          // Check if parent is an Objective block
          if (parent.kind && parent.kind.includes('Objective')) {
            // Go up one more level to find the verification
            if (parent.parent && hirData.nodes[parent.parent]) {
              const grandParent = hirData.nodes[parent.parent]
              if (grandParent.kind && grandParent.kind.includes('Verification')) {
                verificationName = grandParent.name || 'Unnamed Verification'
              }
            }
          } else if (parent.kind && parent.kind.includes('Verification')) {
            // Direct child of verification
            verificationName = parent.name || 'Unnamed Verification'
          }
        }

        verify.push({
          requirement: requirementName,
          verification: verificationName,
          source: node.parent && hirData.nodes[node.parent]?.kind?.includes('Objective') ? 'objective' : 'standalone',
        })
      }
    })

    return verify
  }, [hirData])

  // Calculate test coverage using actual verify relationships with smart matching
  const testCoverage = useMemo(() => {
    const totalReqs = requirements.length
    if (totalReqs === 0) return { percentage: 0, verifiedCount: 0, total: totalReqs }

    // Smart matching function to correlate definitions and usages
    const checkMatch = (relName, reqTitle) => {
      if (relName === reqTitle) return true
      // Check if requirement definition matches usage (e.g., OverVoltageProtectionReq <-> overVoltageProtection)
      const reqLower = reqTitle.toLowerCase().replace('req', '')
      const relLower = relName.toLowerCase().replace('req', '')
      return reqLower === relLower ||
             reqLower.includes(relLower) ||
             relLower.includes(reqLower)
    }

    // Count how many requirements have verification links
    let verifiedCount = 0
    requirements.forEach(req => {
      const isVerified = verifyRelationships.some(rel => checkMatch(rel.requirement, req.title))
      if (isVerified) verifiedCount++
    })

    return {
      percentage: (verifiedCount / totalReqs) * 100,
      verifiedCount,
      total: totalReqs,
    }
  }, [requirements, verifyRelationships])

  if (hirLoading || analyticsLoading) {
    return (
      <div className="testing-view">
        <div className="testing-loading">Extracting test cases from code...</div>
      </div>
    )
  }

  if (!code || code.trim().length === 0) {
    return (
      <div className="testing-view">
        <div className="testing-empty">
          Write SysML v2 test cases in the editor to see live extraction and analysis.
        </div>
      </div>
    )
  }

  return (
    <div className="testing-view">
      <div className="testing-header">
        <h3>Test Analysis</h3>
        <div className="testing-stats">
          <span className="test-stat">
            <strong>{verifications.length}</strong> Tests
          </span>
          <span className="test-stat">
            <strong>{assertions.length}</strong> Assertions
          </span>
          <span className="test-stat">
            <strong>{verifyRelationships.length}</strong> Links
          </span>
          <span className="test-stat">
            <strong>{testCoverage.percentage.toFixed(0)}%</strong> Coverage
          </span>
        </div>
      </div>

      <div className="testing-tabs">
        <button
          className={`test-tab ${activeTab === 'verifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('verifications')}
        >
          Test Cases
        </button>
        <button
          className={`test-tab ${activeTab === 'assertions' ? 'active' : ''}`}
          onClick={() => setActiveTab('assertions')}
        >
          Assertions
        </button>
        <button
          className={`test-tab ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          Scenarios
        </button>
        <button
          className={`test-tab ${activeTab === 'coverage' ? 'active' : ''}`}
          onClick={() => setActiveTab('coverage')}
        >
          Coverage
        </button>
      </div>

      <div className="testing-content">
        {activeTab === 'verifications' && (
          <div className="verifications-list">
            {verifications.length > 0 ? (
              <div className="verifications-table-container">
                <table className="testing-table">
                  <thead>
                    <tr>
                      <th>Test Case</th>
                      <th>Type</th>
                      <th>Package</th>
                      <th>Objectives</th>
                      <th>Actions</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((verif, index) => {
                      // Check if verification has objectives or actions
                      const hasObjectives = verif.objectives && verif.objectives.length > 0
                      const hasActions = verif.actions && verif.actions.length > 0
                      const status = hasObjectives && hasActions ? 'Complete' :
                                     hasObjectives ? 'Partial' : 'Defined'

                      return (
                        <tr key={index} className={`test-row status-${status.toLowerCase()}`}>
                          <td className="test-title">
                            <strong>{verif.title}</strong>
                            {verif.doc_comment && (
                              <div className="test-description">{verif.doc_comment}</div>
                            )}
                          </td>
                          <td className="test-type">
                            <span className="type-badge">{verif.kind.replace(/[\[\]]/g, '')}</span>
                          </td>
                          <td className="test-package">
                            <code>{verif.packageName}</code>
                          </td>
                          <td className="test-objectives">
                            {hasObjectives ? (
                              <ul className="compact-list">
                                {verif.objectives.map((obj, i) => (
                                  <li key={i}><code>{obj.target}</code></li>
                                ))}
                              </ul>
                            ) : (
                              <span className="empty-cell">-</span>
                            )}
                          </td>
                          <td className="test-actions">
                            {hasActions ? (
                              <span className="action-count">{verif.actions.length} steps</span>
                            ) : (
                              <span className="empty-cell">-</span>
                            )}
                          </td>
                          <td className="test-status">
                            <span className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="testing-empty">
                No test cases found. Define verifications using <code>verification def</code> syntax.
              </div>
            )}
          </div>
        )}

        {activeTab === 'assertions' && (
          <div className="assertions-list">
            {assertions.length > 0 ? (
              <div className="assertions-table-container">
                <table className="testing-table">
                  <thead>
                    <tr>
                      <th>Assertion</th>
                      <th>Test Case</th>
                      <th>Package</th>
                      <th>Description</th>
                      <th>Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assertions.map((assertion, index) => (
                      <tr key={index} className={`test-row status-${assertion.isValid ? 'valid' : 'invalid'}`}>
                        <td className="test-title">
                          <strong>{assertion.title}</strong>
                        </td>
                        <td className="test-parent">
                          <code>{assertion.parentName}</code>
                        </td>
                        <td className="test-package">
                          <code>{assertion.packageName}</code>
                        </td>
                        <td className="test-description">
                          {assertion.doc_comment || 'No description'}
                        </td>
                        <td className="test-validation">
                          <span className={`status-badge status-${assertion.isValid ? 'valid' : 'invalid'}`}>
                            {assertion.isValid ? '✓ Valid' : '✗ Invalid'}
                          </span>
                          <div className="validation-message">{assertion.validationMessage}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="testing-empty">
                No assertions found. Add <code>assert</code> statements to verification cases.
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="scenarios-list">
            {useCases.length > 0 ? (
              <div className="scenarios-table-container">
                <table className="testing-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Type</th>
                      <th>Package</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {useCases.map((useCase, index) => {
                      // Check if scenario has description
                      const status = useCase.doc_comment ? 'Documented' : 'Defined'

                      return (
                        <tr key={index} className={`test-row status-${status.toLowerCase()}`}>
                          <td className="test-title">
                            <strong>{useCase.title}</strong>
                          </td>
                          <td className="test-type">
                            <span className="type-badge">{useCase.kind.replace(/[\[\]]/g, '')}</span>
                          </td>
                          <td className="test-package">
                            <code>{useCase.packageName}</code>
                          </td>
                          <td className="test-description">
                            {useCase.doc_comment || 'No description'}
                          </td>
                          <td className="test-status">
                            <span className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="testing-empty">
                No test scenarios found. Define scenarios using <code>use case</code> syntax.
              </div>
            )}
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="coverage-view">
            <div className="coverage-metrics">
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Requirements</div>
                  <div className="coverage-value">{requirements.length}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Verifications</div>
                  <div className="coverage-value">{verifications.length}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Assertions</div>
                  <div className="coverage-value">{assertions.length}</div>
                </div>
              </SpotlightCard>
              <SpotlightCard>
                <div className="coverage-metric">
                  <div className="coverage-label">Test Coverage</div>
                  <div className="coverage-value coverage-value-large">{testCoverage.percentage.toFixed(0)}%</div>
                </div>
              </SpotlightCard>
            </div>
            <div className="coverage-details">
              <h4>Verification Coverage</h4>
              <div className="coverage-bar">
                <div
                  className="coverage-bar-fill"
                  style={{ width: `${testCoverage.percentage}%` }}
                >
                  <span className="coverage-bar-text">
                    {testCoverage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="coverage-note">
                {testCoverage.verifiedCount} of {testCoverage.total} requirements have verification links
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <h5>Verification Sources</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                  <div className="coverage-source">
                    <div className="coverage-source-label">Standalone verify statements</div>
                    <div className="coverage-source-value">
                      {verifyRelationships.filter(r => r.source === 'standalone').length}
                    </div>
                  </div>
                  <div className="coverage-source">
                    <div className="coverage-source-label">Objective blocks</div>
                    <div className="coverage-source-value">
                      {verifyRelationships.filter(r => r.source === 'objective').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
