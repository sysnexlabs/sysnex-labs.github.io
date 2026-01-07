import React from 'react'
import './AuroraBackground.css'

const AuroraBackground = React.memo(({ children, className = '' }) => {
  return (
    <div className={`aurora-background ${className}`}>
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
      <div className="aurora-content">
        {children}
      </div>
    </div>
  )
})

AuroraBackground.displayName = 'AuroraBackground'

export default AuroraBackground






















