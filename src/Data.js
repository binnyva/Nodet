import json_data from './data.json';

var Data = {
	load() {
		this.data = json_data;
	},

	get() {
		return this.data;
	},

	addSiblingAfter(id) {
		var node = this.findNode(this.data, id);
		var parent = node.slice(0,-2);

		var reference = this.data; // Get the reference to the node using the path
		for(var i in parent) reference = reference[parent[i]];

		var node_index = node[node.length - 1];

		var new_array = reference.children.slice(0, node_index - 1);
		new_array.push({"id": 200, "title": ""});
		new_array = new_array.concat(reference.children.slice(node_index + 1));

		reference['children'] = new_array;
	},

	updateNode(id, value) {
		var loc = this.findNode(this.data, id); // Find the path

		var reference = this.data; // Get the reference to the node using the path
		for(var i in loc) reference = reference[loc[i]];

		// Update the value
		reference.title = value;
	},

	findNode(data, id, location) {
		if(typeof location === "undefined") location = [];

		for(var i in data) {
			if(data[i]['id'] === id) {
				location.push(i);
				return location;

			} else if(data[i]['children']) {
				location.push(i);
				location.push("children");
				var index = this.findNode(data[i]['children'], id, location);
				if(index !== false) return location;
			}
		}
		return false;
	}
}
Data.data = false; // Not sure how to put this in the structure properly.

export default Data;
