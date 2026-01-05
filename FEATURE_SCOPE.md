# NexSuite Feature Scope & Implementation Status

## Overview
This document maps NexSuite website demos to the full-featured VS Code Extension and Desktop applications.

## VS Code Extension Apps (21 Total)

### 📝 Documentation & Modeling
1. **documentation** - Main documentation viewer with HIR, CST, Analytics tabs
   - Website Demo: ✅ TryNexDocs
   - ui-core: ✅ DocumentationPanel with DocViewer, ChapterView, tabs

2. **cst-viewer** - Concrete Syntax Tree viewer
   - Website: ✅ Integrated in TryNexDocs (CstTab)
   - ui-core: ✅ CstTab component

3. **definition-body** - Element definition viewer
   - Website: ⚠️ Partial (in DocumentationTabs)
   - ui-core: ✅ Full implementation

### 📋 Requirements Management
4. **requirements** - Requirements panel with traceability
   - Website Demo: ✅ TryNexReq
   - ui-core: ✅ RequirementsPanel with CoverageIndicator

5. **traceability-matrix** - Bidirectional traceability
   - Website: ⚠️ Partial (in RequirementsView)
   - Extension: ✅ Full matrix with filtering

### ✅ Testing & Verification
6. **test-management** - Test case management
   - Website Demo: ✅ TryNexTest
   - Website: ⚠️ Basic extraction only

7. **aspice-workproducts** - ASPICE work products
   - Website: ❌ Not implemented
   - Extension: ✅ Full ASPICE compliance tracking

### 🎨 Diagram Editors
8. **diagram-editor** - Interactive diagram editing
   - Website: ❌ Not implemented (view-only in TryNexViz)
   - Extension: ✅ Full CRUD with React Flow

9. **diagram-viewer** - Diagram visualization
   - Website Demo: ✅ TryNexViz (read-only)
   - ui-core: ✅ DiagramView, DiagramCanvas

10. **hub-editor** - Hub/composition diagram editor
    - Website: ❌ Not implemented
    - Extension: ✅ Full interactive editor

### 📊 Analytics & Insights
11. **analytics** (part of documentation)
    - Website Demo: ✅ TryNexAnalytics
    - ui-core: ✅ AnalyticsTab, QualityGauge, StatCard

### 🔀 Variability & Trade Studies
12. **uvl** - Universal Variability Language editor
    - Website Demo: ✅ TryNexVar
    - Extension: ✅ Full UVL with FeatureDiagram, ConfigurationPanel

13. **trade-study** - Trade study management
    - Website Demo: ✅ TryNexTrade
    - Extension: ✅ Full analysis with variant comparison

### 🏗️ Systems Engineering
14. **systems-engineering** - SE methodology panel
    - Website: ❌ Not implemented
    - Extension: ✅ V-Model, process views

### 📚 Library & Examples
15. **library-examples** - SysML v2 library browser
    - Website: ❌ Not implemented
    - Extension: ✅ Browse 402 library files

16. **templates** - Code templates
    - Website: ❌ Not implemented
    - Extension: ✅ Template generation

### 🔧 Integration & Tools
17. **syson-bridge** - SysON integration
    - Website: ❌ Not implemented
    - Extension: ✅ Eclipse SysON bridge

18. **syson-telemetry** - Telemetry dashboard
    - Website: ❌ Not implemented
    - Extension: ✅ Usage analytics

19. **sphinx-doc** - Sphinx documentation generator
    - Website: ❌ Not implemented
    - Extension: ✅ Auto-generate docs

### 🎯 Workspace Management
20. **hub-manager** - Multi-file project management
    - Website: ❌ Not implemented
    - Extension: ✅ Workspace state, git integration

21. **welcome** - Welcome page
    - Website: ✅ Home page equivalent
    - Extension: ✅ Getting started guide

22. **backend-demo** - Backend connectivity test
    - Website: ❌ Not implemented
    - Extension: ✅ LSP diagnostics

---

## ui-core Package Features

### Core Components (46 components)
- AdvancedFilterPanel
- AnimatedList
- Badge, BentoGrid, Branding, Breadcrumbs
- BubbleMenu, Button, Card, Chip, CodeBlock
- CommandPalette, ContextMenu, DataTable
- DiagramCanvas, EmptyState, ErrorBoundary
- HoverPreview, InPlaceTextEditor, InspectorPanel
- MarkdownContent, NavigationToolbar, OptimizedTable
- QualityGauge, ResizeHandle, ScrollStack
- SearchHighlight, SearchInput, SectionCard
- SkeletonLoader, StatCard, SysmlCodeBlock
- Tag, TextHighlighter, Toolbar, TreeNode, TreeView
- VscodePanel

### Hooks (20 hooks)
- useAdvancedAnalytics, useAnalytics, useConfirmation
- useCst, useEventBus, useFilterState, useGit, useHir
- useKeyboardShortcuts, useLspCommand, useNavigationHistory
- usePanelVisibility, useSearchWithHistory, useTheme
- useVscodeMessaging, useVscodeState, useWorkspace, useWorkspaceState

### Panels
- **DocumentationPanel**: 30+ components for hierarchical docs
- **RequirementsPanel**: Coverage, traceability, ASIL support

---

## Website vs Extension Comparison

| Feature | Website Demo | VS Code Extension | Desktop App |
|---------|--------------|-------------------|-------------|
| **Documentation Viewer** | ✅ Full | ✅ Full + Edit | ✅ Full |
| **Requirements Management** | ✅ View Only | ✅ Full CRUD + ASIL | ✅ Full |
| **Verification/Testing** | ✅ View Only | ✅ Full Test Mgmt | ✅ Full |
| **Diagram Visualization** | ✅ View Only | ✅ Full Editor | ✅ Full |
| **Analytics Dashboard** | ✅ Full | ✅ Full + History | ✅ Full |
| **Variability (UVL)** | ✅ Full | ✅ Full + Export | ✅ Full |
| **Trade Studies** | ✅ View Only | ✅ Full Analysis | ✅ Full |
| **Simulation** | ⚠️ Basic | ✅ Full Behavioral | ✅ Full |
| **Library Browser** | ❌ None | ✅ 402 files | ✅ Full |
| **Multi-File Projects** | ❌ Single File | ✅ Full Workspace | ✅ Full |
| **Git Integration** | ❌ None | ✅ Full | ✅ Full |
| **LSP Features** | ⚠️ Basic | ✅ 18 Features | ✅ Full |
| **Collaborative Editing** | ❌ None | ❌ Coming Soon | ✅ Full |
| **CI/CD Integration** | ❌ None | ✅ Full | ✅ Full |

---

## Implementation Recommendations

### Priority 1: Enhance Existing Demos
1. **RequirementsView** - Add ASIL badge support from ui-core
2. **DiagramView** - Add diagram type badges and thumbnails
3. **TestingView** - Add ASPICE work product indicators

### Priority 2: New Feature Demos
1. **Library Browser** - Add demo showing 402 SysML v2 files
2. **Template Generator** - Show code templates
3. **Systems Engineering** - Show V-Model process

### Priority 3: Sub-Navigation
1. Create feature navigation for each product
2. Link to specific app capabilities
3. Add "Full Features in Extension" CTAs

---

## Technology Stack Alignment

| Component | Website | Extension | Shared (ui-core) |
|-----------|---------|-----------|------------------|
| **Parser** | ✅ WASM | ✅ Rust LSP | Both use same core |
| **React** | ✅ 18 | ✅ 18 | ✅ Same version |
| **Monaco** | ✅ Editor | ✅ VS Code | Different integration |
| **Styling** | ✅ Custom CSS | ✅ Tailwind + tokens | ⚠️ Different systems |
| **State** | ❌ Local only | ✅ Zustand + VSCode | ui-core hooks |
| **Testing** | ⚠️ Manual | ✅ Jest + React Testing | Shared test utils |

---

## Next Steps

1. ✅ Create this feature scope document
2. ⬜ Implement sub-product navigation
3. ⬜ Add feature badges to product pages
4. ⬜ Create feature comparison table component
5. ⬜ Link each demo to corresponding extension app
6. ⬜ Add "Try Full Features" CTAs
