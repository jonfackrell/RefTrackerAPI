﻿var refTrackerUrl = 'http://trunkclientws.altarama.com';
var refChatterUrl = 'ca.refchatter.net';
var thesaurusKey = '43a7235761673bc6de5e3efca0c29d21';
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
							"TotalKBQuestion":"Total # of Knowledge Base Questions: ",
							"TotalOpenQuestion":"Total # of Open Questions: ", 
							"AverageResponseTime":"Average Response Time: ", 
							"ShortestResponseTime":"Shortest Response Time: ", 
							"LongestResponseTime":"Longest Response Time: ",
							"AskSimilarQuestion":"Ask a similar question",
							"NoResults":"No records were found which matched the search criteria.",
							"TrySearchingAgain":"Try searching another word or ask us a new question.",
							"SimilarSearchTerms":"Suggested Search Terms: "
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
							"LongestResponseTime":"FR: Longest response Time: ",
							"AskSimilarQuestion":"FR: Ask a similar question",
							"NoResults":"FR: No records were found which matched the search criteria.",
							"TrySearchingAgain":"FR: Try searching another word or ask us a new question.",
							"SimilarSearchTerms":"FR: Suggested Search Terms: "
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
							"LongestResponseTime":"DE: Longest response Time: ",
							"AskSimilarQuestion":"DE: Ask a similar question",
							"NoResults":"DE: No records were found which matched the search criteria.",
							"TrySearchingAgain":"DE: Try searching another word or ask us a new question.",
							"SimilarSearchTerms":"DE: Suggested Search Terms: "
						}
				  }
				};

$(document).ready(function(){

language = $('html').attr('lang').substr(0, 2);	
displayRefChatter();	
loadFormsList();	
loadRefTrackerStatus();
loadCategoryList();
loadRecentQuestions();
loadFrequentQuestions();
loadRefTrackerSearchBox();
processUrlVariables();
repositionHeader();
loadQRCode();

		  
		  
		  
  
		  
		  
	  
/************************************
* End $(document).ready()
*************************************/		  
});

/************************************
* Begin Register Events
*
*************************************/	

// Remove the dropdown search results
$(document).on("click", "#refTracker-search ul", function(event){
	$("#as-results").remove();
});

// Function Register search list clicks	
 $(document).on("click", "div#suggested-terms li.as-result-item", function(event){
	event.preventDefault();			
	var item = $(this).attr('data');						
	$('html, body').animate({
		scrollTop: $("div#refTracker-form").offset().top-60
	}, 750);
	$("#suggested-terms").remove();
	searchKB(item, "10");
});


// Function Register search list clicks	
 $(document).on("click", "li.as-result-item", function(event){
	event.preventDefault();			
	var itemNum = $(this).attr('data');	
	$('html, body').animate({
		scrollTop: $("div#refTracker-form").offset().top-60
	}, 750);
	$('div#refTracker-form').html(showQuestion(searchItem[itemNum], categories));
});

// Function Show Single Question with Answer	
 $(document).on("click", "div#recent-list a", function(event){
	event.preventDefault();
	addLoader('div#refTracker-form');
	var recentNum = $(this).attr('data');						
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
});

// Function Show Single Question with Answer from recent Questions by Category
$(document).on("click", "div#recent-category li a", function(event){
	event.preventDefault();
	addLoader('div#refTracker-form');
	var questionNum = $(this).attr('data');						
	if($('div#refTracker-form').length > 0){
		$('html, body').animate({
			scrollTop: $("div#refTracker-form").offset().top-60
		}, 750);
		$('div#refTracker-form').html(showQuestion(recentCatItem[questionNum], categories));
	}	
});


// Function Show QR Code in Modal Window	
$(document).on("click", "img.qrcode", function(event){
	event.preventDefault();			
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

// Function Pagination Click
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
	getQuestionsByCategory(searchParameters, categories);
});

// Function: 	Load Form 
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
		window.location = "ContactForm.aspx?key=" + key;
	}
});

// Function: 	Load Questions by Category
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
		    dataType: "jsonp",  
			data: {responseFormat:"100", id:"category", count:"10", page:"1", number:"", category:$(this).attr('data'), searchterm:"", staffname:"", answers:"1"},
		    success: function(data) {
				var questions = [];		
				var resultsTotal = data[0].RecCount;			
				$("div#refTracker-form").html('');						
				$("div#refTracker-form").html('<span id="dnn_ctr705_SearchResults_lblMessage">' + strings.user[language].SearchResultsFor + '<span id="search-term"><b><i>'+ cat +'</i></b></span></span>');				
				$.each(data, function(i,item){
					questions.push(item.Number);						
		    			$('div#refTracker-form').append(showQuestion(item, categories));						
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
* Function: 	Search Knowledge Base
* Notes:        This is a complex search function the will return the first five matches from the KB.
*				If no results are returned then a lookup is performed to find synonyms from a thesaurus service.
*				If the user clicks "Enter" then a full list of result is displayed in the <div id="reftracker-form"></div> 				
*************************************/
searchItem = new Object();
$('#refTracker-search-box').keyup(function(event) {
	var searchTerm = $('#refTracker-search-box').val();
	if(event.keyCode == 8){
		//searchTerm = searchTerm.substring(0,searchTerm.length - 1);
	}
  	if ((searchTerm.length > 1 && event.keyCode != 8) || (searchTerm.length > 2)) {
  		if ( event.which == 13 ) {
 			event.preventDefault();
			searchKB(searchTerm,"10");
		}else{
			quickLookup(searchTerm);
		}
	}
	else{
		$("#as-results").remove();
	}
});




/************************************
* End Register Events
* Begin Functions
*************************************/	

/************************************
* Function: 	Get list of forms on page load
*************************************/
function loadFormsList(){
	if($('div#form-list').length > 0){
		addLoader('div#form-list');
		if($.cookie('forms-list') == null){
			$.ajax({
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
}

/************************************
* Function: 	Get Status
*************************************/
function loadRefTrackerStatus(){
	if($('div#refTracker-status').length > 0){
			addLoader('div#refTracker-status');
			$.getScript("/js/date.js", function(){
				var rtstatuses = $('div#refTracker-status').attr('data').split("|");
				var rtstatuslabels = {	"closedquestioncount":strings.user[language].TotalClosedQuestion, 
										"totalkbcount":strings.user[language].TotalKBQuestion, 
										"openquestioncount":strings.user[language].TotalOpenQuestion, 
										"averageresponsetime":strings.user[language].AverageResponseTime, 
										"shortresponsetime":strings.user[language].ShortestResponseTime, 
										"longestresponsetime":strings.user[language].LongestResponseTime
									};
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
				removeLoader('div#refTracker-status #loader')
			});
	}
}

/************************************
* Function: 	Get list of Categories on page load
*************************************/
function loadCategoryList(){
	addLoader('div#category-list');
	if($.cookie('category-list') == null){
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/AvailableCategories" + "?callbackFunction=?",  
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
				// Get list of Recent Questions by Category			
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
		// Get list of Recent Questions by Category	
		if($('div#recent-category').length > 0 && (getUrlVars()["stx"] == undefined && getUrlVars()["key"] == undefined && getUrlVars()["q"] == undefined)){
			addRecentByCategory(categories);					
		}	
	}
}	

/************************************
* Function: 	Get list of Recent Questions
*************************************/
function loadRecentQuestions(){
	if($('div#recent-list').length > 0){
		addLoader('div#recent-list');
		recentItem = new Object();
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
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
}	

/************************************
* Function: 	Get list of Frequent Questions
*************************************/
function loadFrequentQuestions(){
	if($('div#frequent-list').length > 0){
		addLoader('div#frequent-list');
		if($.cookie('frequent-list') == null){
			frequentItem = new Object();
			var frequentQuestions = $('#frequent-list').attr('data');
			$.ajax({  
			    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
				//url: "http://search.jonfackrell.com/json.php" + "?callback=?",
			    dataType: "jsonp", 
				cache: false, 
				data: {responseFormat:"100", id:"frequent", count:"10", page:"1", number:frequentQuestions, category:"", searchterm:"", staffname:"", answers:"1"},
			    success: function(data) { 
					$("#frequent-list").html('');
					$.each(data, function(i,item){
						frequentItem[i] = item;
						var frequentQuestion = '<p style="margin:0px">' + item.Question.replace(/\r?\n|\r/g, "<br />") + '</p><div><p style="margin:0px">' + item.Answer.replace(/\r?\n|\r/g, "<br />") + '</p>';
						frequentQuestion += '</div>';
			    		$("#frequent-list").append(frequentQuestion);
			    	});											
					removeLoader('div#frequent-list #loader');
					$( "#frequent-list" ).accordion({
			            collapsible: true
			        });	
				}  
			}); 
		}
		else{
			$.cookie.json = true;
			$("#frequent-list").html('');
			$.each($.cookie('frequent-list'), function(i,item){				
			   	var frequentQuestion = '<p style="margin:0px">' + item.Question.replace(/\r?\n|\r/g, "<br />") + '</p><div><p style="margin:0px">' + item.Answer.replace(/\r?\n|\r/g, "<br />") + '</p>'; 		
				frequentQuestion += '</div>';
	    		$("#frequent-list").append(frequentQuestion);
			});
			$( "#frequent-list" ).accordion({
	            collapsible: true
	        });
			removeLoader('div#frequent-list #loader');
		}
	}
}		

/************************************
* Function: 	Add search box
*************************************/	
function loadRefTrackerSearchBox(){
	$("div#refTracker-search").html('');
	$("div#refTracker-search").append('<div class="alt-search"><input id="refTracker-search-box" type="text" class="NormalTextBox" autocomplete="off"/><a href=""><input class="alt-search-button" type="button" value="" name="search" style="height: auto; margin-top: 7px;"></a></div>');
}

/************************************
* Function: 	Process all Url Variables
*************************************/
function processUrlVariables(){
/************************************
* Get Question from link
*************************************/
	if(getUrlVars()["q"] != undefined){
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
		    dataType: "jsonp",  
			data: {responseFormat:"100", id:"question", count:1, page:"1", number:getUrlVars()["q"], category:"", searchterm:"", staffname:"", answers:"1"},
		    success: function(data) { 
				$('div#refTracker-form').html('<div style="font-weight:bold;font-style:italic;font-size:1.2em">Question Detail:</div><br /><div style="font-weight:bold">'+ data[0].Question.replace(/\r?\n|\r/g, "<br />") +'</div><br /><div>'+ data[0].Answer.replace(/\r?\n|\r/g, "<br />") +'</div>');	
			}  
		}); 
	}	

/************************************
* Get Search results from link
*************************************/
	if(getUrlVars()["stx"] != undefined){
		var count = (getUrlVars()["stp"] != undefined)?getUrlVars()["stp"]:"10";
		searchKB(decodeURIComponent(getUrlVars()["stx"]), count);
	}

/************************************
* Load Form on New Page
*************************************/	
	if(getUrlVars()["reftform"] != undefined || getUrlVars()["key"] != undefined){
		var key = (getUrlVars()["reftform"])?getUrlVars()["reftform"]:getUrlVars()["key"];
		$('div#refTracker-form').html('<div id="loader" style="width:100%;height:100%;background-color:white;opacity:.8;text-align:center;"><img src="/images/loader.gif" style="margin:0px auto"/></div><iframe src="" frameborder="0" scrolling="no" id="my_iframe" style="width:100%;"></iframe>');
		$('#my_iframe').attr('src', refTrackerUrl + '/reft100.aspx?key=' + key + '&extmode=1&lang=' + language);
	}

/************************************
* Load Category
*************************************/	
	if(getUrlVars()["category"] != undefined){
		addLoader('div#refTracker-form');
		$.ajax({  
		    url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",  
		    dataType: "jsonp",  
			data: {responseFormat:"100", id:"category", count:"10", page:"1", number:"", category:getUrlVars()["category"], searchterm:"", staffname:"", answers:"1"},
		    success: function(data) {
				var questions = [];					
				$("div#refTracker-form").html('');
				$("div#refTracker-form").html('<span id="dnn_ctr705_SearchResults_lblMessage">' + strings.user[language].SearchResultsFor + '<span id="search-term"><b><i>'+ categories.Name[getUrlVars()["category"]] +'</i></b></span></span>');
				$.each(data, function(i,item){
					questions.push(item.Number);
	    			$('div#refTracker-form').append(showQuestion(item, categories));
					$('div#refTracker-form ul.num-page li#1').addClass('active');						
			    });	
							
			},
			error: function(xhr, ajaxOptions, thrownError) { 				
		    		$('div#refTracker-form').appen('<div>Sorry the Knowledge Base cannot be searched right now.</div>');		    	
			}  
		});  				
	}
}

/************************************
* Function: 	Load QR Code
*************************************/
function loadQRCode(){
	  $('a#qrcode').html('<img class="qrcode" src="https://chart.googleapis.com/chart?cht=qr&chl=' + encodeURIComponent(window.location.href) + '&choe=UTF-8&chs=180x180&chld=L|0" width="34px" height="34px"/>');
}


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
				$("#suggested-terms").remove();		
				$("div#refTracker-form").html('');						
				$("div#refTracker-form").html('<span id="dnn_ctr705_SearchResults_lblMessage">' + strings.user[language].SearchResultsFor + '<span id="search-term"><b><i>'+ searchTerm +'</i></b></span></span>');				
				if(data.length > 0){
					$.each(data, function(i,item){
						questions.push(item.Number);						
			    			$('div#refTracker-form').append(showQuestion(item, categories));						
				    });	
							
				}
				else{
					noResults = {Question:strings.user[language].NoResults, Answer:strings.user[language].TrySearchingAgain};
					$('div#refTracker-form').append(showQuestion(noResults, categories));
				}
				thesaurusLookup(searchTerm,"0");
				$('div#refTracker-form').append(showPagination(resultsTotal,questionCount,"kb"));
				$('div#refTracker-form ul.num-page li#1').addClass('active');
							
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
		html += '			<span class="form-link"><a href="' + question.Key + '" data="' + question.Key + '">'+ strings.user[language].AskSimilarQuestion +'</a></span>';
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
	html += '<ul class="num-page" id="navigate" data="' + id + '">';
	if(parseInt(count) > parseInt(num)){	
		var pages = 1;
		pages = Math.ceil(count/num);
		
		html += '	<li class="first" data="'+ num +'">' + pages + ' pages</li>';		
		
		for(var i=1; i <= pages; i++){
			html += '<li id="' + i + '"><a href="">' + i + '</a></li>';
		}	
		
		html += '	<li id="next-page"><a href="" title="next page">&gt;</a></li>';
		html += '	<li id="last-page"><a href="" title="last page">&gt;&gt;</a></li>';
		html += '</ul>';		
	}
	return html;
}

/************************************
* Quick Lookup
*************************************/
function quickLookup(searchTerm){
	$.ajax({
          type: "GET",
		  url: refTrackerUrl + "/exchange/api.asmx/Search" + "?callbackFunction=?",
		  dataType: "jsonp",
		  data: {responseFormat:"100", id:"kb", count:"5", page:"1", number:"", category:"", searchterm:searchTerm + "*", staffname:"", answers:"1"},
          success: function(data){
  				if(data.length > 0){
					$("#as-results").remove();
					$("#suggested-terms").remove();
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
				}
				else{				
					
					$("#as-results").remove();
					$("#suggested-terms").remove();
					thesaurusLookup(searchTerm, "1");						
					
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
* Thesaurus Lookup
*************************************/
function thesaurusLookup(searchTerm, displayData){
	if(language == 'en'){
		$.ajax({  
		    url: 'http://words.bighugelabs.com/api/2/'+ thesaurusKey +'/'+ searchTerm +'/json',  
		    dataType: "jsonp",  
		    success: function(data) { 
				if(displayData == "1"){
					$("#suggested-terms").remove();
					$("#refTracker-search").append('<div class="as-results" id="suggested-terms" style="display: block;z-index:1000000;position:absolute"><ul class="as-list" style="width: 300px;z-index: 1000000;position:absolute"></ul></div>');
					var offset = ($('#refTracker-search').width()-$('#refTracker-search-box').width()+24)/2;
					$('div.as-results').css({'left': offset + 'px'});
					$.each(data, function(k,obj){
						$.each(obj, function(j,type){
							$.each(type, function(i,item){
								searchItem[i] = item;
					    		$("#refTracker-search ul").append('<li class="as-result-item" id="as-result-item-'+ i +'" data="' + item + '">' + item + '<span style="float:right;">('+ k + ':' + j +')</span></li>').mouseleave(function(){
						      		$("#suggested-terms").remove();
									 
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
						});
				    });	
				} 
				else{
					showSimilarTerms(data);
				} 
			}
		});
	}
	else{
		$("#as-results").remove();
	}
}
/************************************
* Show Similar Terms
*************************************/
function showSimilarTerms(similarTerms){
	html = '	<div class="title">';
	html += '		<span class="question">'+ strings.user[language].SimilarSearchTerms +'</span>';
	html += '	</div>';
	$("#refTracker-form #navigate").before('<div class="question-box" id="similarTerms">'+ html +'<ul></ul></div>');
	$.each(similarTerms, function(k,obj){
		$.each(obj, function(j,type){
			$.each(type, function(i,item){
				searchItem[i] = item;
	    		$("div#similarTerms ul").append('<li class="" id="'+ i +'" data="' + item + '">' + item + '<span>('+ k + ':' + j +')</span></li>');				
				return (i != 3); // will stop running to skip "five"
			});			
		});		
    });		
	$("div#similarTerms ul li").click(function(){
		searchKB($(this).attr('data'), "10");
	});
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
	    dataType: "jsonp",  
		data: searchData,
	    success: function(data) {
			var questions = [];		
			var resultsTotal = data[0].RecCount;	
			var searchTerm = $("div#refTracker-form span#dnn_ctr705_SearchResults_lblMessage");
			$("div#refTracker-form").html(searchTerm);								
			$.each(data, function(i,item){
				questions.push(item.Number);						
    			$('div#refTracker-form').append(showQuestion(item, categories));						
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
* Function: 	Set User Language
*************************************/
function repositionHeader(){
	if($(window).width() < 800){
		$('div#alt-language').css({'margin-left':0,'left':5});
	}
	else{
		$('div#alt-language').css('margin-left', -($('div#alt-language').width()));
		$('div.alt-slogan').css('margin-left', -$('div.alt-slogan').width());
	}
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
	if(lineNumber == 40){
		//displayRefChatter();			
	}
	$.get('http://www.jonfackrell.com/email/send.php', { url: url, lineNumber: lineNumber, errorMsg: errorMsg });
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


/*
 * jQuery postMessage - v0.5 - 9/11/2009
 * http://benalman.com/projects/jquery-postmessage-plugin/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($){var g,d,j=1,a,b=this,f=!1,h="postMessage",e="addEventListener",c,i=b[h]&&!$.browser.opera;$[h]=function(k,l,m){if(!l){return}k=typeof k==="string"?k:$.param(k);m=m||parent;if(i){m[h](k,l.replace(/([^:]+:\/\/[^\/]+).*/,"$1"))}else{if(l){m.location=l.replace(/#.*$/,"")+"#"+(+new Date)+(j++)+"&"+k}}};$.receiveMessage=c=function(l,m,k){if(i){if(l){a&&c();a=function(n){if((typeof m==="string"&&n.origin!==m)||($.isFunction(m)&&m(n.origin)===f)){return f}l(n)}}if(b[e]){b[l?e:"removeEventListener"]("message",a,f)}else{b[l?"attachEvent":"detachEvent"]("onmessage",a)}}else{g&&clearInterval(g);g=null;if(l){k=typeof m==="number"?m:typeof k==="number"?k:100;g=setInterval(function(){var o=document.location.hash,n=/^#?\d+&/;if(o!==d&&n.test(o)){d=o;l({data:o.replace(n,"")})}},k)}}}})(jQuery);

/*
 * SimpleModal 1.4.3 - jQuery Plugin
 * http://simplemodal.com/
 * Copyright (c) 2012 Eric Martin
 * Licensed under MIT and GPL
 * Date: Sat, Sep 8 2012 07:52:31 -0700
 */
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):b(jQuery)})(function(b){var j=[],l=b(document),m=b.browser.msie&&6===parseInt(b.browser.version)&&"object"!==typeof window.XMLHttpRequest,o=b.browser.msie&&7===parseInt(b.browser.version),n=null,k=b(window),h=[];b.modal=function(a,d){return b.modal.impl.init(a,d)};b.modal.close=function(){b.modal.impl.close()};b.modal.focus=function(a){b.modal.impl.focus(a)};b.modal.setContainerDimensions=function(){b.modal.impl.setContainerDimensions()};
b.modal.setPosition=function(){b.modal.impl.setPosition()};b.modal.update=function(a,d){b.modal.impl.update(a,d)};b.fn.modal=function(a){return b.modal.impl.init(this,a)};b.modal.defaults={appendTo:"body",focus:!0,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:1,autoPosition:!0,zIndex:1E3,close:!0,closeHTML:'<a class="modalCloseImg" title="Close"></a>',
closeClass:"simplemodal-close",escClose:!0,overlayClose:!1,fixed:!0,position:null,persist:!1,modal:!0,onOpen:null,onShow:null,onClose:null};b.modal.impl={d:{},init:function(a,d){if(this.d.data)return!1;n=b.browser.msie&&!b.support.boxModel;this.o=b.extend({},b.modal.defaults,d);this.zIndex=this.o.zIndex;this.occb=!1;if("object"===typeof a){if(a=a instanceof b?a:b(a),this.d.placeholder=!1,0<a.parent().parent().size()&&(a.before(b("<span></span>").attr("id","simplemodal-placeholder").css({display:"none"})),
this.d.placeholder=!0,this.display=a.css("display"),!this.o.persist))this.d.orig=a.clone(!0)}else if("string"===typeof a||"number"===typeof a)a=b("<div></div>").html(a);else return alert("SimpleModal Error: Unsupported data type: "+typeof a),this;this.create(a);this.open();b.isFunction(this.o.onShow)&&this.o.onShow.apply(this,[this.d]);return this},create:function(a){this.getDimensions();if(this.o.modal&&m)this.d.iframe=b('<iframe src="javascript:false;"></iframe>').css(b.extend(this.o.iframeCss,
{display:"none",opacity:0,position:"fixed",height:h[0],width:h[1],zIndex:this.o.zIndex,top:0,left:0})).appendTo(this.o.appendTo);this.d.overlay=b("<div></div>").attr("id",this.o.overlayId).addClass("simplemodal-overlay").css(b.extend(this.o.overlayCss,{display:"none",opacity:this.o.opacity/100,height:this.o.modal?j[0]:0,width:this.o.modal?j[1]:0,position:"fixed",left:0,top:0,zIndex:this.o.zIndex+1})).appendTo(this.o.appendTo);this.d.container=b("<div></div>").attr("id",this.o.containerId).addClass("simplemodal-container").css(b.extend({position:this.o.fixed?
"fixed":"absolute"},this.o.containerCss,{display:"none",zIndex:this.o.zIndex+2})).append(this.o.close&&this.o.closeHTML?b(this.o.closeHTML).addClass(this.o.closeClass):"").appendTo(this.o.appendTo);this.d.wrap=b("<div></div>").attr("tabIndex",-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(this.d.container);this.d.data=a.attr("id",a.attr("id")||this.o.dataId).addClass("simplemodal-data").css(b.extend(this.o.dataCss,{display:"none"})).appendTo("body");this.setContainerDimensions();
this.d.data.appendTo(this.d.wrap);(m||n)&&this.fixIE()},bindEvents:function(){var a=this;b("."+a.o.closeClass).bind("click.simplemodal",function(b){b.preventDefault();a.close()});a.o.modal&&a.o.close&&a.o.overlayClose&&a.d.overlay.bind("click.simplemodal",function(b){b.preventDefault();a.close()});l.bind("keydown.simplemodal",function(b){a.o.modal&&9===b.keyCode?a.watchTab(b):a.o.close&&a.o.escClose&&27===b.keyCode&&(b.preventDefault(),a.close())});k.bind("resize.simplemodal orientationchange.simplemodal",
function(){a.getDimensions();a.o.autoResize?a.setContainerDimensions():a.o.autoPosition&&a.setPosition();m||n?a.fixIE():a.o.modal&&(a.d.iframe&&a.d.iframe.css({height:h[0],width:h[1]}),a.d.overlay.css({height:j[0],width:j[1]}))})},unbindEvents:function(){b("."+this.o.closeClass).unbind("click.simplemodal");l.unbind("keydown.simplemodal");k.unbind(".simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var a=this.o.position;b.each([this.d.iframe||null,!this.o.modal?null:this.d.overlay,
"fixed"===this.d.container.css("position")?this.d.container:null],function(b,f){if(f){var g=f[0].style;g.position="absolute";if(2>b)g.removeExpression("height"),g.removeExpression("width"),g.setExpression("height",'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"'),g.setExpression("width",'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"');else{var c,e;a&&a.constructor===
Array?(c=a[0]?"number"===typeof a[0]?a[0].toString():a[0].replace(/px/,""):f.css("top").replace(/px/,""),c=-1===c.indexOf("%")?c+' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"':parseInt(c.replace(/%/,""))+' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',a[1]&&(e="number"===typeof a[1]?
a[1].toString():a[1].replace(/px/,""),e=-1===e.indexOf("%")?e+' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"':parseInt(e.replace(/%/,""))+' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"')):(c='(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',
e='(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"');g.removeExpression("top");g.removeExpression("left");g.setExpression("top",c);g.setExpression("left",e)}}})},focus:function(a){var d=this,a=a&&-1!==b.inArray(a,["first","last"])?a:"first",f=b(":input:enabled:visible:"+a,d.d.wrap);setTimeout(function(){0<f.length?f.focus():d.d.wrap.focus()},
10)},getDimensions:function(){var a="undefined"===typeof window.innerHeight?k.height():window.innerHeight;j=[l.height(),l.width()];h=[a,k.width()]},getVal:function(a,b){return a?"number"===typeof a?a:"auto"===a?0:0<a.indexOf("%")?parseInt(a.replace(/%/,""))/100*("h"===b?h[0]:h[1]):parseInt(a.replace(/px/,"")):null},update:function(a,b){if(!this.d.data)return!1;this.d.origHeight=this.getVal(a,"h");this.d.origWidth=this.getVal(b,"w");this.d.data.hide();a&&this.d.container.css("height",a);b&&this.d.container.css("width",
b);this.setContainerDimensions();this.d.data.show();this.o.focus&&this.focus();this.unbindEvents();this.bindEvents()},setContainerDimensions:function(){var a=m||o,d=this.d.origHeight?this.d.origHeight:b.browser.opera?this.d.container.height():this.getVal(a?this.d.container[0].currentStyle.height:this.d.container.css("height"),"h"),a=this.d.origWidth?this.d.origWidth:b.browser.opera?this.d.container.width():this.getVal(a?this.d.container[0].currentStyle.width:this.d.container.css("width"),"w"),f=this.d.data.outerHeight(!0),
g=this.d.data.outerWidth(!0);this.d.origHeight=this.d.origHeight||d;this.d.origWidth=this.d.origWidth||a;var c=this.o.maxHeight?this.getVal(this.o.maxHeight,"h"):null,e=this.o.maxWidth?this.getVal(this.o.maxWidth,"w"):null,c=c&&c<h[0]?c:h[0],e=e&&e<h[1]?e:h[1],i=this.o.minHeight?this.getVal(this.o.minHeight,"h"):"auto",d=d?this.o.autoResize&&d>c?c:d<i?i:d:f?f>c?c:this.o.minHeight&&"auto"!==i&&f<i?i:f:i,c=this.o.minWidth?this.getVal(this.o.minWidth,"w"):"auto",a=a?this.o.autoResize&&a>e?e:a<c?c:a:
g?g>e?e:this.o.minWidth&&"auto"!==c&&g<c?c:g:c;this.d.container.css({height:d,width:a});this.d.wrap.css({overflow:f>d||g>a?"auto":"visible"});this.o.autoPosition&&this.setPosition()},setPosition:function(){var a,b;a=h[0]/2-this.d.container.outerHeight(!0)/2;b=h[1]/2-this.d.container.outerWidth(!0)/2;var f="fixed"!==this.d.container.css("position")?k.scrollTop():0;this.o.position&&"[object Array]"===Object.prototype.toString.call(this.o.position)?(a=f+(this.o.position[0]||a),b=this.o.position[1]||
b):a=f+a;this.d.container.css({left:b,top:a})},watchTab:function(a){if(0<b(a.target).parents(".simplemodal-container").length){if(this.inputs=b(":input:enabled:visible:first, :input:enabled:visible:last",this.d.data[0]),!a.shiftKey&&a.target===this.inputs[this.inputs.length-1]||a.shiftKey&&a.target===this.inputs[0]||0===this.inputs.length)a.preventDefault(),this.focus(a.shiftKey?"last":"first")}else a.preventDefault(),this.focus()},open:function(){this.d.iframe&&this.d.iframe.show();b.isFunction(this.o.onOpen)?
this.o.onOpen.apply(this,[this.d]):(this.d.overlay.show(),this.d.container.show(),this.d.data.show());this.o.focus&&this.focus();this.bindEvents()},close:function(){if(!this.d.data)return!1;this.unbindEvents();if(b.isFunction(this.o.onClose)&&!this.occb)this.occb=!0,this.o.onClose.apply(this,[this.d]);else{if(this.d.placeholder){var a=b("#simplemodal-placeholder");this.o.persist?a.replaceWith(this.d.data.removeClass("simplemodal-data").css("display",this.display)):(this.d.data.hide().remove(),a.replaceWith(this.d.orig))}else this.d.data.hide().remove();
this.d.container.hide().remove();this.d.overlay.hide();this.d.iframe&&this.d.iframe.hide().remove();this.d.overlay.remove();this.d={}}}}});
