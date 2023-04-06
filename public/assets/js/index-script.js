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
async function getStoredRecordings(birdName) {
	const data = new FormData();
	data.append("action", "get_recordings");
	data.append("bird_name", birdName);

	return await ajax("post", "/ajax", data);
}

function setFileIcon(recordings, fileName) {
	if (recordings.find(recording => recording["file_name"] === fileName) !== undefined) {
		return 'class="stored-icon" src="/assets/img/icons/star.svg"';
	}
	return 'class="hidden"';
}

async function getBirdRecordings(birdName) {
	const recordings = await ajax("get", `https://xeno-canto.org/api/2/recordings?query=${birdName}+cnt:france`);
	const bird = {};

	if (parseInt(recordings["numRecordings"]) > 0) {
		const stored = await getStoredRecordings(birdName);
		bird["recordings"] = [];

		for (const recording of recordings["recordings"]) {
			const fileName = recording["file-name"];
			const fileUrl = recording["sono"]["small"].split("ffts")[0] + encodeURIComponent(fileName);
			let fileUrls = {
				"fileUrl"    : `https:${fileUrl}`,
				"downloadUrl": recording["file"],
				"fileIcon"   : setFileIcon(stored["recordings"], fileName),
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

function objectIsEmpty(obj) {
	return Object.keys(obj).length === 0;
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
				recording => document.querySelector(".bird-recordings").appendChild(recording),
		);
	}
})
