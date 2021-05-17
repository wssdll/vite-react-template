import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy'
import path from "path";
import vitePluginImp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
	root:'./src',
	base:'./',
	server:{
		proxy: {
			// string shorthand
			'/foo': 'http://localhost:4567/foo',
			// with options
			"/api": {
				target: "http://8.136.213.50:8080",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			// with RegEx
			'^/fallback/.*': {
				target: 'http://jsonplaceholder.typicode.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/fallback/, '')
			}
		}
	},
	plugins: [
		reactRefresh(),
		legacy({
			targets: ['defaults', 'not IE 11']
		}),
		vitePluginImp({
			libList: [
				{
					libName: "antd",
					style: (name) => `antd/lib/${name}/style/index.css`,
				},
			],
		}),
	],
	build:{
		target:'es2015',
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, 'src/index.html'),
				login: path.resolve(__dirname, 'src/login.html')
			}
		}
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			}
		},
	},
	resolve: {
		alias: [
			{find: /^~/, replacement: ''},
			{find: '@', replacement: path.resolve(__dirname, './src')}
		],
	},
})
