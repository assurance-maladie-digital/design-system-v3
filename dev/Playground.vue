<script setup lang="ts">
	import FooterBar from '@/components/FooterBar/FooterBar.vue'
	import CollapsibleList from '@/components/CollapsibleList/CollapsibleList.vue'
	import { getCurrentInstance, computed } from 'vue'

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

	const isXs = computed(() => {
		const { proxy } = getCurrentInstance()!
		return proxy?.$vuetify.display.name === 'xs'
	})

	const vuetifyOptions = {
		footer: {
      elevation:4,
			minHeight: '90px',
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
			v-bind="docProps"
			:vuetify-options="vuetifyOptions"
		/>

		<br><br>

		<FooterBar v-bind="docProps">
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
		</FooterBar>

		<br><br>

		<FooterBar
			v-bind="docProps"
			hide-sitemap-link
		>
			<p class="text--secondary mb-0">
				Contenu supplémentaire.
			</p>
		</FooterBar>

		<br><br>

		<FooterBar
			v-bind="docProps"
			class="theme--dark"
		>
			<VRow
				:no-gutters="isXs"
				class="max-width-none"
			>
				<VCol
					cols="12"
					sm="6"
				>
					<CollapsibleList
						:items="remboursementItems"
						list-title="Remboursement"
						class="theme--dark"
					/>
				</VCol>

				<VCol
					cols="12"
					sm="6"
				>
					<CollapsibleList
						:items="healthItems"
						list-title="Santé"
						class="theme--dark"
					/>
				</VCol>
			</VRow>
		</FooterBar>
	</main>
</template>

<style scoped>
.div-height {
  min-height: 1000px;
}
</style>
