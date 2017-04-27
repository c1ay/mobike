import React, { Component } from 'react';
import { Map, Markers} from 'react-amap'
import {Layout, Menu, DatePicker} from 'antd'
import './App.css';

const { Header, Content, Footer } = Layout

const randomMarker = (len) => (
  Array(len).fill(true).map((e, idx) => ({
    position: {
      longitude: 100 + Math.random() * 20,
      latitude: 30 + Math.random() * 20,
    }
  }))
);

class BikeMap extends Component {
  constructor() {
    super();
    this.mapCenter = { longitude: 120, latitude: 30};
    this.markers = randomMarker(100);
  }
  render() {
    return (
      <div style={{ width: '50%', height: 400 }}>
        <Map zoom={12} plugins={["ToolBar"]} >
          <Markers
            markers={this.markers}
          />
        </Map>
      </div>
    );
  }
};

class SearchTitle extends Comment {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="container">
        <section className="jumbotron">
          <h3 className="jumbotron-heading">Search github users</h3>
        </section>
      </div>
    )
  }
};

class App extends Component {
  render() {
    return (
      // <BikeMap />
      <SearchTitle />
    )
  }
};

export default App;
