import React from 'react';
import { Download, Search, CheckSquare, Rocket, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import './JourneySection.css';

const journeySteps = [
    {
        title: 'Download',
        description: 'Install SysScribe from VS Code Marketplace',
        detail: 'Free, 2-minute setup',
        icon: <Download size={32} color="#00B4D8" />,
        id: 'download'
    },
    {
        title: 'Explore',
        description: 'Try core LSP features',
        detail: 'Completion, navigation, diagnostics',
        icon: <Search size={32} color="#00B4D8" />,
        id: 'explore'
    },
    {
        title: 'Evaluate',
        description: 'Test on real SysML v2 models',
        detail: '100% free, no time limit',
        icon: <CheckSquare size={32} color="#FBBF24" />,
        id: 'evaluate',
        active: true
    },
    {
        title: 'Upgrade',
        description: 'Apply for Standard/Platform beta',
        detail: '6-month free trial, no credit card',
        icon: <Rocket size={32} color="#00B4D8" />,
        id: 'upgrade'
    },
    {
        title: 'Influence',
        description: 'Shape the roadmap',
        detail: 'Beta feedback, feature requests',
        icon: <Users size={32} color="#00B4D8" />,
        id: 'influence'
    }
];

const JourneySection = () => {
    return (
        <div className="early-adopter-journey">
            <h2 className="journey-title">SysScribe Early Adopter <span>Journey</span></h2>

            <div className="journey-steps">
                {journeySteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className={`journey-card ${step.active ? 'active' : ''}`}
                    >
                        <div className="journey-icon">
                            {step.icon}
                        </div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                        <p className="detail">{step.detail}</p>
                    </motion.div>
                ))}
            </div>

            <div className="journey-footer">
                <p className="journey-tagline">Faster Modeling. Smarter Models. Transparent Roadmap.</p>
                <button className="btn-primary-large" onClick={() => window.location.href = '/contact'}>
                    Start Your Journey
                </button>
            </div>
        </div>
    );
};

export default JourneySection;
