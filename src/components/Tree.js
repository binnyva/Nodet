import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from '../App.js';
import Data from "../Data.js";

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
		if(this.state.id === Data.new_node_id) {
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
			// eslint-disable-next-line
			this.state.status = 'close';
		} else {
			// eslint-disable-next-line
			this.state.status = 'open'; // Intentionally not using this.setState(). Or the next line won't work as expected.
		}
		this.setOpenCloseIcon();
	}

	setOpenCloseIcon() {
		// console.log(this.state.value, this.state.childCount);
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
	    var triggered = false;

	    if (e.keyCode === KEYS.TAB && e.shiftKey) {
	    	Data.makeParent(id);
	    	triggered = true;

	    } else if (e.keyCode === KEYS.TAB) {
	    	let node_id = Data.makeChild(id);
	    	if(!node_id) e.preventDefault();
	    	triggered = true;

	    } else if (e.keyCode === KEYS.ENTER && e.ctrlKey) {
	        Data.addChild(id);
	    	triggered = true;

	    } else if(e.keyCode === KEYS.ENTER)  {
	    	Data.addSiblingAfter(id);
	    	triggered = true;
	    }

	    if(triggered) {
	    	renderAll();
			e.preventDefault();
		}
	}

	render() {
		// console.log(this.state);
		return (
			<li className="node">
				<span className={'open-status glyphicon ' + this.state.plusIcon} onClick={this.toggle}></span>
				<input type="text" className="node-text" value={this.state.value} data-id={this.state.id} key={this.state.id}
					onChange={this.handleChange} onKeyDown={this.handleKeyDown}
					ref={(input) => { this.textInput = input }} />
				<TreeChildren nodes={this.props.node.children} status={this.state.status} />
			</li>
		);
	}
}

class TreeChildren extends Component {
	render() {
		// console.log("TreeChildren: ", this.props.nodes );
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
	constructor(props) {
		super(props);
		let name = "Untitled";
		if(typeof this.props.name !== "undefined") name = this.props.name;
		this.state = {
			name: name
		}
	}
	render() {
		return (
			<div>
				<input ref={(input) => this.name = input} type="text" className="tree-name" defaultValue={this.state.name} /><br />
				<TreeChildren nodes={this.props.tree} />
			</div>
		);
	}
}

function renderAll() {
	ReactDOM.render(<App />, document.getElementById('root'));
}

export default Tree;
 
