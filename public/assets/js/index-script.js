// ============================================================================
//  Imports
// ============================================================================
import {ajax, hydrateTemplate} from './functions.js';

// ============================================================================
//  Variables
// ============================================================================
const enteredBirdName = document.querySelector('[name="bird-name"]');
const errorContainer  = document.querySelector(".error-container");

// ============================================================================
//  Functions
// ============================================================================
async function displayBirdRecordings(e) {
	e.preventDefault();

	clearErrorContainer();

	const birdName       = enteredBirdName.value;
	const birdRecordings = await getBirdRecordings(birdName);

	if (Object.keys(birdRecordings).length > 0) {
		const birdTemplate              = await ajax("get", "../templates/bird.html")
		const recordingTemplate         = await ajax("get", "../templates/recording.html")
		const hydratedBirdTemplate      = hydrateTemplate(birdTemplate, {"birdGenName": toTitleCase(birdName)});
		const hydratedRecordingTemplate = hydrateTemplate(recordingTemplate, birdRecordings["recordings"]);

		if (document.querySelector(".bird-container")) {
			document.querySelector(".bird-container").remove();
		}

		document.querySelector(".main-container").appendChild(strToDom(hydratedBirdTemplate).firstElementChild);
		Array.from(strToDom(hydratedRecordingTemplate).children).forEach(
				recording => document.querySelector(".bird-recordings").appendChild(recording),
		);

		Array.from(document.querySelectorAll(".download-link")).map(async(link) => {
			link.addEventListener("click", async(e) => {
				await postBirdRecording(e);
			})
		})

		// Automatic test
		document.querySelector(".download-link").dispatchEvent(new Event("click"));
	}
}

async function postBirdRecording(e) {
	e.preventDefault();

	clearErrorContainer();

	const audio    = e.target.previousElementSibling.lastElementChild;
	const fileName = audio.src.split("/").pop();
	const data     = new FormData();

	data.append("action", "store_recording");
	data.append("bird_name", enteredBirdName.value);
	data.append("file_name", fileName);

	const response = await ajax("post", "/ajax", data);

	if (response["status_code"] !== 201) {
		displayErrors(response["response_message"]);
	}
	else {
		const icon     = audio.previousElementSibling;
		icon.className = "download-icon";
		icon.src       = "/assets/img/icons/download.svg";

		if (icon.classList.contains("hidden")) {
			icon.classList.remove("hidden")
		}
	}
}

async function getBirdRecordings(birdName) {
	const apiRecordings = await ajax("get", `https://xeno-canto.org/api/2/recordings?query=${birdName}+cnt:france`);
	const bird          = {};

	if (parseInt(apiRecordings["numRecordings"]) > 0) {
		const stored       = await getStoredRecordings(birdName);
		bird["recordings"] = [];

		for (const recording of apiRecordings["recordings"]) {
			const fileName = encodeURIComponent(recording["file-name"]);
			const fileUrl  = recording["sono"]["small"].split("ffts")[0] + fileName;
			let fileUrls   = {
				"fileUrl"    : `https:${fileUrl}`,
				"downloadUrl": recording["file"],
				"fileIcon"   : setFileIcon(stored["recordings"], fileName),
			};

			bird["recordings"].push(fileUrls);
		}
	}
	return bird;
}

async function getStoredRecordings(birdName) {
	const data = new FormData();
	data.append("action", "get_recordings");
	data.append("bird_name", birdName);

	return await ajax("post", "/ajax", data);
}

function setFileIcon(recordings, fileName) {
	if (recordings.find(recording => recording["file_name"] === fileName) === undefined) {
		return 'class="download-icon" src="/assets/img/icons/download.svg"';
	}
	return 'class="hidden"';
}

function toTitleCase(str) {
	return str.split(" ").map(word => {
		return word[0].toUpperCase() + word.slice(1).toLowerCase();
	}).join(" ");
}

function strToDom(str) {
	return new DOMParser().parseFromString(str, "text/html").body;
}

function displayErrors(errorMessages) {
	const list = document.createElement("ul");
	for (const errorMessage of errorMessages) {
		const item     = document.createElement("li");
		item.innerText = errorMessage;
		list.appendChild(item);
	}
	errorContainer.appendChild(list);

	if (errorContainer.classList.contains("hidden")) {
		errorContainer.classList.remove("hidden");
	}
}

function clearErrorContainer() {
	errorContainer.className = "hidden";
	errorContainer.innerHTML = "";
}

// ============================================================================
//  Code to execute
// ============================================================================

// ============================================================================
//  EventListeners
// ============================================================================
document.querySelector('[name="search-button"]').addEventListener("click", async(e) => {
	await displayBirdRecordings(e);
});

// Automatic test
document.addEventListener("DOMContentLoaded", () => {
	document.querySelector('[name="search-button"]').dispatchEvent(new Event("click"));
});
