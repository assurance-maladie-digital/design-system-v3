/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, onMounted, ref, type Ref } from 'vue'
import type Tooltip from '../tooltip/Tooltip.vue'
import type { Range } from '../types'
import useTooltipsNudge from '../useTooltipsNudge'

describe('useTooltipsNudge', () => {
	function getTestTooltip(left: number, right: number, width: number) {
		return defineComponent({
			setup() {
				const element = ref<HTMLElement | null>(null)
				onMounted(() => {
					vi.spyOn(
						element.value as HTMLElement,
						'getBoundingClientRect',
					).mockReturnValue({
						left,
						right,
						width,
					} as DOMRect)
				})
				return { element }
			},
			template: `<div ref="element"></div>`,
		})
	}

	function getTestComponent(minThumb, maxThumb) {
		return defineComponent({
			components: {
				minThumb,
				maxThumb,
			},
			setup() {
				const minThumb = ref()
				const maxThumb = ref()
				const placeholderMinThumb = ref()
				const placeholderMaxThumb = ref()

				const range = {
					min: 0,
					max: 100,
					step: 1,
				}

				const { nudgeMinThumb, nudgeMaxThumb } = useTooltipsNudge(
					minThumb as Ref<typeof Tooltip>,
					maxThumb as Ref<typeof Tooltip>,
					placeholderMinThumb as Ref<typeof Tooltip>,
					placeholderMaxThumb as Ref<typeof Tooltip>,
					range as unknown as Range,
				)

				return {
					minThumb,
					maxThumb,
					placeholderMinThumb,
					placeholderMaxThumb,
					nudgeMinThumb,
					nudgeMaxThumb,
				}
			},
			template: `
				<div>
					<minThumb ref="minThumb"></minThumb>
					<maxThumb ref="maxThumb"></maxThumb>
					<minThumb ref="placeholderMinThumb"></minThumb>
					<maxThumb ref="placeholderMaxThumb"></maxThumb>
				</div>
			`,
		})
	}

	it('does not nudge the tooltips when they do not overlap', async () => {
		const TestMin = getTestTooltip(0, 100, 100)
		const TestMax = getTestTooltip(200, 300, 100)
		const TestComponent = getTestComponent(TestMin, TestMax)

		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		await nextTick()

		expect(wrapper.vm.nudgeMinThumb).toBe(0)
		expect(wrapper.vm.nudgeMaxThumb).toBe(0)

		wrapper.unmount()
	})

	it('nudges the tooltips when they overlap', async () => {
		const right = 100
		const left = 90
		const TestMin = getTestTooltip(0, right, 100)
		const TestMax = getTestTooltip(left, 190, 100)
		const TestComponent = getTestComponent(TestMin, TestMax)

		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		await nextTick()

		expect(wrapper.vm.nudgeMinThumb + wrapper.vm.nudgeMaxThumb).toBeGreaterThan(right - left)

		wrapper.unmount()
	})

	it('nudge the bigger tooltip in priority to avoid the smaller to fly away (max)', async () => {
		const right = 150
		const left = 140
		const TestMin = getTestTooltip(140, right, 10)
		const TestMax = getTestTooltip(left, 10140, 10000)
		const TestComponent = getTestComponent(TestMin, TestMax)

		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		await nextTick()

		expect(wrapper.vm.nudgeMinThumb).toBe(1)
		expect(wrapper.vm.nudgeMaxThumb).toBeGreaterThan(right - left)
		expect(wrapper.vm.nudgeMaxThumb).toBeLessThan(right - left + 5)

		wrapper.unmount()
	})

	it('nudge the bigger tooltip in priority to avoid the smaller to fly away (min)', async () => {
		const right = 1250
		const left = 800
		const TestMin = getTestTooltip(230, right, 1020)
		const TestMax = getTestTooltip(left, 900, 100)
		const TestComponent = getTestComponent(TestMin, TestMax)

		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		await nextTick()

		expect(wrapper.vm.nudgeMinThumb).toBeGreaterThan(right - left)
		expect(wrapper.vm.nudgeMinThumb).toBeLessThan(right - left + 5)
		expect(wrapper.vm.nudgeMaxThumb).toBe(1)

		wrapper.unmount()
	})
})
