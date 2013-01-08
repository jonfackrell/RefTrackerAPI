﻿var refTrackerUrl = 'http://trunkclientws.altarama.com';
var refChatterUrl = 'ca.refchatter.net';
var categories = {"ID":{},"Name":{},"Count":{}};
var language = '';
var strings = {"user":
				  {
				  	"en":{
							"SearchResultsFor":"Search results for ",
							"ViewMore":"View more",
							"QuestionDetail":"Question Detail ",
							"RecentQuestionsByCategory":"Recent Questions by Category",
							"TotalClosedQuestion":"Total # of Answered Questions: ", 
							"TotalKBQuestion":"Total # of Knowledge Base Questions in: ",
							"TotalOpenQuestion":"Total # of Open Questions: ", 
							"AverageResponseTime":"Average Response Time: ", 
							"ShortestResponseTime":"Shortest Response Time: ", 
							"LongestResponseTime":"Longest Response Time: "
						},
				   	"fr":{
							"SearchResultsFor":"FR: Search results for ",
							"ViewMore":"FR: View more",
							"QuestionDetail":"FR: Question Detail ",
							"RecentQuestionsbyCategory":"FR: Recent Questions by Category",
							"TotalClosedQuestion":"FR: Total # of Closed Questions: ", 
							"TotalKBQuestion":"FR: Total Number of Questions in Knowledge Base: ",
							"TotalOpenQuestion":"FR: Number of Open Questions: ", 
							"AverageResponseTime":"FR: Average Response Time: ", 
							"ShortestResponseTime":"FR: Shortest Response Time: ", 
							"LongestResponseTime":"FR: Longest response Time: "
						},
				   	"de":{
							"SearchResultsFor":"DE: Search results for ",
							"ViewMore":"DE: View more",
							"QuestionDetail":"DE: Question Detail ",
							"RecentQuestionsbyCategory":"DE: Recent Questions by Category",
							"TotalClosedQuestion":"DE: Total # of Closed Questions: ", 
							"TotalKBQuestion":"DE: Total Number of Questions in Knowledge Base: ",
							"TotalOpenQuestion":"DE: Number of Open Questions: ", 
							"AverageResponseTime":"DE: Average Response Time: ", 
							"ShortestResponseTime":"DE: Shortest Response Time: ", 
							"LongestResponseTime":"DE: Longest response Time: "
						}
				  }
				};

$(document).ready(function(){
/************************************
* Function: 	Set User Language
*************************************/

	language = $('html').attr('lang').substr(0, 2);
	if($(window).width() < 800){
		$('div#alt-language').css({'margin-left':0,'left':5});
	}
	else{
		$('div#alt-language').css('margin-left', -($('div#alt-language span').length)*35);
		$('div.alt-slogan').css('margin-left', -$('div.alt-slogan').width());
	}
	
	
/************************************
* Function: 	Get list of forms on page load
*************************************/
	if($('div#form-list').length > 0){
		addLoader('div#form-list');
		//$("#form-list").html('');
		//console.log("/portals/3/skins/form-list.js");
		if($.cookie('forms-list') == null){
			$.ajax({
				//url: "/portals/3/skins/form-list.js",
				url: refTrackerUrl + "/exchange/api.asmx/AvailableForms" + "?callbackFunction=?",
				dataType: "jsonp",  
				data: {responseFormat:"100"},
				cache: true,
			    success: function(data) { 
					$("#form-list").html('');
					$("#form-list").append('<ul></ul>');
					$.each(data, function(i,item){
			    		$("#form-list ul").append('<li><a href="' + window.location.pathname + '?key=' + item.Key + '" data="' + item.Key + '">' + item.Description + '</a></li>');
			    	});	
					$.cookie.json = true;
					$.cookie('forms-list', data);	
				}  
			});
		}
		else{
			$.cookie.json = true;
			$("#form-list").html('');
			$("#form-list").append('<ul></ul>');
			$.each($.cookie('forms-list'), function(i,item){				
			   	$("#form-list ul").append('<li><a href="'  + window.location.pathname + '?key=' + item.Key + '" data="' + item.Key + '">' + item.Description + '</a></li>');
			});
		}
	}

/************************************
* Function: 	Get Status
*************************************/
	if($('div#refTracker-status').length > 0){
		addLoader('div#refTracker-status');
		$.getScript("/js/date.js", function(){
			//{"0":"closedquestioncount", "1":"totalkbcount", "2":"openquestioncount", "3":"averageresponsetime", "4":"shortresponsetime", "5":"longestresponsetime"}		
			var rtstatuses = $('div#refTracker-status').attr('data').split("|");
			var rtstatuslabels = {"closedquestioncount":strings.user[language].TotalClosedQuestion, "totalkbcount":strings.user[language].TotalKBQuestion, "openquestioncount":strings.user[language].TotalOpenQuestion, "averageresponsetime":strings.user[language].AverageResponseTime, "shortresponsetime":strings.user[language].ShortestResponseTime, "longestresponsetime":strings.user[language].LongestResponseTime};		
			//$("div#refTracker-status").html('');
			$("div#refTracker-status").append('<ul></ul>');
			$.each(rtstatuses,function(i, item){		
				$.ajax({				
					url: refTrackerUrl + "/exchange/api.asmx/SystemStatus" + "?callbackFunction=?",
					dataType: "jsonp",  
					data: {responseFormat:"100", status: item},
				    success: function(data) { 					
						$.each(data, function(index,item){
							var thisStatus = (rtstatuses[i].indexOf("time") != -1)?getRefTime(item.Status):item.Status;
				    		$("div#refTracker-status ul").append('<li title="'+ rtstatuslabels[rtstatuses[i]] + thisStatus +'" class="'+ rtstatuses[i] +'"><span class="status-label">' + rtstatuslabels[rtstatuses[i]] + '</span><br /><span class="status">' + thisStatus + '</span></li>');
				    	});		
					}  									
				});			
			});
			//$('div#refTracker-status li[class$="time"]').html(DateFormat('hh:mm:ss',new Date($(this).text())));	
			removeLoader('div#refTracker-status #loader')
		});
	}
	
/************************************
* Function: 	Get list of Categories on page load
*************************************/
	addLoader('div#category-list');
	if($.cookie('category-list') == null){
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/AvailableCategories" + "?callbackFunction=?",  
			//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
		    dataType: "jsonp",  
			data: {responseFormat:"100"},
		    success: function(data) { 
				$("#category-list").html('');
				$("#category-list").append('<ul></ul>');
				$.each(data, function(i,item){
		    		$("#category-list ul").append('<li><a href="' + refTrackerUrl + "reft100.aspx?category=" + item.ID + '" data="' + item.ID + '">' + item.Category + ' (' + item.Count + ')</a></li>');
					categories.ID[item.Category] = item.ID;
					categories.Name[item.ID] = item.Category;
		    	});
				$.cookie.json = true;
				$.cookie('category-list', data);	
				/************************************
				* Function: 	Get list of Recent Questions by Category
				*************************************/
				if($('div#recent-category').length > 0 && (getUrlVars()["stx"] == undefined && getUrlVars()["key"] == undefined && getUrlVars()["q"] == undefined)){
					addRecentByCategory(categories);					
				}			
			}  
		});  
	}else{
		$.cookie.json = true;
		$("#category-list").html('');
		$("#category-list").append('<ul></ul>');
		$.each($.cookie('category-list'), function(i,item){
    		$("#category-list ul").append('<li><a href="' + refTrackerUrl + "reft100.aspx?category=" + item.ID + '" data="' + item.ID + '">' + item.Category + ' (' + item.Count + ')</a></li>');
			categories.ID[item.Category] = item.ID;
			categories.Name[item.ID] = item.Category;
			categories.Count[item.ID] = item.Count;
    	});		
		/************************************
		* Function: 	Get list of Recent Questions by Category
		*************************************/
		if($('div#recent-category').length > 0 && (getUrlVars()["stx"] == undefined && getUrlVars()["key"] == undefined && getUrlVars()["q"] == undefined)){
			addRecentByCategory(categories);					
		}	
	}
	
/************************************
* Function: 	Get list of Recent Questions
*************************************/
	if($('div#recent-list').length > 0){
		addLoader('div#recent-list');
		recentItem = new Object();
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
			//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
		    dataType: "jsonp", 
			cache: false, 
			data: {responseFormat:"100", id:"recent", count:$('#recent-list').attr('data')?$('#recent-list').attr('data'):"5", page:"1", number:"", category:"", searchterm:"", staffname:"", answers:"1"},
		    success: function(data) { 
				$("#recent-list").html('');
				$.each(data, function(i,item){
					recentItem[i] = item;
					var recentQuestion = '<p style="margin:0px">' + item.Question.replace(/\r?\n|\r/g, "<br />").substring(0,50) + '</p><div><p style="margin:0px">' + item.Answer.replace(/\r?\n|\r/g, "<br />").substring(0,300) + '</p>';	
					if(item.Answer.length > 300 || item.Question.length > 50){
						recentQuestion += '<p style="margin:0px"><a href="' + item.Number + '" data="' + i + '">' + strings.user[language].ViewMore + '</a></p>';
					}    		
					recentQuestion += '</div>';
		    		$("#recent-list").append(recentQuestion);
		    	});		
				$( "#recent-list" ).accordion({
		            collapsible: true
		        });
				removeLoader('div#recent-list #loader');
			}  
		}); 
	}
	
/************************************
* Function: 	Get Question from link
*************************************/
	if(getUrlVars()["q"] != undefined){
		//addLoader('div#recent-list');
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
			//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
		    dataType: "jsonp",  
			data: {responseFormat:"100", id:"question", count:1, page:"1", number:getUrlVars()["q"], category:"", searchterm:"", staffname:"", answers:"1"},
		    success: function(data) { 
				$('div#refTracker-form').html('<div style="font-weight:bold;font-style:italic;font-size:1.2em">Question Detail:</div><br /><div style="font-weight:bold">'+ data[0].Question.replace(/\r?\n|\r/g, "<br />") +'</div><br /><div>'+ data[0].Answer.replace(/\r?\n|\r/g, "<br />") +'</div>');	
			}  
		}); 
	}	
	
/************************************
* Function: 	Get Search results from link
*************************************/
	if(getUrlVars()["stx"] != undefined){
		var count = (getUrlVars()["stp"] != undefined)?getUrlVars()["stp"]:"10";
		searchKB(decodeURIComponent(getUrlVars()["stx"]), count);
	}
/************************************
* Function: 	Add search box
*************************************/	
	$("div#refTracker-search").html('');
	$("div#refTracker-search").append('<div class="alt-search"><input id="refTracker-search-box" type="text" class="NormalTextBox" autocomplete="off"/><a href=""><input class="alt-search-button" type="button" value="" name="search" style="height: auto; margin-top: 7px;"></a></div>');

/************************************
* Function: 	Add Chat Widget
*************************************/	
	displayRefChatter();		

/************************************
* Function:		Load Form on New Page
* Created By: 	Jon Fackrell
* Date:			1-NOV-2012
* Copyright:    2012 Altarama Information Systems - Not distributable unless given permission from owner/author.
*
*
* Description:	We've been redirected to this page to load a form.
*
* Updated:		
*************************************/	
	if(getUrlVars()["reftform"] != undefined || getUrlVars()["key"] != undefined){
		var key = (getUrlVars()["reftform"])?getUrlVars()["reftform"]:getUrlVars()["key"];
		$('div#refTracker-form').html('<div id="loader" style="width:100%;height:100%;background-color:white;opacity:.8;text-align:center;"><img src="/images/loader.gif" style="margin:0px auto"/></div><iframe src="" frameborder="0" scrolling="no" id="my_iframe" style="width:100%;"></iframe>');
		$('#my_iframe').attr('src', refTrackerUrl + '/reft100.aspx?key=' + key + '&extmode=1&lang=' + language);
	}
	//console.log(refTrackerUrl + '/reft100.aspx?key=' + 'RefShort' + '&extmode=1');

/************************************
* Function:		Load Category
* Created By: 	Jon Fackrell
* Date:			1-NOV-2012
* Copyright:    2012 Altarama Information Systems - Not distributable unless given permission from owner/author.
*
*
* Description:	We've been redirected to this page to load Category search results.
*
* Updated:		
*************************************/	
	if(getUrlVars()["category"] != undefined){
		addLoader('div#refTracker-form');
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
			//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
		    dataType: "jsonp",  
			data: {responseFormat:"100", id:"category", count:"10", page:"1", number:"", category:getUrlVars()["category"], searchterm:"", staffname:"", answers:"1"},
		    success: function(data) {
				var questions = [];					
				$("div#refTracker-form").html('');
				$("div#refTracker-form").html('<span id="dnn_ctr705_SearchResults_lblMessage">' + strings.user[language].SearchResultsFor + '<span id="search-term"><b><i>'+ categories.Name[getUrlVars()["category"]] +'</i></b></span></span>');
				$.each(data, function(i,item){
					questions.push(item.Number);
					//console.log(item.Number);
					//if(questions.indexOf(item.Number, 0) == -1){
		    			$('div#refTracker-form').append(showQuestion(item, categories));
						$('div#refTracker-form ul.num-page li#1').addClass('active');						
					//}
			    });	
							
			},
			error: function(xhr, ajaxOptions, thrownError) { 				
		    		$('div#refTracker-form').appen('<div>Sorry the Knowledge Base cannot be searched right now.</div>');		    					
			}  
		});  				
	}
/************************************
* Function: 	Load Form 
* Created By: 	Jon Fackrell
* Date:			1-NOV-2012
* Copyright:    2012 Altarama Information Systems - Not distributable unless given permission from owner/author.
*
*
* Description:	When the user clicks a form link the from will load in the div#refTracker-form on the same page. If it's not there then
*				the user will be rediredcted to ContactForm.aspx where the the div should be and the form will load.
*
* Updated:		Added check for div#refTracker-form if italics not there then go to ContactUs.aspx and load form
*************************************/

	$(document).on( 'click', 'div#form-list a, div.needs-js a, span.form-link a', function(event) {
			event.preventDefault();
			if($('div#refTracker-form').length > 0){
				$('div#refTracker-form').html('<div id="loader" style="width:100%;height:100%;background-color:white;opacity:.8;text-align:center;"><img src="/images/loader.gif" style="margin:0px auto"/></div><iframe src="" frameborder="0" scrolling="no" id="my_iframe" style="width:100%;"></iframe>');
				var key = encodeURIComponent(($(this).attr('data'))?$(this).attr('data'):getLinkVars($(this).attr('href'))["key"]);
				$('#my_iframe').attr('src', refTrackerUrl + "/reft100.aspx?key=" + key + '&extmode=1&lang=' + language);				
				$('html, body').animate({
					scrollTop: $("div#refTracker-form").offset().top-60
				}, 750);
			}
			else{
				var key = ($(this).attr('data'))?$(this).attr('data'):getLinkVars($(this).attr('href'))["key"];
				window.location = "ContactForm.aspx?reftform=" + key;
			}
	});

/************************************
* Function: 	Load Questions by Category
* Created By: 	Jon Fackrell
* Date:			1-NOV-2012
* Copyright:    2012 Altarama Information Systems - Not distributable unless given permission from owner/author.
*
*
* Description:	When the user clicks a form link the from will load in the div#refTracker-form on the same page. If it's not there then
*				the user will be rediredcted to ContactForm.aspx where the the div should be and the form will load.
*
* Updated:		Added check for div#refTracker-form if italics not there then go to ContactUs.aspx and load form
*************************************/

	$(document).on( 'click', 'div#category-list a, a.category', function(event) {
			event.preventDefault();
			addLoader('div#refTracker-form');
			var cat = $(this).text().replace(/[\d\(\)\-]+/gi, "");
			$('html, body').animate({
				scrollTop: $("div#refTracker-form").offset().top-60
			}, 750);
			if($('div#refTracker-form').length > 0){				
				$.ajax({  
				    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
					//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
				    dataType: "jsonp",  
					data: {responseFormat:"100", id:"category", count:"10", page:"1", number:"", category:$(this).attr('data'), searchterm:"", staffname:"", answers:"1"},
				    success: function(data) {
						var questions = [];		
						var resultsTotal = data[0].RecCount;			
						$("div#refTracker-form").html('');						
						$("div#refTracker-form").html('<span id="dnn_ctr705_SearchResults_lblMessage">' + strings.user[language].SearchResultsFor + '<span id="search-term"><b><i>'+ cat +'</i></b></span></span>');				
						$.each(data, function(i,item){
							questions.push(item.Number);						
							//if(questions.indexOf(item.Number, 0) == -1){								
				    			$('div#refTracker-form').append(showQuestion(item, categories));						
							//}
					    });	
						$('div#refTracker-form').append(showPagination(resultsTotal,10,"category"));
						$('div#refTracker-form ul.num-page li#1').addClass('active');
									
					},
					error: function(xhr, ajaxOptions, thrownError) { 				
				    		$('div#refTracker-form').append('<div>Sorry the Knowledge Base cannot be searched right now.</div>');		    					
					}  
				});  				
			}
			else{
				window.location = "KnowledgeBaseSearchResults.aspx?category=" + $(this).attr('data');
			}
	});
	  
/************************************
* Function: 	Get list of possible matches
*************************************/
	searchItem = new Object();
	$('#refTracker-search-box').keypress(function(event) {
	  if ($('#refTracker-search-box').val().length > 1) {
	  		if ( event.which == 13 ) {
     			event.preventDefault();
				searchKB($('#refTracker-search-box').val(),"10");
   			}else{
				$.ajax({
			          type: "GET",
					  url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",
					  dataType: "jsonp",
					  data: {responseFormat:"100", id:"kb", count:"5", page:"1", number:"", category:"", searchterm:$('#refTracker-search-box').val()+"*", staffname:"", answers:"1"},
			          success: function(data){
					  				$("#as-results").remove();
									$("#refTracker-search").append('<div class="as-results" id="as-results" style="display: block;z-index:1000000;position:absolute"><ul class="as-list" style="width: 300px;z-index: 1000000;position:absolute"></ul></div>');
									var offset = ($('#refTracker-search').width()-$('#refTracker-search-box').width()+24)/2;
									$('div.as-results').css({'left': offset + 'px'});
									$.each(data, function(i,item){
										searchItem[i] = item;
							    		$("#refTracker-search ul").append('<li class="as-result-item" id="as-result-item-'+ i +'" data="' + i + '">' + item.Question + '</li>').mouseleave(function(){
								      		$("#as-results").remove();
											 
										});
										$('li.as-result-item').hover(
											function(){
									      		$(this).css('background-color', $('.alt-nav').css('background-color'));											 
											},
											function(){
									      		$(this).css('background-color', '#FFFFFF');											 
											}
										);
										return (this != "four"); // will stop running to skip "five"
							    	});
									//$("#refTracker-search").append('</ul></div>');							
								},
					   error: function(xhr, ajaxOptions, thrownError){
					  				//console.log(data);
									$("div#refTracker-search").html('<ul"><li>Error</li></ul>');
									//console.log(xhr.status);
			        				//console.log(thrownError);		          				
								}
				});
			}
		}
	});


/************************************
* Function: 	Load QR Code
*************************************/
	  
	  $('a#qrcode').html('<img class="qrcode" src="https://chart.googleapis.com/chart?cht=qr&chl=' + encodeURIComponent(window.location.href) + '&choe=UTF-8&chs=180x180&chld=L|0" width="34px" height="34px"/>');
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
  
		  
		  
		  
		  
/************************************
* End $(document).ready()
*************************************/		  
 });
 
 $(document).on("click", "#refTracker-search ul", function(event){
	$("#as-results").remove();
});
 /************************************
* Function Register search list clicks
*************************************/	
 $(document).on("click", "li.as-result-item", function(event){
	event.preventDefault();			
	//console.log('Clicked Search Result');
	var itemNum = $(this).attr('data');						
	//window.location = $(this).attr('data');
	$('html, body').animate({
		scrollTop: $("div#refTracker-form").offset().top-60
	}, 750);
	$('div#refTracker-form').html(showQuestion(searchItem[itemNum], categories));
	//$('div#refTracker-form').html('<div>'+ decodeURI(searchItem[itemNum].Question) +'</div>');
});

/************************************
* Function Show Single Question with Answer
*************************************/	
 $(document).on("click", "div#recent-list a", function(event){
	event.preventDefault();
	addLoader('div#refTracker-form');
				
	//console.log('Clicked Search Result');
	var recentNum = $(this).attr('data');						
	//window.location = $(this).attr('data');
	if($('div#refTracker-form').length > 0){
		$('html, body').animate({
			scrollTop: $("div#refTracker-form").offset().top-60
		}, 750);
		$('div#refTracker-form').html(showQuestion(recentItem[recentNum], categories));
	}
	else{
		var html = '';
		html += '	<p style="font-weight: bold;">' + recentItem[recentNum].Question + '</p>';
		html += '	<hr style="width: 96%; margin 0px auto;"/>';
		html += '		<p class="answer">' + recentItem[recentNum].Answer  + '</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
		if(recentItem[recentNum].Key){
			html += '			<span class="form-link" style="position: absolute; right: 10px; bottom: 10px;"><a href="' + recentItem[recentNum].Key + '" data="' + recentItem[recentNum].Key + '">Ask a question with this form</a></span>';
		}
		
		var tag = $('<div title="' + strings.user[language].QuestionDetail + '" id="recent-dialog"></div>');	
		tag.html(html).dialog({modal: true}).dialog('open');
	}
	
	//$('div#refTracker-form').html('<div style="font-weight:bold;font-style:italic;font-size:1.2em">Question Detail:</div><br /><div style="font-weight:bold">'+ recentItem[recentNum].Question.replace(/\r?\n|\r/g, "<br />") +'</div><br /><div>'+ recentItem[recentNum].Answer.replace(/\r?\n|\r/g, "<br />") +'</div>');
	//window.location.hash = '?question=' + recentItem[recentNum].Number + window.location.hash;
});

/************************************
* Function Show Single Question with Answer from recent Questions by Category
*************************************/	
 $(document).on("click", "div#recent-category li a", function(event){
	event.preventDefault();
	addLoader('div#refTracker-form');
				
	//console.log('Clicked Search Result');
	var questionNum = $(this).attr('data');						
	//window.location = $(this).attr('data');
	if($('div#refTracker-form').length > 0){
		$('html, body').animate({
			scrollTop: $("div#refTracker-form").offset().top-60
		}, 750);
		$('div#refTracker-form').html(showQuestion(recentCatItem[questionNum], categories));
	}
	
	//$('div#refTracker-form').html('<div style="font-weight:bold;font-style:italic;font-size:1.2em">Question Detail:</div><br /><div style="font-weight:bold">'+ recentItem[recentNum].Question.replace(/\r?\n|\r/g, "<br />") +'</div><br /><div>'+ recentItem[recentNum].Answer.replace(/\r?\n|\r/g, "<br />") +'</div>');
	//window.location.hash = '?question=' + recentItem[recentNum].Number + window.location.hash;
});
/************************************
* Function Show QR Code in Modal Window
*************************************/	
 $(document).on("click", "img.qrcode", function(event){
	event.preventDefault();			
	//$.getScript("/dotnetnuke/Portals/3/Skins/jquery.simplemodal.1.4.3.min.js", function(){
   	//	console.log("Running SimpleModal.js");
	//});
	//console.log('Clicked QR Code');	
	$.modal('<p title="Scan to visit on your Phone"><img class="qrcode" src="https://chart.googleapis.com/chart?cht=qr&chl=' + encodeURIComponent(window.location.href) + '&choe=UTF-8&chs=180x180&chld=L|0" width="300px" height="300px" /></p>',
		{opacity:80,
		 containerCss:{
			 backgroundColor:"#fff", 
			 borderColor:"#fff", 
			 height:320, 
			 padding:0, 
			 width:320
		 },
		 overlayClose:true
		});
});


/************************************
* Function Pagination Click
*************************************/	
 $(document).on("click", "ul.num-page a", function(event){
	event.preventDefault();			
	var page =  $(this).parent().attr('id');
	var count = $(this).parent().siblings('.first').attr('data');;
	switch(page){
		case "next-page":
			page = parseInt($('ul.num-page li.active').attr('id'))+1;
			break;
		case "last-page":
			page = parseInt($('ul.num-page li').length)-3;
			break;
		default:
			//page = $(this).parent().attr('id');
			
	}
	var searchParameters = {"responseFormat":"100", "id":"category", "count":count, "page":page, "number":"", "category":"", "searchterm":"", "staffname":"", "answers":"1"};
	searchParameters.id = $(this).parent().parent().attr('data');
	if($(this).parent().parent().attr('data') == "category"){		
		var catid = $('span#search-term').text().trim();
		searchParameters.category = (categories.ID[catid])?categories.ID[catid]:"";
	}
	else{		
		searchParameters.searchterm = $("div#refTracker-form span#dnn_ctr705_SearchResults_lblMessage span#search-term").text();
	}	
	//console.log(searchParameters.category);
	getQuestionsByCategory(searchParameters, categories);
});

/************************************
* Search the Knowledge Base
*************************************/
function searchKB(searchTerm, questionCount){
	$.ajax({
          type: "GET",
		  url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",
		  dataType: "jsonp",
		  data: {responseFormat:"100", id:"kb", count:questionCount, page:"1", number:"", category:"", searchterm:searchTerm, staffname:"", answers:"1"},
          success: function(data){					  				
				var questions = [];		
				if(data.length > 0){
					var resultsTotal = data[0].RecCount;
				}									
				$("#as-results").remove();		
				$("div#refTracker-form").html('');						
				$("div#refTracker-form").html('<span id="dnn_ctr705_SearchResults_lblMessage">' + strings.user[language].SearchResultsFor + '<span id="search-term"><b><i>'+ searchTerm +'</i></b></span></span>');				
				if(data.length > 0){
					$.each(data, function(i,item){
						questions.push(item.Number);						
						//if(questions.indexOf(item.Number, 0) == -1){								
			    			$('div#refTracker-form').append(showQuestion(item, categories));						
						//}
				    });	
					//alert(resultsTotal + ":" + questionCount);
					$('div#refTracker-form').append(showPagination(resultsTotal,questionCount,"kb"));
					$('div#refTracker-form ul.num-page li#1').addClass('active');		
				}
				else{
					noResults = {Question:"No records were found which matched the search criteria.",Answer:"Try searching another word or ask us a new question."};
					$('div#refTracker-form').append(showQuestion(noResults, categories));
				}					
			},
		   	error: function(xhr, ajaxOptions, thrownError){
		  				//console.log(data);
						$("div#refTracker-search").html('<ul"><li>Error</li></ul>');
						//console.log(xhr.status);
        				//console.log(thrownError);		          				
					}
	});
}
/************************************
* Display RefChatter Widget
*************************************/
function displayRefChatter(){
	if($('div#refChatter-widget').length > 0){
		$('div#refChatter-widget').html('<div class="needs-js"></div>');
		var chatId = $('div#refChatter-widget').attr('data');
		(function() {
			var x = document.createElement("script"); x.type = "text/javascript"; x.async = true;
		    x.src = (document.location.protocol === "https:" ? "https://" : "http://") + refChatterUrl + "/js/libraryh3lp.js?" + chatId;
		    var y = document.getElementsByTagName("script")[0]; y.parentNode.insertBefore(x, y);
			//console.log("Chat Widget Loaded");			
		})();
	}	
}

/************************************
* Add Recent Questions By Category
*************************************/
function addRecentByCategory(categories){
	addLoader('div#recent-category');
	var count = 0;
	recentCatItem = new Object();
	$("div#recent-category").append('<h2>' + strings.user[language].RecentQuestionsByCategory + '</h2><br />');
	$.each(categories.ID, function(i,item){					
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
		    dataType: "jsonp", 
			cache: true, 
			data: {responseFormat:"100", id:"recent", count:"3", page:"1", number:"", category:item, searchterm:"", staffname:"", answers:"1"},
		    success: function(data) { 
				$("div#recent-category").append('<div id="'+ item +'" class="category-questions"><span><a href="" data="'+ item +'" class="category">' + categories.Name[item] + ' (' + categories.Count[item] + ')</a></span></div>');							
				$('div#recent-category div#'+ item +'').append('<ul></ul>');
				$.each(data, function(i,question){			
					recentCatItem[count] = question;			
		    		$('div#recent-category div#'+ item +' ul').append('<li><a href="' + window.location.pathname + '?q=' + question.Number + '" data="' + count + '">' + question.Question.replace(/\r?\n|\r/g, "<br />").substring(0,40) + '</a></li>');
					count++;
		    	});		
				removeLoader('div#recent-category #loader');
			}  
		}); 
});	
}
/************************************
* Show Question Detail
*************************************/
function showQuestion(question,categories){
	var html = '';
	html += '<div class="question-box">';
	html += '	<div class="title">';
	if(question.Number){
		//html += '		<span class="number">' + question.Number + '</span>';
	}
	html += '		<span class="question">' + question.Question.replace(/\r?\n|\r/g, "<br />") + '</span>';
	html += '	</div>';
	html += '	<div class="content">';
	html += '		<div class="answer">' + question.Answer.replace(/\r?\n|\r/g, "<br />")  + '</div><div style="clear:both;height:14px"></div>';
	html += '		<div style="clear:both;"></div><div class="details">';
	if(question.Category){
		html += '			<span class="categories">' + splitCategories(question.Category, categories) + '</span>';
	}	
	if(question.Key){
		html += '			<span class="form-link"><a href="' + question.Key + '" data="' + question.Key + '">Ask a question with this form</a></span>';
	}
	html += '		<div style="clear:both;"></div></div>';
	html += '	</div>';
	html += '</div>';
	return html;
}

/************************************
* Show Pagination
*************************************/
function showPagination(count,num,id){
	var html = '';
	if(parseInt(count) > parseInt(num)){	
		var pages = 1;
		pages = Math.ceil(count/num);
		html += '<ul class="num-page" id="navigate" data="' + id + '">';
		html += '	<li class="first" data="'+ num +'">' + pages + ' pages</li>';		
		
		for(var i=1; i <= pages; i++){
			html += '<li id="' + i + '"><a href="">' + i + '</a></li>';
		}	
		
		html += '	<li id="next-page"><a href="" title="next page">&gt;</a></li>';
		html += '	<li id="last-page"><a href="" title="last page">&gt;&gt;</a></li>';
		//html += '	<li class="lastInfo">Latest news: Monday, October 20, 2008 22:45</li>';
		html += '</ul>';
		return html;
	}
}

/************************************
* Get Questions by Category
*************************************/
function getQuestionsByCategory(searchData, categories){
	$('html, body').animate({
		scrollTop: $("div#refTracker-form").offset().top-60
	}, 750);
	$.ajax({  
	    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
		//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
	    dataType: "jsonp",  
		data: searchData,
	    success: function(data) {
			var questions = [];		
			var resultsTotal = data[0].RecCount;	
			var searchTerm = $("div#refTracker-form span#dnn_ctr705_SearchResults_lblMessage");
			$("div#refTracker-form").html(searchTerm);								
			$.each(data, function(i,item){
				questions.push(item.Number);						
				//if(questions.indexOf(item.Number, 0) == -1){								
	    			$('div#refTracker-form').append(showQuestion(item, categories));						
				//}
		    });	
			$('div#refTracker-form').append(showPagination(resultsTotal,searchData.count,searchData.id));	
			$('div#refTracker-form ul.num-page li#'+searchData.page).addClass('active');						
		},
		error: function(xhr, ajaxOptions, thrownError) { 				
	    		$('div#refTracker-form').append('<div>Sorry the Knowledge Base cannot be searched right now.</div>');		    					
		}  
	});  		
}

/************************************
* Get URL Variables
*************************************/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function getLinkVars(link) {
    var vars = {};
    var parts = link.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function splitCategories(categories, categoryLookup){
	var links = '';	
	var tempCategories = categories.split('|');
	for(var i=0,len=tempCategories.length; i<len; i++){	
		if(i > 0 && i < len){
			links += " | ";
		}	
		links += '<a href="'+tempCategories[i]+'" data="'+categoryLookup.ID[tempCategories[i]]+'" class="category">'+tempCategories[i]+'</a>';
		
	};
	return links;
}
function addLoader(div) {
	//console.log('Loader Added');
    $(div).html('<div id="loader" style="width:100%;height:100%;background-color:white;opacity:.8;text-align:center;"><img src="/images/loader.gif" style="margin:0px auto"/></div>');
}
function removeLoader(div) {
    $(div).remove();
}
function getRefTime(time){
	var newTime;
	if(time >=10 && time <= 86400){
		newTime = (new Date).clearTime().addSeconds(time).toString('H') + " hrs";
		newTime += " ";
		newTime += (new Date).clearTime().addSeconds(time).toString('mm') + " mins";
	}
	else if(time < 10){
		newTime = '< 10 min';
	}
	else{
		var days = parseInt(time / 86400);
		if(days < 2){
			newTime = days + ' day';
		}else{
			newTime = days + ' days';
		}			
	}
	return newTime;
}
/************************************
* Catch Javascript Erros
*************************************/
window.onerror = function(errorMsg, url, lineNumber) {
    //alert("Uncaught error " + errorMsg + " in " + url + ", line " + lineNumber);
	if(errorMsg == '' && lineNumber == 40){
		displayRefChatter();
	}
};

/*jshint eqnull:true */
/*!
 * jQuery Cookie Plugin v1.2
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
			if (decode(parts.shift()) === key) {
				var cookie = decode(parts.join('='));
				return config.json ? JSON.parse(cookie) : cookie;
			}
		}

		return null;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};

})(jQuery, document);