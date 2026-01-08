/**
 * Product Tools Data
 *
 * Individual product tools and features offered by NexSuite.
 * Each product represents a specific capability or workflow.
 */

export const products = [
  {
    id: 'nexdocs',
    icon: '/assets/icon_nexdocs.svg',
    title: 'NexDocs',
    subtitle: 'Documentation Generation',
    description: 'Professional documentation generation with MkDocs-style hierarchical structure, cross-file navigation, and automatic diagram generation.',
    badge: 'Platform',
    status: '✅ Production-Ready',
    features: [
      'MkDocs-style hierarchical documentation',
      'Cross-file navigation with smart import resolution',
      'Auto diagram generation (BDD, IBD, Activity, StateMachine, Requirement)',
      'HIR-based extraction for accurate documentation',
      'Export to HTML/PDF/Word formats',
      'Quality indicators and metrics',
      'Full editing capabilities'
    ],
    components: [
      { name: 'Viewer', edition: 'Free', description: 'Read-only documentation viewer' },
      { name: 'Editor', edition: 'Platform', description: 'Full editing with quality indicators' },
      { name: 'Generator', edition: 'Platform', description: 'Automated MkDocs/Sphinx generation' }
    ],
    useCases: [
      'System design documentation',
      'Requirements documentation',
      'Technical specifications',
      'Architecture documentation'
    ],
    pricing: 'Included in Platform edition',
    link: '/products/nexdocs',
    demoLink: '/try-nexdocs'
  },
  {
    id: 'nexreq',
    icon: '/assets/icon_nexreq.svg',
    title: 'NexReq',
    subtitle: 'Requirements Management',
    description: 'Comprehensive requirements management with bidirectional traceability, ASIL tracking, and change impact analysis.',
    badge: 'Standard',
    status: '✅ Production-Ready',
    features: [
      'Bidirectional traceability matrices',
      'ASIL decomposition and tracking',
      'Change impact analysis',
      'Requirement quality checking',
      'Template management',
      'Coverage analysis',
      'Integration with test management'
    ],
    components: [
      { name: 'Manager', edition: 'Standard', description: 'Traceability matrices and tracking' },
      { name: 'Validator', edition: 'Automotive', description: 'ASIL decomposition and validation' }
    ],
    useCases: [
      'Requirements traceability',
      'Safety requirements management',
      'Change impact analysis',
      'Compliance documentation'
    ],
    pricing: 'Included in Standard edition',
    link: '/products/nexreq',
    demoLink: '/try-nexreq'
  },
  {
    id: 'nextest',
    icon: '/assets/icon_nextest.svg',
    title: 'NexTest',
    subtitle: 'Test Management',
    description: 'Test case management with requirements traceability, coverage analysis, and automated test execution.',
    badge: 'Standard',
    status: '🟡 60% Ready',
    features: [
      'Test case management',
      'Requirements traceability',
      'Coverage analysis',
      'Test execution tracking',
      'Automated test generation',
      'Result reporting',
      'Integration with CI/CD'
    ],
    components: [
      { name: 'Manager', edition: 'Standard', description: 'Test case management and tracking' },
      { name: 'Executor', edition: 'Platform', description: 'Automated test execution' }
    ],
    useCases: [
      'Test planning',
      'Test execution tracking',
      'Coverage analysis',
      'Regression testing'
    ],
    pricing: 'Included in Standard edition',
    link: '/products/nextest',
    demoLink: '/try-nextest'
  },
  {
    id: 'nexviz',
    icon: '/assets/icon_nexviz.svg',
    title: 'NexViz',
    subtitle: 'Visualization',
    description: 'Interactive diagram generation and visualization with bidirectional synchronization between diagrams and code.',
    badge: 'Essential',
    status: '✅ Production-Ready',
    features: [
      'BDD, IBD, Activity, StateMachine, Requirement diagrams',
      'Interactive diagram navigation',
      'Export to PNG/SVG/PDF',
      'Bidirectional sync (diagram ↔ code)',
      'Custom styling and themes',
      'Real-time diagram updates',
      'Collaborative editing'
    ],
    components: [
      { name: 'Renderer', edition: 'Essential', description: 'Basic diagram rendering' },
      { name: 'Editor', edition: 'Platform', description: 'Interactive diagram editing' }
    ],
    useCases: [
      'System architecture visualization',
      'Behavior modeling',
      'State machine design',
      'Requirements visualization'
    ],
    pricing: 'Included in Essential edition',
    link: '/products/nexviz',
    demoLink: '/try-nexviz'
  },
  {
    id: 'nexanalytics',
    icon: '/assets/icon_nexanalytics.svg',
    title: 'NexAnalytics',
    subtitle: 'Analytics & Metrics',
    description: 'Power BI-style analytics dashboard with quality metrics, coverage analytics, and complexity analysis.',
    badge: 'Platform',
    status: '✅ Production-Ready',
    features: [
      'Quality metrics dashboard',
      'Coverage analytics',
      'Complexity analysis',
      'Trend analysis over time',
      'Custom metric definitions',
      'Real-time reporting',
      'Export to Excel/CSV'
    ],
    components: [
      { name: 'Dashboard', edition: 'Platform', description: 'Power BI-style analytics dashboard' },
      { name: 'Reports', edition: 'Platform', description: 'Automated report generation' }
    ],
    useCases: [
      'Project health monitoring',
      'Quality assurance',
      'Process improvement',
      'Compliance reporting'
    ],
    pricing: 'Included in Platform edition',
    link: '/products/nexanalytics',
    demoLink: '/try-nexanalytics'
  },
  {
    id: 'nextrade',
    icon: '/assets/icon_nextrade.svg',
    title: 'NexTrade',
    subtitle: 'Trade Studies',
    description: 'Multi-criteria decision analysis (MCDA) with AHP, sensitivity analysis, and UVL integration for configuration management.',
    badge: 'Platform',
    status: '✅ Production-Ready',
    features: [
      'MCDA (Multi-Criteria Decision Analysis)',
      'AHP (Analytic Hierarchy Process)',
      'Sensitivity analysis',
      'UVL integration for variability',
      'Decision support tools',
      'What-if scenario analysis',
      'Trade-off visualization'
    ],
    components: [
      { name: 'Analyzer', edition: 'Platform', description: 'MCDA and AHP analysis' },
      { name: 'Simulator', edition: 'Platform', description: 'What-if scenario simulation' }
    ],
    useCases: [
      'Architecture trade studies',
      'Technology selection',
      'Design optimization',
      'Risk-benefit analysis'
    ],
    pricing: 'Included in Platform edition',
    link: '/products/nextrade',
    demoLink: '/try-nextrade'
  },
  {
    id: 'nexvar',
    icon: '/assets/icon_nexvar.svg',
    title: 'NexVar',
    subtitle: 'Variability Management',
    description: 'UVL feature model management with SAT solving, Z3 solver integration, and configuration validation.',
    badge: 'Platform',
    status: '✅ Production-Ready',
    features: [
      'UVL feature models',
      'SAT solving for configuration',
      'Z3 solver integration',
      'Configuration management',
      'Constraint validation',
      'Product line engineering',
      'Variant derivation'
    ],
    components: [
      { name: 'Modeler', edition: 'Platform', description: 'UVL feature model editor' },
      { name: 'Solver', edition: 'Platform', description: 'SAT/Z3 constraint solving' }
    ],
    useCases: [
      'Product line management',
      'Configuration management',
      'Variant derivation',
      'Constraint validation'
    ],
    pricing: 'Included in Platform edition',
    link: '/products/nexvar',
    demoLink: '/try-nexvar'
  },
  {
    id: 'nexsim',
    icon: '/assets/icon_nexsim.svg',
    title: 'NexSim',
    subtitle: 'Simulation & Execution',
    description: 'State machine simulation and execution engine with action execution, debugging, and interactive testing.',
    badge: 'Platform-Full',
    status: '🟡 90% Ready',
    features: [
      'State machine simulation',
      'Execution engine',
      'Action execution',
      'Interactive debugging',
      'Step-through execution',
      'Breakpoint support',
      'Execution trace visualization'
    ],
    components: [
      { name: 'Engine', edition: 'Platform-Full', description: 'Execution and simulation engine' },
      { name: 'Debugger', edition: 'Platform-Full', description: 'Interactive debugging tools' }
    ],
    useCases: [
      'Behavior verification',
      'State machine testing',
      'System simulation',
      'Design validation'
    ],
    pricing: 'Included in Platform-Full edition',
    link: '/products/nexsim',
    demoLink: '/try-nexsim'
  },
  {
    id: 'nexsuite',
    icon: '/assets/icon_nexsuite.svg',
    title: 'NexSuite',
    subtitle: 'Integration Layer',
    description: 'Unified integration layer that connects all NexSuite products for seamless workflows and cross-product features.',
    badge: 'All Editions',
    status: '✅ Production-Ready',
    features: [
      'Unified workspace management',
      'Cross-product data sharing',
      'Integrated workflows',
      'Single sign-on (SSO)',
      'Centralized configuration',
      'Plugin architecture',
      'API gateway'
    ],
    components: [
      { name: 'Core', edition: 'All', description: 'Core integration services' },
      { name: 'API', edition: 'All', description: 'REST/GraphQL API' }
    ],
    useCases: [
      'Multi-product workflows',
      'Enterprise integration',
      'Custom tool development',
      'Third-party integrations'
    ],
    pricing: 'Included in all editions',
    link: '/products/nexsuite'
  }
]

/**
 * Get products by status
 */
export const getProductionReadyProducts = () => {
  return products.filter(p => p.status.includes('✅'))
}

export const getPlannedProducts = () => {
  return products.filter(p => p.status.includes('🟡') || p.status.includes('⏳'))
}

/**
 * Get products by edition
 */
export const getProductsByEdition = (edition) => {
  return products.filter(p => p.badge.toLowerCase().includes(edition.toLowerCase()))
}

/**
 * Get product by ID
 */
export const getProductById = (id) => {
  return products.find(p => p.id === id)
}

/**
 * Get core products (Essential/Standard)
 */
export const getCoreProducts = () => {
  return products.filter(p =>
    p.badge === 'Essential' || p.badge === 'Standard'
  )
}

/**
 * Get advanced products (Platform/Platform-Full)
 */
export const getAdvancedProducts = () => {
  return products.filter(p =>
    p.badge === 'Platform' || p.badge === 'Platform-Full'
  )
}

export default products
