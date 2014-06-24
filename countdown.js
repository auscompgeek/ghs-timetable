// INITIALISE THE GODDAMN BELLS

var bells = [
// Monday
{
	"hours":   [ 8,  8,  9, 10, 11, 11, 13, 13, 13, 14],
	"minutes": [25, 35, 55, 10, 30, 45,  0, 20, 35, 50],
	"desc": ["House Group", 1, "Recess 1", 2, "Recess 2", 3, "Lunch 1", "Lunch 2", 4, "School Ends"]
}];

bells.push(bells[0]);  // Tuesday

// Wednesday
bells.push({
	"hours":   [ 8,  8,  9, 10, 10, 10, 12, 12, 12, 14],
	"minutes": [25, 35, 50, 25, 40, 55,  5, 25, 45, 30],
	"desc": ["House Group", 1, 2, "Recess", "Assembly", 3, "Lunch 1", "Lunch 2", "Sport", "School Ends"]
});

bells.push(bells[0]);  // Thursday

// Friday
bells.push({
	"hours":   [ 8,  8,  9, 10, 11, 11, 13, 13, 13, 14],
	"minutes": [25, 35, 55, 15, 35, 50, 10, 25, 40, 50],
	"desc": ["House Group", 1, "Recess 1", 2, "Recess 2", 3, "Lunch 1", "Lunch 2", 4, "School Ends"]
});

// HALP WHAT AM I DOING

function getEvent(day, eventNo) {
	return {
		"day": day,
		"hour": bells[day].hours[eventNo],
		"minute": bells[day].minutes[eventNo],
		"desc": bells[day].desc[eventNo]
	};
}

function getEventDate(ev) {
	var evDate = new Date();
	var weekday = evDate.getDay();

	if (weekday === 6) {
		// Saturday today, assume event is Monday
		evDate.setDate(evDate.getDate() + 2);
	} else if (weekday === 0) {
		// Sunday today, assume event is Monday
		evDate.setDate(evDate.getDate() + 1);
	} else if (weekday === ev.day) {
		// event is actually tomorrow
		evDate.setDate(evDate.getDate() + 1);
	}

	evDate.setHours(ev.hour);
	evDate.setMinutes(ev.minute);
	evDate.setSeconds(0);
	return evDate;
}

function getSecondsUntilDate(date) {
	return ((date - Date.now())/1000)|0;
}

function getSecondsUntilEvent(ev) {
	return getSecondsUntilDate(getEventDate(ev));
}

function secsToHMS(secs) {
	var s = secs % 60;
	var m = (secs%3600 - s)/60;
	var h = secs / 3600;
	return [h|0, m|0, s];
}

function displayTimeUntilEvent(ev) {
	var hms = secsToHMS(getSecondsUntilEvent(ev));
	var h = hms[0], m = hms[1], s = hms[2];
	var clock = h + "h " + m + "min " + s + "s";

	document.getElementById("bell-countdown").textContent = clock;
}

function displayEventDesc(ev) {
	var desc = ev.desc;

	if (typeof desc === "number") {
		desc = "Period " + desc;
	}
	
	document.getElementById("bell-descript").textContent = desc;
}

function getNextEvent() {
	var day = new Date().getDay();
	if (day === 0 || day === 6) {
		// weekend, wrap around to Monday
		day = 0;
	} else {
		// weekday
		// my day index starts with Monday, silly me
		day--;
		// TODO check for end of day
	}

	var dayEvents = bells[day], nextDayEvents = bells[day+1], eventNo = 0;
	// TODO
	day++;
	return getEvent(day, eventNo);
}

function displayEvent(ev) {
	displayTimeUntilEvent(ev);
	displayEventDesc(ev);
}

// https://youtu.be/9jK-NcRmVcw
function theFinalCountdown() {
	var ev = getNextEvent();
	displayEvent(ev);
}

var tick = setInterval(theFinalCountdown, 1000);

// much shim, wow

if (typeof Date.now !== "function") {
	Date.now = function now() {
		return +new Date();
	}
}
