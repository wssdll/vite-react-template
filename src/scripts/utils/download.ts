export async function directDownload(url: string) {
	let eleLink = document.createElement('a')
	eleLink.style.display = 'none'
	eleLink.href = url
	document.body.appendChild(eleLink)
	eleLink.click()
	document.body.removeChild(eleLink)
}