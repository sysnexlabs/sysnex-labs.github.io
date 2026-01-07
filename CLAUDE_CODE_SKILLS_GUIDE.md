# Claude Code Skills Guide for SysNex Homepage

**Purpose**: Leverage Claude Code AI assistant to enhance homepage development, content, and optimization  
**Last Updated**: January 2026

---

## 🎯 Overview

Claude Code is an AI assistant integrated into VS Code/Cursor that can help with:
- **Content Generation** - Write compelling homepage copy
- **Code Optimization** - Improve React components and performance
- **SEO Enhancement** - Optimize meta tags, structured data, and content
- **Accessibility** - Ensure WCAG compliance
- **Testing** - Generate test cases and validation
- **Documentation** - Create user guides and API docs

---

## 🚀 Quick Start: Using Claude Code

### 1. Basic Usage

**In VS Code/Cursor**:
1. Open your homepage files (e.g., `src/pages/Home.jsx`)
2. Select code or text you want to improve
3. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open Claude Code
4. Type your request, e.g., "Improve this hero section copy for better conversion"

### 2. Custom Commands (Slash Commands)

Create a `.cursorrules` or `.claude.md` file in your project root with custom commands:

```markdown
# Claude Code Custom Commands for SysNex Homepage

## Homepage Optimization Commands

### /optimize-seo
Analyze and optimize SEO meta tags, structured data, and content for better search rankings.

### /improve-accessibility
Review code for WCAG 2.1 AA compliance and suggest improvements.

### /generate-cta
Create compelling call-to-action copy for different user personas.

### /optimize-performance
Analyze React components for performance bottlenecks and suggest optimizations.

### /write-feature-description
Generate feature descriptions based on FEATURES.md documentation.

### /create-test-cases
Generate test cases for React components using Vitest/Playwright.

### /improve-mobile-responsive
Review and improve mobile responsiveness for all breakpoints.

### /generate-meta-description
Create SEO-optimized meta descriptions for each page.

### /audit-content
Review homepage content for clarity, tone, and conversion optimization.
```

---

## 📝 Content Generation Workflows

### 1. Hero Section Copy

**Prompt Template**:
```
Generate a compelling hero section for SysNex homepage that:
- Targets systems engineers and MBSE professionals
- Highlights key differentiators: VS Code-native, AI-first, Git-based, 10x performance
- Includes a clear value proposition
- Has a strong call-to-action
- Is concise (max 120 words)
- Uses technical but accessible language
```

**Example Usage**:
1. Open `src/pages/Home.jsx`
2. Find the hero section
3. Select the current copy
4. Use Claude Code with the prompt above
5. Review and refine the generated copy

### 2. Feature Descriptions

**Prompt Template**:
```
Based on FEATURES.md, generate a feature description for [Feature Name] that:
- Explains what it does in 2-3 sentences
- Highlights key benefits
- Uses technical but accessible language
- Includes a use case example
- Is optimized for SEO (includes relevant keywords)
```

**Example for NexDocs**:
```
Generate a feature description for NexDocs documentation viewer that:
- Explains it's a MkDocs-style documentation viewer
- Highlights interactive diagrams and real-time editing
- Mentions export to PDF/HTML/Markdown
- Includes a use case: "Technical writers can generate documentation from SysML models"
- Optimized for keywords: "SysML documentation", "MBSE documentation", "model documentation"
```

### 3. Product Page Content

**Prompt Template**:
```
Create a product page for [Product Name] that includes:
1. Hero section with value proposition
2. Key features list (3-5 items)
3. Use cases section
4. Technical specifications
5. Integration points
6. Call-to-action

Base content on FEATURES.md and maintain consistent tone with homepage.
```

---

## 🔧 Code Optimization Workflows

### 1. Component Performance

**Prompt**:
```
Analyze this React component for performance issues:
- Check for unnecessary re-renders
- Identify missing memoization opportunities
- Suggest code splitting if needed
- Optimize image loading
- Review bundle size impact
```

**Example**:
1. Open `src/components/Hero.jsx`
2. Select the component code
3. Use Claude Code with the prompt above
4. Apply suggested optimizations

### 2. Accessibility Improvements

**Prompt**:
```
Review this component for WCAG 2.1 AA compliance:
- Check ARIA labels and roles
- Verify keyboard navigation
- Ensure color contrast ratios
- Test screen reader compatibility
- Add missing semantic HTML
```

### 3. Mobile Responsiveness

**Prompt**:
```
Review and improve mobile responsiveness:
- Check all breakpoints (mobile, tablet, desktop)
- Ensure touch targets are at least 44x44px
- Verify text is readable without zooming
- Test horizontal scrolling issues
- Optimize images for mobile
```

---

## 🎨 Design & Content Workflows

### 1. Generate Alt Text for Images

**Prompt**:
```
Generate descriptive, SEO-optimized alt text for this image:
[Describe the image or provide context]

Requirements:
- Descriptive and specific
- Includes relevant keywords naturally
- Under 125 characters
- Helps visually impaired users understand the image
```

### 2. Create Meta Descriptions

**Prompt**:
```
Generate SEO-optimized meta descriptions for:
- Homepage: Focus on SysML v2, VS Code, MBSE
- Product pages: Focus on specific product features
- Solutions pages: Focus on use cases and benefits

Each should be:
- 150-160 characters
- Include primary keywords
- Compelling and action-oriented
- Unique per page
```

### 3. Write Blog Post Ideas

**Prompt**:
```
Generate 10 blog post ideas for SysNex that:
- Target systems engineers and MBSE professionals
- Cover topics like: SysML v2, VS Code workflows, compliance, AI integration
- Include SEO-friendly titles
- Have clear value propositions
- Address common pain points
```

---

## 🧪 Testing & Quality Assurance

### 1. Generate Test Cases

**Prompt**:
```
Generate comprehensive test cases for [Component Name] using Vitest:
- Unit tests for component rendering
- Interaction tests for user actions
- Accessibility tests
- Responsive design tests
- Edge case handling

Include test descriptions and expected outcomes.
```

### 2. Code Review

**Prompt**:
```
Review this code for:
- Best practices and patterns
- Potential bugs or edge cases
- Performance optimizations
- Security considerations
- Code maintainability
- TypeScript type safety
```

### 3. Generate Documentation

**Prompt**:
```
Generate documentation for [Component/Feature] that includes:
- Purpose and use case
- Props/parameters documentation
- Usage examples
- Integration guide
- Troubleshooting tips
```

---

## 🎯 Specific Homepage Use Cases

### 1. Optimize Hero Section

**Workflow**:
1. Open `src/pages/Home.jsx`
2. Find the hero section component
3. Use Claude Code with:
   ```
   Optimize this hero section for:
   - Better conversion rates
   - Clearer value proposition
   - Improved readability
   - Better mobile experience
   - SEO optimization
   ```

### 2. Improve Feature Grid

**Workflow**:
1. Open the feature grid component
2. Use Claude Code:
   ```
   Improve this feature grid:
   - Make descriptions more compelling
   - Add use case examples
   - Optimize for mobile layout
   - Improve accessibility
   - Add hover states and animations
   ```

### 3. Create Call-to-Action Copy

**Workflow**:
1. Identify CTA locations (hero, features, pricing)
2. Use Claude Code:
   ```
   Generate compelling CTA copy for:
   - Hero section: Focus on "Try Free" or "Get Started"
   - Feature section: Focus on "Learn More"
   - Pricing section: Focus on "Start Free Trial"
   
   Requirements:
   - Action-oriented
   - Clear value proposition
   - Creates urgency (optional)
   - A/B test variations
   ```

### 4. Optimize for SEO

**Workflow**:
1. Open `index.html` or page components
2. Use Claude Code:
   ```
   Optimize SEO for this page:
   - Review meta tags (title, description, keywords)
   - Check structured data (JSON-LD)
   - Optimize headings (H1, H2, H3)
   - Review content for keyword density
   - Check internal linking
   - Verify image alt text
   ```

---

## 📊 Advanced Workflows

### 1. Content Audit

**Prompt**:
```
Perform a comprehensive content audit of the homepage:
- Check for clarity and readability
- Verify consistency in tone and style
- Identify missing information
- Suggest improvements for conversion
- Review for technical accuracy
- Check for outdated information
```

### 2. Competitive Analysis

**Prompt**:
```
Based on competitive analysis, suggest improvements:
- Compare with competitor homepages
- Identify unique value propositions to highlight
- Suggest features to emphasize
- Recommend content structure improvements
- Propose differentiation strategies
```

### 3. User Journey Optimization

**Prompt**:
```
Optimize user journey for [User Persona]:
- Map current user flow
- Identify friction points
- Suggest improvements for each step
- Recommend A/B test ideas
- Propose conversion optimization strategies
```

---

## 🛠️ Setup Instructions

### 1. Create `.cursorrules` File

Create a `.cursorrules` file in the project root:

```markdown
# SysNex Homepage Development Rules

## Context
- React-based homepage for SysNex (SysML v2 VS Code Extension)
- Target audience: Systems engineers, MBSE professionals
- Tech stack: React, Vite, React Router, Vitest, Playwright

## Style Guidelines
- Use modern, professional, technical tone
- Focus on clarity and value proposition
- Optimize for SEO and accessibility
- Mobile-first responsive design

## Code Standards
- Use functional components with hooks
- TypeScript for type safety
- Follow React best practices
- Optimize for performance (lazy loading, code splitting)
- WCAG 2.1 AA compliance

## Content Guidelines
- Reference FEATURES.md for accurate feature descriptions
- Use consistent terminology (SysML v2, MBSE, VS Code)
- Highlight key differentiators: AI-first, Git-based, 10x performance
- Include clear CTAs

## Testing Requirements
- Unit tests for components
- Accessibility tests
- Responsive design tests
- E2E tests for critical user flows
```

### 2. Create Custom Commands File

Create `CLAUDE_COMMANDS.md` in project root with reusable prompts (see Quick Start section above).

### 3. Configure Claude Code Settings

In VS Code/Cursor settings, you can:
- Set default model (Claude 3.5 Sonnet recommended)
- Configure context window size
- Enable codebase indexing for better context

---

## 💡 Best Practices

### 1. Provide Context
Always provide relevant context when asking Claude Code:
- Reference related files
- Include user personas
- Mention business goals
- Share analytics data (if available)

### 2. Iterate and Refine
- Start with broad requests
- Refine based on results
- Ask follow-up questions
- Combine multiple suggestions

### 3. Review and Validate
- Always review AI-generated content
- Test code changes thoroughly
- Verify SEO improvements
- Check accessibility compliance

### 4. Maintain Consistency
- Use consistent terminology
- Follow brand guidelines
- Maintain tone and style
- Keep design system consistent

---

## 📚 Reference Files

When working with Claude Code, reference these files for context:

- **FEATURES.md** - Complete feature list and capabilities
- **FEATURE_USER_GROUP_MAPPING.md** - User personas and feature mapping
- **DALLE_PROMPTS.md** - Visual asset guidelines
- **package.json** - Dependencies and scripts
- **vite.config.js** - Build configuration

---

## 🎯 Example Workflow: Complete Homepage Optimization

1. **Content Review**
   ```
   /audit-content - Review all homepage content
   ```

2. **SEO Optimization**
   ```
   /optimize-seo - Optimize meta tags and structured data
   ```

3. **Accessibility Check**
   ```
   /improve-accessibility - Review all components
   ```

4. **Performance Audit**
   ```
   /optimize-performance - Analyze and optimize components
   ```

5. **Mobile Optimization**
   ```
   /improve-mobile-responsive - Test and fix mobile issues
   ```

6. **Generate Tests**
   ```
   /create-test-cases - Generate comprehensive test suite
   ```

---

## 🔗 Integration with Existing Tools

### GitHub Copilot
- Use alongside Claude Code for code completion
- Claude Code for high-level tasks, Copilot for inline suggestions

### VS Code AI
- Use for semantic search across codebase
- Leverage for quick fixes and refactoring

### Playwright
- Use Claude Code to generate E2E test scenarios
- Create test cases based on user journeys

---

## 📝 Quick Reference: Common Prompts

| Task | Prompt |
|------|--------|
| **Improve copy** | "Make this copy more compelling and conversion-focused" |
| **Fix accessibility** | "Review and fix accessibility issues in this component" |
| **Optimize SEO** | "Optimize this page for SEO: meta tags, headings, content" |
| **Generate CTA** | "Create 3 variations of CTA copy for A/B testing" |
| **Write feature description** | "Write a feature description based on FEATURES.md" |
| **Create test** | "Generate Vitest test cases for this component" |
| **Improve mobile** | "Review and improve mobile responsiveness" |
| **Code review** | "Review this code for best practices and optimizations" |

---

## 🚀 Getting Started Checklist

- [ ] Create `.cursorrules` file with project context
- [ ] Create `CLAUDE_COMMANDS.md` with custom commands
- [ ] Test basic Claude Code functionality
- [ ] Review homepage content with Claude Code
- [ ] Optimize SEO meta tags
- [ ] Improve accessibility
- [ ] Generate test cases
- [ ] Create content variations for A/B testing

---

**Last Updated**: January 2026  
**Maintainer**: Development Team

---

*For questions or improvements to this guide, please update this file or contact the team.*


