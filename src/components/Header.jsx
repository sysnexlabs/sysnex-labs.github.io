import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../utils/i18n'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { t, lang } = useTranslation()
  const [activePage, setActivePage] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [consultingOpen, setConsultingOpen] = useState(false)

  useEffect(() => {
    // Determine active page based on current pathname
    const path = location.pathname
    let page = 'home'
    
    if (path === '/' || path === '/index.html' || path === '') {
      page = 'home'
    } else if (path === '/contact' || path === '/contact.html') {
      page = 'contact'
    } else if (path === '/pricing' || path === '/pricing.html') {
      page = 'pricing'
    } else if (path === '/product' || path === '/overview' || path === '/solutions' || path === '/platforms' || path === '/products' || path === '/editions' || path === '/compliance' || path === '/resources' || path.includes('/workspaces') || path.includes('/try-yourself')) {
      page = 'product'
    } else if (path === '/competences' || path === '/methods' || path === '/process' || path === '/tools') {
      page = 'consulting'
    } else if (path === '/about' || path === '/about.html') {
      page = 'about'
    }
    
    setActivePage(page)
  }, [location.pathname])

  useEffect(() => {
    // Close mobile menu & submenus on navigation
    setMenuOpen(false)
    setProductOpen(false)
    setConsultingOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setProductOpen(false)
        setConsultingOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close dropdowns if clicking outside of them
      if (!e.target.closest('.nav-dropdown')) {
        setProductOpen(false)
        setConsultingOpen(false)
      }
    }

    // Only add listener if a dropdown is open
    if (productOpen || consultingOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [productOpen, consultingOpen])

  // Sync button text when lang changes (from useTranslation hook)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Update all language toggle buttons (for both React and static HTML)
      const buttons = document.querySelectorAll('#langToggle, .lang-toggle')
      buttons.forEach((button) => {
        button.textContent = lang === 'en' ? 'DE' : 'EN'
        button.setAttribute('aria-label', lang === 'en' ? 'Sprache auf Deutsch umschalten' : 'Switch language to English')
      })
    }
  }, [lang])

  const isActive = (page) => {
    if (activePage === page) return true
    // Handle submenu items activating parent
    if (page === 'product' && (activePage === 'pricing')) return true
    if (page === 'consulting' && (activePage === 'methods' || activePage === 'process' || activePage === 'tools')) return true
    return false
  }
  
  const isSubmenuActive = (subPage) => {
    const path = location.pathname
    if (subPage === 'try-yourself' && path.includes('/try-yourself')) return true
    if (subPage === 'pricing' && (path === '/pricing' || path === '/contact')) return true
    if (subPage === 'competences' && path === '/competences') return true
    if (subPage === 'methods' && path === '/methods') return true
    if (subPage === 'process' && path === '/process') return true
    if (subPage === 'tools' && path === '/tools') return true
    if (subPage === 'about' && path === '/about') return true
    return false
  }

  const toggleLanguage = (e) => {
    // Prevent event bubbling and default behavior
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const newLang = lang === 'en' ? 'de' : 'en'
    
    try {
      // Save to localStorage first
      localStorage.setItem('sysnex-lang', newLang)
      
      // Update ALL language toggle buttons immediately (for both React and static HTML)
      const buttons = document.querySelectorAll('#langToggle, .lang-toggle')
      buttons.forEach((button) => {
        button.textContent = newLang === 'en' ? 'DE' : 'EN'
        button.setAttribute('aria-label', newLang === 'en' ? 'Sprache auf Deutsch umschalten' : 'Switch language to English')
      })
      
      // Trigger static i18n if available (this will update static HTML pages)
      if (typeof window !== 'undefined' && window.setLanguage) {
        try {
          window.setLanguage(newLang)
        } catch (err) {
          console.warn('Could not set language via window.setLanguage:', err)
        }
      }
      
      // Dispatch event for other React components (useTranslation hook will pick this up)
      try {
        window.dispatchEvent(new CustomEvent('languagechange'))
      } catch (err) {
        console.warn('Could not dispatch languagechange event:', err)
      }
    } catch (err) {
      console.warn('Could not save language to localStorage:', err)
    }
  }

  const handleHomeClick = (e) => {
    // Always close mobile navigation when navigating
    setMenuOpen(false)
    setProductOpen(false)
    setConsultingOpen(false)

    // If already on home page, scroll to top and force navigation
    if (location.pathname === '/' || location.pathname === '/index.html') {
      e.preventDefault()
      // Scroll to top immediately
      window.scrollTo({ top: 0, behavior: 'instant' })
      // Force navigation with state to trigger re-render
      navigate('/', { 
        replace: true, 
        state: { refresh: Date.now() },
        preventScrollReset: false
      })
      // Ensure scroll happens after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }
  }

  return (
    <header className={`navbar ${menuOpen ? 'is-open' : ''}`} role="banner">
      <div className="brand">
        <Link 
          to="/" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          onClick={handleHomeClick}
        >
          <img src={theme === 'light' ? "./assets/logo_new.svg" : "./assets/logo_white.svg"} alt="SysNex" className="logo" />
          <span className="brand-text">
            <span className="brand-text-primary">SYSNEX</span>
            <span className="brand-text-secondary">Technologies</span>
          </span>
        </Link>
      </div>
      
      <div className="navbar-actions">
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-controls="siteNav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="nav-toggle-bars" aria-hidden="true"></span>
        </button>
        <div className="header-controls">
          <button 
            className="lang-toggle" 
            id="langToggle" 
            type="button" 
            aria-label={lang === 'en' ? 'Sprache auf Deutsch umschalten' : 'Switch language to English'}
            onClick={toggleLanguage}
            onTouchStart={(e) => {
              // Ensure touch events work on mobile
              e.stopPropagation()
            }}
          >
            {lang === 'en' ? 'DE' : 'EN'}
          </button>
          <ThemeToggle />
        </div>
      </div>

      <nav id="siteNav" role="navigation" aria-label="Main navigation">
        <Link 
          to="/" 
          className={`nav-link ${isActive('home') ? 'active' : ''}`}
          data-page="home"
          onClick={handleHomeClick}
        >
          {t('nav.home')}
        </Link>
        
        <div className={`nav-dropdown ${productOpen ? 'is-open' : ''}`}>
          <div className="nav-dropdown-trigger">
            <Link
              to="/overview"
              className={`nav-link-dropdown ${isActive('product') ? 'active' : ''}`}
              data-page="product"
            >
              {t('nav.product')}
            </Link>
            <button
              className="dropdown-toggle"
              type="button"
              aria-label="Toggle Product submenu"
              aria-expanded={productOpen}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setProductOpen((v) => !v)
              }}
            />
          </div>
          <div className="dropdown-menu">
            <Link to="/overview" className={location.pathname === '/overview' ? 'active' : ''} data-page="overview">Overview</Link>
            {/* <Link to="/solutions" className={location.pathname === '/solutions' ? 'active' : ''} data-page="solutions">Solutions</Link> */}
            {/* <Link to="/platforms" className={location.pathname === '/platforms' ? 'active' : ''} data-page="platforms">Platforms</Link> */}
            <Link to="/products" className={location.pathname === '/products' ? 'active' : ''} data-page="products">Products</Link>
            {/* <Link to="/editions" className={location.pathname === '/editions' ? 'active' : ''} data-page="editions">Editions</Link> */}
            {/* <Link to="/compliance" className={location.pathname === '/compliance' ? 'active' : ''} data-page="compliance">Compliance</Link> */}
            {/* <Link to="/workspaces" className={location.pathname.includes('/workspaces') ? 'active' : ''} data-page="workspaces">Workspaces</Link> */}
            {/* <Link to="/resources" className={location.pathname === '/resources' ? 'active' : ''} data-page="resources">Resources</Link> */}
            <Link to="/try-yourself" className={location.pathname.includes('try-yourself') ? 'active' : ''} data-page="try-yourself">{t('nav.try-yourself')}</Link>
            {/* <Link to="/pricing" className={isSubmenuActive('pricing') ? 'active' : ''} data-page="pricing">{t('nav.pricing')}</Link> */}
          </div>
        </div>
        
        {/* Competences pages */}
        {/* <div className={`nav-dropdown ${consultingOpen ? 'is-open' : ''}`}>
          <div className="nav-dropdown-trigger">
            <Link
              to="/methods"
              className={`nav-link-dropdown ${isActive('consulting') ? 'active' : ''}`}
              data-page="consulting"
            >
              {t('nav.consulting') || 'Competences'}
            </Link>
            <button
              className="dropdown-toggle"
              type="button"
              aria-label="Toggle Competences submenu"
              aria-expanded={consultingOpen}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setConsultingOpen((v) => !v)
              }}
            />
          </div>
          <div className="dropdown-menu">
            <Link to="/competences" className={location.pathname === '/competences' ? 'active' : ''} data-page="competences">{t('nav.competences') || 'Competences'}</Link>
            <Link to="/methods" className={location.pathname === '/methods' ? 'active' : ''} data-page="methods">{t('nav.methods') || 'Methods'}</Link>
            <Link to="/process" className={location.pathname === '/process' ? 'active' : ''} data-page="process">{t('nav.process') || 'Process'}</Link>
            <Link to="/tools" className={location.pathname === '/tools' ? 'active' : ''} data-page="tools">{t('nav.tools') || 'Tools'}</Link>
          </div>
        </div> */}
        
        <Link 
          to="/about" 
          className={`nav-link ${isActive('about') ? 'active' : ''}`}
          data-page="about"
        >
          {t('nav.about') || 'About'}
        </Link>
        
        <Link 
          to="/contact" 
          className={`nav-link ${isActive('contact') ? 'active' : ''}`}
          data-page="contact"
        >
          {t('nav.contact')}
        </Link>
      </nav>
    </header>
  )
}

export default Header

