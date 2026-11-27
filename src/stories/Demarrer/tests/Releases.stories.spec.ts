import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import axios from 'axios'
import * as stories from '../Releases.stories'

const { List } = composeStories(stories)

enableAutoUnmount(afterEach)

const mountWithReleases = async (releases: object[]) => {
	vi.spyOn(axios, 'get').mockResolvedValue({ data: releases })
	const wrapper = mount(List())
	await flushPromises()
	return wrapper
}

describe('Releases stories', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('affiche le lien vers la documentation archivée d\'une version', async () => {
		const wrapper = await mountWithReleases([
			{ id: 1, name: 'release 1.2.2', tag_name: 'v1.2.2', published_at: '2026-11-17T10:31:41Z', body: '' },
		])

		const link = wrapper.find('.releases__doc-link a')
		expect(link.attributes('href')).toBe('https://deploy-preview-2801--synapse-dev.netlify.app')
		expect(link.attributes('target')).toBe('_blank')
		expect(link.attributes('rel')).toBe('noopener noreferrer')
		expect(link.text()).toBe('Documentation de la v1.2.2 (nouvel onglet)')
	})

	it('n\'affiche pas de lien pour une version sans documentation archivée', async () => {
		const wrapper = await mountWithReleases([
			{ id: 2, name: 'release 1.0.0', tag_name: 'v1.0.0', published_at: '2025-01-01T00:00:00Z', body: '' },
		])

		expect(wrapper.find('h2').text()).toContain('release 1.0.0')
		expect(wrapper.find('.releases__doc-link').exists()).toBe(false)
	})
})
