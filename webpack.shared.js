/**
 * External Dependencies
 */
var path = require( 'path' );
var webpack = require( 'webpack' );

module.exports = {
	target: 'node',
	module: {
		rules: [
			{
				test: /extensions[\/\\]index/,
				exclude: path.join( __dirname, 'calypso', 'node_modules' ),
				loader: path.join( __dirname, 'calypso', 'server', 'bundler', 'extensions-loader' ),
			},
			{
				include: path.join( __dirname, 'calypso', 'client/sections.js' ),
				use: {
					loader: path.join( __dirname, 'calypso', 'client/server/bundler/sections-loader' ),
					options: { forceRequire: true, onlyIsomorphic: true },
				},
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
			{
				test: /\.[jt]sx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: filepath => {
					// is it the chalk module? Then transpile it, too
					const lastIndex = filepath.lastIndexOf( '/node_modules/' );
					return lastIndex !== -1 && filepath.startsWith( '/node_modules/chalk/', lastIndex );
				},
			},
			{
				test: /\.(sc|sa|c)ss$/,
				loader: 'ignore-loader',
			},
			{
				test: /\.(?:gif|jpg|jpeg|png|svg)$/i,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name]-[hash].[ext]',
						outputPath: 'images',
						publicPath: '/calypso/images/',
						emitFile: false,
					},
				},
			},
		],
	},
	node: {
		__filename: true,
		__dirname: true,
	},
	context: __dirname,
	externals: [
		'express',
		'webpack',
		'superagent',
		'electron',
		'component-tip',

		// These are Calypso server modules we don't need, so let's not bundle them
		'webpack.config',
		'server/devdocs/search-index',
	],
	resolve: {
		extensions: [ '.json', '.js', '.jsx', '.ts', '.tsx' ],
		modules: [
			'node_modules',
			path.join( __dirname, 'calypso', 'node_modules' ),
			path.join( __dirname, 'node_modules' ),
			path.join( __dirname, 'calypso', 'client' ),
			path.join( __dirname, 'desktop' ),
		],
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin( /^lib[\/\\]abtest$/, 'lodash/noop' ), // Depends on BOM
		new webpack.NormalModuleReplacementPlugin( /^lib[\/\\]analytics$/, 'lodash/noop' ), // Depends on BOM
		new webpack.NormalModuleReplacementPlugin( /^lib[\/\\]sites-list$/, 'lodash/noop' ), // Depends on BOM
		new webpack.NormalModuleReplacementPlugin( /^lib[\/\\]olark$/, 'lodash/noop' ), // Depends on DOM
		new webpack.NormalModuleReplacementPlugin( /^lib[\/\\]user$/, 'lodash/noop' ), // Depends on BOM
		new webpack.NormalModuleReplacementPlugin(
			/^lib[\/\\]post-normalizer[\/\\]rule-create-better-excerpt$/,
			'lodash/noop'
		), // Depends on BOM
		new webpack.NormalModuleReplacementPlugin(
			/^components[\/\\]seo[\/\\]reader-preview$/,
			'components/empty-component'
		), // Conflicts with component-closest module
		new webpack.NormalModuleReplacementPlugin(
			/^components[\/\\]popover$/,
			'components/null-component'
		), // Depends on BOM and interactions don't work without JS
		new webpack.NormalModuleReplacementPlugin(
			/^my-sites[\/\\]themes[\/\\]theme-upload$/,
			'components/empty-component'
		), // Depends on BOM
		new webpack.NormalModuleReplacementPlugin(
			/^client[\/\\]layout[\/\\]guided-tours[\/\\]config$/,
			'components/empty-component'
		), // should never be required server side
		new webpack.NormalModuleReplacementPlugin(
			/^components[\/\\]site-selector$/,
			'components/null-component'
		), // Depends on BOM
	],
};
