/**
 * Source data
 * 
 */
const data = {
	labels: ['P1 W1','P1 W2','P1 W3','P1 W4','P2 W1','P2 W2','P2 W3','P2 W4','P3 W1','P3 W2','P3 W3','P3 W4','P4 W1','P4 W2','P4 W3','P4 W4','P5 W1','P5 W2','P5 W3','P5 W4','P6 W1','P6 W2','P6 W3','P6 W4','P7 W1','P7 W2','P7 W3','P7 W4','P8 W1','P8 W2','P8 W3','P8 W4','P9 W1','P9 W2','P9 W3','P9 W4','P10 W1','P10 W2','P10 W3','P10 W4','P11 W1','P11 W2','P11 W3','P11 W4','P12 W1','P12 W2','P12 W3','P12 W4','P13 W1','P13 W2','P13 W3','P13 W4'],
	y2019: {
		impr: 	[6445518,7051805,4366579,6505741,9010542,3467249,2891716,2324270,3131463,5543533,4742978,4144589,6453987,4524750,4323540,4320814,3024548,2682706,2362728,2291368,3450390,4351970,4948585,4661719,3738141,4257330,5120802,4892023,4940701,4476512,3801616,4846107,4030717,3675821,4174986,4449866,3849546,3133866,3226937,3173901,2602045,1972258,2057875,2146967,2026197,3360683,3323251,2740453,2950166,3025814,2537497,1957674],
		spend: 	[33324,34014,21139,28348,37971,18457,17595,14482,16017,21353,19769,17864,36158,21679,19829,18757,10957,10210,8836,8737,17297,22353,25507,26875,14595,15613,17564,17724,20942,15404,14925,27370,24382,23981,24901,25256,22458,19422,19373,19435,16121,13537,15148,14217,13528,17759,18102,15753,19399,18898,17980,13456],
		cpp:	[6618,6174,6196,5577,5394,6814,7788,7975,6547,4930,5335,5517,7171,6133,5871,5557,4637,4871,4787,4881,6417,6574,6598,7379,4998,4694,4390,4637,5425,4404,5025,7229,7743,8351,7634,7265,7467,7933,7684,7838,7930,8785,9422,8476,8546,6764,6972,7358,8417,7995,9070,8798],
		volume:	[7065333,6654147,7610775,6734816,6741728,6475030,6388536,7306316,6656591,7381324,6419090,6434330,6268324,5856114,6180807,6445818,5965232,6166916,6067582,6423759,6320759,6050883,6959975,6107068,6463098,5989905,7078139,6522021,6200604,6002142,6637266,6961050,6517344,6254500,6000780,6761532,5781792,6653040,5691670,6713806,6061765,6306279,6306734,6230912,6519593,6219654,7379438,7087333,6626008,7233429,7288318,8642781],
		dollar:	[93658947,89718194,98693749,88978645,89799855,86523376,85620164,92644714,90473651,95056843,87018247,84983241,83370218,79952631,82936410,85694359,78981779,81246192,80636673,82245301,81044789,75999272,86968203,76805617,81218488,75590848,84072291,80360864,77457899,75368611,81583995,84044603,79543984,78538347,77621700,82117584,77450712,82833556,76996509,85124741,81996333,82016351,81922563,80955074,85353822,82092897,94104982,92556587,86059857,92078736,97107235,109804178]
	},
	y2020: {
		impr:	[3434853,4490432,4694465,4974033,4125035,3652485,3570376,3479367,3813699,4720593,7044534,12371949,7689280,6906952,7454544,6466677,5792516,6479837,5180342,7598358,8454103,8931369,8533388,8712751,8276725,7958691,7632195,7946063,7803390,8022486,7805663,7707553,44286844,53379217,52951357,34056751,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		spend:	[18571,25040,24719,25393,20622,18214,18034,17934,21361,22278,37944,69856,56404,49853,49229,41271,35765,35877,29178,35151,35370,35602,39333,44003,41766,45461,45367,47936,45799,45551,41040,41652,82254,93744,90790,65879,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		cpp:	[6921,7138,6740,6535,6399,6383,6465,6598,7170,6041,6894,7227,9389,9239,8453,8169,7903,7087,7210,5921,5355,5102,5900,6465,6459,7312,7609,7722,7512,7268,6730,6917,2377,2248,2195,2476,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		volume:	[7122940,7246394,6362002,6762090,7186055,7566493,6385694,7532667,6630337,8332033,9687071,9940131,8193816,8061558,6907368,6582614,6683293,6810352,6852338,6704666,6330144,7190310,7759453,7408472,7331412,7791483,7765402,7790500,7734180,7316534,7016285,7730398,7828874,7266868,6785064,7105467,7271521,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		dollar:	[94357442,95019038,84943618,87652512,91318619,95530311,85450345,93971299,88808408,105303399,128010656,130100952,109031604,108353702,94807987,92871226,94145518,94631143,96835914,93240831,88998440,93389137,99903628,97217315,96520029,99507425,100488119,100600996,98383384,96945659,93144290,100272009,101206687,96780125,92015941,95741982,96009224,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	}
}




/**
 * Each chart's data & settings
 */

const myCharts = {
	default: {
		width: 1120,
		height: 150
	},
	colors: {
		red: '#C9002B',
		redSoft: 'rgba(201,0,43,.2)',
		blue: '#005CB4',
		blueSoft: 'rgba(0,92,180,.2)',
		green: '#4BAC00',
		greenSoft: 'rgba(75,172,0,.2)'
	}
}

myCharts.fy_impr = {
	labels: data.labels,
	datasets: {
		impr: data.y2020.impr
	}
}

myCharts.fy_spend = {
	labels: data.labels,
	datasets: {
		spend: data.y2020.spend
	}
}

myCharts.fy_cpp = {
	labels: data.labels,
	datasets: {
		cpp: data.y2020.cpp
	}
}

myCharts.fy_sales = {
	labels: data.labels,
	datasets: {
		volume: data.y2020.volume,
		dollar: data.y2020.dollar
	}
}

myCharts.fy_impr_spend = {
	labels: data.labels,
	datasets: {
		impr: data.y2020.impr,
		spend: data.y2020.spend
	}
}

myCharts.fy_impr_compare = {
	labels: data.labels,
	datasets: {
		impr: data.y2020.impr,
		impr2: data.y2019.impr
	}
}

myCharts.fy_spend_compare = {
	labels: data.labels,
	datasets: {
		spend: data.y2020.spend,
		spend2: data.y2019.spend
	}
}

myCharts.fy_cpp_compare = {
	labels: data.labels,
	datasets: {
		cpp: data.y2020.cpp,
		cpp2: data.y2019.cpp,
	}
}

myCharts.fy_sales_compare = {
	labels: data.labels,
	datasets: {
		volume: data.y2020.volume,
		volume2: data.y2019.volume,
		dollar: data.y2020.dollar,
		dollar2: data.y2019.dollar
	}
}

myCharts.fy_impr_spend_compare = {
	labels: data.labels,
	datasets: {
		impr: data.y2020.impr,
		spend: data.y2020.spend,
		impr2: data.y2019.impr,
		spend2: data.y2019.spend
	}
}



///////////////////////////////////////////////////////////////////////




/**
 * Generate charts
 */

// Create canvas
const ctx = document.getElementById('chart').getContext('2d');

// Render default chart
window.onload = renderLineChart('fy_impr');
// window.onload = renderLineChart('fy_cpp');

// Render line chart
function renderLineChart(chartId) {
	console.log(chartId)
	console.log(typeof getLineChartData(chartId))
	console.log('A', getLineChartData(chartId));
	console.log('B', getChartOptions(chartId));
	maybeResizeChart(chartId);
	window.myMixedChart = new Chart(ctx, {
		type: 'line',
		data: getLineChartData(chartId),
		// data: {
		// 	labels: ['a', 'b'],
		// 	datasets: [{
		// 		label: 'Test',
		// 		data: [1,2]
		// 	}]
		// },
		options: getChartOptions(chartId)
	});
};

// Switch between charts
function toggleCharts(chartId) {
	window.myMixedChart.destroy(); // Destroy previous chart
	renderLineChart(chartId, true);
}

// Resize chart if custom width or height is set
function maybeResizeChart(chartId) {
	const extraH = needLegend(chartId) ? 42 : 0;
	if (myCharts[chartId].width) {
		document.getElementById('chart').setAttribute('width', myCharts[chartId].width);
	} else {
		document.getElementById('chart').setAttribute('width', myCharts.default.width);
	}
	if (myCharts[chartId].height) {
		document.getElementById('chart').setAttribute('height', myCharts[chartId].height + extraH);
	} else {
		document.getElementById('chart').setAttribute('height', myCharts.default.height + extraH);
	}
}




/**
 * Get chart data
 */

function getLineChartData(chartId) {
	const colors = myCharts[chartId].colors ? myCharts[chartId].colors : myCharts.default.colors;
	const datasetBase = {
		borderWidth: 1,
		fill: false,
		// pointBackgroundColor: 'transparent',
		// pointBorderColor: 'transparent'
	}
	const datasets = [];

	// Impressions
	if (myCharts[chartId].datasets.impr) {
		datasets.push({
			...datasetBase,
			yAxisID: 'axis-left',
			borderColor: myCharts.colors.blue,
			pointBackgroundColor: myCharts.colors.blue,
			label: 'Impr. FY 2020',
			data: myCharts[chartId].datasets.impr
		});
	}

	// Spend
	if (myCharts[chartId].datasets.spend) {
		datasets.push({
			...datasetBase,
			yAxisID: 'axis-right',
			borderColor: myCharts.colors.red,
			pointBackgroundColor: myCharts.colors.red,
			label: 'Spend FY 2020',
			data: myCharts[chartId].datasets.spend
		});
	}

	// CPP
	if (myCharts[chartId].datasets.cpp) {
		datasets.push({
			...datasetBase,
			borderColor: myCharts.colors.green,
			pointBackgroundColor: myCharts.colors.green,
			label: 'CPP FY 2020',
			data: myCharts[chartId].datasets.cpp
		});
	}

	// Volume Sale
	if (myCharts[chartId].datasets.volume) {
		datasets.push({
			...datasetBase,
			yAxisID: 'axis-left',
			borderColor: myCharts.colors.blue,
			pointBackgroundColor: myCharts.colors.blue,
			label: 'Volume Sales FY 2020',
			data: myCharts[chartId].datasets.volume
		});
	}

	// Dollar sales
	if (myCharts[chartId].datasets.dollar) {
		datasets.push({
			...datasetBase,
			yAxisID: 'axis-right',
			borderColor: myCharts.colors.green,
			pointBackgroundColor: myCharts.colors.green,
			label: 'Dollar Sales FY 2020',
			data: myCharts[chartId].datasets.dollar
		});
	}

	// Impressions - compare
	if (myCharts[chartId].datasets.impr2) {
		datasets.push({
			...datasetBase,
			borderDash: [2,2],
			yAxisID: 'axis-left',
			borderColor: myCharts.colors.blue,
			pointBorderColor: myCharts.colors.blue,
			pointBackgroundColor: 'transparent',
			label: 'Impr. FY 2019',
			data: myCharts[chartId].datasets.impr2
		});
	}

	// Spend - compare
	if (myCharts[chartId].datasets.spend2) {
		datasets.push({
			...datasetBase,
			borderDash: [2,2],
			yAxisID: 'axis-right',
			borderColor: myCharts.colors.red,
			pointBorderColor: myCharts.colors.red,
			pointBackgroundColor: 'transparent',
			label: 'Spend FY 2019',
			data: myCharts[chartId].datasets.spend2
		});
	}

	// CPP - compare
	if (myCharts[chartId].datasets.cpp2) {
		datasets.push({
			...datasetBase,
			borderDash: [2,2],
			borderColor: myCharts.colors.green,
			pointBackgroundColor: myCharts.colors.green,
			label: 'CPP FY 2020',
			data: myCharts[chartId].datasets.cpp2
		});
	}

	// Volume Sale
	if (myCharts[chartId].datasets.volume2) {
		datasets.push({
			...datasetBase,
			borderDash: [2,2],
			yAxisID: 'axis-left',
			borderColor: myCharts.colors.blue,
			pointBackgroundColor: myCharts.colors.blue,
			label: 'Volume Sales FY 2020',
			data: myCharts[chartId].datasets.volume2
		});
	}

	// Dollar sales
	if (myCharts[chartId].datasets.dollar2) {
		datasets.push({
			...datasetBase,
			borderDash: [2,2],
			yAxisID: 'axis-right',
			borderColor: myCharts.colors.green,
			pointBackgroundColor: myCharts.colors.green,
			label: 'Dollar Sales FY 2020',
			data: myCharts[chartId].datasets.dollar2
		});
	}

	return {
		labels: myCharts[chartId].labels,
		datasets: datasets
	};
}




/**
 * Chart rendering options
 */

function getChartOptions(chartId) {
	// Chart options (smart)
	return {
		responsive: false,
		tooltips: {
			mode: 'index'
		},
		legend: {
			display: needLegend(chartId),
			position: 'top',
			labels: {
				padding: 20,
				usePointStyle: true,
				boxWidth: 8,
				filter: (a) => { return ' ' + a.text }
			}
		},
		animation: false,
		layout: {
			padding: {
				left: 30,
				right: 30,
				top: 30,
				bottom: 20
			}
		},
		scales: {
			yAxes: _getYAxes(),
			xAxes: [{
				ticks: {
					maxTicksLimit: 13, // ## can we make this smart?
					maxRotation: 0,
					minRotation: 0,
					callback: (value) => value.replace(/\s+W\w+/, '')
				}
			}]
		},
		elements: {
			point: {
				radius: 0
			}
		}
	}

	function _getYAxes() {
		const yAxisL = {
			id: 'axis-left',
			position: 'left',
			ticks: _getYAxesTicks(),
			gridLines: _getGridlineColor('L')
		}
		const yAxisR = {
			id: 'axis-right',
			position: 'right',
			ticks: _getYAxesTicks('$'),
			gridLines: _getGridlineColor('R')
		}
		const result = [];
		if (myCharts[chartId].datasets.impr || myCharts[chartId].datasets.impr2 || myCharts[chartId].datasets.volume) {
			result.push(yAxisL);
		}
		if (myCharts[chartId].datasets.spend || myCharts[chartId].datasets.spend2 || myCharts[chartId].datasets.dollar) {
			result.push(yAxisR);
		}
		return result;
	}

	function _getGridlineColor(side) {
		if (chartId == 'fy_impr_spend') {
			return {
				color: (side == 'L') ? myCharts.colors.blueSoft : myCharts.colors.redSoft
			}
		} else {
			return {}
		}
	}

	// Y axis options
	function _getYAxesTicks(prefix) {
		prefix = prefix || '';
		return {
			// beginAtZero: true,
			maxTicksLimit: 5,
			callback: (value) => {
				return prefix + String(value)
					.replace(/000000$/, 'M')
					.replace(/000$/, 'K')
					.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,'); // Add commas
			}
		}
	}
}

// If more than one dataset present, show legend
function needLegend(chartId) {
	nr = 0;
	for (set in myCharts[chartId].datasets) {
		nr++;
	}
	return nr > 1;
}
