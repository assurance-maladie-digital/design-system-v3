<script setup lang="ts">
	// import { VThemeProvider } from 'vuetify/components'
	// import HeaderBar from '../src/components/HeaderBar/HeaderBar.vue'
	// import HeaderToolbar from '../src/components/HeaderToolbar/HeaderToolbar.vue'
	// import SubHeader from '../src/components/SubHeader/SubHeader.vue'
	// import HeaderBurgerMenu from '../src/components/HeaderBar/HeaderBurgerMenu/HeaderBurgerMenu.vue'
	// import HeaderMenuSection from '../src/components/HeaderBar/HeaderBurgerMenu/HeaderMenuSection/HeaderMenuSection.vue'
	// import HeaderMenuItem from '../src/components/HeaderBar/HeaderBurgerMenu/HeaderMenuItem/HeaderMenuItem.vue'
	// import HeaderSubMenu from '../src/components/HeaderBar/HeaderBurgerMenu/HeaderSubMenu/HeaderSubMenu.vue'
	// import PhoneField from '../src/components/PhoneField/PhoneField.vue'
	import SySelect from '../src/components/Customs/Selects/SySelect/SySelect.vue'
	// import { VBtn } from 'vuetify/components'
	import { ref } from 'vue'

	const selectedOptions = ref([])
	const options = [
		{ text: 'Adrien', value: 'Adrien' },
		{ text: 'Axel', value: 'Axel' },
		{ text: 'Baptiste', value: 'Baptiste' },
		{ text: 'Clement', value: 'Clement' },
		{ text: 'Corentin', value: 'Corentin' },
		{ text: 'Damien', value: 'Damien' },
		{ text: 'David', value: 'David' },
		{ text: 'Eloi', value: 'Eloi' },
		{ text: 'Louis', value: 'Louis' },
		{ text: 'Valentin', value: 'Valentin' },
	]
</script>

<template>
    <p id="error-code" aria-hidden="true"><span class="sr-only">Code d'erreur </span>500</p>
    <h1 aria-describedby="error-code">Une erreur est survenue</h1>
	<p>Test 1</p>
	<p>Test 2</p>
	<p>Test 3</p>
    <SySelect
		v-model="selectedOptions"
		:items="options"
		label="Options"
		multiple
	/>
	<div class="mt-4">
		Options sélectionnées: {{ selectedOptions }}
	</div>
    <!-- <HeaderToolbar />
    <HeaderBar
        service-title="Synapse"
        service-subtitle="Design System"
    >
		<template #header-side="{ menuOpen }">
            <div class="d-flex justify-center h-100 ga-4 pr-4">
                <VBtn
                    variant="text"
                    :prepend-icon="mdiMagnify"
                    color="primary"
                >
                    Rechercher
                </VBtn>
                <VBtn
                    color="primary"
                    :prepend-icon="mdiAccountCircleOutline"
                >
                    Login
                </VBtn>
            </div>
        </template>
		<template #append>
            <SubHeader
                title-text="Paul Dupont"
				sub-title-text="1 69 08 75 125 456 75"
				:data-list-group-items="items"
				@click:list-item="updateInfo"
            />
        </template>
	</HeaderBar>
	<HeaderNavigationBar
		:items="[
			{ label: 'Home', href: '' },
			{ label: 'About', href: '' },
		]"
	/> -->

	<!-- <HeaderBar>
		<template #menu>
			<HeaderBurgerMenu>
				<HeaderMenuSection>
					<HeaderMenuItem>
						<a href="/">Item</a>
					</HeaderMenuItem>
					<HeaderMenuItem>
						<a href="/">Item</a>
					</HeaderMenuItem>
					<headerMenuItem>
						<HeaderSubMenu>
							<template #title>
								Menu de premier niveau
							</template>
							<HeaderMenuItem>
								<a href="/">Item</a>
							</HeaderMenuItem>
							<HeaderMenuItem>
								<a href="/">Item</a>
							</HeaderMenuItem>
							<HeaderMenuItem>
								<a href="/">Item</a>
							</HeaderMenuItem>
						</HeaderSubMenu>
					</headerMenuItem>
					<HeaderMenuItem>
						<a href="/">Item</a>
					</HeaderMenuItem>
				</HeaderMenuSection>
			</HeaderBurgerMenu>
		</template>
	</HeaderBar> -->

    <!-- <div
        style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
    >Contenu de la page</div> -->
    <!-- <VThemeProvider theme="dark" with-background class="pa-4">
        SelectedValue: {{ selectedValueDark }}
        <SySelect
            v-model="selectedValueDark"
            :items="itemsDark"
            text-key="text"
            required
        />
    </VThemeProvider> -->
</template>
