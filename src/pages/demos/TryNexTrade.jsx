import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TryYourselfEditor from '../../components/TryYourselfEditor/TryYourselfEditor'
import TradeStudyView from '../../components/TradeStudyView/TradeStudyView'
import '../Page.css'
import '../TryYourself.css'

const DEFAULT_TRADE_EXAMPLE = `package 'Vehicle Powertrain Trade Study' {
    doc /*
     * Trade study comparing electric vs hybrid powertrains
     */

    private import ScalarValues::*;

    // Base powertrain definition
    part def Powertrain {
        doc /* Base powertrain system */
        attribute cost : Real;
        attribute range : Real;
        attribute power : Real;
        attribute emissions : Real;
    }

    // Variant 1: Electric Powertrain
    part def ElectricPowertrain :> Powertrain {
        doc /*
         * Pure electric configuration
         * Zero emissions, higher upfront cost
         */
        :>> cost = 35000.0; // USD
        :>> range = 400.0; // km
        :>> power = 150.0; // kW
        :>> emissions = 0.0; // g CO2/km

        part battery {
            attribute capacity : Real = 75.0; // kWh
        }
        part motor {
            attribute efficiency : Real = 0.92;
        }
    }

    // Variant 2: Hybrid Powertrain
    part def HybridPowertrain :> Powertrain {
        doc /*
         * Hybrid electric configuration
         * Lower upfront cost, reduced emissions
         */
        :>> cost = 28000.0; // USD
        :>> range = 600.0; // km
        :>> power = 130.0; // kW
        :>> emissions = 95.0; // g CO2/km

        part battery {
            attribute capacity : Real = 10.0; // kWh
        }
        part electricMotor {
            attribute power : Real = 50.0; // kW
        }
        part combustionEngine {
            attribute power : Real = 80.0; // kW
        }
    }

    // Analysis case for trade study
    analysis def PowertrainTradeStudy {
        doc /*
         * Evaluate electric and hybrid options across
         * cost, range, performance, and sustainability metrics
         */

        subject vehicle : Vehicle;

        objective costObjective {
            doc /* Minimize total cost of ownership */
        }

        objective rangeObjective {
            doc /* Maximize driving range */
        }

        objective performanceObjective {
            doc /* Maximize power output */
        }

        objective emissionsObjective {
            doc /* Minimize CO2 emissions */
        }
    }

    // Vehicle definition using powertrain variants
    part def Vehicle {
        doc /* Vehicle with alternative powertrain options */
        part powertrain : Powertrain;
    }

    // Create variant instances
    part electricVehicle : Vehicle {
        part redefines powertrain : ElectricPowertrain;
    }

    part hybridVehicle : Vehicle {
        part redefines powertrain : HybridPowertrain;
    }

    // Analysis instance
    analysis tradeStudy : PowertrainTradeStudy;
}`

export default function TryNexTrade() {
  const [editorCode, setEditorCode] = useState(DEFAULT_TRADE_EXAMPLE)

  return (
    <div className="page">
      <section className="page-hero-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img
              src="/assets/icon_nextrade.svg"
              alt="NexTrade"
              style={{height: '64px', width: 'auto', maxWidth: '64px', objectFit: 'contain'}}
            />
            <div>
              <h1 style={{ margin: 0, marginBottom: '0.25rem' }}>Try NexTrade</h1>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', opacity: 0.9 }}>
                Interactive Trade Study Analysis
              </p>
            </div>
          </div>
          <p className="page-hero-description" style={{ fontSize: '1.125rem', lineHeight: '1.7', maxWidth: '800px' }}>
            Experience powerful trade study management with real-time variant extraction, objective tracking, 
            and automated decision analysis. Edit the SysML v2 code below to see instant WASM-powered insights.
          </p>
          <div style={{ 
            marginTop: '1.5rem', 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Link to="/products/nextrade" className="btn ghost">
              ← Back to NexTrade Details
            </Link>
            <div style={{ 
              padding: '0.75rem 1rem', 
              background: 'rgba(139, 92, 246, 0.1)', 
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              💡 <strong>Tip:</strong> Modify the code to see real-time analysis updates
            </div>
          </div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <div className="try-yourself-page-grid">
            <div className="editor-column">
              <TryYourselfEditor
                defaultCode={DEFAULT_TRADE_EXAMPLE}
                defaultExample="Vehicle Powertrain Trade Study"
                onCodeChange={setEditorCode}
              />
            </div>
            <div className="documentation-column">
              <TradeStudyView code={editorCode} />
            </div>
          </div>

          <div className="try-yourself-footer">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                padding: '1.25rem',
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
                <strong style={{ color: 'var(--brand-purple)', display: 'block', marginBottom: '0.25rem' }}>
                  Variant Extraction
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Automatically identifies and compares design variants
                </p>
              </div>
              <div style={{
                padding: '1.25rem',
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
                <strong style={{ color: 'var(--brand-purple)', display: 'block', marginBottom: '0.25rem' }}>
                  Decision Matrix
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Visual comparison tables and scoring analysis
                </p>
              </div>
              <div style={{
                padding: '1.25rem',
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
                <strong style={{ color: 'var(--brand-purple)', display: 'block', marginBottom: '0.25rem' }}>
                  Objective Tracking
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Tracks and analyzes optimization objectives
                </p>
              </div>
            </div>
            <p className="try-yourself-note">
              <strong>Powered by WASM:</strong> All analysis runs in your browser using WebAssembly for 
              instant results. Check out the{' '}
              <Link to="/platforms">VS Code Extension</Link> for advanced features and full IDE integration.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
