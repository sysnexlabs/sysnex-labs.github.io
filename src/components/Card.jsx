import React from 'react'
import './Card.css'

const Card = ({ icon, title, description, className = '' }) => {
  return (
    <div className={`card ${className}`} tabIndex="0" role="article">
      {icon && <div className="card-icon" aria-hidden="true">{icon}</div>}
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  )
}

export default Card






















