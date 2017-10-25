#! /usr/bin/env node

import 'babel-polyfill';

const { YOUTUBE_PLAYLIST_SORTER_API_KEY } = process.env;
if (!YOUTUBE_PLAYLIST_SORTER_API_KEY) {
  console.error('YOUTUBE_PLAYLIST_SORTER_API_KEY not found in env vars');
  process.exit(1);
}

const rawPlaylistUrl = process.argv[2];
const playlistUrl = rawPlaylistUrl && rawPlaylistUrl.trim();
if (!playlistUrl) {
  console.log('Usage: index.js [playlistUrl]\n');
  console.log('Missing argument: playlistUrl');
  process.exit(1);
}

const abbreviate = require('number-abbreviate');
const playList = require('./playlist');

const main = async () => {
  const playListId = playList.getPlaylistId(playlistUrl);
  if (!playListId) {
    console.error('Looks like an invalid playlist url 😵');
    process.exit(1);
  }
  try {
    const videosList = await playList.getSortedPlaylist(playListId);
    videosList.forEach(prettyPrintVideo);
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

function prettyPrintVideo(video, index) {
  let views = abbreviate(video.statistics.viewCount, 1);
  let likes = abbreviate(video.statistics.likeCount, 1);
  if (video.statistics.viewCount === NaN) views = 'disabled';
  if (video.statistics.likeCount === NaN) likes = 'disabled';
  console.log(`${index + 1}. ${video.snippet.title} [👀  ${views} / 👍  ${likes}]`);
  console.log(`\thttps://www.youtube.com/watch?v=${video.id}`);
  console.log();
}

main();
