const { get_conf } = require("../node_utils");
const conf = get_conf();

function get_hostname(url) {
	if (!url) return undefined;
	if (url.indexOf("://") > -1) {
		url = url.split("/")[2];
	}
	return url.match(/:/g) ? url.slice(0, url.indexOf(":")) : url;
}

function get_base_url(socket) {
	if (process.env.FRAPPE_REALTIME_INTERNAL_BASE_URL) {
		return process.env.FRAPPE_REALTIME_INTERNAL_BASE_URL;
	}

	const origin = socket.request.headers.origin;
	const hostname = get_hostname(origin);

	if (["localhost", "127.0.0.1"].includes(hostname)) {
		return "http://erpnext-frontend:8080";
	}

	return origin;
}

function get_url(socket, path) {
	if (!path) {
		path = "";
	}
	let url = get_base_url(socket);
	if (conf.developer_mode && !process.env.FRAPPE_REALTIME_INTERNAL_BASE_URL) {
		let [protocol, host, port] = url.split(":");
		port = conf.webserver_port;
		url = `${protocol}:${host}:${port}`;
	}
	return url + path;
}

module.exports = {
	get_url,
};
