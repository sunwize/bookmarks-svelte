/** @type {import('tailwindcss').Config} */
const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
            maxWidth: {
              "app": "650px",
            },
		},
	},
};

export default config;
