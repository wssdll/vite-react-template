export default function redirectUrl(devUrl: string, _proUrl: string) {
	// if (process.env.NODE_ENV !== 'production') {
	// 	console.log('this is dev mode')
		location.href = devUrl + location.search
	// } else {
	// 	location.href = (app.basePath === '/' ? '' :  app.basePath) + proUrl
	// }
}
