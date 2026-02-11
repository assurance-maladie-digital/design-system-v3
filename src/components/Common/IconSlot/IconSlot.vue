<script setup lang="ts">
	import { computed, useSlots, Comment, Text } from 'vue'
	import { VTooltip } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = defineProps<{
		icon?: string
		tooltip?: string
		label?: string
		iconColor: string
		icons: Record<string, string> & { info: string }
		noIcon?: boolean
		disableClickButton: boolean
		tooltipLocation: 'top' | 'bottom' | 'start' | 'end'
	}>()

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
					:label="label ? `${label} - info` : 'Info'"
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
			:label="label ? `${label} - bouton ${icon}` : `Bouton ${icon}`"
			@click.stop="handleClick"
			@keydown.enter.prevent.stop="handleClick"
			@keydown.space.prevent.stop="handleClick"
		/>
	</template>
</template>
