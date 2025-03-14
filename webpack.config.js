/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

"use strict";

/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const { bundler, styles } = require("@ckeditor/ckeditor5-dev-utils");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	devtool: "source-map",
	performance: { hints: false },

	entry: path.resolve(__dirname, "src", "ckeditor.js"),

	output: {
		// The name under which the editor will be exported.
		library: "ClassicEditor",

		path: path.resolve(__dirname, "build"),
		filename: "ckeditor.js",
		libraryTarget: "umd",
		libraryExport: "default",
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/,
					},
				},
				extractComments: false,
			}),
		],
	},

	plugins: [
		new webpack.BannerPlugin({
			banner: bundler.getLicenseBanner(),
			raw: true,
		}),
	],

	module: {
		rules: [
			{
				test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
				use: ["raw-loader"],
			},
			{
				test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
				use: [
					{
						loader: "style-loader",
						options: {
							injectType: "singletonStyleTag",
							attributes: {
								"data-cke": true,
							},
						},
					},
					{
						loader: "css-loader",
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: styles.getPostCssConfig({
								themeImporter: {
									themePath: require.resolve(
										"@ckeditor/ckeditor5-theme-lark"
									),
								},
								minify: true,
							}),
						},
					},
				],
			},
			{
				test: /\.js?$/,
				use: {
					loader: "babel-loader",
					options: {
						plugins: ["transform-exponentiation-operator"],
					},
				},
			},
		],
	},
};
