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

		Array.from(document.querySelectorAll(".download-icon")).map(async(downloadIcon) => {
			downloadIcon.addEventListener("click", async(e) => {
				await postBirdRecording(e);
			})
		})

		// Automatic test
		document.querySelector(".download-icon").dispatchEvent(new Event("click"));
	}
}

async function postBirdRecording(e) {
	e.preventDefault();

	clearErrorContainer();

	const icon        = e.target;
	const downloadUrl = icon.nextElementSibling.value;
	const audio       = icon.parentElement.lastElementChild;
	const fileName    = audio.src.split("/").pop();
	const data        = new FormData();

	data.append("action", "store_recording");
	data.append("bird_name", enteredBirdName.value);
	data.append("file_name", fileName);

	const response = await ajax("post", "/ajax", data);

	if (response["status_code"] !== 201) {
		displayErrors(response["response_message"]);
	}
	else {
		downloadRecording(downloadUrl);

		icon.className = icon.src = "";

		if (!icon.classList.contains("hidden")) {
			icon.classList.add("hidden")
		}
	}
}

async function getBirdRecordings(birdName) {
	const apiRecordings = await ajax("get", `https://xeno-canto.org/api/2/recordings?query=${birdName}+cnt:france`);
	const bird          = {};

	if (parseInt(apiRecordings["numRecordings"]) > 0) {
		let storedRecordings = await getStoredRecordings(birdName);
		bird["recordings"]   = [];

		for (const recording of apiRecordings["recordings"]) {
			const fileName = encodeURIComponent(recording["file-name"]);
			const fileUrl  = recording["sono"]["small"].split("ffts")[0] + fileName;
			const fileUrls = {
				"fileUrl"    : `https:${fileUrl}`,
				"downloadUrl": !isRecordingStored(storedRecordings["recordings"], fileName) ?
						`<input type="hidden" name="download-url" value="${recording["file"]}">` : "",
				"fileIcon"   : !isRecordingStored(storedRecordings["recordings"], fileName) ?
						'class="download-icon" src="/assets/img/icons/download.svg"' : 'class="hidden"',
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

function isRecordingStored(recordings, fileName) {
	return recordings.find(recording => recording["file_name"] === fileName) !== undefined;
}

function toTitleCase(str) {
	return str.split(" ").map(word => {
		return word[0].toUpperCase() + word.slice(1).toLowerCase();
	}).join(" ");
}

function strToDom(str) {
	return new DOMParser().parseFromString(str, "text/html").body;
}

function downloadRecording(url) {
	const link = document.createElement("a");
	link.href  = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
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
