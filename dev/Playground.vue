<template>
	<div class="playground">
		<h1>Test des formats de date</h1>
		<div class="test-case">
			<h2>1. Format européen avec règles de base</h2>
			<DatePicker
				v-model="europeanDate"
				format="DD/MM/YYYY"
        		date-format-return="YYYY/MM/DD"
				placeholder="JJ/MM/AAAA"
				required
				no-icon
        no-calendar
			/>
			<div class="value">Valeur : {{ europeanDate }}</div>
		</div>

		<div class="test-case">
			<h2>2. Format avec règles personnalisées</h2>
			<DatePicker
				v-model="customRulesDate"
				date-format-return="DD/MM/YYYY"
        		format="YYYY-MM-DD"
				placeholder="YYYY-MM-DD"
        required
        no-calendar
				:custom-rules="[{
					type: 'custom',
					options: {
						validate: value => !value || !value.includes('2024'),
						message: 'Les dates en 2024 ne sont pas autorisées',
						successMessage: 'Les dates hors 2024 sont autorisées',
						fieldIdentifier: 'date'
					}
				}]"
			/>
			<div class="value">Valeur : {{ customRulesDate }}</div>
		</div>

		<div class="test-case">
			<h2>3. Format avec règles d'avertissement</h2>
			<DatePicker
				v-model="warningDate"
				format="DD/MM/YYYY"
				placeholder="JJ/MM/AAAA"
        no-calendar
				:custom-warning-rules="[{
					type: 'custom',
					options: {
						validate: value => !value || !value.includes('2025'),
						warningMessage: 'Les dates en 2025 ne sont pas autorisées',
						successMessage: 'Date hors 2025',
						fieldIdentifier: 'date',
            isWarning: true
					}
				}]"
			/>
			<div class="value">Valeur : {{ warningDate }}</div>
		</div>

    <div class="test-case">
    <h2>4. Format avec validation min/max</h2>
    <DatePicker
        v-model="rangeDate"
        format="DD/MM/YYYY"
        placeholder="JJ/MM/AAAA"
        required
        no-calendar
        :custom-rules="[
            {
                type: 'notBeforeDate',
                options: {
                    date: '01/01/2025',
                    message: 'La date doit être postérieure ou égale au 01/01/2025',
                    successMessage: 'Date valide est postérieure ou égale au 01/01/2025',
                    fieldIdentifier: 'date'
                }
            },
            {
                type: 'notAfterDate',
                options: {
                    date: '31/12/2025',
                    message: 'La date doit être antérieure ou égale au 31/12/2025',
                    successMessage: 'La date est antérieure ou égale au 31/12/2025',
                    fieldIdentifier: 'date'
                }
            }
        ]"
    />
    <div class="value">Valeur : {{ rangeDate }}</div>
</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/DatePicker.vue'

const europeanDate = ref<string | null>(null)
const customRulesDate = ref<string | null>('2025-12-21')
const warningDate = ref<string | null>('20/12/2025')
const rangeDate = ref<string | null>('20/12/2024')
</script>

<style scoped>
.playground {
	padding: 20px;
}

.test-case {
	margin-bottom: 30px;
	padding: 20px;
	border: 1px solid #eee;
	border-radius: 4px;
}

.test-case h2 {
	margin-top: 0;
	margin-bottom: 15px;
	font-size: 1.2em;
}

.value {
	margin-top: 10px;
	font-family: monospace;
	color: #666;
}
</style>
