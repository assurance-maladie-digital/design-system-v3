---
name: app-development
description: Vue application conventions. Use when building web apps or writing Vue components.
---

# App Development

## Vue Conventions

| Convention | Preference |
|------------|------------|
| Script syntax | Always `<script setup lang="ts">` |
| State | Prefer `shallowRef()` over `ref()` |
| Objects | Use `ref()`, avoid `reactive()` |
| Styling | UnoCSS |
| Utilities | VueUse |

### Props and Emits

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

interface Emits {
  (e: 'update', value: number): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<Emits>()
</script>
```

### Storybook for Components

Set up Storybook for component development. Expressing each state as a story keeps components side-effect-free and their states predictable.

Run the story tests in CI. Prefer the Vitest addon (`@storybook/addon-vitest`) so stories run as part of the existing `vitest` run (see [setting-up](setting-up.md)).
