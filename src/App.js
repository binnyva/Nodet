import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import data from './data.json';

class Node extends Component {
	constructor(props) {
		super(props);
		var child_count = 0;
		if(props.node.children) child_count = props.node.children.length;
		this.state = {
			value: props.node.title,
			childCount: child_count,
			status: 'open',
			plus: '',
			plusIcon: ''
		}
		
		// The limitations of the ES6 syntax.
	    this.handleChange = this.handleChange.bind(this);
	    this.toggle = this.toggle.bind(this);
	}
	componentDidMount() {
		this.setText();
	}

	handleChange(e) {
		var value = e.target.value;
		this.setState({value:value});
	}

	toggle() {
		if(this.state.status === 'open'){
			this.state.status = 'close';
		} else {
			this.state.status = 'open'; // Intentionally not using setState. Or the next line won't work as expected.
		}
		this.setText();
	}

	setText() {
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

	render() {
		return (
			<li className="node">
				<span className={'open-status glyphicon ' + this.state.plusIcon} onClick={this.toggle}></span>
				<input type="text" className="node-text" value={this.state.value} onChange={this.handleChange} />
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
  render() {
    return (
      <div className="App">
        <Tree tree={data} />
      </div>
    );
  }
}

export default App;
