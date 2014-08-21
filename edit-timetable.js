// editing the timetable

$(function () {
	if (!window.localStorage) {
		$(".container").prepend($('<div class="alert alert-warning" role="alert">This browser is unsupported. Timetable functionality is unavailable.</div>').alert());
		return false;
	}

	if (localStorage.useTimetable) {
		document.getElementById("check-usetimetable").checked = true;
	} else {
		document.getElementById("check-usetimetable").checked = false;
		disablePage();
	}

	$("#check-usetimetable").click(toggleUseTimetable);

	$("#export").on("show.bs.modal", doExport);
	$("#add-subject").on("show.bs.modal", onOpenAddSubject);
	$("#edit-subject").on("show.bs.modal", onOpenEditSubject);
	$("#edit-period").on("show.bs.modal", onOpenEditPeriod);

	for (var p = 0; p < 6; p++) {
		var tds = $("#tt-p" + p);
		for (var d = 1; d < 6; d++) {
			var td = tds[d];
			td.on("click", );
		}
	}
});

// disable everything (besides #check-usetimetable)
function disablePage() {
	// ...
}

function toggleUseTimetable() {
	if (localStorage.useTimetable) {
		localStorage.removeItem("useTimetable");
		disablePage();
	} else {
		localStorage.useTimetable = true;
	}
}

function doImport() {
	var text = document.getElementById("text-import").value;
	var obj;
	try {
		obj = JSON.parse(text);
	} catch (ex) {}

	if (obj && (obj.classes || obj.days)) {
		if (obj.classes) {
			localStorage.classes = JSON.stringify(obj.classes);
		}
		if (obj.days) {
			localStorage.days = JSON.stringify(obj.days);
		}
		alert("Done!");
	} else {
		alert("That doesn't look like timetable data!");
	}
}

function doExport() {
	$("#text-export").text(JSON.stringify({
		classes: localStorage.classes && JSON.parse(localStorage.classes),
		days: localStorage.days && JSON.parse(localStorage.days)
	}));
}

function onOpenAddSubject() {
	//
}

function onOpenEditSubject() {
	//
}

function onOpenEditPeriod() {
	//
}

function doAddSubject() {
	var subjects = localStorage.classes ? JSON.parse(localStorage.classes) : [];
	subjects.push({
		subjectName: document.getElementById("input-add-subject-name").value,
		room: document.getElementById("input-add-subject-room").value
	});
	localStorage.classes = JSON.stringify(subjects);
	alert("Done!");
}

function doDelSubject() {
	//
}

function doEditSubject() {
	//
}

function savePeriod() {
	var day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf($("#edit-period-day").text());
	if (day === -1) {
		console.error("unknown day in #edit-period-day text");
		return;
	}

	var pNum = $("#edit-period-num").text() >>> 0;

	var days = localStorage.days ? JSON.parse(localStorage.days) : [];
	var periods = days[day] || (days[day] = []);
	var period = periods[pNum] || (periods[pNum] = {});

	period.classId = document.getElementById("select-period-subject").value;
	var subject = JSON.parse(localStorage.classes)[period.classId];
	var room = document.getElementById("input-period-room").value;
	if (room !== subject.room) {
		period.room = room;
	}

	localStorage.days = JSON.stringify(days);
	alert("Done!");
}

function doReset() {
	if (confirm("Are you sure you wish to reset your timetable data?")) {
		localStorage.classes = "[]";
		localStorage.days = "[]";
		alert("Done!");
	}
}
