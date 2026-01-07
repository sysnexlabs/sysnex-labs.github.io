import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpotlightCard from '../components/SpotlightCard'
import { useTranslation } from '../utils/i18n'
import './Page.css'

const Process = () => {
  const { t } = useTranslation()
  const highlights = [
    {
      title: t('process.highlights.item1.title'),
      description: t('process.highlights.item1.description')
    },
    {
      title: t('process.highlights.item2.title'),
      description: t('process.highlights.item2.description')
    },
    {
      title: t('process.highlights.item3.title'),
      description: t('process.highlights.item3.description')
    },
    {
      title: t('process.highlights.item4.title'),
      description: t('process.highlights.item4.description')
    }
  ]

  const implementations = [
    {
      title: t('process.implementations.item1.title'),
      description: t('process.implementations.item1.description')
    },
    {
      title: t('process.implementations.item2.title'),
      description: t('process.implementations.item2.description')
    },
    {
      title: t('process.implementations.item3.title'),
      description: t('process.implementations.item3.description')
    }
  ]

  const value = [
    {
      title: t('process.value.item1.title'),
      description: t('process.value.item1.description')
    },
    {
      title: t('process.value.item2.title'),
      description: t('process.value.item2.description')
    },
    {
      title: t('process.value.item3.title'),
      description: t('process.value.item3.description')
    },
    {
      title: t('process.value.item4.title'),
      description: t('process.value.item4.description')
    },
    {
      title: t('process.value.item5.title'),
      description: t('process.value.item5.description')
    },
    {
      title: t('process.value.item6.title'),
      description: t('process.value.item6.description')
    }
  ]

  return (
    <div className="page">
      <section className="page-hero-section">
        <div className="container">
          <div className="page-header-image">
            <img src="./assets/process_header.svg" alt="Process Landscape" className="header-image" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{t('process.hero.title')}</h1>
            <p className="page-hero-description">
              {t('process.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <h2 className="section-title">{t('process.highlights.title')}</h2>
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
          <h2 className="section-title">{t('process.implementations.title')}</h2>
          <p className="section-subtitle">
            {t('process.implementations.subtitle')}
          </p>
          <div className="methods-grid">
            {implementations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <h2 className="section-title">{t('process.value.title')}</h2>
          <p className="section-subtitle">
            {t('process.value.subtitle')}
          </p>
          <div className="benefits-grid">
            {value.map((item, index) => (
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
            <span>{t('process.cta.before')}</span>
            <Link to="/try-yourself">{t('process.cta.link1')}</Link>
            <span>{t('process.cta.middle')}</span>
            <Link to="/contact">{t('process.cta.link2')}</Link>
            <span>{t('process.cta.after')}</span>
          </p>
        </div>
      </section>

      {/* Honest Disclaimers Section */}
      <section className="page-section-alt" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('process.disclaimer.title')}</h2>
            <p className="section-subtitle">
              {t('process.disclaimer.subtitle')}
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
                <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>{t('process.disclaimer.are.title')}</h3>
                <ul className="method-list">
                  <li>{t('process.disclaimer.are.item1')}</li>
                  <li>{t('process.disclaimer.are.item2')}</li>
                  <li>{t('process.disclaimer.are.item3')}</li>
                  <li>{t('process.disclaimer.are.item4')}</li>
                  <li>{t('process.disclaimer.are.item5')}</li>
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
                <h3 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{t('process.disclaimer.not.title')}</h3>
                <ul className="method-list no-bullets">
                  <li>{t('process.disclaimer.not.item1')}</li>
                  <li>{t('process.disclaimer.not.item2')}</li>
                  <li>{t('process.disclaimer.not.item3')}</li>
                  <li>{t('process.disclaimer.not.item4')}</li>
                  <li>{t('process.disclaimer.not.item5')}</li>
                </ul>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Process
