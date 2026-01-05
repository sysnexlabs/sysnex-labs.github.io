import React, { useState, useMemo } from 'react'
import { useSysMLHir } from '../../hooks/useSysMLHir'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLTestManagement, useAssertions, useSuccessionFlows } from '../../hooks/useSysMLTestManagement'
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
  const { 
    scenarios: extractedScenarios, 
    coverage: backendCoverage, 
    loading: testMgmtLoading 
  } = useSysMLTestManagement(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('verifications')
  const [selectedVerificationId, setSelectedVerificationId] = useState(null)
  
  // Get assertions and succession flows for selected verification
  const { assertions: extractedAssertions } = useAssertions(code, selectedVerificationId)
  const { actionSequence } = useSuccessionFlows(code, selectedVerificationId)

  // Extract verifications from HIR nodes
  const verifications = useMemo(() => {
    if (!hirData || !hirData.nodes) return []

    const verifList = []

    // Iterate through HIR nodes to find VerificationDefinition nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && node.kind.includes('VerificationDefinition')) {
        // Get package name from parent (traverse up the tree)
        let packageName = 'Global'
        let currentNode = node
        let depth = 0
        while (currentNode && currentNode.parent && depth < 10) {
          const parentNode = hirData.nodes[currentNode.parent]
          if (parentNode) {
            if (parentNode.kind && parentNode.kind.includes('Package')) {
              packageName = parentNode.name || 'Unnamed Package'
              break
            }
            currentNode = parentNode
          } else {
            break
          }
          depth++
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

        // Clean kind string - extract just the type name
        let kindDisplay = 'Verification Definition'
        if (typeof node.kind === 'string') {
          // If it's a simple string like "VerificationDefinition"
          kindDisplay = node.kind.replace(/([A-Z])/g, ' $1').trim()
        } else if (node.kind && typeof node.kind === 'object') {
          // If it's an object like "VerificationDefinition { ... }"
          const kindStr = String(node.kind)
          const match = kindStr.match(/^(\w+)/)
          if (match) {
            kindDisplay = match[1].replace(/([A-Z])/g, ' $1').trim()
          }
        }

        verifList.push({
          title: node.name || 'Unnamed Verification',
          kind: kindDisplay,
          doc_comment: node.doc_comment,
          stable_id: node.stable_id,
          nodeId: nodeId, // Store node ID for WASM extraction
          packageName,
          objectives,
          actions,
        })
      }
    })

    return verifList
  }, [hirData])

  // Use backend-extracted scenarios if available, otherwise fallback to HIR
  const useCases = useMemo(() => {
    // Use backend-extracted scenarios (more accurate with succession flows)
    if (extractedScenarios && extractedScenarios.length > 0) {
      return extractedScenarios.map(scenario => ({
        title: scenario.name || 'Unnamed Scenario',
        kind: 'Use Case',
        doc_comment: scenario.docComment,
        packageName: 'Current Package',
        actions: scenario.actionSequence 
          ? scenario.actionSequence.actionNames.map((name, idx) => ({
              name,
              order: idx + 1,
              description: `Action ${idx + 1} in sequence`,
            }))
          : [],
        actionSequence: scenario.actionSequence,
        includedVerifications: scenario.includedVerifications || [],
      }))
    }

    // Fallback to HIR extraction
    if (!hirData || !hirData.nodes) return []

    const caseList = []

    // Iterate through HIR nodes to find UseCase nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && (node.kind.includes('UseCaseDefinition') || node.kind.includes('UseCaseUsage'))) {
        // Get package name from parent (traverse up the tree)
        let packageName = 'Global'
        let currentNode = node
        let depth = 0
        while (currentNode && currentNode.parent && depth < 10) {
          const parentNode = hirData.nodes[currentNode.parent]
          if (parentNode) {
            if (parentNode.kind && parentNode.kind.includes('Package')) {
              packageName = parentNode.name || 'Unnamed Package'
              break
            }
            currentNode = parentNode
          } else {
            break
          }
          depth++
        }

        // Extract actions/steps from use case
        const actions = []
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(childId => {
            const child = hirData.nodes[childId]
            if (child && child.kind) {
              const childKind = String(child.kind)
              // Look for actions, steps, or any execution nodes
              if (childKind.includes('Action') || childKind.includes('Step') || childKind.includes('Perform')) {
                actions.push({
                  name: child.name || 'unnamed step',
                  kind: childKind,
                  description: child.doc_comment || '',
                })
              }
            }
          })
        }

        caseList.push({
          title: node.name || 'Unnamed Use Case',
          kind: 'Use Case',
          doc_comment: node.doc_comment,
          stable_id: node.stable_id,
          packageName,
          actions,
        })
      }
    })

    return caseList
  }, [hirData, extractedScenarios])

  // Helper function to extract expression text from HIR expression nodes
  const extractExpressionText = (exprNode, hirData) => {
    if (!exprNode || !hirData) return null
    
    const kind = String(exprNode.kind)
    
    // Binary expression: left op right
    if (kind.includes('BinaryExpr')) {
      const leftId = exprNode.kind?.left || exprNode.children?.[0]
      const rightId = exprNode.kind?.right || exprNode.children?.[1]
      const op = exprNode.kind?.op || '?'
      
      const left = leftId && hirData.nodes[leftId] ? extractExpressionText(hirData.nodes[leftId], hirData) : '?'
      const right = rightId && hirData.nodes[rightId] ? extractExpressionText(hirData.nodes[rightId], hirData) : '?'
      
      return `(${left} ${op} ${right})`
    }
    
    // Unary expression: op operand
    if (kind.includes('UnaryExpr')) {
      const operandId = exprNode.kind?.operand || exprNode.children?.[0]
      const op = exprNode.kind?.op || '?'
      const operand = operandId && hirData.nodes[operandId] ? extractExpressionText(hirData.nodes[operandId], hirData) : '?'
      
      return `${op}${operand}`
    }
    
    // Member access: object.property
    if (kind.includes('MemberAccessExpr')) {
      const baseId = exprNode.kind?.base || exprNode.children?.[0]
      const member = exprNode.kind?.member || '?'
      const base = baseId && hirData.nodes[baseId] ? extractExpressionText(hirData.nodes[baseId], hirData) : '?'
      
      return `${base}.${member}`
    }
    
    // Name expression: variable name
    if (kind.includes('NameExpr')) {
      return exprNode.kind?.name || exprNode.name || '?'
    }
    
    // Literal expression: value
    if (kind.includes('LiteralExpr')) {
      return exprNode.kind?.value || '?'
    }
    
    // Call expression: function(args)
    if (kind.includes('CallExpr')) {
      const funcId = exprNode.kind?.function || exprNode.children?.[0]
      const func = funcId && hirData.nodes[funcId] ? extractExpressionText(hirData.nodes[funcId], hirData) : '?'
      const args = exprNode.kind?.arguments || exprNode.children?.slice(1) || []
      const argStrs = args.map(argId => {
        const argNode = hirData.nodes[argId]
        return argNode ? extractExpressionText(argNode, hirData) : '?'
      })
      
      return `${func}(${argStrs.join(', ')})`
    }
    
    // Ternary expression: condition ? then : else
    if (kind.includes('TernaryExpr')) {
      const condId = exprNode.kind?.condition || exprNode.children?.[0]
      const thenId = exprNode.kind?.then_expr || exprNode.children?.[1]
      const elseId = exprNode.kind?.else_expr || exprNode.children?.[2]
      
      const cond = condId && hirData.nodes[condId] ? extractExpressionText(hirData.nodes[condId], hirData) : '?'
      const thenExpr = thenId && hirData.nodes[thenId] ? extractExpressionText(hirData.nodes[thenId], hirData) : '?'
      const elseExpr = elseId && hirData.nodes[elseId] ? extractExpressionText(hirData.nodes[elseId], hirData) : '?'
      
      return `(${cond} ? ${thenExpr} : ${elseExpr})`
    }
    
    // Fallback: try to get name or return kind
    return exprNode.name || kind.split('{')[0] || 'expression'
  }

  // Combine HIR-extracted assertions with backend-extracted assertions
  const assertions = useMemo(() => {
    const assertList = []

    // Use backend-extracted assertions if available (more accurate)
    if (extractedAssertions && extractedAssertions.length > 0) {
      return extractedAssertions.map(assertion => ({
        title: assertion.name || 'unnamed assertion',
        kind: 'Assert',
        doc_comment: assertion.docComment,
        parentName: assertion.parentVerificationId ? `Verification ${assertion.parentVerificationId}` : 'Global',
        packageName: 'Current Package',
        isValid: assertion.constraintExpression !== null && assertion.constraintExpression !== undefined,
        validationMessage: assertion.constraintExpression 
          ? `Constraint: ${assertion.constraintExpression}` 
          : 'Missing constraint expression',
        constraintExpression: assertion.constraintExpression,
        isNegated: assertion.isNegated,
      }))
    }

    // Fallback to HIR extraction if backend not available
    if (!hirData || !hirData.nodes) return []

    // Iterate through HIR nodes to find AssertUsage nodes
    Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
      if (node.kind && node.kind.includes('AssertUsage')) {
        // Get parent verification name
        let parentName = 'Global'
        let packageName = 'Global'
        if (node.parent && hirData.nodes[node.parent]) {
          const parent = hirData.nodes[node.parent]
          parentName = parent.name || 'Unnamed Parent'

          // Traverse up to find package
          let currentNode = parent
          let depth = 0
          while (currentNode && currentNode.parent && depth < 10) {
            const parentNode = hirData.nodes[currentNode.parent]
            if (parentNode) {
              if (parentNode.kind && parentNode.kind.includes('Package')) {
                packageName = parentNode.name || 'Unnamed Package'
                break
              }
              currentNode = parentNode
            } else {
              break
            }
            depth++
          }
        }

        // Validate assertion: check if it has a constraint or expression child
        // Constraint expressions can be:
        // 1. ConstraintUsage nodes (explicit constraint)
        // 2. Expression nodes (BinaryExpr, UnaryExpr, etc.) - the actual constraint expression
        let hasConstraint = false
        let constraintExpression = null
        let constraintNode = null
        
        if (node.children && Array.isArray(node.children)) {
          // Look for constraint or expression nodes
          for (const childId of node.children) {
            const child = hirData.nodes[childId]
            if (!child) continue
            
            const childKind = String(child.kind)
            
            // Check for ConstraintUsage
            if (childKind.includes('ConstraintUsage') || childKind.includes('Constraint')) {
              hasConstraint = true
              constraintNode = child
              // Try to find expression within constraint
              if (child.children && Array.isArray(child.children)) {
                for (const exprId of child.children) {
                  const exprNode = hirData.nodes[exprId]
                  if (exprNode) {
                    const exprKind = String(exprNode.kind)
                    if (exprKind.includes('BinaryExpr') || exprKind.includes('UnaryExpr') || 
                        exprKind.includes('LiteralExpr') || exprKind.includes('NameExpr') ||
                        exprKind.includes('CallExpr') || exprKind.includes('MemberAccessExpr')) {
                      // Found expression node - extract text representation
                      constraintExpression = extractExpressionText(exprNode, hirData)
                      break
                    }
                  }
                }
              }
              break
            }
            
            // Check for direct expression nodes (constraint expression without ConstraintUsage wrapper)
            if (childKind.includes('BinaryExpr') || childKind.includes('UnaryExpr') || 
                childKind.includes('LiteralExpr') || childKind.includes('NameExpr') ||
                childKind.includes('CallExpr') || childKind.includes('MemberAccessExpr') ||
                childKind.includes('TernaryExpr')) {
              hasConstraint = true
              constraintNode = child
              constraintExpression = extractExpressionText(child, hirData)
              break
            }
          }
        }

        const isValid = hasConstraint

        assertList.push({
          title: node.name || 'unnamed assertion',
          kind: 'Assert',
          doc_comment: node.doc_comment,
          stable_id: node.stable_id,
          parentName,
          packageName,
          isValid,
          validationMessage: isValid 
            ? (constraintExpression ? `Constraint: ${constraintExpression}` : 'Has constraint node')
            : 'Missing constraint definition',
          constraintExpression: constraintExpression || null,
        })
      }
    })

    return assertList
  }, [hirData, extractedAssertions])

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

  // Use backend coverage if available, otherwise calculate from HIR
  const testCoverage = useMemo(() => {
    // Use backend coverage (more accurate)
    if (backendCoverage) {
      return {
        percentage: backendCoverage.coveragePercentage || 0,
        verifiedCount: backendCoverage.verifiedRequirements || 0,
        total: backendCoverage.totalRequirements || 0,
        unverified: backendCoverage.unverifiedRequirements || [],
        overVerified: backendCoverage.overVerifiedRequirements || [],
        byMethod: backendCoverage.coverageByMethod || {},
      }
    }

    // Fallback to HIR-based calculation
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
  }, [requirements, verifyRelationships, backendCoverage])

  if (hirLoading || analyticsLoading || testMgmtLoading) {
    return (
      <div className="testing-view">
        <div className="testing-loading">
          Extracting test cases from code...
          {testMgmtLoading && <div style={{ fontSize: '0.9em', marginTop: '0.5rem', opacity: 0.7 }}>
            Using backend test management engine...
          </div>}
        </div>
      </div>
    )
  }

  // Note: If test management WASM methods aren't available, the hooks will
  // gracefully fall back to empty data, and the UI will use HIR extraction instead

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3>Test Analysis</h3>
          {extractedScenarios.length > 0 || backendCoverage ? (
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              ✓ Backend Engine Active
            </span>
          ) : (
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              background: 'rgba(107, 114, 128, 0.1)', 
              color: '#6b7280',
              borderRadius: '4px'
            }}>
              Using HIR Extraction
            </span>
          )}
        </div>
        <div className="testing-stats">
          <span className="test-stat">
            <strong>{verifications.length}</strong> Tests
          </span>
          <span className="test-stat">
            <strong>{assertions.length}</strong> Assertions
          </span>
          <span className="test-stat">
            <strong>{useCases.length}</strong> Scenarios
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
          className={`test-tab ${activeTab === 'traceability' ? 'active' : ''}`}
          onClick={() => setActiveTab('traceability')}
        >
          Traceability
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
                        <tr 
                          key={index} 
                          className={`test-row status-${status.toLowerCase()} ${selectedVerificationId === verif.stable_id ? 'selected' : ''}`}
                          onClick={() => {
                            // Set selected verification to extract its assertions and flows
                            // Use stored nodeId if available
                            if (verif.nodeId) {
                              const numericId = parseInt(verif.nodeId, 10)
                              if (!isNaN(numericId)) {
                                setSelectedVerificationId(numericId)
                                return
                              }
                            }
                            // Fallback: try to find node ID from HIR
                            if (hirData && hirData.nodes) {
                              const nodeEntry = Object.entries(hirData.nodes).find(([_, node]) => 
                                node.name === verif.title && 
                                (node.kind?.includes('VerificationDefinition') || node.kind?.includes('VerificationUsage'))
                              )
                              if (nodeEntry) {
                                const [nodeId] = nodeEntry
                                const numericId = parseInt(nodeId, 10)
                                if (!isNaN(numericId)) {
                                  setSelectedVerificationId(numericId)
                                }
                              }
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
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
                            {actionSequence && selectedVerificationId && 
                             (verif.nodeId && verif.nodeId.toString() === selectedVerificationId.toString()) ? (
                              <div>
                                <div className="action-sequence" style={{ marginBottom: '0.5rem' }}>
                                  {actionSequence.actionNames && actionSequence.actionNames.length > 0 ? (
                                    actionSequence.actionNames.map((name, idx) => (
                                      <span key={idx} className="action-step">
                                        {idx + 1}. {name}
                                        {idx < actionSequence.actionNames.length - 1 && ' → '}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="action-count">{verif.actions.length} steps</span>
                                  )}
                                </div>
                                {actionSequence.flows && actionSequence.flows.length > 0 && (
                                  <div className="flow-info" style={{ fontSize: '0.85em', marginTop: '0.25rem', opacity: 0.8 }}>
                                    <strong>Succession Flows:</strong> {actionSequence.flows.length} flow(s) extracted
                                  </div>
                                )}
                                {actionSequence.startActionId && (
                                  <div className="flow-info" style={{ fontSize: '0.85em', marginTop: '0.25rem', opacity: 0.8 }}>
                                    <strong>Start Action:</strong> ID {actionSequence.startActionId}
                                  </div>
                                )}
                              </div>
                            ) : hasActions ? (
                              <div>
                                <span className="action-count">{verif.actions.length} steps</span>
                                <div style={{ fontSize: '0.8em', marginTop: '0.25rem', opacity: 0.7, fontStyle: 'italic' }}>
                                  Click to extract succession flows
                                </div>
                              </div>
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
            {extractedAssertions.length > 0 && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '0.75rem', 
                background: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: '6px', 
                fontSize: '0.9em',
                borderLeft: '3px solid #10b981'
              }}>
                <strong>✓ Backend Assertion Extraction:</strong> {extractedAssertions.length} assertions extracted with constraint expressions
              </div>
            )}
            {assertions.length > 0 ? (
              <div className="assertions-table-container">
                <table className="testing-table">
                  <thead>
                    <tr>
                      <th>Assertion</th>
                      <th>Test Case</th>
                      <th>Package</th>
                      <th>Constraint Expression</th>
                      <th>Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assertions.map((assertion, index) => (
                      <tr key={index} className={`test-row status-${assertion.isValid ? 'valid' : 'invalid'}`}>
                        <td className="test-title">
                          <strong>{assertion.title}</strong>
                          {assertion.doc_comment && (
                            <div className="test-description" style={{ fontSize: '0.85em', marginTop: '0.25rem' }}>
                              {assertion.doc_comment}
                            </div>
                          )}
                        </td>
                        <td className="test-parent">
                          <code>{assertion.parentName}</code>
                        </td>
                        <td className="test-package">
                          <code>{assertion.packageName}</code>
                        </td>
                        <td className="test-description">
                          {assertion.constraintExpression ? (
                            <div>
                              <code style={{ 
                                fontFamily: 'monospace', 
                                fontSize: '0.9em',
                                padding: '0.25rem 0.5rem',
                                background: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: '3px',
                                display: 'inline-block'
                              }}>
                                {assertion.isNegated && <span style={{ color: '#ef4444' }}>NOT </span>}
                                {assertion.constraintExpression}
                              </code>
                              {extractedAssertions.length > 0 && (
                                <div style={{ fontSize: '0.7em', marginTop: '0.25rem', color: '#10b981' }}>
                                  ✓ Backend extracted
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="empty-cell" style={{ fontStyle: 'italic' }}>
                              No constraint expression
                            </span>
                          )}
                        </td>
                        <td className="test-validation">
                          <span className={`status-badge status-${assertion.isValid ? 'valid' : 'invalid'}`}>
                            {assertion.isValid ? '✓ Valid' : '✗ Invalid'}
                          </span>
                          <div className="validation-message" style={{ fontSize: '0.8em', marginTop: '0.25rem' }}>
                            {assertion.validationMessage}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="testing-empty">
                <p>No assertions found. Add <code>assert</code> statements to verification cases.</p>
                <p style={{ fontSize: '0.9em', marginTop: '0.5rem', opacity: 0.8 }}>
                  <strong>Tip:</strong> Click on a test case in the "Test Cases" tab to extract its assertions and succession flows.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="scenarios-list">
            {useCases.length > 0 ? (
              <div className="scenarios-table-container">
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px', fontSize: '0.9em' }}>
                  <strong>📊 Scenario Extraction:</strong> {extractedScenarios.length > 0 
                    ? `${extractedScenarios.length} scenarios extracted with succession flows and included verifications`
                    : 'Using HIR extraction - backend extraction available with updated WASM module'}
                </div>
                <table className="testing-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Type</th>
                      <th>Package</th>
                      <th>Description</th>
                      <th>Action Sequence</th>
                      <th>Included Tests</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {useCases.map((useCase, index) => {
                      // Check if scenario has actions and description
                      const hasActions = useCase.actions && useCase.actions.length > 0
                      const hasDescription = useCase.doc_comment
                      const hasBackendData = useCase.actionSequence && useCase.actionSequence.actionNames
                      const status = hasActions && hasDescription ? 'Complete' :
                                     hasActions ? 'Partial' :
                                     hasDescription ? 'Documented' : 'Defined'

                      return (
                        <tr key={index} className={`test-row status-${status.toLowerCase()}`}>
                          <td className="test-title">
                            <strong>{useCase.title}</strong>
                            {hasDescription && (
                              <div className="test-description">{useCase.doc_comment}</div>
                            )}
                            {useCase.actionSequence && useCase.actionSequence.flows && useCase.actionSequence.flows.length > 0 && (
                              <div className="scenario-flows" style={{ 
                                fontSize: '0.85em', 
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '4px',
                                borderLeft: '3px solid #10b981'
                              }}>
                                <strong>✓ Succession Flows Extracted:</strong>
                                <div style={{ marginTop: '0.25rem' }}>
                                  {useCase.actionSequence.flows.map((flow, flowIdx) => (
                                    <div key={flowIdx} style={{ fontFamily: 'monospace', fontSize: '0.9em', marginTop: '0.15rem' }}>
                                      <code>{flow.fromActionName}</code> → <code>{flow.toActionName}</code>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="test-type">
                            <span className="type-badge">{useCase.kind.replace(/[\[\]]/g, '')}</span>
                          </td>
                          <td className="test-package">
                            <code>{useCase.packageName}</code>
                          </td>
                          <td className="test-description">
                            {hasDescription ? useCase.doc_comment : 'No description'}
                          </td>
                          <td className="test-actions">
                            {useCase.actionSequence && useCase.actionSequence.actionNames ? (
                              <div>
                                <ol className="compact-list" style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                  {useCase.actionSequence.actionNames.map((name, i) => (
                                    <li key={i}>
                                      <code>{name}</code>
                                      {useCase.actionSequence.startActionId && 
                                       useCase.actionSequence.actionNames.indexOf(name) === 0 && (
                                        <span style={{ fontSize: '0.8em', marginLeft: '0.25rem', opacity: 0.7 }}>
                                          (start)
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ol>
                                {hasBackendData && (
                                  <div style={{ fontSize: '0.75em', marginTop: '0.25rem', color: '#10b981', fontWeight: 600 }}>
                                    ✓ Backend extracted
                                  </div>
                                )}
                              </div>
                            ) : hasActions ? (
                              <div>
                                <ul className="compact-list">
                                  {useCase.actions.map((action, i) => (
                                    <li key={i}><code>{action.name}</code></li>
                                  ))}
                                </ul>
                                <div style={{ fontSize: '0.75em', marginTop: '0.25rem', color: '#6b7280' }}>
                                  HIR extracted
                                </div>
                              </div>
                            ) : (
                              <span className="empty-cell">-</span>
                            )}
                          </td>
                          <td className="test-actions">
                            {useCase.includedVerifications && useCase.includedVerifications.length > 0 ? (
                              <ul className="compact-list">
                                {useCase.includedVerifications.map((verifId, i) => (
                                  <li key={i}>
                                    <code>Verification {verifId}</code>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="empty-cell">-</span>
                            )}
                          </td>
                          <td className="test-status">
                            <span className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                            {hasBackendData && (
                              <div style={{ fontSize: '0.7em', marginTop: '0.25rem', opacity: 0.7 }}>
                                Backend
                              </div>
                            )}
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

        {activeTab === 'traceability' && (
          <div className="traceability-view">
            <h4>Test Traceability Matrix</h4>
            <p className="traceability-description">
              Bidirectional traceability showing relationships between requirements and verification cases.
            </p>

            {verifyRelationships.length > 0 ? (
              <div className="traceability-table-container">
                <table className="testing-table">
                  <thead>
                    <tr>
                      <th>Verification</th>
                      <th>Relationship</th>
                      <th>Requirement</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifyRelationships.map((rel, index) => (
                      <tr key={index} className="test-row">
                        <td className="test-title">
                          <strong>{rel.verification}</strong>
                        </td>
                        <td className="test-relationship">
                          <span className="relationship-badge verify">verifies</span>
                        </td>
                        <td className="test-target">
                          <code>{rel.requirement}</code>
                        </td>
                        <td className="test-source">
                          <span className={`source-badge ${rel.source}`}>
                            {rel.source === 'objective' ? 'Objective Block' : 'Standalone'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="testing-empty">
                <p>No traceability links found.</p>
                <ul>
                  <li>Use <code>verify requirement</code> in verification definitions</li>
                  <li>Or use <code>objective</code> blocks with <code>verify</code> statements</li>
                </ul>
              </div>
            )}

            <div className="traceability-summary">
              <div className="summary-card">
                <span className="summary-value">{verifyRelationships.length}</span>
                <span className="summary-label">Total Verification Links</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">
                  {verifyRelationships.filter(r => r.source === 'objective').length}
                </span>
                <span className="summary-label">From Objectives</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">
                  {verifyRelationships.filter(r => r.source === 'standalone').length}
                </span>
                <span className="summary-label">Standalone</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="coverage-view">
            {backendCoverage && (
              <div style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                background: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: '8px',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#10b981' }}>✓ Backend Coverage Analysis Active</strong>
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  Using advanced coverage calculation with unverified requirement identification and method breakdown.
                </div>
              </div>
            )}
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
                  {backendCoverage && (
                    <div style={{ fontSize: '0.7em', marginTop: '0.25rem', color: '#10b981' }}>
                      Backend calculated
                    </div>
                  )}
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
              {testCoverage.unverified && testCoverage.unverified.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h5>Unverified Requirements ({testCoverage.unverified.length})</h5>
                  <ul style={{ fontSize: '0.9em', marginTop: '0.5rem' }}>
                    {testCoverage.unverified.slice(0, 5).map((req, idx) => (
                      <li key={idx}>
                        <code>{req.name}</code>
                        {req.priority && <span style={{ opacity: 0.7 }}> (Priority: {req.priority})</span>}
                      </li>
                    ))}
                    {testCoverage.unverified.length > 5 && (
                      <li style={{ opacity: 0.7 }}>... and {testCoverage.unverified.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
              {testCoverage.byMethod && Object.keys(testCoverage.byMethod).length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h5>Coverage by Method</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.9em' }}>
                    {Object.entries(testCoverage.byMethod).map(([method, count]) => (
                      <div key={method} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{method}:</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
