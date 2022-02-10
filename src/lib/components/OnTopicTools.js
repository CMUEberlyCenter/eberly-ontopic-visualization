
/**
 *
 */
class OnTopicTools {
	
  /**
   *
   */
  /* 
  fix () {
    console.log ("fix()");

    this.logSAIAction ("this","fixText","");

    var plain=Plain.serialize (Value.fromJSON (this.state.value));
    var fixed="";
    var rawLines=plain.split("\n");
    var lines=[];

    for (var i=0;i<rawLines.length;i++) {
      var aLine=rawLines [i];
      var blank=this.dataTools.isBlank (aLine);
      
      if (blank==true) {
        lines.push (fixed);
        lines.push ("\n\n")
        fixed="";
      } else {
        fixed=(fixed + " " + aLine.replace(/(\r\n|\n|\r)/gm,""));
      }
    }

    if (this.dataTools.isBlank (fixed)==false) {
      lines.push (fixed);
    }

    var concat="";

    for (var j=0;j<lines.length;j++) {
      var trimmed=lines [j].trim ();
      if (j>0) {
        concat=(concat + "\n" + trimmed);
      } else {
        concat=lines [j].trim ();
      } 
    }
    
    this.setState ({value: Plain.deserialize (concat)});
  }
  */	
}

export default OnTopicTools;
