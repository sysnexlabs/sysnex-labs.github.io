import React, { useState, useMemo, useEffect } from 'react'
import './TreeView.css'

/**
 * TreeView component for displaying hierarchical data (CST, HIR)
 */
export default function TreeView({ data, rootKey = 'root', maxDepth = 50, autoExpandDepth = 50 }) {
  // Auto-expand ALL levels (no depth limit for initial expansion)
  const initialExpanded = useMemo(() => {
    const expandedSet = new Set()
    const autoExpand = (node, key, depth = 0) => {
      // Expand up to maxDepth to prevent infinite loops
      if (depth > maxDepth) return

      // Always expand arrays and objects
      if (Array.isArray(node)) {
        expandedSet.add(key)
        node.forEach((item, idx) => {
          const childKey = `${key}[${idx}]`
          autoExpand(item, childKey, depth + 1)
        })
      } else if (node && typeof node === 'object' && node !== null) {
        expandedSet.add(key)
        Object.keys(node).forEach(k => {
          const childKey = `${key}.${k}`
          autoExpand(node[k], childKey, depth + 1)
        })
      }
    }
    if (data) {
      autoExpand(data, rootKey, 0)
    }
    console.log(`[TreeView] Auto-expanded ${expandedSet.size} nodes for rootKey="${rootKey}"`)
    return expandedSet
  }, [data, rootKey, maxDepth])

  const [expanded, setExpanded] = useState(initialExpanded)

  // Update expanded state when data changes
  useEffect(() => {
    setExpanded(initialExpanded)
  }, [initialExpanded])

  const toggle = (key) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpanded(newExpanded)
  }

  const renderNode = (node, key, depth = 0) => {
    if (depth > maxDepth) {
      return null
    }

    const isExpanded = expanded.has(key)

    // Determine node type and value
    let nodeType = 'unknown'
    let nodeValue = null
    let children = null
    let hasChildren = false

    if (Array.isArray(node)) {
      nodeType = 'array'
      nodeValue = `Array[${node.length}]`
      children = node.map((item, idx) => ({ key: `${key}[${idx}]`, value: item }))
      hasChildren = node.length > 0
    } else if (node && typeof node === 'object') {
      nodeType = 'object'
      const keys = Object.keys(node)
      if (keys.length === 0) {
        nodeValue = '{}'
        hasChildren = false
      } else {
        nodeValue = keys.length === 1 ? keys[0] : `${keys.length} properties`
        children = keys.map(k => ({ key: `${key}.${k}`, value: node[k], name: k }))
        hasChildren = true
      }
    } else {
      nodeType = 'primitive'
      nodeValue = String(node)
      hasChildren = false
    }

    const displayKey = key.split('.').pop() || key.split('[')[0] || key

    return (
      <div key={key} className="tree-node" style={{ marginLeft: `${depth * 16}px` }}>
        <div 
          className="tree-node-header"
          onClick={() => hasChildren && toggle(key)}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
        >
          {hasChildren && (
            <span className="tree-toggle">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className="tree-key">{displayKey}:</span>
          <span className={`tree-value tree-value-${nodeType}`}>
            {nodeType === 'primitive' ? (
              <span className="tree-primitive">{nodeValue}</span>
            ) : (
              <span className="tree-type">{nodeValue}</span>
            )}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="tree-children">
            {children.map(({ key: childKey, value: childValue, name }) => 
              renderNode(childValue, childKey, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const expandAll = () => {
    const expandedSet = new Set()
    const collectAllKeys = (node, key, depth = 0) => {
      if (depth > maxDepth) return
      expandedSet.add(key)
      if (Array.isArray(node)) {
        node.forEach((item, idx) => {
          collectAllKeys(item, `${key}[${idx}]`, depth + 1)
        })
      } else if (node && typeof node === 'object') {
        Object.keys(node).forEach(k => {
          collectAllKeys(node[k], `${key}.${k}`, depth + 1)
        })
      }
    }
    if (data) {
      collectAllKeys(data, rootKey)
    }
    setExpanded(expandedSet)
  }

  const collapseAll = () => {
    setExpanded(new Set([rootKey]))
  }

  if (!data) {
    return <div className="tree-view-empty">No data to display</div>
  }

  return (
    <div className="tree-view">
      <div className="tree-view-controls" style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={expandAll}
          style={{
            padding: '0.25rem 0.75rem',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          style={{
            padding: '0.25rem 0.75rem',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Collapse All
        </button>
      </div>
      {renderNode(data, rootKey)}
    </div>
  )
}

