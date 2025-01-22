<script lang="ts" setup>
	import { type PropType, defineProps, computed } from 'vue'
	import { Rating } from '../Rating'
	import { locales } from './locales'
	import { propValidator } from '@/utils/propValidator'
	import {
		mdiEmoticonHappyOutline,
		mdiEmoticonSadOutline,
		mdiEmoticonNeutralOutline,
	} from '@mdi/js'

	const emit = defineEmits(['update:modelValue'])
	const props = defineProps({
		length: {
			type: Number,
			default: 3,
			validator: (value: number) => propValidator('length', ['2', '3'], value.toString()),
		},
		itemLabels: {
			type: Array as PropType<string[]>,
			default: () => locales.defaultEmotionLabels,
		},
	})

	const sadIcon = mdiEmoticonSadOutline
	const neutralIcon = mdiEmoticonNeutralOutline
	const happyIcon = mdiEmoticonHappyOutline

	const btnSize = computed(() => {
		const name = (Rating as any).$vuetify.display.name
		return name === 'xs' ? '70px' : '88px'
	})

	const hasAnswered = computed(() => Rating.modelValue !== -1)

	const isActive = (index: number) => {
		return index === Rating.modelValue - 1
	}

	const getIcon = (index: number) => {
		if (index === 0) {
			return sadIcon
		}
		if (index === 1 && props.length === 3) {
			return neutralIcon
		}
		return happyIcon
	}

	const getColor = (index: number) => {
		const colors = ['sad', 'neutral', 'happy']
		if (props.length === 2) {
			const filteredColors = colors.filter(item => item !== 'neutral')
			return filteredColors[index]
		}
		return colors[index]
	}

	const getEmotionLabel = (value: number) => {
		if (props.length === 2) {
			const filteredLabels = props.itemLabels.filter((_, index) => index !== 1)
			return filteredLabels[value]
		}
		return props.itemLabels[value]
	}

	const emitInputEvent = (value: number) => {
		emit('update:modelValue', value)
	}
</script>

<template>
	<fieldset class="vd-emotion-picker">
		<legend class="text-h6 mb-6">
			<slot name="label">
				{{ Rating.label }}
			</slot>
		</legend>

		<VRating
			:model-value="Rating.modelValue"
			:length="props.length"
			:readonly="Rating.readonly"
			class="max-width-none mx-n1 mx-sm-n2"
		>
			<template #item="{ index }">
				<VBtn
					:disabled="Rating.readonly || hasAnswered"
					:aria-pressed="isActive(index).toString()"
					:class="[getColor(index), { 'v-btn--active': isActive(index) }]"
					:min-height="btnSize"
					:min-width="btnSize"
					variant="text"
					class="rounded-lg px-1 px-sm-4 mx-1 mx-sm-2"
					@click="emitInputEvent(index + 1)"
				>
					<VIcon
						size="40"
						color="currentColor"
						class="pa-0"
					>
						{{ getIcon(index) }}
					</VIcon>

					<span
						v-if="getEmotionLabel(index)"
						:class="{ 'text-secondary': !isActive(index) }"
						class="text-subtitle-2 mt-1"
					>
						{{ getEmotionLabel(index) }}
					</span>
				</VBtn>
			</template>
		</VRating>
	</fieldset>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.vd-emotion-picker {
  border: 0;
}
.v-rating .v-btn {
  transition: 0.2s;
  border: 1px solid transparent;
  opacity: 1;
  background: transparent;
  :deep(.v-btn__content) {
    flex-direction: column;
  }
  .text-secondary {
    color: tokens.$grey-lighten-20 !important;
  }
  &.sad {
    color: tokens.$orange-darken-20 !important;
  }
  &.neutral {
    color: tokens.$yellow-darken-20 !important;
  }
  &.happy {
    color: tokens.$turquoise-darken-20 !important;
  }
  &--active.v-btn--disabled .v-icon {
    color: currentColor !important;
  }
  &:focus,
  &--active {
    border-color: currentColor !important;
  }
  &:hover,
  &:focus,
  &--active {
    :deep(.v-btn__overlay, .v-btn__underlay) {
      display: none;
    }
    &.sad {
      background: tokens.$orange-lighten-90;
    }
    &.neutral {
      background: tokens.$yellow-lighten-90;
    }
    &.happy {
      background: tokens.$turquoise-lighten-90;
    }
  }
}
.v-theme--light.v-btn--disabled :deep(.v-icon) {
  color: tokens.$grey-lighten-20 !important;
}
</style>
