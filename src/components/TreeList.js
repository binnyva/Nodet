import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TreeList extends Component {

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
	}
	
	render() {
		if(this.props.trees) {
			let tree = this.props.trees.map((tree) => <li key={tree.id}><Link to={`/tree/${tree.id}`}>{tree.name}</Link></li>);

			return (
				<ul className="tree-list">
					{tree}
				</ul>
			);
		}

		return "";
	}
}

export default TreeList;
