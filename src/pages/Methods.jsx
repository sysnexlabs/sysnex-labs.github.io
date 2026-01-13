import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpotlightCard from '../components/SpotlightCard'
import { useTranslation } from '../utils/i18n'
import './Page.css'

const Methods = () => {
  const { t } = useTranslation()
  const highlights = [
    {
      title: 'Requirements to Architecture (BETA)',
      description: 'Tool feature: Import requirements from CSV/YAML/DOORS, generate SysML v2 requirement elements, auto-create traceability links. Prototype working, needs UX polish.'
    },
    {
      title: 'Git-Native Workflows (PRODUCTION)',
      description: 'Your models are plain text SysML v2. Commit, branch, merge, rebase - all the workflows you know. Line-by-line diffs in pull requests.'
    },
    {
      title: 'AI Pair Programming (PRODUCTION)',
      description: 'Works with GitHub Copilot, Claude Code, and VS Code AI. Autocomplete SysML patterns, refactor models, generate documentation with AI assistance.'
    },
    {
      title: 'Documentation Generation (BETA)',
      description: 'Tool feature: Auto-generate MkDocs/Sphinx documentation from model structure. Export traceability matrices. Beta testers refining templates.'
    },
    {
      title: 'ASPICE Work Products (ALPHA)',
      description: 'Tool feature: Parse SysML v2 models, extract SYS.2/SYS.3 work products, generate Word/PDF docs. 8/20 templates implemented, not audit-tested yet.'
    },
    {
      title: 'ISO 26262 ASIL Validation (EXPERIMENTAL)',
      description: 'Tool feature: Parse ASIL annotations in constraints, validate decomposition rules, flag inconsistencies. Works on toy examples, not production-tested.'
    }
  ]

  const approaches = [
    {
      title: 'Requirements Traceability',
      status: 'In Progress',
      description: 'Scope: Import requirements from external sources (CSV, YAML, DOORS), generate SysML v2 requirement elements, create automated traceability links, and export traceability matrices for documentation.',
      items: [
        'CSV/YAML requirements import',
        'DOORS integration for enterprise tools',
        'Automated traceability link generation',
        'Matrix export to MkDocs/Sphinx/Excel'
      ]
    },
    {
      title: 'ASPICE Work Product Automation',
      status: 'In Progress',
      description: 'Scope: Extract ASPICE-compliant work products from SysML v2 models covering SYS.2 (requirements), SYS.3 (architecture), and SYS.4 (integration) process areas. Generate audit-ready documentation.',
      items: [
        'System Requirements Specification (SYS.2)',
        'System Architecture Design (SYS.3)',
        'Interface and Integration specs (SYS.2/SYS.4)',
        'Verification and validation documentation',
        'Process evidence generation for audits'
      ]
    },
    {
      title: 'ISO 26262 Safety Validation',
      status: 'Planned',
      description: 'Scope: Validate ISO 26262 functional safety requirements through ASIL decomposition analysis, constraint validation, and safety case generation. Not certified for production use.',
      items: [
        'ASIL annotation parsing and validation',
        'Decomposition rule checking (D=D+D, etc.)',
        'Safety constraint validation',
        'FMEA and fault tree integration',
        'Safety case documentation generation'
      ]
    },
    {
      title: 'Documentation Generation',
      status: 'In Progress',
      description: 'Scope: Auto-generate technical documentation from SysML v2 models in multiple formats (MkDocs, Sphinx, PDF). Includes diagrams, traceability matrices, and customizable templates.',
      items: [
        'MkDocs/Sphinx export formats',
        'Automated diagram generation',
        'Customizable documentation templates',
        'Multi-format output (HTML, PDF, Markdown)',
        'Cross-reference and index generation'
      ]
    },
    {
      title: 'Git-Native Workflows',
      status: 'Production Ready',
      description: 'Scope: Full integration with standard Git workflows for version control, collaboration, and CI/CD. Models are plain text SysML v2 files that work seamlessly with existing developer tools.',
      items: [
        'Line-by-line diffs in pull requests',
        'Branch-based model development',
        'Merge conflict resolution in editors',
        'CI/CD integration (linting, validation, tests)',
        'GitHub/GitLab/Bitbucket compatibility'
      ]
    }
  ]

  return (
    <div className="page">
      <section className="page-hero-section">
        <div className="container">
          <div className="page-header-image">
            <img src="./assets/vmodel_diagram.svg" alt="V-Model with Git-Based SysML v2 Integration" className="header-image" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{t('methods.title')}</h1>
            <p className="page-hero-description">
              {t('methods.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('methods.highlights.heading')}</h2>
          </div>
          <div className="features-grid">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <h3 className="card-title">{highlight.title}</h3>
                  <p className="card-description">{highlight.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('methods.core.heading')}</h2>
          </div>
          <div className="methods-grid">
            {approaches.map((approach, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 className="card-title" style={{ margin: 0 }}>{approach.title}</h3>
                    {approach.status && (
                      <span className={`status-badge ${approach.status === 'Production Ready' ? 'badge-available' :
                        approach.status === 'In Progress' ? 'badge-beta' :
                          'badge-development'
                        }`} style={{ margin: 0, fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                        {approach.status}
                      </span>
                    )}
                  </div>
                  <p className="card-description">{approach.description}</p>
                  <ul className="method-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {approach.items.map((item, itemIndex) => (
                      <li key={itemIndex} style={{ paddingLeft: 0 }}>{item}</li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('methods.implementation.heading')}</h2>
            <p className="section-subtitle">{t('methods.implementation.intro')}</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3 className="benefit-title">{t('methods.implementation.item1.lead')}</h3>
              <p className="benefit-description">{t('methods.implementation.item1.body')}</p>
            </div>
            <div className="benefit-item">
              <h3 className="benefit-title">{t('methods.implementation.item2.lead')}</h3>
              <p className="benefit-description">{t('methods.implementation.item2.body')}</p>
            </div>
            <div className="benefit-item">
              <h3 className="benefit-title">{t('methods.implementation.item3.lead')}</h3>
              <p className="benefit-description">{t('methods.implementation.item3.body')}</p>
            </div>
            <div className="benefit-item">
              <h3 className="benefit-title">{t('methods.implementation.item4.lead')}</h3>
              <p className="benefit-description">{t('methods.implementation.item4.body')}</p>
            </div>
            <div className="benefit-item">
              <h3 className="benefit-title">{t('methods.implementation.item5.lead')}</h3>
              <p className="benefit-description">{t('methods.implementation.item5.body')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Disclaimers Section */}
      <section className="page-section-alt" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We're NOT Claiming</h2>
            <p className="section-subtitle">
              These workflows are experiments becoming products. Early adopters help us test and refine them.
            </p>
          </div>
          <div className="pricing-info-grid" style={{ marginTop: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard>
                <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>✅ What These ARE</h3>
                <ul className="about-list">
                  <li>✅ Tool features we're actively building</li>
                  <li>✅ Workflows tested on internal projects</li>
                  <li>✅ Beta programs open for early adopters</li>
                  <li>✅ Transparent development roadmap</li>
                  <li>✅ Open source core (fork and extend anytime)</li>
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
                <h3 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>❌ NOT Validated</h3>
                <ul className="about-list no-bullets">
                  <li>❌ Not proven in production automotive programs</li>
                  <li>❌ Not validated in ASPICE audits</li>
                  <li>❌ Not certified by TÜV or ISO authorities</li>
                  <li>❌ Not offering consulting services (tool only)</li>
                  <li>❌ Not claiming industry-wide ROI data</li>
                </ul>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-section-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>Want to Help Shape These Workflows?</h2>
            <p>
              Join our early adopter program and get free 6-month access to all beta features.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn primary large">Apply for Beta</Link>
              <Link to="/product" className="btn ghost large">See Product Tiers</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div >
  )
}

export default Methods
