var e_prints = {
   init: function(rssStr, itemsAmount){
      if ((itemsAmount === undefined) || (itemsAmount.length === 0) || (isNaN(itemsAmount) === true)){
        itemsAmount = 5;
      }
      var outputHtml = "";
      var items = null;

      // Generate Code

      if (rssStr.indexOf('rss version="2.0"') !== -1){ // RSS 2.0
         items = rssStr.split("<item>");
         items.shift();
         outputHtml = e_prints.generateRSS2(items, itemsAmount);
      } 
      else if(rssStr.indexOf("rdf:") !== -1){ // RSS 1.0
         items = rssStr.split("<items")[1];
         items = items.split("<item"); 
         items.shift();
         outputHtml = e_prints.generateRSS1(items, itemsAmount);
      }
      else if(rssStr.indexOf("Atom") !== -1){ // Atom 1.0
         items = rssStr.split("<entry>");
         items.shift();
         outputHtml = e_prints.generateAtom(items, itemsAmount);     
      }
      else{ // Looks like it is not RSS or Atom
	     outputHtml = "\n\n<!-- C-010 RSS Error: Data source is not RSS/Atom -->\n\n";
      }
  
      return outputHtml;
   },
   generateRSS2: function(items, itemsAmount){ // generate html for RSS 2.0
      if (items.length < itemsAmount){
        itemsAmount = items.length;
      }
      var itemsCode = "";
      var itemData = []; // 0 - pubDate, 1 - title, 2 - link, 3 - description      
    
      for(var i = 0; i < itemsAmount; i++){
        // pubDate
        itemData[0] = items[i].split("<pubDate>")[1];
        itemData[0] = itemData[0].split("</pubDate>")[0];
        // title
        itemData[1] = items[i].split("<title>")[1];
        itemData[1] = itemData[1].split("</title>")[0];
        // link
        itemData[2] = items[i].split("<link>")[1];
        itemData[2] = itemData[2].split("</link>")[0];
        // description
        itemData[3] = items[i].split("<description>")[1];
        itemData[3] = itemData[3].split("</description>")[0];
        itemData[3] = e_prints.parseDesc(itemData[3]);

        itemsCode += "<h4><a href='"+itemData[2]+"'>" + itemData[1] + "</a></h4>";
        itemsCode += "<date>" + e_prints.parseDate(itemData[0]) + "</date>";
        itemsCode += "<p>" + itemData[3] + "</p>";

      }

      return itemsCode;
   },
   generateRSS1: function(items, itemsAmount){  // generate html for RSS 1.0
      if (items.length < itemsAmount){
        itemsAmount = items.length;
      }
      var itemsCode = "";
      var itemData = []; // 0 - pubDate, 1 - title, 2 - link, 3 - description      
      for(var i = 0; i < itemsAmount; i++){
        // pubDate
        itemData[0] = "";
        // title
        itemData[1] = items[i].split("<title>")[1];
        itemData[1] = itemData[1].split("</title>")[0];
        // link
        itemData[2] = items[i].split("<link>")[1];
        itemData[2] = itemData[2].split("</link>")[0];
        // description
        itemData[3] = items[i].split("<description>")[1];
        itemData[3] = itemData[3].split("</description>")[0];

        itemsCode += "<h4><a href='"+itemData[2]+"'>" + itemData[1] + "</a></h4>";
        itemsCode += "<p>" + itemData[3] + "</p>";

      }

      return itemsCode;
   },
   generateAtom: function(items, itemsAmount){  // generate html for Atom
      if (items.length < itemsAmount){
        itemsAmount = items.length;
      }
      var itemsCode = "";
      var itemData = []; // 0 - pubDate, 1 - title, 2 - link, 3 - description      

	  for(var i = 0; i < itemsAmount; i++){
	    // pubDate
	    itemData[0] = items[i].split("<published>")[1];
	    itemData[0] = itemData[0].split("</published>")[0];
	    // title
	    itemData[1] = items[i].split("<title")[1];
	    itemData[1] = itemData[1].replace(/([^>]*)>/,"");
	    itemData[1] = itemData[1].split("</title>")[0];
	    // link
	    itemData[2] = items[i].split("<id>")[1];
	    itemData[2] = itemData[2].split("</id>")[0];
	    // description
	    itemData[3] = items[i].split("<summary")[1];
	    itemData[3] = itemData[3].replace(/([^>]*)>/,"");
	    itemData[3] = itemData[3].split("</summary>")[0];

	    itemsCode += "<h4><a href='"+itemData[2]+"'>" + itemData[1] + "</a></h4>";
  	    itemsCode += "<date>" + itemData[0] + "</date>";
	    itemsCode += "<p>" + itemData[3] + "</p>";

	  }

      return itemsCode;
   },

   /* Helpers */

   parseDate: function(itemDate){
      return itemDate.substring(0, itemDate.length-6);	
   },
   parseDesc: function(desc){
     return desc.replace(/&lt;(.*)&gt;/g,"");
   }
};