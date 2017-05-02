import React, { Component } from 'react';
import { Map, Marker} from 'react-amap'
import {Layout, Menu, DatePicker, TimePicker, Button} from 'antd'
import moment from 'moment'
import axios from 'axios'
import './App.css';

const { Header, Content, Footer } = Layout
const API = 'http://bike:12345'


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
          <Container />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          MoBike ©2017 Created by c1ay
      </Footer>
      </Layout>
    );
  }
}

class Container extends Component {

  constructor () {
    super();
    this.state = {
      locations: []
    }
    this.changeTime = this.changeTime.bind(this);
    this.changeTime('');
  }

  changeTime (time) {
    // this.setState({timeRange: time});
    axios.get(API + "/bike/mobike", { 
      params: {
        timeRange: time
      }
    }).then(function(response){
      this.setState({
        locations: response.data
      });
    }.bind(this))

  } 

  render () {
    return (
      <div style={{ padding: 10 }}>
        <TimeSearch changeTime={this.changeTime}/>
        <BikeMap locations={this.state.locations}/>
      </div>
    )
  }
}

class TimeSearch extends Component {

  constructor(){
    super();
    this.state = {
      loading: false,
      date: "",
      time: ""
    };
  }

  setDate = (value, dateString) => {
    this.setState({date: dateString})
  }

  setTime = (value, time) => {
    this.setState({time: time})
  }

  bikeSearch = () => {
    this.setState({'loading': true})
    this.props.changeTime(this.state.date + ' ' + this.state.time);
    this.setState({'loading': false})
  }

  render() {
    return (
      <div style={{ display: 'flex', padding: 30 }}>
        <div style={{ margin: 'auto' }}>
          <DatePicker format="YYYY-MM-DD" size='large' defaultValue={moment()} onChange={this.setDate} />
          <TimePicker format="HH:mm" size='large' defaultValue={moment()} onChange={this.setTime} />
          <Button icon="search" type="primary" loading={this.state.loading} onClick={this.bikeSearch.bind(this)}>
            Search
          </Button>
        </div>
      </div>
    )
  }
}


class BikeMap extends Component {

  getMarkers(locations) {
    return locations.map((item) => 
      <Marker
        position={item}
      />
    )
  }

  render() {
    console.log(this.props.locations);
    var locations = [];
    for (var i=0; i<this.props.locations.length;i++){
      locations.push(
        <Marker position={this.props.locations[i]}/>
      )
    }
    return (
      <div style={{ paddingTop: 30, display: 'flex'}} >
        <div style={{ width: '60%', height: 800, margin: 'auto' }}>
          <Map zoom={12} plugins={["ToolBar"]} >
              {/*<Marker
                position={this.props.locations}*/}
              />
              {locations}
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