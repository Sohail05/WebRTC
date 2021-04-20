import { WebRTC } from './webrtc';
import { MediaStreamFactory } from "./media-stream-factory";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getUrlVars() {
    var urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach((val, key) => {
        console.log(`${key}: ${val}`);
    })
    return urlParams;
}


const configuration = { 'iceServers': [{ 'urls': 'stun:stun2.l.google.com:19302' }] }
const sdpConstraints: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};
export class App {

    peerOffer = new WebRTC(configuration)
    peerAnswer = new WebRTC(configuration)

    async init() {

        const videoA = document.body.querySelector("video") as any;
        const stream = await videoA.captureStream() as MediaStream;

        const videoB = document.createElement("video");
        //videoB.srcObject = stream;
        videoB.autoplay = true;
        videoB.muted = true;
        videoB.height = 200;
        videoB.controls = true;
        videoB.poster = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
        document.body.appendChild(videoB);

        //const mediaStream = await navigator.mediaDevices.getUserMedia({audio:true});

        this.peerAnswer.peerConnection.addEventListener("track", (event) => {
            console.log(event);

            //videoB.srcObject = event.streams[0].getTracks()[0].
        })

        stream.addEventListener("addtrack", (event: MediaStreamTrackEvent) => {
            this.peerOffer.peerConnection.addTrack(event.track, stream);
        })

        this.peerAnswer.peerConnection.addEventListener("track", (event) => {
            console.log(event);
        })

        this.peerOffer.peerConnection.addEventListener("icecandidate", (event) => {
            this.peerAnswer.peerConnection.addIceCandidate(event.candidate as any)
        })

        this.peerAnswer.peerConnection.addEventListener("icecandidate", (event) => {
            this.peerOffer.peerConnection.addIceCandidate(event.candidate as any)
        })


        this.peerOffer.peerConnection.addEventListener("connectionstatechange", (event) => {
            console.log(event);
        })


        // Create DataChannels

        this.peerOffer.peerConnection.addEventListener("datachannel", (event) => {
            const channel = event.channel;
            channel.onclose = () => { console.log("close") };
            channel.onmessage = (message) => { console.log("message", message) };
            channel.onerror = (error) => { console.log("error", error) }
            channel.onopen = () => {
                console.log("open")
                channel.send("hallow")
            }
        })


        this.peerAnswer.peerConnection.addEventListener("datachannel", (event) => {
            const channel = event.channel;
            channel.onclose = () => { console.log("close") };
            channel.onmessage = (message) => { console.log("message", message) };
            channel.onerror = (error) => { console.log("error", error) }
            channel.onopen = () => {
                console.log("open")
                channel.send("hallow")
            }
        })


        const offerChannel = await this.peerOffer.createDataChannel("hello");
        const answerChannel = await this.peerAnswer.createDataChannel("hello");

        // Start WebRTC Connection
        const offer = await this.peerOffer.createOffer(sdpConstraints);
        const answer = await this.peerAnswer.setOffer(offer as any);
        this.peerOffer.setAnswer(answer as any);
    }

}