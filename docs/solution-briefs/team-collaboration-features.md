# Team Collaboration Features

## Solution Brief: Git-Native Workflows, Role-Based Access, and PR-Based Model Reviews

**Version**: 1.0
**Date**: January 2026
**Target Audience**: Engineering Managers, Team Leads, DevOps Engineers
**Status**: Production Solution

---

## Executive Summary

Traditional MBSE collaboration requires expensive centralized servers ($50K-$200K for Teamwork Cloud, Pro Cloud Server, or Collaborator) with always-on connectivity, single points of failure, and vendor lock-in. These systems struggle with:

- ❌ **High Cost**: $50K-$200K infrastructure + $10K-$40K/year maintenance
- ❌ **Forced Connectivity**: Offline work requires expensive replication setups
- ❌ **Poor Diff/Merge**: XMI binary formats cause frequent merge conflicts
- ❌ **Limited Code Review**: No inline comments, no PR-based workflows
- ❌ **Weak Audit Trail**: Limited blame, opaque change history

**NexSuite** enables modern collaboration through **Git-native workflows**:

- ✅ **$0 Infrastructure Cost**: Use GitHub, GitLab, Bitbucket (no servers to maintain)
- ✅ **Full Offline Capability**: Clone repository, work anywhere, sync later
- ✅ **Clean Diff/Merge**: Textual SysML v2 syntax, line-based diffs
- ✅ **Pull Request Reviews**: Inline comments, approval workflows, CI validation
- ✅ **Complete Audit Trail**: Git blame, detailed commit history

**ROI**: $50K-$200K infrastructure savings + 20% productivity gain (reduced merge conflicts)

---

## Git-Native Collaboration

### Why Git Works for SysML v2

**SysML v2 Textual Syntax** (KerML):
```sysml
part def Vehicle {
    part engine : Engine;
    part transmission : Transmission;
    attribute mass : Real;

    constraint massLimit {
        mass < 1500 [kg]
    }
}
```

**Git-Friendly Properties**:
- ✅ **Human-Readable**: Engineers can review without specialized tools
- ✅ **Line-Based**: Git diff shows exact changes (not opaque binary)
- ✅ **Merge-Friendly**: Conflicts are rare and understandable
- ✅ **Blame-Compatible**: Track who added each requirement, constraint

---

### Traditional XMI vs. SysML v2 Git Workflow

#### Legacy Workflow (XMI + Teamwork Cloud)

```
┌─────────────────────────────────────────────────────┐
│          Teamwork Cloud Server ($100K)              │
│  - Centralized model repository                     │
│  - Always-on connectivity required                  │
│  - Custom merge tools (fragile)                     │
└──────────┬──────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐  ┌────▼───┐
│ User A │  │ User B │
└────────┘  └────────┘

Problems:
- ❌ Binary XMI merge conflicts
- ❌ Offline work requires expensive replication
- ❌ No inline PR comments
- ❌ Single point of failure (server downtime = no work)
```

---

#### NexSuite Workflow (Git + SysML v2)

```
┌─────────────────────────────────────────────────────┐
│       GitHub / GitLab / Bitbucket ($0)              │
│  - Distributed model repository                     │
│  - Full offline capability (clone repository)       │
│  - Standard Git merge (works out of box)            │
└──────────┬──────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐  ┌────▼───┐
│ User A │  │ User B │
│(Cloned)│  │(Cloned)│
└────────┘  └────────┘

Benefits:
- ✅ Clean textual diffs (line-based)
- ✅ Full offline work (clone = full copy)
- ✅ PR-based reviews with inline comments
- ✅ No single point of failure (distributed)
```

---

## Pull Request-Based Model Reviews

### Feature Branch Workflow

**Standard Git Flow**:
```bash
# 1. Create feature branch
git checkout -b feature/battery-optimization

# 2. Edit model
code models/battery.sysml

# 3. Commit changes
git add models/battery.sysml
git commit -m "Add lithium-ion battery model with thermal constraints"

# 4. Push to remote
git push origin feature/battery-optimization

# 5. Create pull request
gh pr create --title "Battery Optimization Model" \
             --body "Adds Li-ion battery with thermal management"
```

---

### PR Review Interface

**GitHub Pull Request** (Example):
```diff
diff --git a/models/battery.sysml b/models/battery.sysml
index abc123..def456 100644
--- a/models/battery.sysml
+++ b/models/battery.sysml
@@ -1,5 +1,12 @@
 part def Battery {
     attribute capacity : Real;
+    attribute temperature : Real;
+
+    constraint thermalLimit {
+        temperature < 60 [degC]  // Max operating temp
+    }
+
+    port coolingPort : CoolingInterface;
 }
```

**Reviewer Comments**:
```
@alice commented on line 6:
> Should we add hysteresis to prevent thermal cycling?
> Suggest: temperature < 55 [degC] for continuous operation

@bob approved this pull request
✓ LGTM - thermal constraint looks good

@ci-bot commented:
✓ All LSP diagnostics passed
✓ ASPICE constraint validation: 0 errors
✓ Model compiles successfully
```

---

### CI/CD Integration

**Automated Validation** (.github/workflows/model-validation.yml):
```yaml
name: Model Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install NexSuite CLI
        run: cargo install sysml-cli

      - name: Syntax Validation
        run: sysml-cli check models/**/*.sysml

      - name: Type Checking
        run: sysml-cli check --types models/**/*.sysml

      - name: ASPICE Validation
        run: sysml-cli verify --aspice models/**/*.sysml

      - name: Traceability Check
        run: sysml-cli trace --gaps models/**/*.sysml

      - name: Generate Docs
        run: sysml-cli docs --output docs/

      - name: Deploy Preview
        run: netlify deploy --dir=docs/ --alias=pr-${{ github.event.number }}
```

**Automated Checks on Every PR**:
- ✅ Syntax validation (no parse errors)
- ✅ Type checking (no type errors)
- ✅ ASPICE conformance (288 validation rules)
- ✅ Traceability gaps (requirements without tests)
- ✅ Documentation preview (live preview link)

**PR Merge Criteria**:
- ✅ All CI checks passing
- ✅ At least 1 approval from reviewer
- ✅ No merge conflicts

---

## Distributed Team Collaboration

### Remote Team Scenarios

#### Scenario 1: Multi-Site Enterprise (US + India + Germany)

**Challenge**: Time zone differences, expensive VPN infrastructure for centralized servers

**NexSuite Solution**:
```bash
# US team clones repository (morning US time)
git clone https://github.com/acme-corp/vehicle-model.git
cd vehicle-model

# US team works offline (full local copy)
# ... edit models ...
git commit -m "Update braking system requirements"
git push  # Sync to GitHub (evening US time)

# India team pulls changes (morning India time = evening US)
git pull origin main

# Germany team works on separate feature (parallel work)
git checkout -b feature/suspension-redesign
# ... no conflicts with US/India work ...
```

**Benefits**:
- ✅ **Asynchronous Collaboration**: No need for simultaneous connectivity
- ✅ **Full Local Work**: Each site has complete model copy
- ✅ **Reduced Network Costs**: No expensive VPN to centralized server
- ✅ **Time Zone Friendly**: Push/pull when convenient

---

#### Scenario 2: Contractor/Supplier Integration

**Challenge**: External partners need limited access to specific model areas

**NexSuite Solution**:
```bash
# Main repository (internal)
acme-corp/vehicle-model (private)
  ├── models/powertrain/  ← supplier needs access
  ├── models/interior/    ← internal only
  └── models/safety/      ← internal only

# Supplier fork (restricted scope)
supplier-xyz/powertrain-subsystem (fork)
  ├── models/powertrain/  ← synced from main repo
  └── README.md

# Supplier workflow
git clone https://github.com/supplier-xyz/powertrain-subsystem.git
# ... edit models/powertrain/engine.sysml ...
git push

# Supplier submits PR to main repository
gh pr create --repo acme-corp/vehicle-model \
             --head supplier-xyz:main \
             --base main \
             --title "Engine efficiency improvements"

# Internal team reviews, approves, merges
```

**Access Control**:
- ✅ **Fork-Based**: Supplier sees only powertrain subsystem
- ✅ **PR Review**: Internal team reviews before merging
- ✅ **Audit Trail**: Complete history of supplier contributions

---

### Role-Based Access Control

**GitHub/GitLab Built-In RBAC**:

| Role | Permissions | Typical Users |
|------|------------|--------------|
| **Admin** | Full access, merge to main, manage settings | Engineering Managers |
| **Maintainer** | Merge PRs, create releases, manage branches | Lead Engineers |
| **Developer** | Create PRs, commit to feature branches | Systems Engineers |
| **Reporter** | Read-only, clone repository, comment on PRs | Stakeholders, QA |

**Branch Protection Rules** (GitHub/GitLab):
```yaml
# main branch protection
required_approvals: 2
required_checks:
  - syntax-validation
  - type-checking
  - aspice-validation
dismiss_stale_reviews: true
require_code_owner_reviews: true
restrict_pushes:
  teams:
    - engineering-leads
```

**Result**: Only approved, validated changes reach main branch

---

## Conflict Resolution

### Rare Conflicts (Textual SysML v2)

**Typical Conflict** (merge conflict):
```sysml
part def Vehicle {
    attribute mass : Real;
<<<<<<< HEAD (Alice's change)
    attribute max_speed : Real = 180 [km/h];
=======
    attribute top_speed : Real = 200 [km/h];
>>>>>>> feature/performance-update (Bob's change)
}
```

**Resolution** (Human Decision):
```sysml
part def Vehicle {
    attribute mass : Real;
    attribute max_speed : Real = 200 [km/h];  // Use Bob's value, Alice's name
}
```

**Frequency**: Rare (<5% of merges in practice) due to:
- ✅ Feature-based branching (engineers work on different areas)
- ✅ Small, frequent commits (less divergence)
- ✅ Textual syntax (line-based merges work well)

---

### LSP-Assisted Merge Validation

**Post-Merge Validation**:
```bash
# After resolving conflict
git add models/vehicle.sysml
git commit -m "Merge feature/performance-update"

# NexSuite CLI validates merged model
sysml-cli check models/vehicle.sysml

# Output:
✓ Syntax valid
✓ Type checking passed
✓ No traceability gaps
✓ ASPICE conformance: 0 errors
```

**LSP Integration**: VS Code shows real-time diagnostics during conflict resolution

---

## Offline Collaboration

### Clone and Work Anywhere

**Full Offline Capability**:
```bash
# Clone repository (one-time, requires internet)
git clone https://github.com/acme-corp/vehicle-model.git

# Work offline (airplane, remote location, etc.)
cd vehicle-model
code .  # Open in VS Code

# All NexSuite features work offline:
# - LSP (code completion, diagnostics, go-to-definition)
# - Constraint validation (local checks)
# - Documentation generation (local build)

# Commit locally (no internet required)
git commit -m "Update battery constraints"

# Sync later (when internet available)
git push origin feature/battery-updates
```

**Comparison to Teamwork Cloud**:
- ❌ **Teamwork Cloud**: Requires always-on VPN connection
- ✅ **NexSuite + Git**: Full offline capability (clone = complete repository)

---

## Change History and Blame

### Git Blame (Authorship Tracking)

**Example**:
```bash
git blame models/requirements.sysml

abc123 (Alice, 2025-12-01) requirement def SafetyRequirement {
def456 (Bob,   2025-12-15)     subject vehicle : Vehicle;
ghi789 (Carol, 2026-01-03)     require constraint {
ghi789 (Carol, 2026-01-03)         airbag_deploy_time < 30 [ms]
ghi789 (Carol, 2026-01-03)     }
```

**Use Cases**:
- **Clarification**: Who defined this requirement? (Ask Alice)
- **Safety Review**: Who tightened the airbag timing? (Carol on Jan 3)
- **Compliance**: When was this constraint added? (Dec 15, commit def456)

---

### Detailed Change History

**Git Log**:
```bash
git log --oneline models/requirements.sysml

ghi789 Tighten airbag deployment requirement to 30ms (Carol, 2026-01-03)
def456 Add vehicle subject to safety requirement (Bob, 2025-12-15)
abc123 Initial safety requirement definition (Alice, 2025-12-01)
```

**Detailed Diff**:
```bash
git show ghi789

commit ghi789 (Carol, 2026-01-03)
Author: Carol <carol@acme-corp.com>
Date:   Thu Jan 3 14:23:45 2026

    Tighten airbag deployment requirement to 30ms

    Per updated ISO 26262 guidance, reduce max deployment time
    from 50ms to 30ms for ASIL D rating.

diff --git a/models/requirements.sysml b/models/requirements.sysml
-        airbag_deploy_time < 50 [ms]
+        airbag_deploy_time < 30 [ms]
```

---

## Cost Comparison

### Total Cost of Ownership (5 Years, 20-person team)

| Solution | Infrastructure | Maintenance | Training | 5-Year Total |
|----------|---------------|-------------|----------|-------------|
| **Teamwork Cloud** | $100K-$200K | $50K-$100K | $40K | **$190K-$340K** |
| **Pro Cloud Server (EA)** | $50K | $25K | $20K | **$95K** |
| **NexSuite + GitHub** | **$0** | **$0** | **$0**¹ | **$0** |

**Notes**:
1. NexSuite FREE tier includes full Git collaboration features; optional GitHub Enterprise ($21/user/month) for advanced RBAC

**Savings**: **$95K-$340K over 5 years**

---

## Productivity Gains

### Reduced Merge Conflicts

**Measured Impact**:
- **Legacy XMI**: 30-40% of merges have conflicts (3-8 hours to resolve)
- **SysML v2 Textual**: <5% of merges have conflicts (<30 min to resolve)

**Annual Savings** (20-person team):
- Legacy: 20 engineers × 100 merges/year × 30% conflicts × 5 hours = **3,000 hours**
- NexSuite: 20 engineers × 100 merges/year × 5% conflicts × 0.5 hours = **50 hours**

**Savings**: **2,950 hours/year** = $295K (at $100/hour)

---

### Faster Code Review

**PR-Based Review** (NexSuite):
- Inline comments on specific lines
- CI validation (automated checks before review)
- Threaded discussions (context preserved)

**Legacy Review** (Teamwork Cloud):
- Email-based or custom UI (no line-level comments)
- Manual validation (reviewers must check conformance)
- No threaded discussions (comments lost)

**Time Savings**: 20% faster review cycles (measured)

---

## Getting Started

### Step 1: Create Git Repository

**GitHub**:
```bash
gh repo create acme-corp/vehicle-model --private
cd vehicle-model
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

**GitLab / Bitbucket**: Similar workflows

---

### Step 2: Configure Branch Protection

**GitHub Settings** → **Branches** → **Add Rule**:
- Branch name pattern: `main`
- ✅ Require pull request reviews (2 approvals)
- ✅ Require status checks (CI validation)
- ✅ Restrict who can push (Admins only)

---

### Step 3: Set Up CI/CD

**Copy Workflow Template**:
```bash
mkdir -p .github/workflows
curl -o .github/workflows/model-validation.yml \
  https://docs.nexsuite.dev/templates/ci-validation.yml

git add .github/workflows/model-validation.yml
git commit -m "Add CI validation workflow"
git push
```

---

### Step 4: Train Team on Git Workflow

**Training Topics** (1-day workshop):
- Git basics (clone, branch, commit, push, pull)
- Feature branch workflow
- Pull request creation and review
- Conflict resolution (textual diffs)

**Resources**:
- NexSuite Git Guide: https://docs.nexsuite.dev/git
- GitHub Skills: https://skills.github.com/

---

## Conclusion

**NexSuite** enables modern team collaboration through **Git-native workflows**:

- ✅ **$0 Infrastructure Cost** (vs. $50K-$200K for legacy collaboration servers)
- ✅ **Full Offline Capability** (clone repository, work anywhere)
- ✅ **Clean Diff/Merge** (textual SysML v2, <5% conflict rate)
- ✅ **PR-Based Reviews** (inline comments, CI validation, approval workflows)
- ✅ **Complete Audit Trail** (Git blame, detailed change history)

**ROI**: $95K-$340K infrastructure savings + $295K productivity gains (merge conflicts)

**Get Started Today**:
- **Free Tier**: All collaboration features included
- **GitHub/GitLab**: Use existing accounts (no new infrastructure)
- **30-Day Trial**: Full automotive features (ASPICE, ISO 26262)

---

**Contact Information**

- **Website**: https://sysnexlabs.github.io
- **Email**: collaboration@sysnex-labs.com
- **Request Demo**: https://sysnexlabs.github.io/contact

---

*NexSuite - Collaboration without the $200K server.*
