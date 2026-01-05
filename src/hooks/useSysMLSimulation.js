import { useMemo } from 'react'
import { useSysMLDocumentation } from './useSysMLWasm'

/**
 * Simulation Analysis Hook
 *
 * Analyzes SysML state machines, actions, and calculations to extract:
 * - State transition sequences
 * - Execution flows
 * - Timing estimates
 * - Event traces
 */
export function useSysMLSimulation(code, fileUri = 'editor://current') {
  const { documentation, loading } = useSysMLDocumentation(code, fileUri)

  const simulation = useMemo(() => {
    if (!documentation || !documentation.chapters) {
      return null
    }

    // Extract state machines with transitions
    const stateMachines = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('StateDefinition') || sub.kind.includes('StateDef'))) {
            const states = []
            const transitions = []

            if (sub.nested_elements) {
              sub.nested_elements.forEach((el, idx) => {
                if (el.kind && el.kind.toLowerCase().includes('state')) {
                  states.push({
                    id: idx,
                    name: el.title,
                    type: el.kind,
                    doc: el.doc_comment
                  })
                }
              })

              // Infer transitions between sequential states
              for (let i = 0; i < states.length - 1; i++) {
                transitions.push({
                  from: states[i].id,
                  to: states[i + 1].id,
                  event: `transition_${i + 1}`,
                  fromName: states[i].name,
                  toName: states[i + 1].name
                })
              }
            }

            if (states.length > 0) {
              stateMachines.push({
                name: sub.title,
                states,
                transitions,
                doc: sub.doc_comment,
                packageName: chapter.title
              })
            }
          }
        })
      }
    })

    // Extract actions with execution sequences
    const actions = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('ActionDefinition') || sub.kind.includes('ActionDef'))) {
            const steps = []
            if (sub.nested_elements) {
              sub.nested_elements.forEach((el, idx) => {
                steps.push({
                  id: idx,
                  name: el.title,
                  type: el.kind,
                  doc: el.doc_comment
                })
              })
            }

            actions.push({
              name: sub.title,
              steps,
              doc: sub.doc_comment,
              packageName: chapter.title,
              estimatedDuration: steps.length * 100 // Simple estimate: 100ms per step
            })
          }
        })
      }
    })

    // Extract calculations with dependencies
    const calculations = []
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          if (sub.kind && (sub.kind.includes('CalcDefinition') || sub.kind.includes('CalculationDef'))) {
            // Extract inputs/outputs from signature
            const inputs = []
            const outputs = []

            if (sub.signature) {
              // Simple parsing: look for parameter patterns
              const inMatch = sub.signature.match(/in\s+(\w+)/g)
              const outMatch = sub.signature.match(/out\s+(\w+)/g)

              if (inMatch) {
                inMatch.forEach(m => inputs.push(m.replace('in ', '')))
              }
              if (outMatch) {
                outMatch.forEach(m => outputs.push(m.replace('out ', '')))
              }
            }

            calculations.push({
              name: sub.title,
              inputs,
              outputs,
              signature: sub.signature,
              doc: sub.doc_comment,
              packageName: chapter.title,
              complexity: inputs.length + outputs.length // Simple complexity metric
            })
          }
        })
      }
    })

    // Generate execution timeline
    const timeline = []
    let time = 0

    // Add state machine transitions
    stateMachines.forEach(sm => {
      sm.transitions.forEach(trans => {
        timeline.push({
          time,
          type: 'transition',
          from: trans.fromName,
          to: trans.toName,
          event: trans.event,
          machine: sm.name
        })
        time += 50 // 50ms per transition
      })
    })

    // Add action executions
    actions.forEach(action => {
      timeline.push({
        time,
        type: 'action_start',
        action: action.name,
        duration: action.estimatedDuration
      })
      time += action.estimatedDuration
    })

    // Add calculation executions
    calculations.forEach(calc => {
      timeline.push({
        time,
        type: 'calculation',
        calculation: calc.name,
        inputs: calc.inputs,
        outputs: calc.outputs
      })
      time += 10 // 10ms per calculation
    })

    // Sort timeline by time
    timeline.sort((a, b) => a.time - b.time)

    // Calculate execution statistics
    const stats = {
      totalStates: stateMachines.reduce((sum, sm) => sum + sm.states.length, 0),
      totalTransitions: stateMachines.reduce((sum, sm) => sum + sm.transitions.length, 0),
      totalActions: actions.length,
      totalCalculations: calculations.length,
      estimatedExecutionTime: time,
      averageActionDuration: actions.length > 0
        ? actions.reduce((sum, a) => sum + a.estimatedDuration, 0) / actions.length
        : 0,
      maxCalculationComplexity: calculations.length > 0
        ? Math.max(...calculations.map(c => c.complexity))
        : 0
    }

    return {
      stateMachines,
      actions,
      calculations,
      timeline,
      stats
    }
  }, [documentation])

  return { simulation, loading }
}
