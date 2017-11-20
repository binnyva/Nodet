import json_data from './data.json';

var Data = {
	load() {
		this.data = json_data;
	},

	get() {
		return this.data;
	},

	getAsString() {
		return JSON.stringify(this.data);
	},

	getUniqueId() {
		return 200;
	},

	addSiblingAfter(id) {
		var node = this.findNode(this.data, id);
		var parent = this.getParentNode(id);

		var node_index = node[node.length - 1];

		var new_array = parent.children.slice(0, node_index + 1); // Copy all children till the current one.
		var new_id = this.getUniqueId();
		new_array.push({"id": new_id, "title": ""}); // Add a new node 
		if(parent.children.length >= node_index + 1) // Copy over the rest - if any.
			new_array = new_array.concat(parent.children.slice(node_index + 1));

		parent['children'] = new_array;

		return new_id;
	},

	addChild(id) {
		var reference = this.getNode(id);

		var new_id = this.getUniqueId();

		if(typeof reference['children'] === "undefined") { // No children
			reference['children'] = [{"id": new_id, "title": ""}];
		} else { // There is existing children. Add a new element at the top
			var new_array = {"id": new_id, "title": ""};
			reference['children'] = new_array.concat(reference['children']);
		}

		return new_id;
	},

	makeChild(id) {
		var node_path = this.findNode(this.data, id);
		var parent = this.getParentNode(id);

		var node_index = Number(node_path[node_path.length - 1]); // Index of the current node.
		if(node_index === 0) return 0; // Only elements with potential parent can be made a child. The top-most item cant be a child.

		var new_array = parent.children.slice(0, node_index); // Copy the nodes up until the current node - don't copy current node.
		var current_node = parent.children[node_index];
		var node_copy = {"id": id, "title": current_node.title};
		if(typeof current_node.children !== "undefined") node_copy.children = current_node.children;

		if(typeof new_array[new_array.length - 1]['children'] === "undefined") { // No children
			new_array[new_array.length - 1]['children'] = [node_copy];
		} else { // There is existing children. Add a new element at the end
			new_array[new_array.length - 1]['children'] = new_array[new_array.length - 1]['children'].concat(node_copy);
		}

		if(parent.children.length > node_index + 1)
			new_array = new_array.concat(parent.children.slice(node_index + 1)); // Add the rest of the children after this.

		parent['children'] = new_array;

		return id;
	},

	makeParent(id) {

	},

	getNode(id) {
		var node = this.findNode(this.data, id);
		var reference = this.data; // Get the reference to the node using the path
		for(var i in node) reference = reference[node[i]];

		return reference;
	},

	getParentNode(id) {
		var node = this.findNode(this.data, id);
		var parent = node.slice(0,-2);

		var reference = this.data; // Get the reference to the node using the path
		for(var i in parent) reference = reference[parent[i]];

		return reference;
	},

	updateNode(id, value) {
		var reference = this.getNode(id);

		// Update the value
		reference.title = value;
	},

	findNode(data, id, location) {
		if(typeof location === "undefined") location = [];

		for(var i in data) {
			// console.log(id, location, data[i]);
			if(data[i]['id'] === id) {
				location.push(i);
				// console.log("FOUND", location);
				return location;

			} else if(data[i]['children']) {
				location.push(i);
				location.push("children");
				var index = this.findNode(data[i]['children'], id, location);
				if(index !== false) return location;
				else { // Didn't find the node in the children - pop the last two elements in the array.
					location.pop();
					location.pop();
				}
			}
		}
		return false;
	}
}
Data.data = false; // Not sure how to put this in the structure properly.

export default Data;
