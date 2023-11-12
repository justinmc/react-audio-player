# React Audio Player
This is a light React wrapper around the HTML5 audio tag.  It provides the ability to manipulate the player and listen to events through a nice React interface.

## Installation

    npm install --save react-audio-player

Also be sure you have `react` and `react-dom` installed in your app at version 15 or above.

## Usage

    import ReactAudioPlayer from 'react-audio-player';
    //...
    <ReactAudioPlayer
      src="my_audio_file.ogg"
      autoPlay
      controls
    />

### Example

See the example directory for a basic working example of using this project.  To run it locally, run `npm install` in the example directory and then `npm start`.

## Props

### Props - Native/React Attributes
See the [audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for detailed explanations of these attributes.

Prop | Type | Default | Notes
--- | --- | --- | ---
`autoPlay` | Boolean | false | ---
`children` | Element | null | ---
`className` | String | *empty string* | ---
`controls` | Boolean | false | ---
`crossOrigin` | String | *empty string* | See [MDN's article on CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for more about this attribute.
`controlsList` | String | *empty string* | For Chrome 58+. Only available in React 15.6.2+
`id` | String | *empty string* | ---
`loop` | Boolean | false | ---
`muted` | Boolean | false | ---
`volume` | Number | 1.0 | ---
`preload` | String | 'metadata' | ---
`src` | String | *empty string* | ---
`style` | Object | --- | ---

### Props - Events

Prop | Type | Description
--- | --- | --- 
`listenInterval` | Number | Indicates how often to call the `onListened` prop during playback, in milliseconds. Default is 10000.
`onAbort` | Function | called when unloading the audio player, like when switching to a different src file. Passed the event.
`onCanPlay` | Function | called when enough of the file has been downloaded to be able to start playing.  Passed the event.
`onCanPlayThrough` | Function | called when enough of the file has been downloaded to play through the entire file.  Passed the event.
`onEnded` | Function | called when playback has finished to the end of the file. Passed the event.
`onError` | Function | called when the audio tag encounters an error. Passed the event.
`onListen` | Function | called every `listenInterval` milliseconds during playback.  Passed the event.
`onPause` | Function | called when the user pauses playback. Passed the event.
`onPlay` | Function | called when the user taps play.  Passed the event.
`onSeeked` | Function | called when the user drags the time indicator to a new time. Passed the event.
`onVolumeChanged` | Function | called when the user changes the volume, such as by dragging the volume slider | 
`onLoadedMetadata` | Function | called when the metadata for the given audio file has finished downloading.  Passed the event.

## Advanced Usage

### Access to the audio element
You can get direct access to the underlying audio element. First get a ref to ReactAudioPlayer with useRef():

    const audioPlayerRef = useRef<ReactAudioPlayer>(null)

Then you can access the audio element like this:

    <ReactAudioPlayer
      src={url}
      ref={audioPlayerRef}
    />

This is especially useful if you need access to read-only attributes of the audio tag such as `buffered` and `played`. See the [audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for more on these attributes.

You can also use this to create custom controls such as play, pause, or stop buttons, like this:

    const [isPlaying, setIsPlaying] = useState(autoPlay)

    const playAudio = () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.audioEl.current?.play()
        setIsPlaying(true)
      }
    }

    const pauseAudio = () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.audioEl.current?.pause()
        setIsPlaying(false)
      }
    }
    
    const stopAudio = () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.audioEl.current?.pause()
        audioPlayerRef.current.audioEl.current.currentTime = 0
        setIsPlaying(false)
      }
    }

    return (
      <div>
        <ReactAudioPlayer
          src={url}
          ref={audioPlayerRef}
        />
        <button onClick={playAudio}>Play</button>
        <button onClick={pauseAudio}>Pause</button>
        <button onClick={stopAudio}>Stop</button>
      </div>
    )
