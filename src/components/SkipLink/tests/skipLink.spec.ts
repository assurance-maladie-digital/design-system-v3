import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import SkipLink from '../SkipLink.vue';

// Create a mock router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
		{ path: '/about', component: { template: '<div>About</div>' } },
	],
});

describe('SkipLink', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('renders correctly', async () => {
		const wrapper = mount(SkipLink, {
			global: {
				plugins: [router],
			},
		});

		expect(wrapper.html()).toMatchSnapshot();
	});

	it('focuses the skip link on route change', async () => {
		const wrapper = mount(SkipLink, {
			global: {
				plugins: [router],
			},
		});

		// Create a mock for the focus method
		const spy = vi.spyOn(wrapper.vm.$refs.skipLinkSpan as HTMLLinkElement, 'focus');

		// Trigger the route change
		await router.push('/about');
		await router.isReady(); // Ensure the router is ready

		expect(spy).toHaveBeenCalled();
	});
});