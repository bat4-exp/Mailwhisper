let recording = false; // To track whether recording is in progress

// Handle record button click event
const recordBtn = document.getElementById("recordBtn");
recordBtn.addEventListener("click", () => {
    if (!recording) {
        recordBtn.textContent = "⏹️ Stop";  // Change button text when recording starts
        startRecording();  // Start recording
    } else {
        recordBtn.textContent = "🎤 Record";  // Change button text when recording stops
        stopRecording();  // Stop recording
    }
    recording = !recording;  // Toggle the state of recording
});

// Start recording function
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone stream:", stream);
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();  // Start recording
        
        const chunks = [];
        mediaRecorder.ondataavailable = event => chunks.push(event.data);
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
            console.log("Audio Blob:", audioBlob);
            // Call a function to send this audio to Cloudflare Worker
            sendToCloudflare(audioBlob);
        };

        // Stop recording after 10 seconds for testing purposes
        setTimeout(() => {
            mediaRecorder.stop();
        }, 10000);  // Stop after 10 seconds for testing
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to record audio.");
    }
}

// Stop recording function
function stopRecording() {
    // The recording will automatically stop after 10 seconds, or you can add manual stop functionality here.
}

// Function to send audio data to Cloudflare Worker
async function sendToCloudflare(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");
    formData.append("jargon", document.getElementById("jargon").value);  // Collect jargon input
    formData.append("header", document.getElementById("header").value);  // Collect header input
    formData.append("footer", document.getElementById("footer").value);  // Collect footer input
    
    try {
        const response = await fetch('raspy-tooth-a631.bram-admiraal.workers.dev', {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error generating email");
        }

        const emailText = await response.text();
        document.getElementById("outputText").value = emailText;  // Display email in output field
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error processing your request.");
    }
}
