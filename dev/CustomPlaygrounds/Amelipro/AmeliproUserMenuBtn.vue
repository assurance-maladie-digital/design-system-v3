<script setup lang="ts">
	import { ref } from 'vue'
	import UserMenuBtn from '@/components/UserMenuBtn/UserMenuBtn.vue'

	const userMenuDetailsInfos = {
		userName: 'Georges Duval',
		profil: 'Médecin généraliste',
		rpps: '12345678910',
		adeli: '123456789',
		email: 'georges.duval@aphp.fr',
		adresse: {
			numero: '3',
			type: 'rue',
			nom: 'Victor-Hugo',
			codePostal: '78470',
			commune: 'Saint-Rémy-lès-Chevreuse',
		},
	}

	const infos = {
		userName: 'Dr Camille Martin',
		profession: 'Médecin généraliste',
		structure: 'Cabinet médical des Tilleuls',
		userMenuDetailsInfos: {
			rpps: '12345678901',
			adeli: '987654321',
			email: 'camille.martin@example.fr',
		},
	}

	const globalInfos = {
		lastConnexion: '01/06/2024 à 10:00',
	}

	const forcePopupWidth = ref(true)
	const lastAction = ref('Aucune action pour le moment')

	const toAccount = (): void => {
		lastAction.value = 'Ouverture de Mon compte demandée'
	}

	const toLogout = (): void => {
		lastAction.value = 'Déconnexion demandée'
	}
</script>

<template>
  <UserMenuBtn
    v-model="selected"
    :full-name="infos.userName"
    content-class="menu-compte"
  >
    <template #default>
      <div style="width: 330px">
        <div class="ma-6">
          <p><strong>{{ infos.userName }}</strong></p>
          <p><span>N° RPPS :</span> {{userMenuDetailsInfos?.rpps}}</p>
          <p><span>N° ADELI :</span> {{ userMenuDetailsInfos?.adeli }}</p>
          <p><span>Adresse email :</span> {{ userMenuDetailsInfos.email }}</p>
          <p class="last-connection text-caption"> Dernière connexion : {{ globalInfos.lastConnexion }}</p>
        </div>
        <div class="buttons d-flex ma-6">
          <v-btn
            class="text-none font-weight-bold flex-grow-1"
            color="primary"
            variant="text"
          >
            Mon Compte
          </v-btn>

          <v-btn
            class="text-none font-weight-bold flex-grow-1"
            color="primary"
            variant="text"
          >
            Déconnexion
          </v-btn>
        </div>
      </div>


    </template>
  </UserMenuBtn>
</template>

<style scoped lang="scss">
 .last-connection {
   margin-top: 8px;
  }
</style>
