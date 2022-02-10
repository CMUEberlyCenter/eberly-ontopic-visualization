
import OnTopicDataTools from './OnTopicDataTools';

/**
 * 
 */
class OnTopicEditorEditorTools {

  /**
   *
   */
  constructor () {
  	this.dataTools=new OnTopicDataTools ();
  }
	
  /**
   *
   */
  getParagraphSentencePlain (aPlainData,aPIndex) {
    console.log ("getParagraphSentencePlain ("+aPIndex+")");

    let paragraphs=aPlainData.split ("\n");

    let index=0;

    for (let i=0;i<paragraphs.length;i++) {
      let para=paragraphs [i];

      if (para!="") {
        if (index==aPIndex) {
          return (para.substring (0,25)+"...");
        }

        index++;
      }
    }

    return ("");
  }

  /**
   *
   */
  getParagraphSentence (aData,aPIndex,plain) {
    console.log ("getParagraphSentence ("+aPIndex+")");
    console.log (aData);
    console.log (plain);

    let breakout=false;
    let index=0;
    let paraCount=0;

    for (let i=0;i<aData.nodes.length;i++) {
      let paragraphObject=aData.nodes [i];
      if (this.isEmptyParagraph (paragraphObject)==false) {
        console.log ("Paragraph object with index " + i + " is not empty");
        if (paraCount==aPIndex) {
          console.log ("Comparing paraCount " + paraCount + ", to: " + aPIndex);
          return (this.getParagraphText (paragraphObject));
        }

        paraCount++;
      }     
    }

    return ("");
  }  

  /**
   *
   */
  isEmptyParagraph (aParagraphData) {
  	//console.log ("isEmptyParagraph ()");

  	if (aParagraphData.type=="paragraph") {
  	  let firstNode=aParagraphData.nodes [0];
  	  //console.log ("Examining: [" + firstNode.text + "]");
  	  if (this.dataTools.isBlank (firstNode.text)==true) {
  	  	return (true);
  	  }
  	}

    return (false);
  }

  /**
   *
   */
  getParagraphText (aParagraphData) {
  	//console.log ("getParagraphText ()");

  	if (aParagraphData.type=="paragraph") {
  	  let firstNode=aParagraphData.nodes [0];
  	  //console.log (firstNode);
  	  return (firstNode.text);
  	}

    return ("");
  }  
}

export default OnTopicEditorEditorTools;
