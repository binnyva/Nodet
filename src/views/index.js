import React, { Component } from 'react';
import Tree from '../components/Tree.js';
import Data from "../Data.js";

export default class IndexView extends Component {
	constructor(props) {
		super(props);

		// The limitations of the ES6 syntax.
	    this.refreshJson = this.refreshJson.bind(this);
	}

	refreshJson() {
		this.textArea.value = Data.getAsString();
	}

	render() {
		Data.load();
		var data = Data.get();
		var json = Data.getAsString();

	    return (
	      <div className="App">
	        <Tree tree={data} />

	        <textarea rows="10" cols="70" ref={(input) => { this.textArea = input }}>{json}</textarea><br />
	        <input type="button" onClick={this.refreshJson} value="Refresh" />
	      </div>
	    );
	}
} 
