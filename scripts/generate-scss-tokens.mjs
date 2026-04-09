import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadTsModule } from './loadTsModule.mjs'
import { apVariantConfig, cnamVariantConfig, paVariantConfig } from './generate-scss-tokens.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const { buildVariant } = loadTsModule(path.join(rootDir, 'src/designTokens/builders/index.ts'))

fs.writeFileSync(
	path.join(rootDir, 'src/assets/tokens.generated.scss'),
	buildVariant(cnamVariantConfig),
)
fs.writeFileSync(
	path.join(rootDir, 'src/assets/paTokens.generated.scss'),
	buildVariant(paVariantConfig),
)
fs.writeFileSync(
	path.join(rootDir, 'src/assets/apTokens.generated.scss'),
	buildVariant(apVariantConfig),
)
