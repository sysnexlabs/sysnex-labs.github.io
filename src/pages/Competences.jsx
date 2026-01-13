import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpotlightCard from '../components/SpotlightCard'
import { useTranslation } from '../utils/i18n'
import './Page.css'
import './Competences.css'

const Competences = () => {
  const { t } = useTranslation()

  const coreCompetences = [
    {
      icon: '/assets/role_architects.svg',
      title: t('competences.core.systems.title'),
      description: t('competences.core.systems.description'),
      areas: [
        t('competences.core.systems.area1'),
        t('competences.core.systems.area2'),
        t('competences.core.systems.area3'),
        t('competences.core.systems.area4')
      ]
    },
    {
      icon: '🔬',
      title: t('competences.core.modeling.title'),
      description: t('competences.core.modeling.description'),
      areas: [
        t('competences.core.modeling.area1'),
        t('competences.core.modeling.area2'),
        t('competences.core.modeling.area3'),
        t('competences.core.modeling.area4')
      ]
    },
    {
      icon: '/assets/misc_safety.svg',
      title: t('competences.core.safety.title'),
      description: t('competences.core.safety.description'),
      areas: [
        t('competences.core.safety.area1'),
        t('competences.core.safety.area2'),
        t('competences.core.safety.area3'),
        t('competences.core.safety.area4')
      ]
    },
    {
      icon: '/assets/capability_foundation.svg',
      title: t('competences.core.tooling.title'),
      description: t('competences.core.tooling.description'),
      areas: [
        t('competences.core.tooling.area1'),
        t('competences.core.tooling.area2'),
        t('competences.core.tooling.area3'),
        t('competences.core.tooling.area4')
      ]
    }
  ]

  const standards = [
    {
      name: 'ISO 15288',
      level: t('competences.standards.iso15288.level'),
      description: t('competences.standards.iso15288.description'),
      coverage: t('competences.standards.iso15288.coverage')
    },
    {
      name: 'ISO 26262',
      level: t('competences.standards.iso26262.level'),
      description: t('competences.standards.iso26262.description'),
      coverage: t('competences.standards.iso26262.coverage')
    },
    {
      name: 'ASPICE',
      level: t('competences.standards.aspice.level'),
      description: t('competences.standards.aspice.description'),
      coverage: t('competences.standards.aspice.coverage')
    },
    {
      name: 'SysML v2',
      level: t('competences.standards.sysmlv2.level'),
      description: t('competences.standards.sysmlv2.description'),
      coverage: t('competences.standards.sysmlv2.coverage')
    }
  ]

  const industries = [
    {
      icon: '/assets/industry_automotive.svg',
      title: t('competences.industries.automotive.title'),
      description: t('competences.industries.automotive.description'),
      expertise: [
        t('competences.industries.automotive.expertise1'),
        t('competences.industries.automotive.expertise2'),
        t('competences.industries.automotive.expertise3')
      ],
      futureAim: false
    },
    {
      icon: '/assets/industry_aerospace.svg',
      title: t('competences.industries.aerospace.title'),
      description: t('competences.industries.aerospace.description'),
      expertise: [
        t('competences.industries.aerospace.expertise1'),
        t('competences.industries.aerospace.expertise2'),
        t('competences.industries.aerospace.expertise3')
      ],
      futureAim: true
    },
    {
      icon: '/assets/industry_rail.svg',
      title: t('competences.industries.rail.title'),
      description: t('competences.industries.rail.description'),
      expertise: [
        t('competences.industries.rail.expertise1'),
        t('competences.industries.rail.expertise2'),
        t('competences.industries.rail.expertise3')
      ],
      futureAim: true
    },
    {
      icon: '/assets/feature_performance.svg',
      title: t('competences.industries.energy.title'),
      description: t('competences.industries.energy.description'),
      expertise: [
        t('competences.industries.energy.expertise1'),
        t('competences.industries.energy.expertise2'),
        t('competences.industries.energy.expertise3')
      ],
      futureAim: true
    }
  ]

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="page-hero-section hero-solutions">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="competences-hero-content"
          >
            <div className="hero-badge">Tool Capabilities, Not Consulting</div>
            <h1>What Our Tools Can Do</h1>
            <p className="page-hero-description">
              These are capabilities of our SysML v2 tooling, not claims about consulting expertise.
            </p>
            <div className="hero-cta">
              <Link to="/try-yourself" className="btn primary">Try the Tools</Link>
              <Link to="/product" className="btn ghost">See Product Tiers</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Competences Section */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Tool Capabilities</h2>
            <p className="section-subtitle">
              What our SysML v2 IDE can help you do (tool features, not consulting services):
            </p>
          </div>
          <div className="competences-grid">
            {coreCompetences.map((competence, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SpotlightCard className="competence-card">
                  <div className="competence-icon">
                    {typeof competence.icon === 'string' && competence.icon.startsWith('/assets/') ? (
                      <img
                        src={competence.icon}
                        alt={competence.title}
                        className="spotlight-icon-img"
                      />
                    ) : (
                      competence.icon
                    )}
                  </div>
                  <h3 className="competence-title">{competence.title}</h3>
                  <p className="competence-description">{competence.description}</p>
                  <ul className="competence-areas">
                    {competence.areas.map((area, idx) => (
                      <li key={idx}>{area}</li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Expertise Section */}
      <section className="page-section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Standards Awareness (Not Certification)</h2>
            <p className="section-subtitle">
              Our tools are designed with these standards in mind. We're not certified, just building tooling that helps:
            </p>
          </div>
          <div className="standards-grid">
            {standards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="standard-card"
              >
                <div className="standard-header">
                  <h3 className="standard-name">{standard.name}</h3>
                  <span className="standard-level">{standard.level}</span>
                </div>
                <p className="standard-description">{standard.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise Section */}
      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2>Target Industries (Aspirational)</h2>
            <p className="section-subtitle">
              Industries we're building for. Automotive has some validation, others are future aims:
            </p>
          </div>
          <div className="industries-grid">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SpotlightCard className="industry-card">
                  <div className="industry-icon">
                    {typeof industry.icon === 'string' && industry.icon.startsWith('/assets/') ? (
                      <img
                        src={industry.icon}
                        alt={industry.title}
                        style={{ height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain' }}
                      />
                    ) : (
                      industry.icon
                    )}
                  </div>
                  <div className="industry-header">
                    <h3 className="industry-title">{industry.title}</h3>
                    {industry.futureAim && (
                      <span className="industry-future-badge">
                        {t('competences.industries.future.badge')}
                      </span>
                    )}
                  </div>
                  <p className="industry-description">{industry.description}</p>
                  <ul className="industry-expertise">
                    {industry.expertise.map((item, idx) => (
                      <li key={idx}>✓ {item}</li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest Disclaimers Section */}
      <section className="page-section-alt" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We ARE vs What We're NOT</h2>
            <p className="section-subtitle">
              These "competences" are tool capabilities, not team expertise. Here's the distinction:
            </p>
          </div>
          <div className="methods-grid" style={{ marginTop: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard>
                <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>✅ What We ARE</h3>
                <ul className="method-list">
                  <li>✅ Building SysML v2 tools with standards awareness</li>
                  <li>✅ Researching industry needs to build better features</li>
                  <li>✅ Creating self-service tooling, not consulting packages</li>
                  <li>✅ Targeting automotive (some traction) + aspirational industries</li>
                  <li>✅ Solo founder with tool-building focus</li>
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
                <h3 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>❌ What We're NOT</h3>
                <ul className="method-list no-bullets">
                  <li>❌ Not a consulting firm with industry experts</li>
                  <li>❌ Not offering training or certification services</li>
                  <li>❌ Not claiming deep domain expertise in aerospace/rail/energy</li>
                  <li>❌ Not validated in production programs (yet)</li>
                  <li>❌ Not staffed with systems engineers—solo founder</li>
                </ul>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-section-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2>Want to Try the Tools?</h2>
            <p>See what our SysML v2 IDE can do for your systems engineering workflows.</p>
            <div className="cta-buttons">
              <Link to="/try-yourself" className="btn primary large">Try Yourself</Link>
              <Link to="/product" className="btn ghost large">See Product Tiers</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Competences

