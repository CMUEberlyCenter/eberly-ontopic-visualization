import React from "react";
import ReactDOM from "react-dom";

import DataTools from './utils/DataTools';

import './styles/ontopic.css';

/**
 *
 */
export class OnTopicVisualization extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state={
    };

    this.dataTools=new DataTools ();    
  }

  /**
   *
   */
  componentDidUpdate(prevProps) {
    console.log ("componentDidUpdate ()");    
    /*
    if (this.props.trigger) {
      if (this.props.trigger!=prevProps.trigger) {
        this.setState ({
          trigger: this.props.trigger
        });
      }
    }
    */
  }

  /**
   *
   */
  render () {
    console.log ("render()");

    return (<div tabIndex="0" className="ontopic">
        {this.props.children}      
      </div>);
  }
}

export default OnTopicVisualization;
