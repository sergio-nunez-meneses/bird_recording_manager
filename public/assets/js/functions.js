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
