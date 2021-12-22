import React, { Component, createElement } from 'react';
import './dateSelector.css';


class DateSelector extends React.Component {
	state = {
		currentDate:0,
		currentMonth:0,
		currentYear:0,
		currentDay:0,
		open:0,
		compiled:0,
		mode:0,
		dates:[],
		startID:0,
		endID:0,
		startDate:0,
		endDate:0
	}

	constructor() {
		super();
		this.makeDiv=this.makeDiv.bind(this);
		this.getCalendar=this.getCalendar.bind(this);
		this.changeMode=this.changeMode.bind(this);
		this.unhighlight=this.unhighlight.bind(this);
		this.highlight=this.highlight.bind(this);

		let today= new Date();

		this.state.currentDate = today.getDate();
		this.state.currentYear = today.getYear();
		this.state.currentMonth = today.getMonth();
		this.state.currentDay = today.getDay();
	}

	

	render() { 
		
		return (
			<div>
				<input type='text' class="input" onClick={this.makeDiv} id="startDate" placeholder="Start Date"></input>
				<br></br>
				<input type='text' class="input" onClick={this.makeDiv} id="endDate" placeholder="End Date"></input>
				<div class="popup" id="test"></div>

			</div>
		)
	}

	makeDiv() {
		
		if(this.state.open===1) {
			document.getElementById("test").style.visibility="hidden";
			this.state.open=0;
			return;
		}
		else {
			if(this.state.compiled===0) {
				this.getCalendar();
				this.state.compiled=1;
			}
			document.getElementById("test").style.visibility="visible";
			this.state.open=1;
		}
		
	}

	getCalendar() {
		let date=this.state.currentDate;
		let month=this.state.currentMonth;

		let monthDays=[31,28,31,30,31,30,31,31,30,31,30,31];
		let monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
		let weekDays=["Su","Mo","Tu","Wed","Th","Fr","Sa"];

		let dayCounter=parseInt((date)%7)+1+this.state.currentDay;
		let calDiv=document.getElementById("test");
		calDiv.className="calendar";

		let tr = document.createElement("tr");
		let numDates=0;

		//draw first month title
		let monthH3=document.createElement("h3");
		monthH3.innerHTML=monthNames[month];
		calDiv.insertAdjacentElement("beforeend",monthH3);
		let iter=date;
		
		//draw first months weekday names
		for(let i=0;i<weekDays.length;i++) {
			let val = document.createElement("td");
			val.className="invisibleDates";
			val.innerHTML=weekDays[i];
			tr.insertAdjacentElement("beforeend",val);
		}
		calDiv.insertAdjacentElement("beforeend",tr);
		tr = document.createElement("tr");

		//draw empty boxes for past days
		for(let i=0;i<dayCounter;i++) {
			let val = document.createElement("td");
			val.className="invisibleDates";
			tr.insertAdjacentElement("beforeend",val);
		}

		//draw previous days in month
		for(let i=1;i<iter;i++) {
			let val = document.createElement("td");
			val.className="pastDates";

			val.innerHTML=i;

			tr.insertAdjacentElement("beforeend",val);
			dayCounter++;
			dayCounter%=7;
			if(dayCounter===0) {
				calDiv.insertAdjacentElement("beforeend",tr);
				tr=document.createElement("tr");
			}
			
		}

		//build all Future dates including today
		for(let x=0;x<6;x++) {
			if(x!=0) {
				//draw month title
				let monthH3=document.createElement("h3");
				monthH3.innerHTML=monthNames[month];
				calDiv.insertAdjacentElement("beforeend",monthH3);
				//draw week days
				for(let i=0;i<weekDays.length;i++) {
					let val = document.createElement("td");
					val.className="invisibleDates";
					val.innerHTML=weekDays[i];
					tr.insertAdjacentElement("beforeend",val);
				}
				calDiv.insertAdjacentElement("beforeend",tr);
				tr = document.createElement("tr");
				
				//draw gaps at start of month
				for(let i=0;i<dayCounter;i++) {
					let val = document.createElement("td");
					val.className="invisibleDates";
					tr.insertAdjacentElement("beforeend",val);
				}
			}
			
			//loop from start of month or current day till end of month
			for(let i=iter;i<=monthDays[month];i++) {
				
				let val = document.createElement("td");
				val.className="currentDates";
				//format id to hold month
				if(month<9) {
					val.id="0";
				}
				val.id+=month+1
				//prepend month and append id
				val.id+="date"+numDates;
				

				val.onmousedown=()=>this.changeMode(val.id);
				val.onmouseenter=()=>this.highlight(val.id.substring(6));
				val.onmouseleave=()=>this.unhighlight(0);
				this.state.dates.push(val);

				numDates++;
				iter++;
				val.innerHTML=i;
				tr.insertAdjacentElement("beforeend",val);
				dayCounter++;
				dayCounter%=7;
				if(dayCounter===0) {
					calDiv.insertAdjacentElement("beforeend",tr);
					tr=document.createElement("tr");
				}
				
				if(i==monthDays[month]) {
					for(let empt=dayCounter;empt<7;empt++) {
						let val = document.createElement("td");
						val.className="invisibleDates";
						tr.insertAdjacentElement("beforeend",val);
					}
					calDiv.insertAdjacentElement("beforeend",tr);
					break;
				}
			}
			month=(month+1)%12;
			iter=1;
			tr=document.createElement("beforeend",tr);
		}	
	}

	//handle clicks on the calendar
	changeMode(id) {
		let year=parseInt(this.state.currentYear)+1900;
		if(id.substring(0,2)<this.state.currentMonth) {
			year+=1;
		}

		//set start date
		if(this.state.mode===0) {
			document.getElementById(id).className="selected";
			this.state.startID=id.substring(6);
			this.state.startDate=id.substring(0,2)+"/" + this.state.dates[parseInt(id.substring(6))].innerHTML+"/"+year;
			document.getElementById("startDate").value=this.state.startDate;
			this.state.mode++;

		}
		//set end date
		else if(this.state.mode===1) {
			if(parseInt(id.substring(6))>this.state.startID) {
				document.getElementById(id).className="selected";
				this.state.endID=id.substring(6);
				this.state.endDate=id.substring(0,2)+"/" + this.state.dates[parseInt(id.substring(6))].innerHTML+"/"+year;
				document.getElementById("endDate").value=this.state.endDate;
				this.makeDiv();
				this.state.mode++;

			}
		}
		//clear and pick new start date
		else if(this.state.mode===2) {
			this.unhighlight(1);
			document.getElementById(id).className="selected";
			this.state.startID=id.substring(6);
			this.state.startDate=id.substring(0,2)+"/" + this.state.dates[parseInt(id.substring(6))].innerHTML+"/"+year;
			document.getElementById("startDate").value=this.state.startDate;

			this.state.endDate="";
			this.state.endID=0;
			this.state.mode=1;
		}


	}

	unhighlight(flag) {
		//uncolor all dates except selected day
		if(this.state.mode===1 || flag===1) {
			for(let i=0;i<this.state.dates.length;i++) {
				if(i!=this.state.startID || flag===1) {
					this.state.dates[i].className="currentDates";
				}
			}
		}
	}

	highlight(id) {
		//highlight all days from start day to current
		if(this.state.mode===1) {
			for(let i=parseInt(this.state.startID);i<parseInt(id);i++) {
				this.state.dates[i].className="selected";
			}
		}
	}
}
 
export default DateSelector;