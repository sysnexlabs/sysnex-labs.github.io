import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ExperienceHero } from './ui/experience-hero'
import Lenis from 'lenis'
import './Hero.css'

const Hero = React.memo(() => {
  // Initialize smooth scroll with Lenis - configured to work with Framer Motion
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    })

    // Ensure Lenis works with Framer Motion's scroll detection
    lenis.on('scroll', () => {
      // Trigger scroll event for Framer Motion
      window.dispatchEvent(new Event('scroll'))
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  // SysNex-specific stats for the hero
  const sysnexStats = [
    { 
      id: "001", 
      title: "AVAILABILITY", 
      val: "Open", 
      type: "progress" 
    },
    { 
      id: "002", 
      title: "PLATFORM STATS", 
      val: "3 Platforms", 
      type: "data",
      data: [
        { label: "VS Code Extension", value: "Available" },
        { label: "NexSuite by SysNex", value: "Coming Soon" }
      ]
    },
    { 
      id: "003", 
      title: "EXPERTISE", 
      val: "Transforming systems engineering through advanced SysML v2 tooling.", 
      type: "text" 
    }
  ]

  return (
    <div className="hero-wrapper">
      <div className="sysmlv2-hero-badge">
        <div className="sysmlv2-hero-badge__logo">
          <img src="/assets/sysmlv2.png" alt="SysML v2 Logo" />
        </div>
        <span className="sysmlv2-hero-badge__text">Built on SysML v2 Standards</span>
      </div>
      <ExperienceHero
        kicker="Model-Based Systems Engineering, Re-invented"
        title={`Systems\nEngineering\nfor\nInnovators.`}
        description="Production-ready SysML v2 Language Server, completely free for individuals. Everything you need to build the future, faster."
        ctaText="Get Early Access"
        ctaLink="/contact"
        stats={sysnexStats}
      />
    </div>
  )
})

Hero.displayName = 'Hero'

export default Hero

