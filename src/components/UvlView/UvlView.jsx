import React, { useMemo, useState } from 'react'
import FeatureDiagram from '../FeatureDiagram/FeatureDiagram'
import './UvlView.css'

/**
 * UvlView - UVL (Universal Variability Language) viewer
 *
 * Provides:
 * - Feature tree visualization
 * - Constraint validation
 * - Product line analysis
 * - Configuration generation
 */
export default function UvlView({ code }) {
  const [activeTab, setActiveTab] = useState('tree')

  // Parse UVL code with corrected group keyword handling
  const uvlData = useMemo(() => {
    if (!code || typeof code !== 'string') {
      return { namespace: '', features: [], constraints: [], valid: false }
    }

    try {
      const lines = code.split('\n')
      const result = {
        namespace: null,
        features: [],
        constraints: []
      }

      let inFeatures = false
      let inConstraints = false
      let featureStack = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith('//')) continue

        // Namespace detection
        if (line.startsWith('namespace ')) {
          result.namespace = line.replace('namespace', '').trim()
          continue
        }

        // Features section
        if (line === 'features') {
          inFeatures = true
          inConstraints = false
          continue
        }

        // Constraints section
        if (line === 'constraints') {
          inFeatures = false
          inConstraints = true
          continue
        }

        if (inFeatures) {
          // Calculate indent level
          const originalLine = lines[i]
          const leadingSpaces = originalLine.match(/^\s*/)?.[0].length || 0
          const currentIndent = Math.floor(leadingSpaces / 4) // Assuming 4 spaces per indent

          // Check if this is a group keyword (mandatory, optional, alternative, or)
          const groupKeywords = ['mandatory', 'optional', 'alternative', 'or']
          const isGroupKeyword = groupKeywords.includes(line.trim())

          if (isGroupKeyword) {
            // This is a group keyword - set the current group type for children
            // Adjust stack to find the parent feature
            while (featureStack.length > 0 && featureStack[featureStack.length - 1].indent >= currentIndent) {
              featureStack.pop()
            }

            if (featureStack.length > 0) {
              // Set the group type on the parent feature (for diagram rendering)
              const parent = featureStack[featureStack.length - 1].feature
              parent.currentGroupType = line.trim()

              // Store the group type on the parent for diagram rendering
              // This is used when converting to FeatureDiagram format
              parent.groupType = line.trim()
            }
          } else {
            // Parse feature line
            const featureMatch = line.match(/^(\w+)(?:\s+(mandatory|optional|alternative|or))?$/)
            if (featureMatch) {
              const featureName = featureMatch[1]

              // Determine feature type based on parent's current group type
              let featureType = 'mandatory' // default

              // Adjust stack based on indent level
              while (featureStack.length > 0 && featureStack[featureStack.length - 1].indent >= currentIndent) {
                featureStack.pop()
              }

              // Check parent's current group type
              if (featureStack.length > 0) {
                const parent = featureStack[featureStack.length - 1].feature
                if (parent.currentGroupType) {
                  featureType = parent.currentGroupType
                }
              }

              const feature = {
                name: featureName,
                type: featureType,
                children: [],
                currentGroupType: null // Will be set if this feature has group children
              }

              if (featureStack.length === 0) {
                // Root feature
                result.features.push(feature)
                featureStack.push({ feature, indent: currentIndent })
              } else {
                // Child feature
                const parent = featureStack[featureStack.length - 1].feature
                parent.children.push(feature)
                featureStack.push({ feature, indent: currentIndent })
              }
            }
          }
        }

        if (inConstraints) {
          // Parse constraint
          result.constraints.push({
            text: line,
            type: line.includes('=>') ? 'implication' :
                  line.includes('!') ? 'exclusion' : 'dependency'
          })
        }
      }

      return { ...result, valid: true }
    } catch (error) {
      console.error('UVL parsing error:', error)
      return { namespace: '', features: [], constraints: [], valid: false, error: error.message }
    }
  }, [code])

  // Feature hierarchy is already built in the parser
  const featureHierarchy = useMemo(() => {
    if (!uvlData.valid) return []
    return uvlData.features
  }, [uvlData])

  // Count features recursively
  const countFeatures = (features) => {
    let count = 0
    features.forEach(f => {
      count++
      if (f.children && f.children.length > 0) {
        count += countFeatures(f.children)
      }
    })
    return count
  }

  // Count features by type recursively
  const countFeaturesByType = (features, type) => {
    let count = 0
    features.forEach(f => {
      if (f.type === type) count++
      if (f.children && f.children.length > 0) {
        count += countFeaturesByType(f.children, type)
      }
    })
    return count
  }

  // Build flat feature map for constraint validation
  const featureMap = useMemo(() => {
    const map = {}
    const addToMap = (features) => {
      features.forEach(f => {
        map[f.name] = f
        if (f.children && f.children.length > 0) {
          addToMap(f.children)
        }
      })
    }
    addToMap(uvlData.features)
    return map
  }, [uvlData.features])

  // Calculate product line metrics
  const metrics = useMemo(() => {
    const featureCount = countFeatures(uvlData.features)
    const constraintCount = uvlData.constraints.length
    const mandatoryFeatures = countFeaturesByType(uvlData.features, 'mandatory')
    const optionalFeatures = countFeaturesByType(uvlData.features, 'optional')

    // Calculate theoretical configuration count (simplified)
    const configurationsCount = Math.pow(2, optionalFeatures)

    return {
      featureCount,
      constraintCount,
      mandatoryFeatures,
      optionalFeatures,
      configurationsCount
    }
  }, [uvlData])

  // Validate constraints
  const constraintValidation = useMemo(() => {
    return uvlData.constraints.map(constraint => {
      // Simple validation - check if referenced features exist
      const parts = constraint.text.split(/=>|!/).map(p => p.trim())
      const allFeaturesExist = parts.every(part =>
        part === '' || featureMap[part] !== undefined
      )

      return {
        ...constraint,
        valid: allFeaturesExist,
        message: allFeaturesExist ? 'Valid' : 'References unknown feature'
      }
    })
  }, [uvlData.constraints, featureMap])

  // Convert features to FeatureDiagram format
  const featureTree = useMemo(() => {
    const convertFeature = (feature) => {
      // Check if this feature has a groupType property (set by the parser for parents with grouped children)
      let groupType = feature.groupType || 'and'
      let isOptional = false

      // Determine optional status based on feature type
      if (feature.type === 'optional') {
        isOptional = true
      } else if (feature.type === 'alternative') {
        // If type is alternative but no groupType, this is a child of an alternative group
        isOptional = false
      } else if (feature.type === 'or') {
        // If type is or but no groupType, this is a child of an or group
        isOptional = false
      } else if (feature.type === 'mandatory') {
        isOptional = false
      }

      const node = {
        id: feature.name,
        name: feature.name,
        groupType: groupType,
        group_type: groupType,
        is_optional: isOptional,
        optional: isOptional,
        children: []
      }

      if (feature.children && feature.children.length > 0) {
        node.children = feature.children.map(child => convertFeature(child))
      }

      return node
    }

    // Create root node
    if (uvlData.features && uvlData.features.length > 0) {
      if (uvlData.features.length > 1) {
        return {
          root: {
            id: 'root',
            name: 'Root',
            groupType: 'and',
            children: uvlData.features.map(f => convertFeature(f))
          },
          constraints: uvlData.constraints || []
        }
      } else {
        return {
          root: convertFeature(uvlData.features[0]),
          constraints: uvlData.constraints || []
        }
      }
    }

    return { root: null, constraints: [] }
  }, [uvlData])

  if (!uvlData.valid) {
    return (
      <div className="uvl-view">
        <div className="uvl-error">
          <h3>⚠️ Invalid UVL Code</h3>
          <p>{uvlData.error || 'Please provide valid UVL code'}</p>
          <div className="uvl-help">
            <strong>Expected format:</strong>
            <pre>{`namespace YourNamespace

features
    FeatureName
        mandatory
            SubFeature1
        optional
            SubFeature2

constraints
    Feature1 => Feature2`}</pre>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="uvl-view">
      <div className="uvl-header">
        <h3>📐 {uvlData.namespace || 'UVL Model'}</h3>
        <div className="uvl-stats">
          <div className="stat-badge">
            <span className="stat-value">{metrics.featureCount}</span>
            <span className="stat-label">Features</span>
          </div>
          <div className="stat-badge">
            <span className="stat-value">{metrics.constraintCount}</span>
            <span className="stat-label">Constraints</span>
          </div>
          <div className="stat-badge">
            <span className="stat-value">{metrics.configurationsCount}</span>
            <span className="stat-label">Configs</span>
          </div>
        </div>
      </div>

      <div className="uvl-tabs">
        <button
          className={`uvl-tab ${activeTab === 'tree' ? 'active' : ''}`}
          onClick={() => setActiveTab('tree')}
        >
          Feature Tree
        </button>
        <button
          className={`uvl-tab ${activeTab === 'constraints' ? 'active' : ''}`}
          onClick={() => setActiveTab('constraints')}
        >
          Constraints
        </button>
        <button
          className={`uvl-tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
        <button
          className={`uvl-tab ${activeTab === 'diagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagram')}
        >
          Diagram
        </button>
      </div>

      <div className="uvl-content">
        {activeTab === 'tree' && (
          <div className="uvl-tree-view">
            <h4>Feature Hierarchy</h4>
            {featureHierarchy.length === 0 ? (
              <div className="uvl-empty">No features defined</div>
            ) : (
              <div className="feature-tree">
                {featureHierarchy.map((feature, idx) => (
                  <FeatureNode key={idx} feature={feature} level={0} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="uvl-constraints-view">
            <h4>Constraint Validation</h4>
            {constraintValidation.length === 0 ? (
              <div className="uvl-empty">No constraints defined</div>
            ) : (
              <div className="constraints-list">
                {constraintValidation.map((constraint, idx) => (
                  <div key={idx} className={`constraint-item ${constraint.type}`}>
                    <span className={`constraint-status ${constraint.valid ? 'valid' : 'invalid'}`}>
                      {constraint.valid ? '✓' : '✗'}
                    </span>
                    <code className="constraint-text">{constraint.text}</code>
                    <span className="constraint-type-badge">{constraint.type}</span>
                    {!constraint.valid && (
                      <span className="constraint-error">{constraint.message}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="uvl-analysis-view">
            <h4>Product Line Analysis</h4>
            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-metric">
                  <span className="metric-label">Total Features</span>
                  <span className="metric-value">{metrics.featureCount}</span>
                </div>
                <div className="metric-breakdown">
                  <div>Mandatory: {metrics.mandatoryFeatures}</div>
                  <div>Optional: {metrics.optionalFeatures}</div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-metric">
                  <span className="metric-label">Constraints</span>
                  <span className="metric-value">{metrics.constraintCount}</span>
                </div>
                <div className="metric-breakdown">
                  <div>Valid: {constraintValidation.filter(c => c.valid).length}</div>
                  <div>Invalid: {constraintValidation.filter(c => !c.valid).length}</div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-metric">
                  <span className="metric-label">Configurations</span>
                  <span className="metric-value">{metrics.configurationsCount.toLocaleString()}</span>
                </div>
                <div className="metric-breakdown">
                  <div>Theoretical maximum</div>
                </div>
              </div>
            </div>

            <div className="configuration-preview">
              <h5>Sample Configurations</h5>
              <div className="config-samples">
                <div className="config-sample">
                  <strong>Minimal:</strong> All mandatory features only
                </div>
                <div className="config-sample">
                  <strong>Maximal:</strong> All features enabled
                </div>
                <div className="config-sample">
                  <strong>Custom:</strong> User-selected features
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagram' && (
          <div className="uvl-diagram-view">
            <h4>Feature Diagram</h4>
            {featureTree.root ? (
              <div className="feature-diagram-container">
                <FeatureDiagram featureTree={featureTree} />
              </div>
            ) : (
              <div className="uvl-empty">No features to visualize</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Feature node component for tree view
function FeatureNode({ feature, level }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="feature-node" style={{ marginLeft: `${level * 20}px` }}>
      <div className="feature-node-header">
        {feature.children && feature.children.length > 0 && (
          <button
            className="expand-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        <span className="feature-name">{feature.name}</span>
        {feature.type === 'mandatory' && <span className="feature-badge mandatory">M</span>}
        {feature.type === 'optional' && <span className="feature-badge optional">O</span>}
        {feature.type === 'alternative' && <span className="feature-badge alternative">A</span>}
        {feature.type === 'or' && <span className="feature-badge or">OR</span>}
      </div>
      {expanded && feature.children && feature.children.length > 0 && (
        <div className="feature-children">
          {feature.children.map((child, idx) => (
            <FeatureNode key={idx} feature={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
