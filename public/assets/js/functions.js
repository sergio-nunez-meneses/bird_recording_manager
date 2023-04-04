/**
 *
 * @param {string} type
 * @param {string} name
 * @returns {Promise<Response>}
 */
export function fetchResource(type, name = "") {
	const isApi = type === "api";
	const url = isApi ? `https://xeno-canto.org/api/2/recordings?query=${name}+cnt:france` : `../templates/${name}.html`;

	return fetch(url)
			.then((response) => {
				if (isApi) {
					return response.json();
				}
				return response.text();
			})
			.then((result) => {
				return result;
			})
}

export function hydrateTemplate(template, data) {
	let hydratedTemplate = "";

	if (isObject(data)) {
		hydratedTemplate = templateReplaceAll(template, data);
	}
	else {
		for (const obj of data) {
			hydratedTemplate += templateReplaceAll(template, obj);
		}
	}
	return hydratedTemplate;
}

function templateReplaceAll(template, data) {
	for (const [key, value] of Object.entries(data)) {
		template = template.replaceAll(`{{ ${key} }}`, value);
	}
	return template;
}

function isObject(data) {
	return data && typeof data === 'object' && data.constructor === Object;
}
