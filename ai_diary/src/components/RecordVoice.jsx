import React, {useState, useRef} from 'react';
import WhisperTranscription from "./Whisper_API.jsx";



const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorder = useRef(null);
    const recordedChunks = useRef([]);

    const startRecording = async () => {
        if (!navigator.mediaDevices) {
            alert('Your browser does not support audio recording.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            mediaRecorder.current = new MediaRecorder(stream, {mimeType: 'audio/webm'});
            recordedChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                saveRecording();
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error(err);
            alert('Error while starting the recording. Please check your microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const saveRecording = async () => {
        const audioBuffer = new Blob(recordedChunks.current, {type: 'audio/webm'});
        const transcript = await WhisperTranscription(new File([audioBuffer], 'audio.webm', {type: 'audio/webm'}));
        setTranscript(transcript);
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <p>{transcript}</p>
        </div>
    );
};

export default VoiceRecorder;
