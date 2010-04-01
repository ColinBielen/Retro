/**
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU Lesser Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    
 Okay, code time.
The base object. This basically stores all markups for later processing. */
RETRO = new Object();
//Any registered namespaces will go in here:
RETRO.markupMap = new Object();



/**
 This is the "Engine". 
 Basically just process code that runs when the page is loaded. 
 Sort of like how facebook's FBML works, only we don't need to go to any remote servers to run this: It's all client side. 
 Also,since this is generic we can easily implement custom markup languages. In Theory :)
 It's a bit brute-forcey at the moment. That should change subject to a) my knowledge of JQuery and b) JQuery supporting namespaces properly. (Which may actually be a result of "a"...)
 
*/

/**
 * Process an individual markup definition.
 */
RETRO.processMarkup = function(markupDefinition) {
			var elementList = document.getElementsByTagName("*");
		 	for(elementIdx in elementList) { 
		  		var element = elementList[elementIdx];
		  		var nname = element.nodeName;
		  		if(nname) {
			  		if(nname.indexOf(markupDefinition["namespace"].toUpperCase()+":") == 0) {
					//We have a match: grab the tag name:
						tagSplit = nname.split(":");
					//Again, hack until we get proper namespace support:
					if(tagSplit.length >0) {
						tagName = tagSplit[1];
					//The whole uppercase/lowercase stuff is because even though xhtml says everything should be lowercase IE interprests its DOM 					//objects as all uppercase. Go figure.  
						methodName = markupDefinition["elements"][tagName.toLowerCase()];
				/*
				 Now eval it.
				This smells like a security risk 
				but aside from poisoning your own functions I can't think of how you'd do something evil. */
						eval(methodName)(element);			
				} //end tagsplit
				
		  	}//end hacky namespace filter.		  
		  	} //end nname null check
	 	};//end find()


		
	}
	
/**
 * Process all markups currently registered in the RETRO registy.
 * Specific behavior around this will depend on the functionality of the tag being run. */	
	
RETRO.processAllMarkups = function() {
	    for(markupPrefix in RETRO.markupMap) {
			var markupDefinition = RETRO.markupMap[markupPrefix];
				RETRO.processMarkup(markupDefinition);			
		}	
	}


if (window.jQuery)  {
  $(document).ready(function() { RETRO.processAllMarkups()  });  
} else if(window.Prototype ) {
	//alert("using prototype");
	Event.observe(window, 'load',function() {RETRO.processAllMarkups()});
} else {
	//Not as robust as prototype or jQuery but still works.
	window.onload = function() {RETRO.processAllMarkups()};
}
