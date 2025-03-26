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

function startRecording() {
    console.log("Recording started...");
    // Implement recording functionality
}

function stopRecording() {
    console.log("Recording stopped...");
    // Implement stop and send recording functionality
}
