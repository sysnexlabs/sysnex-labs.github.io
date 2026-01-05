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
        if (!wasm.extract_scenarios || !wasm.calculate_test_coverage) {
          // Silently fall back - don't set error, just use empty data
          // The UI will fall back to HIR extraction automatically
          console.info('Test management WASM methods not available. Using fallback HIR extraction.')
          setScenarios([])
          setCoverage(null)
          setLoading(false)
          return
        }

        // Extract scenarios (use cases) - doesn't need verification ID
        const scenariosData = await safeWasmCall(
          wasm.extract_scenarios.bind(wasm),
          code
        )
        setScenarios(scenariosData || [])

        // Calculate coverage
        const coverageData = await safeWasmCall(
          wasm.calculate_test_coverage.bind(wasm),
          code
        )
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

        const data = await safeWasmCall(
          wasm.extract_assertions.bind(wasm),
          code,
          verificationId
        )
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

        const data = await safeWasmCall(
          wasm.extract_succession_flows.bind(wasm),
          code,
          verificationId
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

