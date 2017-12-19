import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HeaderView extends Component {
	render() {
	    return (
			<div id="header" className="navbar navbar-inverse navbar-fixed-top" role="navigation">
		    <div id="nav" className="container">
		      <div className="navbar-header">
		        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		          <span className="sr-only">Toggle navigation</span>
		          <span className="icon-bar"></span>
		          <span className="icon-bar"></span>
		          <span className="icon-bar"></span>
		        </button>
		        <Link to="/" className="navbar-brand">Nodet</Link>
		      </div>
		      <div className="collapse navbar-collapse">
				<ul className="nav navbar-nav pull-right">
					<li><Link to="/">Home</Link></li>
					<li><Link to="import">Import</Link></li>
					<li><Link to="export">Export</Link></li>
				</ul>
		      </div>
		    </div>
		    </div>
	    );
	}
} 
 
