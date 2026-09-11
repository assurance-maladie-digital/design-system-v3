---
name: pnpm-peer-dependencies
description: Handling peer dependencies with auto-install and resolution rules
---

# pnpm Peer Dependencies

pnpm has strict peer dependency handling by default. It provides configuration options to control how peer dependencies are resolved and reported.

All peer-dependency settings live in `pnpm-workspace.yaml` (camelCase). The `package.json#pnpm` field is no longer read.

## Auto-Install Peer Dependencies

By default (since v8), pnpm automatically installs missing non-optional peer dependencies:

```yaml title="pnpm-workspace.yaml"
autoInstallPeers: true
```

On conflicting requirements (e.g. one dep needs `vue@^3.4`, another `vue@^3.5`), pnpm installs nothing and prints a warning — resolve it manually.

## Strict Peer Dependencies

```yaml title="pnpm-workspace.yaml"
strictPeerDependencies: true   # default false
```

When strict, commands fail on a missing or invalid peer dependency in the tree.

## Resolve from workspace root

```yaml title="pnpm-workspace.yaml"
resolvePeersFromWorkspaceRoot: true   # default; install shared peers once at the root
```

## Deduplicate peers

```yaml title="pnpm-workspace.yaml"
dedupePeerDependents: true   # default; share package instances across projects when peers match
dedupePeers: false           # v10.33+: version-only peer suffixes (name@version), fewer instances
```

## Peer Dependency Rules

```yaml title="pnpm-workspace.yaml"
peerDependencyRules:
  ignoreMissing:
    - '@babel/*'
    - eslint
  allowedVersions:
    vue: '3'
  allowAny:
    - '@types/*'
```

### ignoreMissing

Suppress warnings for missing peer dependencies. Patterns: exact name (`vue`), scope (`@babel/*`), or `*` (not recommended).

```yaml title="pnpm-workspace.yaml"
peerDependencyRules:
  ignoreMissing:
    - '@babel/*'
    - eslint
    - webpack
```

### allowedVersions

Allow specific versions that would otherwise warn. Target a specific parent with `parent>peer`.

```yaml title="pnpm-workspace.yaml"
peerDependencyRules:
  allowedVersions:
    vue: '3'
    'vuetify@3>vue': '3'   # only when vue is a peer of vuetify@3
```

### allowAny

Resolve matching peers from any version, ignoring the declared range.

```yaml title="pnpm-workspace.yaml"
peerDependencyRules:
  allowAny:
    - '@types/*'
    - eslint
```

## Adding Peer Dependencies via packageExtensions

Declaratively add a missing peer dependency without JS:

```yaml title="pnpm-workspace.yaml"
packageExtensions:
  problematic-package:
    peerDependencies:
      vue: '*'
```

For conditional logic, use a `readPackage` hook in `.pnpmfile.mjs` instead.

## Peer Dependencies in Workspaces

Workspace packages can satisfy peer dependencies:

```json
// packages/app/package.json
{
  "dependencies": {
    "vue": "^3.5.0",
    "@myorg/components": "workspace:^"
  }
}

// packages/components/package.json  
{
  "peerDependencies": {
    "vue": "^3.4.0 || ^3.5.0"
  }
}
```

The workspace `app` provides `vue` which satisfies `components`' peer dependency.

## Common Scenarios

### Monorepo with Shared Vue

```yaml
# pnpm-workspace.yaml
catalog:
  vue: ^3.5.0
  vuetify: ^3.12.0
```

```json
// packages/ui/package.json
{
  "peerDependencies": {
    "vue": "^3.5.0",
    "vuetify": "^3.12.0"
  }
}

// apps/web/package.json
{
  "dependencies": {
    "vue": "catalog:",
    "vuetify": "catalog:",
    "@myorg/ui": "workspace:^"
  }
}
```

### Suppress ESLint Plugin Warnings

```yaml title="pnpm-workspace.yaml"
peerDependencyRules:
  ignoreMissing:
    - eslint
    - '@typescript-eslint/parser'
```

### Allow Multiple Major Versions

```yaml title="pnpm-workspace.yaml"
peerDependencyRules:
  allowedVersions:
    webpack: '4 || 5'
    postcss: '7 || 8'
```

## Debugging Peer Dependencies

```bash
# Report unmet/missing peers straight from the lockfile (v11)
pnpm peers check

# See why a package is installed
pnpm why <package>

# Check dependency tree
pnpm list --depth=Infinity
```

## Best Practices

1. **Keep `autoInstallPeers` on** for convenience (default in v8+)
2. **Use `peerDependencyRules`** instead of blanket-ignoring warnings
3. **Document suppressed warnings** explaining why they're safe
4. **Keep peer ranges wide** in libraries (e.g. `"vue": "^3.4.0 || ^3.5.0"`)
5. **Run `pnpm peers check`** in CI to catch peer regressions

<!--
Source references:
- https://pnpm.io/settings#peerdependencyrules
- https://pnpm.io/settings#autoinstallpeers
- https://pnpm.io/cli/peers
-->

