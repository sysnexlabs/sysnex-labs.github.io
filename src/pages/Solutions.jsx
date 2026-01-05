import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import SpotlightCard from '../components/SpotlightCard'
import StatsGrid from '../components/StatsGrid/StatsGrid'
import { useTheme } from '../contexts/ThemeContext'
import './Page.css'

/**
 * Solutions Page - Business Outcome Focused
 *
 * Organizes offerings by business need, similar to PTC's approach.
 * Shows how NexSuite solves specific business challenges.
 */
const Solutions = () => {
  const { theme } = useTheme()

  const solutions = [
    {
      id: 'migration',
      iconText: 'MIGRATE',
      iconColor: '#00bcd4',
      title: 'Accelerate SysML v2 Migration',
      tagline: 'Significantly reduce migration effort and accelerate time-to-value',
      challenge: 'Legacy SysML 1.x models locked in proprietary tools. High migration costs, vendor lock-in, uncertain ROI.',
      solution: [
        'NexDocs for automated documentation generation',
        'NexReq for requirements migration and traceability',
        'Git-native workflows for incremental migration',
        'AI-assisted model transformation and refactoring'
      ],
      outcome: {
        metric1: { value: 'High', label: 'Migration Velocity' },
        metric2: { value: '40%', label: 'Efficiency Gain (Pilot)' },
        metric3: { value: 'Fast', label: 'Time to Value' }
      },
      products: ['NexDocs', 'NexReq', 'NexSuite'],
      cta: {
        primary: { text: 'View Migration Guide', link: '/overview' },
        secondary: { text: 'Talk to Expert', link: '/contact' }
      }
    },
    {
      id: 'compliance',
      iconText: 'COMPLY',
      iconColor: '#4caf50',
      title: 'Achieve ISO 26262 Compliance',
      tagline: 'Automate compliance workflows and improve audit readiness',
      challenge: 'Manual work products, traceability gaps, expensive compliance consultants. Late-stage compliance issues delay releases.',
      solution: [
        'Automotive compliance variant with ISO 26262 templates',
        'ASPICE work product automation',
        'Automated traceability from requirements to implementation',
        'Safety analysis integration (ASIL decomposition)'
      ],
      outcome: {
        metric1: { value: 'High', label: 'Audit Readiness' },
        metric2: { value: '100%', label: 'Traceability Coverage' },
        metric3: { value: 'Rapid', label: 'Implementation' }
      },
      products: ['Automotive Compliance Edition', 'NexReq', 'NexTest'],
      cta: {
        primary: { text: 'View Compliance Variants', link: '/compliance' },
        secondary: { text: 'Schedule Demo', link: '/contact' }
      }
    },
    {
      id: 'scale',
      iconText: 'SCALE',
      iconColor: '#ff9800',
      title: 'Scale Engineering Teams',
      tagline: 'Improve collaboration by 50%, unify your toolchain',
      challenge: 'Disconnected tools, no collaboration, manual handoffs. Engineers waste time on tool integration instead of engineering.',
      solution: [
        'Git workflows for seamless collaboration (branching, merging, PR reviews)',
        'Team workspaces tailored to each role (7 user profiles)',
        'VS Code integration everyone already knows',
        'CI/CD pipelines for automated validation'
      ],
      outcome: {
        metric1: { value: 'High', label: 'Collaboration' },
        metric2: { value: 'Low', label: 'Context Switching' },
        metric3: { value: 'Fast', label: 'Onboarding' }
      },
      products: ['Platform Edition', 'Workspaces', 'CLI'],
      cta: {
        primary: { text: 'Explore Workspaces', link: '/workspaces' },
        secondary: { text: 'See Team Features', link: '/editions' }
      }
    },
    {
      id: 'cost',
      iconText: 'SAVE',
      iconColor: '#9c27b0',
      title: 'Reduce Tooling Costs',
      tagline: 'Save 60% vs legacy MBSE tools with transparent pricing',
      challenge: '$20K-$35K per seat for legacy tools. Mandatory support contracts, vendor lock-in, opaque pricing.',
      solution: [
        'Transparent tier-based pricing ($2.5K-$15K/seat/year)',
        'Free Essential edition for CI/CD and individual developers',
        '30-day free trials for all commercial editions',
        'No mandatory support contracts - flexible licensing'
      ],
      outcome: {
        metric1: { value: 'Significant', label: 'Cost Optimization' },
        metric2: { value: '$0', label: 'Essential Edition' },
        metric3: { value: 'Flexible', label: 'Licensing' }
      },
      products: ['Essential (Free)', 'Standard', 'Platform'],
      cta: {
        primary: { text: 'View Pricing', link: '/pricing' },
        secondary: { text: 'Calculate ROI', link: '/editions' }
      }
    }
  ]

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Solutions' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="page-hero-section hero-solutions">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-hero-content"
          >
            <div className="hero-badge">Business Outcomes</div>
            <h1>Solutions by Business Need</h1>
            <p className="page-hero-description">
              From SysML v2 migration to compliance automation, see how SysNex
              solves your specific business challenges with measurable outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="page-content-section section-py-2">
        <div className="container">
          <StatsGrid
            stats={[
              { number: 'High', label: 'Migration Velocity' },
              { number: '100%', label: 'Traceability' },
              { number: 'Git', label: 'Native Workflow' },
              { number: 'Open', label: 'Standard Based' }
            ]}
            maxWidth="900px"
          />
        </div>
      </section>

      {/* Solutions Grid */}
      {solutions.map((solution, index) => (
        <section
          key={solution.id}
          className={index % 2 === 0 ? "page-content-section" : "page-section-alt"}
          style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
        >
          <div className="container">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Solution Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    background: solution.iconColor,
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}>
                    {solution.iconText}
                  </div>
                  <h2 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
                    {solution.title}
                  </h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    {solution.tagline}
                  </p>
                </div>

                {/* Challenge - Solution - Outcome Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  {/* Challenge */}
                  <SpotlightCard>
                    <h3 style={{ marginBottom: '1rem', color: '#ff4444' }}>❌ Challenge</h3>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      {solution.challenge}
                    </p>
                  </SpotlightCard>

                  {/* Solution */}
                  <SpotlightCard>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>✅ Solution</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {solution.solution.map((item, i) => (
                        <li key={i} style={{
                          padding: '0.5rem 0',
                          borderBottom: i < solution.solution.length - 1 ? '1px solid var(--border-color)' : 'none',
                          fontSize: '0.95rem',
                          lineHeight: '1.5'
                        }}>
                          ✓ {item}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>

                  {/* Outcome */}
                  <SpotlightCard>
                    <h3 style={{ marginBottom: '1rem', color: '#3fb950' }}>📊 Outcome</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                          {solution.outcome.metric1.value}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {solution.outcome.metric1.label}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                          {solution.outcome.metric2.value}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {solution.outcome.metric2.label}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                          {solution.outcome.metric3.value}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {solution.outcome.metric3.label}
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Products & CTAs */}
                <div style={{
                  padding: '2rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: '2px solid var(--accent-primary)'
                }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Related Products:
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {solution.products.map((product, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-primary)',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to={solution.cta.primary.link} className="btn primary">
                      {solution.cta.primary.text}
                    </Link>
                    <Link to={solution.cta.secondary.link} className="btn ghost">
                      {solution.cta.secondary.text}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="page-content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cta-content"
          >
            <h2>Ready to Solve Your Business Challenge?</h2>
            <p>Schedule a consultation to discuss your specific needs and see how NexSuite can help</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn primary large">Schedule Consultation</Link>
              <Link to="/try-yourself" className="btn ghost large">Try Interactive Demo</Link>
            </div>
            <p className="cta-note">Free consultation. No obligation. 30-day trial available.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Solutions
