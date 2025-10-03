<script setup lang="ts">
	import Captcha from '@/components/Captcha/Captcha.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue';
	import { ref } from 'vue'

	const model = ref()

</script>

<template>
	<VCard
		class="pa-4 mt-5 ma-auto w-25"
	>
		<Captcha
			v-model="model"
			url-create="http://localhost:4000/captcha/public/backend/api/v2/captcha/"
			url-get-image="http://localhost:4000/captcha/public/frontend/api/v2/captcha/toto.png"
			url-get-audio="http://localhost:4000/captcha/public/frontend/api/v2/captcha/454545454.mp3"
			default-type="image"
			:service="(e)=>{console.log('captcha !',e)}"
		/>
	</VCard>
	{{ model }}
	<br><br>
	<SyTextField
		v-model="model"
		label="Captcha"
		:rules="[(v) => !!v || 'Captcha is required']"
		required
		hide-details="auto"
	/>
	<VTextField
		v-model="model"
		label="Captcha"
		:rules="[(v) => !!v || 'Captcha is required']"
		required
		hide-details="auto"
	/>
</template>
