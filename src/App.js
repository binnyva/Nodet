import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
// import data from './data.json';
import Data from "./Data.js";

class Node extends Component {
	constructor(props) {
		super(props);
		var child_count = 0;
		if(props.node.children) child_count = props.node.children.length;
		this.state = {
			id: props.node.id,
			value: props.node.title,
			childCount: child_count,
			status: 'open',
			plus: '',
			plusIcon: ''
		}
		
		// The limitations of the ES6 syntax.
	    this.handleChange = this.handleChange.bind(this);
	    this.toggle = this.toggle.bind(this);
	    this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	componentDidMount() {
		this.setOpenCloseIcon();
		if(this.state.id === 200) {
			this.textInput.focus();
		}
	}

	handleChange(e) {
		var value = e.target.value;
		this.setState({value:value});

		var id = this.state.id;
		Data.updateNode(id, value);
	}

	toggle() {
		if(this.state.status === 'open'){
			this.state.status = 'close';
		} else {
			this.state.status = 'open'; // Intentionally not using setState. Or the next line won't work as expected.
		}
		this.setOpenCloseIcon();
	}

	setOpenCloseIcon() {
		if(this.state.childCount > 0) {
			if(this.state.status === 'open') {
				this.setState({plus:'-'});
				this.setState({plusIcon:'glyphicon-minus'});
			} else if(this.state.status === 'close') {
				this.setState({plus:'+'});
				this.setState({plusIcon:'glyphicon-plus'});
			}
		}
	}

	handleKeyDown(e) {
		var KEYS = {
			LEFT: 37,
	        UP: 38,
	        RIGHT: 39,
	        DOWN: 40,
	        ENTER: 13,
	        TAB: 9,
	        BACKSPACE: 8,
	        Z: 90,
	        Y: 89,
	        S: 83,
	        C: 67,
	        END: 35,
	        HOME: 36,
	        SPACE: 32
	    };
	    var id = this.state.id;

	    if (e.keyCode === KEYS.TAB && e.shiftKey) {
	    	Data.makeParent();
	    	renderAll();

	    } else if (e.keyCode === KEYS.TAB) {
	    	var node_id = Data.makeChild(id);
	    	if(!node_id) e.preventDefault();
	    	renderAll();

	    } else if (e.keyCode === KEYS.ENTER && e.ctrlKey) {
	        Data.addChild(id);
	        renderAll();

	    } else if(e.keyCode === KEYS.ENTER)  {
	    	Data.addSiblingAfter(id);
	    	renderAll();
	    }
	}

	render() {
		return (
			<li className="node">
				<span className={'open-status glyphicon ' + this.state.plusIcon} onClick={this.toggle}></span>
				<input type="text" className="node-text" value={this.state.value} data-id={this.state.id} 
					onChange={this.handleChange} onKeyDown={this.handleKeyDown}
					ref={(input) => { this.textInput = input }} />
				<TreeChildren nodes={this.props.node.children} status={this.state.status} />
			</li>
		);
	}
}

class TreeChildren extends Component {
	render() {
		var items;
		if(this.props.nodes) items = this.props.nodes.map((node) => <Node key={node.id} node={node} />);

		var className = "show";
		if(this.props.status === "close") className = "hide";

		if(items) return (
			<ul className={className}>
				{items}
			</ul>
		);
		else return null;
	}
}

class Tree extends Component {
	render() {
		return (
			<div>
				<TreeChildren nodes={this.props.tree} />
			</div>
		);
	}
}


class App extends Component {
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

function renderAll() {
	ReactDOM.render(<App />, document.getElementById('root'));
}

export default App;

// TODO
// https://reactjs.org/docs/refs-and-the-dom.html
// Try tab-ing 'HTML UI' and 'Models'. Some error.
