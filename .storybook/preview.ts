import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

import type { Preview } from "@storybook/vue3";
import { setup } from '@storybook/vue3';

import "vuetify/styles";

const vuetify = createVuetify({
	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi,
		},
	},
})

setup((app) => {
	app.use(vuetify)
});


const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Synapse', 'Components', 'Templates'],
      }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;