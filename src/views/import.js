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
		this.props.history.push("/tree/0");
	}

	render() {
		return (
			<div>
			<h1>Import</h1>

			<div className="cantainer">
			<textarea rows="10" cols="70" ref={(input) => { this.textArea = input }} defaultValue={"Aspects of your life...\n\
	Financial\n\
	Emotional \n\
	Physical\n\
		Health\n\
	Career\n\
		Purpose\n\
		Security\n\
		Work involved\n\
		Drive\n\
		Learning\n\
		Growth Oppertunity\n\
		Salery\n\
		People you work with\n\
		Management\n\
		Amount of free time\n\
		Work/Life Balance\n\
	Relationship\n\
	Friendships\n\
	Entertainment\n\
	Learning\n\
	Food\n\
	Purpose of your life\n\
	Technology\n\
		Smart devices\n\
			Laptop\n\
			Phone\n\
			Camera\n\
	General productivity\n\
	Hobbies"}></textarea><br />
	        <input type="button" onClick={this.import} className="btn btn-primary" value="Parse" />
			</div>
			</div>
		);
	}
}
