function ChartDemo() {
	// Init navigation
	this.nav = this._initNav()

	// Set color values
	this.colors = this._setColors()

	// Set default values for repeat use
	this.defaults = this._setDefaults()

	// Create object for each individual chart
	this.charts = this._setCharts()

	// Render first chart
	this.init()
}

ChartDemo.prototype.init = function () {
	this.ctx = document.getElementById('chart').getContext('2d')
	this.renderFirstChart()
}

// Render first chart on landing
ChartDemo.prototype.renderFirstChart = function () {
	const currentChartname = window.location.hash
		? window.location.hash.slice(1)
		: 'volume'
	this.render(currentChartname)

	// Set nav selection
	document
		.querySelector(`#side-nav a[href="#${currentChartname}"]`)
		.classList.add('sel')
}

// Render a chart
ChartDemo.prototype.render = function (chartName) {
	if (window.myChart) window.myChart.destroy() // Destroy previous chart
	this._setChartSize(chartName)
	window.myChart = new Chart(this.ctx, this.charts[chartName].chart)
}

//
//
//
//

/**
 * Setup Functions
 */

ChartDemo.prototype._initNav = function () {
	const nav = {
		toggleSel: (a, e) => {
			const chartName = a.href.split('#')[1]
			this.render(chartName)
			const currentSel = document
				.getElementById('side-nav')
				.getElementsByClassName('sel')[0]
			if (currentSel) currentSel.classList.remove('sel')
			a.classList.add('sel')
		},
	}

	// Navigation click events
	;[].slice
		.call(document.getElementById('side-nav').getElementsByTagName('a'))
		.forEach((a, i) => {
			a.addEventListener('click', (e) => {
				nav.toggleSel(a, e)
			})
		})

	return nav
}

// Color values
ChartDemo.prototype._setColors = function () {
	const purple = '#D2B1D2'
	const bluegreen = '#C1DDBA'
	const purple2 = '#DC89B2'
	const bluegreen2 = '#A5C2C0'
	const purple3 = '#E66191'
	const bluegreen3 = '#8AA7C6'
	const purple4 = '#CF2452'
	const bluegreen4 = '#4A6D99'
	return {
		main: [purple, bluegreen],
		main2: [purple2, bluegreen2],
		main3: [purple3, bluegreen3],
		main4: [purple4, bluegreen4],
		purple,
		bluegreen,
		ref: '#1E8CF4', // Reference line
		doughnut: [
			'#E9C46B',
			'#F4A261',
			'#E77051',
			'#2A9D8F',
			'#264653',
			'#77919C',
			'#8BD7E8',
			'#4A9AC6',
			'#2A539D',
			'#B56CA2',
			'#F28ECE',
			'#FFC6C9',
			'#9C6C6C',
			'#70DBBC',
			'#D0DB70',
		],
		stacked: [
			'#416896',
			'#199AAB',
			'#C06BB8',
			'#88559D',
			'#639452',
			'#626706',
			'#1C0867',
			'#005F08',
			'#B05D1E',
			'#AE0000',
		],
		stackedTransparent: [
			'rgba(65, 104, 150, .8)',
			'rgba(25, 154, 171, .8)',
			'rgba(192, 107, 184, .8)',
			'rgba(136, 85, 157, .8)',
			'rgba(99, 148, 82, .8)',
			'rgba(98, 103, 6, .8)',
			'rgba(28, 8, 103, .8)',
			'rgba(0, 95, 8, .8)',
			'rgba(167, 93, 30, .8)',
			'rgba(174, 0, 0, .8)',
		],
		negative: '#E14532',
		positive: '#459F00',
	}
}

// Default values
ChartDemo.prototype._setDefaults = function () {
	return {
		width: 360,
		height: 270,

		// General default options
		optionsGeneral: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			plugins: {
				legend: {
					display: false,
				},
			},
		},

		// Default options for bar charts
		optionsBar: {
			layout: {
				padding: {
					left: 25,
					right: 30,
					top: 30,
					bottom: 15,
				},
			},
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},

		// Default options for doughnut charts
		optionsDoughnut: (options) => {
			const title = options ? options.title : null
			return {
				plugins: {
					title: {
						display: true,
						text: title || 'FY 2020',
						position: 'bottom',
						font: {
							weight: 'normal',
						},
					},
				},
			}
		},

		// Options for breakdown charts
		optionsBreakdown: {
			plugins: {
				legend: {
					display: true,
					position: 'bottom',
					labels: {
						padding: 20,
						usePointStyle: true,
						boxWidth: 8,
					},
				},
			},
		},

		// Dynamic tooltip options
		// prettier-ignore
		optionsTooltip: (options) => {
			const prefix = options && options.prefix ? options.prefix : ''
			const suffix = options && options.suffix ? options.suffix : ''
			const showDiff = options && options.showDiff ? options.showDiff : false
			const showTitle = options && options.showTitle ? options.showTitle : false
			// Constructor allows us to create custom tooltip format from within the chart object.
			const labelConstructor = options && options.labelConstructor ? options.labelConstructor : null
			const afterBodyConstructor = options && options.afterBodyConstructor ? options.afterBodyConstructor : null
			return {
				plugins: {
					tooltip: {
						mode: 'index',
						usePointStyle: true,
						padding: 15,
						cornerRadius: 3,
						backgroundColor: '#333',
						callbacks: {
							// Renders text per color
							label: (context) => {
								if (context.dataset.hideFromTooltip) {
									// Hide from tooltip (used for blue reference line)
									return null
								} else if (labelConstructor) {
									// Construct custom tooltip structure
									return labelConstructor(context)
								} else {
									// Standard tooltip
									const label = context.dataset.label ? context.dataset.label + ': ' : ''
									return ` ${label}${prefix}${prettyNr(context.raw)}${suffix}`
								}
							},
							// Renders text below colors
							afterBody: (context) => {
								if (afterBodyConstructor) {
									return afterBodyConstructor(context)
								} else if (showDiff) {
									const value1 = context[0].raw
									const value2 = context[1].raw
									let pct = value1 ? 100 - (value2 / value1) * 100 : -100
									pct = Math.round(pct * 100) / -100
									pct = pct > 0 ? '+' + pct : pct
									return `- - -\n${pct}%`
								} else {
									return ''
								}
							},
							// Renders title (turned off everywhere, can be replaced with return false)
							title: (context) => {
								return showTitle ? context[0].label : ''
							}
						},
					},
				},
			}
		},

		// Stacked charts
		optionsStacked: {
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				},
			},
			plugins: {
				tooltip: {
					// Reversing tooltip order so it matches the visual order of stacked charts
					itemSort: function (a, b) {
						return b.datasetIndex - a.datasetIndex
					},
				},
			},
		},

		// Volume Decomposition charts
		optionsVolDecomp: {
			layout: {
				padding: {
					left: 30,
					right: 30,
					top: 30,
					bottom: 30,
				},
			},
			scales: {
				y: {
					position: 'left',
					beginAtZero: true,
					title: {
						display: true,
						text: 'Volume',
					},
				},
				y2: {
					position: 'right',
					beginAtZero: true,
					stacked: true,
					grid: {
						display: true,
						drawBorder: true,
						drawOnChartArea: false,
						drawTicks: true,
					},
					title: {
						display: true,
						text: 'GRP',
					},
				},
			},
			plugins: {
				legend: {
					display: true,
					position: 'top',
					labels: {
						padding: 20,
						usePointStyle: true,
						boxWidth: 8,
					},
				},
			},
		},
	}
}

ChartDemo.prototype._setCharts = function () {
	// Need to hard-code this for demo purpose
	TOTAL_VOLUME_CONTRIBUTION = [92594494.05, 85893879.84]
	return {
		//
		// SALES

		// Volume
		volume: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							label: 'OJ',
							data: [83.9, 77.9],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [7.5, 7.0],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [1.6, 1.3],
							backgroundColor: this.colors.main3,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: ' MM',
					}),
					this.defaults.optionsStacked,
				]),
			},
		},

		// Dollar
		dollar: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							label: 'OJ',
							data: [1086.5, 1056.3],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [35.1, 28.4],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [68.6, 69.6],
							backgroundColor: this.colors.main3,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
					}),
					this.defaults.optionsStacked,
				]),
			},
		},

		// Volume
		volume_f: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [93, 86.2],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: ' MM',
					}),
				]),
			},
		},

		// Dollar
		dollar_f: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [1190.2, 1154.3],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
					}),
				]),
			},
		},

		// Volume contribution
		volume_contribution: {
			width: 550,
			height: 270,
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							label: 'Base',
							data: [28426735.9, 27485517.1],
							backgroundColor: this.colors.doughnut[0],
						},
						{
							label: 'Trade',
							data: [8107085.5, 5774014.9],
							backgroundColor: this.colors.doughnut[1],
						},
						{
							label: 'Media',
							data: [404454.6, 638175.8],
							backgroundColor: this.colors.doughnut[2],
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					// this.defaults.optionsTooltip({
					// 	suffix: ' MM',
					// }),
					this.defaults.optionsStacked,
					{
						plugins: {
							legend: {
								display: true,
								position: 'left',
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
						},
					},
				]),
			},
		},

		// Proportional Volume Contribution Legend
		prop_volume_contribution_legend: {
			width: 170,
			height: 270,
			chart: {
				type: 'doughnut',
				data: {
					labels: ['Base', 'Trade', 'Media'],
					datasets: [
						{
							data: [1, 1, 1],
							backgroundColor: this.colors.doughnut,
							borderWidth: 0,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					{
						radius: 0,
						layout: {
							padding: {
								left: 30,
							},
						},
						plugins: {
							legend: {
								display: true,
								position: 'left',
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
						},
					},
				]),
			},
		},

		// Proportional Volume Contribution A
		prop_volume_contribution_a: {
			width: 225,
			height: 270,
			chart: {
				type: 'doughnut',
				data: {
					labels: ['Base', 'Trade', 'Media'],
					datasets: [
						{
							data: [77, 21, 2],
							backgroundColor: this.colors.doughnut,
							borderWidth: 0,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsDoughnut(),
					{
						layout: {
							padding: {
								left: 30,
								right: 10,
								top: 30,
								bottom: 15,
							},
						},
					},
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Proportional Volume Contribution B
		prop_volume_contribution_b: {
			width: 225,
			height: 270,
			chart: {
				type: 'doughnut',
				data: {
					labels: ['Base', 'Trade', 'Media'],
					datasets: [
						{
							data: [80, 16, 4],
							backgroundColor: this.colors.doughnut,
							borderWidth: 0,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsDoughnut({ title: 'FY 2021' }),
					{
						layout: {
							padding: {
								left: 0,
								right: 10,
								top: 30,
								bottom: 15,
							},
						},
					},
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Volume Due-to
		volume_dueto: {
			width: 1120,
			height: 270,
			chart: {
				type: 'bar',
				data: {
					labels: [
						// 'Non-modeled Channels',
						'NMC',
						'Other',
						'Price',
						'Distribution',
						'Special',
						'Trade',
						'Competition',
						'Media',
					],
					datasets: [
						{
							data: [-5.6, -1.3, -0.6, -0.1, 0, 0, 0, 0.1],
							backgroundColor: (a) => {
								return a.raw < 0
									? this.colors.negative
									: this.colors.positive
							},
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		//
		// MEDIA IMPACT - TROPICANA TOTAL

		// Media Impact Spend
		mi_spend: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							label: 'OJ',
							data: [14.1, 12.1],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [2.6, 2.3],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [11.7, 3.6],
							backgroundColor: this.colors.main3,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
					}),
					this.defaults.optionsStacked,
				]),
			},
		},

		// Media Impact Support (GRP)
		mi_support: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							label: 'OJ',
							data: [3241, 3002],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [289, 482],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [3158, 974],
							backgroundColor: this.colors.main3,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
					this.defaults.optionsStacked,
				]),
			},
		},

		// Media Impact CPP
		mi_cpp: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							// Reference line
							data: [4003, 4003],
							type: 'line',
							borderWidth: 1,
							borderColor: this.colors.ref,
							fill: false,
							pointBackgroundColor: 'transparent',
							pointBorderColor: 'transparent',
							borderDash: [3, 3],
							hideFromTooltip: true, // Bespoke prop, not part of chart.js
						},
						{
							label: 'OJ',
							data: [5634, 4789],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [9103, 4866],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [3789, 3797],
							backgroundColor: this.colors.main3,
						},
						{
							label: 'Total TM',
							data: [4252, 4003],
							backgroundColor: this.colors.main4,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		// Media Impact Volume Contribution
		mi_volume_contribution: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							label: 'OJ',
							data: [1245066, 3265107],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [177211, 199881],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [44689, 24707],
							backgroundColor: this.colors.main3,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						labelConstructor: (context) => {
							// console.log(context)
							const value =
								context.dataset.data[context.dataIndex]
							const { dataIndex } = context
							let pct =
								(value / TOTAL_VOLUME_CONTRIBUTION[dataIndex]) *
								100
							pct = Math.round(pct * 100) / 100

							// Return string
							return ` ${
								context.dataset.label
							}: ${pct}% - ${prettyNr(value)}`
						},
						afterBodyConstructor: (context) => {
							// console.log(context)

							// Get total volume (base + trade + media)
							const { dataIndex } = context[0]
							const total = TOTAL_VOLUME_CONTRIBUTION[dataIndex]

							// Calculate total media Volume
							const totalMedia = context.reduce((a, b) => {
								return a + b.raw
							}, 0)

							// Calculate pct %
							let pct = (totalMedia / total) * 100
							pct = Math.round(pct * 100) / 100

							return `- - -\nTotal Media: ${pct}% - ${prettyNr(
								totalMedia
							)}\n- - -\nTotal Base, Trade & Media: ${prettyNr(
								total
							)}`
						},
					}),
					this.defaults.optionsStacked,
				]),
			},
		},

		// Media Impact Effectiveness
		mi_effectiveness: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							// Reference line
							data: [783, 783],
							type: 'line',
							borderWidth: 1,
							borderColor: this.colors.ref,
							fill: false,
							pointBackgroundColor: 'transparent',
							pointBorderColor: 'transparent',
							borderDash: [3, 3],
							hideFromTooltip: true, // Bespoke prop, not part of chart.js
						},
						{
							label: 'OJ',
							data: [384, 1088],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [612, 415],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [14, 25],
							backgroundColor: this.colors.main3,
						},
						{
							label: 'Total TM',
							data: [219, 783],
							backgroundColor: this.colors.main4,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact ROI
		mi_roi: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							// Reference line
							data: [1.8, 1.8],
							type: 'line',
							borderWidth: 1,
							borderColor: this.colors.ref,
							fill: false,
							pointBackgroundColor: 'transparent',
							pointBorderColor: 'transparent',
							borderDash: [3, 3],
							hideFromTooltip: true, // Bespoke prop, not part of chart.js
						},
						{
							label: 'OJ',
							data: [0.8, 2.5],
							backgroundColor: this.colors.main,
						},
						{
							label: 'Premium Drinks',
							data: [0.4, 0.6],
							backgroundColor: this.colors.main2,
						},
						{
							label: 'Probiotics',
							data: [0, 0.1],
							backgroundColor: this.colors.main3,
						},
						{
							label: 'Total TM',
							data: [0.4, 1.8],
							backgroundColor: this.colors.main4,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		//
		// MEDIA IMPACT - TROPICANA TOTAL FLAT

		// Media Impact Spend
		mi_f_spend: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [28.4, 17.9],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
					}),
				]),
			},
		},

		// Media Impact Support (GRP)
		mi_f_support: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [6689, 4458],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact CPP
		mi_f_cpp: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [4252, 4033],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		// Media Impact Volume Contribution
		mi_f_volume_contribution: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [1466965, 3489695],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Media Impact Effectiveness
		mi_f_effectiveness: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [219, 783],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact ROI
		mi_f_roi: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [0.4, 1.8],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		//
		// MEDIA IMPACT - TROPICANA OJ

		// Media Impact Spend
		mi_oj_spend: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [14.1, 12.1],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
					}),
				]),
			},
		},

		// Media Impact Support (GRP)
		mi_oj_support: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [3241, 3002],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact CPP
		mi_oj_cpp: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [4348, 4028],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		// Media Impact Volume Contribution
		mi_oj_volume_contribution: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [1245066, 3265107],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Media Impact Effectiveness
		mi_oj_effectiveness: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [384, 1088],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact ROI
		mi_oj_roi: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [0.8, 2.5],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		//
		// MEDIA IMPACT - CAMPAIGN

		// Media Impact Spend
		mi_c_spend: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [1.2, 0],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
					}),
				]),
			},
		},

		// Media Impact Support (GRP)
		mi_c_support: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [3458, 0],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact CPP
		mi_c_cpp: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [2447, 0],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		// Media Impact Volume Contribution
		mi_c_volume_contribution: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [145760, 0],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Media Impact Effectiveness
		mi_c_effectiveness: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [122, 0],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact ROI
		mi_c_roi: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [0.33, 0],
							backgroundColor: this.colors.main,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		//
		// VEHICLE BREAKDOWNS

		// Media Impact Spend Breakdown
		mi_spend_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							label: 'FY 2020',
							data: [11.1, 12.6, 0, 0, 0.4, 1.3],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [3.5, 12.8, 0, 0, 0.6, 1.2],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
						showDiff: true,
					}),
				]),
			},
		},

		// Media Impact Spend Breakdown
		mi_spend_breakdown_simplified: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: ['TV', 'Digital', 'Shopper', 'eComm'],
					datasets: [
						{
							label: 'FY 2020',
							data: [11.1, 12.6, 0.4, 1.3],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [3.5, 12.8, 0.6, 1.2],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
						showDiff: true,
					}),
				]),
			},
		},

		// Media Impact Spend Breakdown OJ
		mi_spend_oj_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							label: 'FY 2020',
							data: [3.9, 7.6, 0.5, 0, 0.25, 1.7, 0, 0],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [0, 10.4, 0, 0, 0, 1.6, 0, 0],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
						showDiff: true,
					}),
				]),
			},
		},

		// Media Impact Support Breakdown
		mi_support_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							label: 'FY 2020',
							data: [3981, 5507, 0, 0, 276, 278],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [923, 2666, 0, 0, 133, 249],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({ showDiff: true }),
				]),
			},
		},

		// Media Impact CPP Breakdown
		mi_cpp_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'Total Media',
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							// Reference line
							data: [4555, 4555, 4555, 4555, 4555, 4555, 4555],
							type: 'line',
							borderWidth: 1,
							borderColor: this.colors.ref,
							fill: false,
							pointBackgroundColor: 'transparent',
							pointBorderColor: 'transparent',
							borderDash: [3, 3],
							hideFromTooltip: true, // Bespoke prop, not part of chart.js
						},
						{
							label: 'FY 2020',
							data: [4847, 3650, 5002, 0, 0, 3987, 5347],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [4555, 3804, 4807, 0, 0, 4163, 4837],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						showDiff: true,
					}),
				]),
			},
		},

		// Media Impact Volume Contribution Breakdown
		mi_volume_contribution_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							label: 'FY 2020',
							data: [0.2, 0.8, 0.3, 0, 0, 0.1, 0.2],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [0.5, 0.9, 0.7, 0, 0, 1.1, 0.9],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						suffix: '%',
						showDiff: true,
					}),
				]),
			},
		},

		// Media Impact Effectiveness Breakdown
		mi_effectiveness_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'Total Media',
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							// Reference line
							data: [873, 873, 873, 873, 873, 873, 873, 873],
							type: 'line',
							borderWidth: 1,
							borderColor: this.colors.ref,
							fill: false,
							pointBackgroundColor: 'transparent',
							pointBorderColor: 'transparent',
							borderDash: [3, 3],
							hideFromTooltip: true, // Bespoke prop, not part of chart.js
						},
						{
							label: 'FY 2020',
							data: [245, 130, 467, 256, 0, 0, 260, 418],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [873, 11, 1261, 0, 0, 106, 240],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({ showDiff: true }),
				]),
			},
		},

		// Media Impact ROI Breakdown
		mi_roi_breakdown: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'Total Media',
						'TV',
						'Digital',
						'Audio',
						'OOH',
						'Shopper',
						'eComm',
					],
					datasets: [
						{
							// Reference line
							data: [1.76, 1.76, 1.76, 1.76, 1.76, 1.76, 1.76],
							type: 'line',
							borderWidth: 1,
							borderColor: this.colors.ref,
							fill: false,
							pointBackgroundColor: 'transparent',
							pointBorderColor: 'transparent',
							borderDash: [3, 3],
							hideFromTooltip: true, // Bespoke prop, not part of chart.js
						},
						{
							label: 'FY 2020',
							data: [0.43, 0.32, 0.54, 0.28, 0, 0, 0.56, 0.56],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [1.76, 0.04, 2.41, 0, 0, 0.23, 0.45],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						showDiff: true,
					}),
				]),
			},
		},

		//
		// SUBVEHICLE BREAKDOWNS

		// Media Impact Spend Breakdown –– Vehicle level
		mi_spend_breakdown_vehicle: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: ['Linear TV', 'TVX'],
					datasets: [
						{
							label: 'FY 2020',
							data: [9.7, 0],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [3.5, 0],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
						showDiff: true,
					}),
				]),
			},
		},

		//
		// CAMPAIGN BREAKDOWNS

		// Media Impact Spend Breakdown –– Campaign level
		mi_spend_breakdown_campaign: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						'Sisters',
						'Good Morning',
						'Sunny Moments',
						'Trainer',
						'Celebrate Breakfast',
						'Substitute',
					],
					datasets: [
						{
							label: 'FY 2020',
							data: [0, 3.7, 2.4, 0, 0, 3],
							backgroundColor: this.colors.purple,
						},
						{
							label: 'FY 2021',
							data: [1.8, 0, 0, 6.2, 2.7, 0],
							backgroundColor: this.colors.bluegreen,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsBreakdown,
					this.defaults.optionsTooltip({
						prefix: '$',
						suffix: ' MM',
						showDiff: true,
					}),
				]),
			},
		},

		//
		// DUE-TOS

		// Media Impact Effectiveness Due-To
		mi_volume_contribution_dueto: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: [
						// 'Non-modeled Channels',
						'NMC',
						'Other',
						'Price',
						'Distribution',
						'Special',
						'Trade',
						'Competition',
						'Media',
					],
					datasets: [
						{
							label: 'FY 2020',
							data: [-5.6, -1.3, -0.6, -0.1, 0, 0, 0, 0.1],
							backgroundColor: (a) => {
								return a.raw < 0
									? this.colors.negative
									: this.colors.positive
							},
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Media Impact Effectiveness Due-To
		mi_effectiveness_dueto: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: ['Change Support', 'All Other'],
					datasets: [
						{
							label: 'FY 2020',
							data: [-120, 748],
							backgroundColor: (a) => {
								return a.raw < 0
									? this.colors.negative
									: this.colors.positive
							},
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip(),
				]),
			},
		},

		// Media Impact ROI Due-To
		mi_roi_dueto: {
			width: 1120,
			height: 300,
			chart: {
				type: 'bar',
				data: {
					labels: ['CPP', 'Margin', 'Effectiveness'],
					datasets: [
						{
							label: 'FY 2020',
							data: [0, 0, 1.3],
							backgroundColor: (a) => {
								return a.raw < 0
									? this.colors.negative
									: this.colors.positive
							},
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsBar,
					this.defaults.optionsTooltip({
						prefix: '$',
					}),
				]),
			},
		},

		//
		// OTHER

		// Weekly Volume Decomposition vs GRP
		weekly_vol_decomp_vs_grp: {
			width: 1120,
			height: 520,
			chart: {
				type: 'line',
				data: {
					labels: [
						'12/10/17',
						'12/17/17',
						'12/24/17',
						'12/31/17',
						'1/7/18',
						'1/14/18',
						'1/21/18',
						'1/28/18',
						'2/4/18',
						'2/11/18',
						'2/18/18',
						'2/25/18',
						'3/4/18',
						'3/11/18',
						'3/18/18',
						'3/25/18',
						'4/1/18',
						'4/8/18',
						'4/15/18',
						'4/22/18',
						'4/29/18',
						'5/6/18',
						'5/13/18',
						'5/20/18',
						'5/27/18',
						'6/3/18',
						'6/10/18',
						'6/17/18',
						'6/24/18',
						'7/1/18',
						'7/8/18',
						'7/15/18',
						'7/22/18',
						'7/29/18',
						'8/5/18',
						'8/12/18',
						'8/19/18',
						'8/26/18',
						'9/2/18',
						'9/9/18',
						'9/16/18',
						'9/23/18',
						'9/30/18',
						'10/7/18',
						'10/14/18',
						'10/21/18',
						'10/28/18',
						'11/4/18',
						'11/11/18',
						'11/18/18',
						'11/25/18',
						'12/2/18',
						'12/9/18',
						'12/16/18',
						'12/23/18',
						'12/30/18',
						'1/6/19',
						'1/13/19',
						'1/20/19',
						'1/27/19',
						'2/3/19',
						'2/10/19',
						'2/17/19',
						'2/24/19',
						'3/3/19',
						'3/10/19',
						'3/17/19',
						'3/24/19',
						'3/31/19',
						'4/7/19',
						'4/14/19',
						'4/21/19',
						'4/28/19',
						'5/5/19',
						'5/12/19',
						'5/19/19',
						'5/26/19',
						'6/2/19',
						'6/9/19',
						'6/16/19',
						'6/23/19',
						'6/30/19',
						'7/7/19',
						'7/14/19',
						'7/21/19',
						'7/28/19',
						'8/4/19',
						'8/11/19',
						'8/18/19',
						'8/25/19',
						'9/1/19',
						'9/8/19',
						'9/15/19',
						'9/22/19',
						'9/29/19',
						'10/6/19',
						'10/13/19',
						'10/20/19',
						'10/27/19',
						'11/3/19',
						'11/10/19',
						'11/17/19',
						'11/24/19',
						'12/1/19',
					],
					datasets: [
						// GRP stacked bar chart

						{
							label: 'Digital',
							type: 'bar',
							backgroundColor: this.colors.stackedTransparent[0],
							yAxisID: 'y2',
							pointStyle: 'rect',
							data: [
								39.78473197, 41.73370379, 32.73031911,
								6.675694817, 24.75773138, 29.00701208,
								22.70217549, 22.41915317, 22.75651991,
								41.92459817, 30.41562942, 71.60692983,
								61.12324554, 74.75677476, 63.67429913,
								45.44526329, 38.21250082, 33.58911435,
								46.90736608, 25.83494012, 1.522147664,
								0.00153046875, 4.046331953, 18.92616444,
								24.58376711, 26.80986418, 28.92585467,
								30.33423162, 31.14913639, 28.52496083,
								29.03516165, 29.81203677, 17.47386273,
								5.159711934, 2.331840625, 1.848008594,
								2.345439063, 0.5342953125, 0.00103203125,
								0.00089765625, 0.00087734375, 0.09317265625,
								0.454959375, 15.75224052, 29.66464677,
								30.0052913, 35.55323423, 36.05867777,
								34.10385667, 32.6686348, 32.59920153,
								27.28516404, 29.41454138, 28.89975466,
								24.06242654, 0.0009734375, 40.4669089,
								38.3652214, 29.30599249, 25.85723303,
								41.2612415, 38.83730946, 39.59686337,
								39.91147315, 41.52648984, 36.63842109,
								30.96496719, 35.68883203, 0.00059140625,
								0.00080703125, 0.00091484375, 0.00058671875,
								0.00070625, 0.0005828125, 0.00062421875,
								0.00078828125, 0.00075625, 29.73689436,
								37.17514112, 50.95735459, 51.75240062,
								53.41112121, 49.29355846, 45.2260638,
								61.23859815, 47.97732103, 0.008400776241,
								4.827861631, 6.75417254, 14.28657958,
								42.38131477, 63.17837351, 60.89346015,
								66.07297391, 68.33381337, 68.25663298,
								71.79367332, 85.25226353, 111.0457934,
								165.5179965, 133.2390826, 129.1475128,
								112.1690381, 52.3151964,
							],
						},
						{
							label: 'Consumer Promotion',
							type: 'bar',
							backgroundColor: this.colors.stackedTransparent[1],
							yAxisID: 'y2',
							pointStyle: 'rect',
							data: [
								1.849160937, 0, 0, 10.69116484, 10.69116484,
								1.425490625, 1.425490625, 1.425490625,
								1.425490625, 1.425490625, 13.86870234,
								13.86870234, 1.849160937, 1.849160937,
								1.849160938, 1.849160937, 1.849160937, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 10.65274219, 10.65274219, 1.420364844,
								1.420364844, 1.420364844, 1.420364844,
								1.420364844, 13.25363672, 13.25363672,
								1.767151563, 1.767151563, 1.767151563,
								1.767151563, 1.767151562, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 14.24159375,
								14.24159375, 1.898882812, 1.898882813,
							],
						},
						{
							label: 'eComm',
							type: 'bar',
							backgroundColor: this.colors.stackedTransparent[2],
							yAxisID: 'y2',
							pointStyle: 'rect',
							data: [
								0.2739012216, 0.2534115696, 0.3478024501,
								1.049330068, 1.346239066, 1.488880298,
								1.335706255, 1.256169518, 1.156219977,
								1.120716276, 1.323198687, 1.385559594,
								1.617536476, 1.262007325, 1.18649462,
								1.070707814, 0.8523255877, 1.129025157,
								1.073384217, 1.706527349, 2.129160864,
								2.980822491, 3.008675563, 2.468556351,
								2.392078752, 2.19543467, 2.187101725,
								2.01096839, 1.897550276, 6.550135308,
								13.79315074, 5.66123014, 4.108427695,
								3.475271889, 11.20329138, 11.26425511,
								10.15429738, 7.64724515, 8.014193516,
								5.633621181, 5.437752361, 2.538706203,
								2.152490319, 2.77428732, 1.043751693,
								3.297229892, 7.323652291, 10.39885878,
								15.10002521, 14.23247437, 14.32346583,
								11.47603563, 8.501205731, 8.264207045,
								8.918906959, 13.50350235, 9.644367749,
								5.513733056, 6.496109639, 8.16179776,
								3.349099304, 2.903256197, 2.566253885,
								3.016537051, 4.704828723, 4.220811771,
								3.879411193, 5.702132832, 4.011130342,
								3.892768923, 3.955268404, 2.942103581,
								2.881531136, 2.698640494, 7.477720141,
								8.210226383, 8.786622395, 9.337627075,
								9.285052867, 8.602005898, 4.725372956,
								5.510017816, 5.336685054, 5.139203294,
								5.019511355, 5.334832609, 7.270331315,
								6.277628802, 5.217779736, 5.445953451,
								5.945833144, 5.05014601, 4.152999881,
								4.166815728, 9.839963879, 17.29681013,
								18.17437135, 18.91338038, 10.08606444,
								3.526953141, 4.756406563, 4.776467948,
								5.09457468, 5.002377372,
							],
						},
						{
							label: 'Audio',
							type: 'bar',
							backgroundColor: this.colors.stackedTransparent[3],
							yAxisID: 'y2',
							pointStyle: 'rect',
							data: [
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.674582051,
								9.532284017, 7.403060989, 7.299225187,
								7.297409107, 7.467359119, 6.973637552,
								6.60797293, 1.834134571, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							],
						},

						// Volume line chart
						{
							label: 'Total Media Volume Contribution',
							data: [
								981, 777, 756, 489, 880, 1048, 1486, 1703, 1997,
								2541, 2707, 4713, 12014, 16556, 15958, 14780,
								13613, 15174, 18509, 15555, 12912, 10753, 7008,
								5206, 3857, 9735, 8178, 8638, 8329, 7268, 5770,
								5272, 4304, 2533, 10992, 14862, 15235, 13049,
								11545, 14396, 16929, 17425, 20681, 21978, 23125,
								21719, 17566, 15759, 10908, 5572, 2944, 2830,
								8771, 4843, 2376, 556, 998, 1065, 823, 326, 235,
								174, 120, 716, 3862, 40730, 35997, 37261, 34983,
								46305, 45781, 39799, 31874, 33894, 36462, 35618,
								28473, 26417, 34596, 31477, 27292, 29979, 27745,
								32075, 31590, 27258, 28346, 31448, 34115, 30255,
								24705, 26682, 25889, 23082, 16436, 11459, 9768,
								6334, 5159, 2835, 2453, 1393, 1183, 54,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[0],
							// borderColor: this.colors.doughnut[0],
							// borderWidth: 1,
							// fill: '-1',
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsTooltip(),
					this.defaults.optionsStacked,
					{
						layout: {
							padding: {
								left: 30,
								right: 30,
								top: 30,
								bottom: 30,
							},
						},
						scales: {
							y: {
								position: 'left',
								beginAtZero: true,
								title: {
									display: true,
									text: 'Volume',
								},
							},
							y2: {
								position: 'right',
								beginAtZero: true,
								stacked: true,
								grid: {
									display: true,
									drawBorder: true,
									drawOnChartArea: false,
									drawTicks: true,
								},
								title: {
									display: true,
									text: 'GRP',
								},
							},
						},
						plugins: {
							legend: {
								display: true,
								position: 'top',
								reverse: true,
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
							tooltip: {
								intersect: false,
								//prettier-ignore
								callbacks: {
									title: (context) => context[0].label,
									label: (context) => {
										const value = context.dataset.data[context.dataIndex]
										const { label } = context.dataset
										const unit = context.dataset.type ? ' GRP' : ''
										return ` ${label}: ${prettyNr(value)}${unit}`
									},
									afterBody: (context) => {
										const totalGRP = context.reduce((a, b, i) => {
											if (i > 1) {
												return a + b.raw
											} else {
												return b.raw
											}
										})
										return `- - -\nTotal GRP: ${prettyNr(totalGRP)}`
									},
								},
							},
						},
					},
				]),
			},
		},

		// Weekly Volume Decomposition (B/T/M)
		weekly_vol_decomp_btm: {
			width: 1120,
			height: 520,
			chart: {
				type: 'line',
				data: {
					labels: [
						'12/10/17',
						'12/17/17',
						'12/24/17',
						'12/31/17',
						'1/7/18',
						'1/14/18',
						'1/21/18',
						'1/28/18',
						'2/4/18',
						'2/11/18',
						'2/18/18',
						'2/25/18',
						'3/4/18',
						'3/11/18',
						'3/18/18',
						'3/25/18',
						'4/1/18',
						'4/8/18',
						'4/15/18',
						'4/22/18',
						'4/29/18',
						'5/6/18',
						'5/13/18',
						'5/20/18',
						'5/27/18',
						'6/3/18',
						'6/10/18',
						'6/17/18',
						'6/24/18',
						'7/1/18',
						'7/8/18',
						'7/15/18',
						'7/22/18',
						'7/29/18',
						'8/5/18',
						'8/12/18',
						'8/19/18',
						'8/26/18',
						'9/2/18',
						'9/9/18',
						'9/16/18',
						'9/23/18',
						'9/30/18',
						'10/7/18',
						'10/14/18',
						'10/21/18',
						'10/28/18',
						'11/4/18',
						'11/11/18',
						'11/18/18',
						'11/25/18',
						'12/2/18',
						'12/9/18',
						'12/16/18',
						'12/23/18',
						'12/30/18',
						'1/6/19',
						'1/13/19',
						'1/20/19',
						'1/27/19',
						'2/3/19',
						'2/10/19',
						'2/17/19',
						'2/24/19',
						'3/3/19',
						'3/10/19',
						'3/17/19',
						'3/24/19',
						'3/31/19',
						'4/7/19',
						'4/14/19',
						'4/21/19',
						'4/28/19',
						'5/5/19',
						'5/12/19',
						'5/19/19',
						'5/26/19',
						'6/2/19',
						'6/9/19',
						'6/16/19',
						'6/23/19',
						'6/30/19',
						'7/7/19',
						'7/14/19',
						'7/21/19',
						'7/28/19',
						'8/4/19',
						'8/11/19',
						'8/18/19',
						'8/25/19',
						'9/1/19',
						'9/8/19',
						'9/15/19',
						'9/22/19',
						'9/29/19',
						'10/6/19',
						'10/13/19',
						'10/20/19',
						'10/27/19',
						'11/3/19',
						'11/10/19',
						'11/17/19',
						'11/24/19',
						'12/1/19',
					],
					datasets: [
						// Volume line chart
						{
							label: 'Base',
							data: [
								290015, 275729, 273259, 254459, 293486, 318915,
								316226, 309754, 320442, 323450, 323114, 318237,
								314887, 326316, 315996, 316242, 308168, 308053,
								313248, 306212, 300167, 314773, 314760, 307350,
								301337, 284151, 296311, 294946, 287137, 282603,
								284268, 294756, 286294, 287071, 284231, 291581,
								290521, 283490, 281426, 282875, 274542, 278283,
								263982, 272682, 271177, 262182, 256177, 264244,
								271533, 265726, 240831, 254280, 269222, 265833,
								265273, 238417, 283058, 303955, 310601, 300020,
								297364, 302122, 288693, 300680, 316729, 294938,
								299606, 287159, 288531, 284555, 289954, 280601,
								278155, 275737, 274829, 273888, 266096, 260168,
								267460, 270433, 264789, 260377, 259015, 260404,
								260583, 260171, 259761, 268241, 272079, 267407,
								256794, 265873, 268516, 267624, 271733, 276879,
								275824, 268984, 270286, 260186, 281355, 267920,
								263391, 238511,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[0],
							// borderColor: this.colors.doughnut[0],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Trade',
							data: [
								8471, 14573, 7173, 7717, 9594, 10488, 41603,
								10632, 14644, 11050, 12381, 37727, 22018, 16324,
								22353, 8628, 7360, 15399, 17672, 19254, 31526,
								10506, 13623, 12700, 10463, 7130, 22447, 16054,
								26537, 13950, 8950, 15908, 7862, 10913, 17910,
								20898, 20728, 12593, 8703, 14078, 10271, 4993,
								9560, 10460, 6491, 10248, 16130, 13740, 20685,
								10987, 2467, 8519, 6457, 4603, 7333, 3134, 6489,
								14805, 15044, 9564, 13177, 9663, 12460, 12969,
								23562, 14287, 26607, 6092, 6025, 24539, 7089,
								14512, 22745, 25456, 7720, 5332, 6749, 13620,
								24299, 16091, 12061, 7312, 1864, 7307, 5036,
								4060, 7275, 20361, 15547, 9546, 6877, 6383,
								11463, 5477, 3612, 11051, 9007, 9189, 12737,
								15214, 11485, 18548, 6493, 3920,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[1],
							// borderColor: this.colors.doughnut[1],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Media',
							data: [
								981, 777, 756, 489, 880, 1048, 1486, 1703, 1997,
								2541, 2707, 4713, 12014, 16556, 15958, 14780,
								13613, 15174, 18509, 15555, 12912, 10753, 7008,
								5206, 3857, 9735, 8178, 8638, 8329, 7268, 5770,
								5272, 4304, 2533, 10992, 14862, 15235, 13049,
								11545, 14396, 16929, 17425, 20681, 21978, 23125,
								21719, 17566, 15759, 10908, 5572, 2944, 2830,
								8771, 4843, 2376, 556, 998, 1065, 823, 326, 235,
								174, 120, 716, 3862, 40730, 35997, 37261, 34983,
								46305, 45781, 39799, 31874, 33894, 36462, 35618,
								28473, 26417, 34596, 31477, 27292, 29979, 27745,
								32075, 31590, 27258, 28346, 31448, 34115, 30255,
								24705, 26682, 25889, 23082, 16436, 11459, 9768,
								6334, 5159, 2835, 2453, 1393, 1183, 54,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[2],
							// borderColor: this.colors.doughnut[2],
							// borderWidth: 1,
							// fill: '-1',
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsTooltip(),
					this.defaults.optionsStacked,
					{
						layout: {
							padding: {
								left: 30,
								right: 30,
								top: 30,
								bottom: 30,
							},
						},
						scales: {
							y: {
								position: 'left',
								beginAtZero: true,
								title: {
									display: true,
									text: 'Volume',
								},
							},
						},
						plugins: {
							legend: {
								display: true,
								position: 'top',
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
							tooltip: {
								intersect: false,
								mode: 'index',
								position: 'nearest',
								// prettier-ignore
								callbacks: {
									title: (context) => context[0].label,
									label: (context) => {
										const value =context.dataset.data[context.dataIndex]
										const { label } = context.dataset
										const unit = context.dataset.type ? ' GRP' : ''
										return ` ${label}: ${prettyNr(value)}${unit}`
									},
									afterBody: (context) => {
										const totalVolume = context.reduce((a, b) => {
											a = a.raw ? a.raw : a
											return a + parseFloat(b.raw)
										})
										return `- - -\nTotal Volume: ${prettyNr(totalVolume)}`
									},
								},
							},
						},
					},
				]),
			},
		},

		// Weekly Volume Decomposition (detail)
		weekly_vol_decomp_detail: {
			width: 1120,
			height: 520,
			chart: {
				type: 'line',
				data: {
					labels: [
						'12/10/17',
						'12/17/17',
						'12/24/17',
						'12/31/17',
						'1/7/18',
						'1/14/18',
						'1/21/18',
						'1/28/18',
						'2/4/18',
						'2/11/18',
						'2/18/18',
						'2/25/18',
						'3/4/18',
						'3/11/18',
						'3/18/18',
						'3/25/18',
						'4/1/18',
						'4/8/18',
						'4/15/18',
						'4/22/18',
						'4/29/18',
						'5/6/18',
						'5/13/18',
						'5/20/18',
						'5/27/18',
						'6/3/18',
						'6/10/18',
						'6/17/18',
						'6/24/18',
						'7/1/18',
						'7/8/18',
						'7/15/18',
						'7/22/18',
						'7/29/18',
						'8/5/18',
						'8/12/18',
						'8/19/18',
						'8/26/18',
						'9/2/18',
						'9/9/18',
						'9/16/18',
						'9/23/18',
						'9/30/18',
						'10/7/18',
						'10/14/18',
						'10/21/18',
						'10/28/18',
						'11/4/18',
						'11/11/18',
						'11/18/18',
						'11/25/18',
						'12/2/18',
						'12/9/18',
						'12/16/18',
						'12/23/18',
						'12/30/18',
						'1/6/19',
						'1/13/19',
						'1/20/19',
						'1/27/19',
						'2/3/19',
						'2/10/19',
						'2/17/19',
						'2/24/19',
						'3/3/19',
						'3/10/19',
						'3/17/19',
						'3/24/19',
						'3/31/19',
						'4/7/19',
						'4/14/19',
						'4/21/19',
						'4/28/19',
						'5/5/19',
						'5/12/19',
						'5/19/19',
						'5/26/19',
						'6/2/19',
						'6/9/19',
						'6/16/19',
						'6/23/19',
						'6/30/19',
						'7/7/19',
						'7/14/19',
						'7/21/19',
						'7/28/19',
						'8/4/19',
						'8/11/19',
						'8/18/19',
						'8/25/19',
						'9/1/19',
						'9/8/19',
						'9/15/19',
						'9/22/19',
						'9/29/19',
						'10/6/19',
						'10/13/19',
						'10/20/19',
						'10/27/19',
						'11/3/19',
						'11/10/19',
						'11/17/19',
						'11/24/19',
						'12/1/19',
					],
					datasets: [
						// Volume line chart
						{
							label: 'Distribution',
							data: [
								288286, 292510, 288127, 285389, 294240, 296535,
								296022, 295606, 303496, 296187, 295526, 293362,
								293005, 307650, 302858, 302634, 301521, 303153,
								307657, 303571, 301350, 305461, 308286, 310874,
								297461, 292332, 299020, 296343, 291927, 293864,
								294990, 303225, 295419, 299220, 292177, 292905,
								295768, 294656, 290791, 292696, 283088, 290041,
								277994, 282941, 285877, 278127, 271341, 276258,
								279582, 281653, 266497, 274069, 283919, 283633,
								279901, 264383, 283122, 297204, 301313, 296367,
								289169, 290203, 283917, 289656, 292814, 288866,
								288874, 285940, 288535, 285398, 289633, 285812,
								281337, 285917, 284873, 287220, 278479, 274530,
								281695, 281030, 278129, 279890, 277154, 277356,
								276014, 275672, 271275, 275717, 276249, 277016,
								270710, 274639, 274770, 279007, 280698, 283460,
								285512, 284327, 279541, 274104, 287645, 282383,
								277990, 266124,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[0],
							// borderColor: this.colors.doughnut[0],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Promotions',
							data: [
								8471, 14573, 7173, 7717, 9594, 10488, 41603,
								10632, 14644, 11050, 12381, 37727, 22018, 16324,
								22353, 8628, 7360, 15399, 17672, 19254, 31526,
								10506, 13623, 12700, 10463, 7130, 22447, 16054,
								26537, 13950, 8950, 15908, 7862, 10913, 17910,
								20898, 20728, 12593, 8703, 14078, 10271, 4993,
								9560, 10460, 6491, 10248, 16130, 13740, 20685,
								10987, 2467, 8519, 6457, 4603, 7333, 3134, 6489,
								14805, 15044, 9564, 13177, 9663, 12460, 12969,
								23562, 14287, 26607, 6092, 6025, 24539, 7089,
								14512, 22745, 25456, 7720, 5332, 6749, 13620,
								24299, 16091, 12061, 7312, 1864, 7307, 5036,
								4060, 7275, 20361, 15547, 9546, 6877, 6383,
								11463, 5477, 3612, 11051, 9007, 9189, 12737,
								15214, 11485, 18548, 6493, 3920,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[1],
							// borderColor: this.colors.doughnut[1],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Advertising & Coupons',
							data: [
								981, 777, 756, 489, 880, 1048, 1486, 1703, 1997,
								2541, 2707, 4713, 12014, 16556, 15958, 14780,
								13613, 15174, 18509, 15555, 12912, 10753, 7008,
								5206, 3857, 9735, 8178, 8638, 8329, 7268, 5770,
								5272, 4304, 2533, 10992, 14862, 15235, 13049,
								11545, 14396, 16929, 17425, 20681, 21978, 23125,
								21719, 17566, 15759, 10908, 5572, 2944, 2830,
								8771, 4843, 2376, 556, 998, 1065, 823, 326, 235,
								174, 120, 716, 3862, 40730, 35997, 37261, 34983,
								46305, 45781, 39799, 31874, 33894, 36462, 35618,
								28473, 26417, 34596, 31477, 27292, 29979, 27745,
								32075, 31590, 27258, 28346, 31448, 34115, 30255,
								24705, 26682, 25889, 23082, 16436, 11459, 9768,
								6334, 5159, 2835, 2453, 1393, 1183, 54,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[2],
							// borderColor: this.colors.doughnut[2],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Regular Price',
							data: [
								14496, 0, 0, 716, 4705, 8756, 7356, 6171, 7544,
								4406, 2284, 2387, 1690, 2172, 3233, 3643, 2123,
								1350, 831, 1516, 440, 2243, 3031, 0, 0, 0, 640,
								1361, -634, 0, 0, 877, 744, 0, 0, 710, 146, 28,
								-608, -900, 0, -931, -546, -487, -1110, -729,
								-1812, 0, 895, -731, -2200, -284, 0, -292, -109,
								-2908, 0, 0, 0, 0, -310, 0, -1307, -25, 0, -242,
								0, -96, -401, -800, -626, -1920, -1196, -2319,
								0, -836, -2094, -1985, -1847, -602, -2003,
								-3357, -2660, -2400, -2109, -1853, -2029, -990,
								-548, -355, -2024, 0, 0, -750, 0, 0, 0, -1794,
								-42, -129, 0, 0, 0, -2683,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[3],
							// borderColor: this.colors.doughnut[3],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Competitive Media',
							data: [
								-3985, -5446, -6766, -6382, -6044, -4194, -4632,
								-5234, -4730, -2478, -3036, -3277, -2147, -3015,
								-2904, -2229, -1704, -2704, -1633, -2724, -4397,
								-2340, -3187, -4014, -3178, -5397, -4022, -3057,
								-5019, -5599, -4261, -5655, -5018, -5609, -2880,
								-2765, -3797, -2947, -3788, -3649, -2350, -3447,
								-4635, -2490, -3833, -4288, -2958, -4135, -3167,
								-2506, -5735, -5507, -2234, -4648, -6127, -6789,
								-5932, -4835, -3410, -4405, -4106, -2775, -3810,
								-3980, -2122, -4067, -5038, -5381, -5777, -4120,
								-3052, -4351, -5491, -3742, -4113, -4625, -3081,
								-5092, -4786, -3130, -5089, -6093, -4000, -4700,
								-4972, -3412, -1961, -3157, -3715, -2673, -4751,
								-4597, -2883, -4115, -4783, -3417, -3891, -5085,
								-3406, -5296, -3958, -3059, -5197, -10406,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[4],
							// borderColor: this.colors.doughnut[4],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Competition',
							data: [
								-1777, -3220, -1499, -99, -147, -1463, -305,
								-2012, -1741, -1728, -1250, -1198, 2888, 5653,
								1270, 4189, -1723, 815, 377, 876, 1219, 149,
								-664, 522, 5966, 589, 1372, 1491, 4932, -1250,
								-1397, -1028, -1591, -1122, 300, 2293, 1946,
								-2075, -2090, -1334, -2230, -3202, -2547, -3488,
								-3910, -3008, -1090, -571, 933, -842, -3043,
								-1874, -1450, -2980, -1183, -2982, -1752, -1135,
								-404, -2185, -279, -1688, -2725, 1234, 4148,
								621, -786, -1745, -2209, -2704, -2183, -1788,
								2575, -2567, -3356, -3432, -2363, -780, -2041,
								1558, 1807, -3023, -4502, -4115, -2954, -2955,
								-1854, 1818, 4012, -1961, -2238, -1473, -1838,
								-3695, -3347, -1671, -1846, -1106, 389, 2336,
								3799, -393, -1991, -2948,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[5],
							// borderColor: this.colors.doughnut[5],
							// borderWidth: 1,
							// fill: false,
						},
						{
							label: 'Other',
							data: [
								-7004, -8115, -6602, -25165, 733, 19281, 17785,
								15224, 15873, 27062, 29590, 26963, 19451, 13856,
								11539, 8006, 7952, 5439, 6016, 2972, 1555, 9260,
								7295, -31, 1088, -3374, -699, -1192, -4069,
								-4412, -5063, -2663, -3259, -5418, -5365, -1563,
								-3541, -6172, -2880, -3938, -3965, -4180, -6286,
								-3794, -5848, -7919, -9304, -7308, -6708,
								-11849, -14688, -12124, -11013, -9879, -7209,
								-13288, 7619, 12721, 13101, 10241, 12889, 16383,
								12618, 13794, 21889, 9761, 16555, 8442, 8383,
								6780, 6182, 2849, 930, -1551, -2575, -4438,
								-4844, -6504, -5560, -8424, -8055, -7040, -6977,
								-5738, -5395, -7281, -5671, -5147, -3919, -4621,
								-4903, -2695, -1533, -2823, -835, -1493, -3952,
								-7358, -6195, -10828, -6130, -11011, -7412,
								-11577,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[6],
							// borderColor: this.colors.doughnut[6],
							// borderWidth: 1,
							// fill: false,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsTooltip(),
					this.defaults.optionsStacked,
					{
						layout: {
							padding: {
								left: 30,
								right: 30,
								top: 30,
								bottom: 30,
							},
						},
						scales: {
							y: {
								position: 'left',
								beginAtZero: true,
								title: {
									display: true,
									text: 'Volume',
								},
							},
						},
						plugins: {
							legend: {
								display: true,
								reverse: true,
								position: 'top',
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
							tooltip: {
								intersect: false,
								mode: 'index',
								position: 'nearest',
								// prettier-ignore
								callbacks: {
									title: (context) => context[0].label,
									label: (context) => {
										const value = context.dataset.data[context.dataIndex]
										const { label } = context.dataset
										const unit = context.dataset.type ? ' GRP' : ''
										return ` ${label}: ${prettyNr(value)}${unit}`
									},
									afterBody: (context) => {
										const totalVolume = context.reduce((a, b) => {
											a = a.raw ? a.raw : a
											return a + parseFloat(b.raw)
										})
										return `- - -\nTotal Volume: ${prettyNr(totalVolume)}`
									},
								},
							},
						},
					},
				]),
			},
		},

		// Weekly Volume Decomposition narrowed to audio
		weekly_vol_decomps_audio: {
			width: 1120,
			height: 520,
			chart: {
				type: 'line',
				data: {
					labels: [
						'12/10/17',
						'12/17/17',
						'12/24/17',
						'12/31/17',
						'1/7/18',
						'1/14/18',
						'1/21/18',
						'1/28/18',
						'2/4/18',
						'2/11/18',
						'2/18/18',
						'2/25/18',
						'3/4/18',
						'3/11/18',
						'3/18/18',
						'3/25/18',
						'4/1/18',
						'4/8/18',
						'4/15/18',
						'4/22/18',
						'4/29/18',
						'5/6/18',
						'5/13/18',
						'5/20/18',
						'5/27/18',
						'6/3/18',
						'6/10/18',
						'6/17/18',
						'6/24/18',
						'7/1/18',
						'7/8/18',
						'7/15/18',
						'7/22/18',
						'7/29/18',
						'8/5/18',
						'8/12/18',
						'8/19/18',
						'8/26/18',
						'9/2/18',
						'9/9/18',
						'9/16/18',
						'9/23/18',
						'9/30/18',
						'10/7/18',
						'10/14/18',
						'10/21/18',
						'10/28/18',
						'11/4/18',
						'11/11/18',
						'11/18/18',
						'11/25/18',
						'12/2/18',
						'12/9/18',
						'12/16/18',
						'12/23/18',
						'12/30/18',
						'1/6/19',
						'1/13/19',
						'1/20/19',
						'1/27/19',
						'2/3/19',
						'2/10/19',
						'2/17/19',
						'2/24/19',
						'3/3/19',
						'3/10/19',
						'3/17/19',
						'3/24/19',
						'3/31/19',
						'4/7/19',
						'4/14/19',
						'4/21/19',
						'4/28/19',
						'5/5/19',
						'5/12/19',
						'5/19/19',
						'5/26/19',
						'6/2/19',
						'6/9/19',
						'6/16/19',
						'6/23/19',
						'6/30/19',
						'7/7/19',
						'7/14/19',
						'7/21/19',
						'7/28/19',
						'8/4/19',
						'8/11/19',
						'8/18/19',
						'8/25/19',
						'9/1/19',
						'9/8/19',
						'9/15/19',
						'9/22/19',
						'9/29/19',
						'10/6/19',
						'10/13/19',
						'10/20/19',
						'10/27/19',
						'11/3/19',
						'11/10/19',
						'11/17/19',
						'11/24/19',
						'12/1/19',
					],
					datasets: [
						// GRP stacked bar chart
						{
							label: 'Spotify',
							type: 'bar',
							backgroundColor: this.colors.stackedTransparent[0],
							yAxisID: 'y2',
							pointStyle: 'rect',
							data: [
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.674582051,
								9.532284017, 7.403060989, 7.299225187,
								7.297409107, 7.467359119, 6.973637552,
								6.60797293, 1.834134571, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							],
						},
						{
							label: 'Radio',
							type: 'bar',
							backgroundColor: this.colors.stackedTransparent[2],
							yAxisID: 'y2',
							pointStyle: 'rect',
							data: [
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4674582051,
								0.9532284017, 0.7403060989, 0.7299225187,
								0.7297409107, 0.7467359119, 0.6973637552,
								0.660797293, 0.1834134571, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							],
						},

						// Volume line chart

						{
							label: 'Total Audio Volume Contribution',
							data: [
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1249.068635,
								2818.577781, 2339.945416, 2286.118344,
								2303.323431, 2346.766438, 2207.262468,
								2095.573635, 706.2680067, 82.32028573,
								13.56086477, 1.600824553, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							],
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: 'stack',
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[0],
							// borderColor: this.colors.doughnut[0],
							// borderWidth: 1,
							// fill: false,
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					this.defaults.optionsTooltip(),
					this.defaults.optionsStacked,
					{
						layout: {
							padding: {
								left: 30,
								right: 30,
								top: 30,
								bottom: 30,
							},
						},
						scales: {
							y: {
								position: 'left',
								beginAtZero: true,
								title: {
									display: true,
									text: 'Volume',
								},
							},
							y2: {
								position: 'right',
								beginAtZero: true,
								stacked: true,
								grid: {
									display: true,
									drawBorder: true,
									drawOnChartArea: false,
									drawTicks: true,
								},
								title: {
									display: true,
									text: 'GRP',
								},
							},
						},
						plugins: {
							legend: {
								display: true,
								reverse: true,
								position: 'top',
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
							tooltip: {
								intersect: false,
								mode: 'index',
								// prettier-ignore
								callbacks: {
									title: (context) => context[0].label,
									label: (context) => {
										const value = context.dataset.data[context.dataIndex]
										const { label } = context.dataset
										const unit = context.dataset.type ? ' GRP' : ''
										return ` ${label}: ${prettyNr(value)}${unit}`
									},
									afterBody: (context) => {
										const totalGRP = context.reduce((a, b, i) => {
											if (i > 1) {
												return a + b.raw
											} else {
												return b.raw
											}
										})
										return `- - -\nTotal GRP: ${prettyNr(totalGRP)}`
									},
								},
							},
						},
					},
				]),
			},
		},

		// Volume
		saturation_curve: {
			width: 835,
			height: 460,
			chart: {
				type: 'line',
				data: {
					labels: [
						1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 6, 9, 9, 10,
						11, 11, 14, 15, 16, 18, 19, 27, 32, 33, 43, 57, 59, 73,
						89, 92, 92, 93, 98, 102, 102, 106, 109, 110, 111, 111,
						115, 121, 121, 122, 123, 125, 126, 126, 127, 127, 130,
						131, 131, 131, 134, 138, 139, 139, 141, 141, 144, 145,
						146, 147, 150, 151, 154, 154, 156, 157, 161, 161, 163,
						166, 167, 168, 171, 171, 172, 177, 179, 189, 191, 193,
						198, 203, 216, 223, 284,
					],
					datasets: [
						{
							label: 'ROI',
							yAxisID: 'y2',
							pointBorderColor: 'transparent',
							pointRadius: 0,
							// fill: true,
							// borderColor: 'transparent',
							backgroundColor: this.colors.stacked[0],
							borderColor: this.colors.stacked[0],
							borderWidth: 1,
							data: [
								13.24, 12.92, 12.57, 6.86, 6.3, 6.23, 5.2, 4.74,
								4.65, 4.21, 4.17, 3.35, 3.17, 2.83, 2.63, 1.87,
								1.82, 1.66, 1.56, 1.53, 1.34, 1.26, 1.22, 1.12,
								1.07, 0.87, 0.79, 0.77, 0.67, 0.59, 0.58, 0.52,
								0.46, 0.45, 0.45, 0.45, 0.44, 0.43, 0.43, 0.42,
								0.41, 0.41, 0.4, 0.4, 0.39, 0.38, 0.38, 0.38,
								0.38, 0.37, 0.37, 0.37, 0.37, 0.37, 0.36, 0.36,
								0.36, 0.36, 0.35, 0.34, 0.34, 0.34, 0.34, 0.34,
								0.33, 0.33, 0.33, 0.33, 0.32, 0.32, 0.32, 0.32,
								0.31, 0.31, 0.31, 0.31, 0.3, 0.3, 0.3, 0.29,
								0.29, 0.29, 0.29, 0.28, 0.28, 0.27, 0.26, 0.26,
								0.26, 0.25, 0.24, 0.23, 0.18,
							],
						},
						{
							label: 'Incremental Volume',
							pointBorderColor: 'transparent',
							pointRadius: 0,
							fill: true,
							borderColor: 'transparent',
							backgroundColor: this.colors.doughnut[0],
							// borderColor: this.colors.doughnut[0],
							// borderWidth: 1,
							// fill: '-1',
							data: [
								23825, 23843, 23864, 24529, 24661, 24681, 25018,
								25218, 25264, 25512, 25538, 26215, 26407, 26872,
								27218, 29327, 29520, 30374, 30998, 31193, 32743,
								33722, 34137, 35607, 36480, 41838, 45089, 46343,
								52584, 60565, 61096, 68234, 74392, 75302, 75315,
								75743, 77273, 78234, 78264, 79339, 80153, 80499,
								80703, 80785, 81696, 82837, 82936, 83082, 83306,
								83635, 83804, 83873, 84040, 84103, 84567, 84702,
								84757, 84798, 85280, 85881, 85936, 86006, 86231,
								86306, 86614, 86815, 86851, 87031, 87399, 87472,
								87838, 87893, 88025, 88174, 88516, 88568, 88724,
								88985, 89067, 89159, 89363, 89394, 89494, 89822,
								89931, 90556, 90648, 90760, 90974, 91163, 91643,
								91833, 92715,
							],
						},
					],
				},
				options: deepmerge.all([
					this.defaults.optionsGeneral,
					{
						layout: {
							padding: {
								left: 30,
								right: 30,
								top: 30,
								bottom: 30,
							},
						},
						scales: {
							x: {
								title: {
									display: true,
									text: 'GRP',
								},
							},
							y: {
								position: 'left',
								beginAtZero: true,
								title: {
									display: true,
									text: 'Volume',
								},
							},
							y2: {
								position: 'right',
								beginAtZero: true,
								grid: {
									display: true,
									drawBorder: true,
									drawOnChartArea: false,
									drawTicks: true,
								},
								title: {
									display: true,
									text: 'ROI',
								},
							},
						},
						plugins: {
							legend: {
								display: true,
								position: 'top',
								labels: {
									padding: 20,
									usePointStyle: true,
									boxWidth: 8,
								},
							},
							tooltip: {
								intersect: false,
								mode: 'index',
								callbacks: {
									title: (context) =>
										context[0].label + ' GRP',
								},
							},
							annotation: {
								annotations: [
									{
										drawTime: 'afterDatasetsDraw',
										type: 'line',
										mode: 'vertical',
										scaleID: 'x',
										value: 89,
										borderWidth: 5,
										borderColor: 'red',
										label: {
											content: 'TODAY',
											enabled: true,
											position: 'top',
										},
									},
								],
							},
						},
					},
				]),
			},
		},
	}
}

// Resize chart if custom width or height is set
ChartDemo.prototype._setChartSize = function (chartName) {
	// const extraH = needLegend(chartId) ? 42 : 0;
	const w = this.charts[chartName].width || this.defaults.width
	const h = this.charts[chartName].height || this.defaults.height
	document.getElementById('main-module').style.width = w + 'px'
	document.getElementById('main-module').style.height = h + 'px'
}

// Add commas for clarity and round to two decimals
function prettyNr(nr) {
	if (!nr && nr !== 0) return
	nr = nr.toString().split('.')

	// Round after comma
	if (nr[1]) {
		nr[1] = String(Math.round(Number('0.' + nr[1]) * 100))
	}

	let result = nr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	if (nr[1]) result += '.' + nr[1]
	return result
}
