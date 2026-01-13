import React from 'react'
import { Link } from 'react-router-dom'
import SpotlightCard from '../components/SpotlightCard'
import './Page.css'
import './TryYourself.css'

/**
 * Interactive Demo Hub
 *
 * Central page linking to all product demos with WASM-powered features
 */
export default function TryYourself() {
  const demos = [
    {
      id: 'nexdocs',
      title: 'NexDocs Viewer',
      icon: '/assets/icon_nexdocs.svg',
      description: 'Write SysML v2 code and see live hierarchical documentation with cross-file navigation and smart import resolution.',
      link: '/try-nexdocs',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'Real-time WASM parsing',
        'HIR-based documentation',
        'LSP features (hover, completion)',
        'Syntax highlighting'
      ]
    },
    {
      id: 'nexvar',
      title: 'NexVar Variability',
      icon: '/assets/icon_nexvar.svg',
      description: 'Experience UVL (Universal Variability Language) for feature modeling and product line engineering with constraints.',
      link: '/try-nexvar',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'UVL feature modeling',
        'Constraint validation',
        'Feature tree diagrams',
        'Product line analysis'
      ]
    },
    {
      id: 'nexreq',
      title: 'NexReq Requirements',
      icon: '/assets/icon_nexreq.svg',
      description: 'Requirements management with live extraction, traceability analysis, and verification tracking using WASM.',
      link: '/try-nexreq',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'WASM requirement extraction',
        'Traceability matrix',
        'Satisfy/verify relationships',
        'Coverage analysis'
      ]
    },
    {
      id: 'nextest',
      title: 'NexTest Verification',
      icon: '/assets/icon_nextest.svg',
      description: 'Model-based testing with verification case extraction, test coverage analysis, and assertion tracking.',
      link: '/try-nextest',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'Test case extraction',
        'Assertion validation',
        'Coverage metrics',
        'Scenario analysis'
      ]
    },
    {
      id: 'nexviz',
      title: 'NexViz Diagrams',
      icon: '/assets/icon_nexviz.svg',
      description: 'Diagram visualization with element extraction and relationship mapping from SysML v2 models.',
      link: '/try-nexviz',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'BDD/IBD element extraction',
        'State machine analysis',
        'Activity flow mapping',
        'HIR tree visualization'
      ]
    },
    {
      id: 'nexanalytics',
      title: 'NexAnalytics Dashboard',
      icon: '/assets/icon_nexanalytics.svg',
      description: 'Comprehensive model analytics with live quality metrics, coverage analysis, and complexity insights.',
      link: '/try-nexanalytics',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'WASM analytics engine',
        'Quality score metrics',
        'Documentation coverage',
        'Complexity tracking'
      ]
    },
    {
      id: 'nextrade',
      title: 'NexTrade Studies',
      icon: '/assets/icon_nextrade.svg',
      description: 'Trade study management with variant extraction, objective tracking, and decision analysis.',
      link: '/try-nextrade',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'Trade study extraction',
        'Variant analysis',
        'Objective tracking',
        'Decision matrices'
      ]
    },
    {
      id: 'nexsim',
      title: 'NexSim Simulation',
      icon: '/assets/icon_nexsim.svg',
      description: 'Behavioral simulation with calculation extraction, state machine visualization, and action flow analysis.',
      link: '/try-nexsim',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'Calculation extraction',
        'State machine analysis',
        'Action flow tracking',
        'Behavioral modeling'
      ]
    },
    {
      id: 'kraken',
      title: 'KRAKEN Hub',
      icon: '/assets/icon_kraken.png',
      description: 'Unified digital backbone connecting SysML v2, requirements, simulation, and legacy tools.',
      link: '/try-kraken',
      status: 'Live Interactive Demo',
      statusColor: 'var(--color-success)',
      features: [
        'Service orchestration',
        'Data unification',
        'Legacy tool bridge',
        'Real-time sync'
      ]
    }
  ]

  return (
    <div className="page">
      <section className="page-hero-section">
        <div className="container">
          <h1>Try NexSuite Yourself</h1>
          <p className="page-hero-description">
            Experience our SysML v2 tools directly in your browser. All demos use real WASM-powered parsing
            and analysis - no mockups! Choose a demo below to explore interactive features.
          </p>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          {/* Disclaimer Notice */}
          <div className="try-yourself-disclaimer">
            <strong>⚠️ Development Status:</strong> Not all demos are fully functional yet. Some features may be in development or limited in scope. We're continuously improving these demos based on feedback.
          </div>

          <div className="section-header">
            <h2>Interactive Demos</h2>
            <p className="section-subtitle">
              8 live demonstrations powered by WebAssembly - experience real SysML v2 parsing in your browser
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {demos.map((demo) => (
              <SpotlightCard key={demo.id}>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Icon and Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img
                      src={demo.icon}
                      alt={demo.title}
                      style={{ height: '48px', width: 'auto', maxWidth: '48px', objectFit: 'contain' }}
                    />
                    <h3 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{demo.title}</h3>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-block',
                    padding: '0.35rem 0.7rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: demo.statusColor,
                    marginBottom: '1rem',
                    alignSelf: 'flex-start'
                  }}>
                    {demo.status}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                    flex: 1
                  }}>
                    {demo.description}
                  </p>

                  {/* Features List */}
                  <ul style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                    marginBottom: '1.25rem',
                    paddingLeft: '1.2rem'
                  }}>
                    {demo.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to={demo.link}
                    className="btn primary"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Try Demo →
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Info Footer */}
          <div className="try-yourself-footer" style={{ marginTop: '3rem' }}>
            <p className="try-yourself-note">
              <strong>100% Real WASM Demos:</strong> All demos use actual WebAssembly-compiled SysML v2 parser
              with LSP capabilities. No mockups or fake data - you're experiencing the real NexSuite engine
              running entirely in your browser!
            </p>
            <p className="try-yourself-note" style={{ marginTop: '1rem' }}>
              For the full NexSuite experience with multi-file projects, team collaboration, and CI/CD integration,
              check out our{' '}
              <Link to="/platforms">VS Code Extension and Desktop platforms</Link>.
            </p>
            <p className="try-yourself-note" style={{ marginTop: '1rem' }}>
              Want early access to upcoming features?{' '}
              <Link to="/contact">Contact us for beta access</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
