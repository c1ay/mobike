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
    // this.changeTime('');
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

  constructor() {
    super();
    const _this = this;
    this.map = null;
    this.heatmap = null;
    this.state = {
      center:{"longitude":104.0650, "latitude":30.6570},
      // center:{"longitude":116.418261, "latitude": 39.921984},
      points:[
          { "lng": 104.025038, "lat": 30.768801, "count": 80 },
          { "lng": 103.92373, "lat": 30.606077, "count": 30 },
          { "lng": 104.1735, "lat": 30.562751, "count": 12 },
          { "lng": 104.141078, "lat": 30.668506, "count": 23 },
          { "lng": 104.071574, "lat": 30.7207559, "count": 34 },
          { "lng": 104.105943, "lat": 30.704395, "count": 55 },
          { "lng": 104.173303, "lat": 30.654361, "count": 10 },
          { "lng": 104.065694, "lat": 30.500795, "count": 45 },
          { "lng": 104.145487, "lat": 30.520160, "count": 66 },
          { "lng": 104.079207, "lat": 30.560209, "count": 7 },
          { "lng": 104.0652, "lat": 30.6570, "count": 70 },
          { "lng": 104.0672, "lat": 30.6589, "count": 80 },
          { "lng": 104.0688, "lat": 30.6575, "count": 60 },
          { "lng": 104.0688, "lat": 30.6605, "count": 43 },
          { "lng": 104.0688, "lat": 30.6677, "count": 32 },
          { "lng": 104.0652, "lat": 30.67011, "count": 77 },
          { "lng": 104.0652, "lat": 30.64981, "count": 14 },
          { "lng": 104.0652, "lat": 30.65677, "count": 46 },
          { "lng": 104.0652, "lat": 30.65588, "count": 45 },
          { "lng": 104.0708, "lat": 30.6575, "count": 53},
          { "lng": 104.16191, "lat": 30.564055, "count": 66 },
          { "lng": 104.0681, "lat": 30.6568, "count": 60 },
          { "lng": 104.093411, "lat": 30.610457, "count": 54 },
        ]
    };
    this.mapEvents = {
      created(map) {
        _this.map = map;
        map.plugin("AMap.Heatmap", () => {
          console.log('222');
          _this.heatmap = new window.AMap.Heatmap(map);
          console.log('333');
          _this.heatmap.setDataSet({
            data: _this.state.points,
            max: 100
          });
          console.log('444');
          // _this.heatmap.show();
        })
      }
    };
  }

  getMarkers(locations) {
    return locations.map((item) => 
      <Marker
        position={item}
      />
    )
  }

  render() {
    // console.log(this.props.locations);
    var locations = [];
    for (var i=0; i<this.props.locations.length;i++){
      locations.push(
        <Marker position={this.props.locations[i]}/>
      )
    }
    return (
      <div style={{ paddingTop: 30, display: 'flex'}} >
        <div style={{ width: '60%', height: 800, margin: 'auto' }}>
          <Map zoom={12} plugins={["ToolBar"]} events={this.mapEvents} center={this.state.center}>
              {/*<Marker
                position={this.props.locations}*/}
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