/**
 *
 * @param {string} method
 * @param {string} url
 * @param {FormData} data
 * @returns {Promise<Response>}
 */
export function ajax(method, url, data = null) {
	const payload = {method: method}
	const templateUrlParts = ["templates", "html"];
	const isTemplate = Array.from(new Set(templateUrlParts.map(str => url.includes(str))));

	if (data !== null) {
		payload["body"] = data;
	}

	return fetch(url, payload)
			.then(response => {
				if (isTemplate.length === 1 && isTemplate[0]) {
					return response.text();
				}
				return response.json();
			})
			.then(result => {return result})
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
