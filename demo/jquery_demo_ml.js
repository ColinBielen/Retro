//This is a template js for defining a simple markup/macro language.

var MY_MARKUP = {
	//The namespace. NOT really necessary because we bind to a prefix when we "register" the markup with retro (below).
	//However, Ideally we'd want to bind this to a namespace URI so that page authors could assign whatever prefix they want to the markup. 
	"namespace": "demo",
	//The "elements" holds the element names and their associated functions.
	"elements" : {

		/** This defines the <demo:helloworld> element that just write "hello" + whatever you specified as the tag's "name" attribute */
		"helloworld":  
			function(tag) {
				//grab the *name* attribute of the tag we defined..
	 		   	var  f_name = $(tag).attr("name");
	 			//The actual replacement:
	 			$(tag).replaceWith("hello, "+f_name);	 
			},//end "helloworld" definition.	
		/** This defines the <demo:goodbyeworld> element that just write "goodbye" + whatever you specified as the tag's "name" attribute */
		"goodbyeworld":
			function(tag) {
				//grab the *name* attribute of the tag we defined..
 				var f_name = $(tag).attr("name");
 				$(tag).replaceWith("goodbye, "+f_name);	 
			},
		/** This defines a <demo:topstories/> tag that uses a webservice to populate itself with the top X stories and some useful info. 
		    It's processing the default CEG blog XML format. */	
		"topstories":
			function(tag) {
				//This is a dummy xml WebService response.
				//when use use a "blogDummyService" one make sure it's the same domain as your host html or it won't work.
				var webServiceURL="demoWebServices/blogWebService.xml";
				//These are the attributes from the calling tag. 
				//In a real web service call you'd probably pass these in as parameters or filters.
				var edition = $(tag).attr("edition");
				var number = $(tag).attr("number");
				//this list holds the returned objects.
				var contentList = {};				
				responseText = "";
				//This is just the JQuery ajax API:
				$.ajax({
					type: "GET",
					url: webServiceURL,
					data: "",
					error: function(request,status,error) {},
					success: function(xml) {
						responseText = "<table border=1><tr><td>Publish Date</td><td>Title</td><td>Content ID</td><td>Summary</td></tr>\n";
						payloadList = xml.getElementsByTagName("payload");
						var payloadNode = payloadList[0];
						//TODO: Do this lame iteration stuff using JQuery. That's what it's designed for. 
						var itemList = payloadNode.getElementsByTagName("item");
						for(i=0;i<itemList.length;i++) {
							responseText +="<tr>";
							contentList[i] = {};							
							var itemNode = itemList[i];
							for(j=0;j<itemNode.childNodes.length;j++) {
								var localNode = itemNode.childNodes[j];
								if(localNode.nodeName == "title") {
									contentList[i].title = localNode.firstChild.nodeValue;
								} else if(localNode.nodeName == "publishDate") {
									var d = new Date();
									//* multiply by 1000 because the webservice returns *seconds* 
									//but the javascript data function wants milliseconds...
									d.setTime(localNode.firstChild.nodeValue *1000);								
									contentList[i].publishDate = d;
								} else if(localNode.nodeName == "id") {
									contentList[i].contentid = localNode.firstChild.nodeValue;
								} else if(localNode.nodeName == "summary") {
									contentList[i].summary = localNode.firstChild.nodeValue;
								}
							} //end j loop
							//In this example we're just rendering a table, but because you have full content object access you could theoretically 
							//do whatever you want to on the page. 
							responseText += "<td>"+contentList[i].publishDate+"</td>"
										  +"<td>"+contentList[i].title+"</td>"
  										  +"<td>"+contentList[i].contentid+"</td>"
										  +"<td>"+contentList[i].summary+"</td>";
							responseText +="</tr>";
						}// end loop
						responseText +="</table>";	
						$(tag).replaceWith(""+responseText+"");
					}//end success event		
				}); //end ajax callback
			},//end "topstories" tag def.			
			
			/* This tag calls the exact same webservice as the <topstories> tag but asks for the resoponse as a JSON object for comparison. */
			"topstoriesasjson":
			function(tag) { 
					//Similar to the ajax get but much less code. JQuery might help as well.
					 var responseText = "<table border=1 ><tr><td>Publish Date</td><td>Title</td><td>Content ID</td><td>Summary</td></tr>\n";
				//	var webServiceURL = "/twiki-dev/bin/viewfile/InteractiveTech/RetroDemoPage?rev=1;filename=blogWebService.json";
					var webServiceURL = "demoWebServices/blogWebService.json";
					$.getJSON(webServiceURL,function(json) {
						var items = json.resp.payload.item;
						for(i=0;i<items.length;i++) {
							var pubStamp = items[i].publishDate;						
							var pubDate = new Date();
							pubDate.setTime(pubStamp * 1000);
							responseText += "<tr><td>"+pubDate + "</td>"
										+ "<td>"+ items[i].title + "</td>"
										+ "<td>"+ items[i].id + "</td>"
										+ "<td>"+ items[i].summary + "</td></tr>\n";
						}
					//The replace has to do *inside* the json call or else it will render & replace the textbefore the json is finishd processing. 
					responseText +="</table>";
//					alert(responseText);	
//					$(tag).empty();
					$(tag).replaceWith(responseText);
					});//end getJSON
			} //end topstories tagfunction
		
	}//end "elements" declarations
};


//Finally, register the Markup Map with retro so it knows to process it:
//the key is the namespace you want this markup language bound to.
//in this case, these markup rules will be run againsd all tags declared in the ceg: namespace.
RETRO.markupMap[MY_MARKUP["namespace"]] = MY_MARKUP;
