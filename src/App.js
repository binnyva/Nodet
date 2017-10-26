import React, { Component } from 'react';
import './App.css';
import data from './data.json';

class Node extends Component {
	constructor(props) {
		super(props);
		var child_count = 0;
		if(props.node.children) child_count = props.node.children.length;
		this.state = {
			value: props.node.title,
			childCount: child_count,
			plus: ''
		}
		
	    this.handleChange = this.handleChange.bind(this);
	}
	componentDidMount() {
		this.setText();
	}

	handleChange(e) {
		var value = e.target.value;
		this.setState({value:value});
	}

	toggle() {
		this.state.status = (this.state.status === 'open') ? 'close' : 'open'; // Intentionally not using setState. Or the next line won't work as expected.
		this.setText();
	}

	setText() {
		console.log(this.state)
		if(this.state.childCount > 0) {
			if(this.state.status === 'open') this.setState({plus:'-'});
			else if(this.state.status === 'close') this.setState({plus:'+'});
		}
	}

	render() {
		return (
			<li>
				<span className="open-status" onClick={this.toggle}>{this.state.plus}</span>
				<input type="text" value={this.state.value} onChange={this.handleChange} />
				<TreeChildren nodes={this.props.node.children} />
			</li>
		);
	}
}

class TreeChildren extends Component {
	render() {
		var items;
		if(this.props.nodes) items = this.props.nodes.map((node) => <Node key={node.id} node={node} />);

		if(items) return (
			<ul>
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
