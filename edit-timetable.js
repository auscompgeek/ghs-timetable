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
