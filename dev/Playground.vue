<script setup lang="ts">
import CopyBtn from '@/components/CopyBtn/CopyBtn.vue'
import { mdiContentDuplicate  } from '@mdi/js'

const duplicateIcon = mdiContentDuplicate

const vuetifyOptions = {
  menu: {
    offsetX: false,
    offsetY: true,
    nudgeLeft: 100
  },
  btn: {
    large: true
  },
  icon: {
    color: 'secondary'
  }
}
</script>

<template>
  <main>
    <div class="d-flex align-center">
      <p class="mb-0 mr-1">
        Patient n°<b>1970756541</b>
      </p>

      <CopyBtn
          ariaLabel="Copier le numéro de patient"
          text-to-copy="1970756541"
      />
    </div>

    <hr>

    <div class="d-flex align-center">
      <p class="mb-0 mr-1">
        Patient n°<b>1970756541</b>
      </p>

      <CopyBtn
          ariaLabel="Copier le numéro de patient"
          text-to-copy="1970756541"
          hide-tooltip
          aria-owns="copy-btn-2"
      />
    </div>

    <hr>

    <div class="d-flex align-center">
      <p class="mb-0 mr-1">
        Ticket n°<b>7079114565</b>
      </p>

      <CopyBtn
          ariaLabel="Copier le numéro de ticket"
          text-to-copy="7079114565"
          aria-owns="copy-btn-3"
      >
        <template #icon>
          <VIcon>
            {{ duplicateIcon }}
          </VIcon>
        </template>

        <template #tooltip>
          Le texte a bien été copié
        </template>
      </CopyBtn>
    </div>

    <hr>

    <div class="d-flex align-center">
      <p class="mb-0 mr-1">
        Utilisateur n°<b>5654119707</b>
      </p>

      <CopyBtn
          :vuetify-options="vuetifyOptions"
          ariaLabel="Copier le numéro d'utilisateur"
          text-to-copy="5654119707"
          aria-owns="copy-btn-4"
      />
    </div>
  </main>
</template>