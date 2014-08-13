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
	var obj = JSON.parse($("#text-import").text());
	if (obj.classes) {
		localStorage.classes = JSON.stringify(this.text);
	}
	if (obj.days) {
		localStorage.days = JSON.stringify(this.text);
	}
}

function doExport() {
	$("#text-export").text(JSON.stringify({
		classes: JSON.parse(localStorage.classes),
		days: JSON.parse(localStorage.days)
	}));
}
