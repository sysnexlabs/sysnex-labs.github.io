import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSysMLDocumentation } from '../../hooks/useSysMLWasm'
import { useSysMLAnalytics } from '../../hooks/useSysMLAnalytics'
import { useSysMLSimulation } from '../../hooks/useSysMLSimulation'
import { useSysMLHir } from '../../hooks/useSysMLHir'
import SpotlightCard from '../SpotlightCard'
import ExecutionTimeline from './ExecutionTimeline'
import StateTransitionGraph from './StateTransitionGraph'
import BatterySimulationControls from './BatterySimulationControls'
import PhysicsGauges from './PhysicsGauges'
import ChargingCharts from './ChargingCharts'
import MessageSequenceChart from './MessageSequenceChart'
import ChargingSimulation from './ChargingSimulation'
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
  const { hirData } = useSysMLHir(code, 'editor://current')
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
  const [simulationHistory, setSimulationHistory] = useState([])

  // Simulation engine reference
  const simulationRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastUpdateTimeRef = useRef(0)

  // Initialize simulation
  useEffect(() => {
    try {
      simulationRef.current = new ChargingSimulation()
    } catch (error) {
      console.error('Failed to initialize simulation:', error)
      // Fallback to default simulation
      simulationRef.current = new ChargingSimulation()
    }
    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [])

  // Simulation loop
  useEffect(() => {
    if (!isSimulationRunning || !simulationRef.current) {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    let simTime = 0
    let lastRecordedTime = -1

    const simulate = () => {
      if (!simulationRef.current || !isSimulationRunning) {
        return
      }

      try {
        // Step simulation (1 second per step)
        const shouldContinue = simulationRef.current.step(1)
        simTime++

        // Update physics data
        const data = simulationRef.current.getData()
        
        // Validate data before setting state
        if (data && typeof data.soc === 'number' && isFinite(data.soc)) {
          setPhysicsData({
            soc: Math.max(0, Math.min(100, data.soc)),
            voltage: Math.max(0, data.voltage || 0),
            current: Math.max(0, data.current || 0),
            temperature: Math.max(0, data.temperature || 25),
            phase: data.phase || 'Idle'
          })
        }

      // Record history every 10 seconds of simulation time (or every second if less than 10 seconds)
      const currentSimTime = Math.floor(simulationRef.current.time)
      const shouldRecord = currentSimTime > 0 && 
        (currentSimTime < 10 ? currentSimTime % 1 === 0 : currentSimTime % 10 === 0) &&
        currentSimTime !== lastRecordedTime
      
      if (shouldRecord) {
        lastRecordedTime = currentSimTime
        setSimulationHistory(prev => {
          // Avoid duplicates
          const existingIndex = prev.findIndex(h => Math.floor(h.time) === currentSimTime)
          if (existingIndex >= 0) {
            // Update existing entry
            const updated = [...prev]
            updated[existingIndex] = {
              soc: data.soc,
              voltage: data.voltage,
              current: data.current,
              temperature: data.temperature,
              power: data.power,
              time: data.time
            }
            return updated
          }
          
          const newHistory = [...prev, {
            soc: data.soc,
            voltage: data.voltage,
            current: data.current,
            temperature: data.temperature,
            power: data.power,
            time: data.time
          }]
          // Keep last 200 data points for smoother charts
          return newHistory.slice(-200)
        })
      }

        if (!shouldContinue) {
          setIsSimulationRunning(false)
          return
        }

        // Schedule next update (100ms = 10 updates per second, scaled by speed)
        const updateInterval = Math.max(50, 100 / simulationSpeed)
        animationFrameRef.current = setTimeout(simulate, updateInterval)
      } catch (error) {
        console.error('Simulation error:', error)
        setIsSimulationRunning(false)
      }
    }

    // Start simulation
    animationFrameRef.current = setTimeout(simulate, 100 / simulationSpeed)

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isSimulationRunning, simulationSpeed])

  // Handle simulation controls
  const handleToggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning)
  }

  const handleSpeedChange = (newSpeed) => {
    setSimulationSpeed(newSpeed)
  }

  const handleRestart = () => {
    if (simulationRef.current) {
      simulationRef.current.reset()
    }
    setPhysicsData({
      soc: 20,
      voltage: 350,
      current: 120,
      temperature: 25,
      phase: 'Idle'
    })
    setSimulationHistory([])
    setIsSimulationRunning(false)
  }

  // Parse code directly to extract state machines (fallback when WASM/HIR don't work)
  const parseStateMachinesFromCode = (code) => {
    const stateMachines = []
    const lines = code.split('\n')
    let currentStateMachine = null
    let braceDepth = 0
    let startDepth = 0
    let inStateMachine = false
    let docComment = ''
    let inDocComment = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Track doc comments
      if (line.startsWith('doc /*')) {
        inDocComment = true
        docComment = line.replace('doc /*', '').replace('*/', '').trim()
      } else if (inDocComment && line.includes('*/')) {
        docComment += ' ' + line.replace('*/', '').trim()
        inDocComment = false
      } else if (inDocComment) {
        docComment += ' ' + line.replace(/^\*+\s*/, '').trim()
        continue
      }
      
      // Track brace depth (global)
      braceDepth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length
      
      // Detect state def
      const stateDefMatch = line.match(/state\s+def\s+(\w+)/i)
      if (stateDefMatch) {
        if (currentStateMachine) {
          stateMachines.push(currentStateMachine)
        }
        currentStateMachine = {
          title: stateDefMatch[1],
          kind: 'StateDefinition',
          doc_comment: docComment || undefined,
          nested_elements: []
        }
        inStateMachine = true
        startDepth = braceDepth
        docComment = ''
        continue
      }
      
      // Extract nested states within state machine (relative to start depth)
      if (inStateMachine && currentStateMachine && braceDepth > startDepth) {
        const stateMatch = line.match(/state\s+(\w+)/i)
        if (stateMatch && !line.includes('def')) {
          currentStateMachine.nested_elements.push({
            title: stateMatch[1],
            kind: 'State',
            doc_comment: undefined
          })
        }
      }
      
      // End of state machine (back to start depth)
      if (inStateMachine && braceDepth === startDepth && line.includes('}')) {
        if (currentStateMachine) {
          stateMachines.push(currentStateMachine)
          currentStateMachine = null
        }
        inStateMachine = false
      }
    }
    
    if (currentStateMachine) {
      stateMachines.push(currentStateMachine)
    }
    
    return stateMachines
  }

  // Get state machines from WASM backend, with HIR fallback, then code parsing fallback
  const stateMachines = useMemo(() => {
    if (simulation && simulation.stateMachines && simulation.stateMachines.length > 0) {
      console.log('✅ [SimulationView] Using WASM-extracted state machines:', simulation.stateMachines.length)
      return simulation.stateMachines
    }
    
    // HIR fallback: extract state machines from HIR nodes
    if (hirData && hirData.nodes) {
      console.log('🔍 [SimulationView] WASM extraction returned empty, using HIR fallback for state machines')
      console.log('🔍 [SimulationView] HIR nodes:', Object.keys(hirData.nodes).length, 'total nodes')
      const stateList = []
      Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
        const kindStr = String(node.kind || '')
        // Check for various state machine related node kinds
        if (kindStr.includes('StateDefinition') || 
            kindStr.includes('StateMachineDefinition') ||
            (kindStr.includes('State') && kindStr.includes('Definition'))) {
          // Get nested states (children that are also states)
          const nestedStates = node.children ? node.children.map(childId => {
            const child = hirData.nodes[childId]
            if (child) {
              const childKind = String(child.kind || '')
              // Include states, transitions, and other state machine elements
              if (childKind.includes('State') || childKind.includes('Transition')) {
                return {
                  title: child.name || 'Unnamed State',
                  kind: childKind,
                  doc_comment: child.doc_comment
                }
              }
            }
            return null
          }).filter(Boolean) : []
          
          stateList.push({
            title: node.name || 'Unnamed State Machine',
            kind: kindStr,
            doc_comment: node.doc_comment,
            stable_id: node.stable_id,
            nested_elements: nestedStates
          })
        }
      })
      if (stateList.length > 0) {
        console.log(`🔍 [SimulationView] HIR fallback extracted ${stateList.length} state machines:`, stateList.map(s => s.title))
        return stateList
      }
    }
    
    // Code parsing fallback
    if (code) {
      console.log('🔍 [SimulationView] HIR fallback returned empty, using code parsing fallback for state machines')
      const parsed = parseStateMachinesFromCode(code)
      if (parsed.length > 0) {
        console.log(`🔍 [SimulationView] Code parsing extracted ${parsed.length} state machines:`, parsed.map(s => s.title))
        return parsed
      }
    }
    
    return []
  }, [simulation, hirData, code])

  // Parse code directly to extract actions (fallback when WASM/HIR don't work)
  const parseActionsFromCode = (code) => {
    const actions = []
    const lines = code.split('\n')
    let currentAction = null
    let braceDepth = 0
    let startDepth = 0
    let inAction = false
    let docComment = ''
    let inDocComment = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Track doc comments
      if (line.startsWith('doc /*')) {
        inDocComment = true
        docComment = line.replace('doc /*', '').replace('*/', '').trim()
      } else if (inDocComment && line.includes('*/')) {
        docComment += ' ' + line.replace('*/', '').trim()
        inDocComment = false
      } else if (inDocComment) {
        docComment += ' ' + line.replace(/^\*+\s*/, '').trim()
        continue
      }
      
      // Track brace depth (global)
      braceDepth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length
      
      // Detect action def
      const actionDefMatch = line.match(/action\s+def\s+(\w+)/i)
      if (actionDefMatch) {
        if (currentAction) {
          actions.push(currentAction)
        }
        currentAction = {
          title: actionDefMatch[1],
          kind: 'ActionDefinition',
          doc_comment: docComment || undefined,
          nested_elements: []
        }
        inAction = true
        startDepth = braceDepth
        docComment = ''
        continue
      }
      
      // Extract nested action steps within action (relative to start depth)
      if (inAction && currentAction && braceDepth > startDepth) {
        const actionStepMatch = line.match(/action\s+(\w+)/i)
        if (actionStepMatch && !line.includes('def')) {
          currentAction.nested_elements.push({
            title: actionStepMatch[1],
            kind: 'ActionStep',
            doc_comment: undefined
          })
        }
        // Also capture "then" statements as steps
        const thenMatch = line.match(/then\s+(\w+)/i)
        if (thenMatch) {
          currentAction.nested_elements.push({
            title: thenMatch[1],
            kind: 'ActionStep',
            doc_comment: undefined
          })
        }
      }
      
      // End of action (back to start depth)
      if (inAction && braceDepth === startDepth && line.includes('}')) {
        if (currentAction) {
          actions.push(currentAction)
          currentAction = null
        }
        inAction = false
      }
    }
    
    if (currentAction) {
      actions.push(currentAction)
    }
    
    return actions
  }

  // Get actions from WASM backend, with HIR fallback, then code parsing fallback
  const actions = useMemo(() => {
    if (simulation && simulation.actions && simulation.actions.length > 0) {
      console.log('✅ [SimulationView] Using WASM-extracted actions:', simulation.actions.length)
      return simulation.actions
    }
    
    // HIR fallback: extract actions from HIR nodes
    if (hirData && hirData.nodes) {
      console.log('🔍 [SimulationView] WASM extraction returned empty, using HIR fallback for actions')
      const actionList = []
      Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
        const kindStr = String(node.kind || '')
        // Check for various action related node kinds
        if (kindStr.includes('ActionDefinition') || 
            (kindStr.includes('Action') && kindStr.includes('Definition'))) {
          // Get nested action steps (children that are action usages or steps)
          const nestedSteps = node.children ? node.children.map(childId => {
            const child = hirData.nodes[childId]
            if (child) {
              const childKind = String(child.kind || '')
              // Include action usages, action steps, and other action elements
              if (childKind.includes('Action') || childKind.includes('Step') || childKind.includes('Usage')) {
                return {
                  title: child.name || 'Unnamed Step',
                  kind: childKind,
                  doc_comment: child.doc_comment
                }
              }
            }
            return null
          }).filter(Boolean) : []
          
          actionList.push({
            title: node.name || 'Unnamed Action',
            kind: kindStr,
            doc_comment: node.doc_comment,
            stable_id: node.stable_id,
            nested_elements: nestedSteps
          })
        }
      })
      if (actionList.length > 0) {
        console.log(`🔍 [SimulationView] HIR fallback extracted ${actionList.length} actions:`, actionList.map(a => a.title))
        return actionList
      }
    }
    
    // Code parsing fallback
    if (code) {
      console.log('🔍 [SimulationView] HIR fallback returned empty, using code parsing fallback for actions')
      const parsed = parseActionsFromCode(code)
      if (parsed.length > 0) {
        console.log(`🔍 [SimulationView] Code parsing extracted ${parsed.length} actions:`, parsed.map(a => a.title))
        return parsed
      }
    }
    
    return []
  }, [simulation, hirData, code])

  // Parse code directly to extract calculations (fallback when WASM/HIR don't work)
  const parseCalculationsFromCode = (code) => {
    const calculations = []
    const lines = code.split('\n')
    let currentCalc = null
    let braceDepth = 0
    let startDepth = 0
    let inCalc = false
    let docComment = ''
    let inDocComment = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Track doc comments
      if (line.startsWith('doc /*')) {
        inDocComment = true
        docComment = line.replace('doc /*', '').replace('*/', '').trim()
      } else if (inDocComment && line.includes('*/')) {
        docComment += ' ' + line.replace('*/', '').trim()
        inDocComment = false
      } else if (inDocComment) {
        docComment += ' ' + line.replace(/^\*+\s*/, '').trim()
        continue
      }
      
      // Track brace depth (global)
      braceDepth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length
      
      // Detect calc def
      const calcDefMatch = line.match(/calc\s+def\s+(\w+)/i)
      if (calcDefMatch) {
        if (currentCalc) {
          calculations.push(currentCalc)
        }
        currentCalc = {
          title: calcDefMatch[1],
          kind: 'CalcDefinition',
          doc_comment: docComment || undefined,
          parameters: [],
          returnType: null,
          returnName: null
        }
        inCalc = true
        startDepth = braceDepth
        docComment = ''
        continue
      }
      
      // Extract parameters and return type within calculation (relative to start depth)
      if (inCalc && currentCalc && braceDepth > startDepth) {
        // Match input parameters: "in parameterName : Type"
        const inParamMatch = line.match(/in\s+(\w+)\s*:\s*(\w+)/i)
        if (inParamMatch) {
          currentCalc.parameters.push({
            name: inParamMatch[1],
            type: inParamMatch[2],
            direction: 'in'
          })
        }
        
        // Match return statement: "return returnName : Type = ..."
        const returnMatch = line.match(/return\s+(\w+)\s*:\s*(\w+)/i)
        if (returnMatch) {
          currentCalc.returnName = returnMatch[1]
          currentCalc.returnType = returnMatch[2]
        }
      }
      
      // End of calculation (back to start depth)
      if (inCalc && braceDepth === startDepth && line.includes('}')) {
        if (currentCalc) {
          calculations.push(currentCalc)
          currentCalc = null
        }
        inCalc = false
      }
    }
    
    if (currentCalc) {
      calculations.push(currentCalc)
    }
    
    return calculations
  }

  // Get calculations from WASM backend, with HIR fallback, then code parsing fallback
  const calculations = useMemo(() => {
    if (simulation && simulation.calculations && simulation.calculations.length > 0) {
      console.log('✅ [SimulationView] Using WASM-extracted calculations:', simulation.calculations.length)
      return simulation.calculations
    }
    
    // HIR fallback: extract calculations from HIR nodes
    if (hirData && hirData.nodes) {
      console.log('🔍 [SimulationView] WASM extraction returned empty, using HIR fallback for calculations')
      const calcList = []
      Object.entries(hirData.nodes).forEach(([nodeId, node]) => {
        const kindStr = String(node.kind || '')
        // Check for various calculation related node kinds
        if (kindStr.includes('CalcDefinition') || 
            kindStr.includes('CalculationDefinition') ||
            (kindStr.includes('Calc') && kindStr.includes('Definition'))) {
          // Extract parameters from children (input/output parameters)
          const parameters = []
          if (node.children) {
            node.children.forEach(childId => {
              const child = hirData.nodes[childId]
              if (child) {
                const childKind = String(child.kind || '')
                // Look for parameter-like nodes (AttributeUsage, etc.)
                if (childKind.includes('Attribute') || childKind.includes('Parameter') || childKind.includes('Usage')) {
                  parameters.push({
                    name: child.name || 'unnamed',
                    type: child.type || 'Unknown',
                    direction: childKind.includes('in') ? 'in' : childKind.includes('out') ? 'out' : 'inout'
                  })
                }
              }
            })
          }
          
          // Extract return type from node properties or children
          let returnType = null
          let returnName = null
          if (node.children) {
            node.children.forEach(childId => {
              const child = hirData.nodes[childId]
              if (child && String(child.kind || '').includes('return')) {
                returnType = child.type || null
                returnName = child.name || null
              }
            })
          }
          
          calcList.push({
            title: node.name || 'Unnamed Calculation',
            kind: kindStr,
            doc_comment: node.doc_comment,
            stable_id: node.stable_id,
            parameters: parameters.length > 0 ? parameters : undefined,
            returnType: returnType,
            returnName: returnName
          })
        }
      })
      if (calcList.length > 0) {
        console.log(`🔍 [SimulationView] HIR fallback extracted ${calcList.length} calculations:`, calcList.map(c => c.title))
        return calcList
      }
    }
    
    // Code parsing fallback
    if (code) {
      console.log('🔍 [SimulationView] HIR fallback returned empty, using code parsing fallback for calculations')
      const parsed = parseCalculationsFromCode(code)
      if (parsed.length > 0) {
        console.log(`🔍 [SimulationView] Code parsing extracted ${parsed.length} calculations:`, parsed.map(c => c.title))
        return parsed
      }
    }
    
    return []
  }, [simulation, hirData, code])

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

            {/* Charging Charts */}
            <ChargingCharts history={simulationHistory} />

            {/* Message Sequence Chart */}
            <MessageSequenceChart isRunning={isSimulationRunning} />

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
                <div className="simulation-welcome-banner">
                  <div className="welcome-banner-icon">🎯</div>
                  <div className="welcome-banner-content">
                    <h4>Welcome to NexSim Interactive Demo!</h4>
                    <p>
                      <strong>Ready to explore?</strong> The simulation controls and physics gauges above 
                      demonstrate real-time visualization capabilities. Click "Start Simulation" to see the 
                      battery charging process in action, or modify the code in the editor to customize the simulation.
                    </p>
                    <div className="welcome-banner-tips">
                      <span className="tip-item">💡 Tip: Adjust simulation speed to see details</span>
                      <span className="tip-item">📊 View charts as data accumulates</span>
                      <span className="tip-item">🔄 Try restarting to see the full cycle</span>
                    </div>
                  </div>
                </div>
                <div className="simulation-empty" style={{ marginTop: '1rem' }}>
                  <div className="empty-state-content">
                    <div className="empty-state-icon">⚡</div>
                    <h4>No execution flow found</h4>
                    <p>Define state machines and actions in the editor to see simulation execution. 
                    The default example includes a complete battery charging simulation with state transitions.</p>
                  </div>
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
                      <span className="calculation-badge">{calc.kind || 'CALC'}</span>
                      <h4 className="calculation-title">{calc.title || calc.name}</h4>
                    </div>
                    {calc.doc_comment && (
                      <div className="calculation-doc">{calc.doc_comment}</div>
                    )}
                    {calc.signature && (
                      <div className="calculation-signature">
                        <strong>Signature:</strong> <code>{calc.signature}</code>
                      </div>
                    )}
                    {calc.parameters && Array.isArray(calc.parameters) && calc.parameters.length > 0 && (
                      <div className="calculation-parameters">
                        <strong>Parameters:</strong>
                        <ul className="parameter-list">
                          {calc.parameters.map((param, i) => (
                            <li key={i} className="parameter-item">
                              <code>{param.name}</code>
                              {param.type && <span className="parameter-type">: {param.type}</span>}
                              {param.direction && <span className="parameter-direction"> ({param.direction})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {calc.returnType && (
                      <div className="calculation-return">
                        <strong>Returns:</strong> <code>{calc.returnType}</code>
                        {calc.returnName && <span> as <code>{calc.returnName}</code></span>}
                      </div>
                    )}
                    {calc.complexity !== undefined && (
                      <div className="calculation-complexity">
                        <strong>Complexity:</strong> {calc.complexity}
                      </div>
                    )}
                    {calc.packageName && (
                      <div className="calculation-package">
                        <strong>Package:</strong> <code>{calc.packageName}</code>
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
