<script setup lang="ts">
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import AmeliproBtn from '@/components/Amelipro/AmeliproBtn/AmeliproBtn.vue'

	const chevronLeft = mdiChevronLeft
	const chevronRight = mdiChevronRight
</script>

<template>
	<section>
		<h2>AmeliproBtn</h2>
		<div class="component-wrapper">
			<AmeliproBtn unique-id="my-btn-unique-id">
				Exemple de bouton
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn rounded>
				Bouton primaire
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				bordered
				color="ap-white"
				hover-color="ap-blue-lighten-3"
				rounded
				text-color="ap-blue-darken-1"
			>
				Bouton secondaire
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				bordered
				class="mr-3"
				color="ap-white"
				hover-color="ap-blue-lighten-3"
				icon-left
				rounded
				text-color="ap-blue-darken-1"
			>
				Précédent

				<template #icon>
					{{ chevronLeft }}
				</template>
			</AmeliproBtn>
			<AmeliproBtn
				bordered
				class="mr-3"
				color="ap-white"
				hover-color="ap-blue-lighten-3"
				rounded
				text-color="ap-blue-darken-1"
			>
				Suivant
				<template #icon>
					{{ chevronRight }}
				</template>
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				class="mr-3 text-none"
				hover-underline
				text
			>
				Imprimer sans transmettre
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				class="text-none"
				hover-underline
				icon-name="utilisateur"
				text
			>
				En savoir plus
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				class="mb-6"
				disabled
				icon-name="utilisateur"
				rounded
			>
				Bouton primaire
			</AmeliproBtn>
			<AmeliproBtn
				bordered
				class="mb-6"
				color="ap-white"
				disabled
				hover-color="ap-blue-lighten-3"
				icon-name="utilisateur"
				rounded
				text-color="ap-blue-darken-1"
			>
				Bouton secondaire
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				class="text-none"
				disabled
				hover-underline
				icon-name="utilisateur"
				text
			>
				Imprimer sans transmettre
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				bordered
				class="mr-3 pt-3 text-none font-weight-regular"
				color="ap-white"
				hover-color="ap-blue-darken-1"
				icon-color="ap-blue-darken-1"
				icon-hover-color="ap-white"
				icon-name="utilisateur"
				info-block
				size="80px"
				text-color="ap-black"
				text-hover-color="ap-white"
			>
				Info block
			</AmeliproBtn>
		</div>
		<div class="component-wrapper">
			<AmeliproBtn
				class="mb-6"
				href="http://localhost:3000/composants/amelipro-btn#les-liens"
				rounded
			>
				Bouton primaire lien
			</AmeliproBtn>
			<AmeliproBtn
				bordered
				class="mb-6"
				color="ap-white"
				hover-color="ap-blue-lighten-3"
				href="http://localhost:3000/composants/amelipro-btn#les-liens"
				rounded
				text-color="ap-blue-darken-1"
			>
				Bouton secondaire lien
			</AmeliproBtn>
			<AmeliproBtn
				class="text-none"
				hover-underline
				href="http://localhost:3000/composants/amelipro-btn#les-liens"
				text
			>
				Lien classique
			</AmeliproBtn>
		</div>
	</section>
</template>

<style scoped></style>
