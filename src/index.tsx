import React, { Component, ReactNode, CSSProperties } from 'react';
import PropTypes from 'prop-types';

interface ReactAudioPlayerProps {
  autoPlay?: boolean
  children?: ReactNode
  className?: string
  controls?: boolean
  controlsList?: string
  crossOrigin?: string
  id?: string
  listenInterval?: number
  loop?: boolean
  muted?: boolean
  onAbort?: (e: Event) => void
  onCanPlay?: (e: Event) => void
  onCanPlayThrough?: (e: Event) => void
  onEnded?: (e: Event) => void
  onError?: (e: Event) => void
  onListen?: (time: number) => void
  onLoadedMetadata?: (e: Event) => void
  onPause?: (e: Event) => void
  onPlay?: (e: Event) => void
  onSeeked?: (e: Event) => void
  onVolumeChanged?: (e: Event) => void
  preload?: '' | 'none' | 'metadata' | 'auto'
  src?: string, // Not required b/c can use <source>
  style?: CSSProperties
  title?: string
  volume: number
}

interface ConditionalProps {
  controlsList?: string
  [key: string]: any
}

class ReactAudioPlayer extends Component<ReactAudioPlayerProps> {
  static propTypes: Object

  static defaultProps: ReactAudioPlayerProps

  audioEl = React.createRef<HTMLAudioElement>();

  listenTracker?: number

  onError = (e: Event) => this.props.onError?.(e);
  onCanPlay = (e: Event) => this.props.onCanPlay?.(e);
  onCanPlayThrough = (e: Event) => this.props.onCanPlayThrough?.(e);
  onPlay = (e: Event) => {
    this.setListenTrack();
    this.props.onPlay?.(e);
  }
  onAbort = (e: Event) => {
    this.clearListenTrack();
    this.props.onAbort?.(e);
  }
  onEnded = (e: Event) => {
    this.clearListenTrack();
    this.props.onEnded?.(e);
  }
  onPause = (e: Event) => {
    this.clearListenTrack();
    this.props.onPause?.(e);
  }
  onSeeked = (e: Event) => {
    this.props.onSeeked?.(e);
  }
  onLoadedMetadata = (e: Event) => {
    this.props.onLoadedMetadata?.(e);
  }
  onVolumeChanged = (e: Event) => {
    this.props.onVolumeChanged?.(e);
  }

  componentDidMount() {
    const audio = this.audioEl.current;

    if (!audio) return;

    this.updateVolume(this.props.volume);

    audio.addEventListener('error', this.onError);

    // When enough of the file has downloaded to start playing
    audio.addEventListener('canplay', this.onCanPlay);

    // When enough of the file has downloaded to play the entire file
    audio.addEventListener('canplaythrough', this.onCanPlayThrough);

    // When audio play starts
    audio.addEventListener('play', this.onPlay);

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', this.onAbort);

    // When the file has finished playing to the end
    audio.addEventListener('ended', this.onEnded);

    // When the user pauses playback
    audio.addEventListener('pause', this.onPause);

    // When the user drags the time indicator to a new time
    audio.addEventListener('seeked', this.onSeeked);

    audio.addEventListener('loadedmetadata', this.onLoadedMetadata);

    audio.addEventListener('volumechange', this.onVolumeChanged);
  }

  // Remove all event listeners
  componentWillUnmount() {
    const audio = this.audioEl.current;

    if (!audio) return;

    audio.removeEventListener('error', this.onError);

    // When enough of the file has downloaded to start playing
    audio.removeEventListener('canplay', this.onCanPlay);

    // When enough of the file has downloaded to play the entire file
    audio.removeEventListener('canplaythrough', this.onCanPlayThrough);

    // When audio play starts
    audio.removeEventListener('play', this.onPlay);

    // When unloading the audio player (switching to another src)
    audio.removeEventListener('abort', this.onAbort);

    // When the file has finished playing to the end
    audio.removeEventListener('ended', this.onEnded);

    // When the user pauses playback
    audio.removeEventListener('pause', this.onPause);

    // When the user drags the time indicator to a new time
    audio.removeEventListener('seeked', this.onSeeked);

    audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);

    audio.removeEventListener('volumechange', this.onVolumeChanged);
  }

  componentDidUpdate(prevProps: ReactAudioPlayerProps) {
    this.updateVolume(this.props.volume);
  }

  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    if (!this.listenTracker) {
      const listenInterval = this.props.listenInterval;
      this.listenTracker = window.setInterval(() => {
        this.audioEl.current && this.props.onListen?.(this.audioEl.current.currentTime);
      }, listenInterval);
    }
  }

  /**
   * Set the volume on the audio element from props
   * @param {Number} volume
   */
  updateVolume(volume: number) {
    const audio = this.audioEl.current;
    if (audio !== null && typeof volume === 'number' && volume !== audio?.volume) {
      audio.volume = volume;
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      delete this.listenTracker;
    }
  }

  render() {
    const incompatibilityMessage = this.props.children || (
      <p>Your browser does not support the <code>audio</code> element.</p>
    );

    // Set controls to be true by default unless explicity stated otherwise
    const controls = !(this.props.controls === false);

    // Set lockscreen / process audio title on devices
    const title = this.props.title ? this.props.title : this.props.src;

    // Some props should only be added if specified
    const conditionalProps: ConditionalProps = {};
    if (this.props.controlsList) {
      conditionalProps.controlsList = this.props.controlsList;
    }

    return (
      <audio
        autoPlay={this.props.autoPlay}
        className={`react-audio-player ${this.props.className}`}
        controls={controls}
        crossOrigin={this.props.crossOrigin}
        id={this.props.id}
        loop={this.props.loop}
        muted={this.props.muted}
        preload={this.props.preload}
        ref={this.audioEl}
        src={this.props.src}
        style={this.props.style}
        title={title}
        {...this.props}
        {...conditionalProps}
      >
        {incompatibilityMessage}
      </audio>
    );
  }
}

ReactAudioPlayer.defaultProps = {
  autoPlay: false,
  children: null,
  className: '',
  controls: false,
  controlsList: '',
  id: '',
  listenInterval: 10000,
  loop: false,
  muted: false,
  onAbort: () => {},
  onCanPlay: () => {},
  onCanPlayThrough: () => {},
  onEnded: () => {},
  onError: () => {},
  onListen: () => {},
  onPause: () => {},
  onPlay: () => {},
  onSeeked: () => {},
  onVolumeChanged: () => {},
  onLoadedMetadata: () => {},
  preload: 'metadata',
  style: {},
  title: '',
  volume: 1.0,
};

ReactAudioPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  controls: PropTypes.bool,
  controlsList: PropTypes.string,
  crossOrigin: PropTypes.string,
  id: PropTypes.string,
  listenInterval: PropTypes.number,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  onAbort: PropTypes.func,
  onCanPlay: PropTypes.func,
  onCanPlayThrough: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onListen: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onSeeked: PropTypes.func,
  onVolumeChanged: PropTypes.func,
  preload: PropTypes.oneOf(['', 'none', 'metadata', 'auto']),
  src: PropTypes.string, // Not required b/c can use <source>
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  volume: PropTypes.number,
};

export default ReactAudioPlayer;
