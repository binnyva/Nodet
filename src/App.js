import React, { Component } from 'react';
import {HashRouter,Switch,Route} from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';

import HeaderView from './views/header.js';
import IndexView from './views/index.js';
import ImportView from './views/import.js';
import ExportView from './views/export.js';
import TreeView from './views/tree.js';

class App extends Component {
	render() {
		return (
			<HashRouter>
			<div className="container">
				<HeaderView></HeaderView>

				<div id="content">
				<Switch>
					<Route exact path="/" component={IndexView}></Route>
					<Route exact path="/import" component={ImportView}></Route>
					<Route exact path="/export" component={ExportView}></Route>
					<Route path="/tree/:id" component={TreeView}></Route>
				</Switch>
				</div>
			</div>
			</HashRouter>			
		);
	}
}

export default App;
