define([
  // Application.
  "app"
  // "vendor/jam/fullcalendar/fullcalendar"
],

function(app) {

	var LeaveEvent = app.module();

  	LeaveEvent.Model = Backbone.Model.extend({
  		initialize : function() {
			console.log("leave-model initialize");

		},

		defaults :{

			 "username":  "",
			 "leavetype":     "",
			 "startdate":    "",
			 "enddate":     "",
			 "duration":     "",
			 "note":     ""

		}
	});

	LeaveEvent.Collection = Backbone.Collection.extend({
	    model: LeaveEvent.Model,

	    url: "",

	    setUrl: function(url){
	    	
	    	console.log("leave getdata setUrl");

			this.url = url;
		},

		getDate: function () {
			// body...
			return new Date();
		},

	    parse: function(obj) {
			// Safety check ensuring only valid data is used.
			console.log("leave-collection parse");
			// console.log("parse leave obj: " + obj);
			
			_.each(obj, function(LeaveEvent) {
				//console.log(LeaveEvent);
			});

			// var mylength = obj.length;
			// console.log(mylength);

			return obj;
		},

		initialize : function() {
			console.log("leave-collection initialize");
		}
	});

	LeaveEvent.Views.Create = Backbone.View.extend({
		template: "leave-event/create",

		url: "",

		username: "",
		duration: "",
		leaveType: "",
		startdate: "",
		enddate: "",
		note: "",

		//set url and key for mongo database
		MONGOHQ_URL: "https://api.mongohq.com/databases/calendar/collections/",
		MONGOHQ_KEY: "?_apikey=lLldnqL9KWLTLBGCfUNkJYF1m8JLVckXEsBzySFc",

		MONGOLAB_KEY: "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11",
		MONGOLAB_URL: "https://api.mongolab.com/api/1/databases/calendar/collections/",

		COLLECTION: "events",

		events:{
			'click #createSubmit':'addLeave',
			'click #createCancel':'cancel',
			'click .duration':'setDuration'
		},

		serialize: function() {
		  console.log("leave-event-views-create serialize");
		  return {         
		    model: this.model };
		},

		initialize: function() {
		  console.log("leave-event-views-create initialize");
		},

		addLeave: function() {
		  console.log("leave-event-views-create add leave fuction");

		  var self=this;

		  //set url		  
		  this.url = this.MONGOLAB_URL + this.COLLECTION + this.MONGOLAB_KEY;

		  // TODO get username from user model
		  this.username = "Joe";
		  
		  //get duration
		  this.duration = $("#leaveDuration").val();
		  //set other leave details
		  this.leaveType = $("#leaveType").val();
		  this.startdate = $("#leaveStartdate").val();
		  this.enddate = $("#leaveEnddate").val();
		  this.note = $("#leaveNotes").val();
		  
		  //todo data verify
		  if ($("#leaveStartdate").val().length == 0 || $("#leaveEnddate").val().length == 0) {
		  	//TODO display warning message at model popup window
		  	alert("must select date...");
		  	return false;
		  }

		  $.ajax( 
				{
					url: this.url,
		          	data: JSON.stringify( {"username":this.username,"duration":this.duration,"leavetype":this.leaveType,"startdate":this.startdate,"enddate":this.enddate,"note":this.note} ),
	      			type: "POST",
	      			contentType: "application/json"
	          	}
          	).done(function(data){
          		console.log("add leave success");
          		//fetch url to refresh month view
          		self.options.leaveobjs.setUrl(self.MONGOLAB_URL + self.COLLECTION + self.MONGOLAB_KEY);
          		
          		console.log("fetch url at add leave ");
          		self.options.leaveobjs.fetch();

          		//add local colletion to refresh month view
          		//todo 


          		//TODO MLC-15 call ws to send mail 

          		app.router.go("leave");
          		$(".functionsbar").show();
          	}).fail(function(xhr, status, err){
          		// todo display fail message at model popup

          		console.log(err);
          	});

		  //this.listenTo(this.model, "change", this.render);
		},

		cancel: function() {
		  console.log("leave-event-views-create cancel create leave");
		  //this.listenTo(this.model, "change", this.render);
		  app.router.go("leave");
		},

		setDuration: function(event) {
		  console.log("leave-event-views-create set duration...");
		  duration = $(event.target).attr('duration');
		  console.log("change duration to "+ duration);
		  $("#leaveDuration").val(duration);
		},

		afterRender : function() {

		    var nowTemp = new Date();
		    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		     
		    var start = $('#leaveStartdate').datepicker({
			    format : "yyyy-mm-dd",
				weekStart : 0,
			    onRender: function(date) {
			    	return date.valueOf() < now.valueOf() ? 'disabled' : '';
			    }
		    }).on('changeDate', function(ev) {
			    //reset enddate once start date changed
			    //if (ev.date.valueOf() > end.date.valueOf()) {
			    var newDate = new Date(ev.date);
			    //enddate should be start with startdate
			    //newDate.setDate(newDate.getDate()+1);
			    //newDate.setDate(newDate.getDate());
			    end.setValue(newDate);
			    //}
			    start.hide();
			    $('#leaveEnddate')[0].focus();
		    }).data('datepicker');

		    var end = $('#leaveEnddate').datepicker({
			    format : "yyyy-mm-dd",
				weekStart : 0,
			    onRender: function(date) {
			    	return date.valueOf() < start.date.valueOf() ? 'disabled' : '';
			    }
		    }).on('changeDate', function(ev) {
		    	//control the duration display
		    	if (ev.date.valueOf() == start.date.valueOf()) {
		    		//$("#duration_am").removeAttr('disabled');
		  			//$("#duration_pm").removeAttr('disabled');
		    		$("#duration_am").attr('disabled', false);
		  			$("#duration_pm").attr('disabled', false);
		    	}else{
		  			$("#duration_am").attr('disabled', true);
		  			$("#duration_pm").attr('disabled', true);
		  			//remember to reset duration to all
		  			$("#leaveDuration").val("all");
		    	}
		    	end.hide();
		    	
		    }).data('datepicker');
		}
	});

	LeaveEvent.Views.Item = Backbone.View.extend({
		template: "leave-event/item",

		serialize: function() {
		  console.log("leave-event-views-item serialize");
		  return {         
		    model: this.model };
		},

		initialize: function() {
		  console.log("leave-event-views-item initialize");
		  //this.listenTo(this.model, "change", this.render);
		}
	});


	LeaveEvent.Views.Month = Backbone.View.extend({
		template: "leave-event/month",
        
		myDate: "",
		currentDate: "",
		MaxDayOfDate: "",
		currentDataID: "",
		delDate:"",

		events:{
			'click #next':'nextMonth',
			'click #pre':'preMonth',
			'click .day':'showInfo',
			'click .listItem':'showDetails',
			'click #delete':'deleteItem'
		},

		serialize: function() {
	    	console.log("leave-event-views-month serialize");
      		return { collection: this.options.leaveobjs.models };
    	},

		nextMonth: function() {
			app.currentDate.setMonth(app.currentDate.getMonth()+1);
			this.render();
		},

		preMonth: function() {
			app.currentDate.setMonth(app.currentDate.getMonth()-1);
			this.render();
		},

		showDetails: function(e){
			console.log("Month listItem clicked!");
			var myEvent = $(e.target.parentNode);
			this.options.leaveobj = $(myEvent).data("id").$oid;
			this.options.leavecid = $(myEvent).attr("cid");

			var singleTable = document.getElementById("single-table");
			$(singleTable).html("");
			var details;
			//console.log("leaveobj: " + this.options.leaveobj);

			for(var i=0; i<this.options.leaveobjs.length; i++){
				if(this.options.leaveobjs.models[i].attributes._id==$(myEvent).data("id")){
					console.log("find it!");
					details = this.options.leaveobjs.models[i].attributes;
					//console.log(details);
				}					
			}

			var row = document.createElement("tr");
			// console.log($(row).data("id").$oid);

			$(row).addClass("listItemReadOnly");
			$(row).html("<td><i class="+"icon-user"+"></i></td><td>"+details.username+"</td><td>"+details.duration+"</td><td>"+details.leavetype+"</td><td>"+details.startdate+"</td><td>"+details.enddate+"</td>");
			singleTable.appendChild(row);

			var note = document.getElementById("note");
			$(note).html(details.note);

			//console.log("show Modal");
			$("#myModal").modal('show');
			//console.log("Modal shown");
		},

		deleteItem: function(e){
			console.log("delete it!");
			console.log("target2: "+e.target);

			var self=this;

			console.log("cid=", this.options.leavecid);

			$.ajax( 
				{
					url: "https://api.mongolab.com/api/1/databases/calendar/collections/events/"+ this.options.leaveobj + "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11",
					// url: "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/4e7315a65e4ce91f885b7dde?apiKey=myAPIKey",
		          	type: "DELETE"
	          	} 
          	).done(function(data){
          		console.log("success");

          		var leaveobjDel = self.options.leaveobjs.get(self.options.leavecid);
				self.options.leaveobjs.remove(leaveobjDel);
				console.log(self.options.leaveobjs.length);
				
				self.render();
				console.log("111");
				self.showList(self.delDate);
				console.log("222");

          	}).fail(function(xhr, status, err){
          		console.log(err);
          	});       	
		},

		showList: function(date){

			var myDate = date;
			this.delDate = date;
			var mylength = this.options.leaveobjs.length;
			console.log("date parameter: " + myDate);
			console.log(mylength);			

			var dailyTable = document.getElementById("daily");
			$("#daily").html("");
			
			for(var i=0; i<mylength; i++){
				var myCID = this.options.leaveobjs.models[i].cid;
				var myData = this.options.leaveobjs.models[i].attributes;
				//console.log(this.options.leaveobjs.models[i].attributes);
				var startdate = (this.options.leaveobjs.models[i].attributes.startdate).split("-");
				var enddate = (this.options.leaveobjs.models[i].attributes.enddate).split("-");
				var startDate = new Date(startdate[0],(startdate[1]-1),startdate[2]);
				var endDate = new Date(enddate[0],(enddate[1]-1),enddate[2]);

				if(myDate>=startDate && myDate<=endDate){
					// console.log("input the daily entry!");
					var row = document.createElement("tr");
					$(row).data("id", myData._id);
					console.log(myCID);
					$(row).attr("cid", myCID);
					$(row).addClass("listItem");

					$(row).html("<td><i class="+"icon-user"+"></i></td><td>"+myData.username+"</td><td>"+myData.duration+"</td><td>"+myData.leavetype+"</td><td>"+myData.startdate+"</td><td>"+myData.enddate+"</td>");
					// console.log($(row).html());

					dailyTable.appendChild(row);
				}else{
					// console.log("not in the scope!");
				}
			}
			console.log("showList called!");
			console.log($("#daily").html());
		},

		showInfo: function(e){
			console.log("call showList!");
			//console.log($(e.target).text());
			var myDate = $(e.target).data();
			this.showList(myDate.date);			
		},

		beforeRender: function() {
	    	console.log("leave-event-views-month beforeRender");			
	    },

	    afterRender: function() {
			this.getCalendarData(app.currentDate);
	     	console.log("leave-event-views-month afterRender");
	     	$(".functionsbar").show();
	    },

	    maxDayOfDate : function(Year, Month)
		{
			var d = new Date(Year,Month,0);
    		return d.getDate();
		},

		getRowNum: function(maxDay, day){
			var rowNum = parseInt((maxDay-(7-day))/7)+1;
			if(parseInt((maxDay-(7-day))%7)>0){
				rowNum+=1;
			}
			return rowNum;
		},

	    getCalendarData: function (vardate) {
	    	var calendarTable = document.getElementById('calendar');

			if(calendarTable) {

				console.log("generate calendar!");
				
				var mylength = this.options.leaveobjs.length;	
				console.log("length: " + mylength);

				var myDate = vardate;
				myDate.setDate(1);

				calendarTable.caption.innerHTML =myDate.getFullYear() + " . " + (myDate.getMonth()+1);

				this.MaxDayOfDate = this.maxDayOfDate(myDate.getFullYear(), myDate.getMonth()+1);

				var date = myDate.getDate();
				var day = myDate.getDay();
				var rowNum = this.getRowNum(this.MaxDayOfDate, day);
				var today = new Date();
				
				var body = document.createElement("tbody");

				for(var i=0; i<rowNum ; i++){
					var row = document.createElement("tr");
					for(var j=0; j<7; j++){
						if((i*7+j)<day){
							var cell = document.createElement("td");
							row.appendChild(cell);
						}
						if((i*7+j)>=day && (i*7+j-day)<this.MaxDayOfDate){
							var cell = document.createElement("td");

							$(cell).html(date++);
							$(cell).addClass("day");
							$(cell).data("date", new Date(myDate.getFullYear(),myDate.getMonth(),date-1));

							if(j==0 || j==6){
								$(cell).addClass("holiday");
							}

							if($(cell).data("date").toLocaleDateString() == today.toLocaleDateString()){
								$(cell).addClass("today");
								//console.log($(cell).data("date").toLocaleDateString());
							}

							if(mylength!=0){
								
								for(var k=0; k<mylength; k++){
									var myCID = this.options.leaveobjs.models[i].cid;
									var myData = this.options.leaveobjs.models[k].attributes;
									//console.log(this.options.leaveobjs.models[k].attributes);
									var startdate = (this.options.leaveobjs.models[k].attributes.startdate).split("-");
									var enddate = (this.options.leaveobjs.models[k].attributes.enddate).split("-");
									var startDate = new Date(startdate[0],(startdate[1]-1),startdate[2]);
									var endDate = new Date(enddate[0],(enddate[1]-1),enddate[2]);

									if(($(cell).data("date")>=startDate) && ($(cell).data("date")<=endDate) && (j!=0) && (j!=6)){
										// console.log("input the daily entry!");
										// console.log("leave");
										$(cell).addClass("leave");
										
									}else{
										// console.log("not in the scope!");
									}
								}
							}
							
							row.appendChild(cell);
						}
						if((i*7+j-day)>=this.MaxDayOfDate && ((i*7-day) < (rowNum*7))){
							var cell = document.createElement("td");
							row.appendChild(cell);
						}
					}
					body.appendChild(row);
				}

				calendarTable.appendChild(body);
			}
		},

		initialize: function() {
			console.log("leave-event-views-month initialize");
			console.log("app currentDate is: " + app.currentDate);

			this.myDate = this.options.leaveobjs.getDate();
			console.log("this.myDate is: " + this.myDate);

			this.listenTo(this.options.leaveobjs, {
				"reset" : function(){
					this.render();
					
					console.log("render for reset!");
				}
				// ,
				// "fetch" : function() {
				// 	console.log("leave fetch listened by month");
				// }
			});
		}
	});

	LeaveEvent.Views.List = Backbone.View.extend({
		template: "leave-event/list",

		myDate: "",
		currentDate: "",
		MaxDayOfDate: "",

		events:{
			'click #nextList':'nextMonth',
			'click #preList':'preMonth',
			'click .listItem':'showDetails',
			'click #delete-list':'deleteItem'
		},

		nextMonth: function() {
			app.currentDate.setMonth(app.currentDate.getMonth()+1);
			this.render();
		},

		preMonth: function() {
			app.currentDate.setMonth(app.currentDate.getMonth()-1);
			this.render();
		},

		showDetails: function(e){
			console.log("List listItem clicked!");
			var myEvent = $(e.target.parentNode);
			this.options.leaveobj = $(myEvent).data("id").$oid;
			this.options.leavecid = $(myEvent).attr("cid");

			var singleTable = document.getElementById("single-table-list");
			$(singleTable).html("");
			var details;
			//console.log("leaveobj: " + this.options.leaveobj);

			for(var i=0; i<this.options.leaveobjs.length; i++){
				if(this.options.leaveobjs.models[i].attributes._id==$(myEvent).data("id")){
					console.log("find it!");
					details = this.options.leaveobjs.models[i].attributes;
					//console.log(details);
				}					
			}

			var row = document.createElement("tr");
			// console.log($(row).data("id").$oid);
			$(row).addClass("listItemReadOnly");
			$(row).html("<td><i class="+"icon-user"+"></i></td><td>"+details.username+"</td><td>"+details.duration+"</td><td>"+details.leavetype+"</td><td>"+details.startdate+"</td><td>"+details.enddate+"</td>");
			singleTable.appendChild(row);

			var note = document.getElementById("note-list");
			$(note).html(details.note);

			//console.log("show Modal");
			$("#myModal-list").modal('show');
			//console.log("Modal shown");
		},

		deleteItem: function(e){
			console.log("delete it List!");
			console.log("target2: "+e.target);

			var self=this;

			console.log("cid=", this.options.leavecid);

			$.ajax( 
				{
					url: "https://api.mongolab.com/api/1/databases/calendar/collections/events/"+ this.options.leaveobj + "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11",
					// url: "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/4e7315a65e4ce91f885b7dde?apiKey=myAPIKey",
		          	type: "DELETE"
	          	} 
          	).done(function(data){
          		console.log("success");

          		var leaveobjDel = self.options.leaveobjs.get(self.options.leavecid);
				self.options.leaveobjs.remove(leaveobjDel);
				console.log(self.options.leaveobjs.length);
				
				self.render();
				// console.log("111");
				// self.showList(self.delDate);
				// console.log("222");

          	}).fail(function(xhr, status, err){
          		console.log(err);
          	});       	
		},

		maxDayOfDate : function(Year, Month)
		{
			var d = new Date(Year,Month,0);
    		return d.getDate();
		},

		getMonthlyList: function(vardate){
			var monthlyTable = document.getElementById('monthly');

			if(monthlyTable) {

				console.log("generate monthly list!");
				var mylength = this.options.leaveobjs.length;	

				var myDate = vardate;
				myDate.setDate(1);

				monthlyTable.caption.innerHTML =myDate.getFullYear() + " . " + (myDate.getMonth()+1);

				for(var i=0; i<mylength; i++){
					var myCID = this.options.leaveobjs.models[i].cid;
					var myData = this.options.leaveobjs.models[i].attributes;
					//console.log(this.options.leaveobjs.models[i].attributes);
					var startdate = (this.options.leaveobjs.models[i].attributes.startdate).split("-");
					var enddate = (this.options.leaveobjs.models[i].attributes.enddate).split("-");
					var startDate = new Date(startdate[0],(startdate[1]-1),startdate[2]);
					var endDate = new Date(enddate[0],(enddate[1]-1),enddate[2]);



					if((startDate.getFullYear() == myDate.getFullYear()) && ((startDate.getMonth()==myDate.getMonth()) || (endDate.getMonth()==myDate.getMonth()))){
						var row = document.createElement("tr");

						console.log("in loop!");
						$(row).data("id", myData._id);
						$(row).addClass("listItem");
						$(row).attr("cid", myCID);
						$(row).html("<td><i class="+"icon-user"+"></i></td><td>"+myData.username+"</td><td>"+myData.duration+"</td><td>"+myData.leavetype+"</td><td>"+myData.startdate+"</td><td>"+myData.enddate+"</td>");
						monthlyTable.appendChild(row);
					}
				}
			}
					
		},

	    serialize: function() {
	    	console.log("leave-event-views-list serialize");
      		return { collection: this.options.leaveobjs.models };
    	},
        beforeRender: function() {
	    	console.log("leave-event-views-list beforeRender");
	    },
	    afterRender: function() {
	    	this.getMonthlyList(app.currentDate);
	     	console.log("leave-event-views-list afterRender");
	     	$(".functionsbar").show();
	    },

	 	initialize: function() {
	 		console.log("leave-event-views-list initialize");
	 		this.myDate = this.options.leaveobjs.getDate();	 		
			this.listenTo(this.options.leaveobjs, {
				"reset" : function(){
					this.render();
					
					console.log("render for reset!");
				}
				// ,
				// "fetch" : function() {
				// 	console.log("leave fetch listened by list");
				// }
			});
	    }
	});
	
	LeaveEvent.Views.Query = Backbone.View.extend({
		template: "leave-event/query",

		initialize: function() {
		  console.log("Leave query initialize...");

		  //this.listenTo(this.options.leaveobjs, 'change', LeaveEvent.Views.Query.render);

		  this.listenTo(this.options.queryobjs, {
				"reset" : this.render
			});
		  
		},

		events:{
			'click #query':'LEquery'
		},

		LEquery: function() {

			var self = this;
			//set url and key for mongo database
			var MONGOLAB_KEY = "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11";
	    	var MONGOLAB_URL = "https://api.mongolab.com/api/1/databases/calendar/collections/events/";
			var api_url = MONGOLAB_URL + MONGOLAB_KEY;

			// todo get username and token
			//todo call userverfiy ws
			console.log("start Leave query ...");
	      
	    	var username = $('#users').val();
	        var leavetype = $('#type').val();
	        var startdate = $('#startdate').val();
	        var enddate = $('#enddate').val();
	        var self = this;

	        var queryStr = '&q={';

	        if(username) {

	        	queryStr = queryStr + '"username":"'+username+'",';
	        }
	        
	        if(leavetype != "ALL"){

	        	queryStr = queryStr + '"leavetype":"'+leavetype+'",';
	        }
	        
	        queryStr = queryStr + '"startdate":{$gt:"'+startdate+'"},"enddate":{$lt:"'+enddate+'"}}';

			console.log(api_url+queryStr);
	 		this.options.queryobjs.setUrl(api_url+queryStr);
	        this.options.queryobjs.fetch();
	         	
          	
	},

	serialize: function() {
    	console.log("Leave query serialize...");
  		return { data: this.options.queryobjs.models };
  		
    },

	afterRender : function() {
		console.log("Leave query afterRender...");
		$("#startdate, #enddate").datepicker({
         format : "yyyy-mm-dd",
         weekStart : 1
	     });

	    $('.selectpicker').selectpicker('selectAll');

	    $('.selectpicker').selectpicker('deselectAll');
		}


	});
	// Required, return the module for AMD compliance.
	return LeaveEvent;

});