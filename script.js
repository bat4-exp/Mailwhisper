const recordBtn = document.getElementById("recordBtn");
const settingsBtn = document.getElementById("settingsBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const outputText = document.getElementById("outputText");
const settingsPopup = document.getElementById("settingsPopup");
const closeBtn = document.querySelector(".close-btn");
const translateToggle = document.getElementById("translateToggle");
const languageSelect = document.getElementById("languageSelect");

let recording = false;
let audioBlob = null; // Store audio data here

// Cloudflare Worker URL
const WORKER_URL = "https://raspy-tooth-a631.bram-admiraal.workers.dev/";  // Replace with your Worker URL

recordBtn.addEventListener("click", () => {
    if (!recording) {
        recordBtn.textContent = "⏹️ Stop";
        startRecording();
    } else {
        recordBtn.textContent = "🎤 Record";
        stopRecording();
    }
    recording = !recording;
});

settingsBtn.addEventListener("click", () => {
    settingsPopup.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    settingsPopup.style.display = "none";
});

clearBtn.addEventListener("click", () => {
    outputText.value = "";
    copyBtn.style.display = "none";
});

outputText.addEventListener("input", () => {
    copyBtn.style.display = outputText.value ? "block" : "none";
});

copyBtn.addEventListener("click", () => {
    outputText.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
});

translateToggle.addEventListener("change", () => {
    languageSelect.style.display = translateToggle.checked ? "block" : "none";
});

// Function to start recording
async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.start();
    
    const chunks = [];
    mediaRecorder.ondataavailable = event => chunks.push(event.data);
    mediaRecorder.onstop = async () => {
        audioBlob = new Blob(chunks, { type: 'audio/mp3' });
    };

    // Stop recording after 10 seconds (adjust as necessary)
    setTimeout(() => {
        mediaRecorder.stop();
    }, 10000); // Stop after 10 seconds
}

// Function to stop recording and send audio to the Cloudflare Worker
async function stopRecording() {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");
    formData.append("jargon", document.getElementById("jargon").value);
    formData.append("header", document.getElementById("header").value);
    formData.append("footer", document.getElementById("footer").value);

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error generating email");
        }

        const emailText = await response.text();
        outputText.value = emailText;
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error processing your request.");
    }
}
