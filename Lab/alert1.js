var secondsleft, m, h, pretty;
var inter;
var clocktype;
function pause() {
	var p = document.getElementById("pause");
	if (p.innerHTML == "Pause") {
		clearInterval(inter);
		p.innerHTML = "Continue";
	} else {
		inter = setInterval("update()",1000);
		p.innerHTML = "Pause";
	}
}
function addminute() {
	secondsleft += 60;
	updatedisplay();
}
function subminute() {
	secondsleft -= Math.min(60, secondsleft);
	updatedisplay();	
}
function startTimer(mins,type) {
	clocktype = type; // 0 for countdown, 1 for stopwatch
	secondsleft = mins*60;
	clearInterval(inter);
	updatedisplay();
	inter = setInterval("update()",1000);
}
function updatedisplay() {
	document.getElementById("clock").innerHTML = prettyTime(secondsleft);
	document.title = prettyTime(secondsleft);
}
function update() {
	if (clocktype == 0) {
		if (secondsleft > 0) {secondsleft -=  1} else {onTimeout()};
	} else {
		secondsleft += 1;
	}
	updatedisplay();	
}
function prettyTime(s) {
	m = Math.floor(s/60);
	if (m >= 60) {
		h = Math.floor(m/60);
		pretty = pre_z(h) + ":" + pre_z(m % 60) + ":" + pre_z(s % 60);
		} else {
		pretty = m + ":" + pre_z(s % 60);	
	}
	return pretty;
}
function pre_z(x) {
	return (x < 10) ? "0" + x : x;
}
function onTimeout() {
	pause();
	alert("Time's up!");
}