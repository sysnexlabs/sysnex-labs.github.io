import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import PlatformCard from '../../components/product/PlatformCard/PlatformCard'
import ComparisonTable from '../../components/product/ComparisonTable/ComparisonTable'
import { useTranslation } from '../../utils/i18n'
import { useTheme } from '../../contexts/ThemeContext'
import { platformVariants } from '../../data/product'
import '../Page.css'
import '../Product.css'

/**
 * Platforms Page - Platform Delivery Models
 *
 * Shows HOW users can get/deploy NexSuite across different platforms.
 * Displays VS Code Extension, Desktop App, Cloud/SaaS, CLI & CI/CD options.
 */
const Platforms = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const comparisonRows = [
    {
      label: 'LSP Features',
      getValue: (variant) => variant.features.some(f => f.includes('LSP')) ? '✅' : '➖'
    },
    {
      label: 'Offline Mode',
      getValue: (variant) => variant.title.includes('Cloud') ? '❌' : '✅'
    },
    {
      label: 'Real-time Collaboration',
      getValue: (variant) => variant.features.some(f => f.toLowerCase().includes('collaboration') || f.toLowerCase().includes('cloud')) ? '✅' : '➖'
    },
    {
      label: 'CI/CD Integration',
      getValue: (variant) => variant.features.some(f => f.toLowerCase().includes('ci/cd') || f.toLowerCase().includes('automation')) ? '✅' : '➖'
    },
    {
      label: 'Status',
      getValue: (variant) => variant.status
    }
  ]

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Overview', path: '/overview' },
          { label: 'Platforms' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="page-hero-section hero-platforms">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-hero-content"
          >
            <div className="hero-badge">Delivery Models</div>
            <h1>Choose Your Platform</h1>
            <p className="page-hero-description">
              NexSuite is available across multiple platforms to fit your team's workflow.
              From VS Code extensions (Standard API) to enterprise cloud deployments and CI/CD integration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Cards Grid */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Available Platforms</h2>
            <p className="section-subtitle">
              Select the deployment model that works best for your team
            </p>
          </div>

          <div className="product-variants-grid" style={{ gap: '2rem' }}>
            {platformVariants.map((variant, index) => (
              <PlatformCard key={index} variant={variant} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Platform Comparison</h2>
            <p className="section-subtitle">
              Compare features across all deployment models
            </p>
          </div>

          <ComparisonTable
            items={platformVariants}
            rows={comparisonRows}
          />
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
            <h2>Ready to Get Started?</h2>
            <p>Choose your preferred platform and start using NexSuite today</p>
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

export default Platforms
