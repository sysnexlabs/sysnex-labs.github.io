import React, { useState, useMemo } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import SpotlightCard from '../SpotlightCard'
import './SimulationView.css'

/**
 * Simulation View Component
 *
 * Extracts and displays simulations, state machines, and scenarios from SysML v2 code using WASM
 */
export default function SimulationView({ code }) {
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('states')

  // Extract state definitions (state machines)
  const stateMachines = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const states = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('StateDefinition') || sub.kind.includes('StateDef'))) {
            states.push({
              ...sub,
              packageName: chapter.title,
            })
          }
        })
      }
    })
    return states
  }, [documentation])

  // Extract action definitions (simulation actions)
  const actions = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const actionList = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('ActionDefinition') || sub.kind.includes('ActionDef'))) {
            actionList.push({
              ...sub,
              packageName: chapter.title,
            })
          }
        })
      }
    })
    return actionList
  }, [documentation])

  // Extract calc definitions (calculations)
  const calculations = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const calcList = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          // CalcDefinitions appear as anonymous Element types with CalcDefinition in stable_id
          if (sub.kind && (sub.kind.includes('CalcDefinition') || sub.kind.includes('CalculationDef'))) {
            calcList.push({
              ...sub,
              packageName: chapter.title,
            })
          }
        })
      }
    })
    return calcList
  }, [documentation])

  // Extract scenario elements (action/state usages)
  const scenarios = useMemo(() => {
    if (!documentation || !documentation.chapters) return []

    const scenarioList = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('ActionUsage') || sub.kind.includes('StateUsage'))) {
            scenarioList.push({
              ...sub,
              packageName: chapter.title,
            })
          }
        })
      }
    })
    return scenarioList
  }, [documentation])

  if (docLoading || analyticsLoading) {
    return (
      <div className="simulation-view">
        <div className="simulation-loading">Extracting simulation data...</div>
      </div>
    )
  }

  if (!code || code.trim().length === 0) {
    return (
      <div className="simulation-view">
        <div className="simulation-empty">
          Write SysML v2 simulation code to see state machines, actions, and scenarios.
        </div>
      </div>
    )
  }

  return (
    <div className="simulation-view">
      <div className="simulation-header">
        <h3>Simulation Analysis</h3>
        <div className="simulation-stats">
          <span className="sim-stat">
            <strong>{stateMachines.length}</strong> State Machines
          </span>
          <span className="sim-stat">
            <strong>{actions.length}</strong> Actions
          </span>
          <span className="sim-stat">
            <strong>{scenarios.length}</strong> Scenarios
          </span>
        </div>
      </div>

      <div className="simulation-tabs">
        <button
          className={`sim-tab ${activeTab === 'states' ? 'active' : ''}`}
          onClick={() => setActiveTab('states')}
        >
          State Machines
        </button>
        <button
          className={`sim-tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
        <button
          className={`sim-tab ${activeTab === 'calculations' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculations')}
        >
          Calculations
        </button>
        <button
          className={`sim-tab ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          Scenarios
        </button>
      </div>

      <div className="simulation-content">
        {activeTab === 'states' && (
          <div className="state-machines-list">
            {stateMachines.length > 0 ? (
              stateMachines.map((state, index) => (
                <SpotlightCard key={index}>
                  <div className="state-machine-item">
                    <div className="state-machine-header">
                      <span className="state-machine-badge">{state.kind}</span>
                      <h4 className="state-machine-title">{state.title}</h4>
                    </div>
                    {state.doc_comment && (
                      <div className="state-machine-doc">{state.doc_comment}</div>
                    )}
                    {state.nested_elements && state.nested_elements.length > 0 && (
                      <div className="state-machine-states">
                        <strong>States:</strong>
                        <div className="states-grid">
                          {state.nested_elements.map((el, i) => (
                            <div key={i} className="state-item">
                              <div className="state-item-header">
                                <span className="state-name">{el.title}</span>
                                <span className="state-kind">{el.kind}</span>
                              </div>
                              {el.doc_comment && (
                                <div className="state-doc">{el.doc_comment}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="simulation-empty">
                No state machines found. Define state machines using <code>state def</code>.
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-list">
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <SpotlightCard key={index}>
                  <div className="action-item">
                    <div className="action-header">
                      <span className="action-badge">{action.kind}</span>
                      <h4 className="action-title">{action.title}</h4>
                    </div>
                    {action.doc_comment && (
                      <div className="action-doc">{action.doc_comment}</div>
                    )}
                    {action.nested_elements && action.nested_elements.length > 0 && (
                      <div className="action-steps">
                        <strong>Steps:</strong>
                        <ul>
                          {action.nested_elements.map((el, i) => (
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
              <div className="simulation-empty">
                No actions found. Define actions using <code>action def</code>.
              </div>
            )}
          </div>
        )}

        {activeTab === 'calculations' && (
          <div className="calculations-list">
            {calculations.length > 0 ? (
              calculations.map((calc, index) => (
                <SpotlightCard key={index}>
                  <div className="calculation-item">
                    <div className="calculation-header">
                      <span className="calculation-badge">CALC</span>
                      <h4 className="calculation-title">{calc.title}</h4>
                    </div>
                    {calc.doc_comment && (
                      <div className="calculation-doc">{calc.doc_comment}</div>
                    )}
                    {calc.signature && (
                      <div className="calculation-signature">
                        <code>{calc.signature}</code>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="simulation-empty">
                No calculations found. Define calculations using <code>calc def</code>.
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="scenarios-list">
            {scenarios.length > 0 ? (
              scenarios.map((scenario, index) => (
                <SpotlightCard key={index}>
                  <div className="scenario-item">
                    <div className="scenario-header">
                      <span className="scenario-badge">{scenario.kind}</span>
                      <h4 className="scenario-title">{scenario.title}</h4>
                    </div>
                    <div className="scenario-package">
                      Package: <code>{scenario.packageName}</code>
                    </div>
                    {scenario.doc_comment && (
                      <div className="scenario-doc">{scenario.doc_comment}</div>
                    )}
                  </div>
                </SpotlightCard>
              ))
            ) : (
              <div className="simulation-empty">
                No scenarios found. Create action or state instances to define scenarios.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
