// constants and stuff

var NEW_YEAR = 0,
	TERM_1 = 1,
	HOLIDAYS_AUTUMN = 2,
	TERM_2 = 3,
	HOLIDAYS_WINTER = 4,
	TERM_3 = 5,
	HOLIDAYS_SPRING = 6,
	TERM_4 = 7,
	CHRISTMAS = 8;

var SOME_TERM = -1;  // not sure about term dates

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

function BellEvent(day, eventNo) {
	var dayEvents;
	if (day.constructor === Date) {
		dayEvents = bells[day.getDay() - 1];
	} else {
		dayEvents = bells[day];
	}

	this.day = day;
	this.hour = dayEvents.hours[eventNo];
	this.minute = dayEvents.minutes[eventNo];
	this.desc = dayEvents.desc[eventNo];

	if (typeof this.desc === "number") {
		this.desc = "Period " + this.desc;
	} else if (day.constructor === Date) {
		this.holidays = true;
	}
}

BellEvent.prototype.getDate = function getDate() {
	var date;
	if (this.day.constructor === Date) {
		date = new Date(this.day);
	} else {
		date = new Date();
		var weekday = date.getDay();

		if (weekday === 6) {
			// Saturday today, wrap to Monday
			date.setDate(date.getDate() + 2);
		} else if (weekday === this.day) {
			// event is tomorrow
			date.setDate(date.getDate() + 1);
		}
	}

	date.setHours(this.hour);
	date.setMinutes(this.minute);
	date.setSeconds(secsOffset);
	return date;
};

BellEvent.getNext = function getNext() {
	var now = new Date();
	var term = getTerm(now);
	if (!(term & 1)) {
		// holidays, yay
		return new this(terms[term], 0);
	}

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

	return new this(day, eventNo);
}

function updateCountdown(event) {
	var format = "%-Mm %-Ss";

	if (event.offset.totalDays) {
		// some days left, show days *and* hours
		format = "%-Dd %-Hh " + format;
	} else if (event.offset.hours) {
		// some hours left, show hours
		format = "%-Hh " + format;
	}

	$(this).text(event.strftime(format));
}

function finishCountdown() {
	$(this).text("... about now.");
	// set the new countdown after a minute
	setTimeout(theFinalCountdown, 60*1000);
}

// https://youtu.be/9jK-NcRmVcw
function theFinalCountdown() {
	var ev = BellEvent.getNext();

	$("#bell-countdown").countdown(ev.getDate())
	.on("update.countdown", updateCountdown)
	.on("finish.countdown", finishCountdown);

	$("#bell-descript").text(ev.desc);
}

// school computers don't even know what time it is

var secsOffset = 0;

$.ajax({
	url: "http://vovo.id.au/scripts/time.php",
	async: true,
	dataType: "text",
	success: function (data) {
		secsOffset = data - (Date.now()/1000>>>0);
	}
});

// oh god holidays

function parseTerms(data) {
	var termDates = data.results.termDates;
	window.terms = [];
	for (var i = 1, term; term = termDates[i]; i++) {
		// we only care for students in the eastern division
		if (term.title.contains(" for students (Eastern ")) {
			terms.push(new Date(term.start));
			var end = new Date(term.end);
			var endEvents = bells[end.getDay() - 1];
			end.setHours(endEvents.hours[9]);
			end.setMinutes(endEvents.minutes[9]);
			terms.push(end);
		}
	}
}

function getTerm(date) {
	if (!window.terms) {
		// we have no idea when the terms are, bail
		return SOME_TERM;
	}

	var time = +date;
	for (var i = 0; i < 8; i++) {
		if (time < terms[i]) {
			return i;
		}
	}
	return CHRISTMAS;
}

$.getJSON("https://www.kimonolabs.com/api/8puk29vu?apikey=CynVJv6skGTKh5o5Q2CDEmWo1ix62b75", parseTerms)
	.always(theFinalCountdown);

// much shim, wow
// thank you based MDN
if (typeof String.prototype.contains !== "function") {
	String.prototype.contains = function contains() {
		return String.prototype.indexOf.apply(this, arguments) !== -1;
	}
}

if (typeof Date.now !== "function") {
	Date.now = function now() {
		return +new Date();
	}
}
