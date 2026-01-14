import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import SpotlightCard from '../../components/SpotlightCard'
import ProductCard from '../../components/product/ProductCard/ProductCard'
import { useTranslation } from '../../utils/i18n'
import { useTheme } from '../../contexts/ThemeContext'
import { products, getProductionReadyProducts, getPlannedProducts, getCoreProducts, getAdvancedProducts } from '../../data/product'
import '../Page.css'
import '../Product.css'

/**
 * Products Page - Product Tools & Features
 *
 * Shows WHAT NexSuite offers - individual tools and capabilities.
 * Displays 9 products: NexDocs, NexReq, NexTest, NexViz, NexAnalytics, NexTrade, NexVar, NexSim, NexSuite.
 */
const Products = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [filter, setFilter] = useState('all')

  const getFilteredProducts = () => {
    switch (filter) {
      case 'ready':
        return getProductionReadyProducts()
      case 'planned':
        return getPlannedProducts()
      case 'core':
        return getCoreProducts()
      case 'advanced':
        return getAdvancedProducts()
      default:
        return products
    }
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Overview', path: '/overview' },
          { label: 'Products' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="page-hero-section hero-products">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-hero-content"
          >
            <div className="hero-badge">Tools & Features</div>
            <h1>NexSuite Products</h1>
            <p className="page-hero-description">
              Comprehensive suite of tools for SysML v2 development, from documentation and requirements
              to testing, visualization, analytics, and simulation. Each tool integrates seamlessly
              for unified workflows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="page-content-section" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'primary' : 'ghost'}`}
              style={{ minWidth: '120px' }}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`btn ${filter === 'ready' ? 'primary' : 'ghost'}`}
              style={{ minWidth: '120px' }}
            >
              ✅ Ready ({getProductionReadyProducts().length})
            </button>
            <button
              onClick={() => setFilter('planned')}
              className={`btn ${filter === 'planned' ? 'primary' : 'ghost'}`}
              style={{ minWidth: '120px' }}
            >
              🟡 Planned ({getPlannedProducts().length})
            </button>
            <button
              onClick={() => setFilter('core')}
              className={`btn ${filter === 'core' ? 'primary' : 'ghost'}`}
              style={{ minWidth: '120px' }}
            >
              Core Tools ({getCoreProducts().length})
            </button>
            <button
              onClick={() => setFilter('advanced')}
              className={`btn ${filter === 'advanced' ? 'primary' : 'ghost'}`}
              style={{ minWidth: '120px' }}
            >
              Advanced ({getAdvancedProducts().length})
            </button>
          </div>
        </div>
      </section>

      {/* Product Cards Grid */}
      <section className="page-content-section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="product-variants-grid" style={{ gap: '2rem' }}>
            {filteredProducts
              .filter(product => product.id !== 'kraken')
              .map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            }
          </div>
        </div>
      </section>

      {/* KRAKEN Hub Dedicated Section */}
      <section className="page-section-alt" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="hero-badge" style={{ margin: '0 auto 1.5rem', background: 'var(--accent-secondary)' }}>Service Mesh</div>
            <h2>KRAKEN Hub</h2>
            <p className="section-subtitle">
              The high-performance digital backbone connecting SysML v2, requirements, simulation, and legacy tools.
            </p>
          </div>

          {products.filter(p => p.id === 'kraken').map((kraken) => (
            <div key={kraken.id} style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <SpotlightCard>
                <div className="product-detail-flex" style={{ display: 'flex', gap: '3rem', padding: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <img src={kraken.icon} alt="KRAKEN Hub" style={{ width: '80px', height: '80px' }} />
                      <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{kraken.title}</h3>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{kraken.subtitle}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                      {kraken.description}
                    </p>
                    <div className="features-highlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      {kraken.features.slice(0, 4).map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ color: 'var(--color-success)' }}>✓</span>
                          <span style={{ fontSize: '0.95rem' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: '0 0 350px', background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Deployment Models</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                      {kraken.components.map((comp, i) => (
                        <li key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          <strong>{comp.name}:</strong> {comp.description}
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <Link to={kraken.link} className="btn primary full-width" style={{ textAlign: 'center' }}>Launch KRAKEN Demo</Link>
                      <Link to="/contact" className="btn ghost full-width" style={{ textAlign: 'center' }}>Request Enterprise Version</Link>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Section */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Integrated Workflows</h2>
            <p className="section-subtitle">
              All NexSuite products work together seamlessly through the NexSuite integration layer
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <SpotlightCard>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
                <h3>NexSuite Integration Layer</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Unified workspace management, cross-product data sharing, and integrated workflows
                  ensure all tools work together as a cohesive system.
                </p>
                <ul style={{ textAlign: 'left', display: 'inline-block', marginBottom: '1.5rem' }}>
                  <li>Unified workspace management</li>
                  <li>Cross-product data sharing</li>
                  <li>Integrated workflows</li>
                  <li>Single sign-on (SSO)</li>
                  <li>Centralized configuration</li>
                  <li>Plugin architecture</li>
                </ul>
                <div>
                  <Link to="/products/nexsuite" className="btn primary">
                    Learn About Integration →
                  </Link>
                </div>
              </div>
            </SpotlightCard>
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
            <h2>Ready to Explore NexSuite?</h2>
            <p>Try our products today or contact our team for a personalized demo</p>
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

export default Products
