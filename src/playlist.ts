export type Playlist = {
  title: string;
  clips: Clip[];
}

export type Clip = {
  index: number;
  title: string;
  link: string;
  startTime?: number;
}

export async function getPlaylist(url:string) {
  let result:Playlist|null = null;
  try {
    const res = await window.fetch(url);
    const playlist = await res.json();
    playlist.clips = (playlist.clips as Clip[]).map((c, i) => ({...c, index: i}));
    result = playlist;
  }
  catch(err) {
    console.error(err)
  }
  return result;
}