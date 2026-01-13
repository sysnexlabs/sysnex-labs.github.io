import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import SpotlightCard from '../components/SpotlightCard'
import { useTheme } from '../contexts/ThemeContext'
import './Page.css'

/**
 * Resources Page - Downloadable Content Library
 *
 * PTC-style resource library for datasheets, whitepapers, videos, and guides.
 * Ready to be populated with real assets when available.
 */
const Resources = () => {
  const { theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState('all')

  const resourceTypes = [
    { id: 'all', label: 'All Resources', iconText: 'ALL', iconColor: '#1a2332' },
    { id: 'datasheet', label: 'Datasheets', iconText: 'PDF', iconColor: '#00bcd4' },
    { id: 'whitepaper', label: 'Whitepapers', iconText: 'WP', iconColor: '#ff9800' },
    { id: 'video', label: 'Videos', iconText: 'VID', iconColor: '#9c27b0' },
    { id: 'guide', label: 'Guides', iconText: 'DOC', iconColor: '#4caf50' },
    { id: 'brief', label: 'Solution Briefs', iconText: 'SB', iconColor: '#f44336' }
  ]

  const resources = [
    {
      id: 1,
      type: 'datasheet',
      title: 'NexSuite Product Overview',
      description: 'Complete overview of NexSuite capabilities, features, and technical specifications. Includes LSP features, platform support, and integration details.',
      format: 'PDF',
      pages: '2 pages',
      downloadUrl: '#', // Replace with actual URL when available
      status: 'coming-soon', // 'available' | 'coming-soon'
      thumbnail: null
    },
    {
      id: 2,
      type: 'whitepaper',
      title: 'SysML v2 Migration Strategies',
      description: 'Technical whitepaper on migrating from SysML 1.x to SysML v2. Covers migration patterns, tooling approaches, and ROI analysis.',
      format: 'PDF',
      pages: '12 pages',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 3,
      type: 'video',
      title: 'NexSuite in 5 Minutes',
      description: 'Quick product demo showing VS Code integration, LSP features, NexDocs documentation generation, and Git workflows.',
      format: 'Video',
      pages: '5 min',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 4,
      type: 'brief',
      title: 'ISO 26262 & ASPICE Compliance',
      description: 'How NexSuite automates compliance workflows for automotive safety standards. Includes traceability automation and work product generation.',
      format: 'PDF',
      pages: '4 pages',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 5,
      type: 'guide',
      title: 'Getting Started Guide',
      description: 'Complete onboarding guide for new users. Installation, configuration, first model, and integration with Git and CI/CD.',
      format: 'PDF',
      pages: '8 pages',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 6,
      type: 'datasheet',
      title: 'NexSuite vs Traditional MBSE Tools',
      description: 'Feature-by-feature comparison of NexSuite against legacy MBSE vendors. Includes pricing comparison and TCO analysis.',
      format: 'PDF',
      pages: '1 page',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 7,
      type: 'whitepaper',
      title: 'Modern MBSE Architecture',
      description: 'Technical architecture whitepaper covering LSP design, WASM compilation, browser-native execution, and Git-native workflows.',
      format: 'PDF',
      pages: '16 pages',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 8,
      type: 'video',
      title: 'NexDocs Documentation Generation Demo',
      description: 'Deep dive into NexDocs automated documentation generation. Shows how to generate requirements docs, traceability matrices, and diagrams.',
      format: 'Video',
      pages: '8 min',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 9,
      type: 'brief',
      title: 'Team Collaboration Features',
      description: 'Overview of team workspace features, role-based access, Git workflows for collaboration, and PR-based model reviews.',
      format: 'PDF',
      pages: '3 pages',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    },
    {
      id: 10,
      type: 'guide',
      title: 'Enterprise Deployment Guide',
      description: 'Complete guide for enterprise deployment including on-premise installation, SSO integration, and license management.',
      format: 'PDF',
      pages: '20 pages',
      downloadUrl: '#',
      status: 'coming-soon',
      thumbnail: null
    }
  ]

  const filteredResources = activeFilter === 'all'
    ? resources
    : resources.filter(r => r.type === activeFilter)

  const getResourceIcon = (type) => {
    switch (type) {
      case 'datasheet': return { text: 'PDF', color: '#00bcd4' }
      case 'whitepaper': return { text: 'WP', color: '#ff9800' }
      case 'video': return { text: 'VID', color: '#9c27b0' }
      case 'guide': return { text: 'DOC', color: '#4caf50' }
      case 'brief': return { text: 'SB', color: '#f44336' }
      default: return { text: 'PDF', color: '#00bcd4' }
    }
  }

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Resources' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="page-hero-section hero-resources">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="product-hero-content"
          >
            <div className="hero-badge">Knowledge Center</div>
            <h1>Resources & Downloads</h1>
            <p className="page-hero-description">
              Technical documentation, whitepapers, videos, and guides to help you
              evaluate, adopt, and optimize NexSuite for your engineering teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="page-content-section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div className="resource-filter-container">
            {resourceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`resource-filter-btn ${activeFilter === type.id ? 'active' : ''}`}
              >
                <span
                  className="resource-filter-icon"
                  style={{ background: activeFilter === type.id ? null : type.iconColor }}
                >
                  {type.iconText}
                </span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="resources-grid">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <SpotlightCard>
                  <div className="resource-card-header">
                    <div
                      className="resource-icon-wrapper"
                      style={{ background: getResourceIcon(resource.type).color }}
                    >
                      {getResourceIcon(resource.type).text}
                    </div>
                    <div className={`resource-status-badge ${resource.status === 'available' ? 'resource-status-available' : 'resource-status-coming-soon'}`}>
                      {resource.status === 'available' ? 'Available' : 'Coming Soon'}
                    </div>
                  </div>

                  <h3 className="resource-title">
                    {resource.title}
                  </h3>

                  <p className="resource-description">
                    {resource.description}
                  </p>

                  <div className="resource-meta">
                    <div className="resource-meta-item">
                      <strong>Format:</strong> {resource.format}
                    </div>
                    <div className="resource-meta-item">
                      <strong>Length:</strong> {resource.pages}
                    </div>
                  </div>

                  {resource.status === 'available' ? (
                    <a
                      href={resource.downloadUrl}
                      className="btn primary"
                      style={{ width: '100%', textAlign: 'center' }}
                      download
                    >
                      Download {resource.format}
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="btn ghost"
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      Notify Me When Available
                    </Link>
                  )}
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-section-alt" style={{ padding: '4rem 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-content"
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <h2>Need Custom Documentation?</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              We can create tailored resources for your organization including custom
              deployment guides, ROI analyses, and integration documentation.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn primary large">
                Request Custom Resources
              </Link>
              <Link to="/overview" className="btn ghost large">
                Explore Product
              </Link>
            </div>
            <p className="cta-note" style={{ marginTop: '1.5rem' }}>
              All standard resources are free to download. No registration required.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Resources
