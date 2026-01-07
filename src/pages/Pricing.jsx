import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '../utils/i18n'
import SpotlightCard from '../components/SpotlightCard'
import { editions } from '../data/product'
import './Pricing.css'

const Pricing = React.memo(() => {
  const { t } = useTranslation()

  // Map editions to pricing plans with marketing-focused presentation
  const plans = editions.map(edition => {
    const isProduction = edition.status.includes('✅')
    const isFree = edition.price === 'Free'

    return {
      name: edition.title,
      badge: edition.badge,
      badgeClass: isProduction ? 'badge-available' : 'badge-development',
      price: isFree ? `${edition.price} forever` : `${edition.price} ${edition.priceDetail}`,
      description: edition.description,
      bestFor: getBestFor(edition.id),
      features: edition.features.slice(0, 6), // Top 6 features for pricing page
      cta: isFree ? 'Download Free' : isProduction ? 'Get Started' : 'Join Waitlist',
      link: isFree ? '/try-yourself' : '/contact',
      featured: edition.featured || false,
      availability: getAvailability(edition),
      editionLink: '/editions'
    }
  })

  function getBestFor(editionId) {
    const mapping = {
      'essential': 'Best for: Individual developers, CI/CD pipelines, and teams exploring SysML v2',
      'standard': 'Best for: Professional teams requiring advanced IDE capabilities',
      'platform': 'Best for: Enterprise teams requiring domain integrations and variability management',
      'platform-full': 'Best for: Development, testing, and users wanting maximum feature access'
    }
    return mapping[editionId] || 'Best for: Specialized workflows'
  }

  function getAvailability(edition) {
    if (edition.status.includes('✅')) {
      return edition.price === 'Free'
        ? 'Production ready. Download from VS Code Marketplace.'
        : 'Production ready. Contact for licensing.'
    }
    return edition.statusDetail || 'In development. Early access available.'
  }

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pricing-hero-content"
          >
            <h1>Pricing & Availability</h1>
            <p className="pricing-hero-subtitle">
              Honest, transparent pricing. Free tier is genuinely useful. No bait-and-switch. No lock-in.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pricing-plans-section">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              >
                {plan.badge && (
                  <div className={`pricing-badge ${plan.badgeClass}`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <div className="pricing-price">{plan.price}</div>
                {plan.bestFor && (
                  <p className="pricing-best-for">{plan.bestFor}</p>
                )}
                <p className="pricing-description">{plan.description}</p>

                {/* Availability status */}
                <div className="pricing-availability" style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  background: 'rgba(0, 180, 216, 0.1)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--brand-cyan)'
                }}>
                  {plan.availability}
                </div>

                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✅ {feature}</li>
                  ))}
                </ul>

                <div className="pricing-cta">
                  <Link to={plan.link} className="btn primary">
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Honest About Our Pricing */}
      <section className="pricing-honesty-section" style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What's Honest About Our Pricing</h2>
          </div>
          <div className="pricing-info-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard>
                <h3 style={{ color: 'var(--color-success)' }}>✅ What We Deliver</h3>
                <ul className="about-list">
                  <li>✅ Free tier is genuinely useful (full LSP)</li>
                  <li>✅ Open core = fork anytime (MIT license)</li>
                  <li>✅ Fair pricing for compliance features</li>
                  <li>✅ Clear about what's available vs in development</li>
                </ul>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SpotlightCard>
                <h3 style={{ color: 'var(--color-error)' }}>❌ What We Don't Offer (Yet)</h3>
                <ul className="about-list no-bullets">
                  <li>❌ 24/7 support (one-person team)</li>
                  <li>❌ SLA guarantees (early-stage product)</li>
                  <li>❌ Audit-certified toolchain (not validated)</li>
                  <li>❌ Production customer references</li>
                </ul>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pricing-info-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <h2>Pricing Details</h2>
            <p className="section-subtitle">
              Transparent pricing with no hidden fees. <Link to="/editions" style={{ color: 'var(--accent-primary)' }}>View full edition comparison →</Link>
            </p>
          </div>
          <div className="pricing-info-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3>Licensing Options</h3>
              <ul>
                <li><strong>Per-seat:</strong> Individual developer licenses</li>
                <li><strong>Team:</strong> Small team (5-20 users)</li>
                <li><strong>Organization:</strong> Unlimited users</li>
                <li><strong>Educational:</strong> Free for academic use</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3>Evaluation Terms</h3>
              <ul>
                <li>Essential: Free forever (open source)</li>
                <li>Standard: 30-day free trial (no credit card)</li>
                <li>Platform: 30-day free trial + pilot program</li>
                <li>Platform-Full: 30-day free trial + pilot program</li>
                <li>Custom pricing available for volume licensing</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Support</h3>
              <ul>
                <li><strong>Essential:</strong> Community (GitHub)</li>
                <li><strong>Standard:</strong> Email support (48h response)</li>
                <li><strong>Platform:</strong> Priority support (24h response)</li>
                <li><strong>Platform-Full:</strong> Priority support (24h response)</li>
                <li><strong>Enterprise:</strong> Dedicated support + training</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pricing-cta-section">
        <div className="container">
          <div className="pricing-cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Essential edition is free and production-ready. All commercial editions available with 30-day free trials.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/try-yourself" className="btn primary large">Try Free Version</Link>
              <Link to="/editions" className="btn ghost large">Compare Editions</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

Pricing.displayName = 'Pricing'

export default Pricing









