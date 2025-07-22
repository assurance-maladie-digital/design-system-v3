/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'

/**
 * @function removeAbsolutePaths
 * @description Supprime les chemins d'accès absolus des variables injectés dans une chaîne HTML.
 * @param {string} htmlString - La chaîne HTML contenant les commentaires à modifier.
 * @returns {string} La chaîne HTML avec les chemins d'accès absolus supprimés.
 */
export const removeAbsolutePaths = (htmlString: string | void): string => {
	const regex = /--C:(.*?)\.vue-(.*?): (.*?);/g
	return String(htmlString).replace(regex, '--$2: $3;')
}

export const typeValueToString = (value: any): string => (Array.isArray(value) ? 'array' : typeof value)

export const typeToString = (type: any): string => {
	if (typeof type === 'function') {
		return typeValueToString(type())
	}
	else if (typeof type === 'object') {
		if (type === null) {
			return 'null'
		}
		const types = Object.values(type)
			.map(t => typeToString(t))
		return types.join('|')
	}
	return String(type)
}

export const propTypes = (type: any) => ({
	typeLabel: `<${typeToString(type)}>`,
	type,
})

export const getApp = (): HTMLElement => {
	let app = document.getElementById('app')

	if (app === null) {
		app = document.createElement('div')
		app.setAttribute('id', 'app')
		app.setAttribute('data-app', 'true')
		document.body.appendChild(app)
	}

	return app
}

export const attachToApp = (): HTMLElement | undefined => {
	const app = getApp()
	const attachTo = document.createElement('div')
	attachTo.setAttribute('id', 'root-element')
	app.appendChild(attachTo)

	return attachTo
}

// Fake component pour gérer smAndUp sans provoquer l'erreur "Error: [Vuetify] composables must be called from inside a setup function"
export const DisplayTestComponent = defineComponent({
	setup() {
		const {
			mdAndUp,
			smAndDown,
			smAndUp,
			width,
			xs,
		} = useDisplay()
		const defaultValues = {
			mdAndUp: mdAndUp.value,
			smAndDown: smAndDown.value,
			smAndUp: smAndUp.value,
			width: width.value,
			xs: xs.value,
		}
		const resetDefaults = (): void => {
			setMdAndUp(defaultValues.mdAndUp)
			setSmAndDown(defaultValues.smAndDown)
			setSmAndUp(defaultValues.smAndUp)
			setWidth(defaultValues.width)
			setXs(defaultValues.xs)
		}
		const setMdAndUp = (value: boolean): void => {
			mdAndUp.value = value
		}
		const setSmAndDown = (value: boolean): void => {
			smAndDown.value = value
		}
		const setSmAndUp = (value: boolean): void => {
			smAndUp.value = value
		}
		const setXs = (value: boolean): void => {
			xs.value = value
		}
		const setWidth = (value: number): void => {
			width.value = value
		}

		return {
			mdAndUp,
			resetDefaults,
			setMdAndUp,
			setSmAndDown,
			setSmAndUp,
			setWidth,
			setXs,
			smAndDown,
			smAndUp,
			width,
			xs,
		}
	},
	template: '<div />',
})
