import React, { Component } from 'react';
import Data from '../Data.js';

export default class ImportView extends Component {
	constructor(props) {
		super(props);

		// The limitations of the ES6 syntax.
	    this.import = this.import.bind(this);
	}

	import() {
		const text = this.textArea.value;
		Data.parseText(text);
	}

	render() {
		return (
			<div>
			<h1>Import</h1>

			<div className="cantainer">
			<textarea rows="10" cols="70" ref={(input) => { this.textArea = input }}></textarea><br />
	        <input type="button" onClick={this.import} value="Refresh" />
			</div>
			</div>
		);
	}
}
