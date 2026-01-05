import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useSysMLParser, useSysMLWasm } from '../../hooks/useSysMLWasm'
import { useTheme } from '../../contexts/ThemeContext'
import './TryYourselfEditor.css'

// SysML v2 Beispiel-Code
export const DEFAULT_EXAMPLE = `package 'Vehicle System' {
    doc /*
     * A simple vehicle system example demonstrating
     * SysML v2 structural modeling.
     */

    private import ScalarValues::*;

    part def Vehicle {
        doc /*
         * Electric vehicle with powertrain components.
         * Demonstrates hierarchical part decomposition.
         */
        attribute speed :> Real;
        attribute mass : Real = 1000.0;

        part engine : Engine;
        part wheels : Wheel[4];
        part transmission : Transmission;
    }

    part def Engine {
        doc /* Electric motor propulsion system */
        attribute power : Real = 150.0;
        attribute voltage : Real = 400.0;
    }

    part def Wheel {
        doc /* Vehicle wheel assembly */
        attribute diameter : Real = 0.5;
    }

    part def Transmission {
        doc /* Power transmission system */
        attribute gearRatio : Real = 3.5;
    }
}`

const EXAMPLES = [
  {
    name: 'Hello World',
    code: `package 'Hello World' {
    doc /* A simple SysML v2 package */
    
    private import ScalarValues::*;
    
    part def Greeting {
        attribute message :> String = "Hello, SysML v2!";
    }
}`
  },
  {
    name: 'Vehicle System',
    code: DEFAULT_EXAMPLE
  },
  {
    name: 'Requirements',
    code: `package 'Requirements Example' {
    private import ScalarValues::*;

    requirement def VehicleSafetyReq {
        doc /*
         * The vehicle must meet all safety standards
         */
        subject vehicle : Vehicle;
    }

    requirement def PerformanceReq {
        doc /*
         * The vehicle must achieve 0-60 mph in under 6 seconds
         */
        subject vehicle : Vehicle;
        attribute targetTime : Real = 6.0;
    }

    part def Vehicle {
        attribute acceleration : Real;
    }

    // Requirement instances
    requirement safety : VehicleSafetyReq;
    requirement performance : PerformanceReq;
    part testVehicle : Vehicle;

    // Satisfaction
    satisfy safety by testVehicle;
    satisfy performance by testVehicle;
}`
  },
  {
    name: 'Interfaces',
    code: `package 'Interface Example' {
    interface def PowerInterface {
        end powerIn : PowerInterface;
        end powerOut : PowerInterface;
    }
    
    part def Battery {
        port output : PowerInterface;
    }
}`
  },
  {
    name: 'UVL Variability',
    code: `namespace Vehicle

features
    Vehicle
        mandatory
            Engine
                alternative
                    GasEngine
                    ElectricMotor
            Transmission
                alternative
                    Manual
                    Automatic
        optional
            AirConditioning
            Navigation

constraints
    ElectricMotor => Automatic
    GasEngine => !ElectricMotor`
  }
]

export default function TryYourselfEditor({ onCodeChange, defaultCode, defaultExample = 'Vehicle System', showExamples = false }) {
  const [code, setCode] = useState(defaultCode || DEFAULT_EXAMPLE)
  const [selectedExample, setSelectedExample] = useState(defaultExample)
  const [editorHeight, setEditorHeight] = useState(500)
  const editorRef = useRef(null)
  const containerRef = useRef(null)
  const { wasm } = useSysMLWasm()
  const { theme } = useTheme()
  
  // Use WASM parser (with fallback)
  const diagnostics = useSysMLParser(code)
  
  // Calculate and update editor height based on container
  useEffect(() => {
    const updateEditorHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        if (rect.height > 0) {
          setEditorHeight(rect.height)
        }
      }
    }
    
    // Initial calculation
    const timeoutId = setTimeout(updateEditorHeight, 100)
    
    // Update on resize
    window.addEventListener('resize', updateEditorHeight)
    
    // Use ResizeObserver for better performance
    let resizeObserver = null
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateEditorHeight)
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateEditorHeight)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])
  
  // Debug: Log diagnostics changes
  useEffect(() => {
    if (diagnostics.length > 0) {
      console.log('📊 Diagnostics updated:', diagnostics.length, 'items', diagnostics)
    }
  }, [diagnostics])
  
  // Initialize code from defaultCode prop if provided (only on mount or when defaultCode changes)
  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Notify parent of code changes (including initial code)
  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code)
    }
  }, [code, onCodeChange])

  const handleEditorChange = (value) => {
    setCode(value || '')
  }

  const handleExampleSelect = (exampleName) => {
    const example = EXAMPLES.find(ex => ex.name === exampleName)
    if (example) {
      setCode(example.code)
      setSelectedExample(exampleName)
      if (onCodeChange) {
        onCodeChange(example.code)
      }
    }
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Store monaco globally for marker access
    if (typeof window !== 'undefined') {
      window.monaco = monaco
    }
    
    // SysML v2 Syntax-Highlighting definieren
    monaco.languages.register({ id: 'sysml' })
    
    // Register language features if WASM is available
    if (wasm) {
      console.log('🚀 Registering WASM-powered IDE features')

      // Register hover provider with WASM backend
      monaco.languages.registerHoverProvider('sysml', {
        provideHover: async (model, position) => {
          try {
            const code = model.getValue()
            const line = position.lineNumber
            const character = position.column - 1 // Monaco uses 1-based columns

            const hoverResult = wasm.provide_hover(code, line, character)
            if (!hoverResult || !hoverResult.contents) {
              return null
            }

            return {
              contents: [{ value: hoverResult.contents }],
              range: hoverResult.range ? new monaco.Range(
                hoverResult.range.start_line,
                hoverResult.range.start_character,
                hoverResult.range.end_line,
                hoverResult.range.end_character
              ) : undefined
            }
          } catch (error) {
            console.warn('Hover provider error:', error)
            return null
          }
        }
      })

      // Register completion provider with WASM backend
      monaco.languages.registerCompletionItemProvider('sysml', {
        provideCompletionItems: async (model, position) => {
          try {
            const code = model.getValue()
            const line = position.lineNumber
            const character = position.column - 1 // Monaco uses 1-based columns

            const completionResult = wasm.provide_completion(code, line, character)
            if (!completionResult || !completionResult.items) {
              return { suggestions: [] }
            }

            // Map WASM completion items to Monaco format
            const suggestions = completionResult.items.map(item => ({
              label: item.label,
              kind: monaco.languages.CompletionItemKind[item.kind] || monaco.languages.CompletionItemKind.Text,
              detail: item.detail,
              documentation: item.documentation,
              insertText: item.insert_text || item.label,
              sortText: item.sort_text,
              filterText: item.filter_text,
              range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
              )
            }))

            return { suggestions }
          } catch (error) {
            console.warn('Completion provider error:', error)
            return { suggestions: [] }
          }
        }
      })

      // Register definition provider with WASM backend
      monaco.languages.registerDefinitionProvider('sysml', {
        provideDefinition: async (model, position) => {
          try {
            const code = model.getValue()
            const line = position.lineNumber
            const character = position.column - 1 // Monaco uses 1-based columns

            const definitionResult = wasm.provide_definition(code, line, character)
            if (!definitionResult || !definitionResult.file_uri) {
              return null
            }

            return {
              uri: model.uri, // Same file for now (WASM context)
              range: new monaco.Range(
                definitionResult.start_line,
                definitionResult.start_character,
                definitionResult.end_line,
                definitionResult.end_character
              )
            }
          } catch (error) {
            console.warn('Definition provider error:', error)
            return null
          }
        }
      })

      // Register references provider with WASM backend
      monaco.languages.registerReferenceProvider('sysml', {
        provideReferences: async (model, position, context) => {
          try {
            const code = model.getValue()
            const line = position.lineNumber
            const character = position.column - 1 // Monaco uses 1-based columns
            const includeDeclaration = context.includeDeclaration

            const referencesResult = wasm.provide_references(
              code,
              line,
              character,
              includeDeclaration
            )

            if (!referencesResult || referencesResult.length === 0) {
              return []
            }

            // Convert to Monaco location format
            return referencesResult.map(ref => ({
              uri: model.uri,
              range: new monaco.Range(
                ref.start_line,
                ref.start_character,
                ref.end_line,
                ref.end_character
              )
            }))
          } catch (error) {
            console.warn('References provider error:', error)
            return []
          }
        }
      })

      // Register document symbol provider with WASM backend
      monaco.languages.registerDocumentSymbolProvider('sysml', {
        provideDocumentSymbols: async (model) => {
          try {
            const code = model.getValue()
            const symbolsResult = wasm.provide_document_symbols(code)

            if (!symbolsResult || symbolsResult.length === 0) {
              return { symbols: [] }
            }

            // Monaco expects LSP DocumentSymbol format (hierarchical)
            return { symbols: symbolsResult }
          } catch (error) {
            console.warn('Document symbols provider error:', error)
            return { symbols: [] }
          }
        }
      })

      // Register inlay hints provider with WASM backend
      monaco.languages.registerInlayHintsProvider('sysml', {
        provideInlayHints: async (model, range) => {
          try {
            const code = model.getValue()
            const startLine = range.startLineNumber
            const endLine = range.endLineNumber

            const hintsResult = wasm.provide_inlay_hints(code, startLine, endLine)

            if (!hintsResult || hintsResult.length === 0) {
              return { hints: [] }
            }

            // Monaco expects LSP InlayHint format
            return { hints: hintsResult }
          } catch (error) {
            console.warn('Inlay hints provider error:', error)
            return { hints: [] }
          }
        }
      })

      // Register folding range provider with WASM backend
      monaco.languages.registerFoldingRangeProvider('sysml', {
        provideFoldingRanges: async (model) => {
          try {
            const code = model.getValue()
            const foldingResult = wasm.provide_folding_ranges(code)

            if (!foldingResult || foldingResult.length === 0) {
              return []
            }

            // Monaco expects LSP FoldingRange format
            return foldingResult
          } catch (error) {
            console.warn('Folding range provider error:', error)
            return []
          }
        }
      })

      // Register signature help provider with WASM backend
      monaco.languages.registerSignatureHelpProvider('sysml', {
        signatureHelpTriggerCharacters: ['(', ','],
        provideSignatureHelp: async (model, position) => {
          try {
            const code = model.getValue()
            const line = position.lineNumber
            const character = position.column - 1 // Monaco uses 1-based columns

            const signatureResult = wasm.provide_signature_help(code, line, character)

            if (!signatureResult || !signatureResult.signatures) {
              return null
            }

            // Monaco expects LSP SignatureHelp format
            return {
              signatures: signatureResult.signatures,
              activeSignature: signatureResult.activeSignature || 0,
              activeParameter: signatureResult.activeParameter || 0
            }
          } catch (error) {
            console.warn('Signature help provider error:', error)
            return null
          }
        }
      })
    }
    
    // Comprehensive SysML v2 keyword list
    const sysmlKeywords = [
      // Core keywords
      'package', 'import', 'def', 'is', 'abstract', 'readonly', 'ordered', 'unique', 
      'composite', 'derived', 'redefines', 'subsets', 'references', 'chains', 'unions',
      'disjoint', 'intersects', 'differences', 'typing', 'redefinition', 'featuring',
      'crosses', 'conjugates', 'binding', 'bind',
      // Definitions
      'part', 'attribute', 'action', 'requirement', 'interface', 'port', 'connection',
      'flow', 'state', 'constraint', 'enum', 'item', 'individual', 'occurrence',
      'calculation', 'calc', 'case', 'use', 'use_case', 'view', 'viewpoint', 'rendering',
      'allocation', 'metadata', 'metaclass', 'meta', 'snapshot', 'timeslice', 'analysis',
      'variant', 'variation', 'verification',
      // Visibility
      'public', 'private', 'protected',
      // Modifiers
      'ref', 'portion', 'nonunique', 'all', 'var', 'default',
      // Collections
      'seq', 'bag', 'set',
      // Control flow
      'if', 'else', 'while', 'loop', 'in', 'out', 'inout', 'collect', 'select', 'reduce',
      'step', 'first', 'start', 'then', 'fork', 'terminate', 'stop', 'do', 'when', 'at',
      'after', 'assign',
      // Temporal
      'done', 'exhibit', 'perform',
      // State
      'transition', 'parallel', 'entry', 'accept', 'exit',
      // Messaging
      'message', 'send', 'to', 'event', 'then_occurrence',
      // Calculation
      'return', 'sum', 'count', 'min', 'max',
      // Verification
      'verify', 'assert', 'require', 'assume', 'inv',
      // Case
      'trade', 'study', 'scenario', 'objective', 'subject',
      // Use case
      'actor',
      // Dependency
      'dependency', 'depend', 'satisfy', 'verification_case', 'analysis_case',
      // View
      'expose', 'render', 'concern', 'stakeholder',
      // Allocation
      'allocate',
      // Filter
      'filter',
      // Misc
      'connector', 'member', 'doc', 'comment', 'about', 'alias', 'typed', 'by', 'that',
      'of', 'featured', 'from', 'end', 'new', 'measurement',
      // Boolean/logical
      'true', 'false', 'null', 'not',
      // Type checking
      'istype', 'hastype', 'as', 'implies',
      // Specialization arrows
      'specializes'
    ]

    // Create keyword regex pattern
    const keywordPattern = new RegExp(`\\b(${sysmlKeywords.join('|')})\\b`, 'i')

    monaco.languages.setMonarchTokensProvider('sysml', {
      tokenizer: {
        root: [
          [keywordPattern, 'keyword'],
          [/\/\*[\s\S]*?\*\//, 'comment'],
          [/\/\/.*$/, 'comment'],
          [/'[^']*'/, 'string'],
          [/[0-9]+(\.[0-9]+)?/, 'number'],
          [/[a-zA-Z_][a-zA-Z0-9_]*::[a-zA-Z_][a-zA-Z0-9_]*/, 'type'], // Qualified names
          [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
          [/[{}[\]:;=<>:>]/, 'delimiter'],
        ]
      }
    })

    // Register semantic token provider with WASM-powered HIR-based highlighting
    if (wasm) {
      console.log('🎨 Registering HIR-based semantic highlighting')

      monaco.languages.registerDocumentSemanticTokensProvider('sysml', {
        getLegend: () => {
          return {
            tokenTypes: [
              'namespace', 'type', 'class', 'enum', 'interface', 'struct',
              'typeParameter', 'parameter', 'variable', 'property', 'enumMember',
              'event', 'function', 'method', 'macro', 'keyword', 'modifier',
              'comment', 'string', 'number', 'regexp', 'operator'
            ],
            tokenModifiers: [
              'declaration', 'definition', 'readonly', 'static', 'deprecated',
              'abstract', 'async', 'modification', 'documentation', 'defaultLibrary'
            ]
          }
        },
        provideDocumentSemanticTokens: async (model) => {
          try {
            const code = model.getValue()
            if (!code || !wasm || !wasm.provide_semantic_tokens) {
              return { data: new Uint32Array(0) }
            }

            // Get semantic tokens directly from WASM (HIR-based, 43 token types)
            // Returns LSP delta-encoded format: [deltaLine, deltaStart, length, tokenType, modifiers]
            const tokenData = wasm.provide_semantic_tokens(code)

            if (!tokenData || tokenData.length === 0) {
              return { data: new Uint32Array(0) }
            }

            // Convert to Uint32Array for Monaco
            return { data: new Uint32Array(tokenData) }
          } catch (error) {
            console.warn('Semantic token provider error:', error)
            return { data: new Uint32Array(0) }
          }
        },
        releaseDocumentSemanticTokens: () => {}
      })
    }

    // Theme anpassen - Dark Theme
    monaco.editor.defineTheme('sysml-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'type', foreground: '4ec9b0' },
        { token: 'identifier', foreground: 'd4d4d4' },
        { token: 'delimiter', foreground: 'd4d4d4' },
      ],
      colors: {
        'editor.background': '#0A1628',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#00B4D8',
      }
    })
    
    // Theme anpassen - Light Theme
    monaco.editor.defineTheme('sysml-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0066cc', fontStyle: 'bold' },
        { token: 'string', foreground: '008000' },
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'number', foreground: '098658' },
        { token: 'type', foreground: '267f99' },
        { token: 'identifier', foreground: '001080' },
        { token: 'delimiter', foreground: '000000' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f5f5f5',
        'editor.selectionBackground': '#add6ff',
        'editorCursor.foreground': '#00B4D8',
      }
    })
    
    // Set initial theme based on current theme
    monaco.editor.setTheme(theme === 'light' ? 'sysml-light' : 'sysml-dark')
  }
  
  // Update theme when theme changes
  useEffect(() => {
    if (editorRef.current && window.monaco) {
      const monaco = window.monaco
      monaco.editor.setTheme(theme === 'light' ? 'sysml-light' : 'sysml-dark')
    }
  }, [theme])

  // Set diagnostics as Monaco markers
  useEffect(() => {
    if (!editorRef.current) {
      console.log('⏳ Editor not ready yet')
      return
    }

    const model = editorRef.current.getModel()
    if (!model) {
      console.log('⏳ Model not ready yet')
      return
    }

    const monaco = window.monaco
    if (!monaco) {
      // Monaco might not be loaded yet, try again later
      console.log('⏳ Monaco not ready yet, retrying...')
      const timer = setTimeout(() => {
        if (window.monaco && editorRef.current) {
          const model = editorRef.current.getModel()
          if (model) {
            setMarkers(window.monaco, model)
          }
        }
      }, 200)
      return () => clearTimeout(timer)
    }

    console.log('🔧 Setting markers for', diagnostics.length, 'diagnostics')
    setMarkers(monaco, model)
  }, [diagnostics, code])

  const setMarkers = (monaco, model) => {
    if (!monaco || !model) {
      console.warn('⚠️ Cannot set markers: monaco or model missing')
      return
    }

    if (!diagnostics || diagnostics.length === 0) {
      // Clear markers if no diagnostics
      monaco.editor.setModelMarkers(model, 'sysml', [])
      return
    }

    // Convert diagnostics to Monaco markers
    const markers = diagnostics.map((diag, index) => {
      const lineNumber = diag.line || 1
      const lineLength = model.getLineLength(lineNumber) || 100
      const severity = diag.severity === 'error' 
        ? monaco.MarkerSeverity.Error 
        : diag.severity === 'warning'
        ? monaco.MarkerSeverity.Warning
        : diag.severity === 'info'
        ? monaco.MarkerSeverity.Info
        : monaco.MarkerSeverity.Hint

      return {
        severity,
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: Math.max(lineLength, 1),
        message: diag.message || 'Unknown error',
        source: 'SysML Parser',
      }
    })

    console.log('📌 Setting', markers.length, 'markers in Monaco editor:', markers)
    monaco.editor.setModelMarkers(model, 'sysml', markers)
    
    // Verify markers were set
    setTimeout(() => {
      const currentMarkers = monaco.editor.getModelMarkers({ resource: model.uri })
      console.log('✅ Monaco markers after setting:', currentMarkers.length, currentMarkers)
    }, 100)
  }

  return (
    <div className="try-yourself-editor">
      <div className="editor-header">
        <h3>SysML v2 Editor</h3>
        {showExamples && (
          <div className="example-selector">
            <label htmlFor="example-select">Example: </label>
            <select
              id="example-select"
              value={selectedExample}
              onChange={(e) => handleExampleSelect(e.target.value)}
              className="example-select"
            >
              {EXAMPLES.map(ex => (
                <option key={ex.name} value={ex.name}>{ex.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="editor-container" ref={containerRef}>
        <Editor
          height={editorHeight}
          language="sysml"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            semanticHighlighting: {
              enabled: true
            },
            theme: 'sysml-dark',
            // Enable diagnostics and language features
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'off',
            // Enable inlay hints
            inlayHints: {
              enabled: 'on',
            },
          }}
        />
      </div>
      
      {diagnostics.length > 0 && (
        <div className="diagnostics-panel">
          <h4>Diagnostics ({diagnostics.length})</h4>
          <ul>
            {diagnostics.map((diag, index) => (
              <li 
                key={index} 
                className={`diagnostic diagnostic-${diag.severity}`}
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.setPosition({ lineNumber: diag.line, column: 1 })
                    editorRef.current.revealLineInCenter(diag.line)
                    editorRef.current.focus()
                  }
                }}
                style={{ cursor: 'pointer' }}
                title="Click to navigate to this line"
              >
                <span className="diagnostic-line">Line {diag.line}:</span>
                <span className="diagnostic-message">{diag.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
