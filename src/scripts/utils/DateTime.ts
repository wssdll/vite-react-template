// import I__dateTimeTrans from 'remotes/xingng/basetype/I__dateTimeTrans'
import dateFormat from 'beyond-lib/lib/dateFormat'
import {default as moment, Moment, unitOfTime} from 'moment'

type DateTimeParam = number | string | DateTime | moment.Moment | Date

export function getDefaultDateMoment(){
	return moment().startOf('date')
}

export function formatTime(value: DateTimeParam) {
	return value ? (new DateTime(value)).toDateSecondString() : void 0
}

export function getRange(dateTimes: Moment[], unitOfTime?: unitOfTime.StartOf){
	let dateTimesBegin
	let dateTimesEnd

	if (dateTimes && dateTimes.length > 0) {
		let [startTime, endTime]: Moment[] = dateTimes.map(item => moment(item))

		if(unitOfTime){
			startTime = startTime.startOf(unitOfTime)
			endTime = endTime.endOf(unitOfTime)
		}

		[startTime, endTime] = startTime.valueOf() > endTime.valueOf() ? [endTime, startTime] : [startTime, endTime]
		dateTimesBegin = startTime.valueOf()
		dateTimesEnd = endTime.valueOf()
	}
	return [dateTimesBegin, dateTimesEnd]
}

export function getRangePicker(dateTimes: Moment[], unitOfTime?: unitOfTime.StartOf) {
	let dateRanges = getRange(dateTimes, unitOfTime)
	return dateRanges.map(item => formatTime(item))
}

export default class DateTime {

	date : Date
	yearFormatStr = 'yyyy'
	monthFormatStr = 'yyyy-MM'
	dateFormatStr = 'yyyy-MM-dd'
	timeFormatStr = 'HH:mm'
	hourFormatStr = 'HH:00'
	secondFormatStr = 'HH:mm:ss'
	_isADateTimeObject = true

	constructor(timestamp? : DateTimeParam){
		if(typeof timestamp === 'number'){
			this.date = new Date(timestamp)
		}else if(typeof timestamp === 'string' && timestamp){
			this.date = new Date(moment(timestamp).valueOf())
		}else if(timestamp instanceof DateTime){
			this.date = new Date(timestamp.date.valueOf())
		}else if(timestamp && timestamp.valueOf){
			let value = timestamp.valueOf()
			if(typeof value === 'number'){
				this.date = new Date(value)
			}
		}
	}

	static toYearString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toYearString()
	}

	static toMonthString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toMonthString()
	}

	static toDateString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toDateString()
	}

	static toTimeString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toTimeString()
	}

	static toDateTimeString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toDateTimeString()
	}

	static toDateHourString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toDateHourString()
	}

	static toDateSecondString(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toDateSecondString()
	}

	static toParam(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toParam()
	}

	static toMoment(timestamp? : DateTimeParam){
		return (new DateTime(timestamp)).toMoment()
	}

	toYearString() : string{
		return this.date ? dateFormat(this.yearFormatStr,this.date) : ''
	}

	toMonthString() : string{
		return this.date ? dateFormat(this.monthFormatStr,this.date) : ''
	}

	toDateString() : string{
		return this.date ? dateFormat(this.dateFormatStr,this.date) : ''
	}
	toTimeString() : string{
		return this.date ? dateFormat(this.timeFormatStr,this.date) : ''
	}

	toDateTimeString() : string{
		return this.date ? dateFormat(`${this.dateFormatStr} ${this.timeFormatStr}`,this.date) : ''
	}

	toDateHourString() : string{
		return this.date ? dateFormat(`${this.dateFormatStr} ${this.hourFormatStr}`,this.date) : ''
	}

	toDateSecondString() : string{
		return this.date ? dateFormat(`${this.dateFormatStr} ${this.secondFormatStr}`,this.date) : ''
	}


	toParamString(){
		return this.date ? this.date.valueOf() : null
	}

	toParam(){
		return this.date ? this.date.valueOf() : null
	}

	toMoment(){
		return  this.date ? moment(this.date.valueOf()) : null
	}

	toString(){
		return this.date ? this.date.toString() : ''
	}

	valueOf(){
		return this.date ? this.date.valueOf() : null
	}

	private _startOf(unit: unitOfTime.StartOf){
		let m = this.toMoment()
		if(m){
			m.startOf(unit)
			return new DateTime(m.valueOf())
		}else{
			return new DateTime()
		}
	}

	private _endOf(unit: unitOfTime.StartOf){
		let m = this.toMoment()
		if(m){
			m.endOf(unit)
			return new DateTime(m.valueOf())
		}else{
			return new DateTime()
		}
	}

	startOfHour(){
		return this._startOf('hour')
	}

	startOfMinute(){
		return this._startOf('minute')
	}

	startOfDate(){
		return this._startOf('date')
	}

	endOfDate(){
		return this._endOf('date')
	}
}

