import React from 'react'
import { createPortal } from 'react-dom'
import { addons, types, useStorybookApi, useStorybookState } from 'storybook/manager-api'
import { locales } from './locales'

const ADDON_ID = 'rating-feedback'
const TOOL_ID = `${ADDON_ID}/tool`
const FEEDBACK_STORY_ID = 'internes-ratingfeedback--default'

const RatingFeedbackModal = ({ component, onClose }: {
	component: string
	onClose: () => void
}) => {
	const [isSent, setIsSent] = React.useState(false)
	const [isFormLoaded, setIsFormLoaded] = React.useState(false)

	React.useEffect(() => {
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		window.addEventListener('keydown', onKeydown)
		return () => window.removeEventListener('keydown', onKeydown)
	}, [onClose])

	React.useEffect(() => {
		const onMessage = (event: MessageEvent<{ type?: string }>) => {
			if (event.origin !== window.location.origin || event.data?.type !== 'rating-feedback-sent') return

			setIsSent(true)
			const timeout = window.setTimeout(onClose, 1800)
			return () => window.clearTimeout(timeout)
		}

		window.addEventListener('message', onMessage)
		return () => window.removeEventListener('message', onMessage)
	}, [onClose])

	return createPortal(
		React.createElement('div', {
			style: {
				alignItems: 'center', background: 'rgb(0 0 0 / 45%)', display: 'flex',
				inset: 0, justifyContent: 'center', padding: 24, position: 'fixed', zIndex: 10000,
			},
		}, React.createElement('section', {
			'aria-labelledby': 'rating-feedback-title',
			'aria-modal': true,
			'role': 'dialog',
			'style': {
				background: '#fff', borderRadius: 8, boxShadow: '0 8px 32px rgb(0 0 0 / 25%)',
				color: '#242424', maxWidth: '100%', overflow: 'visible', padding: 24, width: 560,
			},
		},
		React.createElement('div', {
			style: { alignItems: 'flex-start', display: 'flex', gap: 16, justifyContent: 'space-between' },
		},
		React.createElement('h2', { id: 'rating-feedback-title', style: { fontSize: 20, margin: 0 } }, locales.title(component)),
		React.createElement('button', {
			'aria-label': locales.close,
			'onClick': onClose,
			'style': { background: 'transparent', border: 0, cursor: 'pointer', fontSize: 32, lineHeight: 1 },
			'type': 'button',
		}, '×')),
		isSent
			? React.createElement('p', {
					role: 'status',
					style: { fontSize: 18, margin: '32px 0', textAlign: 'center' },
				}, locales.thanks)
			: React.createElement('div', {
					style: { minHeight: 500, position: 'relative' },
				},
				!isFormLoaded
					? React.createElement('p', {
							role: 'status',
							style: { margin: 40, textAlign: 'center' },
						}, locales.loading)
					: null,
				React.createElement('iframe', {
					'aria-busy': !isFormLoaded,
					'onLoad': () => setIsFormLoaded(true),
					'scrolling': 'no',
					'src': `iframe.html?id=${FEEDBACK_STORY_ID}&viewMode=story&args=component:${encodeURIComponent(component)}`,
					'style': {
						border: 0, height: 600, marginTop: 16,
						opacity: isFormLoaded ? 1 : 0, overflow: 'hidden', width: '100%',
					},
					'title': locales.formTitle,
				}))),
		),
		document.body,
	)
}

const RatingFeedbackTool = () => {
	const api = useStorybookApi()
	const { storyId } = useStorybookState()
	const [isOpen, setIsOpen] = React.useState(false)
	const story = storyId ? api.getData(storyId) : undefined

	if (!storyId || storyId === FEEDBACK_STORY_ID) return null

	const component = story?.title.split('/').at(-1) ?? story?.name ?? storyId

	return React.createElement(React.Fragment, null,
		React.createElement('button', {
			'aria-label': locales.open,
			'onClick': () => setIsOpen(true),
			'style': {
				alignItems: 'center', background: 'transparent', border: 0, color: 'inherit',
				cursor: 'pointer', display: 'flex', font: 'inherit', fontWeight: 600,
				gap: 6, height: '100%', padding: '0 10px',
			},
			'title': locales.open,
		}, locales.open),
		isOpen ? React.createElement(RatingFeedbackModal, { component, onClose: () => setIsOpen(false) }) : null,
	)
}

export const registerRatingFeedbackAddon = () => {
	addons.register(ADDON_ID, () => {
		addons.add(TOOL_ID, {
			type: types.TOOL,
			title: locales.open,
			render: () => React.createElement(RatingFeedbackTool),
		})
	})
}
