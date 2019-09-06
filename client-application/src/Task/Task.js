import React from 'react';

const task = (props) => {
	return (
		<div>
			<h3>{props.name}</h3>
			<p>{props.description}</p>
			<p>Start Time: {props.time}</p>
		</div>
	);
}

export default task;
