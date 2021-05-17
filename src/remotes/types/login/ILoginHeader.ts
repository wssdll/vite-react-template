export default interface ILoginHeader{
	[key:string]:string

	'X-DeviceId': string,
	'X-DeviceName': string,
	'X-SystemType': string,
	'X-Timestamp': string,
	'X-SystemVersion': string,
	'X-AppVersion': string
}
