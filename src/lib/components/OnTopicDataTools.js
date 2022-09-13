'use strict';

import React from 'react';
import Pluralize from "./utils/pluralize";
import Sentence from './utils/Sentence';
import HashTable from './utils/HashTable';

/**
 * @returns
 */
class OnTopicDataTools {
    
  /**
   *
   */  
  constructor () {
    this.pluralizer=new Pluralize ();
  }

  /**
   *
   */
  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  /**
   *
   */
  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }  

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
   */
  detect (word,term) {
    //console.log ("detect ()");

    let result=[false,"","",""];
    let pre="";
    let post="";
    let found=false;
    
    let parts=word.split(/([.,\/#!$%\^&\*;:{}=\-_`~()])/);

    for (let i=0;i<parts.length;i++) {
      let test=parts [i];

      if (term==test) {
        found=true;
        result [0]=true;
        result [2]=term;
      } else {
        let plural=this.pluralizer.pluralize (term);
        if (test==plural) {
          found=true;
          result [0]=true;
          result [2]=plural;
          post=post+plural.substring (term.length);          
        } else {
          if (found==false){
            pre=pre+test;
          } else {
            post=post+test;
          }
        }
      }
    }

    result [1]=pre;
    result [3]=post;

    /*
    if (result [0]==true) {
      console.log (parts);
      console.log (pre + "" + post);
    }
    */
    
    return (result);
  }  


  /**
   * 
   */  
  parseSentence (text, needle, deep) {
    //console.log ("parseSentence ("+needle+")");

    if (deep==false) {
      return (text.split (needle));
    }

    let result=[];

    let parts=text.split (" ");

    let builder="";
    let found=false;
    let index=0;

    for (let i=0;i<parts.length;i++) {
      let comparator=parts [i];

      let detector=this.detect (comparator, needle);

      if (detector[0]==true) {
        if (index>0) {          
          builder=(builder + " ");
        }

        result.push (builder+detector [1]);
        builder=detector [3];
        found=true;
      } else {
        if (index>0) {
          builder=builder + " " + comparator;
        } else {
          builder=builder + comparator;  
        }
      }

      index++;
    }

    if (builder!="") {
      result.push (" " + builder);
    }

    if (found==false) {
      result.push (text);
    }
    
    return (result);
  }

  /**
   * 
   */  
  buildSentenceModel (aBlock,aSentence) {
    //console.log ("buildSentenceModel ("+aSentence+")");
    //console.log (aBlock);

    let newSentence=new Sentence ();
    newSentence.full=aSentence;
    newSentence.verb="have";

    let NPS=aBlock ["NPS"];

    //console.log (aBlock ["L_NPS"] + ", " + (aBlock ["L_NPS"]+1) + " => " + NPS.length);

    let leftOfVerb=NPS [aBlock ["L_NPS"]-1];
    let rightOfVerb=NPS [aBlock ["L_NPS"]];

    //console.log ("... " + leftOfVerb + " <Verb> " + rightOfVerb + " ...");

    return (newSentence);
  }

  /**
   * 
   */  
  findSentence (aText,aSentence) {
    //console.log ("findSentence ()");
    //console.log (aText);
    //console.log (aSentence);

    let sBoundaries={begin: -1, end: -1};

    if (this.isBlank (aSentence.full)==true) {
      return (aBoundaries);
    }

    let parts=aText.split (" ");
    let target=aSentence.full.split (" ");

    // We need this to be able to re-construct the higlight begin and end
    let nrSpaces=parts.length-1;
    let beginIndex=0;
    let endIndex=0;

    for (let i=0;i<parts.length;i++) {
      let term=parts [i];

      // start the comparison 
      if (term==target [0]) {
        let runningIndex=0;
        endIndex=beginIndex;
        for (let j=0;j<target.length;j++) {
          // The target sentence extends beyond the test paragraph and hasn't been matched
          if (j>(parts.length-1)) {
            return (sBoundaries);
          }

          let targetTerm=target[j];
          let testTerm=parts [i+j];

          if (testTerm!=targetTerm) {
            break;
          }

          runningIndex++;
          endIndex+=(testTerm.length+1);  // Probably off by at least 1
        }

        if (runningIndex==target.length) {
          console.log ("Bingo!");

          sBoundaries.begin=beginIndex;
          sBoundaries.end=endIndex;

          return (sBoundaries);
        }
      }

      beginIndex+=(term.length+1); // Probably off by at least 1
    }

    return (sBoundaries);
  }
	
  /**
   * 
   */  
  generateTableHeader () {
    return ([{
      Header: 'Parameter',
      accessor: 'parameter'
    }, {
      Header: 'Value',
      accessor: 'value'
    }]);  
  }    
    
  /**
   * 
   */
  parameterSetValue (aParameters,aParameter,aValue) {
	  //console.log ("parameterSetValue ("+aValue+")");
	
	  //console.log ("Original parameters: " + JSON.stringify (aParameters));
	
    for (var key in aParameters) {
      if (aParameters.hasOwnProperty(key)) {
         if (key==aParameter) {
           aParameters [aParameter].value=aValue;
         }
      }
    }  
    
    //console.log ("New parameters: " + JSON.stringify (aParameters));
    
    return(aParameters);
  }
  
  /**
   * 
   */
  handleParameterChange (param,event) {
	  //console.log ("handleParameterChange("+param+")");
    
    var data = event.target.value;
    
    //console.log (param + " => " + data);
  }
	
  /**
   * This is a method that generates a shallow, non-editable version of a
   * parameter list
   */	
  parameterJSONtoArray (anObjectMap) {
  	//console.log ("parameterJSONtoArray ()");
    //console.log ("Parameter object: " + JSON.stringify (anObjectMap));
      
  	var newArray=new Array ();
  	
  	for (var key in anObjectMap) {
        if (anObjectMap.hasOwnProperty(key)) {
          if (key!="dummy") {
  		  //console.log(key + " -> " + JSON.stringify (anObjectMap[key]));
  		  var parameterObject=new Object ();
  		  parameterObject.parameter=key;
  		  parameterObject.value=anObjectMap [key];
  		  
  		  newArray.push (parameterObject);
      	    }  
        }
      }
  	
  	return(newArray);
  }
  
  /**
   * 
   */
  parameterArrayToJSON (anArray) {
  	var parameterObject=new Object ();  
  	  
  	for (var i=0;i<anArray.length;i++) {
  	  var testObject=anArray [i];
  	  
  	  if (testObject.path) {
  	    parameterObject [testObject.parameter]=testObject.path;
  	  } else {
  		  parameterObject [testObject.parameter]=testObject.value;
  	  }
  	} 
  	
  	return (parameterObject);
  }
  
  /**
   * 
   */
  jsonToTable (tablejson) {
	  return (this.parameterJSONtoArray (tablejson));
  }

  /**
   *
   */
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }  

  /**
   *
   */
  deleteElement (anArray,aTarget) {
    for( var i = 0; i < anArray.length; i++) { 
      if (anArray[i] === aTarget) {
        //console.log ("Deleting element ...");
        anArray.splice(i, 1);
        return (anArray);
      }
    }

    return (anArray);
  }

  /**
   *
   */
  popElement (anArray) {
    //console.log ("popElement ()");

    if (!anArray) {
      return (anArray);
    }

    if (anArray.length==0) {
      return (anArray);
    }

    //console.log ("Before pop: " + anArray.length); 
   
    anArray.splice(anArray.length-1, 1);

    //console.log ("After pop: " + anArray.length);

    return (anArray);
  }

  /**
   * https://www.mattzeunert.com/2016/01/28/javascript-deep-equal.html
   */
  jsonEqual(a,b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }  

  /**
   *
   */
  syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  /**
   *
   */
  getDateString () {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    return (dateTime);
  }

  /**
   *
   */
  isString (aVar) {
    if (typeof aVar === 'string' || aVar instanceof String)
     return (true);

    return (false);
  }

  /**
   *
   */
  isNumber (n) { 
    return !isNaN(parseFloat(n)) && !isNaN(n - 0) 
  }

  /**
   *
   */
  capitalizeFLetter (string) { 
    return(string[0].toUpperCase() + string.slice(1));
  }

  /**
   *
   */
  isEmptyRow (aRow) {
    for (let i=0;i<aRow.length;i++) {
      let testObject=aRow [i];
      if (testObject [0]!=null) {
        return (false);
      }
    }

    return (true);
  }

  /**
  *
  */
  debugStringArray (anArray) {
    for (let i=0;i<anArray.length;i++){
      console.log("'"+anArray[i]+"'");
    }
  }

  /**
   * 
   */
  getInitialData () {
    return ({ 
        valueRaw: null,        
        topics: null,
        topic: new HashTable (),        
        sentences: null,
        sentence: null,
        collapsed: null,
        expanded: null,
        pValue: "",
        pTarget: -1        
      });
  }

  /**
   * We need to switch to using the immutable package. That way we
   * avoid really expensive deep copies through bad tricks like the
   * one below.
   * @param {any} anObject
   */
  deepCopy (anObject) {
    if (anObject==null) {
      return (null);
    }

    return (JSON.parse(JSON.stringify(anObject)));
  }  

  /**
   * 
   */
  copyTopics (aTopics) {
    //console.log ("copyTopics ()");

    if (aTopics==null) {
      return (null);
    }

    let length=aTopics.getLength ();
    let items=aTopics.getItems ();
    let newItems=this.deepCopy (items);

    let topics=new HashTable ();
    topics.setItems (newItems, length);

    return (topics);
  }

  /**
    textdata: { 
      valueRaw: null,        
      plain: "", // replacement of valueRaw, as in actual textual text
      topics: new HashTable (),
      topic: null,        
      sentences: null,
      sentence: null,
      collapsed: null,
      expanded: null     
    }
   */
  copyData (textData) {
    //console.log ("copyData ()");

    if (textData==null) {
      return (null);
    }

    var newTopics=this.copyTopics (textData.topics);
    
    var newData = { 
      valueRaw: this.deepCopy (textData.valueRaw),
      plain: this.deepCopy (textData.plan),
      topics: newTopics,
      topic: this.deepCopy (textData.topic),
      sentences: this.deepCopy (textData.sentences),
      sentence: this.deepCopy (textData.sentence),
      collapsed: this.deepCopy (textData.collapsed),
      expanded: this.deepCopy (textData.expanded)
    };

    return (newData);
  }  
}

export default OnTopicDataTools;
