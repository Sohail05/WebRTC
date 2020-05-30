import { MediaStreamFactory } from "./media-stream-factory";

//https://webrtc.org/getting-started/peer-connections
function getUrlVars() {
    var urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach((val, key) => {
        console.log(`${key}: ${val}`);
    })
    return urlParams;
}

export class App {

    constructor() { }

    async init() {

        // -----------------------------------------------------
        // Get Media Stream
        const mediaStream = await new MediaStreamFactory().request();

        // -----------------------------------------------------
        // DOM Element

        // Create Video Element and append to DOM
        const video = document.createElement("video");

        //Feed MediaStream and autoplay
        video.srcObject = mediaStream;
        video.autoplay = true;
        video.muted = true;

        document.body.appendChild(video);

        // -----------------------------------------------------
        // WebSocket

        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = (event) => {

            console.log("WebSocket Connected");
            ws.send(JSON.stringify({message: "AddPeer", user: getUrlVars().get("user")}))

            ws.onmessage = (messageEvent) => {

                switch (typeof messageEvent.data) {
                    case "string":
                        try {
                            var json = JSON.parse(messageEvent.data);
                            console.log(json);
                            
                        } catch (e) {
                            console.error(messageEvent.data, e, "Something went wrong in the input format, expecting");
                        }
                        break;
                }

                //makeCall()
            };

        }

        // -----------------------------------------------------

        /*
        console.log(this);

        const constraints: MediaStreamConstraints = {
            audio: { echoCancellation: true },
            video: {},
        }

        //console.log('Got MediaStream:', stream);
        //const canvas = document.createElement("canvas");
        //canvas.
        const video = document.createElement("video");
        stream.then((mediaStream: MediaStream) => {
            video.srcObject = mediaStream;
            video.autoplay = true;
            video.controls = true;
            video.muted = true;
        });

        document.body.appendChild(video);

        async function makeCall() {
            const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
            const peerConnection = new RTCPeerConnection(configuration);
            ws.addEventListener('message', async message => {
                //console.log(message);

                /*if (message.answer) {
                    const remoteDesc = new RTCSessionDescription(message.answer);
                    await peerConnection.setRemoteDescription(remoteDesc);
                }
            });
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            ws.send(JSON.stringify({ 'offer': offer }));
        }
        */
    }

}