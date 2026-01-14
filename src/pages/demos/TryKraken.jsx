import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TryYourselfEditor from '../../components/TryYourselfEditor/TryYourselfEditor'
import '../Page.css'
import '../TryYourself.css'

const DEFAULT_KRAKEN_EXAMPLE = `package 'Integrated Engineering System' {
    doc /*
     * Kraken Service Mesh Configuration
     * Connecting diverse engineering tools into a unified backbone
     */

    import ScalarValues::*;
    
    // 1. Define External Systems (Mesh Nodes)
    part def ExternalSystem;
    
    part cameo : ExternalSystem {
        doc "Legacy MBSE Tool (Syndeia/Cameo)"
        attribute status : String = "Connected";
        attribute syncInterval : String = "5m";
    }
    
    part codebeamer : ExternalSystem {
        doc "Requirements Management (ALM)"
        attribute status : String = "Syncing";
        attribute lastSync : String = "Just now";
    }
    
    part jupyter : ExternalSystem {
        doc "Analysis Notebooks (Python)"
        attribute status : String = "Active";
        attribute kernel : String = "Python 3.11";
    }
    
    // 2. Define Integration Flows
    action def SyncCycle {
        first readRequirements;
        then transformToSysML;
        then validateArchitecture;
        then publishResults;
    }
    
    // 3. Define Shared Data Contracts
    struct def VehicleArchitecture {
        attribute version : String = "2.4.0";
        attribute variants : Integer = 12;
    }
}
`

// WASM Module holder
let wasmModule = null;

const KrakenView = ({ code }) => {
    const [wasmReady, setWasmReady] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const loadWasm = async () => {
            if (!wasmModule) {
                try {
                    // Import the WASM module dynamically to avoid build-time resolution
                    const baseUrl = import.meta.env.BASE_URL || '/'
                    const wasmJsPath = `${baseUrl}wasm/sysml-kraken-wasm/sysml_kraken_wasm.js`
                    const wasmBinaryPath = `${baseUrl}wasm/sysml-kraken-wasm/sysml_kraken_wasm_bg.wasm`

                    const wasm = await import(/* @vite-ignore */ wasmJsPath);
                    // Standard wasm-bindgen init supports passing the path directly or via object
                    await wasm.default(wasmBinaryPath);
                    wasmModule = wasm;
                    wasm.init();
                    setWasmReady(true);
                } catch (e) {
                    console.error("Failed to load WASM:", e);
                }
            } else {
                setWasmReady(true);
            }
        };
        loadWasm();
    }, []);

    useEffect(() => {
        if (wasmReady && wasmModule) {
            try {
                // Run real analysis via WASM
                const resultJson = wasmModule.analyze_kraken_code(code);
                const result = JSON.parse(resultJson);
                setAnalysisResult(result);
                // Keep only the last 10 logs to avoid overflow
                setLogs(prev => [...result.status.logs, ...prev].slice(0, 10));
            } catch (e) {
                console.error("Analysis failed:", e);
            }
        }
    }, [code, wasmReady]);

    // Fallback data if WASM isn't ready or fails (for the demo initial render)
    const hasCameo = code.includes('part cameo');
    const hasCodebeamer = code.includes('part codebeamer');

    // Derived state from WASM result or fallback
    const nodes = analysisResult?.nodes || [];
    const cameoNode = nodes.find(n => n.name.toLowerCase().includes('cameo'));
    const codebeamerNode = nodes.find(n => n.name.toLowerCase().includes('codebeamer'));

    const cameoStatus = cameoNode?.status || (hasCameo ? "Connected" : "Disconnected");
    const codebeamerStatus = codebeamerNode?.status || (hasCodebeamer ? "Syncing" : "Disconnected");

    // Helper to get node visibility
    const isNodeVisible = (nameFragment) => {
        // If we have WASM result, trust it. Otherwise fallback to simple includes
        if (analysisResult) return nodes.some(n => n.name.toLowerCase().includes(nameFragment));
        return code.toLowerCase().includes(nameFragment);
    };

    return (
        <div className="kraken-dashboard" style={{
            background: '#0f172a',
            borderRadius: '8px',
            border: '1px solid #334155',
            height: '100%',
            color: '#e2e8f0',
            fontFamily: 'Inter, sans-serif',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid #334155',
                background: '#1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: wasmReady ? '#10b981' : '#f59e0b', boxShadow: isNodeVisible('cameo') ? '0 0 10px #10b981' : 'none' }}></div>
                    <span style={{ fontWeight: '600', letterSpacing: '0.05em' }}>KRAKEN MESH STATUS {wasmReady ? '(WASM CONNECTED)' : '(CONNECTING...)'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>REGION: eu-central-1</div>
            </div>

            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Central Node */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
                        zIndex: 10,
                        position: 'relative'
                    }}>
                        <img src="/assets/icon_kraken.png" alt="Kraken" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.5rem' }}>HUB</span>
                    </div>
                </div>

                {/* Satellite Nodes */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Cameo Node */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isNodeVisible('cameo') ? 1 : 0.3, y: 0 }}
                        style={{
                            background: '#1e293b',
                            padding: '1rem',
                            borderRadius: '8px',
                            width: '180px',
                            border: '1px solid #475569',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>🏛️</div>
                        <h4 style={{ margin: 0 }}>Cameo</h4>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: cameoStatus === 'Connected' ? '#065f46' : '#991b1b',
                            color: cameoStatus === 'Connected' ? '#34d399' : '#fca5a5'
                        }}>
                            {cameoStatus}
                        </span>
                    </motion.div>

                    {/* SysML v2 Node (Always Active) */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        style={{
                            background: '#1e293b',
                            padding: '1rem',
                            borderRadius: '8px',
                            width: '180px',
                            border: '1px solid #3b82f6',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>💠</div>
                        <h4 style={{ margin: 0 }}>SysML v2</h4>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: '#1e3a8a',
                            color: '#93c5fd'
                        }}>
                            Native Core
                        </span>
                    </motion.div>

                    {/* Codebeamer Node */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isNodeVisible('codebeamer') ? 1 : 0.3, y: 0 }}
                        style={{
                            background: '#1e293b',
                            padding: '1rem',
                            borderRadius: '8px',
                            width: '180px',
                            border: '1px solid #475569',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>📋</div>
                        <h4 style={{ margin: 0 }}>Codebeamer</h4>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: codebeamerStatus === 'Syncing' ? '#854d0e' : '#1e3a8a',
                            color: codebeamerStatus === 'Syncing' ? '#fde047' : '#93c5fd'
                        }}>
                            {codebeamerStatus}
                        </span>
                    </motion.div>
                </div>

                {/* Event Log Simulation */}
                <div style={{
                    background: '#000000',
                    padding: '1rem',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    height: '150px',
                    overflowY: 'auto'
                }}>
                    <div style={{ color: '#64748b', marginBottom: '0.5rem' }}>// EVENT STREAM (LIVE {wasmReady ? 'WASM' : ''})</div>

                    {/* Live Logs from WASM */}
                    {logs.map((log, i) => (
                        <div key={i} style={{ color: '#34d399' }}>{log}</div>
                    ))}

                    {/* Initial State Logs if no WASM logs yet */}
                    {!logs.length && (
                        <>
                            {isNodeVisible('cameo') && <div style={{ color: '#34d399' }}>[10:42:01] CAMEO_BRIDGE: Connection established (id=cb-992)</div>}
                            <div style={{ color: '#94a3b8' }}>[10:42:02] KRAKEN_CORE: Validating SysML v2 model integrity...</div>
                            {isNodeVisible('codebeamer') && <div style={{ color: '#fde047' }}>[10:42:03] REQ_SYNC: Detected 14 new requirements in Codebeamer</div>}
                            {codebeamerStatus === 'Syncing' && <div style={{ color: '#60a5fa' }}>[10:42:04] DATA_FLOW: Transforming ReqIF -&gt; SysML v2 (KerML)</div>}
                            {isNodeVisible('jupyter') && <div style={{ color: '#c084fc' }}>[10:42:05] PY_SDK: Jupyter kernel attached to active session</div>}
                            <div style={{ color: '#34d399' }}>[10:42:06] SYSTEM: Ready for commands</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TryKraken() {
    const [editorCode, setEditorCode] = useState(DEFAULT_KRAKEN_EXAMPLE)

    return (
        <div className="page">
            <section className="page-hero-section">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <img
                            src="/assets/icon_kraken.png"
                            alt="Kraken"
                            style={{ height: '80px', width: 'auto', maxWidth: '80px', objectFit: 'contain' }}
                        />
                        <div>
                            <h1>Try KRAKEN - Service Mesh Demo</h1>
                            <p className="page-hero-description">
                                Experience the digital backbone of modern engineering. Visualize how KRAKEN orchestrates
                                data flow between legacy tools, modern SysML v2, and analysis pipelines in real-time.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <Link to="/products/nexsuite" className="btn ghost">
                            ← Learn More About NexSuite
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <span className="status-badge">🐙 Service Orchestration</span>
                        <span className="status-badge">🔄 Live Sync</span>
                        <span className="status-badge">🌉 Legacy Bridge</span>
                        <span className="status-badge">⚡ Rust Core (WASM Verified)</span>
                    </div>
                </div>
            </section>

            <section className="page-content-section">
                <div className="container">
                    <div className="try-yourself-page-grid">
                        <div className="editor-column">
                            <TryYourselfEditor
                                defaultCode={DEFAULT_KRAKEN_EXAMPLE}
                                defaultExample="Integrated Engineering System"
                                onCodeChange={setEditorCode}
                            />
                        </div>
                        <div className="documentation-column">
                            <KrakenView code={editorCode} />
                        </div>
                    </div>

                    <div className="try-yourself-footer">
                        <div className="insights-grid" style={{ marginTop: '2rem' }}>
                            <div className="insight-card">
                                <span className="insight-eyebrow">Architecture</span>
                                <h3 className="insight-title">🐙 The Kraken Hub</h3>
                                <p className="insight-description">
                                    You are viewing a simulation of the Kraken Hub, a high-performance <strong>Rust-based</strong> server
                                    that maintains a "shadow graph" of all your engineering data, enabling sub-second queries across tools.
                                </p>
                            </div>
                            <div className="insight-card">
                                <span className="insight-eyebrow">Integration</span>
                                <h3 className="insight-title">🔌 Smart Sidecars</h3>
                                <p className="insight-description">
                                    Kraken uses isolated "sidecars" to speak native protocols (COM, OSLC, REST) to tools like Cameo and Codebeamer,
                                    normalizing everything into standard SysML v2.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
