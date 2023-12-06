import lamejs from 'lamejs';

class AudioConverter {
    async convertToMp3(blob, callback) {
        const wavBlob = (blob.type === 'audio/wav') ? blob : await this.convertToWav(blob);
        const mp3Blob = await this.encodeWavToMp3(wavBlob);
        const mp3Url = URL.createObjectURL(mp3Blob);
        callback(mp3Url);
    }

    async convertToWav(blob) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return this.encodeAudioBufferToWav(audioBuffer);
    }

    encodeAudioBufferToWav(audioBuffer) {
        const channels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const frameCount = audioBuffer.length;
        const bitDepth = 16;

        const bufferLength = frameCount * channels * (bitDepth / 8);
        const wavBuffer = new ArrayBuffer(44 + bufferLength);
        const view = new DataView(wavBuffer);

        this.writeWAVHeader(view, channels, sampleRate, bitDepth, bufferLength);

        let offset = 44;
        for (let i = 0; i < frameCount; i++) {
            for (let channel = 0; channel < channels; channel++) {
                const sample = audioBuffer.getChannelData(channel)[i];
                const sampleInt16 = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                view.setInt16(offset, sampleInt16, true);
                offset += 2;
            }
        }
        return new Blob([view], { type: 'audio/wav' });
    }

    writeWAVHeader(view, channels, sampleRate, bitDepth, bufferLength) {
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + bufferLength, true);
        this.writeString(view, 8, 'WAVE');

        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, channels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * channels * (bitDepth / 8), true);
        view.setUint16(32, channels * (bitDepth / 8), true);
        view.setUint16(34, bitDepth, true);

        this.writeString(view, 36, 'data');
        view.setUint32(40, bufferLength, true);
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    async encodeWavToMp3(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const buffer = e.target.result;
                    const wav = lamejs.WavHeader.readHeader(new DataView(buffer));
                    if (!wav) throw new Error('Invalid WAV file');

                    const samples = new Int16Array(buffer, wav.dataOffset, wav.dataLen / 2);
                    const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
                    const mp3Data = this.encodeBufferToMp3(samples, mp3Encoder);

                    resolve(new Blob(mp3Data, { type: 'audio/mp3' }));
                } catch (error) {
                    console.error("MP3 Encoding Error: ", error);
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }


    encodeBufferToMp3(samples, mp3Encoder) {
        const bufferLength = 1152;
        const mp3Data = [];

        for (let i = 0; i < samples.length; i += bufferLength) {
            const sampleChunk = samples.subarray(i, i + bufferLength);
            const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
            if (mp3buf.length > 0) {
                mp3Data.push(new Int8Array(mp3buf));
            }
        }

        const endMp3Buffer = mp3Encoder.flush();
        if (endMp3Buffer.length > 0) {
            mp3Data.push(new Int8Array(endMp3Buffer));
        }

        return mp3Data;
    }
}

export default AudioConverter;
