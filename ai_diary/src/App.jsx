import {useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import {AudioRecorder} from "react-audio-voice-recorder";
import './App.css'
import generatePrompts from './components/GPT3_API.jsx';
import TranscriptionModule from "./components/TranscriptionModule.jsx";
import WhisperTranscription from "./components/Whisper_API.jsx";
import VoiceRecorder from "./components/RecordVoice.jsx";

const App = () => {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        setPrompt(event.target.elements.prompt.value);
    };

    useEffect(() => {
        if (prompt) {
            generatePrompts(prompt).then(completion => setAnswer(completion));
        }
    }, [prompt]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea name="prompt"/>
                <button type="submit">Submit</button>
            </form>
            {prompt && <div>{answer}</div>}
            <VoiceRecorder/>
        </div>
    );
};

export default App;

