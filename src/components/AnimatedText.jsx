import React from 'react'
import { motion } from 'framer-motion'
import './AnimatedText.css'

const AnimatedText = React.memo(({ children, variant = 'gradient', className = '' }) => {
  const variants = {
    gradient: {
      background: 'linear-gradient(135deg, #00B4D8 0%, #00D4FF 50%, #00B4D8 100%)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 4s ease-in-out infinite',
      filter: 'drop-shadow(0 2px 8px rgba(0, 180, 216, 0.3))',
    },
    shiny: {
      background: 'linear-gradient(90deg, var(--light-text) 0%, var(--turquoise) 50%, var(--light-text) 100%)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'shimmer 3s linear infinite',
    }
  }

  return (
    <motion.span
      className={`animated-text animated-text--${variant} ${className}`}
      style={variants[variant]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  )
})

AnimatedText.displayName = 'AnimatedText'

export default AnimatedText

