import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpotlightCard from '../components/SpotlightCard'
import { useTranslation } from '../utils/i18n'
import './Page.css'

const Tools = () => {
  const { t } = useTranslation()
  const highlights = [
    {
      icon: '/assets/misc_deployment.svg',
      title: t('tools.highlights.item1.title'),
      description: t('tools.highlights.item1.description')
    },
    {
      icon: '/assets/feature_ai_first.svg',
      title: t('tools.highlights.item2.title'),
      description: t('tools.highlights.item2.description')
    },
    {
      icon: '📦',
      title: t('tools.highlights.item3.title'),
      description: t('tools.highlights.item3.description')
    },
    {
      icon: '🔗',
      title: t('tools.highlights.item4.title'),
      description: t('tools.highlights.item4.description')
    },
    {
      icon: '/assets/feature_performance.svg',
      title: t('tools.highlights.item5.title'),
      description: t('tools.highlights.item5.description')
    },
    {
      icon: '🎯',
      title: t('tools.highlights.item6.title'),
      description: t('tools.highlights.item6.description')
    }
  ]

  const features = [
    {
      title: t('tools.features.item1.title'),
      description: t('tools.features.item1.description'),
      items: [
        t('tools.features.item1.item1'),
        t('tools.features.item1.item2'),
        t('tools.features.item1.item3'),
        t('tools.features.item1.item4'),
        t('tools.features.item1.item5')
      ]
    },
    {
      title: t('tools.features.item2.title'),
      description: t('tools.features.item2.description'),
      items: [
        t('tools.features.item2.item1'),
        t('tools.features.item2.item2'),
        t('tools.features.item2.item3'),
        t('tools.features.item2.item4'),
        t('tools.features.item2.item5')
      ]
    },
    {
      title: t('tools.features.item3.title'),
      description: t('tools.features.item3.description'),
      items: [
        t('tools.features.item3.item1'),
        t('tools.features.item3.item2'),
        t('tools.features.item3.item3'),
        t('tools.features.item3.item4'),
        t('tools.features.item3.item5')
      ]
    },
    {
      title: t('tools.features.item4.title'),
      description: t('tools.features.item4.description'),
      items: [
        t('tools.features.item4.item1'),
        t('tools.features.item4.item2'),
        t('tools.features.item4.item3'),
        t('tools.features.item4.item4'),
        t('tools.features.item4.item5')
      ]
    },
    {
      title: t('tools.features.item5.title'),
      description: t('tools.features.item5.description'),
      items: [
        t('tools.features.item5.item1'),
        t('tools.features.item5.item2'),
        t('tools.features.item5.item3'),
        t('tools.features.item5.item4'),
        t('tools.features.item5.item5')
      ]
    }
  ]

  const experience = [
    {
      title: t('tools.experience.item1.title'),
      description: t('tools.experience.item1.description')
    },
    {
      title: t('tools.experience.item2.title'),
      description: t('tools.experience.item2.description')
    },
    {
      title: t('tools.experience.item3.title'),
      description: t('tools.experience.item3.description')
    },
    {
      title: t('tools.experience.item4.title'),
      description: t('tools.experience.item4.description')
    },
    {
      title: t('tools.experience.item5.title'),
      description: t('tools.experience.item5.description')
    },
    {
      title: t('tools.experience.item6.title'),
      description: t('tools.experience.item6.description')
    }
  ]

  return (
    <div className="page">
      <section className="page-hero-section hero-resources">
        <div className="container">
          <div className="page-header-image">
            <img src="./assets/tools_header.svg" alt="VS Code Development Environment" className="header-image" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{t('tools.hero.title')}</h1>
            <p className="page-hero-description">
              {t('tools.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('tools.highlights.title')}</h2>
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
                  <div className="card-icon" aria-hidden="true">
                    {typeof highlight.icon === 'string' && highlight.icon.startsWith('/assets/') ? (
                      <img
                        src={highlight.icon}
                        alt={highlight.title}
                        style={{height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain'}}
                      />
                    ) : (
                      highlight.icon
                    )}
                  </div>
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
            <h2 className="section-title">{t('tools.features.title')}</h2>
          </div>
          <div className="methods-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-description">{feature.description}</p>
                  <ul className="method-list">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('tools.experience.title')}</h2>
            <p className="section-subtitle">
              {t('tools.experience.subtitle')}
            </p>
          </div>
          <div className="benefits-grid">
            {experience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="benefit-item">
                  <h3 className="benefit-title">{item.title}</h3>
                  <p className="benefit-description">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="page-cta">
            <span>{t('tools.cta.before')}</span>
            <Link to="/try-yourself">{t('tools.cta.link1')}</Link>
            <span>{t('tools.cta.middle')}</span>
            <Link to="/contact">{t('tools.cta.link2')}</Link>
            <span>{t('tools.cta.after')}</span>
          </p>
        </div>
      </section>

      {/* Honest Disclaimers Section */}
      <section className="page-section-alt" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('tools.disclaimer.title')}</h2>
            <p className="section-subtitle">
              {t('tools.disclaimer.subtitle')}
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
                <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>{t('tools.disclaimer.are.title')}</h3>
                <ul className="method-list">
                  <li>{t('tools.disclaimer.are.item1')}</li>
                  <li>{t('tools.disclaimer.are.item2')}</li>
                  <li>{t('tools.disclaimer.are.item3')}</li>
                  <li>{t('tools.disclaimer.are.item4')}</li>
                  <li>{t('tools.disclaimer.are.item5')}</li>
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
                <h3 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{t('tools.disclaimer.not.title')}</h3>
                <ul className="method-list no-bullets">
                  <li>{t('tools.disclaimer.not.item1')}</li>
                  <li>{t('tools.disclaimer.not.item2')}</li>
                  <li>{t('tools.disclaimer.not.item3')}</li>
                  <li>{t('tools.disclaimer.not.item4')}</li>
                  <li>{t('tools.disclaimer.not.item5')}</li>
                </ul>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tools
