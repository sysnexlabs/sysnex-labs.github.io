import { useState, useEffect } from 'react'
import { useSysMLWasm } from './useSysMLWasm'
import { safeWasmCall } from '../utils/wasmErrorHandler'

/**
 * Trade Study Analysis Hook (WASM-powered)
 *
 * Calls WASM backend for complete trade study analysis:
 * - Extracts variants with attributes
 * - Normalizes attribute values
 * - Scores variants
 * - Generates comparisons
 * - Provides recommendations
 */
export function useSysMLTradeStudy(code, fileUri = 'editor://current') {
  const { wasm } = useSysMLWasm()
  const [tradeStudy, setTradeStudy] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!code || code.trim().length === 0) {
      setTradeStudy(null)
      setLoading(false)
      return
    }

    const generateTradeStudy = async () => {
      setLoading(true)
      console.log('📊 [useSysMLTradeStudy] Calling WASM backend for trade study analysis')

      if (wasm) {
        try {
          const rawResult = wasm.generate_trade_study(code, fileUri)

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

          console.log('✅ [useSysMLTradeStudy] Received trade study from WASM:', {
            variants: result.variants?.length || 0,
            scores: result.scores?.length || 0,
            comparisons: result.comparisons?.length || 0,
            attributeNames: result.attributeNames?.length || 0,
            objectives: result.objectives?.length || 0,
            analysisDefs: result.analysisDefs?.length || 0
          })

          // Log detailed variant info
          if (result.variants && result.variants.length > 0) {
            console.log('📊 [useSysMLTradeStudy] Variants extracted:')
            result.variants.forEach((v, i) => {
              console.log(`  Variant ${i + 1}: ${v.title}, baseType: ${v.baseType}, attributes:`, v.attributes?.length || 0)
            })
          }

          setTradeStudy(result)
          setLoading(false)
        } catch (error) {
          console.error('❌ [useSysMLTradeStudy] WASM error:', error)
          setTradeStudy({
            variants: [],
            scores: [],
            comparisons: [],
            attributeNames: [],
            objectives: [],
            analysisDefs: [],
            recommendation: null
          })
          setLoading(false)
        }
      } else {
        console.warn('⚠️ [useSysMLTradeStudy] WASM module not available')
        setTradeStudy({
          variants: [],
          scores: [],
          comparisons: [],
          attributeNames: [],
          objectives: [],
          analysisDefs: [],
          recommendation: null
        })
        setLoading(false)
      }
    }

    generateTradeStudy()
  }, [code, fileUri, wasm])

  return { tradeStudy, loading }
}
