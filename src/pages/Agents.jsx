import React from 'react'
import './Page.css'

function Agents() {
    const agents = [
        {
            name: 'Antigravity',
            provider: 'Google DeepMind',
            icon: '🤖',
            description: 'Advanced agentic coding assistant specialized in multi-file refactoring, complex implementation planning, and automated testing.',
            capabilities: [
                'Multi-file code editing and refactoring',
                'Complex implementation planning',
                'Automated testing and verification',
                'Architecture design and analysis'
            ],
            focus: 'SysML v2 implementation, API development, visual modeling',
            status: 'Active',
            type: 'available' // for insight-card class
        },
        {
            name: 'Claude',
            provider: 'Anthropic',
            icon: '🧠',
            description: 'Conversational AI assistant with strong reasoning capabilities for technical documentation, code review, and problem-solving.',
            capabilities: [
                'Technical documentation generation',
                'Code review and analysis',
                'Requirements clarification',
                'Design pattern recommendations'
            ],
            focus: 'Documentation, requirements analysis, code review',
            status: 'Active',
            type: 'available'
        },
        {
            name: 'GitHub Copilot',
            provider: 'GitHub/OpenAI',
            icon: '💡',
            description: 'AI pair programmer providing real-time code suggestions and completions directly in your IDE.',
            capabilities: [
                'Real-time code completion',
                'Function and class generation',
                'Test case suggestions',
                'Documentation generation'
            ],
            focus: 'IDE integration, code completion, rapid prototyping',
            status: 'Active',
            type: 'available'
        }
    ]

    const workflows = [
        {
            phase: 'Planning',
            icon: '📋',
            steps: [
                'Create implementation_plan.md in artifacts directory',
                'Document proposed changes by component',
                'Request user review via notify_user',
                'Iterate based on feedback'
            ]
        },
        {
            phase: 'Execution',
            icon: '⚙️',
            steps: [
                'Update task.md with granular checklist items',
                'Mark items [/] when in progress, [x] when complete',
                'Make code changes across multiple files',
                'Run automated tests and verification'
            ]
        },
        {
            phase: 'Verification',
            icon: '✅',
            steps: [
                'Test changes locally (dev servers, unit tests)',
                'Create walkthrough.md documenting results',
                'Include screenshots/recordings of UI changes',
                'Validate against requirements'
            ]
        }
    ]

    const bestPractices = [
        {
            category: 'Code Quality',
            icon: '🎯',
            practices: [
                'Follow existing patterns and conventions',
                'Maintain strict TypeScript typing',
                'Write comprehensive tests',
                'Document complex logic'
            ]
        },
        {
            category: 'Communication',
            icon: '💬',
            practices: [
                'Use markdown formatting for clarity',
                'Provide file links with proper paths',
                'Embed screenshots/videos in walkthroughs',
                'Keep messages concise and actionable'
            ]
        },
        {
            category: 'File Management',
            icon: '📁',
            practices: [
                'Use absolute paths for all file operations',
                'Organize artifacts properly',
                'Keep project code in workspace directories',
                'Avoid writing to temporary locations'
            ]
        }
    ]

    return (
        <div className="page-content">
            {/* Hero Section */}
            <section className="page-hero-section" style={{ paddingBottom: '2rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.8fr)', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>AI Agents</h1>
                            <p className="page-hero-description" style={{ textAlign: 'left', margin: '0', maxWidth: 'none' }}>
                                Leveraging advanced AI agents to accelerate SysML v2 tooling development,
                                from implementation planning to automated testing and verification.
                            </p>
                        </div>

                        {/* Hero Visual Card */}
                        <div className="insight-card spotlight-card" style={{
                            padding: '2rem',
                            background: 'linear-gradient(135deg, rgba(13,13,13,0.95), rgba(0,180,216,0.05))',
                            transform: 'rotate(-2deg)',
                            border: '1px solid rgba(0,180,216,0.2)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Antigravity</div>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Claude</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💡</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Copilot</div>
                                </div>
                            </div>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(0,180,216,0.1)',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                color: 'var(--turquoise)',
                                border: '1px solid rgba(0,180,216,0.2)'
                            }}>
                                <strong>Unified Agentic Workflow</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Agents */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Active Agents</h2>
                    <div className="insights-grid">
                        {agents.map((agent, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className={`glass-card insight-card insight-card--${agent.type}`}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="animate-float">{agent.icon}</div>
                                <span className="insight-eyebrow text-gradient-secondary">{agent.provider}</span>
                                <h3 className="insight-title">{agent.name}</h3>
                                <p className="insight-description" style={{ marginBottom: '1.5rem' }}>{agent.description}</p>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', color: 'var(--turquoise)', marginBottom: '0.75rem' }}>Capabilities</h4>
                                    <ul className="method-list">
                                        {agent.capabilities.map((capability, i) => (
                                            <li key={i}>{capability}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{
                                    padding: '0.75rem',
                                    background: 'rgba(0,180,216,0.05)',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    border: '1px solid rgba(0,180,216,0.1)'
                                }}>
                                    <strong style={{ color: 'var(--turquoise)', fontSize: '0.9rem' }}>Current Focus:</strong>
                                    <br />
                                    <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{agent.focus}</span>
                                </div>

                                <div className="status-badge" style={{ marginBottom: 0 }}>
                                    {agent.status}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Workflows */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">Agent Workflows</h2>
                    <p className="section-subtitle">
                        Structured approach to development tasks ensuring quality and consistency
                    </p>

                    <div className="benefits-grid">
                        {workflows.map((workflow, index) => (
                            <div key={index} className="benefit-item">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{workflow.icon}</div>
                                <h3 className="benefit-title">{workflow.phase}</h3>
                                <ol className="roadmap-list" style={{ marginTop: '1rem' }}>
                                    {workflow.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Best Practices */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Best Practices</h2>

                    <div className="insights-grid">
                        {bestPractices.map((category, index) => (
                            <div key={index} className="insight-card">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
                                <h3 className="insight-title">{category.category}</h3>
                                <ul className="method-list">
                                    {category.practices.map((practice, i) => (
                                        <li key={i}>{practice}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="roadmap-section">
                <div className="container">
                    <h2 className="section-title">Technology Stack</h2>

                    <div className="roadmap-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="architecture-grid">
                            <div>
                                <h4 className="card-title">Backend</h4>
                                <p className="card-description">
                                    Rust (SysML v2 extension, LSP server)
                                </p>
                            </div>

                            <div>
                                <h4 className="card-title">Frontend</h4>
                                <p className="card-description">
                                    React, TypeScript, React Flow
                                </p>
                            </div>

                            <div>
                                <h4 className="card-title">API</h4>
                                <p className="card-description">
                                    OpenAPI/Swagger specification
                                </p>
                            </div>

                            <div>
                                <h4 className="card-title">Build Tools</h4>
                                <p className="card-description">
                                    Vite, npm
                                </p>
                            </div>

                            <div>
                                <h4 className="card-title">Testing</h4>
                                <p className="card-description">
                                    Vitest, Playwright
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Current Initiatives */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Current Initiatives</h2>

                    <div className="roadmap-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="benefit-item">
                            <h3 className="benefit-title">Kraken Hub API Server</h3>
                            <p className="benefit-description">Phase A implementation with diagnostics and impact analysis</p>
                        </div>

                        <div className="benefit-item">
                            <h3 className="benefit-title">Visual Modeling Frontend</h3>
                            <p className="benefit-description">React Flow-based SysML v2 diagram rendering</p>
                        </div>

                        <div className="benefit-item">
                            <h3 className="benefit-title">IDE Feature Analysis</h3>
                            <p className="benefit-description">Parser fixes and LSP server enhancements</p>
                        </div>

                        <div className="benefit-item">
                            <h3 className="benefit-title">Website Optimization</h3>
                            <p className="benefit-description">sysnex-labs.github.io improvements and feature showcase</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="page-section-alt" style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div className="page-cta">
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Ready to Accelerate Your Development?</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                            Leverage AI agents to streamline your SysML v2 development workflow
                        </p>
                        <div className="hero-cta">
                            <a href="/products" className="btn primary">Explore Products</a>
                            <a href="/contact" className="btn ghost">Get in Touch</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Agents
