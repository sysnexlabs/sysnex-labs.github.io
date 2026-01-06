import React, { useState, useMemo } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLSimulation } from '../../hooks/useSysMLSimulation'
import SpotlightCard from '../SpotlightCard'
import ExecutionTimeline from './ExecutionTimeline'
import StateTransitionGraph from './StateTransitionGraph'
import BatterySimulationControls from './BatterySimulationControls'
import PhysicsGauges from './PhysicsGauges'
import './SimulationView.css'

/**
 * Simulation View Component
 *
 * Extracts and displays simulations, state machines, and scenarios from SysML v2 code using WASM
 * Enhanced with interactive simulation controls and real-time physics visualization
 */
export default function SimulationView({ code }) {
  const { documentation, loading: docLoading } = useSysMLDocumentation(code, 'editor://current')
  const { analytics, loading: analyticsLoading } = useSysMLAnalytics(code, 'editor://current')
  const { simulation, loading: simLoading } = useSysMLSimulation(code, 'editor://current')
  const [activeTab, setActiveTab] = useState('execution')

  // Simulation control state
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [physicsData, setPhysicsData] = useState({
    soc: 20,
    voltage: 350,
    current: 120,
    temperature: 25,
    phase: 'Idle'
  })

  // Handle simulation controls
  const handleToggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning)
    if (!isSimulationRunning) {
      // Start simulation - in a real implementation, this would trigger physics calculations
      console.log('Starting simulation at speed:', simulationSpeed)
    } else {
      console.log('Pausing simulation')
    }
  }

  const handleSpeedChange = (newSpeed) => {
    setSimulationSpeed(newSpeed)
    console.log('Simulation speed changed to:', newSpeed)
  }

  const handleRestart = () => {
    setPhysicsData({
      soc: 20,
      voltage: 350,
      current: 120,
      temperature: 25,
      phase: 'Idle'
    })
    setIsSimulationRunning(false)
    console.log('Simulation restarted')
  }

  // Get state machines from WASM backend
  const stateMachines = useMemo(() => {
    if (!simulation || !simulation.stateMachines) return []
    return simulation.stateMachines
  }, [simulation])

  // Get actions from WASM backend
  const actions = useMemo(() => {
    if (!simulation || !simulation.actions) return []
    return simulation.actions
  }, [simulation])

  // Get calculations from WASM backend
  const calculations = useMemo(() => {
    if (!simulation || !simulation.calculations) return []
    return simulation.calculations
  }, [simulation])

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

  if (docLoading || analyticsLoading || simLoading) {
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
          {simulation && simulation.stats && (
            <>
              <span className="sim-stat">
                <strong>{simulation.stats.totalStates}</strong> States
              </span>
              <span className="sim-stat">
                <strong>{simulation.stats.totalTransitions}</strong> Transitions
              </span>
              <span className="sim-stat">
                <strong>{simulation.stats.totalActions}</strong> Actions
              </span>
              <span className="sim-stat">
                <strong>{simulation.stats.estimatedExecutionTime}ms</strong> Est. Execution
              </span>
            </>
          )}
        </div>
      </div>

      <div className="simulation-tabs">
        <button
          className={`sim-tab ${activeTab === 'execution' ? 'active' : ''}`}
          onClick={() => setActiveTab('execution')}
        >
          Execution Flow
        </button>
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
      </div>

      <div className="simulation-content">
        {activeTab === 'execution' && (
          <div className="execution-view">
            {/* Interactive Simulation Controls */}
            <BatterySimulationControls
              isRunning={isSimulationRunning}
              speed={simulationSpeed}
              onToggleRunning={handleToggleSimulation}
              onSpeedChange={handleSpeedChange}
              onRestart={handleRestart}
            />

            {/* Real-Time Physics Gauges */}
            <PhysicsGauges physicsData={physicsData} />

            {simulation && simulation.timeline && simulation.timeline.length > 0 ? (
              <>
                {/* Execution Statistics */}
                <div className="execution-stats">
                  <h4>Execution Statistics</h4>
                  <div className="stats-grid">
                    <SpotlightCard>
                      <div className="stat-card">
                        <div className="stat-label">Total Events</div>
                        <div className="stat-value">{simulation.timeline.length}</div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard>
                      <div className="stat-card">
                        <div className="stat-label">Execution Time</div>
                        <div className="stat-value">{simulation.stats.estimatedExecutionTime}ms</div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard>
                      <div className="stat-card">
                        <div className="stat-label">Avg Action Duration</div>
                        <div className="stat-value">{Math.round(simulation.stats.averageActionDuration)}ms</div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard>
                      <div className="stat-card">
                        <div className="stat-label">Max Calc Complexity</div>
                        <div className="stat-value">{simulation.stats.maxCalculationComplexity}</div>
                      </div>
                    </SpotlightCard>
                  </div>
                </div>

                {/* Execution Timeline */}
                <SpotlightCard>
                  <ExecutionTimeline
                    timeline={simulation.timeline}
                    totalDuration={simulation.stats.estimatedExecutionTime}
                  />
                </SpotlightCard>

                {/* State Transition Graphs */}
                {simulation.stateMachines && simulation.stateMachines.length > 0 && (
                  <div className="state-graphs">
                    <h4>State Transition Graphs</h4>
                    <div className="graphs-grid">
                      {simulation.stateMachines.map((sm, idx) => (
                        <SpotlightCard key={idx}>
                          <StateTransitionGraph stateMachine={sm} />
                        </SpotlightCard>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <strong>Interactive Demo:</strong> The simulation controls and physics gauges above demonstrate
                  the kind of real-time visualization capabilities available with NexSim. Define state machines
                  and actions in the editor to see actual execution flow and timeline analysis.
                </div>
                <div className="simulation-empty" style={{ marginTop: '1rem' }}>
                  No execution flow found. Define state machines and actions to see simulation execution.
                </div>
              </>
            )}
          </div>
        )}

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
