import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import 'material-components-web/dist/material-components-web.min.css'
import 'material-components-web/dist/material-components-web.js'
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = { data: [], parkhausData: [] };
    this.loadData();
  }
  loadData() {
    axios.get('http://localhost:3000/current')
    .then(res => {
      this.setState({data: res.data.data, parkhausData: res.data.parkhausData});
    });
  }
  lookupName(id) {
    return this.state.parkhausData.find(ph => ph.index === id);
  }
  render() {
    return (
      <div className="App mdc-typography">
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            {this.state.data.sort((a,b) => {return this.lookupName(a._id).bezeichnung > this.lookupName(b._id).bezeichnung})
            .map(d => { return (
              <div className="mdc-layout-grid__cell">
                <div className="mdc-card">
                  <h1 className="mdc-card__title mdc-card__title--large">{this.lookupName(d._id).bezeichnung}</h1>
                  Frei: {d.frei}<br/>
                  Aktualisiert: {moment().format("DD.MM.YYYY HH:mm:ss")}
                </div>
              </div> )})}
          </div>
        </div>
        <script>mdc.autoInit()</script>
      </div>
    );
  }
}

export default App;
