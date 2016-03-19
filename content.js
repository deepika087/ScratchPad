$(document).ready(function(){

	/**
		These div ids and class will stop extra pop ups on Harvard business review website
	**/
	var url = document.URL;
	var searchPagePattern = "sid";
	var productPagePattern = "pid";
	var friendHelpActivated = "No";

	var list = [
	    { 'name': 'Sanya', 'comment': 'I didnt like the product color' },
	    { 'name': 'Deepika', 'comment': 'Looks better than others' },
	    { 'name': 'Rohit', 'comment': 'Way too expensive' },
	    { 'name': 'Manpreet', 'comment': 'Image is not clear' },
	    { 'name': 'Taran', 'comment': 'Available at cheaper rate on amazon' },
		{ 'name': 'Pavan', 'comment': 'Mixed review. No clear winner' }
	];

	/*
		Execute the following code if the page contains multiple items that is the page is actually a search page not a specific product page.
	*/
	if (url.search(searchPagePattern) > 0) {
		
		//Now attach the tootltip
		$('.product-unit.unit-3.browse-product.new-design ').hover(function() {

			//1. Scrap the Product ID also known as pid
			var pid = $(this).attr('data-pid');
			
			//2. Get the notes for this pid from local storage
			var notesRetrieved = localStorage.getItem(pid);
			console.log("Note Retrived for pid = " + pid + " is = " + notesRetrieved);
			
			//3. Prepare + attach the Tool Tip for notes retrieved corresponding to a pid
			if (Boolean(friendHelpActivated === "No")) {
				if ( notesRetrieved != null && notesRetrieved.length > 0 && notesRetrieved !== 'null') {
					$(this).wrap("<div class='hint--top hint--bounce' data-hint=" + notesRetrieved + "> </div>");	
				}  
			} else {
				var randomNumber = Math.floor((Math.random() * list.length-1) + 1);
				console.log("Message of friend is : " + list[randomNumber].comment );
				var tempVar = "\'" + list[randomNumber].name + ':' + list[randomNumber].comment + "\'";
				$(this).wrap("<div class='hint--top hint--bounce hint--error' data-hint=" + tempVar + "> </div>");	
			}
		}, function() {
			/*
				This part will be executed on hover out. 
				Therefore clean up the tooptip data.
			*/
			if (Boolean($('#viewAllNotes').checked) == false) {
				$(this).parents().removeClass('hint--top');
				$(this).parents().removeClass('hint--bounce');
				$(this).parents().removeAttr('data-hint');
			}	
		});

		/*
			4. Create a slideable box with the following options
				a.) To View all notes
				b.) To remove all notes
				c.) To search in the notes
		*/	
		$("body").append("<div id='feedbackbox'></div>");
		var viewNotesDiv = "<div id='ui'>View all Notes <input id='viewAllNotes' name='viewAllNotes' type='checkbox'/></div>";
		$("#feedbackbox").append(viewNotesDiv);

		var clearNotesDiv = "<div id='ui'>Clear all Notes <input id='clearAllNotes' name='clearAllNotes' type='checkbox'/></div>";
		$("#feedbackbox").append(clearNotesDiv);

		var friendHelp = "<div id='ui'>Friend Help <input id='friendHelp' name='friendHelp' type='checkbox'/></div>";
		$("#feedbackbox").append(friendHelp);

		var friendAdvice = "<div id='ui'>Ask on Twitter <input id='friendAdvice' name='friendAdvice' type='checkbox'/></div>";
		$("#feedbackbox").append(friendAdvice);

		var searchNotesDiv = "<div id='searchBox'><input style='background-color:yellow;margin-bottom:10px;width:160px;height:25px;font-size:13px' type='text' name='searchNotes' id='searchNotes' placeholder='Enter keywords....'/></div>";
		$("#feedbackbox").append(searchNotesDiv);

		$('#friendHelp').change(function(event) {
			if (this.checked) {
				friendHelpActivated = "Yes";
			} else {
				friendHelpActivated = "No";
			}
		});

		/*
			5. Now attach events with each functionality
				a.) To view all notes, make sure the clean up of classes is done once view all check is unchecked.
				b.) To clear all notes, make sure the user actually wants to delete notes.
				c.) To search for notes
					c.1.) Trigger search when user hits enter
					c.2.) Before processing new search clear the old tooltips + uncheck ViewAllNotes & ClearAllNotes checkbox.
				d.) activating friend advice, will show the comments as written by your friend not your own comments.
				e.) Ask on twitter, will post the query on twitter via Java api.
		*/
		$('#viewAllNotes').change(function(event) {
			if (this.checked) {
				console.log("Checked event triggered");
				$('.product-unit.unit-3.browse-product.new-design ').each(function(index, el) {
					//console.log("Product ID: " + index + " " + $(this).attr('data-pid'));
					var userNote = localStorage.getItem($(this).attr('data-pid'));
					if (userNote != null && userNote.length > 0 && userNote !== 'null') {
						$(this).wrap("<div class='hint--top hint--always' data-hint=" + userNote + "> </div>");	
					}
				});
			} else {
				$('.product-unit.unit-3.browse-product.new-design ').each(function(index, el) {
					
					//Prccess clean up
					$(this).parents().removeClass('hint--top');
					$(this).parents().removeClass('hint--bounce');
					$(this).parents().removeAttr('data-hint');
				});
			}
		});

		$('#clearAllNotes').change(function(event) {
			if (this.checked) {
				var result = confirm("Are your sure ? click OK to delete all notes on this page ! !");
				if(result == true) {
					$('.product-unit.unit-3.browse-product.new-design ').each(function(index, el) {
						localStorage.setItem($(this).attr('data-pid'), "");
					});
					this.checked = false;
				} else {
					this.checked = false;
				}	
			}
		});

		$('#searchNotes').keypress(function(event) {
			console.log(event.which);
			if (event.which == 13) {
				searchQuery = $(this).val();
				$('.product-unit.unit-3.browse-product.new-design ').each(function(index, el) {
					//console.log("Product ID: " + index + " " + $(this).attr('data-pid'));
					var userNote = localStorage.getItem($(this).attr('data-pid'));
					if (userNote != null && userNote.length > 0 && userNote !== 'null' && userNote.search(searchQuery) >= 0) {
						$(this).wrap("<div class='hint--top hint--always' data-hint=" + userNote + "> </div>");	
					}
				});
			}
		});
		$('#searchNotes').focusin(function(event) {
			$('.product-unit.unit-3.browse-product.new-design ').each(function(index, el) {
				$(this).parents().removeClass('hint--top');
				$(this).parents().removeClass('hint--bounce');
				$(this).parents().removeAttr('data-hint');
			});
		});

		$('#friendAdvice').change(function(event) {
			if (this.checked) {
				var data = [];
				console.log("Request to share on twitter initiated");
				$('.product-unit.unit-3.browse-product.new-design ').each(function(index, el) {
					//console.log("Product ID: " + index + " " + $(this).attr('data-pid'));
					var userNote = localStorage.getItem($(this).attr('data-pid'));
					if (userNote != null && userNote.length > 0 && userNote !== 'null') {
						var prodTitle = $(this).find("img").attr("alt");
						var prodURL = "http://flipkart.com" + $(this).find("a").first().attr('href');
						
						/**
							Invoke URL shortner API
						**/
						var url = 'https://www.googleapis.com/urlshortener/v1/url';
						var key = 'AIzaSyCmN5_GBbpl1HY2cpYeFQxYAezI2dap5YA';
						var urlComplete = url;
						urlComplete += '?key=' + key;

						var	xmlhttp = new XMLHttpRequest();
						xmlhttp.open('POST', urlComplete, false);
						xmlhttp.setRequestHeader('Content-Type', 'application/json');

						xmlhttp.onreadystatechange = function()
						{
							if(xmlhttp.readyState == 4 && xmlhttp.status != 0) 
							{
								var response = JSON.parse(xmlhttp.responseText);

								if(response.id == undefined)
								{
									if(response.error.code == '401')
										console.log("Error1");
								}
								else	
								{
									console.log("Success1");
								}
							}
						}
						var longUrl = prodURL;
						xmlhttp.send(JSON.stringify({'longUrl': longUrl}));	
						var myArr = JSON.parse(xmlhttp.responseText);
						console.log("URL shortened : " + myArr.id);

						var node = new Object();
						node.userName = myArr.id;
						node.tweetText = userNote;
						data.push(node);
					}
				});

				console.log("Final Data" + JSON.stringify(data));

				$.ajax({
					url: 'http://localhost:8080/tweet',
					type: 'POST',
					dataType: 'json',
					data: JSON.stringify(data),
					crossDomain: true,
					contentType:'application/json',
					accept: 'applciation/text'
				})
				.done(function(msg) {
					console.log("success" + msg);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.log("error" + jqXHR, errorThrown);
				})
				.always(function() {
					console.log("complete");
				});

				

			} else {
				console.log("Twitter unchecked");
			}
		});

	} else if (url.search(productPagePattern) > 0) { //Now process a particular product page

		//Add the custom text box on page
		$("body").append("<div id='feedbackbox'></div>");
		var bk = "<div id='myNotesArea'><textarea id='myNotes' class='test' placeholder='Add your personal notes here...''></textarea></div>";
		$("#feedbackbox").append(bk);

		//Now add the functionality to store the input text in storage once the user is done editing.
		$("#feedbackbox").focusout(function(event) {
			//1. Get the data as entered by user
			//2. Get the PID
			//3. Save this info in localstorage as <key, value> pair
			var data = $('#myNotes').val();
			var pidValue = $('.pincode-widget-container.omniture-field').attr('data-pid');
			
			localStorage.setItem(pidValue, JSON.stringify(data));
		});
	} else {
		// When the page is neither a search page nor a product page. May be a home page
		console.log("Neither the product page nor the search page. Must be something else")
	}
});
