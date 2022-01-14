import React, { Component } from 'react';

import OnTopicVisualization from './lib/components/OnTopicVisualization';

import '../css/main.css';
import '../css/drydock.css';

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
      globalSettings: {}
    }

    this.onDataset1=this.onDataset1.bind(this);
    this.onDataset2=this.onDataset2.bind(this);
    this.onDataset3=this.onDataset3.bind(this);
    this.onDataset4=this.onDataset4.bind(this);
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
  render() {
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
            <OnTopicVisualization>
            </OnTopicVisualization>          
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
