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
		var node_path = this.findNode(this.data, id);
		var parent = this.getParentNode(id);

		var node_index = Number(node_path[node_path.length - 1]);

		var new_id = this.getUniqueId();
		var new_node = {"id": new_id, "title": ""}; // Add a new node 

		parent.children.splice(node_index + 1, 0, new_node);

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

		var node_copy = this.getChildCopy(parent, node_index);

		// Make the current node a child of the sibling node just above it.
		if(typeof parent['children'][node_index - 1]['children'] === "undefined") { // No children
			parent['children'][node_index - 1]['children'] = [node_copy];
		} else { // There is existing children. Add a new element at the end
			parent['children'][node_index - 1]['children'].push(node_copy);
		}

		parent.children.splice(node_index, 1); // Delete the node from the old position.

		return id;
	},

	makeParent(id) {
		var node_path = this.findNode(this.data, id);
		var parent = this.getParentNode(id);
		var grandparent = this.getParentNode(parent.id);

		var node_index = Number(node_path[node_path.length - 1]); // Index of the current node.

		var node_copy = this.getChildCopy(parent, node_index);
		parent.children.splice(node_index, 1); // Delete the node

		var parent_node_index = Number(node_path[node_path.length - 3]);
		grandparent['children'].splice(parent_node_index+1, 0, node_copy); // Add the node to the grandparent.
	},

	getChildCopy(parent, index_to_copy) {
		var node = parent.children[index_to_copy];
		var node_copy = {"id": node.id, "title": node.title};
		if(typeof node.children !== "undefined") node_copy.children = node.children;

		return node_copy;
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
