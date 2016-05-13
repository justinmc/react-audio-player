# React Audio Player
This is a light React wrapper around the HTML5 audio tag.  It provides the ability to manipulate the player and listen to events through a nice React interface.

# if you find the error about 'this.refs', you can copy the content of src/index.jsx and paste on your poject building!!!

## Installation

    npm install react-audio-player --save

## Usage

    <ReactAudioPlayer
      src="my_audio_file.ogg"
      autoplay="true"
    />

## API

#### listenInterval {Number} [10000]
Indicates how often to call the `onListened` prop during playback, in milliseconds.

#### onAbort {Function}
Called when unloading the audio player, like when switching to a different src file. Passed the event.

#### onCanPlay {Function}
Called when enough of the file has been downloaded to be able to start playing.  Passed the event.

#### onEnded {Function}
Called when playback has finished to the end of the file. Passed the event.

#### onError {Function}
Called when the audio tag encounters an error. Passed the event.

#### onListened {Function}
Called every `listenInterval` milliseconds during playback.  Passed the event.

#### onPause {Function}
Called when the user pauses playback. Passed the event.

#### onPlay {Function}
Called when the user taps play.  Passed the event.

#### onSeeked {Function}
Called when the user drags the time indicator to a new time. Passed the event.

#### preload {String}
Indicates whether the browser should preload the media. See the [audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for details.
