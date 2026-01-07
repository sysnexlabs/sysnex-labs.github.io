import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TryYourselfEditor from '../../components/TryYourselfEditor/TryYourselfEditor'
import TestingView from '../../components/TestingView/TestingView'
import '../Page.css'
import '../TryYourself.css'

const DEFAULT_TESTING_EXAMPLE = `package 'Battery Management Testing' {
    doc /*
     * Test suite for battery management system verification
     */

    private import ScalarValues::*;

    part def BatteryManagementSystem {
        doc /* BMS controls charging, monitoring, and safety */
        attribute voltage : Real;
        attribute current : Real;
        attribute temperature : Real;
        attribute stateOfCharge : Real; // 0-100%
    }

    // Safety requirements
    requirement def OverVoltageProtectionReq {
        doc /* BMS must disconnect at >4.2V per cell */
        subject bms : BatteryManagementSystem;
        attribute maxVoltage : Real = 4.2;
    }

    requirement def UnderVoltageProtectionReq {
        doc /* BMS must disconnect at <2.7V per cell */
        subject bms : BatteryManagementSystem;
        attribute minVoltage : Real = 2.7;
    }

    requirement def ThermalProtectionReq {
        doc /* BMS must shut down if temperature exceeds 60°C */
        subject bms : BatteryManagementSystem;
        attribute maxTemp : Real = 60.0;
    }

    requirement def ChargeCycleReq {
        doc /* BMS must complete full charge cycle safely */
        subject bms : BatteryManagementSystem;
    }

    // Requirement instances
    requirement overVoltageProtection : OverVoltageProtectionReq;
    requirement underVoltageProtection : UnderVoltageProtectionReq;
    requirement thermalProtection : ThermalProtectionReq;
    requirement chargeCycle : ChargeCycleReq;

    // Verification cases
    verification def OvervoltageProtectionTest {
        doc /*
         * Verify that BMS disconnects when cell voltage exceeds 4.2V
         *
         * Test procedure:
         * 1. Initialize BMS with nominal voltage (3.7V)
         * 2. Gradually increase voltage to 4.3V
         * 3. Assert that disconnect signal is triggered at 4.2V
         */
        subject testBMS : BatteryManagementSystem;

        objective {
            verify overVoltageProtection;
        }

        // Test steps as actions with succession
        action def TestSetup {
            doc /* Initialize BMS with safe parameters */
        }

        action def ApplyOvervoltage {
            doc /* Apply voltage above threshold */
        }

        action def VerifyDisconnect {
            doc /* Confirm disconnect signal is active */
        }

        first action testSetup : TestSetup;
        then action applyOvervoltage : ApplyOvervoltage;
        then action verifyDisconnect : VerifyDisconnect;
        then done;

        // Assertions with constraint expressions
        assert constraint voltageWithinLimit { testBMS.voltage <= 4.2 }
        assert constraint disconnectActive { testBMS.voltage > 4.2 implies testBMS.disconnectSignal == true }
        assert constraint currentZero { testBMS.current == 0.0 }
    }

    verification def ThermalShutdownTest {
        doc /*
         * Verify thermal protection activates at 60°C
         *
         * Test procedure:
         * 1. Initialize BMS at normal temperature (25°C)
         * 2. Gradually increase temperature to 65°C
         * 3. Assert that shutdown is triggered at 60°C
         */
        subject testBMS : BatteryManagementSystem;

        objective {
            verify thermalProtection;
        }

        action def InitializeNormalTemp {
            doc /* Set initial temperature to 25°C */
        }

        action def IncreaseTemperature {
            doc /* Ramp temperature to 65°C */
        }

        action def VerifyShutdown {
            doc /* Confirm shutdown signal is active */
        }

        first action initializeNormalTemp : InitializeNormalTemp;
        then action increaseTemperature : IncreaseTemperature;
        then action verifyShutdown : VerifyShutdown;
        then done;

        // Assertions
        assert constraint tempWithinLimit { testBMS.temperature <= 60.0 }
        assert constraint shutdownTriggered { testBMS.temperature > 60.0 implies testBMS.shutdownSignal == true }
    }

    verification def ChargeCycleTest {
        doc /*
         * Verify complete charge cycle from 20% to 100%
         *
         * Acceptance criteria:
         * - Charging completes without errors
         * - State of charge reaches 100%
         * - No voltage or temperature violations
         */
        subject testBMS : BatteryManagementSystem;

        objective {
            verify chargeCycle;
        }

        action def InitializeCharge {
            doc /* Set initial SOC to 20% */
        }

        action def PerformCharge {
            doc /* Execute charging algorithm */
        }

        action def MonitorCharging {
            doc /* Monitor voltage and temperature during charge */
        }

        action def ValidateResults {
            doc /* Check final state */
        }

        first action initializeCharge : InitializeCharge;
        then action performCharge : PerformCharge;
        then action monitorCharging : MonitorCharging;
        then action validateResults : ValidateResults;
        then done;

        // Assertions for charge cycle
        assert constraint socReached { testBMS.stateOfCharge >= 100.0 }
        assert constraint noVoltageViolation { testBMS.voltage <= 4.2 }
        assert constraint noTempViolation { testBMS.temperature <= 60.0 }
        assert constraint chargingComplete { testBMS.chargingState == 'complete' }
    }

    verification def IntegrationTest {
        doc /*
         * Comprehensive integration test covering multiple scenarios
         */
        subject testBMS : BatteryManagementSystem;

        objective {
            verify overVoltageProtection;
            verify underVoltageProtection;
            verify thermalProtection;
        }
    }

    // Test scenarios using use case syntax
    use case def NormalChargingScenario {
        doc /*
         * Scenario: User initiates normal charging from low battery
         *
         * Preconditions: Battery at 20% charge, temperature nominal
         * Expected outcome: Battery charges to 100% without protection triggers
         */

        subject chargingBMS : BatteryManagementSystem;

        // Scenario steps as actions
        action def StartCharging {
            doc /* User connects charger */
        }

        action def MonitorCharging {
            doc /* BMS monitors voltage and temperature during charge */
        }

        action def CompleteCharging {
            doc /* Charging completes successfully */
        }

        first action startCharging : StartCharging;
        then action monitorCharging : MonitorCharging;
        then action completeCharging : CompleteCharging;
        then done;

        // Include verifications for this scenario
        include verification OvervoltageProtectionTest;
        include verification ChargeCycleTest;
    }

    use case def EmergencyShutdownScenario {
        doc /*
         * Scenario: BMS handles critical temperature event
         *
         * Preconditions: Battery charging, temperature sensor functional
         * Expected outcome: BMS shuts down safely when temperature exceeds threshold
         */

        subject emergencyBMS : BatteryManagementSystem;

        action def DetectOvertemperature {
            doc /* Temperature exceeds 60°C */
        }

        action def TriggerShutdown {
            doc /* BMS initiates emergency shutdown */
        }

        action def VerifySafety {
            doc /* Confirm all systems safe */
        }

        first action detectOvertemperature : DetectOvertemperature;
        then action triggerShutdown : TriggerShutdown;
        then action verifySafety : VerifySafety;
        then done;

        include verification ThermalShutdownTest;
    }

    // Create test BMS instances
    part testBMS1 : BatteryManagementSystem;
    part testBMS2 : BatteryManagementSystem;

    // Satisfaction relationships
    satisfy overVoltageProtection by testBMS1;
    satisfy underVoltageProtection by testBMS1;
    satisfy thermalProtection by testBMS2;
    satisfy chargeCycle by testBMS2;

    // Verification relationships (standalone statements)
    verify overVoltageProtection by OvervoltageProtectionTest;
    verify underVoltageProtection by IntegrationTest;
    verify thermalProtection by ThermalShutdownTest;
    verify chargeCycle by ChargeCycleTest;
}`

/**
 * NexTest Interactive Demo
 *
 * Testing and verification with WASM-powered extraction
 */
export default function TryNexTest() {
  const [editorCode, setEditorCode] = useState(DEFAULT_TESTING_EXAMPLE)

  return (
    <div className="page">
      <section className="page-hero-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img
              src="/assets/icon_nextest.svg"
              alt="NexTest"
              style={{height: '60px', width: 'auto', maxWidth: '60px', objectFit: 'contain'}}
            />
            <h1>Try NexTest</h1>
          </div>
          <p className="page-hero-description">
            Experience comprehensive model-based testing with live extraction of test cases, assertions, scenarios, 
            and succession flows. See real-time coverage analysis, traceability mapping, and constraint expression 
            evaluation. All powered by Rust/WASM backend for maximum performance.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/products/nextest" className="btn ghost">
              ← Back to NexTest Details
            </Link>
          </div>
        </div>
      </section>

      <section className="page-content-section">
        <div className="container">
          <div className="try-yourself-page-grid">
            <div className="editor-column">
              <TryYourselfEditor
                defaultCode={DEFAULT_TESTING_EXAMPLE}
                defaultExample="Battery Management Testing"
                onCodeChange={setEditorCode}
              />
            </div>
            <div className="documentation-column">
              <TestingView code={editorCode} />
            </div>
          </div>

          <div className="try-yourself-footer">
            <p className="try-yourself-note">
              <strong>🧪 NexTest: Comprehensive Model-Based Testing</strong> - All powered by Rust/WASM backend for blazing-fast performance.
              Test management features that go beyond traditional tools:
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.9em', lineHeight: '1.6' }}>
              <li><strong>✓ Assertion Extraction:</strong> Automatically extracts assertions with full constraint expression parsing from verification cases</li>
              <li><strong>✓ Succession Flow Analysis:</strong> Extracts action sequences with "first/then" relationships for test step validation</li>
              <li><strong>✓ Scenario Management:</strong> Use case extraction with included verifications and action ordering</li>
              <li><strong>✓ Coverage Calculation:</strong> Real-time requirement coverage analysis with unverified requirement identification</li>
              <li><strong>✓ Traceability Matrix:</strong> Bidirectional mapping between requirements and verifications</li>
              <li><strong>✓ Backend Architecture:</strong> All logic runs in Rust/WASM - web UI is purely frontend for instant feedback</li>
            </ul>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', borderLeft: '3px solid #667eea' }}>
              <p style={{ margin: 0, fontSize: '0.9em' }}>
                <strong>💡 Try it:</strong> Click the "Assertions" tab to see real-time extraction from the first verification case.
                Then explore "Scenarios" for succession flow analysis and "Coverage" for requirement traceability.
              </p>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.85em', opacity: 0.8 }}>
              For full test automation with CI/CD integration and advanced features, check out the{' '}
              <Link to="/platforms">VS Code Extension</Link> and <Link to="/platforms">Desktop IDE</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
