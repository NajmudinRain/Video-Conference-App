//javascript for the front end is going to stay in this file
//create video element that can play our video stream
const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement("video"); //The <video> tag is used to embed video content in a document, such as a movie clip or other video streams.
myVideo.muted = true;

// var peer = new Peer(undefined,{
//     path:'/peerjs',
//     host: '/',
//     port:'3030'

// });
var peer = new Peer();
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    //if user except the access of camera and the audio.then promise will run.
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });
peer.on("open", (id) => {
  //id  is id of one who is connectin. id is automatically genreated  by peer obj
  socket.emit("join-room", ROOM_ID, id);
});
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream; //The srcObject property of the HTMLMediaElement interface sets or returns the object which serves as the source of the media associated with the HTMLMediaElement
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
//can also keep the below code in user_connected event above.
let text = $("input");

$("html").keydown((e) => {
  //can use documet instead of html.
  if (e.which == 13 && text.val().length !== 0) {
    socket.emit("message", text.val());
    text.val("");
  }
});
socket.on("createMessage", (message) => {
  console.log("create ms", message);
  $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);

  scrollToBottom();
});

const scrollToBottom = () => {
  let d = $(".main_chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};
//Mute our video

const muteUnmute = () => {
  console.log(myVideoStream);
  const enabled = myVideoStream.getAudioTracks()[0].enabled;

  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnMuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`;

  document.querySelector(".main_mute_button").innerHTML = html;
};
const setUnMuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i>
<span>Unmute</span>`;

  document.querySelector(".main_mute_button").innerHTML = html;
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
 
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo=()=>{
const html=`<i class="fas fa-video"></i>
<span>Stop Video</span> `

document.querySelector('.main_video_button').innerHTML=html;

}
const setPlayVideo=()=>{
const html=`<i class="fas fa-video-slash"></i>
<span>Play Video</span> `

document.querySelector('.main_video_button').innerHTML= html;

}

