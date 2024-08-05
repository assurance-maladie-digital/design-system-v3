// lib/main.ts
import { createApp } from 'vue';
import { vuetify } from '../lib/composables/useVuetify.js';
import './assets/main.scss';

const app = createApp({});
app.use(vuetify);
app.mount('#app');

export default app;