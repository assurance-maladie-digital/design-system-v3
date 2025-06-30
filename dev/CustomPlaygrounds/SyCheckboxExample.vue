<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import type { ValidationRule } from '@/composables/validation/useValidation'

	// Case à cocher simple
	const checked = ref(false)

	const onChange = (value: boolean) => {
		console.log('Valeur changée:', value)
	}

	// Case à cocher avec état mixte
	const items = ref([
		{ label: 'Option 1', checked: false },
		{ label: 'Option 2', checked: false },
		{ label: 'Option 3', checked: false },
	])

	const childrenIds = computed(() => {
		return items.value.map((_, index) => `child-${index}`)
	})

	const parentChecked = ref(false)
	const parentIndeterminate = ref(false)

	const updateParentState = () => {
		const checkedCount = items.value.filter(item => item.checked).length

		if (checkedCount === 0) {
			parentChecked.value = false
			parentIndeterminate.value = false
		}
		else if (checkedCount === items.value.length) {
			parentChecked.value = true
			parentIndeterminate.value = false
		}
		else {
			parentChecked.value = false
			parentIndeterminate.value = true
		}
	}

	const onChildChange = () => {
		updateParentState()
	}

	const onParentChange = (value: boolean) => {
		items.value.forEach((item) => {
			item.checked = value
		})
	}

	const onUpdateIndeterminate = (value: boolean) => {
		console.log('État indéterminé mis à jour:', value)
	}

	watch(
		() => items.value.map(item => item.checked),
		() => {
			updateParentState()
		},
		{ deep: true },
	)

	// Validation
	const requiredCheck = ref(false)
	const customValidation = ref(false)

	const customRule: ValidationRule = {
		type: 'custom',
		options: {
			message: 'Cette case doit être cochée pour continuer.',
			validate: (value: boolean) => value === true,
		},
	}

	// États
	const readonlyCheck = ref(true)
</script>

<template>
	<div class="pa-4">
		<h2>Exemple de SyCheckbox</h2>

		<div class="my-4">
			<h3>Case à cocher simple</h3>
			<SyCheckbox
				v-model="checked"
				label="Case à cocher standard"
				@change="onChange"
			/>
			<div class="mt-2">
				Valeur actuelle: {{ checked }}
			</div>
		</div>

		<div class="my-4">
			<h3>Case à cocher avec état mixte</h3>
			<SyCheckbox
				v-model="parentChecked"
				:indeterminate="parentIndeterminate"
				label="Sélectionner tout"
				:controls-ids="childrenIds"
				@update:indeterminate="onUpdateIndeterminate"
				@change="onParentChange"
			/>

			<div class="ml-4 mt-2">
				<SyCheckbox
					v-for="(item, index) in items"
					:id="`child-${index}`"
					:key="index"
					v-model="item.checked"
					:label="item.label"
					@change="onChildChange"
				/>
			</div>
		</div>

		<div class="my-4">
			<h3>Validation</h3>
			<SyCheckbox
				v-model="requiredCheck"
				label="Accepter les conditions (requis)"
				required
			/>

			<SyCheckbox
				v-model="customValidation"
				label="Validation personnalisée"
				:custom-rules="[customRule]"
			/>
		</div>

		<div class="my-4">
			<h3>États</h3>
			<SyCheckbox
				label="Désactivée"
				disabled
			/>

			<SyCheckbox
				v-model="readonlyCheck"
				label="Lecture seule"
				readonly
			/>
		</div>
	</div>
</template>
