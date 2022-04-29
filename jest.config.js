module.exports = {
	preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
	moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
	collectCoverage: true,
	collectCoverageFrom: ['**/*.{ts,vue}', '!**/node_modules/**'],
	coverageReporters: ['clover', 'json', 'lcov', 'text', 'text-summary'],
}
