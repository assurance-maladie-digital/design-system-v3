# Utilitaires publics

Référence des fonctions utilitaires exportées par `@cnamts/synapse`.

**Fichier source** : `src/utils/index.ts`  
**Import** : `import { formatDate, copyToClipboard, … } from '@cnamts/synapse'`

---

## Sommaire

| Catégorie | Fonctions |
|---|---|
| [Formatage](#formatage) | `formatDate`, `formatNir`, `calcHumanFileSize`, `convertToUnit` |
| [Dates](#dates) | `parseDate`, `isDateAfter`, `isDateBefore`, `isDateInRange`, `isDateValidUtil`, `isWeekend` |
| [Validation](#validation) | `isEmailValid` |
| [DOM & Browser](#dom--browser) | `copyToClipboard`, `downloadFile` |
| [Performance](#performance) | `throttleDisplayFn` |
| [Data](#data) | `deepCopy` |
| [Storage](#storage) | `LocalStorageUtility` |

---

## Formatage

### `formatDate`

**Fichier** : `src/utils/formatDate/index.ts`

```ts
import { formatDate } from '@cnamts/synapse'

formatDate(dayjs('2026-01-15'))              // '15/01/2026'
formatDate(dayjs('2026-01-15'), 'YYYY-MM-DD') // '2026-01-15'
```

```ts
function formatDate(date: Dayjs, format?: string): string
// format par défaut : 'DD/MM/YYYY'
```

Wrapper autour de `dayjs(date).format(format)`.

---

### `formatNir`

**Fichier** : `src/utils/formatNir/formatNir.ts`

Formate un numéro NIR (numéro de sécurité sociale) en insérant des espaces aux positions standard.

```ts
import { formatNir } from '@cnamts/synapse'

formatNir('1234567890123')   // '1 23 45 678 901 23'
formatNir('12345678901234')  // '1 23 45 678 901 23 4' (avec clé)
```

```ts
function formatNir(nir: string): string
```

Fonctionne avec ou sans clé (13 ou 15 chiffres). Insère des espaces aux positions `[1, 3, 5, 7, 10, 13]`.

---

### `calcHumanFileSize`

**Fichier** : `src/utils/calcHumanFileSize/index.ts`

Convertit une taille en octets en valeur lisible.

```ts
import { calcHumanFileSize } from '@cnamts/synapse'

const units = ['octets', 'Ko', 'Mo', 'Go']
calcHumanFileSize(1024, units)          // '1 Ko'
calcHumanFileSize(1536, units)          // '1.5 Ko'
calcHumanFileSize(1048576, units)       // '1 Mo'
calcHumanFileSize(1024, units, ' — ')   // '1 — Ko'
```

```ts
function calcHumanFileSize(size: number, fileSizeUnits: string[], separator?: string): string
// separator par défaut : ' '
```

Le tableau `fileSizeUnits` doit avoir autant d'entrées que de paliers : `[octets, Ko, Mo, Go, To, …]`.

---

### `convertToUnit`

**Fichier** : `src/utils/convertToUnit/index.ts`

Convertit une valeur numérique ou string en unité CSS.

```ts
import { convertToUnit } from '@cnamts/synapse'

convertToUnit(200)          // '200px'
convertToUnit(200, 'rem')   // '200rem'
convertToUnit('50%')        // '50%'   (string avec unité → passé tel quel)
convertToUnit(null)         // undefined
convertToUnit('')           // undefined
```

```ts
function convertToUnit(str: string | number | null | undefined, unit?: string): string | undefined
// unit par défaut : 'px'
```

Utilisé en interne par `useWidthable` pour convertir les props `width`, `minWidth`, `maxWidth`.

---

## Dates

Toutes ces fonctions utilisent `dayjs` et attendent le format `'DD/MM/YYYY'` par défaut sauf mention contraire.

### `parseDate`

**Fichier** : `src/utils/parseDate/index.ts`

Parse une string en objet `dayjs.Dayjs`. Corrige automatiquement les problèmes de fuseau horaire en fixant l'heure à `04:00:00` ou `14:00:00` selon l'offset UTC.

```ts
import { parseDate } from '@cnamts/synapse'

const d = parseDate('15/01/2026')           // Dayjs
const d = parseDate('2026-01-15', 'YYYY-MM-DD')
```

```ts
function parseDate(value: string, format?: string): dayjs.Dayjs
// format par défaut : 'DD/MM/YYYY'
```

> ⚠️ Le mode strict (`true`) est activé — une date invalide retourne un `Dayjs` avec `isValid() === false`.

---

### `isDateAfter`

```ts
import { isDateAfter } from '@cnamts/synapse'

isDateAfter('31/12/2026', '01/01/2027')  // true  (01/01/2027 est après 31/12/2026)
isDateAfter('31/12/2026', '01/01/2026')  // false
```

```ts
function isDateAfter(maxDate: string, value: string): boolean
```

Vérifie si `value` est **après** `maxDate`. Les deux paramètres sont en `DD/MM/YYYY`.

---

### `isDateBefore`

```ts
function isDateBefore(minDate: string, value: string): boolean
```

Vérifie si `value` est **avant** `minDate`.

---

### `isDateInRange`

```ts
function isDateInRange(minDate: string, maxDate: string, value: string): boolean
```

Vérifie si `value` est dans l'intervalle `[minDate, maxDate]` (bornes incluses).

---

### `isDateValidUtil`

```ts
import { isDateValidUtil } from '@cnamts/synapse'

isDateValidUtil('15/01/2026')   // true
isDateValidUtil('32/01/2026')   // false
isDateValidUtil('abc')          // false
```

```ts
function isDateValidUtil(value: string, format?: string): boolean
// format par défaut : 'DD/MM/YYYY'
```

> Exportée sous le nom `isDateValidUtil` (et non `isDateValid`) pour éviter un conflit de nom avec la règle de validation `isDateValid` de `src/utils/rules/`.

---

### `isWeekend`

```ts
import { isWeekend } from '@cnamts/synapse'

isWeekend('18/01/2026')  // true  (dimanche)
isWeekend('19/01/2026')  // false (lundi)
```

```ts
function isWeekend(value: string, format?: string): boolean
```

---

## Validation

### `isEmailValid`

```ts
import { isEmailValid } from '@cnamts/synapse'

isEmailValid('user@example.com')  // true
isEmailValid('invalid')           // false
```

```ts
function isEmailValid(value: string): boolean
```

---

## DOM & Browser

### `copyToClipboard`

**Fichier** : `src/utils/functions/copyToClipboard/index.ts`

Copie un texte dans le presse-papier. Utilise `navigator.clipboard.writeText` si disponible, sinon fallback `execCommand('copy')`.

```ts
import { copyToClipboard } from '@cnamts/synapse'

copyToClipboard('Texte à copier')
```

```ts
function copyToClipboard(textToCopy: string): void
```

Restaure automatiquement la sélection utilisateur préexistante après la copie.

---

### `downloadFile`

**Fichier** : `src/utils/functions/downloadFile/index.ts`

Déclenche le téléchargement d'un fichier côté navigateur via un lien `<a>` temporaire.

```ts
import { downloadFile } from '@cnamts/synapse'

// Télécharger un CSV
downloadFile('col1,col2\n1,2', 'export.csv', 'text/csv')

// Télécharger un CSV compatible Excel (UTF-8 BOM)
downloadFile('col1,col2\n1,2', 'export.csv', 'text/csv', true)

// Télécharger un Blob (fichier binaire)
downloadFile(myBlob, 'document.pdf', 'application/pdf')
```

```ts
function downloadFile(
  content: BufferSource | Blob | string,
  filename: string,
  type: string | undefined,
  utf8Bom?: boolean,  // défaut : false — ajoute \ufeff pour la compatibilité Excel
): void
```

---

## Performance

### `throttleDisplayFn`

**Fichier** : `src/utils/functions/throttleDisplayFn/throttleDisplayFn.ts`  
**Export** : `import throttleDisplayFn` (export default)

Retourne une version throttlée d'une fonction. L'appel réel est différé via `requestAnimationFrame` si le délai est écoulé, sinon via `setTimeout`.

```ts
import { throttleDisplayFn } from '@cnamts/synapse'

const onScroll = throttleDisplayFn((event: Event) => {
  updateUI(event)
}, 100)

window.addEventListener('scroll', onScroll)
```

```ts
function throttleDisplayFn<F extends (...args: unknown[]) => void>(
  fn: F,
  delay: number,
): (...args: Parameters<F>) => void
```

---

## Data

### `deepCopy`

**Fichier** : `src/utils/functions/deepCopy/index.ts`

Copie profonde d'un objet ou tableau sans référence partagée. Implémentation récursive native (pas de dépendance externe).

```ts
import { deepCopy } from '@cnamts/synapse'

const original = { a: { b: 1 } }
const copy = deepCopy(original)

copy.a.b = 99
console.log(original.a.b) // 1 — non modifié
```

```ts
function deepCopy<T = any>(o: unknown): T
```

> Les propriétés `undefined` sont **ignorées** (non copiées).  
> Pour les données réactives Vue, préférer `toRaw()` avant `deepCopy` pour éviter de copier le proxy.

---

## Storage

### `LocalStorageUtility`

**Fichier** : `src/utils/localStorageUtility/index.ts`

Classe wrapper autour de `localStorage` avec support du **versionning**, de l'**expiration passive** et d'un **préfixe** de clé. Gère gracieusement l'indisponibilité de `localStorage` (mode privé, SSR).

### Instanciation

```ts
import { LocalStorageUtility } from '@cnamts/synapse'

// Simple (préfixe 'vd-' par défaut)
const storage = new LocalStorageUtility()

// Avec version (efface le storage si version plus ancienne)
const storage = new LocalStorageUtility(2)

// Avec version + expiration (en ms)
const storage = new LocalStorageUtility(2, 3600 * 1000) // expire après 1h

// Avec préfixe personnalisé
const storage = new LocalStorageUtility(1, undefined, 'myapp-')
```

```ts
constructor(version?: number, expiration?: number, prefix?: string)
// prefix par défaut : 'vd-'
```

### API

```ts
storage.setItem('user', { id: 1, name: 'Alice' })
storage.getItem<{ id: number, name: string }>('user') // { id: 1, name: 'Alice' } | null
storage.removeItem('user')
storage.clear()          // Efface toutes les clés avec le préfixe
storage.length           // Nombre d'items stockés
storage.key(0)           // Clé du premier item
```

### Comportement versionning / expiration

Au constructeur :
- Si le storage ne contient pas d'item de contrôle → considéré périmé → `clear()` automatique
- Si la version stockée < version fournie → `clear()` automatique
- Si `expiresAt` dépassé → `clear()` automatique

Toutes les clés sont préfixées (`vd-` par défaut) pour isoler les données et éviter les collisions.

### Propriétés publiques

| Propriété | Type | Description |
|---|---|---|
| `localStorageSupported` | `boolean` | `false` si `localStorage` est indisponible |
| `version` | `number \| undefined` | Version courante |
| `expiration` | `number \| undefined` | Durée de vie en ms |
| `prefix` | `string` | Préfixe des clés |
