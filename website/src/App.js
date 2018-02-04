import React, { Component } from 'react';
import Park from './Park.js';
import './App.css';
import axios from 'axios';
import 'material-components-web/dist/material-components-web.min.css'
import 'material-components-web/dist/material-components-web.js'
import groupby from 'group-by';

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
  lookupData(index) {
    return this.state.data.find(d => d._id === index);
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      this.loadData();
    }, 60*1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    var groups = groupby(this.state.parkhausData, "bereich");
    return (
      <div className="App mdc-typography">
        <h1 className="mdc-typography--title">Konstanzer Parkmöglichkeiten</h1>
        {
          Object.keys(groups).map(key =>
            <div key={key}>
              <h1 className="mdc-typography--headline">{key}</h1>
              <div className="mdc-layout-grid">
                <div className="mdc-layout-grid__inner">
                  {
                    groups[key]
                    .sort((p1, p2) => p1.bezeichnung > p2.bezeichnung)
                    .map(p => <Park data={this.lookupData(p.index)} parkhaus={p} key={p.index} />)
                  }
                </div>
              </div>
            </div>
          )
        }
        <script>mdc.autoInit()</script>
      </div>
    );
  }
}

export default App;
