//This is another template js for defining a simple markup/macro language.
//It's main purpose is to be different from the "demoml" to show how two different 
//custom markup languages can exist on the same page,even if they have the same tagname.

var MY_MARKUP = {
	//The namespace. NOT really necessary because we bind to a prefix when we "register" the markup with retro (below).
	//However, Ideally we'd want to bind this to a namespace URI 
	//so that page authors could assign whatever prefix they want to the markup. 
	"namespace": "blah",
	//The "elements" holds the element names and their associated functions.
	"elements" : {
		/* a helloworld tag. 
		   It's lives in this markup language, and won't be available to others. */
		"howdy" :function(tag) {
		    var f_name = $(tag).attr("name");
			$(tag).replaceWith("Howdy to "+f_name+" from the blah:howdy tag.");
		},
		/** a "topstories" Tag.
			unlike the tag in demoml.js which actually calls a webservice, 
			this one just prints out that it's different from
			the one in demo ML, to show how different Markup templates 
			can have the same element names but because the markup code is 
			bound to a distinct namespace there won't be any ambiguity.   */	
		"topstories": function(tag){$(tag).replaceWith("this is the &lt;topstoreis&gt; tag from the \"blah\" markup template.\n Unlike the tag from the demo ML, this one just prints this message to prove it's executing different code.");
			}	
		}//end "elements" declarations
};

//Finally, register the Markup Map with retro so it knows to process it:
//the key is the namespace you want this markup language bound to.
//in this case, these markup rules will be run againsd all tags declared in the ceg: namespace.
RETRO.markupMap[MY_MARKUP["namespace"]] = MY_MARKUP;
