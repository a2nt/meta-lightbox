/*
 * Production assets generation
 */
const webpack = require('webpack');
const commonVariables = require('./webpack.configuration');
const conf = commonVariables.configuration;
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

const filesystem = require('fs');
const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ImageminPlugin = require('image-minimizer-webpack-plugin');
const ImageSpritePlugin = require('@a2nt/image-sprite-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const UIInfo = require('./package.json');
const UIVERSION = JSON.stringify(UIInfo.version);

const NODE_ENV = conf.NODE_ENV || process.env.NODE_ENV;
const COMPRESS = NODE_ENV === 'production' ? true : false;

console.log('NODE_ENV: ' + NODE_ENV);
console.log('COMPRESS: ' + COMPRESS);
console.log('WebP images: ' + conf['webp']);

let plugins = [
	new webpack.ProvidePlugin({
		$: 'jquery',
		jQuery: 'jquery',
		react: 'React',
		'react-dom': 'ReactDOM',
		Popper: ['popper.js', 'default'],
		Util: 'exports-loader?Util!bootstrap/js/dist/util',
		Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
		Button: 'exports-loader?Button!bootstrap/js/dist/button',
		Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
		Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
		Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
		Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
		Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
		Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
		Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
		Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
	}),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(NODE_ENV),
		},
		UINAME: JSON.stringify(UIInfo.name),
		UIVERSION: UIVERSION,
		UIAUTHOR: JSON.stringify(UIInfo.author),
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: COMPRESS,
		debug: !COMPRESS,
	}),
	new MiniCssExtractPlugin({
		filename: 'css/[name].css',
		//allChunks: true,
	}),
];

if (COMPRESS) {
	plugins.push(
		new OptimizeCssAssetsPlugin({
			//assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorPluginOptions: {
				preset: ['default'],
			},
			cssProcessorOptions: {
				zindex: true,
				cssDeclarationSorter: true,
				reduceIdents: false,
				mergeIdents: true,
				mergeRules: true,
				mergeLonghand: true,
				discardUnused: true,
				discardOverridden: true,
				discardDuplicates: true,
				discardComments: {
					removeAll: true,
				},
			},
			canPrint: true,
		}),
	);
	plugins.push(require('autoprefixer'));
	plugins.push(
		new ImageminPlugin({
			minimizerOptions: {
				// Lossless optimization with custom option
				// Feel free to experiment with options for better result for you
				plugins: [
					['gifsicle', { interlaced: true }],
					['jpegtran', { progressive: true }],
					['optipng', { optimizationLevel: 5 }],
					[
						'svgo',
						{
							plugins: [
								{
									removeViewBox: false,
								},
							],
						},
					],
				],
			},
		}),
	);

	plugins.push(
		new ImageSpritePlugin({
			exclude: /exclude|original|default-|icons|sprite|svg|logo|favicon/,
			commentOrigin: false,
			compress: COMPRESS,
			extensions: ['png'],
			indent: '',
			log: true,
			//outputPath: path.join(__dirname, conf.APPDIR, conf.DIST),
			outputFilename: 'img/sprite-[hash].png',
			padding: 0,
		}),
	);
}

const indexPath = path.join(__dirname, conf.APPDIR, conf.SRC, 'index.html');
if (filesystem.existsSync(indexPath)) {
	plugins.push(
		new HtmlWebpackPlugin({
			publicPath: '',
			template: path.join(conf.APPDIR, conf.SRC, 'index.html'),
			templateParameters: {
				NODE_ENV: NODE_ENV,
				REACT_SCRIPTS:
					NODE_ENV === 'production'
						? '<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script><script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>'
						: '<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>',
			},
		}),
	);
}

const faviconPath = path.join(__dirname, conf.APPDIR, conf.SRC, 'favicon.png');
if (filesystem.existsSync(faviconPath)) {
	plugins.push(
		new FaviconsWebpackPlugin({
			title: 'Webpack App',
			logo: faviconPath,
			prefix: '/icons/',
			emitStats: false,
			persistentCache: true,
			inject: false,
			statsFilename: path.join(
				conf.APPDIR,
				conf.DIST,
				'icons',
				'iconstats.json',
			),
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				coast: true,
				favicons: true,
				firefox: true,
				opengraph: true,
				twitter: true,
				yandex: true,
				windows: true,
			},
		}),
	);
}

// add themes favicons
commonVariables.themes.forEach((theme) => {
	const faviconPath = path.join(__dirname, theme, conf.SRC, 'favicon.png');
	if (filesystem.existsSync(faviconPath)) {
		plugins.push(
			new FaviconsWebpackPlugin({
				title: 'Webpack App',
				logo: faviconPath,
				prefix: '/' + theme + '-icons/',
				emitStats: false,
				persistentCache: true,
				inject: false,
				statsFilename: path.join(
					conf.APPDIR,
					conf.DIST,
					theme + '-icons',
					'iconstats.json',
				),
				icons: {
					android: true,
					appleIcon: true,
					appleStartup: true,
					coast: true,
					favicons: true,
					firefox: true,
					opengraph: true,
					twitter: true,
					yandex: true,
					windows: true,
				},
			}),
		);
	}
});

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;
plugins.push(
	new BundleAnalyzerPlugin({
		analyzerMode: 'static',
		openAnalyzer: false,
	}),
);

const cfg = merge(common, {
	mode: NODE_ENV,
	cache: {
		type: 'filesystem',
	},
	recordsPath: path.join(__dirname, conf.APPDIR, conf.DIST, 'records.json'),
	optimization: {
		//removeAvailableModules: false,
		//realContentHash: false,
		splitChunks: {
			name: 'vendor',
			minChunks: 2,
		},
		concatenateModules: true, //ModuleConcatenationPlugin
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					module: false,
					parse: {
						// we want terser to parse ecma 8 code. However, we don't want it
						// to apply any minfication steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
					},
					keep_fnames: true,
					keep_classnames: true,

					mangle: {
						safari10: true,
						keep_fnames: true,
						keep_classnames: true,
						reserved: ['$', 'jQuery', 'jquery'],
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true,
					},
				},
				// Use multi-process parallel running to improve the build speed
				// Default number of concurrent runs: os.cpus().length - 1
				parallel: true,
			}),
		],
	},

	output: {
		publicPath: path.join(conf.APPDIR, conf.DIST),
		path: path.join(__dirname, conf.APPDIR, conf.DIST),
		filename: path.join('js', '[name].js'),
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				//exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/react',
							{
								plugins: [
									'@babel/plugin-proposal-class-properties',
								],
							},
						], //Preset used for env setup
						plugins: [['@babel/transform-react-jsx']],
						cacheDirectory: true,
						cacheCompression: true,
					},
				},
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: !COMPRESS,
						},
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: !COMPRESS,
						},
					},
				],
			},
			{
				test: /fontawesome([^.]+).(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
							publicPath: '../fonts/',
						},
					},
				],
			},
			{
				test: /\.(ttf|otf|eot|svg|woff(2)?)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
							publicPath: '../fonts/',
						},
					},
				],
			},
			{
				test: /\.(png|webp|jpg|jpeg|gif|svg)$/,
				use: [
					{
						loader: 'img-optimize-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: '../img/',
							compress: {
								// This will take more time and get smaller images.
								mode: 'low', // 'lossless', 'high', 'low'
								disableOnDevelopment: true,
								webp: conf['webp'],
							},
							inline: {
								limit: 1,
							},
						},
					},
				],
			},
		],
	},

	plugins: plugins,
});

console.log(cfg);
module.exports = cfg;
