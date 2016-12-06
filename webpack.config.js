module.exports = {
	entry: './RxJs/src/app.js',
	output: {
		path: './RxJs/dist',
		filename:'app.bundle.js'
	},
	module: {
		loaders: [{
			exclude: '/node_modules/',
			loader: 'babel-loader',
			query: 
			{
				"presets": ["es2015", "stage-1"],
				"plugins": ["transform-decorators-legacy"]
			}
		}]
	}
}