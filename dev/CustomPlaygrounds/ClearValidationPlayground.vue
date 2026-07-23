<script setup lang="ts">
	import { ref } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import PasswordField from '@/components/PasswordField/PasswordField.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'

	// Refs pour accéder aux méthodes clearValidation()
	const textFieldRef = ref()
	const passwordFieldRef = ref()
	const phoneFieldRef = ref()
	const selectRef = ref()
	const checkboxRef = ref()
	const checkboxGroupRef = ref()
	const radioGroupRef = ref()
	const textAreaRef = ref()
	const selectBtnFieldRef = ref()
	const monthPickerRef = ref()
	const captchaRef = ref()

	// État des formulaires
	const textFieldValue = ref('')
	const passwordValue = ref('')
	const phoneValue = ref('')
	const selectValue = ref('')
	const checkboxValue = ref(false)
	const checkboxGroupValue = ref([])
	const radioGroupValue = ref('')
	const textAreaValue = ref('')
	const selectBtnFieldValue = ref('')
	const monthPickerValue = ref('')

	const selectOptions = [
		{ text: 'Option 1', value: 'option1' },
		{ text: 'Option 2', value: 'option2' },
		{ text: 'Option 3', value: 'option3' },
	]

	const checkboxGroupOptions = [
		{ label: 'Checkbox 1', value: 'cb1' },
		{ label: 'Checkbox 2', value: 'cb2' },
		{ label: 'Checkbox 3', value: 'cb3' },
	]

	const radioGroupOptions = [
		{ label: 'Radio 1', value: 'radio1' },
		{ label: 'Radio 2', value: 'radio2' },
		{ label: 'Radio 3', value: 'radio3' },
	]

	const selectBtnOptions = [
		{ text: 'Btn 1', value: 'btn1' },
		{ text: 'Btn 2', value: 'btn2' },
		{ text: 'Btn 3', value: 'btn3' },
	]

	// Fonction pour tester clearValidation sur tous les composants
	function clearAllValidation(): void {
		try {
			textFieldRef.value.clearValidation()
			passwordFieldRef.value.clearValidation()
			phoneFieldRef.value.clearValidation()
			selectRef.value.clearValidation()
			checkboxRef.value.clearValidation()
			checkboxGroupRef.value.clearValidation()
			radioGroupRef.value.clearValidation()
			textAreaRef.value.clearValidation()
			selectBtnFieldRef.value.clearValidation()
			monthPickerRef.value.clearValidation()
			captchaRef.value.clearValidation()
			console.warn('✓ clearValidation() appelé avec succès sur tous les composants')
		}
		catch (error: unknown) {
			console.error('Erreur lors de l\'appel de clearValidation():', error)
		}
	}

	// Fonction pour valider tous les composants
	async function validateAll(): Promise<void> {
		try {
			await textFieldRef.value.validateOnSubmit()
			await passwordFieldRef.value.validateOnSubmit()
			await phoneFieldRef.value.validateOnSubmit()
			await selectRef.value.validateOnSubmit()
			await checkboxRef.value.validateOnSubmit()
			await checkboxGroupRef.value.validateOnSubmit()
			await radioGroupRef.value.validateOnSubmit()
			await textAreaRef.value.validateOnSubmit()
			await selectBtnFieldRef.value.validateOnSubmit()
			await monthPickerRef.value.validateOnSubmit()
			console.warn('✓ Validation lancée sur tous les composants')
		}
		catch (error: unknown) {
			console.error('Erreur lors de la validation:', error)
		}
	}
</script>

<template>
	<div style="padding: 24px; font-family: Arial, sans-serif">
		<h1>🧪 Playground - clearValidation() Test</h1>
		<p style="color: #666; margin-bottom: 24px">
			Test the clearValidation() method on all 11 form components
		</p>

		<div style="display: flex; gap: 12px; margin-bottom: 32px">
			<button
				style="
					padding: 12px 24px;
					background: #ff9800;
					color: white;
					border: none;
					border-radius: 4px;
					cursor: pointer;
					font-weight: bold;
				"
				@click="validateAll"
			>
				🔍 Trigger Validation on All
			</button>
			<button
				style="
					padding: 12px 24px;
					background: #4caf50;
					color: white;
					border: none;
					border-radius: 4px;
					cursor: pointer;
					font-weight: bold;
				"
				@click="clearAllValidation"
			>
				✨ Clear Validation on All
			</button>
		</div>

		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px">
			<!-- TextField -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SyTextField</h3>
				<SyTextField
					ref="textFieldRef"
					v-model="textFieldValue"
					label="Text Field (required)"
					placeholder="Enter text..."
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="textFieldRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- PasswordField -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>PasswordField</h3>
				<PasswordField
					ref="passwordFieldRef"
					v-model="passwordValue"
					label="Password (required)"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="passwordFieldRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- PhoneField -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>PhoneField</h3>
				<PhoneField
					ref="phoneFieldRef"
					v-model="phoneValue"
					label="Phone (required)"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="phoneFieldRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- SySelect -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SySelect</h3>
				<SySelect
					ref="selectRef"
					v-model="selectValue"
					label="Select (required)"
					:items="selectOptions"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="selectRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- SyCheckbox -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SyCheckbox</h3>
				<SyCheckbox
					ref="checkboxRef"
					v-model="checkboxValue"
					label="Checkbox (required)"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="checkboxRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- SyCheckBoxGroup -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SyCheckBoxGroup</h3>
				<SyCheckBoxGroup
					ref="checkboxGroupRef"
					v-model="checkboxGroupValue"
					label="Checkbox Group (required)"
					:options="checkboxGroupOptions"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="checkboxGroupRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- SyRadioGroup -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SyRadioGroup</h3>
				<SyRadioGroup
					ref="radioGroupRef"
					v-model="radioGroupValue"
					label="Radio Group (required)"
					:options="radioGroupOptions"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="radioGroupRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- SyTextArea -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SyTextArea</h3>
				<SyTextArea
					ref="textAreaRef"
					v-model="textAreaValue"
					label="Text Area (required)"
					placeholder="Enter text..."
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="textAreaRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- SelectBtnField -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>SelectBtnField</h3>
				<SelectBtnField
					ref="selectBtnFieldRef"
					v-model="selectBtnFieldValue"
					label="Select Btn (required)"
					:items="selectBtnOptions"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="selectBtnFieldRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>

			<!-- MonthPicker -->
			<div style="border: 1px solid #ddd; padding: 16px; border-radius: 4px">
				<h3>MonthPicker</h3>
				<MonthPicker
					ref="monthPickerRef"
					v-model="monthPickerValue"
					label="Month (required)"
					required
				/>
				<button
					style="
						margin-top: 8px;
						padding: 6px 12px;
						background: #2196f3;
						color: white;
						border: none;
						border-radius: 3px;
						cursor: pointer;
						font-size: 12px;
					"
					@click="monthPickerRef?.clearValidation?.()"
				>
					Clear
				</button>
			</div>
		</div>

		<div
			style="
				margin-top: 32px;
				padding: 16px;
				background: #f5f5f5;
				border-radius: 4px;
				border-left: 4px solid #2196f3;
			"
		>
			<h3>💡 Instructions</h3>
			<ol>
				<li>Click <strong>🔍 Trigger Validation on All</strong> to show validation errors</li>
				<li>Click individual <strong>Clear</strong> buttons or <strong>✨ Clear Validation on All</strong> to clear errors</li>
				<li>Check browser console for confirmation messages</li>
				<li>Each component independently exposes the clearValidation() method</li>
			</ol>
		</div>
	</div>
</template>

<style scoped lang="scss">
h1 {
	color: #333;
	margin-bottom: 8px;
}

h3 {
	margin: 0 0 16px 0;
	color: #555;
	font-size: 16px;
}

ol {
	margin: 0;
	padding-left: 20px;

	li {
		margin: 8px 0;
		color: #666;
	}
}
</style>
