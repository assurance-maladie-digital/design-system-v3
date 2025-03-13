import { h, defineComponent, watch, computed } from 'vue'
import { useTheme } from 'vuetify'
import CustomErrorPage from './CustomErrorPage.vue'

// Décorateur qui vérifie si le thème est CNAM
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
export const withThemeCheck = (storyFn: any) => {
	// Créer un wrapper component
	const Wrapper = defineComponent({
		name: 'ThemeCheckWrapper',
		components: { CustomErrorPage },
		setup() {
			const theme = useTheme()
			const isCnamTheme = computed(() => theme.global.name.value === 'cnam')
			const currentThemeName = computed(() => theme.global.name.value)

			// Observer les changements de thème et recharger la page
			watch(() => theme.global.name.value, (newTheme, oldTheme) => {
				if (newTheme !== oldTheme) {
					// Recharger la page lorsque le thème change
					// window.location.reload()
				}
			})

			return {
				isCnamTheme,
				currentThemeName,
			}
		},
		render() {
			if (this.isCnamTheme) {
				// Si le thème est CNAM, afficher le contenu normal
				return h('div', {}, [h(storyFn())])
			}
			else {
				// Si le thème n'est pas CNAM, afficher une page d'erreur personnalisée
				// avec les couleurs du thème actuel
				return h(CustomErrorPage, {
					code: '403',
					pageTitle: 'Accès non autorisé',
					message: `Cette documentation n'est accessible qu'avec le thème CNAM. Thème actuel : ${this.currentThemeName}`,
					btnText: 'Retour à l\'accueil',
					btnLink: '/',
				})
			}
		},
	})

	return () => h(Wrapper)
}
