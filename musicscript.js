const title = document.querySelector('.title');
const prev = document.querySelector('.prev');
const playPause = document.querySelector('.playPause');
const stop = document.querySelector('.stop');
const next = document.querySelector('.next');
const audio = document.querySelector('audio');
const timeView = document.querySelector('.timeView');

const audioSeekBar = document.querySelector(".audioSeekBar");
const volumeSeekBar = document.querySelector(".volumeSeekBar");
const speedSeekBar = document.querySelector(".speedSeekBar");

const volumeToggle = document.querySelector(".volumeToggle");
let muteValue = false;

let playbackSpeed = 1;

const downloadButton = document.querySelector('.downloadButton');
let downloadFile;

// at initial volume = 50%
audio.volume = 0.5;

const displayRound = document.querySelector(".display");

//first,we will create song list
const songList = [
    {
        path: "C:\Users\kalya\Downloads\Love-Me-Like-You-Do(PaglaSongs).mp3",
        songName: "Love Me Like You Do",
    },
    {
        path: "C:\Users\kalya\Downloads\Night-Changes(PaglaSongs).mp3",
        songName: "Night Changes",
    },
    {
        path: "C:\Users\kalya\Downloads\BLACKPINK-PLAYING-WITH-FIRE-(HiphopKit.com).mp3",
        songName: "Playing With Fire",
    },
    {
        path: "C:\Users\kalya\Downloads\BTS_ft_Halsey_-_Boy_With_Luv_OpraDre.com_.mp3",
        songName: "Boy With Luv",
    },
    {
        path: "songs/barcelona.mp3",
        songName: "barcelona",
    },
];

let song_playing = false;

let totalTime;
let seekTime;

//play song
function playSong() {
    clearInterval(seekTime);
    song_playing = true;
    audio.play();
    audio.playbackRate = playbackSpeed;
    seekTime = setInterval(function () {
        totalTime = setSecondsToTime(audio.duration);
        timeView.textContent = setSecondsToTime(audio.currentTime) + " / " + totalTime;
        audioSeekBar.value = audio.currentTime / audio.duration * 100;

        if (audio.currentTime == audio.duration) {
            nextSong();
        }
    }, 1000);
    playPause.classList.add('active');
    playPause.classList.add('round');
    displayRound.classList.add('roundRotate');
    //change icon to pause
    playPause.innerHTML = '<i class="uil uil-pause"></i>';
}
//pause song
function pauseSong() {
    clearInterval(seekTime);
    song_playing = false;
    audio.pause();
    playPause.classList.remove('active');
    playPause.classList.remove('round');
    displayRound.classList.remove('roundRotate');
    //change icon to play
    playPause.innerHTML = '<i class="uil uil-play"></i>';
}
//stop song
function stopSong() {
    clearInterval(seekTime);
    audio.currentTime = 0;
    song_playing = false;
    audio.pause();
    timeView.textContent = setSecondsToTime(audio.currentTime) + " / " + setSecondsToTime(audio.duration);
    playPause.classList.remove('active');
    playPause.classList.remove('round');
    displayRound.classList.remove('roundRotate');
    audioSeekBar.value = 0;
    //change icon to play
    playPause.innerHTML = '<i class="uil uil-play"></i>';
}
//get duration from seconds to [hour,minute,seconds]
function setSecondsToTime(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    var ret = "";
    
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    
    // Output like "1:01" or "4:03:59" or "123:03:59"
    return ret;
}

//play or pause song on click
playPause.addEventListener("click", () =>
    (song_playing ? pauseSong() : playSong())
);

//stop song on click
stop.addEventListener("click", stopSong);

//load song
function loadSong(song) {
    title.textContent = song.songName;
    audio.src = song.path;
    downloadFile = song.path;
}

//current song
let i = 0;

//on load  - select first song from song list
loadSong(songList[i]);

//display duration  on screen on loading after audio loaded the song
audio.onloadedmetadata = function () {
    timeView.textContent = setSecondsToTime(audio.currentTime) + " / " + setSecondsToTime(audio.duration);
};

//previous song and play
function prevSong() {
    i--;
    if (i < 0) {
        i = songList.length - 1;
    }
    loadSong(songList[i]);
    playSong();
}
//previous song on click
prev.addEventListener("click", prevSong);

//next song and play
function nextSong() {
    i++;
    if (i > songList.length - 1) {
        i = 0;
    }
    loadSong(songList[i]);
    playSong();
}
//next song on click
next.addEventListener("click", nextSong);


// Allows you to seek audio on the range
function audioSeekBarOperation() {
    audio.currentTime = audio.duration - (audio.duration * (1 - audioSeekBar.value / 100));
    timeView.textContent = setSecondsToTime(audio.currentTime) + " / " + setSecondsToTime(audio.duration);
}
audioSeekBar.addEventListener("change", audioSeekBarOperation);
// for solving seekbar click bug 
audioSeekBar.addEventListener("click", function () {
    clearInterval(seekTime);
    if (song_playing) {
        playSong();
    }
});

// Allows you to seek volume on the range
function volumeSeekBarOperation() {
    audio.volume = volumeSeekBar.value / 100;
}
volumeSeekBar.addEventListener("change", volumeSeekBarOperation);

// Volume mute and unmute
function muteAndUnmuteAudio() {
    audio.muted = muteValue = !muteValue;
    volumeToggle.innerHTML = muteValue ? '<i class="uil uil-volume-mute"></i>' : '<i class="uil uil-volume"></i>';
}
volumeToggle.addEventListener("click", muteAndUnmuteAudio)

// Allows you to seek speed on the range .25 .5 .75 1 1.25 1.5 1.75 2
function speedSeekBarOperation() {
    let speedValue = speedSeekBar.value;
    switch (speedValue) {
        case '1': audio.playbackRate = 0.25; playbackSpeed = 0.25; break;
        case '2': audio.playbackRate = 0.5; playbackSpeed = 0.5; break;
        case '3': audio.playbackRate = 0.75; playbackSpeed = 0.75; break;
        case '4': audio.playbackRate = 1; playbackSpeed = 1; break;
        case '5': audio.playbackRate = 1.25; playbackSpeed = 1.25; break;
        case '6': audio.playbackRate = 1.5; playbackSpeed = 1.5; break;
        case '7': audio.playbackRate = 1.75; playbackSpeed = 1.75; break;
        case '8': audio.playbackRate = 2; playbackSpeed = 2; break;
        default: audio.playbackRate = 1;
    }
}
speedSeekBar.addEventListener("change", speedSeekBarOperation);

//download operation
function downloadOperation() {
    downloadButton.href = downloadFile;
}
downloadButton.addEventListener("click", downloadOperation);