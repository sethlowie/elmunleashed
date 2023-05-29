const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{elm,hbs}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/forms"),
		plugin(({ addUtilities }) => {
			addUtilities({
				".debug": {
					border: "6px solid rgb(174, 121, 15) !important",
					"& > *": {
						border: "4px dashed rgb(0, 151, 167) !important",
					},
				},
			});
		}),
	],
};
