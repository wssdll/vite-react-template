export default function redirectUrl(devUrl: string) {
	location.href = devUrl + location.search
}
