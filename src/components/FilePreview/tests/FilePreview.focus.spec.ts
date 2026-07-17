import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FilePreview from '../FilePreview.vue'

// On mocke le rendu pdfjs : le test ne vérifie que la structure focusable du visualiseur
// embarqué (qui porte déjà le ring DS `:focus-visible` primary), pas le rendu du PDF.
vi.mock('../usePdfConsultation', async () => {
	const { ref } = await import('vue')
	return {
		usePdfConsultation: () => ({
			isLoading: ref(false),
			hasError: ref(false),
			isComplete: ref(false),
			render: vi.fn().mockResolvedValue(null),
			checkScrollComplete: vi.fn(),
		}),
	}
})

describe('FilePreview - Focus', () => {
	it('exposes the embedded pdf viewer as a keyboard-focusable document (already DS-ringed)', async () => {
		const pdfFile = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], 'doc.pdf', {
			type: 'application/pdf',
		})

		const wrapper = mount(FilePreview, {
			// readonly => isEmbedded (visualiseur pdfjs) => l'élément focusable est rendu.
			props: { file: pdfFile, readonly: true },
		})
		await nextTick()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer')
		expect(viewer.exists()).toBe(true)
		expect(viewer.attributes('role')).toBe('document')
		// tabindex 0 => atteignable au clavier, éligible au ring `:focus-visible` scopé.
		expect(viewer.attributes('tabindex')).toBe('0')
	})
})
