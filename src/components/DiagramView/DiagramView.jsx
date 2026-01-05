import React, { useState, useMemo } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLHir } from '../../hooks/useSysMLHir'
import SpotlightCard from '../SpotlightCard'
import TreeView from '../DocumentationTabs/TreeView'
import BlockDiagram from './BlockDiagram'
import StateMachineDiagram from './StateMachineDiagram'
import './DiagramView.css'

export default function DiagramView({ code }) {
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')
  const { hirData, loading: hirLoading } = useSysMLHir(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('elements')

  // Extract diagram elements from documentation
  const diagramElements = useMemo(() => {
    if (!documentation || !documentation.chapters) return { parts: [], states: [], actions: [], connections: [] }

    const parts = []
    const states = []
    const actions = []
    const connections = []

    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind?.includes('Part')) {
            parts.push({ ...sub, packageName: chapter.title })
          }
          if (sub.kind?.includes('State')) {
            states.push({ ...sub, packageName: chapter.title })
          }
          if (sub.kind?.includes('Action')) {
            actions.push({ ...sub, packageName: chapter.title })
          }
          // Extract connections from nested elements
          if (sub.nested_elements) {
            sub.nested_elements.forEach(nested => {
              if (nested.kind?.includes('Connection') || nested.signature?.includes('connect')) {
                connections.push({ ...nested, parentName: sub.title })
              }
            })
          }
        })
      }
    })

    return { parts, states, actions, connections }
  }, [documentation])

  if (docLoading || hirLoading) {
    return (
      <div className="diagram-view">
        <div className="diagram-loading">Extracting diagram data...</div>
      </div>
    )
  }

  if (!code || code.trim().length === 0) {
    return (
      <div className="diagram-view">
        <div className="diagram-empty">
          Write SysML v2 code in the editor to see diagram element extraction.
        </div>
      </div>
    )
  }

  const totalElements = diagramElements.parts.length + diagramElements.states.length +
                       diagramElements.actions.length + diagramElements.connections.length

  return (
    <div className="diagram-view">
      <div className="diagram-header">
        <h3>Diagram Analysis</h3>
        <div className="diagram-stats">
          <span className="diagram-stat">
            <strong>{totalElements}</strong> Elements
          </span>
          <span className="diagram-stat">
            <strong>{diagramElements.connections.length}</strong> Connections
          </span>
        </div>
      </div>

      <div className="diagram-tabs">
        <button
          className={`diagram-tab ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveTab('elements')}
        >
          Elements
        </button>
        <button
          className={`diagram-tab ${activeTab === 'structure' ? 'active' : ''}`}
          onClick={() => setActiveTab('structure')}
        >
          Structure (BDD)
        </button>
        <button
          className={`diagram-tab ${activeTab === 'behavior' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavior')}
        >
          Behavior
        </button>
        <button
          className={`diagram-tab ${activeTab === 'hir' ? 'active' : ''}`}
          onClick={() => setActiveTab('hir')}
        >
          HIR Tree
        </button>
      </div>

      <div className="diagram-content">
        {activeTab === 'elements' && (
          <div className="elements-summary">
            <SpotlightCard>
              <div className="element-count">
                <div className="count-label">Parts (BDD)</div>
                <div className="count-value">{diagramElements.parts.length}</div>
              </div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="element-count">
                <div className="count-label">States (STM)</div>
                <div className="count-value">{diagramElements.states.length}</div>
              </div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="element-count">
                <div className="count-label">Actions (ACT)</div>
                <div className="count-value">{diagramElements.actions.length}</div>
              </div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="element-count">
                <div className="count-label">Connections (IBD)</div>
                <div className="count-value">{diagramElements.connections.length}</div>
              </div>
            </SpotlightCard>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="structure-view">
            <h4>Block Definition Diagram (BDD)</h4>
            <p className="diagram-description">
              Interactive visualization of parts, their attributes, ports, and composition relationships.
            </p>
            <BlockDiagram parts={diagramElements.parts} />
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="behavior-view">
            <h4>State Machine Diagram (STM)</h4>
            <p className="diagram-description">
              Interactive visualization of state machines with transitions, entry/exit actions, and activities.
            </p>
            <StateMachineDiagram
              states={diagramElements.states}
              actions={diagramElements.actions}
            />
          </div>
        )}

        {activeTab === 'hir' && (
          <div className="hir-view">
            {hirData ? (
              <>
                <div className="hir-info">
                  <p>High-level Intermediate Representation extracted by WASM parser</p>
                  {hirData.stats && (
                    <p className="hir-stats-line">
                      Total nodes: <strong>{hirData.stats.total_nodes || 0}</strong> |
                      Roots: <strong>{hirData.roots?.length || 0}</strong>
                    </p>
                  )}
                </div>
                <div className="hir-tree-container">
                  <TreeView data={hirData} rootKey="hir" maxDepth={6} />
                </div>
              </>
            ) : (
              <div className="diagram-empty">HIR data not available. WASM module may not be loaded.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
