import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import RoleBasedMessaging from '../components/RoleBasedMessaging'
import MissionCriticalIndustries from '../components/MissionCriticalIndustries'
import EnterpriseReadiness from '../components/EnterpriseReadiness'
import SpotlightCard from '../components/SpotlightCard'
import { useTranslation } from '../utils/i18n'
import styles from './Home.module.css'

const Home = () => {
  const location = useLocation()
  const { t } = useTranslation()

  // Scroll to top when navigating to home (including when already on home)
  useEffect(() => {
    if (location.state?.refresh) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.state])

  const insights = [
    {
      eyebrow: 'Enterprise Ready',
      title: 'Production-Grade LSP',
      description: 'Full-featured Language Server Protocol implementation with 90%+ test coverage and real-time diagnostics.',
      variant: 'primary'
    },
    {
      eyebrow: 'Model-Driven',
      title: 'Advanced Tooling',
      description: 'Comprehensive documentation generation, traceability matrices, and diagram visualization.',
      variant: 'secondary'
    },
    {
      eyebrow: 'Standards Compliant',
      title: 'ISO & ASPICE Ready',
      description: 'Built for automotive and aerospace with ISO 26262, ASPICE, and ISO 15288 support.',
      variant: 'accent'
    }
  ]

  return (
    <div className={styles.home}>
      <Hero />

      {/* New Platforms Section */}
      <section className={styles.platformsSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>One Language, Three Platforms</h2>
            <p className={styles.sectionSubtitle}>
              Seamless SysML v2 engineering wherever you work
            </p>
          </motion.div>

          <div className={styles.platformsGrid}>
            {[
              {
                title: 'VS Code Extension',
                status: 'Available Now',
                statusClass: 'statusAvailable',
                icon: '/assets/platform_vscode.svg',
                description: 'The industry-standard editor integration. Native performance with <50ms latency.',
                features: ['Full LSP Support', 'Syntax Highlighting', 'Git Integration']
              },
              {
                title: 'CodeFlow Desktop',
                status: 'Production Ready',
                statusClass: 'statusAvailable',
                icon: '/assets/capability_desktop.svg',
                description: 'Standalone Tauri-based application. No VS Code required. Optimized for large models.',
                features: ['Standalone App', 'Offline First', 'Multi-Window']
              },
              {
                title: 'CodeFlow Cloud',
                status: 'Coming Q2 2026',
                statusClass: 'statusComing',
                icon: '/assets/platform_cloud.svg',
                description: 'Zero-install browser experience. Collaborative modeling and reviewing in real-time.',
                features: ['Zero Install', 'Collaboration', 'Cloud Storage']
              }
            ].map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={styles.platformCard}
              >
                <span className={`${styles.platformStatus} ${styles[platform.statusClass]}`}>
                  {platform.status}
                </span>
                <div className={styles.platformIcon}>
                  <img
                    src={platform.icon}
                    alt={platform.title}
                    style={{height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain'}}
                  />
                </div>
                <h3 className={styles.platformTitle}>{platform.title}</h3>
                <p className={styles.platformDescription}>{platform.description}</p>
                <div className={styles.platformMeta}>
                  {platform.features.map((feat, i) => (
                    <div key={i} className={styles.metaItem}>
                      <span style={{ color: 'var(--brand-cyan)' }}>✓</span> {feat}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section with Screenshots */}
      <section className={styles.productShowcaseSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>See NexDocs in Action</h2>
            <p className={styles.sectionSubtitle}>
              Professional documentation generation, model analytics, and quality assessment built-in
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {[
              {
                image: './assets/nexdoc_documentation.png',
                title: 'Auto-Generated Documentation',
                description: 'Transform SysML v2 models into professional documentation automatically. Search, navigate, and export with one click.',
                badge: 'Core Feature'
              },
              {
                image: './assets/nexdoc_analytics.png',
                title: 'Model Analytics Dashboard',
                description: 'Real-time quality scoring, complexity metrics, and actionable insights. Track model health with production-grade analytics.',
                badge: 'Analytics'
              },
              {
                image: './assets/nexdoc_stats.png',
                title: 'Quality Assessment',
                description: 'Comprehensive model statistics, documentation coverage tracking, and element type breakdown for compliance workflows.',
                badge: 'Compliance'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.4rem 0.8rem',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }}>
                      {feature.badge}
                    </div>
                  </div>

                  <div style={{
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    border: '2px solid var(--border-color)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                  </div>

                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: 'var(--accent-primary)' }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)'
                  }}>
                    {feature.description}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ textAlign: 'center', marginTop: '3rem' }}
          >
            <Link to="/products/nexdocs" className="btn primary large">
              Explore NexDocs Features
            </Link>
            <Link to="/try-yourself" className="btn ghost large" style={{ marginLeft: '1rem' }}>
              Try Interactive Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Role-Based Messaging Section */}
      <RoleBasedMessaging />

      {/* Mission-Critical Industries Section */}
      <MissionCriticalIndustries />

      {/* Enterprise Readiness Section */}
      <EnterpriseReadiness />

      <section className={styles.insightsSection}>
        <div className={styles.container}>
          <div className={styles.insightsGrid}>
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard className={`insight-card insight-card--${insight.variant}`}>
                  <span className="insight-eyebrow">{insight.eyebrow}</span>
                  <h3 className="insight-title">{insight.title}</h3>
                  <p className="insight-description">{insight.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Navigation - Refined for Personas */}
      <section className={styles.roleNavigationSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Find Your Path</h2>
            <p className={styles.sectionSubtitle}>
              Tailored workflows for your specific role
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {[
              {
                badge: 'CODE-FIRST',
                badgeColor: '#00bcd4',
                icon: '/assets/role_developer.svg',
                role: 'Code-First Users',
                description: 'Developers and engineers who prefer text-based editing and native code workflows.',
                features: ['Autocompletion & Go-to-Definition', 'Rename Symbol & Code Actions', 'Git Integration & Formatting'],
                link: '/overview',
                linkText: 'Explore Developer Tools'
              },
              {
                badge: 'OFFICE-STYLE',
                badgeColor: '#ff9800',
                icon: '/assets/role_executive.svg',
                role: 'Office-Style Users',
                description: 'Business analysts and stakeholders who prefer documentation and visual presentations.',
                features: ['Documentation Viewer & Editing', 'Requirements Manager', 'Traceability Matrix & Reports'],
                link: '/products/nexdocs',
                linkText: 'See Documentation Features'
              },
              {
                badge: 'VISUAL MODELER',
                badgeColor: '#9c27b0',
                icon: '/assets/role_architects.svg',
                role: 'Visual Modelers',
                description: 'Systems architects who prefer graphical editing and diagram-first workflows.',
                features: ['Diagram Editor & Viewer', 'Visual Relationship Creation', 'ELK.js Auto-Layout'],
                link: '/contact',
                linkText: 'Request Early Access'
              },
              {
                badge: 'COMPLIANCE',
                badgeColor: '#f44336',
                icon: '/assets/feature_compliance.svg',
                role: 'Compliance & Audit',
                description: 'Quality engineers and compliance officers who need standards compliance and audit trails.',
                features: ['ASPICE Work Products', 'ISO 26262 Validation', 'Traceability & Audit Trails'],
                link: '/compliance',
                linkText: 'Explore Compliance'
              },
              {
                badge: 'ANALYSIS',
                badgeColor: '#4caf50',
                icon: '/assets/feature_analytics.svg',
                role: 'Analysis & Simulation',
                description: 'Systems analysts and simulation engineers who need model analysis and execution.',
                features: ['Model Analytics & Metrics', 'Constraint System (OCL 2.5)', 'Trade Study Analysis'],
                link: '/products/nexanalytics',
                linkText: 'See Analytics Features'
              },
              {
                badge: 'DOCUMENTATION',
                badgeColor: '#2196f3',
                icon: '/assets/icon_nexdocs.svg',
                role: 'Documentation-Focused',
                description: 'Technical writers and documentation specialists focused on generation and formatting.',
                features: ['Documentation Generation', 'PDF/HTML/Markdown Export', 'MkDocs & Sphinx Integration'],
                link: '/products/nexdocs',
                linkText: 'Explore Documentation'
              },
              {
                badge: 'COLLABORATIVE',
                badgeColor: '#607d8b',
                icon: '/assets/role_toolchain.svg',
                role: 'Collaborative Teams',
                description: 'Team leads and project managers who need multi-user workflows and version control.',
                features: ['Git Integration & Code Review', 'Multi-User Support', 'Traceability & Requirements'],
                link: '/overview',
                linkText: 'Explore Collaboration'
              }
            ].map((roleCard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <div className={styles.personaCard}>
                    <div className={styles.personaHeader}>
                      <span className={styles.personaBadge} style={{ backgroundColor: roleCard.badgeColor }}>
                        {roleCard.badge}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                      <img
                        src={roleCard.icon}
                        alt={roleCard.role}
                        style={{height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain'}}
                      />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', textAlign: 'center', color: 'var(--accent-primary)' }}>
                      {roleCard.role}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1rem' }}>
                      {roleCard.description}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', flex: 1 }}>
                      {roleCard.features.map((feature, i) => (
                        <li key={i} style={{ fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: i < roleCard.features.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                          ✓ {feature}
                        </li>
                      ))}
                    </ul>
                    <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                      <Link to={roleCard.link} className="btn ghost" style={{ width: '100%', fontSize: '0.9rem' }}>
                        {roleCard.linkText} →
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className={styles.integrationsSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>{t('home.integrations.heading')}</h2>
            <p className={styles.sectionSubtitle}>
              {t('home.integrations.subtitle')}
            </p>
          </motion.div>
          <div className={styles.integrationsGrid}>
            {[
              {
                name: t('home.integrations.vscode.name'),
                description: t('home.integrations.vscode.description'),
                iconText: 'VS',
                iconColor: '#00bcd4',
                badge: 'Native'
              },
              {
                name: 'Tauri Desktop',
                description: 'Native desktop application for macOS, Windows, and Linux.',
                iconText: 'DT',
                iconColor: '#ff9800',
                badge: 'Production'
              },
              {
                name: 'Web Assembly',
                description: 'Run SysML v2 directly in the browser with zero installation.',
                iconText: 'WA',
                iconColor: '#9c27b0',
                badge: 'Experimental'
              },
              {
                name: t('home.integrations.copilot.name'),
                description: t('home.integrations.copilot.description'),
                iconText: 'AI',
                iconColor: '#4caf50',
                badge: 'AI-First'
              }
            ].map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <div className={styles.integrationHeader}>
                    <div className={styles.integrationIcon} style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: integration.iconColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      letterSpacing: '-0.5px'
                    }}>
                      {integration.iconText}
                    </div>
                    <span className={styles.integrationBadge}>{integration.badge}</span>
                  </div>
                  <h3 className={styles.integrationName}>{integration.name}</h3>
                  <p className={styles.integrationDescription}>{integration.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* External Validation Section */}
      <section className={styles.externalValidationSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>{t('home.socialproof.heading')}</h2>
            <p className={styles.sectionSubtitle}>
              {t('home.socialproof.subtitle')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.validationContent}
          >
            <div className={styles.validationItem}>
              <div className={styles.validationLabel}>Research Partnership</div>
              <div className={styles.validationText}>
                Validated in pilot programs with research institutions. Infrastructure verified for production use.
              </div>
            </div>
            <div className={styles.validationItem}>
              <div className={styles.validationLabel}>Industry Validation</div>
              <div className={styles.validationText}>
                German automotive OEM programs evaluating infrastructure for ISO 26262 and ASPICE compliance workflows.
              </div>
            </div>
            <div className={styles.validationItem}>
              <div className={styles.validationLabel}>Milestone-Based Updates</div>
              <div className={styles.validationText}>
                Progress published as validation milestones are reached. No marketing claims without evidence.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className={styles.transparencySection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Radical Transparency</h2>
            <p className={styles.sectionSubtitle}>
              We believe in honest engineering without the marketing fluff.
            </p>
          </motion.div>

          <div className={styles.transparencyGrid}>
            <div className={styles.transparencyCol}>
              <h3><span style={{ color: 'var(--color-success)' }}>✓</span> What We Are</h3>
              <ul className={styles.transparencyList}>
                <li className={styles.transparencyItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <strong>Production-Ready Core:</strong> The language server is fast, stable, and extensively tested (90%+ coverage).
                  </div>
                </li>
                <li className={styles.transparencyItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <strong>Open Standards First:</strong> We are 100% committed to SysML v2. No vendor lock-in specific to our tool.
                  </div>
                </li>
                <li className={styles.transparencyItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <strong>Builder-Led:</strong> Built by systems engineers who code, for systems engineers who want to code.
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.transparencyCol}>
              <h3><span style={{ color: 'var(--color-error)' }}>✕</span> What We Are Not (Yet)</h3>
              <ul className={styles.transparencyList}>
                <li className={styles.transparencyItem}>
                  <div className={styles.crossIcon}>✕</div>
                  <div>
                    <strong>Legacy Tool Replacement:</strong> We are not trying to replace Rhapsody or Cameo overnight. We are the future, they are the past.
                  </div>
                </li>
                <li className={styles.transparencyItem}>
                  <div className={styles.crossIcon}>✕</div>
                  <div>
                    <strong>Safety Certified:</strong> The tool itself is not yet certified for ISO 26262/DO-178C (though it helps YOU create certified designs).
                  </div>
                </li>
                <li className={styles.transparencyItem}>
                  <div className={styles.crossIcon}>✕</div>
                  <div>
                    <strong>A 100-Person Corp:</strong> We are a lean team of experts moving fast. expect updates daily, not quarterly.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.builderNote}>
            <div className={styles.builderAvatar}>
              {/* Placeholder for founder avatar */}
              <img src="./assets/founder.jpg" alt="Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
            </div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              "We're building the tools I used to wish existed when I was a Lead Systems Architect. No fluff, just raw power and precision."
            </p>
            <p style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
              — Founder, SysNex
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Trusted by Engineering Teams</h2>
            <p className={styles.sectionSubtitle}>
              Real results from pilot programs and early adopters
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {[
              {
                quote: "NexDocs reduced our documentation generation time by 60%. What used to take days now happens automatically with each commit.",
                author: "Engineering Manager",
                company: "German Automotive OEM",
                metric: "60% faster documentation"
              },
              {
                quote: "The VS Code integration means zero learning curve. Our team was productive on day one with familiar Git workflows.",
                author: "Lead Systems Engineer",
                company: "Aerospace Research Partner",
                metric: "Zero onboarding time"
              },
              {
                quote: "Having a production-ready LSP with real-time diagnostics transformed our modeling workflow. The autocomplete is incredibly fast.",
                author: "Senior MBSE Specialist",
                company: "European Automotive Tier 1",
                metric: "<50ms autocomplete"
              },
              {
                quote: "Transparent pricing and flexible licensing made the business case easy. We're saving 60% compared to legacy MBSE tools.",
                author: "Engineering Director",
                company: "Mission-Critical Systems",
                metric: "60% cost savings"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>"</div>
                    <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                      {testimonial.quote}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {testimonial.author}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {testimonial.company}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.4rem 0.8rem',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {testimonial.metric}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginTop: '4rem', textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Validated in Pilot Programs
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              opacity: 0.7
            }}>
              {[
                'German Automotive OEM',
                'Aerospace Research Partner',
                'European Tier 1 Supplier',
                'Mission-Critical Systems'
              ].map((partner, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem 2rem',
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {partner}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Infrastructure verified for production use. Progress published as validation milestones are reached.
            </p>
          </motion.div>
        </div>
      </section> */}

      <section className={styles.ctaSectionHome}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>{t('home.cta.heading')}</h2>
            <p>{t('home.cta.subtitle')}</p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className="btn primary large">Schedule Consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
