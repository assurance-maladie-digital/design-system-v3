import process from 'node:process'

const GITHUB_API_VERSION = '2022-11-28'
const GITHUB_OWNER = 'assurance-maladie-digital'
const GITHUB_REPOSITORY = 'design-system-v3'
const MAX_COMMENT_LENGTH = 5000
const MAX_COMPONENT_LENGTH = 120
const MAX_URL_LENGTH = 2000

const response = (status, body) => Response.json(body, { status })

const parseFeedback = async (request) => {
	let body

	try {
		body = await request.json()
	}
	catch {
		return null
	}

	if (
		typeof body !== 'object'
		|| body === null
		|| typeof body.component !== 'string'
		|| body.component.trim().length === 0
		|| body.component.length > MAX_COMPONENT_LENGTH
		|| typeof body.comment !== 'string'
		|| body.comment.length > MAX_COMMENT_LENGTH
		|| !Number.isInteger(body.rating)
		|| body.rating < 1
		|| body.rating > 5
		|| typeof body.pageUrl !== 'string'
		|| body.pageUrl.length > MAX_URL_LENGTH
	) {
		return null
	}

	return {
		comment: body.comment.trim(),
		component: body.component.trim(),
		pageUrl: body.pageUrl,
		rating: body.rating,
	}
}

const createIssueBody = feedback => [
	`## Avis Storybook`,
	'',
	`- **Composant :** ${feedback.component}`,
	`- **Note :** ${'⭐'.repeat(feedback.rating)} (${feedback.rating}/5)`,
	`- **Page :** ${feedback.pageUrl}`,
	'',
	'## Commentaire',
	'',
	feedback.comment || '_Aucun commentaire._',
].join('\n')

export const createGitHubIssue = (feedback, token, fetchImplementation = fetch) => {
	const label = process.env.GITHUB_FEEDBACK_LABEL?.trim()

	return fetchImplementation(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/issues`, {
		body: JSON.stringify({
			body: createIssueBody(feedback),
			...(label ? { labels: [label] } : {}),
			title: `[Feedback Storybook] ${feedback.component} — ${feedback.rating}/5`,
		}),
		headers: {
			'Accept': 'application/vnd.github+json',
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
			'X-GitHub-Api-Version': GITHUB_API_VERSION,
		},
		method: 'POST',
	})
}

export default async (request) => {
	if (request.method !== 'POST') return response(405, { error: 'Method not allowed' })

	const token = process.env.GITHUB_FEEDBACK_TOKEN
	if (!token) return response(503, { error: 'GitHub feedback is not configured' })

	const feedback = await parseFeedback(request)
	if (!feedback) return response(400, { error: 'Invalid feedback' })

	try {
		const githubResponse = await createGitHubIssue(feedback, token)

		if (!githubResponse.ok) return response(502, { error: 'GitHub issue creation failed' })

		const issue = await githubResponse.json()
		return response(201, { issueNumber: issue.number, issueUrl: issue.html_url })
	}
	catch {
		return response(502, { error: 'GitHub request failed' })
	}
}

export const config = {
	path: '/api/feedback',
}
