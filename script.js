document.getElementById("testBtn").addEventListener("click", async () => {
    try {
        const response = await fetch("raspy-tooth-a631.bram-admiraal.workers.dev", {
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
