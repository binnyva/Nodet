import React, { Component } from 'react';
import Tree from '../components/Tree.js';
import Data from "../Data.js";
import { AlertList } from "react-bs-notifier";

class TreeView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show_json: false,
			tree_id: props.match.params.id,
			alerts: []
		}

		// The limitations of the ES6 syntax.
	    this.refreshJson = this.refreshJson.bind(this);
	    this.saveData = this.saveData.bind(this);
	    this.deleteTree = this.deleteTree.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.location.pathname === "/tree/0" && this.props.location.pathname !== "/tree/0") {  // New Tree - :TODO: This wont let you create a new tree when you are already in a new tree 
			// Imported Data
			let tree = Data.getNewTree();

			this.setState({
				name: Data.getTreeName(),
				tree: tree
			});
		}
	}

	componentDidMount() {
		if(this.state.tree_id === "0") { // New Tree
			// Imported Data
			let tree = Data.getNewTree();

			this.setState({
				name: Data.getTreeName(),
				tree: tree
			});

		} else if(this.state.tree_id === "1") { // Import
			// Imported Data
			let tree = Data.getTree();

			this.setState({
				name: Data.getTreeName(),
				tree: tree
			});

		} else { // Page called from Tree Index - get tree data from DB
			// Get the list of all trees using API
		    fetch('http://localhost/Projects/Nodet/api-php/trees/' + this.state.tree_id)
		      	.then(function(response) {
		      		if (response.status >= 400) {
				       throw new Error("Bad response from server");
				    }
				    return response.json();
		      	}).then(function(response) {
			      	const tree = response.data;
			      	Data.loadTree(tree);

			        this.setState({ 
			        	tree: tree,
			        	name: response.data.name
			        });
			    }.bind(this));
		}
	}

	refreshJson() {
		this.textArea.value = Data.getAsString();
	}

	deleteTree() {
		if(this.state.tree_id === Data.getTreeId()) { // Tree existing in database. Update only.
			fetch('http://localhost/Projects/Nodet/api-php/trees/' + this.state.tree_id, {
					method: 'DELETE'
				}).then(function(response) {
		      		if (response.status >= 400) {
				       throw new Error("Bad response from server");
				    }
				    return response.json();
		      	}).then(function(response) {
			            //if(response.success) {
			            // const new_alert = {
						// 	id: (new Date()).getTime(),
						// 	type: "success",
						// 	headline: "Deleted",
						// 	message: "Tree Deleted successfully."
						// };

						// this.setState({
						// 	alerts: [...this.state.alerts, new_alert]
						// });
			    }); //.bind(this));
		}

		// Go to front page.
		this.props.history.push("/?action=tree_deleted");
	}

	saveData() {
		// Without this, we'll get a Cyclic erro on the fetch.
		let seen = []; 
		var replacer = function(key, value) {
		  if (value !== null && typeof value === "object") {
		    if (seen.indexOf(value) >= 0) return;
		    seen.push(value);
		  }
		  return value;
		};

		let body = {
			"data": Data.getTree(),
			"tree_name": Data.tree_name
		};

		if(this.state.tree_id === Data.getTreeId()) { // Tree existing in database. Update only.
			fetch('http://localhost/Projects/Nodet/api-php/trees/' + this.state.tree_id, {
					method: 'POST',
					body: JSON.stringify(body, replacer)
				}).then(function(response) {
		      		if (response.status >= 400) {
				       throw new Error("Bad response from server");
				    }
				    return response.json();
		      	}).then(function(response) {
			      	if(response.success) {
			      		Data.changed = false;
			      		const new_alert = {
							id: (new Date()).getTime(),
							type: "success",
							headline: "Data Saved",
							message: "Tree Updated successfully."
						};

						this.setState({
							alerts: [...this.state.alerts, new_alert]
						});
			      	}
			    }.bind(this));

		} else { // New tree - insert.
			fetch('http://localhost/Projects/Nodet/api-php/trees', {
					method: 'POST',
					body: JSON.stringify(body, replacer)
				}).then(function(response) {
		      		if (response.status >= 400) {
				       throw new Error("Bad response from server");
				    }
				    return response.json();
		      	}).then(function(response) {
			      	if(response.success) {
			      		Data.changed = false;
			      		this.props.history.push("/tree/" + response.id['$oid']);
			      		const new_alert = {
							id: (new Date()).getTime(),
							type: "success",
							headline: "Data Saved",
							message: "New tree was saved to the database successfully."
						};

						this.setState({
							alerts: [...this.state.alerts, new_alert]
						});
			      	}
			    }.bind(this));
		}
	}

	onAlertDismissed(alert) {
		const alerts = this.state.alerts;

		// find the index of the alert that was dismissed
		const idx = alerts.indexOf(alert);

		if (idx >= 0) {
			this.setState({
				// remove the alert from the array
				alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
			});
		}
	}

	render() {
		let data = false;
		if(this.state.tree && this.state.tree.data)
			data = this.state.tree.data;
		if(!data) return ("");
		
		var json = Data.getAsString();

	    return (
	    	<div>
      		<AlertList
				position="top-right"
				alerts={this.state.alerts}
				timeout={2000}
				dismissTitle="Close!"
				onDismiss={this.onAlertDismissed.bind(this)}
			/>

		    <div className="App">
		        <Tree tree={data} name={this.state.name} />

		        <input type="button" onClick={this.saveData}  className="btn btn-success" value="Save" /><br />

		        <input type='button' onClick={this.deleteTree} className="btn btn-danger btn-xs" value="Delete" />

		        <div className={this.state.show_json ? "show" : "hide"} >
			        <textarea rows="10" cols="70" ref={(input) => { this.textArea = input }} defaultValue={json}></textarea><br />
			        <input type="button" onClick={this.refreshJson} value="Refresh" />
		        </div>
		        <input type="button" onClick={() => this.setState({"show_json": this.state.show_json ? false : true})}  className={this.state.show_json ? "hide" : "show"} value="Show Data" />
		    </div>
	      </div>
	    );
	}
} 

export default TreeView;
