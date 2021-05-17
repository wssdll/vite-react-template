import BigNumber from 'bignumber.js'

export type CalculateValue = BigNumber.Value | Calculate

BigNumber.DEBUG = process.env.NODE_ENV !== 'production'

BigNumber.config({
	FORMAT: {
		// the decimal separator
		decimalSeparator: '.',
		// the grouping separator of the integer part
		groupSeparator: ',',
		// the primary grouping size of the integer part
		groupSize: 3,
		// the secondary grouping size of the integer part
		secondaryGroupSize: 0,
		// the grouping separator of the fraction part
		fractionGroupSeparator: ' ',
		// the grouping size of the fraction part
		fractionGroupSize: 0
	}
})

function inputToBigNumber(value: CalculateValue) {
	let result: BigNumber
	try {
		result = new BigNumber(value instanceof Calculate ? value.bigNumber : value)
	} catch (e) {
		// console.warn(e)
		result = null
	}
	if(result != null && result.isNaN()){
		result = null
	}
	return result
}

function isValidCalculateValue(value : CalculateValue){
	let result = new Calculate(value)
	return result != null && result.isValid()
}

export default class Calculate {

	
	static LongPricePrecision = 4
	static PricePrecision = 2
	static CountPrecision = 4

	bigNumber: BigNumber = null

	constructor(value: CalculateValue, defaultValue?: number) {
		this.bigNumber = this.parseInput(value, defaultValue)
	}

	plus(num: CalculateValue, defaultValue?: number) {
		let target = this.parseInput(num, defaultValue)
		if(this.isValid() && target != null){
			this.bigNumber = this.bigNumber.plus(target)
		}else{
			this.bigNumber = null
		}
		return this
	}

	minus(num: CalculateValue, defaultValue?: number) {
		let target = this.parseInput(num, defaultValue)
		if(this.isValid() && target != null){	
			this.bigNumber = this.bigNumber.minus(target)
		}else{
			this.bigNumber = null
		}
		return this
	}

	multiple(num: CalculateValue, defaultValue?: number) {
		let target = this.parseInput(num, defaultValue)
		if(this.isValid() && target != null){
			this.bigNumber = this.bigNumber.multipliedBy(target)
		}else{
			this.bigNumber = null
		}
		return this
	}

	divide(num: CalculateValue, defaultValue?: number) {
		let target = this.parseInput(num, defaultValue)
		if(this.isValid() && target != null){
			this.bigNumber = this.bigNumber.dividedBy(target)
		}else{
			this.bigNumber = null
		}
		return this
	}

	/**
	 * 
	 * @param nums 
	 * @param unitDefaultValue 如果存在不合法的项，设置每个项的默认值 
	 * @param defaultSum 结果不是合法的数值的话，设置结果默认值
	 * @description  累加
	 */
	static sum(nums: CalculateValue[], unitDefaultValue?: ((num: CalculateValue, index: number, nums: CalculateValue[]) => number) | number, defaultSum?: number) {
		let total = new Calculate(0)
		nums.forEach((num, i) => {
			if (!isValidCalculateValue(num) && unitDefaultValue != null) {
				total.plus(typeof unitDefaultValue === 'function' ? unitDefaultValue(num, i, nums) : unitDefaultValue)
			} else {
				total.plus(num)
			}
		})

		return !total.isValid() && defaultSum != null ? new Calculate(defaultSum) : total
	}

	static plus(num1: CalculateValue, num2: CalculateValue, defaultValue?: CalculateValue) {
		let calculate = new Calculate(num1)
		calculate.plus(num2)
		return !calculate.isValid() && defaultValue != null ? new Calculate(defaultValue) : calculate
	}

	static minus(num1: CalculateValue, num2: CalculateValue, defaultValue?: CalculateValue) {
		let calculate = new Calculate(num1)
		calculate.minus(num2)
		return !calculate.isValid() && defaultValue != null ? new Calculate(defaultValue) : calculate
	}

	static multiple(num1: CalculateValue, num2: CalculateValue, defaultValue?: CalculateValue) {
		let calculate = new Calculate(num1)
		calculate.multiple(num2)
		return !calculate.isValid() && defaultValue != null ? new Calculate(defaultValue) : calculate
	}

	static divide(num1: CalculateValue, num2: CalculateValue, defaultValue?: CalculateValue) {
		let calculate = new Calculate(num1)
		calculate.divide(num2)
		return !calculate.isValid() && defaultValue != null ? new Calculate(defaultValue) : calculate
	}


	toNumber(precision = Calculate.CountPrecision) {
		if (this.isValid()) {
			let num = this.bigNumber.toNumber()
			if (precision != null) {
				num = +num.toFixed(precision)
			}
			return num
		} else {
			return null
		}
	}

	toFormat(precision: number = Calculate.CountPrecision) {
		if (this.isValid()) {
			return this.bigNumber.toFormat(precision)
		} else {
			return null
		}
	}

	toMoney() {
		if (this.isValid()) {
			return this.bigNumber.toFormat(Calculate.PricePrecision)
		} else {
			return null
		}
	}

	toLongMoney() {
		if (this.isValid()) {
			return this.bigNumber.toFormat(Calculate.LongPricePrecision)
		} else {
			return null
		}
	}

	toCount() {
		return this._count(Calculate.CountPrecision)
	}

	toShortCount() {
		return this._count(Calculate.PricePrecision)
	}

	isValid() {
		return this.bigNumber != null && !this.bigNumber.isNaN()
	}

	toString() {
		if (this.isValid()) {
			return this.toMoney()
		} else {
			return ''
		}
	}

	private parseInput(value: CalculateValue, defaultValue?: number) {
		const bigNumber = inputToBigNumber(value)
		return !bigNumber && defaultValue != null ? new BigNumber(defaultValue) : bigNumber
	}

	private _count(precision: number) {
		if (this.isValid()) {
			let result = this.bigNumber.toFixed(precision)
			let number = +result
			if (number === number) {
				return number + ''
			} else {
				return result
			}
		} else {
			return null
		}
	}
}