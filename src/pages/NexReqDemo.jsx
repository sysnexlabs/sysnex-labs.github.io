import React, { useState } from 'react'
import RequirementsView from '../components/RequirementsView/RequirementsView'
import './NexReqDemo.css'

const DEMO_CODE = `package NExReq {
    /**
     * NExReq - Next-Generation Requirements Management
     *
     * Automated traceability between requirements, implementations, and verifications
     * Real-time coverage analysis and gap detection
     */

    // === REQUIREMENTS ===

    requirement def SafetyRequirement {
        doc /* System must operate safely under all conditions */
        subject vehicle : Vehicle;

        require that (vehicle.speed <= vehicle.maxSpeed);
    }

    requirement def PerformanceRequirement {
        doc /* System must achieve target performance metrics */
        subject vehicle : Vehicle;

        require that (vehicle.acceleration >= vehicle.minAcceleration);
    }

    requirement def ReliabilityRequirement {
        doc /* System must maintain 99.9% uptime */
        subject vehicle : Vehicle;
    }

    // === IMPLEMENTATIONS ===

    part def Vehicle {
        doc /* Vehicle implementation with safety features */

        attribute speed : Real;
        attribute maxSpeed : Real = 120.0;
        attribute acceleration : Real;
        attribute minAcceleration : Real = 2.5;

        part safetySystem : SafetySystem;
        part performanceMonitor : PerformanceMonitor;
    }

    part def SafetySystem {
        doc /* Safety monitoring and control system */

        action monitorSpeed {
            doc /* Continuously monitor vehicle speed */
        }

        action enforceLimits {
            doc /* Enforce safety limits */
        }
    }

    part def PerformanceMonitor {
        doc /* Performance tracking system */

        action trackAcceleration {
            doc /* Track acceleration metrics */
        }
    }

    // === VERIFICATIONS ===

    verification def SafetyTest {
        doc /* Comprehensive safety validation */

        objective verify SafetyRequirement;

        action testSpeedLimits {
            doc /* Test speed limit enforcement */
        }
    }

    verification def PerformanceTest {
        doc /* Performance benchmarking */

        objective verify PerformanceRequirement;

        action benchmarkAcceleration {
            doc /* Measure acceleration performance */
        }
    }

    verification def ReliabilityTest {
        doc /* Long-term reliability testing */

        objective verify ReliabilityRequirement;

        action runDurationTest {
            doc /* 72-hour continuous operation test */
        }
    }

    // === TRACEABILITY LINKS ===

    // Satisfy statements link requirements to implementations
    satisfy SafetyRequirement by Vehicle;
    satisfy PerformanceRequirement by Vehicle;
    satisfy ReliabilityRequirement by Vehicle;

    // Verify statements link requirements to verifications
    verify SafetyRequirement by SafetyTest;
    verify PerformanceRequirement by PerformanceTest;
    verify ReliabilityRequirement by ReliabilityTest;
}
`

export default function NexReqDemo() {
  const [code, setCode] = useState(DEMO_CODE)
  const [viewMode, setViewMode] = useState('split') // 'split', 'code', 'requirements'

  return (
    <div className="try-yourself-container">
      <div className="demo-header">
        <div className="demo-title-section">
          <h1>NExReq - Requirements Traceability Demo</h1>
          <p className="demo-subtitle">
            Automated bidirectional traceability between requirements, implementations, and verifications
          </p>
        </div>

        <div className="view-mode-selector">
          <button
            className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split View
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'code' ? 'active' : ''}`}
            onClick={() => setViewMode('code')}
          >
            Code Only
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'requirements' ? 'active' : ''}`}
            onClick={() => setViewMode('requirements')}
          >
            Analysis Only
          </button>
        </div>
      </div>

      <div className={`demo-content ${viewMode}`}>
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className="code-panel">
            <div className="panel-header">
              <h3>SysML v2 Requirements Model</h3>
              <div className="panel-actions">
                <button
                  className="reset-btn"
                  onClick={() => setCode(DEMO_CODE)}
                  title="Reset to original code"
                >
                  Reset
                </button>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder="Write SysML v2 requirements here..."
            />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'requirements') && (
          <div className="requirements-panel">
            <div className="panel-header">
              <h3>Live Requirements Analysis</h3>
              <div className="panel-info">
                Powered by Rust WASM • Real-time extraction
              </div>
            </div>
            <div className="requirements-view-container">
              <RequirementsView code={code} />
            </div>
          </div>
        )}
      </div>

      <div className="demo-features">
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h4>Bidirectional Traceability</h4>
          <p>Automatic linking between requirements, implementations, and verifications using <code>satisfy</code> and <code>verify</code> statements</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h4>Coverage Metrics</h4>
          <p>Real-time calculation of verification and satisfaction coverage percentages</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h4>Gap Detection</h4>
          <p>Instant identification of unverified or unsatisfied requirements</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h4>Traceability Matrix</h4>
          <p>Interactive matrix view showing all requirement relationships</p>
        </div>
      </div>
    </div>
  )
}
