import { useState, useEffect } from 'react'
import { useSysMLWasm } from './useSysMLWasm'

/**
 * Simulation Analysis Hook (WASM-powered)
 *
 * Calls WASM backend for complete simulation analysis:
 * - Extracts state machines with transitions
 * - Extracts actions with flow definitions
 * - Extracts calculations
 * - Simulates execution timeline
 * - Provides statistics
 */
export function useSysMLSimulation(code, fileUri = 'editor://current', maxSteps = 20) {
  const { wasm } = useSysMLWasm()
  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!code || code.trim().length === 0) {
      setSimulation(null)
      setLoading(false)
      return
    }

    const runSimulation = async () => {
      setLoading(true)
      console.log('🎮 [useSysMLSimulation] Calling WASM backend for simulation')

      if (wasm) {
        try {
          const rawResult = wasm.run_simulation(code, fileUri, maxSteps)

          // Recursively convert Maps to plain objects
          const convertMapToObject = (obj) => {
            if (obj instanceof Map) {
              return Object.fromEntries(
                Array.from(obj.entries()).map(([key, value]) => [key, convertMapToObject(value)])
              )
            } else if (Array.isArray(obj)) {
              return obj.map(item => convertMapToObject(item))
            } else if (obj && typeof obj === 'object') {
              return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, convertMapToObject(value)])
              )
            }
            return obj
          }

          const result = convertMapToObject(rawResult)

          console.log('✅ [useSysMLSimulation] Received simulation from WASM:', {
            stateMachines: result.stateMachines?.length || 0,
            actions: result.actions?.length || 0,
            calculations: result.calculations?.length || 0,
            timeline: result.timeline?.length || 0
          })

          setSimulation(result)
          setLoading(false)
        } catch (error) {
          console.error('❌ [useSysMLSimulation] WASM error:', error)
          setSimulation({
            stateMachines: [],
            actions: [],
            calculations: [],
            timeline: [],
            stats: {
              totalStates: 0,
              totalTransitions: 0,
              totalActions: 0,
              estimatedExecutionTime: 0,
              averageActionDuration: 0,
              maxCalculationComplexity: 0
            }
          })
          setLoading(false)
        }
      } else {
        console.warn('⚠️ [useSysMLSimulation] WASM module not available')
        setSimulation({
          stateMachines: [],
          actions: [],
          calculations: [],
          timeline: [],
          stats: {
            totalStates: 0,
            totalTransitions: 0,
            totalActions: 0,
            estimatedExecutionTime: 0,
            averageActionDuration: 0,
            maxCalculationComplexity: 0
          }
        })
        setLoading(false)
      }
    }

    runSimulation()
  }, [code, fileUri, maxSteps, wasm])

  return { simulation, loading }
}
