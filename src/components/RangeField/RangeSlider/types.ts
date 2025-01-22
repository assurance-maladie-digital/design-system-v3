import { type MaybeRef } from 'vue'

export interface Range {
	selectedMin: MaybeRef<number>
	selectedMax: MaybeRef<number>
	rangeMin: MaybeRef<number>
	rangeMax: MaybeRef<number>
	step: MaybeRef<number>
}
