// Ce fichier permet à TypeScript de comprendre et de vérifier les types des composants Vue
// il permet de vérifier les types des props, des événements, et des autres options des composants

declare module '*.vue' {
	import { DefineComponent } from 'vue'
	const component: DefineComponent<object, object, unknown>
	export default component
}
