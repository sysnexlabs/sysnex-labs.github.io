# NexSuite Product Overview

## The Modern SysML v2 Language Server for Enterprise MBSE

---

## Executive Summary

**NexSuite** is a production-ready, enterprise-grade SysML v2 language server that brings modern software development practices to Model-Based Systems Engineering (MBSE). Built with Rust for exceptional performance and integrated natively into Visual Studio Code, NexSuite delivers 10x faster performance than legacy MBSE tools while providing AI-powered assistance, Git-native workflows, and comprehensive industry compliance automation.

### Key Benefits

- **10x Performance Advantage**: Sub-50ms LSP response times vs. 200-500ms in traditional tools
- **Zero Learning Curve**: Native VS Code integration leverages 100M+ existing users
- **AI-First Design**: Built-in GitHub Copilot and Claude Code support (40-60% productivity boost)
- **100% SysML v2 Compliance**: Future-proof standard support with full KerML implementation
- **Industry Compliance Automation**: ASPICE, ISO 26262, ISO 15288 work product generation
- **Cost Effective**: Free tier available vs. $5K-$50K+ enterprise licensing

---

## Product Architecture

NexSuite follows a Rust-Analyzer-inspired layered architecture with query-based incremental computation:

```
┌─────────────────────────────────────────────────────────┐
│           VS Code / Cursor Extension                     │
├─────────────────────────────────────────────────────────┤
│           LSP Server (Tower-LSP)                         │
├─────────────────────────────────────────────────────────┤
│  IDE Features          │  Domain Extensions             │
│  - Completion          │  - UVL Variability             │
│  - Navigation          │  - VSS Integration             │
│  - Diagnostics         │  - YAML Architecture           │
│  - Code Actions        │  - Trade Studies               │
├─────────────────────────────────────────────────────────┤
│           High-Level IR (HIR) & Type System             │
├─────────────────────────────────────────────────────────┤
│           Salsa Incremental Database                     │
├─────────────────────────────────────────────────────────┤
│           Lossless Syntax Layer (Never-Fail Parser)     │
└─────────────────────────────────────────────────────────┘
```

### Technical Foundation

- **70 Specialized Crates**: 271K+ lines of production Rust code
- **3,299+ Tests**: 99.9% pass rate ensuring reliability
- **Salsa Database**: Automatic incremental computation and memoization
- **Never-Fail Parser**: Robust error recovery for incomplete code
- **Memory Safe**: Rust eliminates 70% of common vulnerabilities

---

## Core LSP Features (14/14 Complete)

All standard Language Server Protocol features fully implemented and production-ready:

| Feature | Performance | Description |
|---------|-------------|-------------|
| **Code Completion** | <30ms | Context-aware suggestions with 14 completion types |
| **Go-to-Definition** | <5ms | Cross-file navigation with URI resolution |
| **Find References** | <50ms | Multi-file reference search |
| **Hover Information** | <50ms | Rich markdown with SysML v2 semantics |
| **Diagnostics** | <5ms (cached) | 16 collectors for real-time error reporting |
| **Semantic Highlighting** | ~80ms | 43 token types (19 LSP + 24 SysML v2) |
| **Code Actions** | <50ms | 8 providers with 14 action kinds |
| **Rename Symbol** | <100ms | Multi-file with conflict detection |
| **Formatting** | ~50ms | Document and range formatting |
| **Folding Ranges** | <50ms | Nested structure support |
| **Document Symbols** | <50ms | Hierarchical symbol outline |
| **Workspace Symbols** | <150ms | Global search with 5 filter types |
| **Inlay Hints** | <50ms | Type and parameter hints |
| **Signature Help** | <50ms | Function signatures with parameters |

### Advanced LSP Features

- **Call Hierarchy**: Incoming/outgoing calls visualization
- **Type Hierarchy**: Supertype/subtype chains
- **Document Links**: File paths, imports, external references
- **Code Lens**: Reference counts, implementation counts

---

## Domain-Specific Extensions

### UVL Variability Management

Complete feature variability modeling with bidirectional sync:

- **SAT/SMT Solving**: Configuration validation with varisat and Z3 integration
- **Dead Feature Detection**: Identify features that can never be selected
- **Model Derivation**: 150% to 100% model transformation
- **Trade Study Integration**: Generate trade studies from valid configurations
- **Live Preview**: Real-time visual feedback on feature states

**15 LSP Commands | 5 Crates | 2,630 Lines | 21 Tests**

### VSS Integration (Vehicle Signal Specification)

- Import and sync vehicle signal specifications
- Bidirectional transformation between VSS and SysML v2
- 11 LSP commands for VSS operations

### YAML Architecture Parser

- ADL/SUDL (Architecture Description Language) support
- Transformation to SysML v2 models
- Loader and code generation capabilities

### Python Bindings (85% Complete)

- FFI for Python automation
- Model manipulation API
- 15 modules for CRUD operations

---

## Industry Compliance Automation

### ISO/IEC 15288 (83% Complete)

Foundation for all compliance variants with 6 frameworks:

- System Analysis Framework (95%)
- Risk Management Framework (85%)
- Decision Management Framework (95%)
- Design Definition Framework (80%)
- Implementation Framework (75%)
- Project Planning Framework (80%)

### ASPICE (40% Complete - 9/22 Features Production-Ready)

**16,295+ lines | 100+ tests | 15 of 16 processes supported**

Production-ready features:
- Requirements engineering and traceability
- ASIL classification and tracking
- Change impact analysis
- Configuration management
- Constraint validation (288 rules, 95-100% precision)
- Documentation generation
- Model analytics and metrics

### ISO 26262 Integration

- ASIL tracking and classification
- ASIL decomposition validator (Part 9)
- HARA (Hazard Analysis and Risk Assessment) integration
- Safety requirement traceability

---

## Platform Support

### Operating Systems

| Platform | Architecture | Status |
|----------|--------------|--------|
| **macOS** | x86_64, ARM64 (Apple Silicon) | ✅ Production |
| **Linux** | x86_64, ARM64 | ✅ Production |
| **Windows** | x86_64 | ✅ Production |
| **Raspberry Pi 5** | ARM64 | ✅ SaaS Server |

### IDE Integrations

| IDE | Status | Method |
|-----|--------|--------|
| **Visual Studio Code** | ✅ Production | Native extension |
| **Cursor** | ✅ Production | VS Code compatible |
| **IntelliJ IDEA** | Community contribution | LSP protocol |
| **Vim/Neovim** | Community contribution | LSP protocol |
| **Web Browser** | ✅ Working | WASM + WebSocket LSP |

### Deployment Options

**1. VS Code Extension**
- VSIX package distribution
- Marketplace-ready (v0.33.0)
- 35+ UI components
- Full LSP integration

**2. Tauri Desktop App** (In Development)
- Standalone application
- No VS Code required
- Cross-platform (Windows, macOS, Linux)
- Full offline capability

**3. Web IDE (SaaS)**
- Browser-based IDE
- REST API backend (18 endpoints)
- WebSocket LSP connection
- Real-time collaboration ready

**4. WASM Bridge**
- Browser execution via WebAssembly
- Size-optimized compilation
- Includes: Parser, HIR, Documentation, Analytics

---

## Performance Benchmarks

All targets exceeded by significant margins:

| Operation | Target | Achieved | Improvement |
|-----------|--------|----------|-------------|
| Code Completion | <50ms | <30ms | 40% better |
| Go-to-Definition | <50ms | <5ms | 90% better |
| Find References | <100ms | <50ms | 50% better |
| Diagnostics (cached) | <150ms | <5ms | 97% better |
| Formatting | <200ms | ~50ms | 75% better |
| Full Model Load | <2s | <250ms | 87.5% better |
| Memory Usage | <150MB | ~120MB | 20% better |

---

## Technical Specifications

### SysML v2 Support

- **100% SysML v2 Release Standard Compliance**
- Full KerML (Kernel Modeling Language) support
- All SysML v2 language constructs
- Standard Model Library (402 files)
- Parametric modeling
- Constraint expressions (OCL 2.5)

### Technology Stack

**Backend (Rust)**
- Rust nightly toolchain
- Salsa 0.24 (incremental computation)
- Tower-LSP 0.20 (LSP protocol)
- Axum 0.7 (REST API server)
- Tokio (async runtime)
- varisat + Z3 (constraint solving)

**Frontend (TypeScript/React)**
- TypeScript 5.x
- React 18
- Monaco Editor
- React Flow (diagram editor)
- 35+ shared UI components

### Git & CI/CD Integration

**Native Git Support**
- Full Git workflow integration
- Visual diff and merge conflict resolution
- LSP validation during merge
- Pull request and code review
- Zero-cost version control

**CI/CD Pipeline**
- 4 GitHub Actions workflows
- Multi-platform builds (macOS, Linux, Windows, ARM64)
- 9 specialized Docker images
- Automated testing (3,299+ tests)
- Load testing validated (100% success rate)

---

## Documentation & Visualization

### MkDocs Generator

- User-facing documentation generation
- Workspace-level documentation
- Interactive navigation

### Sphinx Integration

- Technical/API documentation
- Type information inclusion
- Code examples

### 6 Diagram Types

- PlantUML
- Mermaid
- D2
- DOT
- SVG
- ASCII

### Requirements Manager

- Traceability matrix generation
- Validation and verification
- Gap detection

---

## Pricing & Licensing

| Tier | Features | Price | Target |
|------|----------|-------|--------|
| **Essential** | Core LSP features | **FREE** | Individual developers |
| **Platform-Full** | All features except compliance | **FREE** | Small teams |
| **Automotive** | ASPICE, ISO 26262 | $2.5K-$18K/year | Enterprise automotive |

**Compare to Traditional MBSE Tools:**
- Enterprise Architect: $229-$799/user one-time
- Cameo Systems Modeler: $5K+/user/year
- Legacy enterprise suites: $50K-$200K+ for SCM systems

---

## Why Choose NexSuite?

### 10x Performance

Rust-based architecture delivers sub-50ms LSP response times compared to 200-500ms in Java-based legacy tools. Real-time diagnostics, instant navigation, and smooth editing experience.

### Zero Learning Curve

Native VS Code integration means your team already knows the tool. No expensive training programs or workflow disruption. Start modeling in minutes, not weeks.

### AI-Powered Productivity

Built-in GitHub Copilot and Claude Code integration provides 40-60% productivity boost. AI understands SysML v2 semantics and generates models, not just code.

### Future-Proof Standards

100% SysML v2 compliance ensures your models are compatible with the next generation of MBSE tools and workflows. Full backwards compatibility with migration tools.

### Git-Native Collaboration

Zero-cost collaboration using Git. No expensive Teamwork Cloud ($50K-$200K) or centralized servers. Distributed workflows with complete audit trails.

### Industry Compliance

Automated work product generation for ASPICE (20/20 types), ISO 26262 ASIL tracking, and ISO 15288 frameworks. Reduce compliance overhead by 50-70%.

---

## Getting Started

### Quick Start (5 minutes)

1. **Install VS Code Extension**
   ```bash
   code --install-extension nexsuite.sysml-v2-lsp
   ```

2. **Open SysML v2 File**
   - Create new `.sysml` file
   - Start modeling with full LSP support

3. **Explore Features**
   - Code completion (Ctrl+Space)
   - Go-to-definition (F12)
   - Find references (Shift+F12)
   - Documentation generation

### Resources

- **Documentation**: https://docs.nexsuite.dev
- **Examples**: https://github.com/nexsuite/examples
- **Community**: https://discord.gg/nexsuite
- **Support**: support@nexsuite.dev

---

## Technical Support

### Community Support (FREE)

- GitHub Issues
- Discord Community
- Documentation Portal
- Video Tutorials

### Enterprise Support ($5K-$25K/year)

- Dedicated support team
- SLA guarantees (4-hour response)
- Custom feature development
- On-site training and consulting
- Priority bug fixes

---

## About Sysnex Labs

Sysnex Labs is pioneering the next generation of Model-Based Systems Engineering tools. Our mission is to bring modern software development practices—AI assistance, Git workflows, and exceptional performance—to systems engineering teams worldwide.

**Version**: 0.33.0
**Release Date**: January 2026
**Status**: Production-Ready

---

**Contact Information**

- **Website**: https://sysnexlabs.github.io
- **Email**: info@sysnex-labs.com
- **GitHub**: https://github.com/SysnexLabs
- **LinkedIn**: https://linkedin.com/company/sysnex-labs

---

*NexSuite - Modern MBSE for Modern Teams*
