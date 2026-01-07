import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    // Plugin to handle WASM files without Vite processing
    {
      name: 'wasm-loader',
      resolveId(id) {
        // Tell Vite to treat WASM files as external (don't process them)
        if (id.includes('/wasm/sysml_wasm_bridge.js') || id.includes('sysml_wasm_bridge.js')) {
          // Return the ID as-is to prevent Vite from processing it
          return { id, external: false }
        }
        return null
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Intercept WASM JS file requests and serve them without processing
          if (req.url?.includes('/wasm/sysml_wasm_bridge.js')) {
            // Remove any Vite-added query params like ?import
            const url = new URL(req.url, `http://${req.headers.host}`)
            if (url.searchParams.has('import')) {
              url.searchParams.delete('import')
              req.url = url.pathname + (url.search || '')
            }
            // Ensure proper content type
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
          }
          next()
        })
      }
    },
    // Bundle analyzer - generates stats.html in dist/
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Set to true to auto-open after build
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Options: sunburst, treemap, network
    }),
    // Plugin to copy WASM files to dist during build
    (() => {
      // Define copy function outside the plugin object
      const copyWasmFiles = () => {
        const wasmDest = join(__dirname, 'dist/wasm')
        mkdirSync(wasmDest, { recursive: true })
        
        // Try to copy from src/wasm first, then public/wasm as fallback
        const wasmSources = [
          join(__dirname, 'src/wasm'),
          join(__dirname, 'public/wasm')
        ]
        
        const files = ['sysml_wasm_bridge.js', 'sysml_wasm_bridge_bg.wasm', 'sysml_wasm_bridge.d.ts', 'package.json']
        const copiedFiles = new Set()
        
        for (const wasmSource of wasmSources) {
          if (existsSync(wasmSource)) {
            try {
              files.forEach(file => {
                if (copiedFiles.has(file)) return // Skip if already copied
                
                const src = join(wasmSource, file)
                const dest = join(wasmDest, file)
                if (existsSync(src)) {
                  copyFileSync(src, dest)
                  console.log(`✓ Copied ${file} from ${wasmSource} to dist/wasm/`)
                  copiedFiles.add(file)
                }
              })
            } catch (e) {
              console.error(`Error copying WASM files from ${wasmSource}:`, e)
            }
          }
        }
        
        // Verify all required files were copied
        const missingFiles = files.filter(file => !copiedFiles.has(file))
        if (missingFiles.length > 0) {
          console.error(`❌ Missing WASM files: ${missingFiles.join(', ')}`)
          console.error('WASM files must be present in either src/wasm/ or public/wasm/')
          return false
        } else {
          console.log('✅ All WASM files copied successfully')
          return true
        }
      }
      
      return {
        name: 'copy-wasm',
        // Call copy function in writeBundle (after bundles are written)
        writeBundle() {
          copyWasmFiles()
        },
        // Also call in closeBundle as backup (after all bundles are closed)
        closeBundle() {
          // Verify files exist, if not, try copying again
          const wasmDest = join(__dirname, 'dist/wasm')
          const requiredFiles = ['sysml_wasm_bridge.js', 'sysml_wasm_bridge_bg.wasm']
          const missingFiles = requiredFiles.filter(file => !existsSync(join(wasmDest, file)))
          if (missingFiles.length > 0) {
            console.warn('⚠️ Some WASM files missing in closeBundle, attempting to copy again...')
            copyWasmFiles()
          }
        
          // Copy i18n.js to dist root
          const i18nSource = join(__dirname, 'i18n.js')
          const i18nDest = join(__dirname, 'dist/i18n.js')
          if (existsSync(i18nSource)) {
            try {
              copyFileSync(i18nSource, i18nDest)
              console.log('✓ Copied i18n.js to dist/')
            } catch (e) {
              console.error('Error copying i18n.js:', e)
            }
          } else {
            console.warn('⚠ i18n.js not found:', i18nSource)
          }

          // Copy .nojekyll to dist root
          const nojekyllSource = join(__dirname, '.nojekyll')
          const nojekyllDest = join(__dirname, 'dist/.nojekyll')
          if (existsSync(nojekyllSource)) {
            try {
              copyFileSync(nojekyllSource, nojekyllDest)
              console.log('✓ Copied .nojekyll to dist/')
            } catch (e) {
              console.error('Error copying .nojekyll:', e)
            }
          }
          
          // Copy 404.html to dist root (GitHub Pages fallback)
          const notFoundSource = join(__dirname, '404.html')
          const notFoundDest = join(__dirname, 'dist/404.html')
          if (existsSync(notFoundSource)) {
            try {
              copyFileSync(notFoundSource, notFoundDest)
              console.log('✓ Copied 404.html to dist/')
            } catch (e) {
              console.error('Error copying 404.html:', e)
            }
          } else {
            console.warn('⚠ 404.html not found:', notFoundSource)
          }
          
          // Copy assets folder to dist
          const assetsSource = join(__dirname, 'assets')
          const assetsDest = join(__dirname, 'dist/assets')
          if (existsSync(assetsSource)) {
            try {
              mkdirSync(assetsDest, { recursive: true })
              const files = readdirSync(assetsSource)
              for (const file of files) {
                const src = join(assetsSource, file)
                const dest = join(assetsDest, file)
                const stat = statSync(src)
                if (stat.isFile()) {
                  copyFileSync(src, dest)
                  console.log(`✓ Copied ${file} to dist/assets/`)
                }
              }
            } catch (e) {
              console.error('Error copying assets:', e)
              // Fallback: try copying key files only
              try {
                mkdirSync(assetsDest, { recursive: true })
                const keyFiles = ['logo_new.svg', 'logo_white.svg', 'logo_S_black2.svg', 'logo_S_comp.svg', 'favicon.svg']
                keyFiles.forEach(file => {
                  const src = join(assetsSource, file)
                  const dest = join(assetsDest, file)
                  if (existsSync(src)) {
                    copyFileSync(src, dest)
                    console.log(`✓ Copied ${file} to dist/assets/`)
                  }
                })
              } catch (e2) {
                console.error('Error in fallback asset copy:', e2)
              }
            }
          } else {
            console.warn('⚠ Assets directory not found:', assetsSource)
          }
        }
      }
    })()
  ],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true, // Split CSS per route for better caching
    rollupOptions: {
      // Allow dynamic imports that might not exist at build time
      external: [],
      output: {
        // Manual chunks for better caching - split vendor libraries
        manualChunks: (id) => {
          // React and all React-dependent libraries must be in the same chunk
          // to ensure React is available when these libraries need it (e.g., forwardRef)
          if (
            id.includes('node_modules/react') || 
            id.includes('node_modules/react-dom') || 
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@monaco-editor/react') ||
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/lucide-react')
          ) {
            return 'react-vendor'
          }
          // Editor core (non-React wrapper)
          if (id.includes('node_modules/@monaco-editor') || id.includes('node_modules/monaco-editor')) {
            return 'editor-vendor'
          }
          // Other node_modules go into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Ensure WASM files are copied correctly with hash for cache busting
        assetFileNames: (assetInfo) => {
          // Keep WASM files in wasm/ directory, not assets/
          if (assetInfo.name && (assetInfo.name.endsWith('.wasm') || assetInfo.name.includes('wasm'))) {
            return 'wasm/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        // Ensure chunk files don't interfere with WASM paths
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
      // Suppress warnings about missing WASM imports
      onwarn(warning, warn) {
        // Ignore warnings about missing WASM files
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.id?.includes('wasm')) {
          return
        }
        warn(warning)
      },
      // Enhanced tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    }
  },
  optimizeDeps: {
    // Exclude WASM from pre-bundling
    exclude: ['/wasm/sysml_wasm_bridge.js', '../wasm/sysml_wasm_bridge.js']
  },
  resolve: {
    // Handle WASM imports gracefully
    alias: {
      // This prevents Vite from trying to resolve WASM imports at build time
    }
  },
  // Ensure WASM files are served correctly
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
})


