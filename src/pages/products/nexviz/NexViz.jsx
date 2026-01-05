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
 * NexViz Product Detail Page
 *
 * Interactive diagram generation and visualization with bidirectional synchronization.
 */
const NexViz = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const product = getProductById('nexviz')

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
              <Link to="/try-nexviz" className="btn primary">
                Preview Demo (Coming Soon) →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diagram Types */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Supported Diagram Types</h2>
            <p className="section-subtitle">
              Generate all standard SysML v2 diagrams with a single click
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Block Definition</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                BDD (Block Definition Diagrams) showing structural relationships
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Internal Block</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                IBD (Internal Block Diagrams) showing internal structure
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Activity</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Activity diagrams showing behavior and workflows
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <h4 style={{ marginBottom: '0.5rem' }}>State Machine</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                State machine diagrams for system behavior modeling
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Requirement</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Requirement diagrams showing relationships and allocations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Key Features</h2>
            <p className="section-subtitle">
              Advanced visualization capabilities for SysML v2
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
                  background: 'var(--bg-primary)',
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

      {/* Bidirectional Sync */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Bidirectional Synchronization</h2>
            <p className="section-subtitle">
              Edit diagrams OR code - changes sync automatically
            </p>
          </div>

          <div style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
            <SpotlightCard>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>True Diagram-Code Sync</h3>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Code → Diagram</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Edit your SysML v2 code and watch diagrams update in real-time. NexViz automatically
                    regenerates diagrams whenever you save your changes.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Diagram → Code</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Edit diagrams visually using the interactive editor. Changes are immediately
                    reflected in your SysML v2 code with proper formatting and comments preserved.
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Always In Sync</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Unlike traditional tools where diagrams become outdated, NexViz ensures your
                    diagrams and code always match perfectly. No more manual synchronization.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Components Breakdown */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Components</h2>
            <p className="section-subtitle">
              NexViz components for different use cases
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

      {/* Use Cases */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Use Cases</h2>
            <p className="section-subtitle">
              How NexViz fits into your workflow
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
              NexViz is available in the <strong>{product.badge} edition</strong>.
              Basic rendering is free, interactive editing requires Platform edition.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/editions" className="btn primary large">
                View Editions →
              </Link>
              <Link to="/pricing" className="btn ghost large">
                See Pricing
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
            <h2>Ready to Try NexViz?</h2>
            <p>Experience interactive SysML v2 visualization with bidirectional sync</p>
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

export default NexViz
