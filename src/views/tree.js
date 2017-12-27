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
	}


	componentDidMount() {
		// Get the list of all trees using API
	    fetch('http://localhost/Projects/Nodet/api-php/trees/' + this.state.tree_id)
	      	.then(function(response) {
	      		if (response.status >= 400) {
			       throw new Error("Bad response from server");
			    }
			    return response.json();
	      	}).then(function(response) {
		      	const tree = response.data;
		        this.setState({ 
		        	tree: tree,
		        	name: response.data.name 
		        });
		    }.bind(this));
	}

	refreshJson() {
		this.textArea.value = Data.getAsString();
	}

	saveData() {
		console.log(Data.get());
	}

	renderx() {
		return "";
	}

	render() {
		if(this.state.tree) {
			Data.load(this.state.tree.data);
			let data = Data.get();
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

		return "";
	}
} 
 
