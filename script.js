document.getElementById("testBtn").addEventListener("click", async () => {
    try {
        const response = await fetch("https://raspy-tooth-a631.bram-admiraal.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "Test successful" })
        });

        const result = await response.text();
        console.log("Worker response:", result);
    } catch (error) {
        console.error("Error sending test message to Cloudflare Worker:", error);
    }
});

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const recordBtn = document.getElementById("recordBtn");
const outputText = document.getElementById("outputText");

recordBtn.addEventListener("click", async () => {
    if (!isRecording) {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            await sendToWhisper(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        // Change button to red and show "Recording"
        recordBtn.textContent = "Recording...";
        recordBtn.classList.add("recording");
    } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;
        // Change button back to normal state
        recordBtn.textContent = "🎤 Record";
        recordBtn.classList.remove("recording");
    }
});


async function sendToWhisper(audioBlob) {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    try {
        const response = await fetch("https://raspy-tooth-a631.bram-admiraal.workers.dev/transcribe", {
            method: "POST",
            body: formData
        });

        const result = await response.json(); // Assume the Worker returns { transcript: "..." }
        outputText.value = result.transcript;
    } catch (error) {
        console.error("Transcription error:", error);
        outputText.value = "❌ Error transcribing audio.";
    }
}
