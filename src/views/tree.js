import React, { Component } from 'react';
import Tree from '../components/Tree.js';
import Data from "../Data.js";
import json_data from '../data.json';

export default class TreeView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show_json: false,
			tree_id: props.match.params.id
		}

		// :TODO: Get the tree document using API call at this point.

		// The limitations of the ES6 syntax.
	    this.refreshJson = this.refreshJson.bind(this);
	}

	refreshJson() {
		this.textArea.value = Data.getAsString();
	}

	saveData() {
		console.log(Data.get());
	}

	render() {
		var data = Data.get();
		if(!data) {
			Data.load(json_data);
			data = Data.get();
		}
		
		var json = Data.getAsString();

	    return (
	      <div className="App">
	        <Tree tree={data} />

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
 
