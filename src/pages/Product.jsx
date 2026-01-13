import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpotlightCard from '../components/SpotlightCard'
import { useTranslation } from '../utils/i18n'
import { useTheme } from '../contexts/ThemeContext'
import {
  complianceVariants,
  differentiators,
  platformVariants,
  lspFeatures,
  editions
} from '../data/product'
import './Page.css'
import './Product.css'

const Product = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // Note: All data arrays are now imported from src/data/product/
  // See: differentiators, platformVariants, lspFeatures, editions, complianceVariants

  const variants = platformVariants // Alias for backward compatibility

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="page-hero-section hero-products">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-hero-content"
          >
            <div className="hero-badge">Enterprise SysML v2 Tooling</div>
            <h1>NexSuite</h1>
            <p className="page-hero-description">
              NexSuite delivers production-ready SysML v2 Language Server technology with VS Code integration, AI assistance, and compliance variants.
              Built for OEM/Tier-1 teams who demand performance, reliability, and regulatory compliance.
            </p>
            <div className="hero-cta">
              <Link to="/try-yourself" className="btn primary">Try Yourself</Link>
              <Link to="/contact" className="btn ghost">Contact Sales</Link>
            </div>
            <details className="hero-stats-details">
              <summary className="hero-stats-summary">Performance Metrics</summary>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">&lt;50ms</div>
                  <div className="stat-label">LSP Response Time</div>
                  <div className="stat-explanation">Measured in internal benchmarks with typical SysML v2 models (100-500 elements). Response time measured from request to first diagnostic result.</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">18/18</div>
                  <div className="stat-label">LSP Features</div>
                  <div className="stat-explanation">All Language Server Protocol features implemented and tested against LSP specification v3.17. Verified with VS Code, Neovim, and other LSP clients.</div>
                </div>
              </div>
            </details>
          </motion.div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose NexSuite</h2>
            <p className="section-subtitle">
              Built for OEM/Tier-1 systems engineering teams who demand performance, reliability, and regulatory compliance
            </p>
          </div>
          <div className="differentiators-grid">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <div className="differentiator-icon">
                    {typeof item.icon === 'string' && item.icon.startsWith('/assets/') ? (
                      <img
                        src={item.icon}
                        alt={item.title}
                        style={{ height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain' }}
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul className="feature-tags">
                    {item.tags.map((tag, i) => (
                      <li key={i}>{tag}</li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className="architecture-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="architecture-diagram"
          >
            {/* Top: SysNex */}
            <div className="architecture-top">
              <div className="architecture-header-card">
                <div className="architecture-logo">
                  <img
                    src={theme === 'light' ? "./assets/logo_new.svg" : "./assets/logo_white.svg"}
                    alt="SysNex"
                    className="architecture-logo-img"
                  />
                </div>
                <h2 className="architecture-title">SysNex</h2>
                <p className="architecture-subtitle">AI-native, open SysML v2 Engineering Platform</p>
              </div>
            </div>

            {/* Middle: Application Modules */}
            <div className="architecture-modules">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-doc">📄</div>
                <h3>NexDocs</h3>
                <p>Model-driven Documentation</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-req">📋</div>
                <h3>NexReq</h3>
                <p>Model-native Requirements</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-test"><img src="/assets/icon_nextest.svg" alt="NexTest" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexTest</h3>
                <p>Model-driven Verification</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-viz"><img src="/assets/icon_nexviz.svg" alt="NexViz" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexViz</h3>
                <p>Interactive Visualization</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-analytics"><img src="/assets/icon_nexanalytics.svg" alt="NexAnalytics" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexAnalytics</h3>
                <p>Model Analysis</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-trade"><img src="/assets/icon_nextrade.svg" alt="NexTrade" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexTrade</h3>
                <p>Trade Study Analysis</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-var"><img src="/assets/icon_nexvar.svg" alt="NexVar" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexVar</h3>
                <p>Variability Management</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="architecture-module"
              >
                <div className="module-icon module-icon-sim"><img src="/assets/icon_nexsim.svg" alt="NexSim" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexSim</h3>
                <p>State Machine Simulation</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="architecture-module architecture-module-suite"
              >
                <div className="module-icon module-icon-suite"><img src="/assets/icon_nexsuite.svg" alt="NexSuite" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
                <h3>NexSuite</h3>
                <p>Engineering Workflow Layer</p>
                <span className="module-badge">Integrates all Nex features</span>
              </motion.div>
            </div>

            {/* Bottom: SysNex Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="architecture-platform"
            >
              <div className="architecture-platform-card">
                <div className="platform-logo">
                  <img
                    src={theme === 'light' ? "./assets/logo_new.svg" : "./assets/logo_white.svg"}
                    alt="SysNex Platform"
                    className="platform-logo-img"
                  />
                </div>
                <h3 className="platform-title">SysNex Platform</h3>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Variants */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>NexSuite Platform</h2>
            <p className="section-subtitle">
              From free viewer (NexDocs Viewer) to enterprise compliance—choose the variant that fits your needs. All built from a single codebase with IP-protected feature gating.
            </p>
          </div>
          <div className="platforms-grid">
            {variants.map((variant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`platform-card ${variant.featured ? 'featured' : ''}`}
              >
                {variant.badge && <div className="platform-badge">{variant.badge}</div>}
                <div className="platform-icon">{variant.icon}</div>
                <h3>{variant.title}</h3>
                <p className="platform-description">{variant.description}</p>
                <ul className="platform-features">
                  {variant.features.map((feature, i) => (
                    <li key={i}>✅ {feature}</li>
                  ))}
                </ul>
                <div className="platform-status">{variant.status}</div>
                <Link to={variant.link} className="btn primary platform-cta">
                  {variant.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LSP Features */}
      <section id="features" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Complete LSP Implementation</h2>
            <p className="section-subtitle">
              Complete Language Server Protocol implementation with production-ready performance
            </p>
          </div>
          <div className="lsp-features-grid">
            {lspFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="lsp-feature-card"
              >
                <div className="lsp-feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                <div className="lsp-metric">{feature.metric}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Variants */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>IDE Editions</h2>
            <p className="section-subtitle">
              Multiple IDE variants optimized for different use cases—from lightweight CI/CD to enterprise compliance
            </p>
          </div>
          <div className="variants-grid">
            {editions.map((variant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`variant-card ${variant.featured ? 'featured' : ''} ${variant.essential ? 'essential' : ''}`}
              >
                <div className={`variant-badge ${variant.essential ? 'essential-badge' : variant.featured ? 'standard-badge' : 'platform-badge'}`}>
                  {variant.badge}
                </div>
                <h3>{variant.title}</h3>
                <div className="variant-size">{variant.size}</div>
                <p>{variant.description}</p>
                <ul className="variant-features">
                  {variant.features.map((feature, i) => (
                    <li key={i}>✅ {feature}</li>
                  ))}
                </ul>
                <div className="variant-status">{variant.status}</div>
                <Link to="/contact" className={`variant-cta ${variant.featured ? 'primary' : ''}`}>
                  {variant.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections: Based on actual FEATURES.md capabilities */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Product Suite</h2>
            <p className="section-subtitle">
              Comprehensive SysML v2 tooling for documentation, requirements, verification, visualization, analytics, and integrated workflows
            </p>
          </div>

          {/* NexDocs Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon">📄</div>
              <h3>NexDocs - Model-driven Documentation</h3>
              <p className="product-suite-description">Generate, edit, and publish comprehensive documentation from your SysML v2 models</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-viewer">Viewer</div>
                <h4>NexDocs Viewer</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Advanced documentation viewer with cross-file navigation, smart import resolution, and automatic diagram generation</p>
                <ul className="variant-features">
                  <li>✅ MkDocs-style hierarchical documentation</li>
                  <li>✅ Cross-file navigation with clickable imports</li>
                  <li>✅ Smart import resolution (standard library detection)</li>
                  <li>✅ Automatic diagram generation (BDD, IBD, Activity, StateMachine, Requirement)</li>
                  <li>✅ Relationship extraction (specialization, typing, satisfaction, constraints)</li>
                  <li>✅ HIR-based extraction (single source of truth)</li>
                  <li>✅ Theme integration with smooth animations</li>
                  <li>✅ Zero installation—browser-based WASM</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Editor</div>
                <h4>NexDocs Editor</h4>
                <p className="variant-tier">🔶 Platform</p>
                <p className="variant-description">Full documentation editing with quality indicators, constraint display, workspace-wide symbol resolution, and export capabilities</p>
                <ul className="variant-features">
                  <li>✅ Everything in Viewer (cross-file navigation, smart imports, auto diagrams)</li>
                  <li>✅ Quality indicators (coverage, scores, grades)</li>
                  <li>✅ Constraint display and validation</li>
                  <li>✅ Workspace-wide symbol lookup and resolution</li>
                  <li>✅ Export to HTML/MD/PDF/Word</li>
                  <li>✅ Import management panel with visibility tracking</li>
                  <li>✅ Element creation and editing with type resolution</li>
                  <li>✅ Documentation editor with comment filtering</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-publisher">Generator</div>
                <h4>NexDocs Generator</h4>
                <p className="variant-tier">🔶 Platform</p>
                <p className="variant-description">Automated documentation publishing with Sphinx integration, HIR-based extraction, and workspace generation</p>
                <ul className="variant-features">
                  <li>✅ Everything in Editor (cross-file nav, symbol resolution, diagrams)</li>
                  <li>✅ HIR-based documentation extraction (single source of truth)</li>
                  <li>✅ MkDocs workspace generation with hierarchical structure</li>
                  <li>✅ Sphinx pipeline with type info and relationship links</li>
                  <li>✅ Continuous documentation on merge</li>
                  <li>✅ Automated diagram generation (5 diagram types)</li>
                  <li>✅ CI/CD integration with batch processing</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
            </div>
          </motion.div>

          {/* KRAKEN Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_kraken.png" alt="KRAKEN" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>KRAKEN by SysNex - Engineering Service Mesh</h3>
              <p className="product-suite-description">The high-performance digital backbone connecting SysML v2, requirements, simulation, and legacy tools</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card product-variant-featured">
                <div className="variant-badge variant-badge-publisher">Core</div>
                <h4>Kraken Hub</h4>
                <p className="variant-tier">🐙 Backbone</p>
                <p className="variant-description">Unified orchestrator acting as a central nervous system for your engineering data, ensuring consistency and real-time sync</p>
                <ul className="variant-features">
                  <li>✅ <b>Service Mesh Architecture</b>: Connects tools via high-performance Rust sidecars</li>
                  <li>✅ <b>Incremental Intelligence</b>: Salsa-based incremental computation for sub-second updates</li>
                  <li>✅ <b>Polyglot SDKs</b>: First-class Python and Java APIs for custom automation</li>
                  <li>✅ <b>Legacy Bridge</b>: Bi-directional sync with Cameo, DOORS, and Codebeamer</li>
                  <li>✅ <b>Data Unification</b>: Single source of truth across federated repositories</li>
                  <li>✅ <b>Event Streaming</b>: Real-time change propagation and webhooks</li>
                  <li>✅ <b>Security</b>: OIDC-compliant authentication and role-based access</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
            </div>
          </motion.div>

          {/* NexReq Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon">📋</div>
              <h3>NexReq - Model-native Requirements</h3>
              <p className="product-suite-description">Manage requirements with full traceability, ASIL tracking, and change impact analysis</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-viewer">Manager</div>
                <h4>NexReq Manager</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Full requirements management with traceability, verification, and satisfaction tracking</p>
                <ul className="variant-features">
                  <li>✅ Bidirectional traceability (verify/satisfy/refine)</li>
                  <li>✅ ASIL tracking and validation</li>
                  <li>✅ Change impact analysis</li>
                  <li>✅ Requirement quality checking</li>
                  <li>✅ Requirement templates</li>
                  <li>✅ Traceability visualization</li>
                </ul>
                <div className="variant-status">✅ Production-Ready (93%)</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Validator</div>
                <h4>NexReq Validator</h4>
                <p className="variant-tier">🛡️ Automotive/Safety</p>
                <p className="variant-description">ISO 26262 ASIL decomposition validation with independence checks</p>
                <ul className="variant-features">
                  <li>✅ ISO 26262-9 Part 9 compliance</li>
                  <li>✅ All 12 valid decomposition schemes</li>
                  <li>✅ Real-time LSP diagnostics</li>
                  <li>✅ Independence analysis</li>
                  <li>✅ Comprehensive validation</li>
                  <li>✅ 25/25 tests passing</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-publisher">Generator</div>
                <h4>NexReq Generator</h4>
                <p className="variant-tier">🛡️ Automotive/Safety</p>
                <p className="variant-description">Enterprise requirements publishing with ASPICE work products and compliance reporting</p>
                <ul className="variant-features">
                  <li>✅ ASPICE work products (20/20 types)</li>
                  <li>✅ Requirements traceability matrix</li>
                  <li>✅ Assessment engine with gap analysis</li>
                  <li>✅ Multi-format export (HTML/MD/PDF/Word)</li>
                  <li>✅ Automated requirement extraction</li>
                  <li>✅ Compliance reporting</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
            </div>
          </motion.div>

          {/* NexTest Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nextest.svg" alt="NexTest" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexTest - Model-driven Verification</h3>
              <p className="product-suite-description">Comprehensive test management, verification planning, and validation workflows</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-viewer">Manager</div>
                <h4>NexTest Manager</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Enhanced test management with test case creation, editing, and tracking</p>
                <ul className="variant-features">
                  <li>✅ Test case creation and editing</li>
                  <li>✅ Test specification management</li>
                  <li>✅ Test execution tracking</li>
                  <li>✅ Enhanced test management UI</li>
                  <li>✅ Test status updates</li>
                  <li>✅ Test coverage visualization</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Planner</div>
                <h4>NexTest Planner</h4>
                <p className="variant-tier">🛡️ Automotive/Safety</p>
                <p className="variant-description">Verification planning with multiple methods and test generation strategies</p>
                <ul className="variant-features">
                  <li>✅ Verification planning (4 methods)</li>
                  <li>✅ Test generation (5 strategies)</li>
                  <li>✅ Verification status tracking</li>
                  <li>✅ Test coverage reports</li>
                  <li>✅ Implementation tracking</li>
                  <li>✅ Compliance test documentation</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-publisher">Generator</div>
                <h4>NexTest Generator</h4>
                <p className="variant-tier">🛡️ Automotive/Safety</p>
                <p className="variant-description">Automated test documentation and verification reports for compliance</p>
                <ul className="variant-features">
                  <li>✅ Everything in Planner</li>
                  <li>✅ Automated test documentation</li>
                  <li>✅ Verification reports</li>
                  <li>✅ Test coverage analysis</li>
                  <li>✅ Compliance documentation</li>
                  <li>✅ CI/CD integration</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
            </div>
          </motion.div>

          {/* NexViz Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nexviz.svg" alt="NexViz" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexViz - Interactive Visualization</h3>
              <p className="product-suite-description">Modern diagram editing and visualization with React Flow and interactive diagrams</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-viewer">Viewer</div>
                <h4>NexViz Viewer</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Interactive diagram viewing with zoom, pan, and navigation</p>
                <ul className="variant-features">
                  <li>✅ Interactive diagrams (6 types)</li>
                  <li>✅ Graph visualization</li>
                  <li>✅ Tree diagrams</li>
                  <li>✅ Relationship diagrams</li>
                  <li>✅ Click-to-navigate model</li>
                  <li>✅ ELK.js auto-layout</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Editor</div>
                <h4>NexViz Editor</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Modern interactive diagram editor with React Flow and bidirectional sync</p>
                <ul className="variant-features">
                  <li>✅ Everything in Viewer</li>
                  <li>✅ React Flow diagram editor (90% complete)</li>
                  <li>✅ 9 node types, 5 edge types</li>
                  <li>✅ Visual relationship creation</li>
                  <li>✅ Undo/redo support</li>
                  <li>✅ Layout persistence</li>
                  <li>✅ Bidirectional text-diagram sync</li>
                </ul>
                <div className="variant-status">✅ Production-Ready (90%)</div>
              </div>
            </div>
          </motion.div>

          {/* NexAnalytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nexanalytics.svg" alt="NexAnalytics" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexAnalytics - Model Analysis</h3>
              <p className="product-suite-description">Comprehensive model quality metrics, complexity analysis, and relationship analytics</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-viewer">Viewer</div>
                <h4>NexAnalytics Viewer</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">View model quality metrics, complexity scores, and analytics dashboards</p>
                <ul className="variant-features">
                  <li>✅ Complexity metrics display</li>
                  <li>✅ Code metrics visualization</li>
                  <li>✅ Relationship analysis</li>
                  <li>✅ Quality dashboards</li>
                  <li>✅ Real-time metrics</li>
                  <li>✅ Interactive drill-down</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Analyzer</div>
                <h4>NexAnalytics Analyzer</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Advanced model analysis with complexity calculation and dependency analysis</p>
                <ul className="variant-features">
                  <li>✅ Everything in Viewer</li>
                  <li>✅ Cyclomatic complexity calculation</li>
                  <li>✅ Nesting depth analysis</li>
                  <li>✅ Lines of code metrics</li>
                  <li>✅ Element count analysis</li>
                  <li>✅ Dependency relationship analysis</li>
                  <li>✅ LSP-integrated analytics (100% complete)</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
            </div>
          </motion.div>

          {/* NexTrade Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nextrade.svg" alt="NexTrade" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexTrade - Trade Study Analysis</h3>
              <p className="product-suite-description">ISO 15288 compliant decision management with MCDA trade studies and UVL integration</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Analyzer</div>
                <h4>NexTrade Analyzer</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Multi-Criteria Decision Analysis with AHP weighting and sensitivity analysis</p>
                <ul className="variant-features">
                  <li>✅ MCDA trade studies</li>
                  <li>✅ AHP weight calculation</li>
                  <li>✅ Sensitivity analysis</li>
                  <li>✅ Interactive visualization</li>
                  <li>✅ Alternative comparison</li>
                  <li>✅ Ranking visualization</li>
                  <li>✅ UVL integration (automatic alternatives)</li>
                </ul>
                <div className="variant-status">✅ Production-Ready (95%)</div>
              </div>
            </div>
          </motion.div>

          {/* NexVar Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nexvar.svg" alt="NexVar" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexVar - Variability Management</h3>
              <p className="product-suite-description">UVL feature model management with Z3 solver integration and product derivation</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Manager</div>
                <h4>NexVar Manager</h4>
                <p className="variant-tier">🔶 Platform</p>
                <p className="variant-description">Universal Variability Language support with feature model extraction and import</p>
                <ul className="variant-features">
                  <li>✅ UVL parser and generator</li>
                  <li>✅ Feature model extraction/import</li>
                  <li>✅ SAT-based validation</li>
                  <li>✅ Z3 solver integration (SMT solving)</li>
                  <li>✅ Configuration propagation</li>
                  <li>✅ 150% → 100% derivation</li>
                  <li>✅ Live preview decorations</li>
                  <li>✅ Trade study integration</li>
                </ul>
                <div className="variant-status">✅ Production-Ready (97%)</div>
              </div>
            </div>
          </motion.div>

          {/* NexSim Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="product-suite-section"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nexsim.svg" alt="NexSim" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexSim - State Machine Simulation</h3>
              <p className="product-suite-description">Execute and simulate state machines with debugging support and checkpoint/resume</p>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Simulator</div>
                <h4>NexSim Simulator</h4>
                <p className="variant-tier">🟣 Platform-Full</p>
                <p className="variant-description">State machine execution engine with hierarchical states and parallel regions</p>
                <ul className="variant-features">
                  <li>✅ State machine runtime</li>
                  <li>✅ Hierarchical states support</li>
                  <li>✅ Parallel regions execution</li>
                  <li>✅ Action execution (entry/do/exit)</li>
                  <li>✅ HIR integration</li>
                  <li>✅ Checkpoint/resume</li>
                  <li>✅ Debugging support (breakpoints)</li>
                  <li>✅ Time-based simulation (90% complete)</li>
                </ul>
                <div className="variant-status">✅ Production-Ready (95%)</div>
              </div>
            </div>
          </motion.div>

          {/* NexSuite Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="product-suite-section product-suite-featured"
          >
            <div className="product-suite-header">
              <div className="product-suite-icon"><img src="/assets/icon_nexsuite.svg" alt="NexSuite" style={{ width: "120px", height: "120px", objectFit: "contain" }} /></div>
              <h3>NexSuite - Engineering Workflow Layer</h3>
              <p className="product-suite-description">Integrated platform combining all Nex products (NexDocs, NexReq, NexTest, NexViz, NexAnalytics, NexTrade, NexVar, NexSim) with advanced workflow capabilities</p>
              <span className="suite-badge">Integrates all Nex features</span>
            </div>
            <div className="product-variants-grid">
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-viewer">Viewer</div>
                <h4>NexSuite Viewer</h4>
                <p className="variant-tier">🔷 Standard</p>
                <p className="variant-description">Unified viewer combining all viewing capabilities across the Nex product suite</p>
                <ul className="variant-features">
                  <li>✅ All NexDocs Viewer features</li>
                  <li>✅ All NexViz Viewer features</li>
                  <li>✅ All NexAnalytics Viewer features</li>
                  <li>✅ Unified navigation</li>
                  <li>✅ Cross-product traceability</li>
                  <li>✅ Integrated analytics dashboard</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card">
                <div className="variant-badge variant-badge-editor">Editor</div>
                <h4>NexSuite Editor</h4>
                <p className="variant-tier">🔶 Platform</p>
                <p className="variant-description">Complete editing suite with all documentation, requirements, test, visualization, and analysis features</p>
                <ul className="variant-features">
                  <li>✅ All NexDocs Editor features</li>
                  <li>✅ All NexReq Manager features</li>
                  <li>✅ All NexTest Manager features</li>
                  <li>✅ All NexViz Editor features</li>
                  <li>✅ All NexAnalytics Analyzer features</li>
                  <li>✅ All NexTrade Analyzer features</li>
                  <li>✅ All NexVar Manager features</li>
                  <li>✅ Workflow orchestration</li>
                  <li>✅ Change impact across products</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
              <div className="product-variant-card product-variant-featured">
                <div className="variant-badge variant-badge-publisher">Publisher</div>
                <h4>NexSuite Publisher</h4>
                <p className="variant-tier">🛡️ Enterprise</p>
                <p className="variant-description">Enterprise publishing platform with full compliance, ASPICE work products, automated workflows, and simulation</p>
                <ul className="variant-features">
                  <li>✅ All NexDocs Generator features</li>
                  <li>✅ All NexReq Generator features</li>
                  <li>✅ All NexTest Generator features</li>
                  <li>✅ All NexSim Simulator features</li>
                  <li>✅ ASPICE work products (20/20)</li>
                  <li>✅ ISO 15288 compliance frameworks</li>
                  <li>✅ Automated compliance reporting</li>
                  <li>✅ CI/CD integration</li>
                  <li>✅ Multi-industry compliance (Automotive, Aviation, Medical, Railway)</li>
                </ul>
                <div className="variant-status">✅ Production-Ready</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Variants Section */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Compliance & Regulatory Variants</h2>
            <p className="section-subtitle">
              Industry-specific compliance solutions for regulated engineering domains
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="compliance-intro"
          >
            <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
              NexSuite offers specialized compliance variants built on the <strong>Systems Engineering Foundation (ISO/IEC 15288)</strong>,
              tailored for automotive, aviation, medical, and railway industries. Each variant includes domain-specific standards,
              work products, and validation workflows required for regulatory approval.
            </p>
          </motion.div>

          <div className="product-variants-grid" style={{ gap: '2rem' }}>
            {complianceVariants.map((variant, index) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="product-variant-card"
                style={{
                  border: variant.status.includes('✅') || variant.status.includes('🟡') ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  opacity: variant.status.includes('❌') ? 0.7 : 1
                }}
              >
                <div className={`variant-badge variant-badge-${variant.badge.toLowerCase()}`}>
                  {variant.icon} {variant.badge}
                </div>
                <h4>{variant.title}</h4>
                <p className="variant-tier">{variant.size}</p>
                <p className="variant-price" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>
                  {variant.price}
                  {variant.discount && <span style={{ fontSize: '0.9rem', display: 'block', color: 'var(--success-color)' }}>({variant.discount})</span>}
                </p>
                <p className="variant-description">{variant.description}</p>

                {/* Standards */}
                <div style={{ margin: '1rem 0' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Standards:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {variant.standards.map((standard, i) => (
                      <span key={i} style={{
                        background: 'var(--bg-secondary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        border: '1px solid var(--border-color)'
                      }}>
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <ul className="variant-features" style={{ marginTop: '1rem' }}>
                  {variant.features.slice(0, 6).map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                  {variant.features.length > 6 && (
                    <li style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      +{variant.features.length - 6} more features...
                    </li>
                  )}
                </ul>

                {/* Status */}
                <div className="variant-status" style={{ marginTop: '1rem' }}>
                  {variant.status}
                  {variant.statusDetail && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {variant.statusDetail}
                    </div>
                  )}
                </div>

                {/* ROI */}
                {variant.roi && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-code)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    <div><strong>ROI:</strong> {variant.roi.saving}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Payback: {variant.roi.payback}</div>
                  </div>
                )}

                {/* CTA Button */}
                <div style={{ marginTop: '1.5rem' }}>
                  <Link
                    to="/contact"
                    className={`btn ${variant.status.includes('✅') || variant.status.includes('🟡') ? 'primary' : 'ghost'}`}
                    style={{ width: '100%' }}
                  >
                    {variant.status.includes('❌') ? 'Join Waitlist' : 'Contact Sales'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compliance Summary Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: '4rem' }}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Compliance Variant Comparison</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Variant</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Price/Seat/Year</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>ROI Savings</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Payback Period</th>
                    <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceVariants.map((variant, index) => (
                    <tr key={variant.id} style={{
                      borderBottom: index < complianceVariants.length - 1 ? '1px solid var(--border-color)' : 'none'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <strong>{variant.icon} {variant.title}</strong>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                        {variant.price}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--success-color)' }}>
                        {variant.roi?.saving || 'TBD'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {variant.roi?.payback || 'TBD'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {variant.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Call-out for Systems Engineering Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{
              marginTop: '3rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
              borderRadius: '12px',
              border: '2px solid var(--accent-primary)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>🔧 All Compliance Variants Include Systems Engineering Foundation</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto' }}>
              Every compliance variant is built on our <strong>Systems Engineering Foundation (ISO/IEC 15288)</strong>,
              providing comprehensive systems engineering processes, work products, and lifecycle documentation.
              This foundation ensures consistent methodology across all regulated domains.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/contact" className="btn primary large">
                Learn More About Compliance Variants
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cta-content"
          >
            <h2>{t('home.cta.heading')}</h2>
            <p>{t('home.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn primary large">{t('home.cta.primary')}</Link>
              <Link to="/try-yourself" className="btn ghost large">{t('home.cta.secondary')}</Link>
            </div>
            <p className="cta-note">{t('pricing.trial.subtitle') || 'Start with a 30-day free trial. No credit card required.'}</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Product


