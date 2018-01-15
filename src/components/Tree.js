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
	    this.setOpenCloseIcon = this.setOpenCloseIcon.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.node.children) {
			// eslint-disable-next-line
			this.state.childCount = nextProps.node.children.length;
			this.setOpenCloseIcon();
		}
		if(this.state.id === Data.focus_on_node_id) {
			this.textInput.focus();
		}
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

	    } else if(e.keyCode === KEYS.ENTER) {
	    	Data.addSiblingAfter(id);
	    	triggered = true;

	    } else if(e.keyCode === KEYS.UP) {
	    	Data.moveCursorUp(id);
	    	triggered = true;

	    } else if(e.keyCode === KEYS.DOWN) {
	    	Data.moveCursorDown(id);
	    	triggered = true;
	    }

	    if(triggered) {
	    	renderAll();
			e.preventDefault();
		}
	}

	render() {
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
		var items;
		if(this.props.nodes) {
			items = this.props.nodes.map((node) => <Node key={node.id} node={node} />);
		}

		var className = "show";
		if(this.props.status === "close") className = "hide";
		if(this.props.root === "1") className+= " root";

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

		this.setTreeName = this.setTreeName.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.name === "Untitled") { // To get the Tree name updated when new tree is created.
			this.setState({name: nextProps.name});
			this.name.value = nextProps.name;
		}
	}

	// :TODO: Set tree name automatically in the Data object too.
	setTreeName(e) {
		let name = e.target.value;
		this.setState({name: name});
		Data.tree_name = name;
	}

	render() {
		return (
			<div>
				<input ref={(input) => { this.name = input; }} onChange={this.setTreeName} type="text" className="tree-name" defaultValue={this.state.name} /><br />
				<TreeChildren nodes={this.props.tree} root="1" />
			</div>
		);
	}
}

function renderAll() {
	ReactDOM.render(<App />, document.getElementById('root'));
}

export default Tree;
 
