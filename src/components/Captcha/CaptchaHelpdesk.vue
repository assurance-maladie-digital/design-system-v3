<script lang="ts" setup>
	import { computed } from 'vue'

	const props = defineProps<{
		phoneNumber?: string | false
		localizedMessage?: ((phone: string) => string) | undefined
	}>()

	const helpDeskMessage = computed(() => {
		if (!props.phoneNumber || !props.localizedMessage) {
			return ''
		}
		return props.localizedMessage(props.phoneNumber)?.split(props.phoneNumber)
	})
</script>

<template>
	<p
		v-if="helpDeskMessage && helpDeskMessage.length === 2"
		class="captcha-helpdesk text-textSubdued mb-2"
	>
		{{ helpDeskMessage[0] }}
		<a
			:href="`tel:${Number(props.phoneNumber)}`"
		>
			{{ props.phoneNumber }}
		</a>
		{{ helpDeskMessage[1] }}
	</p>
</template>

<style scoped>
.captcha-helpdesk {
	max-width: 300px;
	font-size: 0.875rem;
}

.captcha-helpdesk a {
	color: rgb(var(--v-theme-primary));
	font-weight: 700;
}
</style>
