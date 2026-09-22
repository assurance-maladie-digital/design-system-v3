export const config = {
	pdf: {
		height: '556px',
		width: '100%',
	},
	// Délais (ms) de la sonde de rendu natif : mesure initiale, puis mesure qui confirme
	// l'échec. Ne sont pas passés en attributs de l'<object>, contrairement à `pdf`.
	pdfProbe: {
		delay: 400,
		confirmDelay: 800,
	},
	image: {
		// https://github.com/vuejs/core/issues/2801
		style: 'width: 100%;',
	},
}
