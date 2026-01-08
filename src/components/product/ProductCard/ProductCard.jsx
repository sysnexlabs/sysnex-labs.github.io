import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from '../StatusBadge/StatusBadge'
import './ProductCard.css'

/**
 * ProductCard Component
 *
 * Displays a product with icon, title, description, features, components, use cases, and pricing.
 * Used on the Products index page to show individual product tools.
 */
const ProductCard = ({ product, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="product-card"
    >
      {product.badge && (
        <div className="product-card-badge">
          {product.badge}
        </div>
      )}

      <div className="product-card-icon">
        {typeof product.icon === 'string' && product.icon.startsWith('/assets/') ? (
          <img
            src={product.icon}
            alt={product.title}
            style={{height: '120px', width: 'auto', maxWidth: '120px', objectFit: 'contain'}}
          />
        ) : (
          product.icon
        )}
      </div>

      <h3 className="product-card-title">{product.title}</h3>

      {product.subtitle && (
        <p className="product-card-subtitle">
          {product.subtitle}
        </p>
      )}

      <p className="product-card-description">
        {product.description}
      </p>

      <StatusBadge status={product.status} />

      {/* Key Features */}
      <div className="product-card-section">
        <h4 className="product-card-section-title">Key Features:</h4>
        <ul className="product-card-features">
          {product.features.slice(0, 4).map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
          {product.features.length > 4 && (
            <li className="product-card-features-more">
              +{product.features.length - 4} more features...
            </li>
          )}
        </ul>
      </div>

      {/* Components */}
      {product.components && product.components.length > 0 && (
        <div className="product-card-section">
          <h4 className="product-card-section-title">Components:</h4>
          <div className="product-card-components">
            {product.components.map((comp, i) => (
              <div key={i} className="product-card-component">
                <strong>{comp.name}</strong> ({comp.edition}): {comp.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Use Cases */}
      {product.useCases && product.useCases.length > 0 && (
        <details className="product-card-details">
          <summary className="product-card-details-summary">
            Use Cases ({product.useCases.length})
          </summary>
          <ul className="product-card-use-cases">
            {product.useCases.map((useCase, i) => (
              <li key={i}>{useCase}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Pricing */}
      {product.pricing && (
        <div className="product-card-pricing">
          <div className="product-card-pricing-label">Pricing:</div>
          <div className="product-card-pricing-value">{product.pricing}</div>
        </div>
      )}

      {/* CTA */}
      <div className="product-card-cta">
        {product.status.includes('✅') || product.status.includes('🟡') ? (
          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column', width: '100%' }}>
            <Link to={product.link} className="btn primary" style={{ width: '100%' }}>
              Learn More →
            </Link>
            {product.demoLink && (
              <Link to={product.demoLink} className="btn secondary" style={{ width: '100%' }}>
                Try Demo →
              </Link>
            )}
          </div>
        ) : (
          <button className="btn ghost" disabled>
            Coming Soon
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard
