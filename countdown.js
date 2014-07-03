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
	return new BellEvent(day, dayEvents.hours[eventNo], dayEvents.minutes[eventNo], dayEvents.desc[eventNo]);
}

function BellEvent(day, hour, minute, desc) {
	this.day = day;
	this.hour = hour;
	this.minute = minute;

	if (typeof desc === "number") {
		desc = "Period " + desc;
	}

	this.desc = desc;
}

BellEvent.prototype.getDate = function getDate() {
	var evDate = new Date();
	var weekday = evDate.getDay();

	if (weekday === 6) {
		// Saturday today, wrap to Monday
		evDate.setDate(evDate.getDate() + 2);
	} else if (weekday === this.day) {
		// event is tomorrow
		evDate.setDate(evDate.getDate() + 1);
	}

	evDate.setHours(this.hour);
	evDate.setMinutes(this.minute);
	evDate.setSeconds(0);
	return evDate;
};

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

function updateCountdown(event) {
	var format = "%Mmin %Ss";

	if (event.offset.totalDays) {
		// some days left, show days *and* hours
		format = "%Dd %Hh " + format;
	} else if (event.offset.hours) {
		// some hours left, show hours
		format = "%Hh " + format;
	}

	$(this).text(event.strftime(format));
}

// https://youtu.be/9jK-NcRmVcw
function theFinalCountdown() {
	var ev = getNextEvent();

	$("#bell-countdown").countdown(ev.getDate())
		.on("update.countdown", updateCountdown)
		.on("finish.countdown", function () {
			$("#bell-countdown").text("... about now.");
			// set the new countdown after a minute
			setTimeout(theFinalCountdown, 60*1000);
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
