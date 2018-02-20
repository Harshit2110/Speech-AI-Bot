document.addEventListener('DOMContentLoaded',function () {

    const socket = io();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    document.querySelector('button').addEventListener('click',function () {
        recognition.start();
    });

    recognition.addEventListener('speechstart',function () {
        console.log('Speech has been detected');
    });
    
    recognition.addEventListener('result',function (e) {
        console.log('Result has been detected');

        var text = e.results[0][0].transcript;
        document.querySelector('.output-you').textContent = text;

        console.log('Confidence: ' + e.results[0][0].confidence); // Probability of result given as being correct.

        socket.emit('input message',text);
    });

    recognition.addEventListener('speechend',function () {
        recognition.stop();
    });

    recognition.addEventListener('error',function (e) {
        document.querySelector('.output-bot').textContent = e.error;
    });

    function aiVoice(aiText) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = aiText;
        synthesis.speak(utterance);
    }

    socket.on('output message',function (aiText) {
        aiVoice(aiText);
        if(aiText == ''){
            aiText = 'No answer!';
        }
        document.querySelector('.output-bot').textContent = aiText;
    });
});