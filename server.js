const express = require("express");
const multer = require("multer");
const cors = require("cors");

// Puter AI SDK
const puter = require("puter-ai-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// Multer setup for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// REST API endpoint for OCR
app.post("/api/ocr", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    try {
        // Convert image buffer to base64
        const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Call Puter AI OCR
        const text = await puter.ai.img2txt({
            source: dataUrl,
            provider: "aws-textract" // change provider if needed
        });

        res.json({ success: true, text: text || "" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Use Render port or default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
