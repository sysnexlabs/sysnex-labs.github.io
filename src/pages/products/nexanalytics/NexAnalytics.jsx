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
 * NexAnalytics Product Detail Page
 *
 * Power BI-style analytics dashboard with quality metrics and coverage analysis.
 */
const NexAnalytics = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const product = getProductById('nexanalytics')

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
              <Link to="/try-nexanalytics" className="btn primary">
                Preview Demo (Coming Soon) →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Analytics Dashboard</h2>
            <p className="section-subtitle">
              Real-time project health and quality metrics
            </p>
          </div>

          <div style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
            <SpotlightCard>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Key Metrics at a Glance</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>85%</div>
                    <h4>Test Coverage</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Requirements verified by tests
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>92%</div>
                    <h4>Quality Score</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Overall model quality rating
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>12</div>
                    <h4>Active Issues</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Quality issues needing attention
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>24.5</div>
                    <h4>Complexity Avg</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Average model complexity score
                    </p>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Key Features</h2>
            <p className="section-subtitle">
              Comprehensive analytics for project visibility
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

      {/* Metric Categories */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Metric Categories</h2>
            <p className="section-subtitle">
              Track multiple dimensions of project health
            </p>
          </div>

          <div style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <SpotlightCard>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Quality Metrics</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Track model quality through automated checks: naming conventions, documentation completeness,
                    type safety, circular dependencies, and anti-patterns. Get actionable recommendations.
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Coverage Analytics</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Monitor test coverage, requirements verification coverage, and documentation coverage.
                    Identify untested requirements and undocumented elements at a glance.
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Complexity Analysis</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Measure structural complexity, behavioral complexity, and inheritance depth.
                    Identify overly complex components that may need refactoring.
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Trend Analysis</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Track metrics over time to identify trends. Are things improving or deteriorating?
                    Set goals and monitor progress toward quality targets.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Components Breakdown */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Components</h2>
            <p className="section-subtitle">
              NexAnalytics components for comprehensive reporting
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
              How NexAnalytics fits into your workflow
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
              NexAnalytics is available as part of the <strong>{product.badge} edition</strong>.
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
            <h2>Ready to Try NexAnalytics?</h2>
            <p>Get real-time insights into your project health and quality</p>
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

export default NexAnalytics
