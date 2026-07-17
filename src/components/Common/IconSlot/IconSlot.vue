<script setup lang="ts">
	import { computed, useSlots, Comment, Text } from 'vue'
	import { VTooltip } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { locales as defaultLocales } from './locales'

	const props = withDefaults(defineProps<{
		icon?: string
		tooltip?: string
		label?: string
		iconColor: string
		icons: Record<string, string> & { info: string }
		noIcon?: boolean
		disableClickButton: boolean
		tooltipLocation: 'top' | 'bottom' | 'start' | 'end'
		locales?: typeof defaultLocales
	}>(), {
		icon: undefined,
		tooltip: undefined,
		label: undefined,
		locales: () => defaultLocales,
	})

	const emit = defineEmits<{
		(e: 'click'): void
	}>()

	const handleClick = () => {
		emit('click')
	}

	const slots = useSlots()

	const hasDefaultSlotContent = computed(() => {
		const vnodes = slots.default?.({}) ?? []
		return vnodes.some((vnode) => {
			if (vnode.type === Comment) return false
			if (vnode.type === Text) {
				const text = typeof vnode.children === 'string' ? vnode.children : ''
				return text.trim().length > 0
			}
			return true
		})
	})

	const resolvedIcon = computed(() => (props.icon ? props.icons[props.icon] : undefined))
</script>

<template>
	<slot v-if="hasDefaultSlotContent" />

	<template v-else>
		<VTooltip
			v-if="tooltip"
			:text="tooltip"
			:location="tooltipLocation"
		>
			<template #activator="{ props: tooltipProps }">
				<SyIcon
					v-bind="tooltipProps"
					:label="label ? locales.infoWithLabel(label) : locales.info"
					:color="iconColor"
					:icon="icons.info"
					role="button"
					:decorative="false"
					@click.stop
				/>
			</template>
		</VTooltip>

		<SyIcon
			v-else-if="resolvedIcon && !noIcon && disableClickButton"
			:icon="resolvedIcon"
			:color="iconColor"
			role="presentation"
			class="cursor-default"
			:decorative="true"
		/>

		<SyIcon
			v-else-if="resolvedIcon && !noIcon"
			:icon="resolvedIcon"
			:color="iconColor"
			role="button"
			class="cursor-pointer"
			:decorative="false"
			tabindex="0"
			:label="label && icon ? locales.buttonWithLabel(label, icon) : (icon ? locales.buttonLabel(icon) : '')"
			@click.stop="handleClick"
			@keydown.enter.prevent.stop="handleClick"
			@keydown.space.prevent.stop="handleClick"
		/>
	</template>
</template>
