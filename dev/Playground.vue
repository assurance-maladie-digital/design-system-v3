<script setup lang="ts">
import TopNav from '@/components/TopNav/TopNav.vue';
import { ref } from 'vue';

const leftLinks = ref([{
  text: 'Qui sommes-nous ?',
  href: 'https://www.assurance-maladie.ameli.fr/qui-sommes-nous',
  title: 'Qui sommes-nous ?',
},
{
  text: 'Carrières',
  href: 'https://www.assurance-maladie.ameli.fr/carrieres',
  title: 'Carrières',

},
{
  text: 'Études et données',
  href: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees',
  title: 'Études et données',

},
{
  text: 'Presse',
  href: 'https://www.assurance-maladie.ameli.fr/presse',
  title: 'Presse',

}]);
const rightLinks = ref([{
  text: 'Assuré',
  href: 'https://www.assurance-maladie.ameli.fr/assure',
},
{
  text: 'Professionnel de santé',
  href: '',

},
{
  text: 'Entreprise',
  href: 'https://www.assurance-maladie.ameli.fr/entreprise',

},
]);

const itemsSelectMenu = ref([

{
    text: 'Chirurgien-dentiste',
    value: '',

},
{
    text: 'Établissement',
    value: '',
},
{
    text: 'Exercice coordonné',
    value: '',
},
{
    text: 'Infirmier',
    value: '',
},
{
    text: 'Laboratoire d\'analyses médicales',
    value: '',
},
{
    text: 'Masseur-kinésithérapeute',
    value: '',
},
])


</script>

<template>
  <TopNav :leftLinks="leftLinks" :rightLinks="rightLinks" :itemsSelectMenu="itemsSelectMenu"/>
</template>
