import { useState, useEffect, useRef } from 'react'
import { useSysMLWasm } from './useSysMLWasm'
import { safeWasmCall } from '../utils/wasmErrorHandler'

/**
 * Hook to extract requirements traceability matrix using WASM
 *
 * Uses the proper backend traceability API (sysml-ide-requirements)
 * instead of reconstructing relationships from documentation.
 *
 * @param {string} code - SysML v2 source code
 * @param {string} fileUri - File URI for stable ID generation
 * @returns {{ traceability, loading, error }}
 */
export function useSysMLTraceability(code, fileUri = 'editor://current') {
  const { wasm, loading: wasmLoading } = useSysMLWasm()
  const [traceability, setTraceability] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const prevCodeRef = useRef(null)

  useEffect(() => {
    // Skip if WASM not ready or code hasn't changed
    if (wasmLoading || !code || code === prevCodeRef.current) {
      if (!wasmLoading && !code) {
        setLoading(false)
      }
      return
    }

    prevCodeRef.current = code

    const extractTraceability = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!wasm) {
          // WASM not available - return empty traceability
          setTraceability({
            rows: [],
            hierarchy: [],
            stats: {
              total_requirements: 0,
              satisfied_count: 0,
              partially_satisfied_count: 0,
              not_satisfied_count: 0,
              coverage_percentage: 0,
            },
            levels: [],
          })
          setLoading(false)
          return
        }

        // Call WASM extract_traceability function
        // safeWasmCall returns the WASM result directly, not wrapped in { success, data }
        const result = await safeWasmCall(
          () => wasm.extract_traceability(code, fileUri),
          'extract_traceability'
        )

        // result IS the traceability object directly from WASM
        console.log('🎯 [useSysMLTraceability] Successfully extracted traceability:', result)
        console.log('🎯 [useSysMLTraceability] Rows:', result.rows)
        console.log('🎯 [useSysMLTraceability] Number of rows:', result.rows?.length || 0)
        if (result.rows && result.rows.length > 0) {
          console.log('🎯 [useSysMLTraceability] First row:', result.rows[0])
        }
        setTraceability(result)
        setLoading(false)
      } catch (err) {
        console.error('Error in traceability extraction:', err)
        setError(err.message)
        setTraceability({
          rows: [],
          hierarchy: [],
          stats: {
            total_requirements: 0,
            satisfied_count: 0,
            partially_satisfied_count: 0,
            not_satisfied_count: 0,
            coverage_percentage: 0,
          },
          levels: [],
        })
        setLoading(false)
      }
    }

    extractTraceability()
  }, [code, fileUri, wasm, wasmLoading])

  return { traceability, loading, error }
}
