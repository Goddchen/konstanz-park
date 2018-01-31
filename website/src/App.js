import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = { data: [], parkhausData: [] };
    this.loadData();
  }
  loadData() {
    axios.get('http://192.168.0.178:3000/current')
    .then(res => {
      this.setState({data: res.data.data, parkhausData: res.data.parkhausData});
    });
  }
  lookupName(id) {
    return this.state.parkhausData.find(ph => ph.index === id);
  }
  render() {
    return (
      <div className="App">
        <p>
          {this.state.data.sort((a,b) => {return this.lookupName(a._id).bezeichnung > this.lookupName(b._id).bezeichnung})
          .map(d => { return <span>{this.lookupName(d._id).bezeichnung}: {d.frei}<br/></span> })}
        </p>
      </div>
    );
  }
}

export default App;
