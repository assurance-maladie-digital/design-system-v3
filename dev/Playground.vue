<script setup lang="ts">
	import SocialMediaLinks from '@/components/SocialMediaLinks/SocialMediaLinks.vue'
	import { defaultSocialMediaLinks } from '@/components/SocialMediaLinks/DefaultSocialMediaLinks'
	import { ref } from 'vue'
	import { mdiLinkedin, mdiTwitter, mdiFacebook } from '@mdi/js'

	const links = [
		{
			icon: mdiLinkedin,
			href: 'https://www.linkedin.com/company/assurance-maladie/',
		},
		{
			icon: mdiFacebook,
			href: 'https://twitter.com/Assur_Maladie',
		},
		{
			icon: mdiTwitter,
			href: 'https://twitter.com/Assur_Maladie',
		},
	]
</script>

<template>
	<main>
		<div class="position">
			<SocialMediaLinks :links="links" />
		</div>
	</main>
</template>

<style>
.position {
  right: 0px;
  position: absolute;
}
</style>
