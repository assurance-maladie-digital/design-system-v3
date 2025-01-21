import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import useDoubleSlider from '../useDoubleSlider'

describe('useDoubleSlider', () => {
	it('return a correct object', () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		expect(range.rangeMin.value).toBe(0)
		expect(range.rangeMax.value).toBe(100)
		expect(range.step.value).toBe(1)
		expect(range.selectedMin.value).toBe(25)
		expect(range.selectedMax.value).toBe(75)
	})

	it('update the values', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		expect(range.rangeMin.value).toBe(0)
		expect(range.rangeMax.value).toBe(100)
		expect(range.step.value).toBe(1)
		expect(range.selectedMin.value).toBe(25)
		expect(range.selectedMax.value).toBe(75)

		min.value = -100
		max.value = 200
		step.value = 2
		value.value = [-50, 150]

		await nextTick()

		expect(range.rangeMin.value).toBe(-100)
		expect(range.rangeMax.value).toBe(200)
		expect(range.step.value).toBe(2)
		expect(range.selectedMin.value).toBe(-50)
		expect(range.selectedMax.value).toBe(150)
	})

	it('do not accept out of bounds values', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		value.value = [-50, 100]

		await nextTick()

		expect(range.selectedMax.value).toBe(100)
		expect(range.selectedMin.value).not.toBe(-50)
		expect(range.selectedMin.value).toBe(0)
	})

	it('do not accept a min bound superior than a max bound', () => {
		const min = ref(100)
		const max = ref(-100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		expect(range.rangeMin.value).toBe(-100)
		expect(range.rangeMax.value).toBe(100)
	})

	it('do not accept an invalide value', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		value.value = [NaN, NaN]
		await nextTick()
		expect(range.selectedMin.value).toBe(25)
		expect(range.selectedMax.value).toBe(75)

		value.value = [-Infinity, +Infinity]
		await nextTick()
		expect(range.selectedMin.value).toBe(25)
		expect(range.selectedMax.value).toBe(75)

		value.value = [60, 40]
		await nextTick()
		expect(range.selectedMin.value).toBe(25)
		expect(range.selectedMax.value).toBe(75)
	})

	it('set automatically the selected value in bounds', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		value.value = [-50, 150]

		await nextTick()

		expect(range.selectedMin.value).toBe(0)
		expect(range.selectedMax.value).toBe(100)
	})

	it('do not accept an invalide min and max limit value', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([25, 75])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		min.value = NaN
		await nextTick()
		expect(range.rangeMin.value).toBe(0)

		min.value = -Infinity
		await nextTick()
		expect(range.rangeMin.value).toBe(0)

		min.value = 150
		await nextTick()
		expect(range.rangeMin.value).toBe(0)

		max.value = NaN
		await nextTick()
		expect(range.rangeMax.value).toBe(100)

		max.value = -Infinity
		await nextTick()
		expect(range.rangeMax.value).toBe(100)

		max.value = -1
		await nextTick()
		expect(range.rangeMax.value).toBe(100)
	})

	it('set automatically the selected value in bounds (min and max)', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([10, 90])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		min.value = 20
		max.value = 80

		await nextTick()

		expect(range.selectedMin.value).toBe(20)
		expect(range.selectedMax.value).toBe(80)
	})

	it('set automatically the selected value in bounds (min)', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([10, 20])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		min.value = 40

		await nextTick()

		expect(range.selectedMin.value).toBe(40)
		expect(range.selectedMax.value).toBe(40)
	})

	it('set automatically the selected value in bounds (max)', async () => {
		const min = ref(0)
		const max = ref(100)
		const step = ref(1)
		const value = ref([80, 90])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		max.value = 60

		await nextTick()

		expect(range.selectedMin.value).toBe(60)
		expect(range.selectedMax.value).toBe(60)
	})

	it('do not take into account an invalide step', async () => {
		const min = ref(100)
		const max = ref(200)
		const step = ref(1)
		const value = ref([80, 90])

		const range = useDoubleSlider(
			min, max, step, value,
		)

		step.value = NaN
		await nextTick()
		expect(range.step.value).toBe(1)

		step.value = +Infinity
		await nextTick()
		expect(range.step.value).toBe(1)

		step.value = 0
		await nextTick()
		expect(range.step.value).toBe(1)

		step.value = 150
		await nextTick()
		expect(range.step.value).toBe(1)
	})
})
