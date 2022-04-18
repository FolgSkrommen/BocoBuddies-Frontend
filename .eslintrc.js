module.exports = {
	env: {
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
	rules: {
		// override/add rules settings here
		'vue/multi-word-component-names': 'off',
	},
}
