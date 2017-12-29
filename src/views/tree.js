import React, { Component } from 'react';
import Tree from '../components/Tree.js';
import Data from "../Data.js";
// import json_data from '../data.json';

export default class TreeView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show_json: false,
			tree_id: props.match.params.id
		}

		// The limitations of the ES6 syntax.
	    this.refreshJson = this.refreshJson.bind(this);
	    this.saveData = this.saveData.bind(this);
	}

	componentDidMount() {
		if(this.state.tree_id === "0") { // Data is coming thru an import call.
			let data = Data.get();
			if(!data) return;
			
			this.setState({
					name: Data.getTreeName(),
					tree: {
						data: data
					}
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
			      	Data.load(tree, this.state.tree_id, response.data.name);

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

	saveData() {
		console.log(this.state.tree_id, Data.get());
	}

	render() {
		let data = false;
		if(this.state.tree && this.state.tree.data)
			data = this.state.tree.data;
		if(!data) return ("");
		
		var json = Data.getAsString();

	    return (
	      <div className="App">
	        <Tree tree={data} name={this.state.name} />

	        <input type="button" onClick={this.saveData}  className="btn btn-success" value="Save" />

	        <div className={this.state.show_json ? "show" : "hide"} >
		        <textarea rows="10" cols="70" ref={(input) => { this.textArea = input }} defaultValue={json}></textarea><br />
		        <input type="button" onClick={this.refreshJson} value="Refresh" />
	        </div>
	        <input type="button" onClick={() => this.setState({"show_json": this.state.show_json ? false : true})}  className={this.state.show_json ? "hide" : "show"} value="Show Data" />
	      </div>
	    );
	}
} 
 
