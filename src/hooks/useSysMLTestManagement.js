import { useState, useEffect, useRef } from 'react'
import { useSysMLWasm } from './useSysMLWasm'
import { safeWasmCall } from '../utils/wasmErrorHandler'

// Cache for test management results
const testCache = new Map()

function getCacheKey(code, operation) {
  return `${operation}:${code.length}:${code.substring(0, 100).replace(/\s/g, '')}`
}

/**
 * Hook for test management features using WASM backend
 * Provides assertion extraction, succession flows, scenarios, and coverage
 */
export function useSysMLTestManagement(code, fileUri = 'editor://current') {
  const { wasm } = useSysMLWasm()
  const [assertions, setAssertions] = useState([])
  const [successionFlows, setSuccessionFlows] = useState({})
  const [scenarios, setScenarios] = useState([])
  const [coverage, setCoverage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || code.trim().length === 0) {
      setAssertions([])
      setSuccessionFlows({})
      setScenarios([])
      setCoverage(null)
      return
    }

    const extractTestData = async () => {
      setLoading(true)
      setError(null)

      if (!wasm) {
        setError('WASM module is not available')
        setLoading(false)
        return
      }

      try {
        // Check if WASM methods are available (they may not be in older WASM builds)
        // Debug: Log available methods
        const availableMethods = wasm ? Object.getOwnPropertyNames(Object.getPrototypeOf(wasm)).filter(m => !m.startsWith('_') && m !== 'constructor' && m !== 'free') : []
        console.log('🔍 [useSysMLTestManagement] Available WASM methods:', availableMethods)
        console.log('🔍 [useSysMLTestManagement] Checking methods:', {
          hasExtractScenarios: typeof wasm?.extract_scenarios === 'function',
          hasCalculateTestCoverage: typeof wasm?.calculate_test_coverage === 'function',
          hasExtractAssertions: typeof wasm?.extract_assertions === 'function',
          hasExtractSuccessionFlows: typeof wasm?.extract_succession_flows === 'function',
        })
        
        if (!wasm || !wasm.extract_scenarios || !wasm.calculate_test_coverage) {
          // Silently fall back - don't set error, just use empty data
          // The UI will fall back to HIR extraction automatically
          console.info('Test management WASM methods not available. Using fallback HIR extraction.')
          setScenarios([])
          setCoverage(null)
          setLoading(false)
          return
        }

        // Extract scenarios (use cases) - doesn't need verification ID
        console.log('🔄 [useSysMLTestManagement] Calling extract_scenarios...')
        const scenariosData = await safeWasmCall(
          wasm.extract_scenarios.bind(wasm),
          code
        )
        console.log('✅ [useSysMLTestManagement] extract_scenarios result:', scenariosData)
        setScenarios(scenariosData || [])

        // Calculate coverage
        console.log('🔄 [useSysMLTestManagement] Calling calculate_test_coverage...')
        const coverageData = await safeWasmCall(
          wasm.calculate_test_coverage.bind(wasm),
          code
        )
        console.log('✅ [useSysMLTestManagement] calculate_test_coverage result:', coverageData)
        setCoverage(coverageData)

        // Extract assertions and succession flows for each verification
        // Note: These require verification IDs which we get from HIR
        // The hooks useAssertions and useSuccessionFlows handle this per-verification
        // For now, we just extract scenarios and coverage which don't need IDs
        
        setAssertions([]) // Populated via useAssertions hook when verification selected
        setSuccessionFlows({}) // Populated via useSuccessionFlows hook when verification selected

      } catch (err) {
        console.error('Test management extraction error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Debounce: 300ms for test extraction
    const timeoutId = setTimeout(extractTestData, 300)
    return () => clearTimeout(timeoutId)
  }, [code, fileUri, wasm])

  return {
    assertions,
    successionFlows,
    scenarios,
    coverage,
    loading,
    error,
  }
}

/**
 * Extract assertions for a specific verification case
 */
export function useAssertions(code, verificationId) {
  const { wasm } = useSysMLWasm()
  const [assertions, setAssertions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || !verificationId || !wasm) {
      setAssertions([])
      return
    }

    const extract = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check if WASM method is available
        if (!wasm.extract_assertions) {
          console.info('extract_assertions WASM method not available. Using fallback.')
          setAssertions([])
          setLoading(false)
          return
        }

        // Try the provided verification ID first, then try common IDs like validation page
        let data = null
        let foundId = verificationId
        const tryIds = [verificationId, ...Array.from({length: 10}, (_, i) => i + 1)].filter((id, idx, arr) => arr.indexOf(id) === idx)
        
        for (const testId of tryIds) {
          try {
            const testIdBigInt = BigInt(testId)
            const result = await safeWasmCall(
              wasm.extract_assertions.bind(wasm),
              code,
              testIdBigInt
            )
            if (Array.isArray(result) && result.length > 0) {
              data = result
              foundId = testId
              console.log(`✅ [useAssertions] Found ${result.length} assertions with verification ID ${testId}`)
              break
            }
          } catch (err) {
            // Continue trying other IDs
            if (testId === verificationId) {
              console.warn(`⚠️ [useAssertions] Verification ID ${testId} failed:`, err.message)
            }
          }
        }
        
        console.log('🔍 [useAssertions] Extracted assertions:', data)
        console.log('🔍 [useAssertions] Verification ID used:', foundId, 'BigInt:', BigInt(foundId).toString())
        console.log('🔍 [useAssertions] Assertions count:', Array.isArray(data) ? data.length : 'not an array')
        if (Array.isArray(data) && data.length > 0) {
          console.log('🔍 [useAssertions] First assertion:', data[0])
          data.forEach((a, idx) => {
            console.log(`  Assertion ${idx + 1}:`, {
              name: a.name,
              constraintExpression: a.constraintExpression,
              constraint_expression: a.constraint_expression, // Check both
              hasExpression: !!(a.constraintExpression || a.constraint_expression),
              assertionId: a.assertionId,
              keys: Object.keys(a)
            })
          })
        } else if (Array.isArray(data) && data.length === 0) {
          console.warn('⚠️ [useAssertions] extract_assertions returned empty array for all verification IDs')
          console.warn('⚠️ [useAssertions] This means WASM extraction found no assertions - will use HIR fallback')
        } else {
          console.warn('⚠️ [useAssertions] extract_assertions returned non-array:', typeof data, data)
        }
        setAssertions(data || [])
      } catch (err) {
        console.error('Assertion extraction error:', err)
        setError(err.message)
        setAssertions([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(extract, 200)
    return () => clearTimeout(timeoutId)
  }, [code, verificationId, wasm])

  return { assertions, loading, error }
}

/**
 * Extract succession flows for a specific verification case
 */
export function useSuccessionFlows(code, verificationId) {
  const { wasm } = useSysMLWasm()
  const [actionSequence, setActionSequence] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || !verificationId || !wasm) {
      setActionSequence(null)
      return
    }

    const extract = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check if WASM method is available
        if (!wasm.extract_succession_flows) {
          console.info('extract_succession_flows WASM method not available. Using fallback.')
          setActionSequence(null)
          setLoading(false)
          return
        }

        // Convert verificationId to BigInt (WASM expects u64)
        const verificationIdBigInt = BigInt(verificationId)
        const data = await safeWasmCall(
          wasm.extract_succession_flows.bind(wasm),
          code,
          verificationIdBigInt
        )
        setActionSequence(data)
      } catch (err) {
        console.error('Succession flow extraction error:', err)
        setError(err.message)
        setActionSequence(null)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(extract, 200)
    return () => clearTimeout(timeoutId)
  }, [code, verificationId, wasm])

  return { actionSequence, loading, error }
}

/**
 * Hook to evaluate a single assertion with context variables
 */
export function useAssertionEvaluation(code, assertionId, context = null) {
  const { wasm } = useSysMLWasm()
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || !assertionId || !wasm || !context) {
      setEvaluationResult(null)
      return
    }

    const evaluate = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!wasm.evaluate_assertion) {
          setEvaluationResult(null)
          setLoading(false)
          return
        }

        // Convert assertionId to BigInt (WASM expects u64)
        const assertionIdBigInt = BigInt(assertionId)
        // Convert context to JSON string
        const contextJson = JSON.stringify(context)
        
        const result = await safeWasmCall(
          wasm.evaluate_assertion.bind(wasm),
          code,
          assertionIdBigInt,
          contextJson
        )
        console.log('🔍 [useAssertionEvaluation] Evaluation result:', result)
        setEvaluationResult(result)
      } catch (err) {
        console.error('Assertion evaluation error:', err)
        setError(err.message)
        setEvaluationResult(null)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(evaluate, 200)
    return () => clearTimeout(timeoutId)
  }, [code, assertionId, context, wasm])

  return { evaluationResult, loading, error }
}

/**
 * Hook to evaluate multiple assertions with context
 */
export function useAssertionsEvaluation(code, assertions, contextProvider = null) {
  const { wasm } = useSysMLWasm()
  const [evaluationResults, setEvaluationResults] = useState(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || !assertions || assertions.length === 0 || !wasm) {
      setEvaluationResults(new Map())
      return
    }

    const evaluateAll = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!wasm.evaluate_assertion) {
          setEvaluationResults(new Map())
          setLoading(false)
          return
        }

        const results = new Map()
        
        // Evaluate each assertion that has a constraint expression
        for (const assertion of assertions) {
          if (!assertion.constraintExpression && !assertion.constraint_expression) {
            continue // Skip assertions without expressions
          }

          // Get context for this assertion
          const context = contextProvider 
            ? contextProvider(assertion)
            : createDefaultContext(assertion.constraintExpression || assertion.constraint_expression || '')

          if (!context || Object.keys(context).length === 0) {
            continue
          }

          // Extract assertion ID
          let assertionId = 0
          if (assertion.assertionId !== undefined && assertion.assertionId !== null) {
            if (typeof assertion.assertionId === 'number') {
              assertionId = assertion.assertionId
            } else if (Array.isArray(assertion.assertionId) && assertion.assertionId.length > 0) {
              assertionId = assertion.assertionId[0]
            } else if (typeof assertion.assertionId === 'object') {
              if (assertion.assertionId[0] !== undefined) {
                assertionId = assertion.assertionId[0]
              } else if (assertion.assertionId.value !== undefined) {
                assertionId = assertion.assertionId.value
              }
            }
          }

          if (assertionId === 0) {
            continue
          }

          try {
            const assertionIdBigInt = BigInt(assertionId)
            const contextJson = JSON.stringify(context)
            
            const result = await safeWasmCall(
              wasm.evaluate_assertion.bind(wasm),
              code,
              assertionIdBigInt,
              contextJson
            )
            
            results.set(assertionId, result)
          } catch (err) {
            console.warn(`Failed to evaluate assertion ${assertionId}:`, err)
            // Continue with other assertions
          }
        }

        console.log('🔍 [useAssertionsEvaluation] Evaluated', results.size, 'assertions')
        setEvaluationResults(results)
      } catch (err) {
        console.error('Assertions evaluation error:', err)
        setError(err.message)
        setEvaluationResults(new Map())
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(evaluateAll, 300)
    return () => clearTimeout(timeoutId)
  }, [code, assertions, wasm, contextProvider])

  return { evaluationResults, loading, error }
}

/**
 * Create default context for an assertion based on its constraint expression
 */
function createDefaultContext(expression) {
  if (!expression) return {}
  
  const context = {}
  
  // Extract variable names from expression and set reasonable default values
  if (expression.includes('testBMS.voltage')) {
    context['testBMS.voltage'] = 3.7 // Safe voltage below 4.2V limit
  }
  if (expression.includes('testBMS.current')) {
    context['testBMS.current'] = 0.0 // Zero current
  }
  if (expression.includes('testBMS.temperature')) {
    context['testBMS.temperature'] = 25.0 // Normal temperature below 60°C
  }
  if (expression.includes('testBMS.stateOfCharge')) {
    context['testBMS.stateOfCharge'] = 100.0 // Fully charged
  }
  
  // If no specific variables found, provide a default set
  if (Object.keys(context).length === 0) {
    context['testBMS.voltage'] = 3.7
    context['testBMS.current'] = 0.0
    context['testBMS.temperature'] = 25.0
    context['testBMS.stateOfCharge'] = 100.0
  }
  
  return context
}

