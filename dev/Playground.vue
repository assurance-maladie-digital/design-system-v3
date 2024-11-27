<script lang="ts" setup>
	import FooterBar from '@/components/FooterBar/FooterBar.vue'
	import CollapsibleList from '@/components/CollapsibleList/CollapsibleList.vue'
	import Logo from '@/components/Logo/Logo.vue'
	import { computed } from 'vue'
	import { useDisplay } from 'vuetify'
	import { cnamColorsTokens } from '@/designTokens'
	import { mdiTwitter, mdiLinkedin, mdiFacebook, mdiYoutube } from '@mdi/js'

	const docProps = {
		sitemapRoute: '/',
		cguRoute: '/',
		cookiesRoute: '/',
		legalNoticeRoute: '/',
		a11yStatementRoute: '/',
	}

	const remboursementItems = [
		{
			text: 'Ce qui est remboursé',
			href: 'https://www.ameli.fr/assure/remboursements/rembourse',
		},
		{
			text: 'Ce qui reste à votre charge',
			href: 'https://www.ameli.fr/assure/remboursements/reste-charge',
		},
		{
			text: 'Être bien remboursé',
			href: 'https://www.ameli.fr/assure/remboursements/etre-bien-rembourse',
		},
	]
	const healthItems = [
		{
			text: 'Mon espace santé',
			href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
		},
		{
			text: 'Accomplir les bons gestes',
			href: 'https://www.ameli.fr/assure/sante/bons-gestes',
		},
		{
			text: 'Réagir en cas d’urgence',
			href: 'https://www.ameli.fr/assure/sante/urgence',
		},
		{
			text: 'Télésanté',
			href: 'https://www.ameli.fr/assure/sante/telesante',
		},
	]
	const { smAndDown } = useDisplay()
	const isMobile = computed(() => smAndDown.value)

	const vuetifyOptions = {
		footer: {
			elevation: 6,
			color: cnamColorsTokens.grey.darken40,
			height: 70,
		},
		goTopBtn: {
			class: 'd-none',
		},
	}
</script>

<template>
	<main>
		<div class="div-height">
			<h2 class="text-center">
				Scroll to see footer and test scroll to top
			</h2>
		</div>
		<FooterBar
			:vuetify-options="vuetifyOptions"
			a11y-compliance="partially-compliant"
			hide-sitemap-link
			v-bind="docProps"
		/>

		<br><br>

		<FooterBar v-bind="docProps">
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
		</FooterBar>

		<br><br>

		<FooterBar
			hide-sitemap-link
			v-bind="docProps"
		>
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
		</FooterBar>

		<br><br>

		<FooterBar
			v-bind="docProps"
		>
			<VRow
				:no-gutters="isMobile"
				class="max-width-none"
			>
				<VCol
					cols="12"
					sm="6"
				>
					<CollapsibleList
						:items="remboursementItems"
						class="theme--dark"
						list-title="Remboursement"
					/>
				</VCol>

				<VCol
					cols="12"
					sm="6"
				>
					<CollapsibleList
						:items="healthItems"
						class="theme--dark"
						list-title="Santé"
					/>
				</VCol>
			</VRow>
		</FooterBar>

		<br><br>

		<FooterBar
			light
			v-bind="docProps"
		>
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
		</FooterBar>

		<br><br>

		<FooterBar
			:social-media-links="[
				{ icon: mdiFacebook, name: 'Facebook', href: 'https://www.facebook.com' },
				{ icon: mdiTwitter, name: 'Twitter', href: 'https://www.twitter.com' },
				{ icon: mdiLinkedin, name: 'Linkedin', href: 'https://www.linkedin.com' },
				{ icon: mdiYoutube, name: 'Youtube', href: 'https://www.youtube.com' },
			]"
			v-bind="docProps"
		>
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
		</FooterBar>

		<br><br>

		<FooterBar v-bind="docProps">
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
			<template #logo>
				<Logo
					:risque-pro="true"
					aria-label="Risque Pro"
				/>
			</template>
		</FooterBar>
	</main>
</template>

<style scoped>
.div-height {
  min-height: 1000px;
}
</style>
