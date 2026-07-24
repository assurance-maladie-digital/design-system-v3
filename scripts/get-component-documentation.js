import path from 'node:path'
import { createChecker } from 'vue-component-meta'
import { existsSync } from 'node:fs'

const root = process.cwd()

const checker = createChecker(
	path.resolve(root, 'tsconfig.app.json'),
	{
		forceUseTs: true,
		noDeclarations: true,
	},
)

function isInternalVueProp(propName) {
	return [
		'key',
		'ref',
		'class',
		'style',
		'ref_for',
		'ref_key',
	].includes(propName)
	|| propName.startsWith('onVue:')
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasArgTypeDescription(storyContent, itemName) {
	if (!storyContent) {
		return false
	}

	const escapedName = escapeRegExp(itemName)

	const itemRegex = new RegExp(
		`(?:['"\`]${escapedName}['"\`]|${escapedName})\\s*:\\s*{[\\s\\S]*?description\\s*:`,
		'm',
	)

	return itemRegex.test(storyContent)
}

function isDocumented(item, storyContent) {
	return Boolean(item.description?.trim())
		|| hasArgTypeDescription(storyContent, item.name)
}

export function getComponentDocumentationDetails(componentPath, storyContent = '') {
	const emptyResult = {
		total: 0,
		documented: 0,
		label: 'Non renseigné',
		isComplete: false,
		props: [],
		slots: [],
	}

	if (!componentPath || !existsSync(componentPath)) {
		return emptyResult
	}

	try {
		const metadata = checker.getComponentMeta(componentPath)

		const props = (metadata.props ?? []).filter(prop =>
			!isInternalVueProp(prop.name),
		)

		const slots = metadata.slots ?? []

		const documentedProps = props.filter(prop =>
			isDocumented(prop, storyContent),
		)

		const documentedSlots = slots.filter(slot =>
			isDocumented(slot, storyContent),
		)

		const total = props.length + slots.length
		const documented
			= documentedProps.length
				+ documentedSlots.length

		return {
			total,
			documented,
			label: `${documented}/${total} documentés`,
			isComplete: total > 0 && documented === total,
			props,
			slots,
		}
	}
	catch (error) {
		console.warn(
			`⚠️ Impossible d’analyser : ${componentPath}`,
			error instanceof Error ? error.message : error,
		)

		return emptyResult
	}
}
