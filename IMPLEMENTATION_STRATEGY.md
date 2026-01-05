# Implementation Strategy: Missing Demo Features

## Problem Statement
The website claims features in demo pages that aren't fully implemented. We need to implement these features using the actual WASM APIs from the Rust LSP.

## Available WASM APIs

Based on `/crates/wasm-bridge/src/lib.rs`, we have:

```rust
pub struct SysMLWasm {
    pub fn parse(&mut self, source: &str) -> Diagnostics
    pub fn generate_documentation(&mut self, source: &str, file_uri: &str) -> Documentation
    pub fn generate_cst(&mut self, source: &str, file_uri: &str) -> CST
    pub fn generate_hir(&mut self, source: &str, file_uri: &str) -> HIR
    pub fn generate_analytics(&mut self, source: &str, file_uri: &str) -> Analytics
}
```

**NO** `parse_uvl` function exists - this was a mistake in useSysMLWasm.js

## Current Implementation Status

### ✅ Fully Implemented
1. **NexDocs** - Uses `generate_documentation`, `generate_cst`, `generate_hir`, `generate_analytics`
2. **NexAnalytics** - Uses `generate_analytics` directly

### ⚠️ Partially Implemented
3. **NexReq** - Uses documentation but needs:
   - Better traceability matrix visualization
   - Satisfy/verify relationship extraction
   - Coverage calculations

4. **NexTest** - Uses documentation but needs:
   - Assertion extraction from verification cases
   - Test coverage metrics calculation
   - Scenario analysis

5. **NexViz** - Uses documentation but needs:
   - Better diagram element categorization
   - Connection/relationship extraction
   - Activity flow visualization

### ❌ Incorrectly Implemented
6. **NexVar** - Currently uses DocumentationTabs (wrong!)
   - UVL is NOT SysML - it's a separate DSL
   - Should extract feature models from UVL syntax
   - Needs client-side UVL parser (no WASM support)

7. **NexTrade** - Uses DocumentationTabs but needs:
   - Variant extraction from specializations
   - Objective tracking from analysis cases
   - Decision matrix generation

8. **NexSim** - Uses DocumentationTabs but needs:
   - Calculation extraction from `calc def`
   - State machine visualization
   - Action flow tracking

## Implementation Plan

### Phase 1: Fix Critical Issues (High Priority)

#### 1.1 NexVar - Create Client-Side UVL Parser
**File**: `src/components/UvlView/UvlView.jsx` (already created)
**Status**: ✅ Created, needs testing

**Approach**:
- UVL is NOT SysML, so no WASM support
- Parse UVL syntax client-side (simple text parsing)
- Extract:
  - Feature hierarchy (mandatory/optional/alternative)
  - Constraints (implications, exclusions)
  - Product line metrics

#### 1.2 Enhance RequirementsView
**File**: `src/components/RequirementsView/RequirementsView.jsx`
**Uses WASM**: `generate_documentation` + `generate_hir`

**Missing Features**:
```javascript
// Extract from HIR/Documentation:
- Requirement hierarchy (already done)
- Verification cases (already done)
- Satisfy relationships (needs enhancement)
- Verify relationships (needs enhancement)
- Coverage calculation (needs implementation)
- Traceability matrix (needs better visualization)
```

**Implementation**:
```javascript
// In RequirementsView.jsx
const traceability = useMemo(() => {
  if (!documentation) return { satisfy: [], verify: [] }

  const satisfy = []
  const verify = []

  documentation.chapters.forEach(chapter => {
    chapter.subchapters?.forEach(sub => {
      // Extract satisfy relationships
      if (sub.relationships) {
        sub.relationships.forEach(rel => {
          if (rel.kind === 'satisfy') {
            satisfy.push({
              requirement: sub.name,
              implementedBy: rel.target
            })
          }
          if (rel.kind === 'verify') {
            verify.push({
              requirement: sub.name,
              verifiedBy: rel.target
            })
          }
        })
      }
    })
  })

  return { satisfy, verify }
}, [documentation])

// Coverage calculation
const coverage = useMemo(() => {
  const totalReqs = requirements.length
  const verifiedReqs = requirements.filter(req =>
    traceability.verify.some(v => v.requirement === req.name)
  ).length
  const satisfiedReqs = requirements.filter(req =>
    traceability.satisfy.some(s => s.requirement === req.name)
  ).length

  return {
    verification: totalReqs > 0 ? (verifiedReqs / totalReqs) * 100 : 0,
    satisfaction: totalReqs > 0 ? (satisfiedReqs / totalReqs) * 100 : 0
  }
}, [requirements, traceability])
```

#### 1.3 Enhance TestingView
**File**: `src/components/TestingView/TestingView.jsx`
**Uses WASM**: `generate_documentation` + `generate_hir`

**Missing Features**:
- Assertion extraction from verification cases
- Coverage metrics (requirements vs verifications)
- Scenario analysis

**Implementation**:
```javascript
// Extract assertions from verification objective blocks
const assertions = useMemo(() => {
  if (!documentation) return []

  const asserts = []
  documentation.chapters.forEach(chapter => {
    chapter.subchapters?.forEach(sub => {
      if (sub.kind?.includes('verification')) {
        // Look for assert elements in nested elements
        sub.nestedElements?.forEach(nested => {
          if (nested.kind === 'assert') {
            asserts.push({
              verification: sub.name,
              assertion: nested.name,
              constraint: nested.constraint
            })
          }
        })
      }
    })
  })

  return asserts
}, [documentation])
```

#### 1.4 Create TradeStudyView
**File**: `src/components/TradeStudyView/TradeStudyView.jsx` (NEW)
**Uses WASM**: `generate_documentation`

**Features**:
- Extract analysis definitions
- Extract variant specializations
- Show objective tracking
- Generate decision matrix

```javascript
// Extract trade studies and variants
const tradeStudies = useMemo(() => {
  if (!documentation) return []

  const studies = []
  documentation.chapters.forEach(chapter => {
    chapter.subchapters?.forEach(sub => {
      if (sub.kind?.includes('analysis')) {
        // This is a trade study
        const variants = chapter.subchapters.filter(v =>
          v.specializations?.includes(sub.name)
        )

        studies.push({
          name: sub.name,
          doc: sub.doc,
          objectives: sub.objectives || [],
          variants: variants.map(v => ({
            name: v.name,
            attributes: v.attributes || []
          }))
        })
      }
    })
  })

  return studies
}, [documentation])

// Generate decision matrix
const decisionMatrix = useMemo(() => {
  return tradeStudies.map(study => ({
    study: study.name,
    variants: study.variants,
    objectives: study.objectives,
    scores: study.variants.map(variant => ({
      variant: variant.name,
      scores: study.objectives.map(obj => ({
        objective: obj,
        score: calculateScore(variant, obj) // Custom scoring logic
      }))
    }))
  }))
}, [tradeStudies])
```

### Phase 2: Enhance Visualization (Medium Priority)

#### 2.1 DiagramView Enhancements
**File**: `src/components/DiagramView/DiagramView.jsx`

**Add**:
- Connection extraction (IBD)
- Activity flow mapping
- Better element categorization

#### 2.2 NexSim Enhancements
**File**: Create `src/components/SimulationView/SimulationView.jsx`

**Features**:
- Extract `calc def` elements
- Extract `action def` with flow
- Extract `state def` with transitions
- Show simulation flow

### Phase 3: Polish & Testing (Low Priority)

- Add loading states
- Add error boundaries
- Add empty states
- Test with all example files
- Performance optimization

## API Usage Patterns

### Pattern 1: Extract from Documentation
```javascript
const { documentation } = useSysMLDocumentation(code, fileUri)

// Documentation structure:
{
  chapters: [{
    title: string,
    subchapters: [{
      name: string,
      kind: string, // 'part def', 'requirement def', etc.
      doc: string,
      attributes: [{ name, type, value }],
      nestedElements: [...],
      relationships: [{ kind, target }]
    }]
  }]
}
```

### Pattern 2: Extract from HIR
```javascript
const { hirData } = useSysMLHir(code, fileUri)

// HIR provides lower-level structural info
// Use when documentation doesn't have enough detail
```

### Pattern 3: Extract from Analytics
```javascript
const { analytics } = useSysMLAnalytics(code, fileUri)

// Analytics provides metrics:
{
  quality_scores: {},
  complexity: {},
  insights: []
}
```

## Testing Strategy

1. **Unit Test Each Extraction Function**
   - Test with known SysML examples
   - Verify extracted data matches expectations

2. **Integration Test WASM APIs**
   - Ensure all WASM calls succeed
   - Handle errors gracefully

3. **Visual Regression Test**
   - Screenshot comparisons
   - Manual verification of claimed features

## Success Criteria

- [ ] All features claimed in TryYourself.jsx are actually visible
- [ ] Each demo uses appropriate WASM APIs
- [ ] No client-side parsing of SysML (use WASM)
- [ ] UVL has custom parser (not SysML)
- [ ] Build succeeds with no errors
- [ ] All demos load without crashes

## Timeline

- Phase 1: 2-3 hours
- Phase 2: 1-2 hours
- Phase 3: 1 hour

**Total**: ~5-6 hours of focused development
