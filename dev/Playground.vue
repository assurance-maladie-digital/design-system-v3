<script lang="ts" setup>
	import ExternalLinks from '@/components/ExternalLinks/ExternalLinks.vue'

	const items = [
		{
			text: 'ameli.fr',
			href: 'https://www.ameli.fr',
		},
		{
			text: 'Github',
			href: 'https://www.github.com',
		},
		{
			text: 'Twitter',
			href: 'https://www.twitter.com',
		},
	]
</script>

<template>
	<ExternalLinks
		position="top left"
		:items="items"
	/>
</template>
