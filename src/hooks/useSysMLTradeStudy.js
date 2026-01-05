import { useMemo } from 'react'
import { useSysMLDocumentation } from './useSysMLWasm'

/**
 * Trade Study Analysis Hook
 *
 * Takes documentation data and performs trade study analysis:
 * - Extracts variants with attributes
 * - Normalizes attribute values
 * - Scores variants
 * - Generates comparisons
 */
export function useSysMLTradeStudy(code, fileUri = 'editor://current') {
  const { documentation, loading } = useSysMLDocumentation(code, fileUri)

  // Extract variants and perform trade study analysis
  const tradeStudy = useMemo(() => {
    if (!documentation || !documentation.chapters) {
      return null
    }

    console.log('📊 [useSysMLTradeStudy] Starting trade study analysis')
    console.log('📊 [useSysMLTradeStudy] Chapters:', documentation.chapters.length)

    // Extract variants (parts with specialization)
    const variants = []
    const baseTypes = new Set()

    // First pass: identify base types
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          // More flexible kind matching
          const kind = (sub.kind || '').toLowerCase()
          const isPart = kind.includes('part') && (kind.includes('def') || kind.includes('definition'))

          if (isPart) {
            // Check for specialization in both signature and kind
            const sigText = sub.signature || ''
            const kindText = sub.kind || ''

            if (sigText.includes(':>') || kindText.includes(':>')) {
              const text = sigText + ' ' + kindText
              const match = text.match(/:>\s*([A-Za-z_]\w*)/)
              if (match) {
                baseTypes.add(match[1])
              }
            }
          }
        })
      }
    })

    // Second pass: extract variants with attributes
    documentation.chapters.forEach(chapter => {
      if (chapter.subchapters) {
        chapter.subchapters.forEach(sub => {
          // More flexible kind matching
          const kind = (sub.kind || '').toLowerCase()
          const isPart = kind.includes('part') && (kind.includes('def') || kind.includes('definition'))

          if (isPart) {
            let baseType = null
            const sigText = sub.signature || ''
            const kindText = sub.kind || ''
            const text = sigText + ' ' + kindText

            if (sigText.includes(':>') || kindText.includes(':>')) {
              const match = text.match(/:>\s*([A-Za-z_]\w*)/)
              if (match) {
                baseType = match[1]
              }
            }

            // Extract attributes with numeric values
            const attributes = []
            if (sub.nested_elements) {
              sub.nested_elements.forEach(nested => {
                const nestedKind = (nested.kind || '').toLowerCase()
                const isAttribute = nestedKind.includes('attribute') || nestedKind.includes('value')

                if (isAttribute) {
                  const nestedSig = nested.signature || nested.title || ''
                  // Try multiple patterns for numeric values
                  // Pattern 1: :>> attrName = value (redefinition)
                  // Pattern 2: : Type = value (standard assignment)
                  // Pattern 3: = value (direct assignment)
                  // Pattern 4: value at end (fallback)
                  const valueMatch = nestedSig.match(/:>>\s*\w+\s*=\s*([\d.]+)/) ||
                                    nestedSig.match(/=\s*([\d.]+)/) ||
                                    nestedSig.match(/:\s*\w+\s*=\s*([\d.]+)/) ||
                                    nestedSig.match(/([\d.]+)\s*;?\s*(?:\/\/.*)?$/)

                  if (valueMatch) {
                    // Extract attribute name - handle various patterns
                    let attrName = nested.title || 'unnamed'

                    // If signature has :>> pattern, extract the redefined name
                    const redefMatch = nestedSig.match(/:>>\s*(\w+)/)
                    if (redefMatch) {
                      attrName = redefMatch[1]
                    }

                    attributes.push({
                      name: attrName,
                      value: parseFloat(valueMatch[1]),
                      signature: nestedSig
                    })
                  }
                }
              })
            }

            // Include parts that either have a base type OR have attributes
            // This makes it work even if specialization detection fails
            if ((baseType && baseTypes.has(baseType)) || attributes.length > 0) {
              variants.push({
                title: sub.title,           // Match documentation structure
                kind: sub.kind,             // Match documentation structure
                baseType: baseType || 'unknown',
                attributes,
                doc_comment: sub.doc_comment,  // Match documentation structure
                packageName: chapter.title,
                signature: sub.signature    // Include for reference
              })
            }
          }
        })
      }
    })

    // Debug logging
    console.log('🔍 [useSysMLTradeStudy] Extracted variants:', variants.length)
    variants.forEach((v, i) => {
      console.log(`  Variant ${i + 1}: ${v.title}, baseType: ${v.baseType}, attributes:`, v.attributes)
    })
    console.log('🔍 [useSysMLTradeStudy] Base types found:', Array.from(baseTypes))

    if (variants.length === 0) {
      console.warn('⚠️ [useSysMLTradeStudy] No variants extracted!')
      return { variants: [], scores: [], comparisons: [], attributeNames: [], recommendation: null }
    }

    // Normalize scores for each attribute
    const attributeNames = new Set()
    variants.forEach(v => v.attributes.forEach(a => attributeNames.add(a.name)))

    // Calculate min/max for each attribute
    const ranges = {}
    attributeNames.forEach(attrName => {
      const values = variants
        .map(v => v.attributes.find(a => a.name === attrName)?.value)
        .filter(v => v !== undefined)

      if (values.length > 0) {
        ranges[attrName] = {
          min: Math.min(...values),
          max: Math.max(...values)
        }
      }
    })

    // Score each variant
    const scores = variants.map(variant => {
      const attributeScores = {}
      let sum = 0
      let count = 0

      variant.attributes.forEach(attr => {
        const range = ranges[attr.name]
        if (range) {
          const span = range.max - range.min
          const normalized = span > 0 ? (attr.value - range.min) / span : 0.5
          attributeScores[attr.name] = normalized
          sum += normalized
          count++
        }
      })

      return {
        variantName: variant.name,
        attributeScores,
        overallScore: count > 0 ? sum / count : 0,
        rank: 0 // Will be filled after sorting
      }
    })

    // Sort by score and assign ranks
    scores.sort((a, b) => b.overallScore - a.overallScore)
    scores.forEach((score, i) => {
      score.rank = i + 1
    })

    // Generate comparisons for each attribute
    const comparisons = []
    attributeNames.forEach(attrName => {
      const values = variants
        .map(v => ({
          name: v.title,
          value: v.attributes.find(a => a.name === attrName)?.value
        }))
        .filter(v => v.value !== undefined)

      if (values.length >= 2) {
        values.sort((a, b) => b.value - a.value)
        const best = values[0]
        const worst = values[values.length - 1]

        comparisons.push({
          attributeName: attrName,
          bestVariant: best.name,
          worstVariant: worst.name,
          bestValue: best.value,
          worstValue: worst.value,
          range: best.value - worst.value,
          allValues: values
        })
      }
    })

    // Generate recommendation
    const recommendation = scores.length > 0
      ? `${scores[0].variantName} is recommended with an overall score of ${(scores[0].overallScore * 100).toFixed(0)}% across all attributes`
      : null

    return {
      variants,
      scores,
      comparisons,
      attributeNames: Array.from(attributeNames),
      recommendation
    }
  }, [documentation])

  return { tradeStudy, loading }
}
