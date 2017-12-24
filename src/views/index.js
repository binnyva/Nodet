import React, { Component } from 'react';
import TreeList from '../components/TreeList.js';

export default class IndexView extends Component {
	constructor(props) {
		super(props);

		// :TODO: Get the list of all trees using API
		var data = {"success":true,"error":false,"data":[{"name":"Things to do","id":"5a3fb8ef24e2d1456889cc41","data":false}]};
		this.state = {
			trees: data.data
		};
	}

	render() {
		return (
	      <div className="App">
	        <TreeList trees={this.state.trees} />
          </div>
	    );
	}
} 
