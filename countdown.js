// gotta initialise those bells

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
	"hours": bells[0].hours,
	"minutes": [25, 35, 55, 15, 35, 50, 10, 25, 40, 50],
	"desc": bells[0].desc
});

// halp what am I even doing

function getEvent(day, eventNo) {
	var dayEvents = bells[day];
	return {
		"day": day,
		"hour": dayEvents.hours[eventNo],
		"minute": dayEvents.minutes[eventNo],
		"desc": dayEvents.desc[eventNo]
	};
}

function getEventDate(ev) {
	var evDate = new Date();
	var weekday = evDate.getDay();

	if (weekday === 6) {
		// Saturday today, wrap to Monday
		evDate.setDate(evDate.getDate() + 2);
	} else if (weekday === ev.day) {
		// event is tomorrow
		evDate.setDate(evDate.getDate() + 1);
	}

	evDate.setHours(ev.hour);
	evDate.setMinutes(ev.minute);
	evDate.setSeconds(0);
	return evDate;
}

function getNextEvent() {
	var now = new Date();
	var day = now.getDay() - 1;
	var nowH = now.getHours(), nowM = now.getMinutes();
	var dayEvents = bells[day], eventNo = 0;

	if (day === -1 || day === 5) {
		// weekend, wrap around to Monday
		day = 0;
	} else if (nowH > dayEvents.hours[9] || (nowH == dayEvents.hours[9] && nowM > dayEvents.minutes[9])) {
		// past the school day, wrap to next morning
		day++;
	} else {
		// calculate next event
		while (eventNo < 9 && (nowH > dayEvents.hours[eventNo] || (nowH == dayEvents.hours[eventNo] && nowM > dayEvents.minutes[eventNo]))) {
			eventNo++;
		}
	}

	return getEvent(day, eventNo);
}

// https://youtu.be/9jK-NcRmVcw
function theFinalCountdown() {
	var ev = getNextEvent();
	$("#bell-countdown").countdown({
		until: getEventDate(ev),
		format: "dhMS",
		compact: true,
		significant: 2,
		onExpiry: function () {
			$("#bell-countdown").text("... about now.");
			setTimeout(theFinalCountdown, 60*1000);
		},
		// oh god what am I doing
		layout: "{d<}{dn}d {d>}{h<}{hn}h {h>}{mn}min {sn}s"
	});
	$("#bell-descript").text(ev.desc);
}

$(theFinalCountdown);

// much shim, wow

if (typeof Date.now !== "function") {
	Date.now = function now() {
		return +new Date();
	}
}
