import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TryYourselfEditor from '../../components/TryYourselfEditor/TryYourselfEditor'
import SimulationView from '../../components/SimulationView/SimulationView'
import '../Page.css'
import '../TryYourself.css'
import './TryNexSim.css'

const DEFAULT_SIM_EXAMPLE = `package 'Battery Charging Simulation' {
    doc /*
     * Simulation of battery charging behavior
     */

    private import ScalarValues::*;

    calc def ChargingTime {
        in batteryCapacity : Real;
        in chargerPower : Real;
        return chargingTime : Real = batteryCapacity / chargerPower;
    }

    calc def StateOfCharge {
        in currentCharge : Real;
        in capacity : Real;
        return soc : Real = (currentCharge / capacity) * 100.0;
    }

    action def ChargingCycle {
        doc /* Simulate battery charging process */

        in initialSOC : Real = 20.0; // %
        in targetSOC : Real = 80.0; // %
        in chargePower : Real = 50.0; // kW

        action monitorVoltage {
            out voltage : Real;
        }

        action monitorCurrent {
            out current : Real;
        }

        action controlCharging {
            in targetPower : Real;
            out actualPower : Real;
        }

        // Simulation flow
        first start;
        then monitorVoltage;
        then monitorCurrent;
        then controlCharging;
    }

    state def ChargingState {
        doc /* State machine for charge controller */

        entry; then idle;

        state idle {
            doc /* Waiting for charging to begin */
        }

        state precharge {
            doc /* Initial precharge phase */
        }

        state constantCurrent {
            doc /* Constant current charging phase */
        }

        state constantVoltage {
            doc /* Constant voltage charging phase */
        }

        state complete {
            doc /* Charging complete */
        }

        transition first idle
            accept plugInDetected
            then precharge;

        transition precharge
            accept prechargeDone
            then constantCurrent;

        transition constantCurrent
            accept voltageReached
            then constantVoltage;

        transition constantVoltage
            accept chargeComplete
            then complete;
    }

    part def Battery {
        doc /* Battery system with charging simulation */
        attribute capacity : Real = 75.0; // kWh
        attribute currentCharge : Real;
        attribute voltage : Real;
        attribute current : Real;

        // Calculation usages
        calc chargingTime : ChargingTime;
        calc soc : StateOfCharge;
    }

    // Action instances for simulation
    action chargeCycle : ChargingCycle;

    // Part instances
    part mainBattery : Battery;
}`

export default function TryNexSim() {
  const [editorCode, setEditorCode] = useState(DEFAULT_SIM_EXAMPLE)
  const [showTips, setShowTips] = useState(true)

  return (
    <div className="page">
      <section className="page-hero-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <img
              src="/assets/icon_nexsim.svg"
              alt="NexSim"
              style={{ height: '80px', width: 'auto', maxWidth: '80px', objectFit: 'contain' }}
            />
            <div>
              <h1>Try NexSim - Interactive Simulation Demo</h1>
              <p className="page-hero-description">
                Experience real-time behavioral simulation with physics-based calculations, 
                state machine execution, and interactive visualization. Watch your SysML v2 models 
                come to life with WASM-powered simulation capabilities.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link to="/products/nexsim" className="btn ghost">
              ← Learn More About NexSim
            </Link>
            <button 
              className="btn secondary"
              onClick={() => setShowTips(!showTips)}
            >
              {showTips ? 'Hide' : 'Show'} Quick Start
            </button>
          </div>

          {showTips && (
            <div className="insight-card" style={{ marginTop: '2rem' }}>
              <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🚀 Quick Start Guide</h2>
                <p className="section-subtitle" style={{ fontSize: '1rem', marginBottom: 0 }}>Get started in 3 simple steps</p>
              </div>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--turquoise)',
                      color: 'var(--dark-bg)',
                      borderRadius: '50%',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>1</div>
                    <h3 className="benefit-title" style={{ margin: 0 }}>Edit the Code</h3>
                  </div>
                  <p className="benefit-description">
                    Modify the SysML v2 simulation code in the editor. Try changing battery capacity, 
                    charging power, or add new states to the state machine.
                  </p>
                </div>
                <div className="benefit-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--turquoise)',
                      color: 'var(--dark-bg)',
                      borderRadius: '50%',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>2</div>
                    <h3 className="benefit-title" style={{ margin: 0 }}>Start Simulation</h3>
                  </div>
                  <p className="benefit-description">
                    Click the "Start Simulation" button in the Execution Flow tab to begin the 
                    real-time physics simulation. Watch the gauges update live!
                  </p>
                </div>
                <div className="benefit-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--turquoise)',
                      color: 'var(--dark-bg)',
                      borderRadius: '50%',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>3</div>
                    <h3 className="benefit-title" style={{ margin: 0 }}>Explore Results</h3>
                  </div>
                  <p className="benefit-description">
                    View charging curves, state transitions, message sequence charts, and 
                    execution timelines. Adjust simulation speed to see details.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <span className="status-badge">⚡ Real-Time Physics</span>
            <span className="status-badge">📊 Interactive Charts</span>
            <span className="status-badge">🔄 State Machines</span>
            <span className="status-badge">📈 Message Sequence</span>
            <span className="status-badge">🎯 WASM-Powered</span>
          </div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <div className="try-yourself-page-grid">
            <div className="editor-column">
              <TryYourselfEditor
                defaultCode={DEFAULT_SIM_EXAMPLE}
                defaultExample="Battery Charging Simulation"
                onCodeChange={setEditorCode}
              />
            </div>
            <div className="documentation-column">
              <SimulationView code={editorCode} />
            </div>
          </div>

          <div className="try-yourself-footer">
            <div className="insights-grid" style={{ marginTop: '2rem' }}>
              <div className="insight-card">
                <span className="insight-eyebrow">What You're Seeing</span>
                <h3 className="insight-title">💡 NexSim Demo</h3>
                <p className="insight-description">
                  This demo showcases <strong>NexSim</strong>, our advanced simulation engine that 
                  extracts calculations, state machines, and actions from SysML v2 code and executes 
                  them in real-time. The physics-based battery charging simulation demonstrates 
                  CC-CV (Constant Current - Constant Voltage) charging with live visualization.
                </p>
              </div>
              <div className="insight-card">
                <span className="insight-eyebrow">Key Capabilities</span>
                <h3 className="insight-title">🎯 Features</h3>
                <ul className="roadmap-list">
                  <li><strong>Real-Time Physics:</strong> CC-CV charging algorithm with accurate SOC, voltage, current, and temperature calculations</li>
                  <li><strong>Interactive Visualization:</strong> Live-updating gauges, charts, and message sequence diagrams</li>
                  <li><strong>State Machine Execution:</strong> Visualize state transitions and action flows</li>
                  <li><strong>WASM Integration:</strong> Fast, browser-based simulation powered by WebAssembly</li>
                </ul>
              </div>
              <div className="insight-card">
                <span className="insight-eyebrow">Next Steps</span>
                <h3 className="insight-title">🚀 Get Started</h3>
                <p className="insight-description">
                  Want to use this in your projects? Check out the{' '}
                  <Link to="/platforms">VS Code Extension</Link> for full IDE integration, 
                  or explore <Link to="/products/nexsim">NexSim documentation</Link> for 
                  advanced features and API details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
