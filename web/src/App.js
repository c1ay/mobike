import React, { Component } from 'react';
import { Map, Markers} from 'react-amap'
import {Layout, Menu} from 'antd'
import $ from 'jquery'
import './App.css';

const { Header, Content, Footer } = Layout
const API = 'http://localhost:12345'


class Body extends Component {
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">BikeMap</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          {/*<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Content</div>*/}
          <BikeMap />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          MoBike ©2017 Created by c1ay
      </Footer>
      </Layout>
    );
  }
}

const randomMarker = (len) => (
  Array(len).fill(true).map((e, idx) => ({
    position: {
      longitude: 103.93 + Math.random() * 0.3,
      latitude: 30.48 + Math.random() * 0.3,
    }
  }))
);

function loadMarker() {
  return $.ajax(API);
};

class BikeMap extends Component {
  constructor() {
    super();
    this.markers = randomMarker(100);
    this.loactions = loadMarker();
    console.log(this.loactions)
  }
  render() {
    return (
      <div style={{ paddingTop: 30, display: 'flex'}} >
        <div style={{ width: '60%', height: 800, margin: 'auto' }}>
          <Map zoom={12} plugins={["ToolBar"]} >
            <Markers
              markers={this.loactions}
            />
          </Map>
        </div>
      </div>
    );
  }
};

class App extends Component {
  render() {
    return (
      <Body />
    )
  }
};

export default App;
