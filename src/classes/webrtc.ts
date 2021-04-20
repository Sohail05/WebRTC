export class WebRTC {

    public readonly peerConnection: RTCPeerConnection;
    private readonly dataChannels: Map<string, RTCDataChannel> = new Map()

    constructor(config) {
        this.peerConnection = new RTCPeerConnection(config);
    }

    async createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
        const offer = await this.peerConnection.createOffer(options);
        await this.peerConnection.setLocalDescription(offer);
        return offer;
    }

    async setOffer(remoteOffer: RTCSessionDescription): Promise<RTCSessionDescriptionInit> {
        await this.peerConnection.setRemoteDescription(remoteOffer);
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        return answer
    }

    async setAnswer(remoteAnswer: RTCSessionDescription) {
        await this.peerConnection.setRemoteDescription(remoteAnswer);
    }

    async createDataChannel(channelName) {
        const dataChannel = this.peerConnection.createDataChannel(channelName)
        this.dataChannels.set(channelName, dataChannel)
        return dataChannel;
    }

}


// Offer Answer Phase
// PeerA - PeerB

// Step 1
// PeerA creates Offer 
// PeerA Set Offer as local description
// PeerA Send offer to peerB

// Step 2
// PeerB set Offer as remote description
// PeerB creates Answer 
// PeerB Set Answer local description
// PeerB send Answer to peerA

// Step 3
// PeerA set answer as remote description