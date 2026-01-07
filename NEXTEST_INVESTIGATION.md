# NexTest Demo Investigation & Integration Plan

**Date**: January 4, 2026  
**Status**: 🔍 Investigation Complete - Integration Plan Ready

---

## Executive Summary

The current nexTest Demo provides **basic extraction and visualization** of test cases, but lacks **critical functional features**:

1. ❌ **No real assertion evaluation** - Only checks if constraint exists, doesn't evaluate expressions
2. ❌ **Incomplete scenario extraction** - Succession flows not fully extracted from HIR
3. ❌ **No test execution** - Tests cannot be run, only displayed
4. ❌ **Missing state-of-the-art features** - Test verdicts, coverage analysis, test reports

**Target Architecture**: Backend (Rust/WASM) provides all logic, web frontend only displays results.

---

## Current Implementation Analysis

### ✅ What Works

1. **HIR Extraction** (`useSysMLHir.js`)
   - Extracts verification cases from SysML code
   - Extracts assertions (AssertUsage nodes)
   - Extracts use cases (scenarios)
   - Extracts verify relationships

2. **Basic Visualization** (`TestingView.jsx`)
   - Displays test cases in tables
   - Shows assertions with validation status (but only structural, not functional)
   - Shows scenarios with actions
   - Shows traceability matrix
   - Calculates basic coverage percentage

### ❌ What's Missing

#### 1. Real Assertion Evaluation

**Current State**:
```javascript
// TestingView.jsx line 216-226
let hasConstraint = false
if (node.children && Array.isArray(node.children)) {
  hasConstraint = node.children.some(childId => {
    const child = hirData.nodes[childId]
    return child && child.kind && child.kind.includes('Constraint')
  })
}
const isValid = hasConstraint  // ❌ Only checks structure, doesn't evaluate!
```

**Problem**: Only checks if assertion has a constraint child node, but doesn't:
- Evaluate the constraint expression
- Check if assertion passes/fails
- Provide verdict (pass/fail/inconclusive/error)

**Backend Support Available**:
- ✅ `sysml-exec/src/analysis.rs::execute_verification()` - Executes verification cases
- ✅ `sysml-exec/src/analysis.rs::evaluate_expression()` - Evaluates constraint expressions
- ✅ `VerdictKind` enum (Pass, Fail, Inconclusive, Error)
- ✅ `VerificationResult` with verdict and objective results

**Missing WASM API**: No WASM bridge for assertion evaluation

---

#### 2. Scenario Extraction with Succession

**Current State**:
```javascript
// TestingView.jsx line 149-166
// Extract actions/steps from use case
const actions = []
if (node.children && Array.isArray(node.children)) {
  node.children.forEach(childId => {
    const child = hirData.nodes[childId]
    if (child && child.kind) {
      const childKind = String(child.kind)
      if (childKind.includes('Action') || childKind.includes('Step')) {
        actions.push({
          name: child.name || 'unnamed step',
          kind: childKind,
          description: child.doc_comment || '',
        })
      }
    }
  })
}
```

**Problem**: 
- Extracts actions but **doesn't extract succession relationships**
- Doesn't show action sequence/flow
- Doesn't extract `first action X; then action Y; then done;` syntax

**Backend Support Available**:
- ✅ `sysml-hir/src/lower/definitions/verification.rs` - Lowers succession syntax
- ✅ `HirNodeKind::Succession` and `HirNodeKind::SuccessionFlow` nodes
- ✅ `sysml-ide-visualization/src/transform/diagram_builders/activity.rs` - Extracts succession flows for diagrams (lines 183-214)

**Missing**: 
- WASM API to extract succession flows from verification cases
- Frontend logic to reconstruct action sequences from succession nodes

---

#### 3. Full Test Management Features

**Current State**: Only displays extracted test cases, no execution capabilities.

**Missing Features**:

| Feature | Status | Backend Support | WASM API |
|---------|--------|----------------|----------|
| Test Execution | ❌ Missing | ✅ `TestRunner::run_all()` | ❌ Missing |
| Test Verdicts | ❌ Missing | ✅ `VerdictKind` enum | ❌ Missing |
| Test Statistics | ❌ Missing | ✅ `TestRunStatistics` | ❌ Missing |
| Test Scenarios | ⚠️ Partial | ✅ `TestScenario` struct | ❌ Missing |
| Test Filtering | ❌ Missing | ✅ `TestRunConfig` with filters | ❌ Missing |
| Test Reports | ❌ Missing | ✅ `TestExecutionResult` | ❌ Missing |
| Coverage Analysis | ⚠️ Basic | ✅ `VerificationCoverageReport` | ❌ Missing |
| Test History | ❌ Missing | ❌ Not implemented | ❌ Missing |

**Backend Support Available**:
- ✅ `sysml-exec/src/test_runner.rs` - Complete test execution engine (750+ lines)
- ✅ `sysml-exec/src/analysis.rs::execute_verification()` - Executes single verification
- ✅ `sysml-ide-requirements/src/verification_integration.rs` - Verification coverage tracking
- ✅ `sysml-ide-api-server/src/services/tests.rs` - Test extraction service (but uses mock data)

---

## Backend API Analysis

### Available Backend APIs (Rust)

#### 1. Test Execution Engine (`sysml-exec/src/test_runner.rs`)

```rust
pub struct TestRunner {
    test_cases: FxHashMap<TestCaseId, (TestCaseMetadata, VerificationCase)>,
    scenarios: FxHashMap<TestScenarioId, TestScenario>,
    executor: Arc<Mutex<AnalysisExecutor>>,
}

impl TestRunner {
    pub fn run_all(&self, config: &TestRunConfig) -> ExecutionResult<Vec<TestExecutionResult>>
    pub fn run_scenario(&self, scenario_id: &TestScenarioId, config: &TestRunConfig) -> ExecutionResult<Vec<TestExecutionResult>>
    pub fn execute_test(&self, test_id: &TestCaseId, config: &TestRunConfig) -> ExecutionResult<TestExecutionResult>
}
```

**Features**:
- ✅ Batch test execution
- ✅ Parallel execution support
- ✅ Test filtering (tags, priority, ASIL)
- ✅ Fail-fast mode
- ✅ Retry on failure
- ✅ Progress reporting
- ✅ Test statistics

#### 2. Verification Execution (`sysml-exec/src/analysis.rs`)

```rust
impl AnalysisExecutor {
    pub fn execute_verification(
        &mut self,
        verification_id: &VerificationCaseId,
    ) -> ExecutionResult<VerificationResult>
    
    pub fn evaluate_expression(
        &mut self,
        expression: &ConstraintExpression,
    ) -> ExecutionResult<ExpressionValue>
}
```

**Features**:
- ✅ Executes verification cases
- ✅ Evaluates constraint expressions
- ✅ Returns verdict (Pass/Fail/Inconclusive/Error)
- ✅ Objective result tracking

#### 3. Succession Flow Extraction (Activity Diagram Builder)

```rust
// sysml-ide-visualization/src/transform/diagram_builders/activity.rs
let succession_flow_nodes: Vec<_> = hir_data
    .nodes
    .iter()
    .filter(|(_, node)| {
        if let HirNodeKindData::SuccessionFlow { .. } = &node.kind {
            return true;
        }
        if let HirNodeKindData::Succession { name, .. } = &node.kind {
            return name.contains('.') && name.contains(" to ");
        }
        false
    })
    .collect();
```

**Features**:
- ✅ Extracts SuccessionFlow nodes
- ✅ Extracts Succession nodes with pin references
- ✅ Parses pin-to-pin flows

---

### Missing WASM APIs

The backend has all the functionality, but **no WASM bridge** exists to expose it to the web frontend.

**Required WASM APIs**:

1. **Assertion Evaluation**
   ```rust
   // wasm-bridge/src/lib.rs (to be created)
   #[wasm_bindgen]
   pub fn evaluate_assertion(
       hir_data: &JsValue,
       assertion_id: &str,
       context: &JsValue,  // Subject values, attribute values, etc.
   ) -> JsValue  // { verdict: "pass"|"fail"|"inconclusive"|"error", message: string }
   ```

2. **Succession Flow Extraction**
   ```rust
   #[wasm_bindgen]
   pub fn extract_succession_flows(
       hir_data: &JsValue,
       verification_id: &str,
   ) -> JsValue  // Array of { from: string, to: string, type: "succession"|"successionFlow" }
   ```

3. **Test Execution**
   ```rust
   #[wasm_bindgen]
   pub fn execute_verification_case(
       hir_data: &JsValue,
       verification_id: &str,
       config: &JsValue,  // { timeout_ms?: number, fail_fast?: boolean }
   ) -> JsValue  // TestExecutionResult
   ```

4. **Test Runner**
   ```rust
   #[wasm_bindgen]
   pub struct TestRunner {
       // Internal state
   }
   
   #[wasm_bindgen]
   impl TestRunner {
       #[wasm_bindgen(constructor)]
       pub fn new() -> TestRunner
       
       pub fn add_test_case(&mut self, metadata: &JsValue, verification_case: &JsValue)
       pub fn run_all(&self, config: &JsValue) -> JsValue  // Vec<TestExecutionResult>
       pub fn get_statistics(&self, results: &JsValue) -> JsValue  // TestRunStatistics
   }
   ```

---

## Integration Plan

### Phase 1: WASM Bridge Implementation (2-3 weeks)

**Location**: `sysmlv2_rust_extension/crates/wasm-bridge/src/lib.rs`

**Tasks**:
1. ✅ Add assertion evaluation API
   - Expose `evaluate_expression()` from `sysml-exec`
   - Convert constraint expressions to evaluable format
   - Return verdict and error messages

2. ✅ Add succession flow extraction API
   - Extract SuccessionFlow and Succession nodes from HIR
   - Parse action sequences from verification cases
   - Return structured flow data

3. ✅ Add test execution API
   - Expose `execute_verification()` from `sysml-exec`
   - Handle WASM memory constraints
   - Return execution results

4. ✅ Add test runner API
   - Wrap `TestRunner` in WASM bindings
   - Serialize/deserialize test metadata
   - Support batch execution

**Dependencies**:
- `sysml-exec` crate (already exists)
- `wasm-bindgen` (already configured)
- `serde-wasm-bindgen` for JSON serialization

---

### Phase 2: Frontend Integration (1-2 weeks)

**Location**: `pages/sysnex-labs.github.io/src/`

**Tasks**:

1. **Update `useSysMLHir.js`**
   - Add hook for assertion evaluation: `useAssertionEvaluation(code, assertionId, context)`
   - Add hook for succession extraction: `useSuccessionFlows(code, verificationId)`
   - Add hook for test execution: `useTestExecution(code, verificationId, config)`

2. **Update `TestingView.jsx`**
   - Replace structural assertion validation with real evaluation
   - Add succession flow visualization (sequence diagram or flow chart)
   - Add test execution UI (run button, progress indicator, results)
   - Add test verdict display (pass/fail badges)
   - Add test statistics dashboard

3. **Create New Components**
   - `AssertionEvaluator.jsx` - Real-time assertion evaluation
   - `SuccessionFlowViewer.jsx` - Visualize action sequences
   - `TestRunner.jsx` - Test execution interface
   - `TestResults.jsx` - Display execution results
   - `TestStatistics.jsx` - Coverage and statistics dashboard

---

### Phase 3: Advanced Features (2-3 weeks)

**Tasks**:

1. **Test Coverage Analysis**
   - Integrate `VerificationCoverageReport` from backend
   - Show coverage gaps
   - Generate coverage reports

2. **Test History & Reports**
   - Store test execution history (localStorage or backend)
   - Generate test reports (HTML/PDF)
   - Export test results (JSON/CSV)

3. **Test Filtering & Organization**
   - Filter by tags, priority, ASIL level
   - Group tests by scenario
   - Search and sort tests

4. **Real-time Test Execution**
   - Live test execution as code changes
   - Progress indicators
   - Streaming results

---

## Implementation Details

### Assertion Evaluation Flow

```javascript
// Frontend: TestingView.jsx
const { evaluateAssertion } = useSysMLWasm()

const evaluateAssertion = async (assertionId, context) => {
  const result = await evaluateAssertion(hirData, assertionId, {
    subject: testBMS,
    attributes: {
      voltage: 4.3,
      temperature: 55.0,
    }
  })
  
  // result = { verdict: "fail", message: "Assertion failed: voltage (4.3) > 4.2" }
  return result
}
```

**Backend Implementation**:
```rust
// wasm-bridge/src/lib.rs
#[wasm_bindgen]
pub fn evaluate_assertion(
    hir_json: &JsValue,
    assertion_id: &str,
    context: &JsValue,
) -> Result<JsValue, JsValue> {
    // 1. Parse HIR from JSON
    let hir_data: HirData = serde_wasm_bindgen::from_value(hir_json.clone())?;
    
    // 2. Find assertion node
    let assertion_node = find_node_by_id(&hir_data, assertion_id)?;
    
    // 3. Find constraint child
    let constraint = find_constraint(&hir_data, assertion_node)?;
    
    // 4. Create execution context from context parameter
    let mut executor = AnalysisExecutor::new();
    executor.set_context(context)?;
    
    // 5. Evaluate constraint expression
    let result = executor.evaluate_expression(&constraint.expression)?;
    
    // 6. Determine verdict
    let verdict = match result {
        ExpressionValue::Boolean(true) => VerdictKind::Pass,
        ExpressionValue::Boolean(false) => VerdictKind::Fail,
        _ => VerdictKind::Inconclusive,
    };
    
    // 7. Return result
    Ok(serde_wasm_bindgen::to_value(&AssertionResult {
        verdict,
        message: format!("Assertion {}: {}", assertion_id, verdict),
    })?)
}
```

---

### Succession Flow Extraction Flow

```javascript
// Frontend: TestingView.jsx
const { extractSuccessionFlows } = useSysMLWasm()

const flows = await extractSuccessionFlows(hirData, verificationId)
// flows = [
//   { from: "testSetup", to: "applyOvervoltage", type: "succession" },
//   { from: "applyOvervoltage", to: "verifyDisconnect", type: "succession" },
//   { from: "verifyDisconnect", to: "done", type: "succession" }
// ]
```

**Backend Implementation**:
```rust
#[wasm_bindgen]
pub fn extract_succession_flows(
    hir_json: &JsValue,
    verification_id: &str,
) -> Result<JsValue, JsValue> {
    let hir_data: HirData = serde_wasm_bindgen::from_value(hir_json.clone())?;
    
    // Find verification node
    let verification_node = find_node_by_id(&hir_data, verification_id)?;
    
    // Extract all succession flows within verification
    let mut flows = Vec::new();
    
    // Traverse children to find SuccessionFlow and Succession nodes
    for child_id in &verification_node.children {
        let child = hir_data.nodes.get(child_id)?;
        
        match &child.kind {
            HirNodeKind::SuccessionFlow { from, to, .. } => {
                flows.push(SuccessionFlow {
                    from: from.clone(),
                    to: to.clone(),
                    flow_type: "successionFlow".to_string(),
                });
            }
            HirNodeKind::Succession { name, .. } => {
                // Parse "action1 to action2" pattern
                if let Some((from, to)) = parse_succession_name(name) {
                    flows.push(SuccessionFlow {
                        from,
                        to,
                        flow_type: "succession".to_string(),
                    });
                }
            }
            _ => {}
        }
    }
    
    Ok(serde_wasm_bindgen::to_value(&flows)?)
}
```

---

### Test Execution Flow

```javascript
// Frontend: TestRunner.jsx
const { TestRunner } = useSysMLWasm()

const runner = new TestRunner()
runner.addTestCase(metadata, verificationCase)

const results = await runner.runAll({
  parallel: false,
  failFast: false,
  verbose: true
})

// results = [
//   { testId: "test1", verdict: "pass", duration: 150, ... },
//   { testId: "test2", verdict: "fail", duration: 200, error: "..." }
// ]
```

---

## State-of-the-Art Features Missing

### 1. Test Prioritization & Scheduling
- **Missing**: Priority-based test execution
- **Backend**: ✅ `TestCaseMetadata.priority` exists
- **Action**: Expose priority in WASM API, add UI for priority selection

### 2. Test Parallelization
- **Missing**: Parallel test execution
- **Backend**: ✅ `TestRunConfig.parallel` and `max_workers` exist
- **Action**: Enable parallel execution in WASM API

### 3. Test Retry Logic
- **Missing**: Automatic retry on failure
- **Backend**: ✅ `TestRunConfig.retry_count` exists
- **Action**: Expose retry config in WASM API

### 4. Test Tagging & Filtering
- **Missing**: Tag-based test filtering
- **Backend**: ✅ `TestCaseMetadata.tags` and `TestRunConfig.tag_filter` exist
- **Action**: Add tag UI, expose filtering in WASM API

### 5. Test Timeout Management
- **Missing**: Test timeout handling
- **Backend**: ✅ `TestCaseMetadata.timeout_ms` exists
- **Action**: Add timeout UI, expose in WASM API

### 6. Test Reports & Export
- **Missing**: Test report generation
- **Backend**: ✅ `TestExecutionResult` and `TestRunStatistics` exist
- **Action**: Add report generation (HTML/PDF/JSON export)

### 7. Test Coverage Metrics
- **Missing**: Detailed coverage analysis
- **Backend**: ✅ `VerificationCoverageReport` exists
- **Action**: Integrate coverage API, visualize coverage gaps

### 8. Test History & Trends
- **Missing**: Test execution history
- **Backend**: ❌ Not implemented
- **Action**: Add history storage (localStorage or backend API)

---

## Recommendations

### Immediate Actions (Week 1-2)

1. **Create WASM Bridge for Assertion Evaluation**
   - Priority: 🔴 **HIGH** - Core functionality missing
   - Effort: 3-5 days
   - Impact: Enables real assertion validation

2. **Create WASM Bridge for Succession Extraction**
   - Priority: 🟡 **MEDIUM** - Important for scenario visualization
   - Effort: 2-3 days
   - Impact: Shows action sequences in scenarios

3. **Update Frontend to Use Real Evaluation**
   - Priority: 🔴 **HIGH** - Replaces mock validation
   - Effort: 2-3 days
   - Impact: Functional assertion checking

### Short-term Actions (Week 3-4)

4. **Create WASM Bridge for Test Execution**
   - Priority: 🟡 **MEDIUM** - Enables test running
   - Effort: 5-7 days
   - Impact: Full test execution capability

5. **Add Test Execution UI**
   - Priority: 🟡 **MEDIUM** - User-facing feature
   - Effort: 3-5 days
   - Impact: Users can run tests

### Medium-term Actions (Week 5-8)

6. **Add Test Statistics & Reports**
   - Priority: 🟢 **LOW** - Nice to have
   - Effort: 5-7 days
   - Impact: Better test insights

7. **Add Test Filtering & Organization**
   - Priority: 🟢 **LOW** - Nice to have
   - Effort: 3-5 days
   - Impact: Better test management

---

## Success Criteria

### Phase 1 Complete ✅
- [ ] Assertions can be evaluated with real constraint expressions
- [ ] Succession flows are extracted and visualized
- [ ] Test cases can be executed via WASM API
- [ ] Test verdicts are displayed (pass/fail/inconclusive/error)

### Phase 2 Complete ✅
- [ ] Test execution UI is functional
- [ ] Test statistics are displayed
- [ ] Test coverage analysis works
- [ ] Test reports can be generated

### Phase 3 Complete ✅
- [ ] All state-of-the-art features are available
- [ ] Test history is tracked
- [ ] Test filtering and organization works
- [ ] Performance meets targets (< 1s for assertion evaluation, < 5s for test execution)

---

## Technical Notes

### WASM Memory Considerations

- Test execution may require significant memory
- Consider streaming results for large test suites
- Use `wasm-bindgen` async support for long-running operations

### Performance Targets

- Assertion evaluation: < 100ms per assertion
- Succession extraction: < 50ms per verification
- Test execution: < 5s for typical test case
- Batch execution: < 30s for 100 tests

### Error Handling

- All WASM APIs should return `Result<JsValue, JsValue>`
- Frontend should handle errors gracefully
- Show user-friendly error messages

---

## Conclusion

The nexTest Demo has a **solid foundation** with HIR extraction and basic visualization, but needs **critical backend integration** to become fully functional. The backend already has all required functionality - we just need to expose it via WASM APIs and integrate it into the frontend.

**Estimated Total Effort**: 6-8 weeks for complete implementation

**Priority**: 🔴 **HIGH** - This is a core feature that should be functional, not just a demo.


