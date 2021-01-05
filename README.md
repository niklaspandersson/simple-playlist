# Simple playlist
**Simple playlist** is a browser based playlist controller that supports:
* Local storage for remembering how far you've listened.
* auto play of next clip
* sleep timer

# Usage
Provide a playlist (se below) and you're good to go!

## Playlist format
The playlist file should have the following structure:
```json
{
  "title": "playlist title",
  "clips": [
    {
      "link": "url to first clip",
      "title": "title of first clip"
    },
    {
      "link": "url to second clip",
      "title": "title of second clip"
    },
    ...
  ]
}
```

## Configuration
You can set the following variables during build-time to customize the playlist:
* `REACT_APP_PLAYLIST_URL`: Where to look for the playlist. Defaults to `./playlist.json`.
* `REACT_APP_AUTO_REWIND`: How many seconds to rewind before resuming playback when the browser window has been closed.