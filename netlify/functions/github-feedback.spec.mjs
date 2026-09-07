import process from 'node:process'
import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { createGitHubIssue } from './github-feedback.mjs'

const feedback = {
	comment: 'Le composant est facile à utiliser.',
	component: 'SyAlert',
	pageUrl: 'https://storybook.example.fr/?path=/docs/composants-syalert--docs',
	rating: 4,
}

afterEach(() => {
	delete process.env.GITHUB_FEEDBACK_LABEL
	delete process.env.GITHUB_FEEDBACK_TOKEN
	vi.unstubAllGlobals()
})

describe('github-feedback', () => {
	it('creates an issue in the design system repository', async () => {
		process.env.GITHUB_FEEDBACK_LABEL = 'feedback-storybook'
		const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }))

		await createGitHubIssue(feedback, 'secret-token', fetchMock)

		expect(fetchMock).toHaveBeenCalledOnce()
		const [url, options] = fetchMock.mock.calls[0]
		const issue = JSON.parse(options.body)
		expect(url).toBe('https://api.github.com/repos/assurance-maladie-digital/design-system-v3/issues')
		expect(issue).toMatchObject({
			labels: ['feedback-storybook'],
			title: '[Feedback Storybook] SyAlert — 4/5',
		})
		expect(issue.body).toContain('Le composant est facile à utiliser.')
		expect(options.headers.Authorization).toBe('Bearer secret-token')
	})

	it('returns the URL of the created issue', async () => {
		process.env.GITHUB_FEEDBACK_TOKEN = 'secret-token'
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
			html_url: 'https://github.com/assurance-maladie-digital/design-system-v3/issues/42',
			number: 42,
		}, { status: 201 })))
		const request = new Request('https://storybook.example.fr/api/feedback', {
			body: JSON.stringify(feedback),
			method: 'POST',
		})

		const result = await handler(request)

		expect(result.status).toBe(201)
		expect(await result.json()).toEqual({
			issueNumber: 42,
			issueUrl: 'https://github.com/assurance-maladie-digital/design-system-v3/issues/42',
		})
	})

	it('rejects an invalid rating without contacting GitHub', async () => {
		process.env.GITHUB_FEEDBACK_TOKEN = 'secret-token'
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)
		const request = new Request('https://storybook.example.fr/api/feedback', {
			body: JSON.stringify({ ...feedback, rating: -1 }),
			method: 'POST',
		})

		const result = await handler(request)

		expect(result.status).toBe(400)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('reports a missing server-side token', async () => {
		const request = new Request('https://storybook.example.fr/api/feedback', {
			body: JSON.stringify(feedback),
			method: 'POST',
		})

		const result = await handler(request)

		expect(result.status).toBe(503)
	})
})
