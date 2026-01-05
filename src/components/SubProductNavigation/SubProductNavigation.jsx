import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SubProductNavigation.css'

/**
 * SubProductNavigation - Shows app-level features for each product
 *
 * Displays available apps/capabilities with:
 * - App icon and name
 * - Feature status (Demo, Full, Coming Soon)
 * - Direct link to demo or documentation
 */
export default function SubProductNavigation({ productId, apps }) {
  const [selectedApp, setSelectedApp] = useState(null)

  return (
    <div className="sub-product-navigation">
      <div className="sub-nav-header">
        <h3>Product Capabilities</h3>
        <p className="sub-nav-subtitle">
          Explore specific features and applications
        </p>
      </div>

      <div className="app-grid">
        {apps.map((app) => (
          <div
            key={app.id}
            className={`app-card ${selectedApp === app.id ? 'selected' : ''}`}
            onMouseEnter={() => setSelectedApp(app.id)}
            onMouseLeave={() => setSelectedApp(null)}
          >
            <div className="app-card-header">
              {app.icon && (
                <div className="app-icon">
                  {typeof app.icon === 'string' ? (
                    <img src={app.icon} alt={app.name} />
                  ) : (
                    <span className="app-icon-emoji">{app.icon}</span>
                  )}
                </div>
              )}
              <div className="app-title-section">
                <h4 className="app-name">{app.name}</h4>
                <span className={`app-status ${app.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {app.status}
                </span>
              </div>
            </div>

            <p className="app-description">{app.description}</p>

            {app.features && app.features.length > 0 && (
              <ul className="app-features-list">
                {app.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-bullet">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="app-card-actions">
              {app.demoLink && (
                <Link to={app.demoLink} className="app-action-btn primary">
                  Try Demo →
                </Link>
              )}
              {app.docsLink && (
                <Link to={app.docsLink} className="app-action-btn secondary">
                  Documentation
                </Link>
              )}
              {app.extensionOnly && (
                <div className="extension-badge">
                  <span className="badge-icon">🔧</span>
                  Extension Only
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sub-nav-footer">
        <div className="feature-legend">
          <div className="legend-item">
            <span className="legend-badge demo">Demo</span>
            <span>Browser demo available</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge full">Full</span>
            <span>Available in VS Code Extension</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge coming-soon">Coming Soon</span>
            <span>In development</span>
          </div>
        </div>
      </div>
    </div>
  )
}
