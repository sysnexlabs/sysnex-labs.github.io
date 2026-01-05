import { useState, useEffect, useRef } from 'react'
import { safeWasmCall, formatWasmError } from '../utils/wasmErrorHandler'

/**
 * Hook to load and use SysML WASM module
 * Falls back to simple parser if WASM is not available
 */
export function useSysMLWasm() {
  const [wasm, setWasm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const loadWasm = async () => {
      try {
        // Try to load WASM module dynamically at runtime
        // Use a template literal to prevent Vite from statically analyzing the path
        // In production (GitHub Pages), the path will be relative to the base URL
        const baseUrl = import.meta.env.BASE_URL || './'
        // Fixed version for cache-busting - increment when WASM is updated
        // Version 5: CRITICAL FIX - Verify statement parser added (2026-01-05)
        const WASM_VERSION = '5'
        // CRITICAL: Use timestamp AND random component to break ALL caching
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 15)
        const cacheBuster = import.meta.env.DEV ? `${WASM_VERSION}-${timestamp}-${random}` : WASM_VERSION
        const wasmJsPath = import.meta.env.PROD
          ? `${baseUrl}wasm/sysml_wasm_bridge.js?v=${WASM_VERSION}`
          : `../wasm/sysml_wasm_bridge.js?v=${cacheBuster}&t=${timestamp}`
        const wasmBinaryPath = import.meta.env.PROD
          ? `${baseUrl}wasm/sysml_wasm_bridge_bg.wasm?v=${WASM_VERSION}`
          : undefined // Use default path in development
        
        // Try to load WASM module - catch import errors gracefully
        let wasmModule
        try {
          wasmModule = await import(/* @vite-ignore */ wasmJsPath)
        } catch (importErr) {
          // WASM file doesn't exist - this is expected in development
          console.info('WASM module not found, using fallback parser:', importErr.message)
          setError(importErr.message)
          setLoading(false)
          return // Exit early, continue with fallback parser
        }
        
        // Initialize WASM module
        // For GitHub Pages, we need to ensure the WASM file path is correct
        if (wasmModule.default) {
          // Pass the WASM file path explicitly for production
          if (wasmBinaryPath && import.meta.env.PROD) {
            await wasmModule.default({ module_or_path: wasmBinaryPath })
          } else {
            await wasmModule.default()
          }
        }
        
        // Initialize panic hook for better error reporting
        if (wasmModule.init_panic_hook) {
          wasmModule.init_panic_hook()
        }

        // Log successful WASM load with version info
        console.log(`🎉 [useSysMLWasm] WASM module loaded successfully! Version: ${WASM_VERSION}, CacheBuster: ${cacheBuster}`)
        console.log(`🎉 [useSysMLWasm] Verify statements are NOW supported!`)

        const SysMLWasm = wasmModule.SysMLWasm
        if (!SysMLWasm) {
          throw new Error('SysMLWasm class not found in WASM module')
        }
        
        // Try to create instance - will throw if placeholder
        const instance = new SysMLWasm()
        
        setWasm(instance)
        setLoading(false)
      } catch (err) {
        // Check if it's the placeholder error or a real error
        if (err.message && err.message.includes('WASM module not built yet')) {
          console.info('WASM module placeholder detected, using fallback parser')
        } else {
          console.warn('WASM module not available, using fallback parser:', err)
        }
        setError(err.message)
        setLoading(false)
        // Continue with fallback parser
      }
    }

    loadWasm()
  }, [])

  return { wasm, loading, error }
}

/**
 * Parse SysML code and return diagnostics
 */
export function useSysMLParser(code) {
  const { wasm } = useSysMLWasm()
  const [diagnostics, setDiagnostics] = useState([])

  useEffect(() => {
    if (!code) {
      setDiagnostics([])
      return
    }

    const parseCode = async () => {
      if (wasm) {
        try {
          console.log('🔍 Calling WASM parse with code length:', code.length)
          console.log('🔍 Code preview:', code.substring(0, 200))
          
          // Detect UVL code (starts with 'namespace' instead of 'package')
          const isUvlCode = code.trim().startsWith('namespace') || code.trim().startsWith('features')
          
          let diags
          if (isUvlCode && wasm.parse_uvl) {
            // Use UVL parser for UVL code
            console.log('🌳 Detected UVL code, using parse_uvl()')
            try {
              const uvlResult = wasm.parse_uvl(code)
              // UVL parser returns a different structure, convert to diagnostics format if needed
              // For now, return empty diagnostics for UVL (parsing succeeds if no error thrown)
              console.log('✅ UVL parsed successfully:', uvlResult)
              diags = []
            } catch (uvlErr) {
              // Convert UVL parse error to diagnostics format
              console.warn('⚠️ UVL parse error:', uvlErr)
              diags = [{
                line: 1,
                message: uvlErr.message || 'UVL parsing error',
                severity: 'error'
              }]
            }
          } else {
            // Use SysML parser for SysML code
            // Test with invalid syntax to see if parser finds errors
            const testInvalidCode = "package UnquotedPackage { part def Test { attribute name; } }"
            console.log('🧪 Testing with invalid code:', testInvalidCode)
            const testDiags = wasm.parse(testInvalidCode)
            console.log('🧪 Test diagnostics:', testDiags, 'length:', testDiags?.length)
            
            // Use WASM parser - parse is synchronous and returns Result directly
            // wasm-bindgen converts Result<T, E> to throw on Err, return value on Ok
            diags = wasm.parse(code)
          }
          
          console.log('📦 WASM parse returned:', diags, 'type:', typeof diags, 'isArray:', Array.isArray(diags))
          console.log('📦 Diagnostics details:', JSON.stringify(diags, null, 2))
          console.log('📦 Diagnostics length:', diags?.length, 'first item:', diags?.[0])
          
          // Ensure it's an array
          if (Array.isArray(diags)) {
            console.log('✅ Diagnostics received:', diags.length, 'items', diags)
            setDiagnostics(diags)
          } else {
            console.warn('⚠️ WASM parse returned non-array:', diags, typeof diags, diags?.constructor?.name)
            // Try to convert if it's a JsValue or similar
            if (diags && typeof diags === 'object') {
              try {
                const array = Array.from(diags)
                if (Array.isArray(array)) {
                  console.log('✅ Converted to array:', array)
                  setDiagnostics(array)
                  return
                }
              } catch (e) {
                console.warn('⚠️ Could not convert to array:', e)
              }
            }
            setDiagnostics([])
          }
        } catch (err) {
          // Result was an error (Err variant) - wasm-bindgen throws on Err
          console.error('❌ WASM parse error:', err)
          // Try to extract error message
          const errorMsg = err?.message || String(err)
          console.warn('⚠️ Parse failed, using fallback parser. Error:', errorMsg)
          // Fall through to fallback parser
          const errors = []
          const lines = code.split('\n')
          
          lines.forEach((line, index) => {
            if (line.includes('package') && !line.includes("'")) {
              errors.push({
                line: index + 1,
                message: "Package name must be quoted with single quotes",
                severity: 'error'
              })
            }
            
            if (line.includes('attribute') && !line.includes(':>')) {
              errors.push({
                line: index + 1,
                message: "Attribute must have a type (use ':> Type')",
                severity: 'error'
              })
            }
          })
          
          setDiagnostics(errors)
        }
      } else {
        // Fallback: simple regex-based validation
        const errors = []
        const lines = code.split('\n')
        
        lines.forEach((line, index) => {
          if (line.includes('package') && !line.includes("'")) {
            errors.push({
              line: index + 1,
              message: "Package name must be quoted with single quotes",
              severity: 'error'
            })
          }
          
          if (line.includes('attribute') && !line.includes(':>')) {
            errors.push({
              line: index + 1,
              message: "Attribute must have a type (use ':> Type')",
              severity: 'error'
            })
          }
        })
        
        setDiagnostics(errors)
      }
    }

    parseCode()
  }, [code, wasm])

  return diagnostics
}

// Cache for WASM results to avoid redundant calls
const documentationCache = new Map()
const analyticsCache = new Map()
const cstCache = new Map()
const hirCache = new Map()

// Cache key generator
function getCacheKey(code, fileUri) {
  return `${fileUri}:${code.length}:${code.substring(0, 100).replace(/\s/g, '')}`
}

/**
 * Generate documentation from SysML code
 * @param {string} code - The SysML code to generate documentation from
 * @param {string} fileUri - The file URI (default: 'editor://current')
 * @param {number} refreshKey - Optional refresh key to force regeneration (bypasses debounce when changed)
 */
export function useSysMLDocumentation(code, fileUri = 'editor://current', refreshKey = 0) {
  const { wasm } = useSysMLWasm()
  const [documentation, setDocumentation] = useState({ chapters: [], file_uri: fileUri })
  const [loading, setLoading] = useState(false)
  const prevRefreshKeyRef = useRef(refreshKey)
  const cacheKeyRef = useRef(null)

  useEffect(() => {
    if (!code || code.trim().length === 0) {
      setDocumentation({ chapters: [], file_uri: fileUri })
      return
    }

    const generateDoc = async () => {
      const cacheKey = getCacheKey(code, fileUri)
      
      // Check cache first (unless manual refresh)
      const isManualRefresh = prevRefreshKeyRef.current !== refreshKey
      if (!isManualRefresh && cacheKeyRef.current === cacheKey && documentationCache.has(cacheKey)) {
        console.log('📦 [useSysMLDocumentation] Using cached documentation')
        setDocumentation(documentationCache.get(cacheKey))
        setLoading(false)
        return
      }
      
      setLoading(true)
      console.log('🔄 [useSysMLDocumentation] Generating documentation, refreshKey:', refreshKey)
      
      if (wasm) {
        try {
          console.log('🔍 [JS] Calling WASM generate_documentation with code length:', code.length)
          const doc = await safeWasmCall(wasm.generate_documentation.bind(wasm), code, fileUri)
          console.log('🔍 [JS] WASM generate_documentation returned:', doc)
          // Always use WASM result, even if empty (empty might indicate parse errors, but structure is correct)
          if (doc && doc.chapters !== undefined) {
            console.log('✅ WASM documentation extracted:', doc.chapters.length, 'chapters')
            if (doc.chapters.length > 0) {
              console.log('📊 WASM chapters details:', doc.chapters.map(c => ({
                title: c.title,
                subchapters: c.subchapters?.length || 0,
                kinds: c.subchapters?.map(s => s.kind) || [],
                subchapterTitles: c.subchapters?.map(s => s.title) || [],
                hasRequirements: c.subchapters?.some(s => s.kind?.includes('Requirement')) || false
              })))
              
              // Debug: Log all subchapters in detail
              doc.chapters.forEach((chapter, idx) => {
                console.log(`📖 Chapter ${idx + 1} "${chapter.title}":`, {
                  subchapterCount: chapter.subchapters?.length || 0,
                  hasDocDeclarations: !!(chapter.doc_declarations && chapter.doc_declarations.length > 0),
                  docDeclarationsCount: chapter.doc_declarations?.length || 0,
                  hasCommentText: !!chapter.comment_text,
                  hasDocComment: !!chapter.doc_comment,
                  importsCount: chapter.imports?.length || 0,
                  imports: chapter.imports?.map(imp => ({
                    target_package: imp.target_package,
                    visibility: imp.visibility,
                    is_wildcard: imp.is_wildcard,
                    alias: imp.alias
                  })) || [],
                  subchapters: chapter.subchapters?.map((s, i) => ({
                    index: i + 1,
                    title: s.title,
                    kind: s.kind,
                    hasDocComment: !!s.doc_comment,
                    hasDocDeclarations: !!(s.doc_declarations && s.doc_declarations.length > 0),
                    docDeclarationsCount: s.doc_declarations?.length || 0,
                    hasCommentText: !!s.comment_text,
                    docPreview: s.doc_comment?.substring(0, 50) || (s.doc_declarations?.[0]?.[1]?.substring(0, 50)) || 'no doc'
                  })) || []
                })
              })
            } else {
              console.warn('⚠️ WASM returned 0 chapters - this might indicate:')
              console.warn('  1. No packages found in code')
              console.warn('  2. HIR generation failed silently')
              console.warn('  3. Code has syntax errors preventing HIR generation')
              console.warn('  Code preview:', code.substring(0, 200))
            }
            setDocumentation(doc)
            // Cache the result
            documentationCache.set(cacheKey, doc)
            cacheKeyRef.current = cacheKey
            // Limit cache size to prevent memory issues
            if (documentationCache.size > 10) {
              const firstKey = documentationCache.keys().next().value
              documentationCache.delete(firstKey)
            }
          } else {
            console.error('❌ WASM returned invalid documentation structure:', doc)
            setDocumentation({ chapters: [], file_uri: fileUri })
          }
        } catch (err) {
          // Only fallback on actual errors, not empty results
          console.error('❌ WASM documentation generation failed:', formatWasmError(err, { 
            code, 
            functionName: 'generate_documentation' 
          }))
          console.warn('Falling back to simple parser due to WASM error')
          const simpleDoc = parseSysMLToDocumentationSimple(code)
          setDocumentation(simpleDoc)
        }
      } else {
        // Fallback: simple parser when WASM not available
        console.info('ℹ️ WASM not available, using fallback parser')
        const simpleDoc = parseSysMLToDocumentationSimple(code)
        setDocumentation(simpleDoc)
      }
      
      setLoading(false)
    }

    // If refreshKey changed, bypass debounce and generate immediately
    const isManualRefresh = prevRefreshKeyRef.current !== refreshKey
    if (isManualRefresh) {
      console.log('🔄 [useSysMLDocumentation] Manual refresh detected, generating immediately')
      prevRefreshKeyRef.current = refreshKey
      generateDoc()
      // Return cleanup function (no-op since we're not using setTimeout)
      return () => {}
    }

    // Update ref for next comparison
    prevRefreshKeyRef.current = refreshKey

    // Debounce to avoid too many calls (optimized: 150ms for better responsiveness)
    const timeoutId = setTimeout(generateDoc, 150)
    return () => clearTimeout(timeoutId)
  }, [code, fileUri, wasm, refreshKey])

  return { documentation, loading }
}

// Simple fallback parser (existing implementation)
function parseSysMLToDocumentationSimple(code) {
  const chapters = []
  const lines = code.split('\n')
  
  let currentPackage = null
  let currentPart = null
  let inDocComment = false
  let docComment = ''
  
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    
    if (trimmed.startsWith("package '")) {
      const match = trimmed.match(/package '([^']+)'/)
      if (match) {
        if (currentPackage) {
          chapters.push(currentPackage)
        }
        currentPackage = {
          title: match[1],
          kind: '[Package]',
          doc_comment: docComment.trim() || undefined,
          doc_declarations: docComment ? [[null, docComment.trim()]] : undefined,
          imports: [],
          subchapters: [],
          metadata: {
            subchapter_count: 0,
            has_doc: !!docComment,
            import_count: 0,
          },
          range: { start: index, end: index },
          file_uri: 'editor://current',
          diagrams: [],
        }
        docComment = ''
        inDocComment = false
      }
    }
    
    if (trimmed.includes('doc /*')) {
      inDocComment = true
      docComment = ''
    } else if (inDocComment && trimmed.includes('*/')) {
      inDocComment = false
    } else if (inDocComment) {
      docComment += line.replace(/^\s*\*\s?/, '') + '\n'
    }
    
    if (trimmed.startsWith('part def ')) {
      const match = trimmed.match(/part def (\w+)/)
      if (match && currentPackage) {
        currentPart = {
          title: match[1],
          kind: '[PartDefinition]',
          doc_comment: docComment.trim() || undefined,
          doc_declarations: docComment ? [[null, docComment.trim()]] : undefined,
          stable_id: `def-${match[1].toLowerCase()}`,
          signature: trimmed,
          body: '',
          relationships: [],
          diagrams: [],
          nested_elements: [],
          metadata: {
            has_doc: !!docComment,
            nested_count: 0,
            relationship_count: 0,
          },
          range: { start: index, end: index },
          file_uri: 'editor://current',
        }
        docComment = ''
        inDocComment = false
      }
    }
    
    if (trimmed.startsWith('attribute ') && currentPart) {
      const match = trimmed.match(/attribute\s+(\w+)\s*:>\s*([^=\[]+)(\[[^\]]*\])?\s*=?\s*(.*)?/)
      if (match) {
        const attrName = match[1]
        const attrType = match[2].trim()
        const multiplicity = match[3] || ''
        const defaultValue = match[4]?.trim() || undefined
        
        currentPart.nested_elements.push({
          title: attrName,
          kind: '[AttributeUsage]',
          stable_id: `attr-${attrName.toLowerCase()}`,
          signature: trimmed,
          body: '',
          type_name: attrType,
          default_value: defaultValue,
          multiplicity: multiplicity,
          relationships: [],
          diagrams: [],
          nested_elements: [],
          metadata: {
            has_doc: false,
            nested_count: 0,
            relationship_count: 0,
          },
          range: { start: index, end: index },
          file_uri: 'editor://current',
        })
        currentPart.metadata.nested_count++
      }
    }
    
    if (trimmed.startsWith('part ') && currentPart && !trimmed.includes('def')) {
      const match = trimmed.match(/part\s+(\w+)\s*:\s*(\w+)(\[[^\]]*\])?/)
      if (match) {
        const partName = match[1]
        const partType = match[2]
        const multiplicity = match[3] || ''
        
        currentPart.nested_elements.push({
          title: partName,
          kind: '[PartUsage]',
          stable_id: `part-${partName.toLowerCase()}`,
          signature: trimmed,
          body: '',
          type_name: partType,
          multiplicity: multiplicity,
          relationships: [],
          diagrams: [],
          nested_elements: [],
          metadata: {
            has_doc: false,
            nested_count: 0,
            relationship_count: 0,
          },
          range: { start: index, end: index },
          file_uri: 'editor://current',
        })
        currentPart.metadata.nested_count++
      }
    }
    
    if (trimmed === '}' && currentPart && currentPackage) {
      currentPackage.subchapters.push(currentPart)
      currentPackage.metadata.subchapter_count++
      currentPart = null
    }
  })
  
  if (currentPackage) {
    chapters.push(currentPackage)
  }
  
  return {
    chapters,
    file_uri: 'editor://current',
  }
}
