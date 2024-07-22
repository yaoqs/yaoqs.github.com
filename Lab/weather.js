function addScript(url){
    const script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.setAttribute('src',url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

function setTime() {
	var date = new Date();
	var HH = date.getHours(),
		MM = date.getMinutes(),
		SS = date.getSeconds(),
		date = date.getDate();
	if (SS < 10) {
		SS = "0" + SS
	}
	if (MM < 10) {
		MM = "0" + MM;
	}
	if (HH < 10) {
		HH = "0" + HH;
	}
	return ("最近更新时间 " + HH + ":" + MM + ":" + SS);
}
//===================caiyunapp==========================
const getPosition = () => {
	$(async()=>{
	var location = d3.select("body").select("#position")

	if (navigator.geolocation) {
		await navigator.geolocation.getCurrentPosition(position => {
				location.append("br")
				location.append("text").text("纬度: " + position.coords.latitude)
				location.append("br")
				location.append("text").text("经度: " + position.coords.longitude);
				$.cookie("latitude", position.coords.latitude);
				$.cookie("longitude", position.coords.longitude);
			},
			error => {
				switch (error.code) {
					case error.PERMISSION_DENIED:
						location.append("text").text("用户拒绝对获取地理位置的请求。")
						break;
					case error.POSITION_UNAVAILABLE:
						location.append("text").text("位置信息是不可用的。")
						break;
					case error.TIMEOUT:
						location.append("text").text("请求用户地理位置超时。")
						break;
					case error.UNKNOWN_ERROR:
						location.append("text").text("未知错误。")
						break;
				}
			})
	} else {
		location.append("text").text("该浏览器不支持获取地理位置。");
	}
	});
};

const showWeather = () => {
	const width = window.innerWidth
	const height = window.innerHeight

	let protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
	var DEF_TOKEN = 'Y2FpeXVuX25vdGlmeQ==';
	//var token =  $.Request('token') || DEF_TOKEN;
	if ($.cookie("longitude") != undefined) {
		//console.log($.cookie("longitude"))
		var WeatherapiURL = protocol + "api.caiyunapp.com/v2/Y2FpeXVuX25vdGlmeQ==/" + $.cookie("longitude") + "," +
			$
			.cookie("latitude") + "/forecast?dailysteps=15&alert=true&lang=en";
		var PosapiURL = "https://restapi.amap.com/v3/geocode/regeo?key=127caacaa204cc855a9bcdbc8ca06a49&location=" +
			$
			.cookie("longitude") + "," + $.cookie("latitude");
		var caiyunapp = d3.select("body").select("#caiyunapp");
		$(async () => {
			await $.ajax({
				dataType: 'jsonp',
				url: PosapiURL,
				async: false,
				method: "GET",
				crossDomain: true,
				success: function(dataString) {
					var obj = $.parseJSON(JSON.stringify(dataString));
					if (obj.status == "1") {
						d3.select("body").select("#position").append("br")
						d3.select("body").select("#position").append("text").text(obj
							.regeocode
							.formatted_address)
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					/*错误信息处理*/
					d3.select("body").select("#position").append("br")
					d3.select("body").select("#position").append("text").text("...")
				}
			});
			await $.ajax({
				dataType: 'jsonp',
				url: WeatherapiURL,
				async: false,
				method: "GET",
				crossDomain: true,
				success: function(dataString) {
					//console.log(dataString)
					//var obj = JSON.parse(dataString);
					var obj = $.parseJSON(JSON.stringify(dataString));

					if (obj.status == "ok") {
						caiyunapp.append("text").text(() => {
							return setTime()
						})
						caiyunapp.append("br")
						caiyunapp.append("text").text(() => {
							return obj.result.forecast_keypoint
						})
						if (obj.result.alert.content != null) {
							caiyunapp.append("br")
							caiyunapp.append("text").text(() => {
								return " alert:" + obj.result.alert.content
							})
						}


						var minutely = obj.result.minutely;
						var hourly = obj.result.hourly;
						var daily = obj.result.daily;

						var padding = 30;
						var height = 200;
						const marginTop = 30;
						const marginRight = 30;
						const marginBottom = 30;
						const marginLeft = 50;
						caiyunapp.append("p").text("Daily Forecast-15日内预报:")
						const svg_daily = caiyunapp.append('svg').attr('width', 400).attr(
							'height',
							200).append("g");
						// 定义坐标轴
						var xScale_daily = d3.scaleTime().domain(d3.extent(daily.temperature
							.map(
								d => d3.timeParse("%Y-%m-%d")(d.date)))).range([0,
							width / 2 -
							padding * 2
						])
						var xAxis_daily = d3.axisBottom(xScale_daily).ticks(d3.timeDay);
						var yScale_daily = d3.scaleLinear().domain([d3.min(daily
							.temperature, d => d
							.min), d3.max(daily.temperature, d => d.max)]).range([
							height -
							padding * 2, 0
						])
						var yAxis_daily = d3.axisLeft(yScale_daily)
						// 绘制坐标轴
						svg_daily.append('g').call(xAxis_daily).attr('transform',
							'translate(40, ' +
							(height - padding) + ')')
						svg_daily.append('g').call(yAxis_daily).attr('transform',
							'translate(40, ' +
							padding + ')')
						// 绘制折线
						var line_daily = svg_daily.append('g').attr('transform',
							'translate(40, ' +
							padding + ')')
						var line_daily_temperature_max = line_daily.append("g")
						line_daily_temperature_max.append('path')
							.datum(daily.temperature)
							.attr('fill', 'none')
							.attr('stroke', 'red')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d
									.date))
							}).y(d => {
								return yScale_daily(d.max)
							}))

						// 绘制数据坐标圆点
						line_daily_temperature_max.selectAll('circle').data(daily
								.temperature)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))
							})
							.attr('cy', d => {
								return yScale_daily(d.max)
							})
							.attr('r', 5)
							.attr('fill', 'red')
							.attr('stroke', 'red')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_daily.append('text')
									.text(v.max + "℃")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 5)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						var line_daily_temperature_avg = line_daily.append("g")
						line_daily_temperature_avg.append('path')
							.datum(daily.temperature)
							.attr('fill', 'none')
							.attr('stroke', 'green')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d
									.date))
							}).y(d => {
								return yScale_daily(d.avg)
							}))

						// 绘制数据坐标圆点
						line_daily_temperature_avg.selectAll('circle').data(daily
								.temperature)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))
							})
							.attr('cy', d => {
								return yScale_daily(d.avg)
							})
							.attr('r', 5)
							.attr('fill', 'green')
							.attr('stroke', 'green')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_daily.append('text')
									.text(v.avg + "℃")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 5)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						var line_daily_temperature_min = line_daily.append("g")
						line_daily_temperature_min.append('path')
							.datum(daily.temperature)
							.attr('fill', 'none')
							.attr('stroke', 'blue')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d
									.date))
							}).y(d => {
								return yScale_daily(d.min)
							}))

						// 绘制数据坐标圆点
						line_daily_temperature_min.selectAll('circle').data(daily
								.temperature)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))
							})
							.attr('cy', d => {
								return yScale_daily(d.min)
							})
							.attr('r', 5)
							.attr('fill', 'blue')
							.attr('stroke', 'blue')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_daily.append('text')
									.text(v.min + "℃")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 5)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						/*line_daily.selectAll("text")
						.data(daily.skycon)
						.enter().append("text")
						.attr('x', d => { return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))})
						.attr('y', marginTop / 2)
						.attr('dy', '0.03em')
						.text(d=>{return d.value})
						.attr('text-anchor', 'middle')*/
						line_daily.append("text")
							.attr("x", padding)
							.attr("y", -padding / 2)
							.text("Temperature(℃)")
							.attr('text-anchor', 'middle')
							.attr('dy', '0.03em')
						var var1 = d3.max(daily.precipitation, d => d.max);
						var yScale_daily_precipitation = d3.scaleLinear().domain([d3.min(
							daily
							.precipitation, d => d.min), d3.max([var1, 1])]).range([
							height -
							padding * 2, 0
						])
						var yAxis_daily_precipitation = d3.axisRight(
							yScale_daily_precipitation)
						// 绘制坐标轴
						svg_daily.append('g').call(yAxis_daily_precipitation).attr(
							'transform',
							'translate(' + (width / 2 - padding * 0.8) + ', ' +
							padding + ')')
						// 绘制折线
						var line_daily_precipitation = svg_daily.append('g').attr(
							'transform',
							'translate(40, ' + padding + ')')
						/*var yGrid_daily = d3.axisLeft()
						.scale(yScale_daily_precipitation)
						.tickFormat('')
						.ticks(5)
						.tickSizeInner(-width/2+padding*2 )
						svg_daily.append('g')
						.attr('transform', 'translate(40, '+padding+')')
						.call(yGrid_daily)*/
						//precipitation
						var line_daily_precipitation_max = line_daily_precipitation.append(
							"g")
						line_daily_precipitation_max.append('path')
							.datum(daily.precipitation)
							.attr('fill', 'none')
							.attr('stroke', 'orange')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d
									.date))
							}).y(d => {
								return yScale_daily_precipitation(d.max)
							}))

						// 绘制数据坐标圆点
						line_daily_precipitation_max.selectAll('circle').data(daily
								.precipitation)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))
							})
							.attr('cy', d => {
								return yScale_daily_precipitation(d.max)
							})
							.attr('r', 2)
							.attr('fill', 'orange')
							.attr('stroke', 'orange')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_daily.append('text')
									.text(v.max + "mm")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 2)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						var line_daily_precipitation_avg = line_daily_precipitation.append(
							"g")
						line_daily_precipitation_avg.append('path')
							.datum(daily.precipitation)
							.attr('fill', 'none')
							.attr('stroke', 'lightgreen')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d
									.date))
							}).y(d => {
								return yScale_daily_precipitation(d.avg)
							}))

						// 绘制数据坐标圆点
						line_daily_precipitation_avg.selectAll('circle').data(daily
								.precipitation)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))
							})
							.attr('cy', d => {
								return yScale_daily_precipitation(d.avg)
							})
							.attr('r', 2)
							.attr('fill', 'lightgreen')
							.attr('stroke', 'lightgreen')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_daily.append('text')
									.text(v.avg + "mm")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 2)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						var line_daily_precipitation_min = line_daily_precipitation.append(
							"g")
						line_daily_precipitation_min.append('path')
							.datum(daily.precipitation)
							.attr('fill', 'none')
							.attr('stroke', 'lightblue')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d
									.date))
							}).y(d => {
								return yScale_daily_precipitation(d.min)
							}))

						// 绘制数据坐标圆点
						line_daily_precipitation_min.selectAll('circle').data(daily
								.precipitation)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_daily(d3.timeParse("%Y-%m-%d")(d.date))
							})
							.attr('cy', d => {
								return yScale_daily_precipitation(d.min)
							})
							.attr('r', 2)
							.attr('fill', 'lightblue')
							.attr('stroke', 'lightblue')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_daily.append('text')
									.text(v.min + "mm")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 2)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						line_daily.append("text")
							.attr("x", width / 2 - padding * 4)
							.attr("y", -padding / 2)
							.text("Precipitation(mm)")
							.attr('text-anchor', 'middle')
							.attr('dy', '0.03em')

						var tn = ["date", "sunrise", "sunset", "skycon", "comfort",
							"carWashing",
							"humidity", "ultraviolet", "aqi", "cloudrate", "coldRisk",
							"pm25"
						]
						caiyunapp.append("table").attr("id", "daily").attr("border",
								"1px solid")
							.attr("border-color", "#96D4D4").append("tr").attr("id", "name")
							.selectAll("td").data(tn).enter().append("td").text(d => d)
						var t = caiyunapp.select("table#daily")
							.selectAll("tr").filter((d, i) => {
								return i > 1
							})
							.data(daily.skycon)
							.join("tr");

						t.append("td").text(d => d.date)
						t.data(daily.astro).append('td').text(d => d.sunrise.time)
						t.data(daily.astro).append('td').text(d => d.sunset.time)
						t.data(daily.skycon).append('td').text(d => d.value)
						t.data(daily.comfort).append('td').text(d => d.desc + "[" + d
							.index + "]")
						t.data(daily.carWashing).append('td').text(d => d.desc)
						t.data(daily.humidity).append('td').text(d => "[" + d.min + "][" + d
							.avg +
							"][" + d.max + "]")
						t.data(daily.ultraviolet).append('td').text(d => d.desc + "[" + d
							.index +
							"]")
						t.data(daily.aqi).append('td').text(d => "[" + d.min + "][" + d
							.avg + "][" +
							d.max + "]")
						t.data(daily.cloudrate).append('td').text(d => "[" + d.min + "][" +
							d.avg +
							"][" + d.max + "]")
						t.data(daily.coldRisk).append('td').text(d => d.desc + "[" + d
							.index + "]")
						t.data(daily.pm25).append('td').text(d => "[" + d.min + "][" + d
							.avg +
							"][" + d.max + "]")

						//============================================
						caiyunapp.append("p").text("Hourly Forecast(48h)-小时级预报（48小时）:")
						const svg_hourly = caiyunapp.append('svg').attr('width', width / 2)
							.attr(
								'height', 200);
						// 定义坐标轴
						var xScale_hourly = d3.scaleTime().domain(d3.extent(hourly
								.temperature.map(
									d => d3.timeParse("%Y-%m-%d %H:%M")(d.datetime))))
							.range([0, width /
								2 - padding * 2
							])
						var xAxis_hourly = d3.axisBottom(xScale_hourly).ticks(8);
						var yScale_hourly = d3.scaleLinear().domain([d3.min(hourly
							.temperature, d =>
							d.value), d3.max(hourly.temperature, d => d.value)]).range([
							height -
							padding * 2, 0
						])
						var yAxis_hourly = d3.axisLeft(yScale_hourly)
						// 绘制坐标轴
						svg_hourly.append('g').call(xAxis_hourly).attr('transform',
							'translate(40, ' + (height - padding) + ')')
						svg_hourly.append('g').call(yAxis_hourly).attr('transform',
							'translate(40, ' + padding + ')')
						// 绘制折线
						var line_hourly = svg_hourly.append('g').attr('transform',
							'translate(40, ' + padding + ')')
						var line_hourly_temperature = line_hourly.append("g")
						line_hourly_temperature.append('path')
							.datum(hourly.temperature)
							.attr('fill', 'none')
							.attr('stroke', 'red')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_hourly(d3.timeParse("%Y-%m-%d %H:%M")(
									d
									.datetime))
							}).y(d => {
								return yScale_hourly(d.value)
							}))

						// 绘制数据坐标圆点
						line_hourly_temperature.selectAll('circle').data(hourly.temperature)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_hourly(d3.timeParse("%Y-%m-%d %H:%M")(d
									.datetime))
							})
							.attr('cy', d => {
								return yScale_hourly(d.value)
							})
							.attr('r', 5)
							.attr('fill', 'red')
							.attr('stroke', 'red')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_hourly.append('text')
									.text(v.value + "℃")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 5)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})

						line_hourly.append("text")
							.attr("x", padding)
							.attr("y", -padding / 2)
							.text("Temperature(℃)")
							.attr('text-anchor', 'middle')
							.attr('dy', '0.03em')

						var yScale_hourly_precipitation = d3.scaleLinear().domain([d3.min(
							hourly
							.precipitation, d => d.value), d3.max([d3.max(hourly
							.precipitation, d => d.value), 1])]).range([height -
							padding * 2,
							0
						])
						var yAxis_hourly_precipitation = d3.axisRight(
							yScale_hourly_precipitation)
						// 绘制坐标轴
						svg_hourly.append('g').call(yAxis_hourly_precipitation).attr(
							'transform',
							'translate(' + (width / 2 - padding * 0.8) + ', ' +
							padding + ')')
						// 绘制折线
						var line_hourly_precipitation = svg_hourly.append('g').attr(
							'transform',
							'translate(40, ' + padding + ')').append("g")
						/*var yGrid_daily = d3.axisLeft()
						.scale(yScale_daily_precipitation)
						.tickFormat('')
						.ticks(5)
						.tickSizeInner(-width/2+padding*2 )
						svg_daily.append('g')
						.attr('transform', 'translate(40, '+padding+')')
						.call(yGrid_daily)*/
						//precipitation

						line_hourly_precipitation.append('path')
							.datum(hourly.precipitation)
							.attr('fill', 'none')
							.attr('stroke', 'orange')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x(d => {
								//console.log(d.date)
								return xScale_hourly(d3.timeParse("%Y-%m-%d %H:%M")(
									d
									.datetime))
							}).y(d => {
								return yScale_hourly_precipitation(d.value)
							}))

						// 绘制数据坐标圆点
						line_hourly_precipitation.selectAll('circle').data(hourly
								.precipitation)
							.enter()
							.append('circle')
							.attr('cx', d => {
								return xScale_hourly(d3.timeParse("%Y-%m-%d %H:%M")(d
									.datetime))
							})
							.attr('cy', d => {
								return yScale_hourly_precipitation(d.value)
							})
							.attr('r', 2)
							.attr('fill', 'orange')
							.attr('stroke', 'orange')
							// 定义鼠标移入事件
							.on('mouseover', function(e, v) {
								// 放大坐标圆点
								d3.select(this).attr('r', 7)
								// 在光标上方显示坐标值
								var pos = d3.pointer(e)
								svg_hourly.append('text')
									.text(v.value + "mm")
									.attr('class', 'tooltip')
									.attr('x', pos[0] + 50)
									.attr('y', pos[1] + 20)
									.attr('text-anchor', 'end')
							})
							// 定义鼠标移出事件
							.on('mouseout', function() {
								// 还原坐标圆点
								d3.select(this).attr('r', 2)
								// 移除坐标值提示标签
								d3.select('.tooltip').remove()
							})
						line_hourly.append("text")
							.attr("x", width / 2 - padding * 4)
							.attr("y", -padding / 2)
							.text("Precipitation(mm)")
							.attr('text-anchor', 'middle')
							.attr('dy', '0.03em')

						var tn2 = ["datetime", "Temperature(℃)", "Precipitation(mm)",
							"skycon",
							"humidity", "aqi", "cloudrate", "pm25", "wind/风",
							"press/气压(Pa)"
						]
						caiyunapp.append("table").attr("id", "hourly").attr("border",
								"1px solid")
							.attr("border-color", "#96D4D4").append("tr").attr("id", "name")
							.selectAll("td").data(tn2).enter().append("td").text(d => d)
						var t = caiyunapp.select("table#hourly")
							.selectAll("tr").filter((d, i) => {
								return i > 1
							})
							.data(hourly.skycon)
							.join("tr");

						t.append("td").text(d => d.datetime)
						t.data(hourly.temperature).append('td').text(d => d.value + "℃")
						t.data(hourly.precipitation).append('td').text(d => d.value)
						t.data(hourly.skycon).append('td').text(d => d.value)
						t.data(hourly.humidity).append('td').text(d => d.value)
						t.data(hourly.aqi).append('td').text(d => d.value)
						t.data(hourly.cloudrate).append('td').text(d => d.value)
						t.data(hourly.pm25).append('td').text(d => d.value)
						t.data(hourly.wind).append('td').text(d => "[" + d.speed + "m/s][" +
							d
							.direction + "°]")
						t.data(hourly.pres).append('td').text(d => d.value)

						//======================================
						caiyunapp.append("p").text(
							"Minutely Forecast(1h/2h)-分钟级预报（1小时/2小时）:")
						const svg_minutely = caiyunapp.append('svg').attr('width', width /
							2).attr(
							'height', 200);
						// 定义坐标轴
						var xScale_minutely = d3.scaleLinear().domain([0, 120]).range([0,
							width /
							2 - padding * 2
						])
						var xAxis_minutely = d3.axisBottom(xScale_minutely);
						var yScale_minutely = d3.scaleLinear().domain([d3.min(minutely
							.precipitation_2h), d3.max(minutely
							.precipitation_2h) + 1]).range([
							height - padding * 2, 0
						])
						var yAxis_minutely = d3.axisLeft(yScale_minutely)
						// 绘制坐标轴
						svg_minutely.append('g').call(xAxis_minutely).attr('transform',
							'translate(40, ' + (height - padding) + ')')
						svg_minutely.append('g').call(yAxis_minutely).attr('transform',
							'translate(40, ' + padding + ')')
						svg_minutely.append('text')
							.attr('x', (marginLeft + width / 2 + marginRight) / 2)
							.attr('y', marginTop / 2)
							.attr('dy', '0.33em')
							.text(minutely.datasource + ":" + minutely.description)
							.attr('text-anchor', 'middle')
						// 绘制折线
						var line_minutely = svg_minutely.append('g').attr('transform',
							'translate(40, ' + padding + ')')
						line_minutely.append('path')
							.datum(minutely.precipitation)
							.attr('fill', 'none')
							.attr('stroke', 'red')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x((d, i) => {
								return xScale_minutely(i)
							}).y(d => {
								return yScale_minutely(d)
							}))
						line_minutely.append('path')
							.datum(minutely.precipitation_2h)
							.attr('fill', 'none')
							.attr('stroke', 'black')
							.attr('stroke-width', 1)
							.attr('d', d3.line().x((d, i) => {
								return xScale_minutely(i)
							}).y(d => {
								return yScale_minutely(d)
							}))
						const yGrid = d3.axisLeft()
							.scale(yScale_minutely)
							.tickFormat('')
							.ticks(5)
							.tickSizeInner(-width / 2)
						const xGrid = d3.axisBottom()
							.scale(xScale_minutely)
							.tickFormat("")
							.ticks(12)
							.tickSizeInner(-height)
						svg_minutely.append('g')
							.attr('transform', 'translate(40, ' + padding + ')')
							.call(yGrid)
						/*svg_minutely.append('g')
						.attr('transform', 'translate(40, '+(height-padding)+')')
						.call(xGrid)*/
						svg_minutely.append("text")
							.attr('x', width / 2 - padding / 2)
							.attr('y', height - padding)
							.attr('dy', '0.33em')
							.style("text-anchor", "middle")
							.text("min");

					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					/*错误信息处理*/
					caiyunapp.append("text").text("网络连接异常或浏览器已阻止载入混合活动内容（请用http协议访问）" +
						textStatus);
				}
			});
			//d3 test
			//const dawData = await d3.json(WeatherapiURL)
			//console.log(dawData)

		});
	}
}


//==================wthrcdn.etouch.cn====================
let cityname = "昆明";

$("#submit").on('click', function(e) {
	if ($('input[name="cityname"]').val() == '') {
		alert("未输入待查询城市名！");
	} else {
		cityname = $('input[name="cityname"]').val();
		$.cookie('cityname', cityname);
		getWeather();
	}
});

function getWeather() {
	var cityname = $('input[name="cityname"]').val();
	if (cityname == '') {
		cityname = $.cookie('cityname');
		if (typeof(cityname) != "undefined") {
			$("#cityname").text = cityname;
			$('input[name="cityname"]').attr('value', cityname);
		} else {
			$("#cityname").text = '昆明';
			cityname = '昆明';
			$('input[name="cityname"]').attr('value', cityname);
		}

	}
	cityname = encodeURI(cityname);
	var url = "http://wthrcdn.etouch.cn/weather_mini?city=" + cityname;
	//console.log(url)
	$.ajax({
		url: url,
		async: false,
		method: "GET",
		crossDomain: true,
		success: function(dataString) {
			//    $("#test").get(0).innerHTML = dataString;
			//console.log(dataString)
			/* {"data":{"yesterday":{"date":"27日星期五","high":"高温 24℃","fx":"南风","low":"低温 17℃","fl":"<![CDATA[2级]]>","type":"中雨"},"city":"昆明","forecast":[{"date":"28日星期六","high":"高温 26℃","fengli":"<![CDATA[2级]]>","low":"低温 16℃","fengxiang":"西南风","type":"小雨"},{"date":"29日星期天","high":"高温 25℃","fengli":"<![CDATA[2级]]>","low":"低温 15℃","fengxiang":"南风","type":"多云"},{"date":"30日星期一","high":"高温 23℃","fengli":"<![CDATA[2级]]>","low":"低温 15℃","fengxiang":"东风","type":"中雨"},{"date":"31日星期二","high":"高温 24℃","fengli":"<![CDATA[2级]]>","low":"低温 16℃","fengxiang":"东南风","type":"小雨"},{"date":"1日星期三","high":"高温 25℃","fengli":"<![CDATA[2级]]>","low":"低温 17℃","fengxiang":"南风","type":"中雨"}],"ganmao":"感冒易发期，外出请适当调整衣物，注意补充水分。","wendu":"26"},"status":1000,"desc":"OK"}*/
			var obj = JSON.parse(dataString);
			//console.log(obj)
			if (obj.status == 1000) {
				$("#test").text(setTime());

				function setTime() {
					var date = new Date();
					var HH = date.getHours(),
						MM = date.getMinutes(),
						SS = date.getSeconds(),
						date = date.getDate();
					if (SS < 10) {
						SS = "0" + SS
					}
					if (MM < 10) {
						MM = "0" + MM;
					}
					if (HH < 10) {
						HH = "0" + HH;
					}
					$("#test").text("最近更新时间 " + HH + ":" + MM + ":" + SS);
				}
				setTime();
				$("#test2").text('');

				var div = document.querySelector("#test2");

				$("#test1").get(0).innerHTML = "<span>" + obj.data.city +
					"</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>" + obj.data.wendu +
					"℃</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>" + obj.data.ganmao + "</span>";
				var arrh = [],
					arrl = [],
					xdate = [],
					feng = [],
					type = [];
				var smg = obj.data.forecast;
				for (var s of smg) {
					xdate.push(s.date);
					arrh.push(parseInt(s.high.replace(/[^\d]/g, '')));
					arrl.push(parseInt(s.low.replace(/[^\d]/g, '')));
					feng.push(s.fengxiang + '' + s.fengli.replace(/[^\d]/g, '') + '级');
					type.push(s.type);
				}
				//echarts
				//3.初始化实例对象 echarts.init(dom容器)
				var myChart = echarts.init(document.querySelector(".box"), null, {
					width: 600,
					height: 300
				});
				window.onresize = function() {
					myChart.resize({
						width: $("body").width(),
						height: 300
					});
					console.log($("body").width())
				};
				//4.指定配置项和数据
				var option = {
					grid: {
						show: true,
						backgroundColor: 'transparent',
						opacity: 0.3,
						borderWidth: '0'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						show: false
					},
					title: {
						text: obj.data.city
					},
					toolbox: {
						feature: {
							saveAsImage: {
								title: '保存为图片', //标题可自行调整
								type: 'png', //下载为png格式
							}
						}
					},
					xAxis: [
						// 日期
						{
							type: 'category',
							boundaryGap: true,

							zlevel: 100,
							axisLine: {
								show: true
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								interval: 0,
								formatter: [
									'{a|{value}}'
								].join('\n'),
								rich: {
									a: {
										// color: 'white',
										//fontSize: 18
									}
								}
							},
							nameTextStyle: {

							},
							splitLine: {
								show: false
							},
							data: xdate
						},

						{
							type: 'category',
							boundaryGap: false,
							position: 'top',
							offset: '30',

							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								interval: 0,
								formatter: function(value, index) {
									return '{' + index + '| }\n{b|' + value + '}'
								},
								rich: {

								}
							},
							nameTextStyle: {
								fontWeight: 'bold',
								fontSize: 19
							},
							splitLine: {
								show: false
							},
							// data: this.weatherdata.weather
							data: type
						},

						{
							type: 'category',
							boundaryGap: false,


							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								interval: 0,
								formatter: function(value, index) {
									return '{' + index + '| }\n{b|' + value + '}'
								},
								rich: {

								}
							},
							nameTextStyle: {
								fontWeight: 'bold',
								fontSize: 19
							},
							splitLine: {
								show: false
							},
							// data: this.weatherdata.weather
							data: feng
						}
					],
					yAxis: {
						axisLine: {
							show: false
						},
						axisLabel: {
							show: false
						}
					},
					series: [{
							name: '最高气温',
							type: 'line',
							data: arrh,
							label: {
								show: true,
								position: 'bottom',
								// color: 'white',
								formatter: '{c} °C'
							},
						},
						{
							name: '最低气温',
							type: 'line',
							data: arrl,
							label: {
								show: true,
								position: 'bottom',
								// color: 'white',
								formatter: '{c} °C'
							},
						}
					]
				};
				//5.将配置项设置给echarts实例对象，使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			} else {
				alert("待查询城市不可用");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			/*错误信息处理*/
			$("#test").text("网络连接异常或浏览器已阻止载入混合活动内容（请用http协议访问）");
		}
	});
}