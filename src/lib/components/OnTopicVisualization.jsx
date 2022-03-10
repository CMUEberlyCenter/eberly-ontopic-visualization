import React, { Component } from 'react';

// From: https://github.com/reactjs/react-tabs
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// https://react-bootstrap.github.io/components/navbar/#navbars-mobile-friendly
import { Form, FormControl, Button, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';

// The import below either doesn't work or doesn't do anything, see index.html
import "react-tabs/style/react-tabs.css";

import './styles/ontopic.css';

//import ToolButton from './ToolButton';

import OnTopicDataTools from './OnTopicDataTools';
import OnTopicEditorTools from './OnTopicEditorTools';

var topicCache=[];

/**
 *
 */
function getTopic (aTopic) {
  console.log ("getTopic ("+aTopic+")");

  console.log (topicCache);

  for (let i=0;i<topicCache.length;i++) {
    let topic=topicCache [i];
    if (topic.id==aTopic) {
      return (topic);
    }
  }
  
  return (null);
}

/**
 *
 */
function addTopic (aTopic) {
  console.log ("addTopic()");

  let target=null;

  for (let i=0;i<topicCache.length;i++) {
    let topic=topicCache [i];
    if (topic.id==aTopic) {
      target=topic;
    }
  }

  if (target!=null) {    
    target.count=(target.count+1);  
    //console.log ("addTopic("+aTopic+","+target.count+") (new)");
  } else {
    target={
      id: aTopic,
      count: 0
    };
    topicCache.push(target);

    //console.log ("addTopic("+aTopic+","+target.count+") (existing)");
  }

  return (target.count);
}

/**
 *
 */
class OnTopicVisualization extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state={
      pValue: "",
      pTarget: -1
    }

    this.dataTools=new OnTopicDataTools ();
    this.editorTools=new OnTopicEditorTools ();

    this.onHandleParagraphChange = this.onHandleParagraphChange.bind(this);
    this.onHandleSentence = this.onHandleSentence.bind(this);
    this.onParagraphTopicClick = this.onParagraphTopicClick.bind(this);
  }	

  /**
   *
   */
  onHandleSentence (aParagraph,aSentenceIndex,aBlock,aSentence) {
    console.log ("onHandleSentence ("+aParagraph+","+aSentenceIndex+")");

    let sentenceObject=this.dataTools.buildSentenceModel (aBlock,aSentence);

    console.log (sentenceObject);

    if (sentenceObject!=null) {
      sentenceObject.paragraphIndex=aParagraph;
      sentenceObject.sentenceIndex=aSentenceIndex;
 
      if (this.props.onHandleSentence) {
        this.props.onHandleSentence (sentenceObject);
      }

      /*
      this.setState ({sentence: sentenceObject},(e) => {
        this.onSentenceChange ();
      });
      */
    }
  }  

  /**
   *
   */
  generateSentenceView () {
    console.log ("generateSentenceView ("+this.props.invalidated+")");

    let rows=[];
    let sentence=1;

    if (this.props.textdata.sentences==null) {      
      return (<div className="contentrowflex">No data provided</div>);
    }

    for (let i=0;i<this.props.textdata.sentences.length;i++) {
      let entry=this.props.textdata.sentences [i];
      if (Array.isArray(entry)==true) {
        let coreData=entry [2];
        let L_NPS=coreData ["L_NPS"];
        let R_NPS=coreData ["R_NPS"];
        let AUX_VERBS=coreData ["AUX_VERB"];
        let NPS=coreData["NPS"];

        let leftBlocks=[];
        let rightBlocks=[];
        let npIndex=0;

        for (let j=0;j<L_NPS;j++) {
          let leftClass="";

          if (this.props.invalidated==false) {
            if (AUX_VERBS==false) {
              leftClass="block-purple block-right";
            } else {
              leftClass="block-red block-right";
            }
          } else {
            leftClass="block-disabled block-right";
          }  

          if (this.props.invalidated==false) {
            leftBlocks.push(<div key={this.dataTools.uuidv4()} className={leftClass} alt={NPS [npIndex]} title={NPS [npIndex]} onClick={(e) => this.onHandleSentence (entry [0],entry[1],entry[2],entry[3])}></div>);
          } else {
            leftBlocks.push(<div key={this.dataTools.uuidv4()} className={leftClass}></div>);              
          }

          npIndex++;
        }

        for (let k=0;k<R_NPS;k++) {
          let rightClass="";

          if (this.props.invalidated==false) {
            if (AUX_VERBS==false) {
              rightClass="block-purple block-left";
            } else {
              rightClass="block-red block-left";
            }
          } else {
            rightClass="block-disabled block-left";
          }

          if (this.props.invalidated==false) {
            rightBlocks.push(<div key={this.dataTools.uuidv4()} className={rightClass} alt={NPS [npIndex]} title={NPS [npIndex]} onClick={(e) => this.onHandleSentence (entry [0],entry[1],entry[2],entry[3])}></div>);
          } else {
            rightBlocks.push(<div key={this.dataTools.uuidv4()} className={rightClass}></div>);              
          }

          npIndex++;
        }

        rows.push(<tr key={this.dataTools.uuidv4()} className="psentence"><td>{sentence}</td><td valign="bottom">{leftBlocks}</td><td>&nbsp;</td><td valign="bottom">{rightBlocks}</td></tr>);
        sentence++;
      } else {
        rows.push(<tr key={this.dataTools.uuidv4()} className="pseparator"><td valign="bottom" colSpan="4">&nbsp;</td></tr>);
      }
    }

    return (<div className="contentrowflex">
      <table className="langtable">
       <thead>
        <tr><td>&nbsp;</td><td className="align-right">Left</td><td>&nbsp;</td><td>Right</td></tr>
       </thead>
       <tbody>
       {rows}
       </tbody>
      </table>
      </div>);
  }

  /**
   *
   */
  generateParagraphViewFlipped () {
    console.log ("generateParagraphViewFlipped ("+this.props.invalidated+","+this.state.pTarget+")");

    topicCache=[];

    let rows=[];

    if (this.props.textdata.paragraphs==null) {
      return (<div className="contentrowflex"><table className="langtable"><tbody></tbody></table></div>);
    }

    let topicheader;
    let topicTags=[];
    let lineCount=1;
    let topics=null;
    let paraCount=0;
    let paraPulldown=[];

    paraPulldown.push(<option value={-1}>{"---"}</option>);

    for (let i=0;i<this.props.textdata.paragraphs.length;i++) {
      if (i==0) {
        topicTags.push (<td key={this.dataTools.uuidv4()}>&nbsp;</td>);
        topics=this.props.textdata.paragraphs [i];
        for (let j=0;j<topics.length;j++) {
          topicTags.push (<td key={this.dataTools.uuidv4()} valign="bottom"><div className="vertical noselect">{topics [j][1]}</div></td>);
        }
      } else {
        let row=this.props.textdata.paragraphs [i];
        let celNumberCount=0;
        let markers=[];
        
        for (let k=0;k<row.length;k++) {
          if (this.dataTools.isNumber (row [k])==true) {
            celNumberCount++;
          }          
        }

        if (celNumberCount!=row.length) {
          if (this.dataTools.isEmptyRow (row)==false) {            
            for (let l=0;l<row.length;l++) {
              let cell=row [l];
              if (cell [0]==null) {
                markers.push (<td key={this.dataTools.uuidv4()}><div className="block-blank block-left"></div></td>);
              } else {
                if (this.props.invalidated==false) {
                  markers.push (<td key={this.dataTools.uuidv4()}><div className="block-blue block-left" alt={topics [l][1]} title={topics [l][1]} onClick={(e)=> this.onParagraphTopicClick (topics [l][1])}></div></td>);
                } else {
                  markers.push (<td key={this.dataTools.uuidv4()}><div className="block-disabled" alt={topics [l][1]} title={topics [l][1]}></div></td>);                    
                }
              }
            }
          } else {            
            for (let l=0;l<row.length;l++) {
              markers.push (<td key={this.dataTools.uuidv4()}><div className="block-blank block-left red-tag">X</div></td>);
            }
          }
        }

        if (celNumberCount==row.length) {
          lineCount=1;

          //let firstSentence=this.editorTools.getParagraphSentence (this.props.textdata.valueRaw,paraCount,this.props.textdata.plain);
          let firstSentence=this.editorTools.getParagraphSentencePlain (this.props.textdata.plain,paraCount);

          if (this.state.pTarget==paraCount) {
            paraPulldown.push(<option value={(paraCount+1)} selected={true}>{"¶ "+(paraCount+1) + " - " +(firstSentence.substring(0, 50)) + " ... "}</option>);
          } else {
            paraPulldown.push(<option value={(paraCount+1)}>{"¶ "+(paraCount+1) + " - " +(firstSentence.substring(0, 50)) + " ... "}</option>);              
          }

          paraCount++;
        } else {
          if (paraCount==this.state.pTarget) {
            rows.push(<tr key={this.dataTools.uuidv4()} className="psentence"><td>{lineCount}</td>{markers}</tr>);
          }
          lineCount++;
        }
      }
    }

    topicheader=<thead><tr>{topicTags}</tr></thead>;

    let paragraphViz;

    if (this.state.pTarget!=-1) {
      paragraphViz=<table className="langtable">
       {topicheader}
       <tbody>
       {rows}
       </tbody>
      </table>
    }

    let pulldown=<select onChange={this.onHandleParagraphChange}>{paraPulldown}</select>;

    if (this.props.invalidated==true) {
      pulldown=<select onChange={this.onHandleParagraphChange} disabled>{paraPulldown}</select>;
    }

    return (<div className="contentrowflex">
      {pulldown}
      {paragraphViz}
      </div>);
  }

  /**
   *
   */
  generateParagraphViewRegular () {
    console.log ("generateParagraphViewRegular ("+this.props.invalidated+","+this.state.pTarget+")");

    topicCache=[];

    if (this.props.textdata.paragraphs==null) {
      return (<div className="contentrowflex"><table className="langtable"><tbody></tbody></table></div>);
    }

    let rows=[];
    let topicheader;
    let topicTags=[];
    let lineCount=1;
    let topics=null;
    let paraCount=0;
    let paraPulldown=[];

    paraPulldown.push(<option key={this.dataTools.uuidv4()} value={-1}>{"---"}</option>);

    for (let i=0;i<this.props.textdata.paragraphs.length;i++) {
      if (i==0) {
        topics=this.props.textdata.paragraphs [i];

        let newRow=[];
        newRow.push (<td key={this.dataTools.uuidv4()}>&nbsp;</td>);
        rows.push(newRow);

        for (let j=0;j<topics.length;j++) {          
          newRow=[];
          newRow.push (<td key={this.dataTools.uuidv4()} align="right"><div className="horizontal">{topics [j][1]}</div></td>);
          rows.push(newRow);
        }
      } else {
        let row=this.props.textdata.paragraphs [i];
        let celNumberCount=0;
        let markers=[];
        
        for (let k=0;k<row.length;k++) {
          if (this.dataTools.isNumber (row [k])==true) {
            celNumberCount++;
          }          
        }

        if (celNumberCount!=row.length) {
          if (this.dataTools.isEmptyRow (row)==false) {            
            for (let l=0;l<row.length;l++) {
              let cell=row [l];
              if (cell [0]==null) {
                markers.push (<td key={this.dataTools.uuidv4()}><div className="block-blank block-left"></div></td>);
              } else {
                markers.push (<td key={this.dataTools.uuidv4()}><div className="block-blue block-left" alt={topics [l][1]} title={topics [l][1]}></div></td>);
              }
            }
          } else {            
            for (let l=0;l<row.length;l++) {
              markers.push (<td key={this.dataTools.uuidv4()}><div className="block-blank block-left red-tag">X</div></td>);
            }
          }
        }

        if (celNumberCount==row.length) {
          lineCount=1;

          //let firstSentence=this.editorTools.getParagraphSentence (this.props.textdata.valueRaw,paraCount,this.props.textdata.plain);
          let firstSentence=this.editorTools.getParagraphSentencePlain (this.props.textdata.plain,paraCount);

          if (this.state.pTarget==paraCount) {
            console.log ("Found selected paragraph");
            paraPulldown.push(<option key={this.dataTools.uuidv4()} value={(paraCount+1)} selected={true}>{"¶ "+(paraCount+1) + " - " +(firstSentence.substring(0, 50)) + " ... "}</option>);
          } else {
            paraPulldown.push(<option key={this.dataTools.uuidv4()} value={(paraCount+1)}>{"¶ "+(paraCount+1) + " - " +(firstSentence.substring(0, 50)) + " ... "}</option>);    
          }

          paraCount++;
        } else {
          if (paraCount==this.state.pTarget) {
            // We now need to distribute this horizontal line of tags over the same
            // number of rows
            for (let w=0;w<markers.length;w++) {
              if (w==0) {
                rows [w].push (<td key={this.dataTools.uuidv4()}><div className="horizontal">{lineCount}</div></td>); 
              }
              rows [w+1].push (markers [w]);
            }
          }
          lineCount++;
        }
      }
    }

    console.log (rows);

    let paragraphViz;
    let vizRows=[];

    for (let x=0;x<rows.length;x++) {
      let aRow=rows [x];
      let syntaxFixer=[];
      for (let y=0 ; y < aRow.length ; y++) {
        let el=aRow[y];
        syntaxFixer.push(el);
      }
      vizRows.push (<tr key={this.dataTools.uuidv4()}>{syntaxFixer}</tr>);
    }

    if (this.state.pTarget!=-1) {
      paragraphViz=<table className="langtable"><tbody>{vizRows}</tbody></table>
    }    

    return (<div className="contentrowflex">
      <select onChange={this.onHandleParagraphChange}>
        {paraPulldown}
      </select>
      {paragraphViz}
      </div>);
  }  

  /**
   *
   */
  generateTextViewFlipped () {
    console.log ("generateTextViewFlipped ("+this.props.invalidated+")");

    topicCache=[];

    let rows=[];

    if (this.props.textdata.expanded==null) {
      console.log ("this.props.textdata.expanded == null");
      return (<div className="contentrowflex"><table className="langtable"><tbody></tbody></table></div>);
    } 

    let expanded=this.props.textdata.expanded;

    let header="";
    let index=1;

    for (let i=0;i<expanded.length;i++) {
      let row=expanded [i];

      if (i==0) {
        header=[];
        header.push(<td key={this.dataTools.uuidv4()}>&nbsp;</td>); 

        for (let j=0;j<row.length;j++) {
          let topic=row [j];
          if (this.props.invalidated==false) {
            header.push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="vertical" onClick={(e) => this.onHandleTopic (topic [2],true,-1)}>{topic [1]}</div></td>);  
          } else {
            header.push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="vertical-disabled noselect">{topic [1]}</div></td>);       
          }
        }

        rows.push(<tr key={"row-"+i} className="pheader">{header}</tr>);
      } else {
        let isParaBoundary=0;

        header=[];

        //>-----------------------------------------------------------------

        for (let j=0;j<row.length;j++) {
          let cell=row [j];
          let isCellBoundary=false;

          if (this.dataTools.isNumber (cell)==true) {
            isCellBoundary=true;
            isParaBoundary++;
          }

          if (isCellBoundary==false) {
            if (cell [1]!=false) {
              if (this.props.invalidated==false) {
                //console.log (cell);
                let count=addTopic (cell [2]);
                header.push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="block-blue" alt={cell [2]} title={cell [2]} onClick={(e) => this.onHandleTopic (cell [13],false,count)}></div></td>);
              } else {
                header.push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="block-disabled"></div></td>);               
              }
            } else {
              header.push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="empty"></div></td>);
            }
          } else {
            header.push(<td key={this.dataTools.uuidv4()} valign="bottom">&nbsp;</td>);
          }
        }

        //>-----------------------------------------------------------------

        if (isParaBoundary==row.length) {
          rows.push(<tr key={"row-"+i} className="pseparator"><td>&nbsp;</td>{header}</tr>);
        } else {
          rows.push(<tr key={"row-"+i} className="psentence"><td>{index}</td>{header}</tr>);
          index++;
        }

        //>-----------------------------------------------------------------            
      }
    }

    return (<div className="contentrowflex"><table className="langtable"><tbody>{rows}</tbody></table></div>);
  }

  /**
   *
   */
  generateTextViewRegular () {
    console.log ("generateTextViewRegular ("+this.props.invalidated+")");   

    topicCache=[];

    if (this.props.textdata.expanded==null) {
      return (<div className="contentrowflex"><table className="langtable"><tbody></tbody></table></div>);
    }
        
    let rows=[];
    let expanded=this.props.textdata.expanded;

    let header="";
    let index=1;
    let rowIndex=0;
    let actualRowLength=0;
    let maxLength=5000; // Let's use a ludicrous size

    for (let i=0;i<expanded.length;i++) {
      let row=expanded [i];
      if (i>0) {
        if (row.length<maxLength) {
          maxLength=row.length;
        }
      }
    }

    let lineCount=1;

    for (let i=0;i<expanded.length;i++) {
      let isEmpty=false;
      let row=expanded [i];
      rowIndex=0;

      if (i==0) {
        isEmpty=true;
        for (let j=0;j<maxLength;j++) {          
          let topic=row [j];

          let newRow=[];

          if (j==0) {
            newRow=[];
            newRow.push (<td key={this.dataTools.uuidv4()}>&nbsp;</td>);
            rows.push(newRow);
          }

          newRow=[];

          if (this.props.invalidated==false) {            
            newRow.push(<td key={this.dataTools.uuidv4()} align="right"><div className="horizontal" onClick={(e) => this.onHandleTopic (topic [2],true,-1)}>{topic [1]}</div></td>);            
          } else {
            newRow.push(<td key={this.dataTools.uuidv4()} align="right"><div className="horizontal-disabled noselect">{topic [1]}</div></td>);            
          }

          rows.push (newRow);
        }
      } else {                
        for (let j=0;j<maxLength;j++) {
          let cell=row [j];

          if (this.dataTools.isNumber (cell)==true) {
            isEmpty=true;
            if (j==0) {
              rows [0].push (<td key={this.dataTools.uuidv4()}>&nbsp;</td>);
            }
            rows [rowIndex+1].push(<td key={this.dataTools.uuidv4()} valign="bottom" className="grey-narrow">&nbsp;</td>);
          } else {
            if (j==0) {
              rows [0].push (<td key={this.dataTools.uuidv4()}><div className="horizontal">{lineCount}</div></td>);
            }

            if (cell [1]!=false) {
              if (this.props.invalidated==false) {
                //console.log (cell);
                let count=addTopic (cell [2]);
                rows [rowIndex+1].push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="block-blue-horizontal" alt={cell [2]} title={cell [2]} onClick={(e) => this.onHandleTopic (cell [13],false,count)}></div></td>);
              } else {
                rows [rowIndex+1].push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="block-disabled"></div></td>);
              }
            } else {
              rows [rowIndex+1].push(<td key={this.dataTools.uuidv4()} valign="bottom"><div className="empty"></div></td>);
            }            
          }

          rowIndex++;
          if (rowIndex>=rows.length) {
            rowIndex=0;
          }
        }
      }

      if (isEmpty==false) {
        lineCount++;
      }
    }

    let table=[];

    for (let i=0;i<rows.length;i++) {
      let aRow=rows [i];
      let htmlRow=[];
      htmlRow.push (<tr key={this.dataTools.uuidv4()}>{aRow}</tr>);

      table.push (htmlRow);
    }

    return (<div className="contentrowflex"><table className="langtable"><tbody>{table}</tbody></table></div>);
  }

  /**
   *
   */
  onFlip () {
    if (this.props.onFlip) {
      this.props.onFlip();	
    }
  }

  /**
   *
   */
  onHandleParagraphChange (e) {
    console.log ("onHandleParagraphChange ("+e.target.value+")");

    if (e.target.value==-1) {
      console.log ("Nothing to see here");
      return;
    }

    this.setState ({pTarget: (e.target.value-1)});
  }

  /**
   *
   */
  onHandleTopic (topicId,isGlobal,count) {
    if (this.props.onHandleTopic) {
      this.props.onHandleTopic(topicId,isGlobal,count);
    }
  }

  /**
   *
   */
  onParagraphTopicClick (topicId) {
    console.log ("onParagraphTopicClick ("+topicId+")");
  }

  /**
   *
   */
  render () {
    let singlePane=false;

    if (typeof this.props.singlepane !== 'undefined') {
      singlePane=this.props.singlepane;
    }

    console.log ("render ("+singlePane+")");

    let globalTopics; // Will not be used?
    let pdfDownload;

    let sentenceview;
    let paragraphview;
    let textview;
    let outlineview;

    let sentencetab;
    let paragraphtab;
    let texttab;  	

    let waiting=<div className="waiting"></div>;

    //pdfDownload=<ToolButton className="float-right" alt="Download as PDF" title="Download as PDF" onButtonClick={(event) => this.onNavItemClick("export_viz")} icon="picture_as_pdf" />;

    if (this.props.mode=="SENTENCE") {
      if (this.props.loading==true) {
        sentencetab=waiting;
      } else {
        sentenceview=this.generateSentenceView ();

        sentencetab=<div className="contentcolumn">
            {globalTopics}            
            {sentenceview}
          </div>;     
      }      
    }

    if (this.props.mode=="PARAGRAPH") {
      if (this.props.loading==true) {
        paragraphtab=waiting;
      } else {
        if (this.props.flipped==false) {
          paragraphview=this.generateParagraphViewRegular ();
        } else {
          paragraphview=this.generateParagraphViewFlipped ();
        }

        paragraphtab=<div className="contentcolumn">
            <div className="contentrowfixed">
              <Form.Group controlId="topicscheck">
                <Form.Check onChange={this.onFlip.bind(this)} type="checkbox" label="Flip Rows and Columns" alt="Flip Rows and Columns" title="Flip Rows and Columns" checked={this.props.flipped} />
              </Form.Group>              
            </div>
            {paragraphview}
          </div>;     
      }         
    }

    if (this.props.mode=="TEXT") {
      if (this.props.loading==true) {
        texttab=waiting;
      } else {            
        if (this.props.flipped==true) {
          textview=this.generateTextViewFlipped ();
        } else {
          textview=this.generateTextViewRegular ();
        }

        texttab=<div className="contentcolumn">
            <div className="contentrowfixed">
              <Form.Group controlId="textcheck">
                <Form.Check onChange={this.onFlip.bind(this)} type="checkbox" label="Flip Rows and Columns" alt="Flip Rows and Columns" title="Flip Rows and Columns" checked={this.props.flipped}  />
              </Form.Group>              
            </div>
            {textview}
          </div>;      
      }
    }  	

    if (singlePane==true) {
      if (this.props.mode=="SENTENCE") {
        return (sentencetab);
      }

      if (this.props.mode=="PARAGRAPH") {
        return (paragraphtab);
      }

      if (this.props.mode=="TEXT") {
        return (texttab);
      }
    }

  	return (<div className="ontopic">
      <Tabs defaultIndex={this.props.defaultindex} onSelect={this.props.onSelect}>
        <TabList>
          <Tab disabled={this.props.loading}>Sentence</Tab>
          <Tab disabled={this.props.loading}>Paragraph</Tab>
          <Tab disabled={this.props.loading}>Text</Tab>
          {pdfDownload}
        </TabList>

        <TabPanel>
          {sentencetab}
        </TabPanel>

        <TabPanel>
          {paragraphtab}
        </TabPanel>

        <TabPanel>
          {texttab}
        </TabPanel>
      </Tabs>
  	</div>);
  }
}

export default OnTopicVisualization;
