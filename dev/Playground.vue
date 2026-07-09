<script setup lang="ts">
	import { ref } from 'vue'
	import BackBtn from '@/components/BackBtn/BackBtn.vue'
	import SyBtnMenu from '@/components/SyBtnMenu/SyBtnMenu.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'

	// SelectBtnField
	const column = ref<string | null>(null)
	const inline = ref<string[]>([])

	const contactItems = [
		{ text: 'Email', value: 'email' },
		{ text: 'SMS', value: 'sms' },
		{ text: 'Courrier', value: 'courrier' },
	]

	// SyBtnMenu
	const menuValue = ref<Record<string, unknown> | string | null>(null)
	const menuItems = [
		{ text: 'Mon profil', value: 'profile' },
		{ text: 'Paramètres', value: 'settings' },
	]
</script>

<template>
	<v-app>
		<v-main>
			<v-container class="py-8">
				<h1 class="text-h4 mb-2">
					Playground — Focus des boutons
				</h1>
				<p class="text-body-2 mb-8">
					Naviguez au <strong>clavier (Tab / Shift+Tab</strong>, puis flèches dans le
					SelectBtnField) pour vérifier le ring de focus : anneau 2px, offset 3px,
					couleur <em>primary</em>. Seul BackBtn gère un état dark (ring <em>onPrimary</em>).
				</p>

				<!-- ============ v-btn (Vuetify natif) ============ -->
				<v-card
					class="pa-6 mb-8"
					variant="outlined"
				>
					<h2 class="text-h6 mb-4">
						v-btn (Vuetify)
					</h2>
					<v-row>
						<v-col
							cols="12"
							md="6"
						>
							<div class="text-caption mb-2">
								Fond clair
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<v-btn color="primary">
									Valider
								</v-btn>
							</v-sheet>
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<div class="text-caption mb-2">
								Fond primary (prop <code>theme="dark"</code>)
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<v-btn
									theme="dark"
									variant="outlined"
								>
									Valider
								</v-btn>
							</v-sheet>
						</v-col>
					</v-row>
				</v-card>

				<!-- ============ BackBtn (gère la prop dark) ============ -->
				<v-card
					class="pa-6 mb-8"
					variant="outlined"
				>
					<h2 class="text-h6 mb-4">
						BackBtn
					</h2>
					<v-row>
						<v-col
							cols="12"
							md="6"
						>
							<div class="text-caption mb-2">
								Fond clair
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<BackBtn />
							</v-sheet>
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<div class="text-caption mb-2">
								Fond primary (prop <code>dark</code>)
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<BackBtn dark />
							</v-sheet>
						</v-col>
					</v-row>
				</v-card>

				<!-- ============ SyBtnMenu (pas de prop dark) ============ -->
				<v-card
					class="pa-6 mb-8"
					variant="outlined"
				>
					<h2 class="text-h6 mb-4">
						SyBtnMenu
					</h2>
					<v-sheet
						color="surface"
						rounded
						class="pa-4"
					>
						<SyBtnMenu
							v-model="menuValue"
							primary-info="Jean Dupont"
							secondary-info="Administrateur"
							:menu-items="menuItems"
						/>
					</v-sheet>
				</v-card>

				<!-- ============ SelectBtnField (pas de prop dark) ============ -->
				<v-card
					class="pa-6 mb-8"
					variant="outlined"
				>
					<h2 class="text-h6 mb-1">
						SelectBtnField
					</h2>
					<p class="text-caption mb-4">
						1er focus = ring englobant le groupe, puis flèches item par item.
					</p>

					<h3 class="text-subtitle-2 mb-2">
						Version en colonne
					</h3>
					<v-sheet
						color="surface"
						rounded
						class="pa-4 mb-6"
					>
						<SelectBtnField
							v-model="column"
							label="Moyen de contact préféré"
							:items="contactItems"
						/>
					</v-sheet>

					<h3 class="text-subtitle-2 mb-2">
						Version en ligne (inline)
					</h3>
					<v-sheet
						color="surface"
						rounded
						class="pa-4"
					>
						<SelectBtnField
							v-model="inline"
							label="Moyens de contact"
							inline
							multiple
							:items="contactItems"
						/>
					</v-sheet>
				</v-card>
			</v-container>
		</v-main>
	</v-app>
</template>
