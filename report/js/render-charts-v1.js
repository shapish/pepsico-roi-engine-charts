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
	return {
		main: [purple, bluegreen],
		purple,
		bluegreen,
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
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
			},
		},

		// Default options for doughnut charts
		optionsDoughnut: (options) => {
			const title = options ? options.title : null
			return {
				layout: {
					padding: {
						left: 30,
						right: 30,
						top: 30,
						bottom: 15,
					},
				},
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
			return {
				plugins: {
					tooltip: {
						mode: 'index',
						usePointStyle: true,
						padding: 15,
						cornerRadius: 3,
						backgroundColor: '#333',
						callbacks: {
							label: (context) => {
								return ` ${prefix}${prettyNr(context.raw)}${suffix}`
							},
							afterBody: (context) => {
								if (showDiff) {
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
							title: (context) => {
								return showTitle ? context[0].label : ''
							}
						},
					},
				},
			}
		},
	}
}

ChartDemo.prototype._setCharts = function () {
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
		dollar: {
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

		// Volume Contribution Legend
		volume_contribution_legend: {
			width: 170,
			height: 212,
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

		// Volume Contribution A
		volume_contribution_a: {
			width: 225,
			height: 212,
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
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Volume Contribution B
		volume_contribution_b: {
			width: 225,
			height: 212,
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
					this.defaults.optionsTooltip({
						suffix: '%',
					}),
				]),
			},
		},

		// Volume Due-to
		volume_dueto: {
			width: 550,
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
		// MEDIA IMPACT

		// Media Impact Spend
		mi_spend: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [28.6, 18.1],
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
		mi_support: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [5926, 3972],
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
		mi_cpp: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [4830, 4555],
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
		mi_volume_contribution: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [1.5, 3.5],
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
		mi_effectiveness: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [245, 873],
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
		mi_roi: {
			chart: {
				type: 'bar',
				data: {
					labels: ['FY 2020', 'FY 2021'],
					datasets: [
						{
							data: [0.43, 1.76],
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
		// SUBVEHICLE BREAKDOWNS

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
		// VEHICLE BREAKDOWNS

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

// Helpers
function prettyNr(nr) {
	if (!nr && nr !== 0) return
	return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
