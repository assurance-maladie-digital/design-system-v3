# Rapport a11y

- Généré le: 2026-02-16T10:41:48.508Z
- Commande: pnpm vitest run a11y.spec.ts --reporter=json --outputFile a11y-raw.json
- Composants affectés: 15

## CookieBanner
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/CookieBanner/tests/CookieBanner.a11y.spec.ts

- Test: CookieBanner – accessibility (axe) > has no obvious axe violations in default state
  - Détails:

```
Error: [a11y][CookieBanner – default] 1 violation(s) axe:
1. aria-dialog-name (serious) – ARIA dialog and alertdialog nodes should have an accessible name [targets: .vd-cookie-banner__inner]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\CookieBanner\tests\CookieBanner.a11y.spec.ts:25:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## DataListItem
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/DataListItem/tests/DataListItem.a11y.spec.ts

- Test: DataListItem – accessibility (axe) > has no obvious axe violations with chip, icon slot and action
  - Détails:

```
Error: [a11y][DataListItem – chip and action] 1 violation(s) axe:
1. dlitem (serious) – <dt> and <dd> elements must be contained by a <dl> [targets: dt | dd]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\DataListItem\tests\DataListItem.a11y.spec.ts:27:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## ExternalLinks
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/ExternalLinks/tests/ExternalLinks.a11y.spec.ts

- Test: ExternalLinks – accessibility (axe) > has no obvious axe violations with menu open and items
  - Détails:

```
Error: [a11y][ExternalLinks – menu open with items] 1 violation(s) axe:
1. listitem (serious) – <li> elements must be contained in a <ul> or <ol> [targets: li:nth-child(1) | li:nth-child(2)]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\ExternalLinks\tests\ExternalLinks.a11y.spec.ts:33:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## DownloadBtn
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/DownloadBtn/tests/DownloadBtn.a11y.spec.ts

- Test: DownloadBtn – accessibility (axe) > has no obvious axe violations in default state
  - Détails:

```
Error: [a11y][DownloadBtn – default state] 1 violation(s) axe:
1. button-name (critical) – Buttons must have discernible text [targets: button]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\DownloadBtn\tests\DownloadBtn.a11y.spec.ts:22:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## HeaderNavigationBar
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/HeaderNavigationBar/tests/HeaderNavigationBar.a11y.spec.ts

- Test: HeaderNavigationBar – accessibility (axe) > has no obvious axe violations in desktop horizontal mode
  - Détails:

```
TypeError: Cannot read properties of undefined (reading 'setInnerWidth')
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\HeaderNavigationBar\tests\HeaderNavigationBar.a11y.spec.ts:18:26
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at runSuite (file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
```

## HeaderToolbar
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/HeaderToolbar/tests/HeaderToolbar.a11y.spec.ts

- Test: HeaderToolbar – accessibility (axe) > has no obvious axe violations with default desktop menus
  - Détails:

```
Error: [a11y][HeaderToolbar – default desktop menus] 1 violation(s) axe:
1. aria-allowed-attr (critical) – Elements must only use supported ARIA attributes [targets: a[aria-label="Professionnel de santé"]]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\HeaderToolbar\tests\HeaderToolbar.a11y.spec.ts:19:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## LunarCalendar
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/LunarCalendar/tests/LunarCalendar.a11y.spec.ts

- Test: LunarCalendar – accessibility (axe) > has no obvious axe violations with labeled required field
  - Détails:

```
Error: [a11y][LunarCalendar – labeled required field] 1 violation(s) axe:
1. aria-command-name (serious) – ARIA commands must have an accessible name [targets: i]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\LunarCalendar\tests\LunarCalendar.a11y.spec.ts:25:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## PaginatedTable
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/PaginatedTable/tests/PaginatedTable.a11y.spec.ts

- Test: PaginatedTable – accessibility (axe) > has no obvious axe violations in local mode with caption
  - Détails:

```
Error: [a11y][PaginatedTable – local mode with caption] 1 violation(s) axe:
1. aria-allowed-attr (critical) – Elements must only use supported ARIA attributes [targets: #sy-select-8tvt9]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PaginatedTable\tests\PaginatedTable.a11y.spec.ts:37:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## PageContainer
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/PageContainer/tests/PageContainer.a11y.spec.ts

- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with role="navigation" > has no axe violations with role="navigation"
  - Détails:

```
Error: [a11y][PageContainer – role="navigation"] 1 violation(s) axe:
1. landmark-unique (moderate) – Landmarks should have a unique role or role/label/title (i.e. accessible name) combination [targets: .py-10]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:122:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with role="contentinfo" > has no axe violations with role="contentinfo"
  - Détails:

```
Error: [a11y][PageContainer – role="contentinfo"] 3 violation(s) axe:
1. landmark-contentinfo-is-top-level (moderate) – Contentinfo landmark should not be contained in another landmark [targets: footer]
2. landmark-no-duplicate-contentinfo (moderate) – Document should not have more than one contentinfo landmark [targets: div[role="contentinfo"]]
3. landmark-unique (moderate) – Landmarks should have a unique role or role/label/title (i.e. accessible name) combination [targets: div[role="contentinfo"]]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:163:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with role="banner" > has no axe violations with role="banner"
  - Détails:

```
Error: [a11y][PageContainer – role="banner"] 3 violation(s) axe:
1. landmark-banner-is-top-level (moderate) – Banner landmark should not be contained in another landmark [targets: header]
2. landmark-no-duplicate-banner (moderate) – Document should not have more than one banner landmark [targets: div[role="banner"]]
3. landmark-unique (moderate) – Landmarks should have a unique role or role/label/title (i.e. accessible name) combination [targets: div[role="banner"]]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:184:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with uniqueId > has no axe violations with role="contentinfo" and uniqueId
  - Détails:

```
Error: [a11y][PageContainer – role="contentinfo" with uniqueId] 3 violation(s) axe:
1. landmark-contentinfo-is-top-level (moderate) – Contentinfo landmark should not be contained in another landmark [targets: #footer-content > footer]
2. landmark-no-duplicate-contentinfo (moderate) – Document should not have more than one contentinfo landmark [targets: #footer-container]
3. landmark-unique (moderate) – Landmarks should have a unique role or role/label/title (i.e. accessible name) combination [targets: #footer-container]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:299:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with uniqueId > has no axe violations with role="banner" and uniqueId
  - Détails:

```
Error: [a11y][PageContainer – role="banner" with uniqueId] 3 violation(s) axe:
1. landmark-banner-is-top-level (moderate) – Banner landmark should not be contained in another landmark [targets: #header-content > header]
2. landmark-no-duplicate-banner (moderate) – Document should not have more than one banner landmark [targets: #header-container]
3. landmark-unique (moderate) – Landmarks should have a unique role or role/label/title (i.e. accessible name) combination [targets: #header-container]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:323:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with role and uniqueId combination > supports multiple landmark instances with different roles and uniqueIds
  - Détails:

```
Error: [a11y][Header landmark] 1 violation(s) axe:
1. landmark-no-duplicate-banner (moderate) – Document should not have more than one banner landmark [targets: :root > .py-10.px-14[role="banner"]]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:384:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility with role and uniqueId combination > has proper semantic structure for complete page layout
  - Détails:

```
Error: [a11y][PageContainer – complete semantic structure] 1 violation(s) axe:
1. landmark-no-duplicate-main (moderate) – Document should not have more than one main landmark [targets: #page-main-container]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:416:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```
- Test: PageContainer – accessibility (axe) > PageContainer – accessibility edge cases > has proper color contrast with different background colors
  - Détails:

```
Error: [a11y][PageContainer – color contrast] 1 violation(s) axe:
1. landmark-no-duplicate-main (moderate) – Document should not have more than one main landmark [targets: :root > .py-10.px-14[role="main"]]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PageContainer\tests\PageContainer.a11y.spec.ts:474:4
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## PhoneField
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/PhoneField/tests/PhoneField.a11y.spec.ts

- Test: PhoneField – accessibility (axe) > has no obvious axe violations with country code and phone number
  - Détails:

```
Error: [a11y][PhoneField – country code + phone] 1 violation(s) axe:
1. aria-allowed-attr (critical) – Elements must only use supported ARIA attributes [targets: #sy-select-8ihnwl]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\PhoneField\tests\PhoneField.a11y.spec.ts:28:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## SyPagination
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/Customs/SyPagination/tests/SyPagination.a11y.spec.ts

- Test: SyPagination – accessibility (axe) > has no obvious axe violations with labelled navigation and active page
  - Détails:

```
Error: [a11y][SyPagination – labelled navigation] 1 violation(s) axe:
1. aria-valid-attr-value (critical) – ARIA attributes must conform to valid values [targets: nav]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\Customs\SyPagination\tests\SyPagination.a11y.spec.ts:23:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## SyTabs
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/Customs/SyTabs/tests/SyTabs.a11y.spec.ts

- Test: SyTabs – accessibility (axe) > has no obvious axe violations with three tabs and panels
  - Détails:

```
Error: [a11y][SyTabs – default configuration] 3 violation(s) axe:
1. aria-required-children (critical) – Certain ARIA roles must contain particular children [targets: nav]
2. aria-required-parent (critical) – Certain ARIA roles must be contained by particular parents [targets: #tab-0 | #tab-1 | #tab-2]
3. list (serious) – <ul> and <ol> must only directly contain <li>, <script> or <template> elements [targets: ul]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\Customs\SyTabs\tests\SyTabs.a11y.spec.ts:45:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## ComplexDatePicker
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/DatePicker/ComplexDatePicker/tests/ComplexDatePicker.a11y.spec.ts

- Test: ComplexDatePicker – accessibility (axe) > has no obvious axe violations in default calendar mode
  - Détails:

```
Error: [a11y][ComplexDatePicker – default calendar mode] 2 violation(s) axe:
1. aria-allowed-attr (critical) – Elements must only use supported ARIA attributes [targets: #input-v-1]
2. aria-command-name (serious) – ARIA commands must have an accessible name [targets: i]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\DatePicker\ComplexDatePicker\tests\ComplexDatePicker.a11y.spec.ts:22:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## CalendarMode
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/DatePicker/CalendarMode/tests/DatePicker.a11y.spec.ts

- Test: DatePicker (CalendarMode) – accessibility (axe) > has no obvious axe violations in default state
  - Détails:

```
Error: [a11y][DatePicker (CalendarMode) – default state] 1 violation(s) axe:
1. aria-allowed-attr (critical) – Elements must only use supported ARIA attributes [targets: #input-v-1]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\DatePicker\CalendarMode\tests\DatePicker.a11y.spec.ts:23:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

## DateTextInput
Fichier: C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/src/components/DatePicker/DateTextInput/tests/DateTextInput.a11y.spec.ts

- Test: DateTextInput – accessibility (axe) > has no obvious axe violations for a required single date field
  - Détails:

```
Error: [a11y][DateTextInput – required single date] 1 violation(s) axe:
1. aria-command-name (serious) – ARIA commands must have an accessible name [targets: i]
    at Module.assertNoA11yViolations (C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\tests\unit\accessibility\axeUtils.ts:45:8)
    at C:\Users\VACHETBENIMEL1-32214\Desktop\Dev\design-system-v3\src\components\DatePicker\DateTextInput\tests\DateTextInput.a11y.spec.ts:23:3
    at file:///C:/Users/VACHETBENIMEL1-32214/Desktop/Dev/design-system-v3/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:752:20
```

