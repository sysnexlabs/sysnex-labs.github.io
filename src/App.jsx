import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
// Lazy load heavy components for better code splitting
const TryYourself = lazy(() => import('./pages/TryYourself'))
const Product = lazy(() => import('./pages/Product'))
// Demo pages
const TryNexDocs = lazy(() => import('./pages/demos/TryNexDocs'))
const TryNexVar = lazy(() => import('./pages/demos/TryNexVar'))
const TryNexViz = lazy(() => import('./pages/demos/TryNexViz'))
const TryNexAnalytics = lazy(() => import('./pages/demos/TryNexAnalytics'))
const TryNexReq = lazy(() => import('./pages/demos/TryNexReq'))
const TryNexTest = lazy(() => import('./pages/demos/TryNexTest'))
const TryNexTrade = lazy(() => import('./pages/demos/TryNexTrade'))
const TryNexSim = lazy(() => import('./pages/demos/TryNexSim'))
const TryKraken = lazy(() => import('./pages/demos/TryKraken'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Legal = lazy(() => import('./pages/Legal'))
const HeroAlternative = lazy(() => import('./pages/HeroAlternative'))
// New product structure pages
const Overview = lazy(() => import('./pages/overview/Overview'))
const Solutions = lazy(() => import('./pages/Solutions'))
const Platforms = lazy(() => import('./pages/platforms/Platforms'))
const Products = lazy(() => import('./pages/products/Products'))
const Editions = lazy(() => import('./pages/editions/Editions'))
const Compliance = lazy(() => import('./pages/compliance/Compliance'))
// Product detail pages
const NexDocs = lazy(() => import('./pages/products/nexdocs/NexDocs'))
const NexReq = lazy(() => import('./pages/products/nexreq/NexReq'))
const NexTest = lazy(() => import('./pages/products/nextest/NexTest'))
const NexViz = lazy(() => import('./pages/products/nexviz/NexViz'))
const NexAnalytics = lazy(() => import('./pages/products/nexanalytics/NexAnalytics'))
const NexTrade = lazy(() => import('./pages/products/nextrade/NexTrade'))
const NexVar = lazy(() => import('./pages/products/nexvar/NexVar'))
const NexSim = lazy(() => import('./pages/products/nexsim/NexSim'))
const NexSuite = lazy(() => import('./pages/products/nexsuite/NexSuite'))
// Workspace pages
const Workspaces = lazy(() => import('./pages/workspaces/Workspaces'))
const WorkspaceDetail = lazy(() => import('./pages/workspaces/WorkspaceDetail'))
// Competences pages
const About = lazy(() => import('./pages/About'))
const Methods = lazy(() => import('./pages/Methods'))
const Process = lazy(() => import('./pages/Process'))
const Tools = lazy(() => import('./pages/Tools'))
const Competences = lazy(() => import('./pages/Competences'))
// Resources page
const Resources = lazy(() => import('./pages/Resources'))
// Agents page
const Agents = lazy(() => import('./pages/Agents'))
import './styles/App.css'
import './styles/PixelTheme.css' // PIXEL ART THEME OVERRIDE

function AppContent() {
  const location = useLocation()
  const isAlternativeHero = location.pathname === '/hero-alternative'

  // Handle redirect from 404.html fallback (GitHub Pages)
  useEffect(() => {
    // Check if we have a redirect path stored from 404.html
    const redirectPath = sessionStorage.getItem('redirectPath')
    if (redirectPath && redirectPath !== window.location.pathname + window.location.search + window.location.hash) {
      // Clear the redirect path
      sessionStorage.removeItem('redirectPath')
      // Navigate to the stored path
      window.history.replaceState(null, '', redirectPath)
      // Trigger a navigation event to update React Router
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      {!isAlternativeHero && <Header />}
      <main>
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/legal/privacy" element={<Legal type="privacy" />} />
            <Route path="/legal/terms" element={<Legal type="terms" />} />
            <Route path="/legal/license" element={<Legal type="license" />} />
            {/* New product structure routes */}
            <Route path="/overview" element={<Overview />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/products" element={<Products />} />
            <Route path="/editions" element={<Editions />} />
            <Route path="/compliance" element={<Compliance />} />
            {/* Product detail pages */}
            <Route path="/products/nexdocs" element={<NexDocs />} />
            <Route path="/products/nexreq" element={<NexReq />} />
            <Route path="/products/nextest" element={<NexTest />} />
            <Route path="/products/nexviz" element={<NexViz />} />
            <Route path="/products/nexanalytics" element={<NexAnalytics />} />
            <Route path="/products/nextrade" element={<NexTrade />} />
            <Route path="/products/nexvar" element={<NexVar />} />
            <Route path="/products/nexsim" element={<NexSim />} />
            <Route path="/products/nexsuite" element={<NexSuite />} />
            {/* Workspace pages */}
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/workspaces/:workspaceId" element={<WorkspaceDetail />} />
            {/* Legacy product route - keep for backward compatibility */}
            <Route path="/product" element={<Product />} />
            <Route path="/product/try-yourself" element={<TryYourself />} />
            <Route path="/try-yourself" element={<TryYourself />} />
            {/* Demo pages */}
            <Route path="/try-nexdocs" element={<TryNexDocs />} />
            <Route path="/try-nexvar" element={<TryNexVar />} />
            <Route path="/try-nexviz" element={<TryNexViz />} />
            <Route path="/try-nexanalytics" element={<TryNexAnalytics />} />
            <Route path="/try-nexreq" element={<TryNexReq />} />
            <Route path="/try-nextest" element={<TryNexTest />} />
            <Route path="/try-nextrade" element={<TryNexTrade />} />
            <Route path="/try-nexsim" element={<TryNexSim />} />
            <Route path="/try-kraken" element={<TryKraken />} />
            <Route path="/hero-alternative" element={<HeroAlternative />} />
            {/* Competences pages */}
            <Route path="/about" element={<About />} />
            <Route path="/methods" element={<Methods />} />
            <Route path="/process" element={<Process />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/competences" element={<Competences />} />
            {/* Resources page */}
            <Route path="/resources" element={<Resources />} />
            {/* Agents page */}
            <Route path="/agents" element={<Agents />} />
            {/* Catch-all route - show home for any unmatched path */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {!isAlternativeHero && <Footer />}
    </div>
  )
}

function App() {
  // Get base URL - handle both development and production
  // For GitHub Pages with base './', we need to normalize it
  const baseUrl = import.meta.env.BASE_URL === './' ? '' : (import.meta.env.BASE_URL || '')

  return (
    <ThemeProvider>
      <Router basename={baseUrl}>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
