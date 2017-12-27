import React, { Component } from 'react';
import TreeList from '../components/TreeList.js';

export default class IndexView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			trees: false
		};
	}

	componentDidMount() {
		// Get the list of all trees using API
	    fetch('http://localhost/Projects/Nodet/api-php/trees/')
	      	.then(function(response) {
	      		if (response.status >= 400) {
			       throw new Error("Bad response from server");
			    }
			    return response.json();
	      	}).then(function(response) {
		      	const trees = response.data;
		        this.setState({ trees: trees });
		    }.bind(this));
	  }

	render() {
		return (
	      <div className="App">
	        <TreeList trees={this.state.trees} />
          </div>
	    );
	}
} 
