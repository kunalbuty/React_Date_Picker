import React, { Component } from 'react';

class Counter extends React.Component {


		constructor() {
			super();
			var today = new Date();
			const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			this.state = {
				currentDate: date
			}
		}

	render() { 
		return;
	}
}
 
export default Counter;