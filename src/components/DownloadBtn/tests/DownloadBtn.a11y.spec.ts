// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DownloadBtn from '../DownloadBtn.vue'

describe('DownloadBtn – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(DownloadBtn, {
			props: {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any -- deso
				filePromise: () => Promise.resolve({ data: new Blob(), status: 200, statusText: 'OK', headers: {}, config: {} as any }),
				fallbackFilename: 'file.pdf',
			},
			slots: {
				default: 'Télécharger',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DownloadBtn – default state')
	})
})
