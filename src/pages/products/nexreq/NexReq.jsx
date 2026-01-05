import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb'
import StatusBadge from '../../../components/product/StatusBadge/StatusBadge'
import SpotlightCard from '../../../components/SpotlightCard'
import { useTranslation } from '../../../utils/i18n'
import { useTheme } from '../../../contexts/ThemeContext'
import { getProductById } from '../../../data/product'
import '../../Page.css'
import '../../Product.css'

/**
 * NexReq Product Detail Page
 *
 * Comprehensive requirements management with bidirectional traceability.
 */
const NexReq = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const product = getProductById('nexreq')

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Overview', path: '/overview' },
          { label: 'Products', path: '/products' },
          { label: product.title }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="page-hero-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-hero-content"
          >
            <div style={{ marginBottom: '1rem' }}>
              {typeof product.icon === 'string' && product.icon.startsWith('/assets/') ? (
                <img
                  src={product.icon}
                  alt={product.title}
                  style={{height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain'}}
                />
              ) : (
                <div style={{ fontSize: '4rem' }}>{product.icon}</div>
              )}
            </div>
            <div className="hero-badge">{product.badge} Edition</div>
            <h1>{product.title}</h1>
            <p className="product-subtitle">{product.subtitle}</p>
            <StatusBadge status={product.status} />
            <p className="page-hero-description" style={{ marginTop: '1.5rem' }}>
              {product.description}
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/try-nexreq" className="btn primary">
                Try Interactive Demo →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Key Features</h2>
            <p className="section-subtitle">
              Complete requirements lifecycle management
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {product.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Components Breakdown */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Components</h2>
            <p className="section-subtitle">
              NexReq includes specialized components for requirements management
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0' }}>
            {product.components.map((component, index) => (
              <SpotlightCard key={index}>
                <div style={{ padding: '2rem' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}>
                    {component.edition}
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{component.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {component.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Traceability Section */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Bidirectional Traceability</h2>
            <p className="section-subtitle">
              Track requirements from stakeholder needs to implementation and verification
            </p>
          </div>

          <div style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
            <SpotlightCard>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Requirements Lifecycle</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                    <h4>Stakeholder Needs</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Capture and manage stakeholder requirements
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                    <h4>System Requirements</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Decompose into system-level requirements
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
                    <h4>Implementation</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Trace to design and implementation elements
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    <h4>Verification</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Link to test cases and verification results
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                  <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Full Traceability Matrix</p>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    NexReq automatically generates traceability matrices showing relationships between
                    all requirement types. Track upstream (allocations) and downstream (derivations) in real-time.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Use Cases</h2>
            <p className="section-subtitle">
              How NexReq fits into your workflow
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem', maxWidth: '900px', margin: '2rem auto 0' }}>
            {product.useCases.map((useCase, index) => (
              <div
                key={index}
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📌</div>
                <p style={{ fontWeight: '500' }}>{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASIL Support */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Safety Requirements (ASIL)</h2>
            <p className="section-subtitle">
              Full support for automotive safety standards (ISO 26262)
            </p>
          </div>

          <div style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
            <SpotlightCard>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>ASIL Decomposition & Tracking</h3>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>ASIL Level Management</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Assign and track ASIL levels (QM, A, B, C, D) for all safety requirements.
                    Automatic validation ensures decomposition rules are followed.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Decomposition Rules</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Built-in validation for ASIL decomposition rules (e.g., ASIL D = ASIL B(B) + ASIL B(B)).
                    Automatic checks prevent invalid decompositions.
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Safety Case Generation</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Generate safety case documentation showing requirements allocation, decomposition,
                    and verification for ISO 26262 compliance.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Pricing & Availability */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Pricing & Availability</h2>
            <p className="section-subtitle">
              {product.pricing}
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              NexReq is available as part of the <strong>{product.badge} edition</strong>.
              ASIL validation requires the Automotive compliance variant.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/editions" className="btn primary large">
                View Editions →
              </Link>
              <Link to="/compliance" className="btn ghost large">
                View Compliance Variants
              </Link>
            </div>
          </div>
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
            <h2>Ready to Try NexReq?</h2>
            <p>Experience comprehensive requirements management with full traceability</p>
            <div className="cta-buttons">
              <Link to="/try-yourself" className="btn primary large">Try Interactive Demo</Link>
              <Link to="/contact" className="btn ghost large">Contact Sales</Link>
            </div>
            <p className="cta-note">Start with a 30-day free trial. No credit card required.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default NexReq
