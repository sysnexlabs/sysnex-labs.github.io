import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuroraBackground from './AuroraBackground'
import AnimatedText from './AnimatedText'
import { useTranslation } from '../utils/i18n'
import './Hero.css'

const Hero = React.memo(() => {
  const { t } = useTranslation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <AuroraBackground>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-background-overlay"></div>
        <div className="hero-container">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="hero-kicker"
              variants={itemVariants}
            >
              Model-Based Systems Engineering, Re-invented
            </motion.span>
            <motion.h1 
              id="hero-heading" 
              className="hero-title"
              variants={itemVariants}
            >
              <AnimatedText variant="gradient">
                Systems Engineering
                <br />
                for Innovators.
              </AnimatedText>
            </motion.h1>
            <motion.p
              className="hero-description"
              variants={itemVariants}
            >
              Production-ready SysML v2 Language Server, completely free for individuals.
              Everything you need to build the future, faster.
            </motion.p>
            <motion.div
              className="hero-metric"
              variants={itemVariants}
            >
              <span className="hero-metric-icon">✨</span>
              <span>Free for Individuals & Open Source Projects</span>
            </motion.div>
            <motion.div
              className="hero-actions"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to="/contact" className="btn-primary-large">
                  Get Early Access
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to="/overview" className="btn-secondary-large">
                  Explore Features
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  )
})

Hero.displayName = 'Hero'

export default Hero

