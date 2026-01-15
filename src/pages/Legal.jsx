import React from 'react'
import { useTranslation } from '../utils/i18n'
import './Legal.css'

const Legal = ({ type = 'privacy' }) => {
  const { t } = useTranslation()

  const content = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 2025',
      sections: [
        {
          heading: 'Data Collection',
          text: 'NexSuite collects minimal data necessary for service operation. Model data processed by the Language Server remains local to your environment. No model content is transmitted to external servers unless explicitly configured (e.g., optional AI integrations).'
        },
        {
          heading: 'AI Data Boundaries',
          text: 'When using optional AI features (GitHub Copilot, Claude), data transmission is controlled by those services\' privacy policies. Local LSP processing does not send model data externally.'
        },
        {
          heading: 'Analytics',
          text: 'We may collect anonymous usage statistics (feature usage, error reports) to improve the product. No model content or personally identifiable information is included.'
        },
        {
          heading: 'Data Storage',
          text: 'All model data remains in your control. On-premises deployments ensure complete data sovereignty. Cloud-based viewer processes data client-side.'
        },
        {
          heading: 'Contact',
          text: 'For privacy inquiries, contact: contact@sysnex.tech'
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: January 2025',
      sections: [
        {
          heading: 'License Type',
          text: 'NexSuite is licensed under proprietary terms. Essential variant is free for evaluation and non-commercial use. Standard, Platform, and Automotive variants require commercial licenses.'
        },
        {
          heading: 'Evaluation Period',
          text: '30-day evaluation licenses are available for all commercial variants. Full feature access is provided during evaluation. No credit card required.'
        },
        {
          heading: 'Usage Restrictions',
          text: 'License terms vary by variant. Essential variant: free for non-commercial use. Commercial variants: per-seat, organization, or repository licensing as specified in your agreement.'
        },
        {
          heading: 'Support',
          text: 'Support levels vary by plan. Essential: community support. Standard: email support with SLA. Platform: priority support. Automotive: enterprise support with on-site options.'
        },
        {
          heading: 'Contact',
          text: 'For licensing inquiries, contact: contact@sysnex.tech'
        }
      ]
    },
    license: {
      title: 'License Information',
      lastUpdated: 'Last updated: January 2025',
      sections: [
        {
          heading: 'Essential Variant',
          text: 'Free for evaluation and non-commercial use. Community support via GitHub. No warranty or commercial support included.'
        },
        {
          heading: 'Commercial Variants',
          text: 'Standard, Platform, and Automotive variants require commercial licenses. Licensing units: per-seat, organization, or repository-based. Contact sales for pricing and terms.'
        },
        {
          heading: 'Evaluation Terms',
          text: '30-day evaluation licenses available. Full feature access. No credit card required. Technical support included during evaluation period.'
        },
        {
          heading: 'Intellectual Property',
          text: 'All Syscribe code, documentation, and trademarks are proprietary to SysNex. License grants usage rights only, not ownership.'
        },
        {
          heading: 'Contact',
          text: 'For licensing inquiries: contact@sysnex.tech'
        }
      ]
    },
    impressum: {
      title: 'Imprint (Impressum)',
      lastUpdated: 'Last updated: January 2025',
      sections: [
        {
          heading: 'Company Information',
          text: 'SysNex Technologies GmbH (in formation)\nSoftware Engineering & Consulting'
        },
        {
          heading: 'Address',
          text: 'Musterstraße 123\n80331 Munich\nGermany'
        },
        {
          heading: 'Contact',
          text: 'Email: contact@sysnex.tech\nPhone: +49 (0) 89 12345678'
        },
        {
          heading: 'Represented by',
          text: 'Managing Director: Max Mustermann'
        },
        {
          heading: 'Register Entry',
          text: 'Entry in the Handelsregister.\nRegister Court: Amtsgericht München\nRegister Number: HRB 123456'
        },
        {
          heading: 'VAT ID',
          text: 'VAT Identification Number according to §27 a Umsatzsteuergesetz: DE 123456789'
        }
      ]
    }
  }

  const pageContent = content[type] || content.privacy

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>{pageContent.title}</h1>
          <p className="legal-last-updated">{pageContent.lastUpdated}</p>

          {pageContent.sections.map((section, index) => (
            <section key={index} className="legal-section">
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Legal




