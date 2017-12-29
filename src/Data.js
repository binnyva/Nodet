var Data = {
	data: false,
	tree_id: 0,
	tree_name: "",
	new_node_id: false,

	load(data, tree_id = 0, tree_name = "") {
		this.data = data;
		this.tree_id = tree_id;
		this.tree_name = tree_name;
	},

	get() {
		return this.data;
	},

	getTreeId() {
		return this.tree_id;
	},

	getTreeName() {
		return this.tree_name;
	},

	parseText(text) {
		let tabdown = require("tabdown-sacha"); 
		let lines = text.split("\n");
		let tree = tabdown.parse(lines);
		let data = this.changeTreeFormat(tree);
		let name = data[0].title;
		this.load(data, 0, name);
	},

	/// Converts the TabDown tree format to the one we use.
	changeTreeFormat(tree) {
		var data;
		if(tree.length) { // Child
			data = [];
			for(var i=0; i<tree.length; i++) {
				var node = tree[i];
				var arr = {
					"id": this.getUniqueId(),
					"title": null
				};
				if(node.data) {
					arr.title = node.data;
				}
				if(node.children.length) {
					arr.children = this.changeTreeFormat(node.children);
				}
				data.push(arr);
			}
		} else if(tree.data) { // One Root Node
			data = {
				"id": this.getUniqueId(),
				"title": tree.data,
				"children": this.changeTreeFormat(tree.children)
			}
		} else { // Multilpe root rodes
			data = this.changeTreeFormat(tree.children);
		}

		return data;
	},

	getAsString() {
		return JSON.stringify(this.data);
	},

	getUniqueId() {
		var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        // eslint-disable-next-line
	        return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
	    });

	    this.new_node_id = uuid;
	    return uuid;
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

		// Copy the node in question.
		var node_copy = this.getChildCopy(parent, node_index);

		// Get a copy of all children of the parent after this node.
		var children_after_node = parent.children.slice(node_index+1);

		// Delete all the children of parent after this node.
		parent.children.splice(node_index);

		node_copy.children = children_after_node;

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

export default Data;
