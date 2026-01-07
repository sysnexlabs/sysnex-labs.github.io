import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Smartphone, Globe, Code, Shield, ArrowRight } from "lucide-react"
import "../../styles/bento-grid.css"

function TypeTester() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.5 : 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <motion.span
        className="font-serif text-6xl md:text-8xl font-medium"
        style={{ 
          color: 'var(--text-primary)',
          display: 'block',
          textAlign: 'center',
          lineHeight: '1'
        }}
        animate={{ scale }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        SysML
      </motion.span>
    </div>
  )
}

function LayoutAnimation() {
  const [layout, setLayout] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const layouts = ["grid-cols-2", "grid-cols-3", "grid-cols-1"]

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        className={`grid ${layouts[layout]} gap-1.5 w-full max-w-[140px] h-full`}
        layout
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="rounded-md h-5 w-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            layout
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1],
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function SpeedIndicator() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="h-10 flex items-center justify-center overflow-hidden relative w-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="h-8 w-24 rounded"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              exit={{ opacity: 0, y: -20, position: 'absolute' }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <motion.span
              key="text"
              initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-3xl md:text-4xl font-sans font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              &lt;50ms
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>LSP Latency</span>
      <div className="w-full max-w-[120px] h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--brand-cyan)' }}
          initial={{ width: 0 }}
          animate={{ width: loading ? 0 : "100%" }}
          transition={{ 
            type: "spring", 
            stiffness: 150, 
            damping: 20, 
            mass: 0.8
          }}
        />
      </div>
    </div>
  )
}

function SecurityBadge() {
  const [shields, setShields] = useState([
    { id: 1, active: false },
    { id: 2, active: false },
    { id: 3, active: false }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setShields(prev => {
        const nextIndex = prev.findIndex(s => !s.active)
        if (nextIndex === -1) {
          return prev.map(() => ({ id: Math.random(), active: false }))
        }
        return prev.map((s, i) => i === nextIndex ? { ...s, active: true } : s)
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full gap-2" style={{ width: '100%', height: '100%' }}>
      {shields.map((shield) => (
        <motion.div
          key={shield.id}
          className="rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: shield.active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          animate={{ 
            scale: shield.active ? 1.1 : 1
          }}
          transition={{ 
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <Lock className="w-5 h-5" style={{ 
            color: shield.active ? 'var(--text-primary)' : 'var(--text-muted)'
          }} />
        </motion.div>
      ))}
    </div>
  )
}

function GlobalNetwork() {
  const [pulses] = useState([0, 1, 2, 3, 4])

  return (
    <div className="flex items-center justify-center h-full relative" style={{ width: '100%', height: '100%' }}>
      <Globe className="w-16 h-16 relative z-10" style={{ color: 'var(--text-primary)', opacity: 0.8 }} />
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          className="absolute border-2 rounded-full"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.2)',
            width: '64px',
            height: '64px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center'
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: pulse * 0.8,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

function FeaturesSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section 
      className="px-6 py-32 min-h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 1,
        isolation: 'isolate',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="max-w-7xl w-full mx-auto">
        <motion.p
          className="text-sm uppercase tracking-widest mb-12"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          Features
        </motion.p>

        {/* Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(1, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))',
            gap: '1.25rem',
            gridAutoRows: '200px'
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          {/* 1. SysML v2 Native - Tall (2x2) */}
          <motion.div
            className="md:col-span-2 md:row-span-2 rounded-xl p-8 flex flex-col cursor-pointer overflow-hidden group relative transform-gpu"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              gridColumn: isMobile ? 'span 1' : 'span 2',
              gridRow: isMobile ? 'span 1' : 'span 2',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.01,
              y: -2,
              transition: { 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.99 }}
          >
            <div 
              className="bento-overlay absolute inset-0 rounded-xl pointer-events-none transform-gpu"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.08) 100%)',
                opacity: 0
              }}
            />
            <div 
              className="bento-content flex-1 relative z-10 transform-gpu"
            >
              <TypeTester />
            </div>
            <div 
              className="bento-content mt-6 relative z-10 pointer-events-none transform-gpu"
            >
              <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>SysML v2 Native</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Full language support with production-ready LSP implementation.</p>
            </div>
            <div 
              className="bento-cta absolute bottom-0 left-0 right-0 p-4 pointer-events-none transform-gpu"
              style={{
                transform: 'translateY(40px)',
                opacity: 0
              }}
            >
              <a 
                href="/overview" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto hover:opacity-90"
                style={{ 
                  backgroundColor: 'var(--brand-cyan)',
                  color: 'white',
                  transition: 'opacity 0.2s ease'
                }}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 2. Flexible Layouts - Standard (2x1) */}
          <motion.div
            className="md:col-span-2 rounded-xl p-8 flex flex-col cursor-pointer overflow-hidden group relative transform-gpu"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              gridColumn: isMobile ? 'span 1' : 'span 2',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            variants={cardVariants}
            whileHover={{ 
              scale: 0.99,
              y: -1,
              transition: { 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="bento-overlay absolute inset-0 rounded-xl pointer-events-none transform-gpu"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.08) 100%)',
                opacity: 0
              }}
            />
            <div className="bento-content flex-1 relative z-10 transform-gpu">
              <LayoutAnimation />
            </div>
            <div className="bento-content mt-6 relative z-10 pointer-events-none transform-gpu">
              <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Flexible Layouts</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Adaptive diagrams and views that scale.</p>
            </div>
            <div className="bento-cta absolute bottom-0 left-0 right-0 p-4 pointer-events-none transform-gpu" style={{ transform: 'translateY(40px)', opacity: 0 }}>
              <a 
                href="/overview" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
                style={{ 
                  backgroundColor: 'var(--brand-cyan)',
                  color: 'white'
                }}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 3. Git-Native - Tall (2x2) */}
          <motion.div
            className="md:col-span-2 md:row-span-2 rounded-xl p-6 flex flex-col cursor-pointer overflow-hidden group relative transform-gpu"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              gridColumn: isMobile ? 'span 1' : 'span 2',
              gridRow: isMobile ? 'span 1' : 'span 2',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.01,
              y: -2,
              transition: { 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.99 }}
          >
            <div 
              className="bento-overlay absolute inset-0 rounded-xl pointer-events-none transform-gpu"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.08) 100%)',
                opacity: 0
              }}
            />
            <div className="bento-content flex-1 flex items-center justify-center relative z-10 transform-gpu">
              <div className="relative">
                <GlobalNetwork />
              </div>
            </div>
            <div className="bento-content mt-auto relative z-20 backdrop-blur-md rounded-lg p-4 border transform-gpu pointer-events-none" style={{ 
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              opacity: 0.9
            }}>
              <h3 className="font-serif text-2xl flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <Globe className="w-5 h-5" />
                Git-Native
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Version control built-in. Collaborate with standard Git workflows.</p>
            </div>
            <div className="bento-cta absolute bottom-0 left-0 right-0 p-4 pointer-events-none transform-gpu" style={{ transform: 'translateY(40px)', opacity: 0 }}>
              <a 
                href="/overview" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
                style={{ 
                  backgroundColor: 'var(--brand-cyan)',
                  color: 'white'
                }}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 4. Blazing Fast - Standard (2x1) */}
          <motion.div
            className="md:col-span-2 rounded-xl p-8 flex flex-col cursor-pointer overflow-hidden group relative transform-gpu"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              gridColumn: isMobile ? 'span 1' : 'span 2',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            variants={cardVariants}
            whileHover={{ 
              scale: 0.99,
              y: -1,
              transition: { 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="bento-overlay absolute inset-0 rounded-xl pointer-events-none transform-gpu"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.08) 100%)',
                opacity: 0
              }}
            />
            <div className="bento-content flex-1 relative z-10 transform-gpu">
              <SpeedIndicator />
            </div>
            <div className="bento-content mt-6 relative z-10 pointer-events-none transform-gpu">
              <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Blazing Fast</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Sub-50ms LSP response times for instant feedback.</p>
            </div>
            <div className="bento-cta absolute bottom-0 left-0 right-0 p-4 pointer-events-none transform-gpu" style={{ transform: 'translateY(40px)', opacity: 0 }}>
              <a 
                href="/overview" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
                style={{ 
                  backgroundColor: 'var(--brand-cyan)',
                  color: 'white'
                }}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 5. Standards Compliant - Wide (3x1) */}
          <motion.div
            className="md:col-span-3 rounded-xl p-8 flex flex-col cursor-pointer overflow-hidden group relative transform-gpu"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              gridColumn: isMobile ? 'span 1' : 'span 3',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            variants={cardVariants}
            whileHover={{ 
              scale: 0.99,
              y: -1,
              transition: { 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="bento-overlay absolute inset-0 rounded-xl pointer-events-none transform-gpu"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.08) 100%)',
                opacity: 0
              }}
            />
            <div className="bento-content flex-1 relative z-10 transform-gpu">
              <SecurityBadge />
            </div>
            <div className="bento-content mt-6 relative z-10 pointer-events-none transform-gpu">
              <h3 className="font-serif text-2xl flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <Shield className="w-5 h-5" />
                Standards Compliant
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>ISO 26262, ASPICE, and ISO 15288 support built-in for mission-critical systems.</p>
            </div>
            <div className="bento-cta absolute bottom-0 left-0 right-0 p-4 pointer-events-none transform-gpu" style={{ transform: 'translateY(40px)', opacity: 0 }}>
              <a 
                href="/overview" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
                style={{ 
                  backgroundColor: 'var(--brand-cyan)',
                  color: 'white'
                }}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 6. VS Code Integration - Wide (3x1) */}
          <motion.div
            className="md:col-span-3 rounded-xl p-8 flex flex-col cursor-pointer overflow-hidden group relative transform-gpu"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              gridColumn: isMobile ? 'span 1' : 'span 3',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            variants={cardVariants}
            whileHover={{ 
              scale: 0.99,
              y: -1,
              transition: { 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="bento-overlay absolute inset-0 rounded-xl pointer-events-none transform-gpu"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.08) 100%)',
                opacity: 0
              }}
            />
            <div className="bento-content flex-1 flex items-center justify-center relative z-10 transform-gpu" style={{ width: '100%', height: '100%' }}>
              <Code className="w-16 h-16" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div className="bento-content mt-6 relative z-10 pointer-events-none transform-gpu">
              <h3 className="font-serif text-2xl font-semibold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                <Code className="w-5 h-5" />
                VS Code Integration
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Native editor experience with IntelliSense, diagnostics, and more.</p>
            </div>
            <div className="bento-cta absolute bottom-0 left-0 right-0 p-4 pointer-events-none transform-gpu" style={{ transform: 'translateY(40px)', opacity: 0 }}>
              <a 
                href="/overview" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
                style={{ 
                  backgroundColor: 'var(--brand-cyan)',
                  color: 'white'
                }}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}

// Export FeaturesSection as default for use in Home page
export default FeaturesSection
