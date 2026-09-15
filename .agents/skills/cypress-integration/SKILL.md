---
name: cypress-integration
description: Use ONLY for end-to-end (E2E) and integration testing with Cypress in Vue 3 + Vuetify 3 projects. Covers component testing, visual tests, user interactions (menus, popups, forms), assertions, and snapshot comparisons. Based on Synapse DS v3 conventions and best practices.
license: MIT
metadata:
  author: CNAM Synapse Team
  version: "1.0.0"
  source: Synapse Design System v3
---

# Cypress Integration Testing for Vue 3 + Vuetify 3

> **Scope**: This skill is specialized for **Cypress component testing** in a **Vue 3 + Vuetify 3** environment, with a focus on **visual tests**, **user interactions**, and **accessibility-aware assertions**. It is designed to align with the conventions of the **@cnamts/synapse** Design System.

> **Prerequisites**: Familiarity with Vue 3, Vuetify 3, and basic Cypress concepts (selectors, commands, assertions).

---

## Core Principles

1. **Test User Behavior, Not Implementation**: Focus on simulating real user interactions (clicks, navigation, keyboard input) rather than testing internal component logic.
2. **Visual tests as First-Class Citizen**: Use `cy.matchImageSnapshot()` to catch unintended visual changes.
3. **Accessibility-Aware Testing**: Ensure tests validate ARIA attributes, focus states, and keyboard navigation.
4. **Isolation**: Each test should be independent. Use `cy.mountWithVuetify()` (or equivalent) to mount components in isolation.
5. **Deterministic Tests**: Avoid flakiness by waiting for elements to be stable (`cy.get().should('be.visible')`) before interacting.

> **Best Practice**: Prefer `data-test-id` attributes for stable selectors in tests. Avoid relying on CSS classes or tags, which may change during refactoring.

---

## 1. Setup and Configuration

### 1.1 Installation

Ensure Cypress is installed with the following plugins (as in Synapse DS v3):
```bash
pnpm add -D cypress cypress-image-snapshot
```

### 1.2 Cypress Configuration (`cypress.config.ts`)

Use the following base configuration for **component testing** with visual tests:
```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
       // Plugins for visual tests
        require('cypress-image-snapshot/plugin')(on, config)
       return config
    },
  },
  e2e: {
    // Disable if only doing component testing
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:6006', // Storybook or dev server
  },
  // Visual tests settings
  screenshotOptions: {
    clip: { x: 0, y: 0, width: 1200, height: 800 },
  },
})
```

### 1.3 Custom Commands

Define reusable commands in `cypress/support/commands.ts`:
```ts
/// <reference types="cypress" />

// Mount Vue components with Vuetify
import { mount } from 'cypress/vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { DefineComponent } from 'vue'

// Extend Cypress types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      mountWithVuetify: typeof mountWithVuetify
      focusVisible: typeof focusVisible
      closeAllOverlays: typeof closeAllOverlays
    }
  }
}

Cypress.Commands.add('mountWithVuetify', (component: DefineComponent<{}, {}, any>, options = {}) => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  const globalOptions = {
    plugins: [vuetify],
    ...options.global,
  }

  return mount(component, { global: globalOptions, ...options })
})

// Trigger focus-visible for accessibility testing
Cypress.Commands.add('focusVisible', (selector: string) => {
  cy.get(selector).then(($el) => {
    ($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
  })
})

// Close all open menus/modals/overlays
// WARNING: Direct DOM manipulation may bypass Vue/Vuetify reactivity.
// Prefer using component-specific methods (e.g., `clickOutside`) where available.
Cypress.Commands.add('closeAllOverlays', () => {
  cy.get('body').then(($body) => {
    // Close overlays and menus using data-test-id where possible
    $body.find('[data-test-id="menu-overlay"], [data-test-id="modal-overlay"]').remove()
    // Close custom menus
    $body.find('[data-test-id="menu-content"]').remove()
  })
})
```

---

## 2. Testing Patterns

### 2.1 Component Mounting

Always mount components with Vuetify context:
```ts
it('mounts correctly', () => {
  cy.mountWithVuetify(MyComponent, {
    props: { someProp: 'value' },
    slots: { default: () => 'Slot content' },
  })
  cy.get('[data-test-id="my-component"]').should('be.visible')
})
```

### 2.2 User Interactions

#### Opening Menus and Popups

Use `click()` with assertions to ensure the menu is open:
```ts
it('opens a menu on click', () => {
  cy.mountWithVuetify(MenuComponent)
 
  // Click the trigger
  cy.get('[data-test-id="menu-trigger"]').click()
  
  // Assert the menu is open
  cy.get('[data-test-id="menu-content"]').should('be.visible')
  
  // Interact with menu items
  cy.contains('Menu Item 1').click()
  
  // Assert the menu closes (if expected)
  cy.get('[data-test-id="menu-content"]').should('not.exist')
})
```

#### Handling Overlays

For components with overlays (e.g., modals, dialogs):
```ts
it('opens a modal and interacts with it', () => {
  cy.mountWithVuetify(ModalComponent, {
    props: { modelValue: false },
  })

   // Open the modal
    cy.get('[data-test-id="open-modal"]').click()
    cy.get('[data-test-id="modal-dialog"]').should('be.visible')
  
  // Interact with modal content
  cy.get('[data-test-id="modal-input"]').type('Test input')
  
  // Close the modal
  cy.get('[data-test-id="close-modal"]').click()
  cy.get('[data-test-id="modal-dialog"]').should('not.exist')
})
```

#### Keyboard Navigation

Test accessibility with keyboard interactions:
```ts
it('navigates with keyboard', () => {
  cy.mountWithVuetify(MenuComponent)

  // Focus the trigger
  cy.get('[data-test-id="menu-trigger"]').focus()

  // Open with Enter
  cy.focused().type('{enter}')
  cy.get('[data-test-id="menu-content"]').should('be.visible')
  
  // Navigate with arrow keys
  cy.focused().type('{downarrow}{downarrow}')
  
  // Select with Enter
  cy.focused().type('{enter}')
})
```

### 2.3 Assertions

#### Visibility and State
```ts
// Basic visibility
cy.get('[data-test-id="component"]').should('be.visible')

// Text content
cy.get('[data-test-id="component"]').should('contain.text', 'Expected Text')

// ARIA attributes
cy.get('[data-test-id="component"]').should('have.attr', 'aria-expanded', 'true')

// Classes (for styling/state)
cy.get('[data-test-id="component"]').should('have.class', 'active')
```

#### Visual tests

Use `cy.matchImageSnapshot()` for visual tests:
```ts
it('matches visual snapshot', () => {
  cy.mountWithVuetify(Component)
  cy.matchImageSnapshot('component-default')
})

// For a specific element
it('matches visual snapshot of a sub-component', () => {
  cy.mountWithVuetify(Component)
  cy.matchImageSnapshot('component-subpart', cy.get('[data-test-id="subpart"]'))
})
```

**Best Practices for Snapshots**:
- Use **descriptive names** (e.g., `header-burger-menu-open`).
- Test **multiple states** (default, hovered, focused, disabled).
- Use **realistic viewports** (`cy.viewport(1200, 800)`).

#### Focus Testing

For accessibility, test focus states:
```ts
it('shows focus ring on interactive elements', () => {
   cy.mountWithVuetify(ButtonComponent)
   cy.focusVisible('[data-test-id="button"]')
   cy.get('[data-test-id="button"]').should('have.class', 'focus-visible')
   cy.matchImageSnapshot('button-focus')
})
```

### 2.4 Forms Testing

Test form interactions thoroughly:
```ts
it('submits a form', () => {
  cy.mountWithVuetify(FormComponent)

  // Fill inputs
  cy.get('[data-test-id="name"]').type('John Doe')
  cy.get('[data-test-id="email"]').type('john@example.com')

  // Select options
  cy.get('[data-test-id="country"]').select('France')

  // Check checkboxes
  cy.get('[data-test-id="agree"]').check()

  // Submit
  cy.get('[data-test-id="submit"]').click()

  // Assert submission
  cy.get('.success-message').should('be.visible')
})
```

---

## 3. Example: Full Integration Test for a Menu Component

Based on `HeaderBurgerMenu.visual.cy.ts` from Synapse DS v3:

```ts
import { h } from 'vue'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import HeaderMenuItem from '../HeaderMenuItem/HeaderMenuItem.vue'

// Helper to mount the menu with realistic content
// Note: `registerHeaderMenuKey` is a Synapse-specific injection key for menu registration
function mountMenu() {
  cy.viewport(375, 900) // Mobile viewport

  cy.mountWithVuetify(HeaderBurgerMenu, {
    global: {
      provide: {
        // Synapse-specific: Required for menu component registration
        [registerHeaderMenuKey]: () => {},
      },
    },
    slots: {
      default: () => h(HeaderMenuItem, {}, { default: () => 'Menu Item 1' }),
    },
  })

  // Open the menu
  cy.get('[data-test-id="header-menu-btn"]').first().click()
  cy.get('[data-test-id="menu-overlay"]').should('be.visible')
  cy.get('[data-test-id="menu-wrapper"]').should('be.visible')
}

describe('HeaderBurgerMenu - Integration Tests', () => {
  it('opens and closes the menu', () => {
    mountMenu()
  
    // Close the menu
    cy.get('[data-test-id="menu-overlay"]').click('topLeft')
    cy.get('[data-test-id="menu-wrapper"]').should('not.exist')
  })

  it('navigates through menu items', () => {
    const onNavigate = cy.spy().as('onNavigate')
    mountMenu()
  
    // Click a menu item
    cy.contains('Menu Item 1').click()
  
   // Assert navigation via emitted event
   cy.get('@onNavigate').should('have.been.calledWith', '/menu-item-1')
  })

  it('handles submenu interactions', () => {
    mountMenu()

    // Open submenu
    cy.contains('[data-test-id="sub-menu-btn"]', 'Submenu').click()
    cy.get('[data-test-id="sub-menu-open"]').should('exist')

    // Interact with submenu item
    cy.contains('Submenu Item 1').click()
  })

  it('matches visual snapshot when opened', () => {
    mountMenu()
    cy.matchImageSnapshot('header-burger-menu-open')
  })

  it('matches visual snapshot with submenu open', () => {
    mountMenu()
    cy.contains('[data-test-id="sub-menu-btn"]', 'Submenu').click()
    cy.get('[data-test-id="sub-menu-content"]').should('be.visible')
    cy.matchImageSnapshot('header-burger-menu-submenu-open')
  })
})
```

---

## 4. Testing Strategies for Common UI Patterns

### 4.1 Menus and Dropdowns

- Test **opening/closing** (click, keyboard).
- Test **navigation** (arrow keys, `Enter`, `Escape`).
- Test **item selection** (click, `Enter`).
- Test **focus trapping** (if modal).
- Test **visual tests** for open/closed states.

### 4.2 Modals and Dialogs

- Test **opening/closing** (trigger button, `Escape`).
- Test **focus trapping** (tab order stays within modal).
- Test **overlay behavior** (click outside to close).
- Test **visual tests** for content and focus states.

### 4.3 Forms

- Test **input validation** (error messages, disabled submit).
- Test **submission** (success/error states).
- Test **focus order** (logical tab sequence).
- Test **visual tests** for focus states on inputs.

### 4.4 Tabs and Accordions

- Test **switching tabs** (click, keyboard).
- Test **expanding/collapsing** panels.
- Test **ARIA attributes** (`aria-selected`, `aria-expanded`).
- Test **visual tests** for active/inactive states.

---

## 5. Accessibility Testing

### 5.1 Keyboard Navigation

- Use `cy.tab()` to test tab order.
- Use `cy.focus()` + keyboard events (`{enter}`, `{space}`, `{esc)`).
- Assert focus is moved correctly.

### 5.2 ARIA Attributes

```ts
it('has correct ARIA attributes', () => {
  cy.mountWithVuetify(Accordion)

  // Check initial state
  cy.get('[data-test-id="accordion-item"]').should('have.attr', 'aria-expanded', 'false')

  // Open accordion
  cy.get('[data-test-id="accordion-trigger"]').click()
  cy.get('[data-test-id="accordion-item"]').should('have.attr', 'aria-expanded', 'true')
})
```

### 5.3 Focus Management

```ts
it('manages focus correctly', () => {
  cy.mountWithVuetify(ModalComponent)

  // Open modal
  cy.get('[data-test-id="open"]').click()

  // Focus should be on the first interactive element
  cy.focused().should('have.attr', 'data-test-id').and('equal', 'first-input')

  // Close modal
  cy.get('[data-test-id="close"]').click()

  // Focus should return to the trigger
  cy.focused().should('have.attr', 'data-test-id', 'open')
})
```

---

## 6. Debugging Tips

### 6.1 Inspecting Elements

Use `cy.get().debug()` to print element details to the console:
```ts
cy.get('[data-test-id="my-component"]').debug()
```

### 6.2 Pausing Tests

Use `cy.pause()` to pause the test runner and inspect the app:
```ts
cy.pause()
```

### 6.3 Timeouts

Increase timeouts for slow animations:
```ts
cy.get('.slow-element', { timeout: 10000 }).should('be.visible')
```

---

## 7. Synapse DS v3-Specific Conventions

### 7.1 File Structure

Follow the Synapse convention for test files:
```
src/components/<Component>/tests/<Component>.visual.cy.ts
```

### 7.2 Naming Snapshots

Use **kebab-case** for snapshot names and include the component name:
```ts
cy.matchImageSnapshot('header-burger-menu-open')
```

### 7.3 Viewports

Test with **realistic viewports** for mobile/desktop:
```ts
// Mobile
cy.viewport(375, 667) // iPhone SE
cy.viewport(390, 844) // iPhone 12/13/14

// Desktop
cy.viewport(1200, 800)
cy.viewport(1440, 900)
```

### 7.4 Visual Regression Baselines

> **Important**: Baseline snapshots **must not be generated under WSL** (Windows Subsystem for Linux), as they differ from native Linux (CI environment). Always generate baselines on **native Linux** or in **CI**.

- **Update snapshots** for all components:
  ```bash
  pnpm test:visual:update
  ```
- **Update snapshots** for a specific component:
  ```bash
  pnpm test:visual:update --spec "src/components/<Component>/**/*.cy.ts"
  ```
- Use `pnpm test:visual:open` to **inspect** snapshots interactively (WSL-safe for inspection only).

### 7.5 Running Tests

Use the following scripts (from Synapse `package.json`):
```bash
# Run all visual tests (headless)
pnpm test:visual

# Run visual tests for a specific component
pnpm test:visual --spec "src/components/<Component>/**/*.cy.ts"

# Open Cypress GUI for debugging
pnpm test:visual:open
```

---

## 8. Anti-Patterns

Do not:
- **Test implementation details** (e.g., internal state, methods).
- **Hardcode waits** (`cy.wait(1000)` without reason). Use `cy.get().should()` instead.
- **Use flaky selectors** (e.g., `cy.get('div > span')`). Prefer `data-test-id` or ARIA attributes.
- **Create long test suites**. Split into multiple `describe` blocks.
- **Ignore accessibility**. Always test keyboard navigation and focus states.

Do:
- **Use stable selectors**: `data-test-id`, `[aria-label]`, `.class-name`.
- **Use custom commands** for repeated logic (e.g., `cy.mountWithVuetify()`).
- **Include visual tests** for UI-heavy components.
- **Keep tests short and focused**. One behavior per test.

---

## References

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Component Testing](https://docs.cypress.io/guides/component-testing)
- [Cypress Visual Regression with cypress-image-snapshot](https://github.com/palmerhq/cypress-image-snapshot)
