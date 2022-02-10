import React, { Component } from 'react';

// https://react-bootstrap.github.io/components/navbar/#navbars-mobile-friendly
import { Form, FormControl, Button, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';

import '../css/main.css';
import '../css/drydock.css';

import { paragraphData } from './paragraphdata.js'
import { textData } from './textdata.js'
import { sentenceData } from './sentencedata.js'
import { rawData } from './rawdata.js'

import HashTable from './HashTable';

import Topic from './lib/components/Topic';
import OnTopicDataTools from './lib/components/OnTopicDataTools';
import OnTopicConstants from './lib/components/OnTopicConstants';
import OnTopicVisualization from './lib/components/OnTopicVisualization';

/**
 * 
 */
class DryDock extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state = { 
      locked: false,
      invalidated: false,      
      flipped: false,
      mode: "TEXT",
      textdata: { 
        valueRaw: null,        
        topics: null,
        topic: null,        
        sentences: null,
        sentence: null,
        collapsed: null,
        expanded: null,
        pValue: "",
        pTarget: -1        
      },
      loading: false
    };    

    this.dataTools=new OnTopicDataTools ();

    this.onDataset1=this.onDataset1.bind(this);
    this.onDataset2=this.onDataset2.bind(this);
    this.onDataset3=this.onDataset3.bind(this);
    this.onDataset4=this.onDataset4.bind(this);

    this.onSelect=this.onSelect.bind(this);
    this.modeToTab=this.modeToTab.bind(this);
    this.onFlip=this.onFlip.bind(this);
    this.onHandleTopic=this.onHandleTopic.bind(this);
    this.updateVisualization=this.updateVisualization.bind(this);
  }

  /**
   *
   */
  onDataset1 () {
    console.log ("onDataset1 ()");

  }

  /**
   *
   */
  onDataset2 () {
    console.log ("onDataset2 ()");

  }

  /**
   *
   */
  onDataset3 () {
    console.log ("onDataset3 ()");

  }

  /**
   *
   */
  onDataset4 () {
    console.log ("onDataset4 ()");

  }      

  /**
   *
   */
  updateVisualization () {
    console.log ("updateVisualization ()");

    this.getData (this.state.mode);
  }

  /**
   *
   */
  onSelect (index, lastIndex, event) {
    console.log ("onSelect ("+index+","+lastIndex+")");

    if (index==0) {
      this.setState ({mode: "SENTENCE"});
    }

    if (index==1) {
      this.setState ({mode: "PARAGRAPH"}); 
    }

    if (index==2) {
      this.setState ({mode: "TEXT"});
    }

    if (index==3) {
      this.setState ({mode: "OUTLINE"});
    }
  }

  /**
   *
   */
  getData (aMode) {
    console.log ("getData ()");
      
    if (this.state.mode=="SENTENCE") {
      this.prep (sentenceData);
    }

    if (this.state.mode=="PARAGRAPH") {
      this.prep (paragraphData);
    }

    if (this.state.mode=="TEXT") {
      this.prep (textData);
    }
  }

  /**
   *
   */
  prep (data) {
    console.log ("prep ("+this.state.mode+")");
    console.log (data);

    var newData=this.dataTools.deepCopy (this.state.textdata);

    newData.plain=rawData;

    //>--------------------------------------------------------------------

    if (this.state.mode=="SENTENCE") {
      newData.sentences=data;

      this.setState({
        loading: false,
        textdata: newData,
        invalidated: false
      });
    }

    //>--------------------------------------------------------------------

    if (this.state.mode=="PARAGRAPH") {    
      newData.paragraphs=data;

      this.setState({
        loading: false, 
        textdata: newData,
        invalidated: false
      });    
    }

    //>--------------------------------------------------------------------    

    if (this.state.mode=="TEXT") {
      let collapsed=data.collapsed;
      let expanded=data.expanded;
      let topics=new HashTable ();
      let sentence=0;

      if (expanded!=null) {
        for (let i=0;i<expanded.length;i++) {
          let row=expanded [i];

          if (i==0) {
            for (let j=0;j<row.length;j++) {
              row [j][2]=this.dataTools.uuidv4();

              let topic=new Topic ();
              topic.uuid=row [j][2];
              topic.name=row [j][1];
              topics.setItem (topic.uuid,topic);
            }
          } else {
            let isParaBoundary=0;

            for (let j=0;j<row.length;j++) {
              let cell=row [j];
              let isCellBoundary=false;

              if (this.dataTools.isNumber (cell)==true) {
                isCellBoundary=true;
                isParaBoundary++;
              }

              // We have a valid row
              if (isCellBoundary==false) {
                if (cell [1]!=false) {
                  cell [13]=this.dataTools.uuidv4();

                  let topic=new Topic ();
                  topic.uuid=cell [13];
                  topic.name=cell [2];
                  topic.sentence=sentence;
                  topics.setItem (topic.uuid,topic);
                }
              }
            }

            if (isParaBoundary!=row.length) {
              sentence++;
            }          
          }
        }
      }

      newData.collapsed = collapsed;
      newData.expanded = expanded;
      newData.topics = topics;

      this.setState({
        loading: false, 
        textdata: newData,
        invalidated: false
      });
    }

    //>--------------------------------------------------------------------    
  }  

  /**
   *
   */
  modeToTab () {
    if (this.state.mode=="SENTENCE") {
      return (0);
    }

    if (this.state.mode=="PARAGRAPH") {
      return (1);
    }

    if (this.state.mode=="TEXT") {
      return (2);
    }

    if (this.state.mode=="OUTLINE") {
      return (3);
    }        

    return (0);
  }  

  /**
   *
   */
  onSelect (index, lastIndex, event) {
    console.log ("onSelect ("+index+","+lastIndex+")");

    //>----------------------------------------------------------

    if (index==0) {
      this.setState ({mode: "SENTENCE"});
    }

    //>----------------------------------------------------------

    if (index==1) {
      this.setState ({mode: "PARAGRAPH"}); 
    }

    //>----------------------------------------------------------    

    if (index==2) {
      this.setState ({mode: "TEXT"});
    }

    //>----------------------------------------------------------    

    if (index==3) {
      this.setState ({mode: "OUTLINE"});
    }

    //>----------------------------------------------------------    
  }  

  /**
   *
   */
  onFlip () {
    console.log ("onFlip ()");    
    
    if (this.state.flipped==true) {
      this.setState ({flipped: false});
    } else {
      this.setState ({flipped: true});
    }
  }

  /**
   *
   */
  onHandleTopic (topicId,isGlobal,count) {
    console.log ("onHandleTopic ("+topicId+","+isGlobal+","+count+") => Dummy for now");
  }

  /**
   *
   */
  render() {

    let ontopic=<OnTopicVisualization 
      onFlip={this.onFlip}
      onSelect={this.onSelect}
      onHandleTopic={this.onHandleTopic}
      defaultindex={this.modeToTab ()}
      loading={this.state.loading} 
      flipped={this.state.flipped}
      mode={this.state.mode}      
      invalidated={this.state.invalidated}
      onNavItemClick={this.onNavItemClick}
      textdata={this.state.textdata} />;

    return (
      <div className="drydock">
        <div className="drydock-top">
        OnTopic - Text Visualization Drydock
        </div>
        <div className="drydock-row">
          <div className="drydock-menu">
            <button className='drydock-button' onClick={(e) => this.onDataset1()}>Dataset 1</button>
            <button className='drydock-button' onClick={(e) => this.onDataset2()}>Dataset 2</button>
            <button className='drydock-button' onClick={(e) => this.onDataset3()}>Dataset 3</button>
            <button className='drydock-button' onClick={(e) => this.onDataset4()}>Dataset 4</button>                                    
          </div>
          <div className="drydock-content">
            <Button className="btn btn-light" style={{marginRight: "4px"}} onClick={()=> this.updateVisualization()}>Update Visualization</Button>
            {ontopic}
          </div>          
        </div>
        <div className="drydock-status">
        Status bar
        </div>
      </div>
    );
  }
}

export default DryDock;
