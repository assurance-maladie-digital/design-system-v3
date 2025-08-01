import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
	...viteConfig,
	test: {
		...viteConfig.test,
		// Mode séquentiel pour éviter les interférences
		pool: 'forks',
		poolOptions: {
			forks: {
				singleFork: true, // Exécuter les tests séquentiellement
			},
		},
		// Isoler chaque test
		isolate: true,
		// Options pour le débogage
		logHeapUsage: true,
	},
})
