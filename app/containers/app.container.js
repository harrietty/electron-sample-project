import React from 'react';
import axios from 'axios';
import Sound from 'react-sound';
import Search from '../components/search.component.js';
import Details from '../components/details.component.js';
import Player from '../components/player.component.js';
import Progress from '../components/progress.component.js';
import Footer from '../components/footer.component.js';
import config from '../../config.js';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.client_id = config.client_id;
    this.state = {
      track: {stream_url: '', title: '', artwork_url: ''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: []
    };
  }
  randomTrack () {
    let _this = this;
    axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}`)
      .then(function (response) {
        console.log(response.data);
        const trackLength = response.data.length;
        const randomNumber = Math.floor((Math.random() * trackLength ) + 1);
        _this.setState({track: response.data[randomNumber]});
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  prepareUrl (url) {
    return `${url}?client_id=${this.client_id}`;
  }
  handleSongPlaying (audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    });
  }
  formatMilliseconds (ms) {
    var hours = Math.floor(ms / 3600000);
    ms = ms % 3600000;

    var minutes = Math.floor(ms / 60000);
    ms = ms % 60000;

    var seconds = Math.floor(ms / 1000);
    ms = Math.floor(ms % 1000);

    return (minutes < 10 ? '0' : '') + (seconds < 10 ? '0' : '');
  }
  handleSongFinished () {
    this.randomTrack();
  }
  handleSelect (value, item) {
    ths.setState({
      autoCompleteValue: value,
      track: item
    });
  }
  handleChange (event, value) {
    this.setState({
      autoCompleteValue: event.target.value
    });
    let _this = this;
    axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
      .then(function (response) {
        _this.setState({
          tracks: response.data
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  togglePlay () {
    if (this.state.playStatus === Sound.status.PLAYING) {
      this.setState({
        playStatus: Sound.status.PAUSED
      });
    } else {
      this.setState({
        playStatus: Sound.status.PLAYING
      });
    }
  }
  stop () {
    this.setState({
      playStatus: Sound.status.STOPPED
    });
  }
  forward () {
    this.setState({
      playFromPosition: this.state.playFromPosition+=1000*10
    });
  }
  backward () {
    this.setState({
      playFromPosition: this.state.playFromPosition-=1000*10
    });
  }
  componentDidMount () {
    this.randomTrack();
  }
  xlArtwork (url) {
    return url.replace(/large/, 't500x500');
  }
  render () {
    console.log(this.state);
    const scotchStyle = {
      width: '500px',
      height: '500px',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${this.xlArtwork(this.state.track.artwork_url)})`
    }
    return (
      <div className='scotch_music' style={scotchStyle}>
        <Search autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)} />
        <Sound url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)} />
        <Details title={this.state.track.title} />
        <Player togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          random={this.randomTrack.bind(this)} />
        <Progress elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position} />
        <Footer />
      </div>
    );
  }
}

export default AppContainer;
