/** This is another simple markup langage.
*This one uses the prototype framework to do Ajax stuff.
* The actual makrup format is the same regardless of framework.
*/
var MY_MARKUP = {
    //All the functions defined in here will be bound to this namespace so we don't have name clobbering issues...
    
	"namespace": "demo",
	//The "elements" holds the element names and their associated functions.
	"elements" : {
		/* This is a helloworld tag.  
		   It's bound to this markup object, and won't be available to others. */
		"helloworld" :function(tag) {
 				var f_name = tag.readAttribute("name");
				tag.replace("Hello, "+f_name);
		},
		"goodbyeworld" :function(tag) {
 				var f_name = tag.readAttribute("name");
				tag.replace("Goodbye, "+f_name);
		},
		
		/** a "<demo:topstories>" Tag. Loaded via Prototype's Ajax.Request() method */
		"topstories": function(tag){				
				new Ajax.Request("demoWebServices/blogWebService.xml",{
					method:'get',
					onSuccess: function(transport){
					var contentList = {};	
						var response = transport.responseXML;
						var responseText = "<table border=1><tr><td>Publish Date</td><td>Title</td><td>Content ID</td><td>Summary</td></tr>\n";
						var itemList = response.getElementsByTagName("item");
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
							// If ithis was a "real" tag you'd probabyl want to pass a template 
							//in for rendering instead of hard-coding display markup in here... 
							responseText += "<td>"+contentList[i].publishDate+"</td>"
										  +"<td>"+contentList[i].title+"</td>"
  										  +"<td>"+contentList[i].contentid+"</td>"
										  +"<td>"+contentList[i].summary+"</td>";
							responseText +="</tr>";
						}// end loop
						responseText +="</table>";	
						tag.replace(responseText);
												
					},
					onFailure: function() { alert('Something went wrong.')}
				});
		},
		/* This tag calls the exact same webservice as the above <topstories> tag but asks for the resoponse as a JSON object for comparison. */
			"topstoriesasjson":
			 function(tag) { 
					 var responseText = "<table border=1 ><tr><td>Publish Date</td><td>Title</td><td>Content ID</td><td>Summary</td></tr>\n";
					var webServiceURL = "demoWebServices/blogWebService.json";
					new Ajax.Request(webServiceURL,{
						method		:"get",
						onSuccess	: function(transport) {
							var json = transport.responseText.evalJSON();
							var items = json.resp.payload.item;
							for(i=0;i<items.length;i++) {
								var pubStamp = items[i].publishDate;						
								var pubDate = new Date();
								pubDate.setTime(pubStamp * 1000);
								responseText += "<tr><td>"+pubDate + "</td>"
										+ "<td>"+ items[i].title + "</td>"
										+ "<td>"+ items[i].id + "</td>"
										+ "<td>"+ items[i].summary + "</td></tr>\n";
							}//end for							
						//The replace has to do *inside* the json call 
						//or else it will render & replace the textbefore the json is finishd processing. 
						responseText +="</table>";
						tag.replace(responseText);						
						}//end onSuccess callback
					});
			} //end topstories tagfunction	
		}//end "elements" declarations
};

//Finally, register the Markup Map with retro so it knows to process it:
//the key is the namespace you want this markup language bound to.
//in this case, these markup rules will be run againsd all tags declared in the "demo": namespace.
RETRO.markupMap[MY_MARKUP["namespace"]] = MY_MARKUP;

