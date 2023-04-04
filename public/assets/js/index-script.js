// ============================================================================
//  Imports
// ============================================================================
import {ajax, hydrateTemplate} from './functions.js';

// ============================================================================
//  Variables
// ============================================================================

// ============================================================================
//  Functions
// ============================================================================
async function getBirdRecordings(birdName) {
	const data = await ajax("get", `https://xeno-canto.org/api/2/recordings?query=${birdName}+cnt:france`);
	const bird = {};

	if (parseInt(data["numRecordings"]) > 0) {
		bird["recordings"] = [];

		for (const recording of data["recordings"]) {
			const fileUrl = recording["sono"]["small"].split("ffts")[0] + encodeURIComponent(recording["file-name"]);
			const fileUrls = {
				"fileUrl"    : `https:${fileUrl}`,
				"downloadUrl": recording["file"],
			};

			bird["recordings"].push(fileUrls);
		}
	}
	return bird;
}

function toTitleCase(str) {
	return str.split(" ").map(word => {
		return word[0].toUpperCase() + word.slice(1).toLowerCase();
	}).join(" ");
}

function strToDom(str) {
	return new DOMParser().parseFromString(str, "text/html").body;
}

// ============================================================================
//  Code to execute
// ============================================================================

// ============================================================================
//  EventListeners
// ============================================================================
document.querySelector('[name="search-button"]').addEventListener("click", async(e) => {
	e.preventDefault();

	const birdName = document.querySelector('[name="bird-name"]').value;
	const birdRecordings = await getBirdRecordings(birdName);

	if (Object.keys(birdRecordings).length > 0) {
		const birdTemplate = await ajax("get", "../templates/bird.html")
		const recordingTemplate = await ajax("get", "../templates/recording.html")
		const hydratedBirdTemplate = hydrateTemplate(birdTemplate, {"birdGenName": toTitleCase(birdName)});
		const hydratedRecordingTemplate = hydrateTemplate(recordingTemplate, birdRecordings["recordings"]);

		if (document.querySelector(".bird-container")) {
			document.querySelector(".bird-container").remove();
		}

		document.querySelector(".main-container").appendChild(strToDom(hydratedBirdTemplate).firstElementChild);
		Array.from(strToDom(hydratedRecordingTemplate).children).forEach(
				recording => document.querySelector(".bird-recordings").appendChild(recording)
		);
	}
})
