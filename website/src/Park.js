import React, { Component } from 'react';
import './Park.css';
import 'material-components-web/dist/material-components-web.min.css'
import 'material-components-web/dist/material-components-web.js'
import moment from 'moment';

class Park extends Component {
  render() {
    return (
      <div className="mdc-layout-grid__cell" key={this.props.data._id}>
        <div className="mdc-card">
          <h1 className="mdc-card__title mdc-card__title--large">{this.props.parkhaus.bezeichnung}</h1>
          Frei: {this.props.data.frei}<br/>
          Aktualisiert: {moment(this.props.data.timestamp).format("DD.MM.YYYY HH:mm:ss")}
        </div>
      </div>
    );
  }
}

export default Park;
