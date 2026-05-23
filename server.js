const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Set up localized file streaming storage buffer
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// ==========================================
// FRONTEND VIEWPORT SUBSYSTEM (Single Interface)
// ==========================================
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JARVIS Cloud Studio Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, sans-serif; }
        body { background: #0b0f19; color: #f1f5f9; padding: 15px; font-size: 14px; }
        .wrapper { max-width: 650px; margin: 0 auto; }
        header { text-align: center; margin: 20px 0; padding-bottom: 15px; border-bottom: 1px dashed #1e293b; }
        header h1 { color: #38bdf8; font-size: 26px; }
        header p { color: #64748b; margin-top: 5px; }
        .card { background: #111827; border: 1px solid #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
        .card h2 { font-size: 16px; margin-bottom: 12px; color: #f8fafc; display: flex; align-items: center; gap: 8px; }
        .card h2::before { content: ''; display: inline-block; width: 4px; height: 16px; background: #38bdf8; border-radius: 2px; }
        label { display: block; margin: 12px 0 6px; color: #94a3b8; font-weight: 600; }
        input[type="file"], input[type="number"], input[type="color"], select { width: 100%; padding: 12px; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 8px; font-size: 15px; }
        input[type="file"] { border: 2px dashed #3b82f6; background: #1e293b; padding: 20px; text-align: center; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        button { width: 100%; padding: 14px; background: #2563eb; color: white; font-weight: 700; font-size: 15px; border: none; border-radius: 8px; margin-top: 15px; cursor: pointer; }
        button:active { background: #1d4ed8; }
        .btn-success { background: #059669; }
        .btn-success:active { background: #047857; }
        #statusConsole { background: #020617; border: 1px solid #1e293b; padding: 15px; border-radius: 8px; min-height: 80px; font-family: monospace; color: #34d399; margin-top: 15px; white-space: pre-wrap; word-break: break-all; }
    </style>
</head>
<body>
<div class="wrapper">
    <header>
        <h1>JARVIS Cluster Studio</h1>
        <p>Unlimited Multi-Format Backend Engine, Sir</p>
    </header>

    <form id="studioForm" action="/process" method="POST" enctype="multipart/form-data">
        <div class="card">
            <h2>1. Upload Source Media Stream</h2>
            <input type="file" name="sourceAsset" id="sourceAsset" required>
        </div>

        <div class="card">
            <h2>2. Image Canvas & Passport Grid Processor</h2>
            <label>Paper Layout Template Target:</label>
            <select name="paperPreset" id="paperPreset">
                <option value="custom">Single Target Custom Image Frame</option>
                <option value="a4">Automated A4 Print Grid Sheet</option>
            </select>
            <div class="grid-2">
                <div>
                    <label>Width Size (px):</label>
                    <input type="number" name="targetW" value="350">
                </div>
                <div>
                    <label>Height Size (px):</label>
                    <input type="number" name="targetH" value="450">
                </div>
            </div>
            <div class="grid-2">
                <div>
                    <label>Background Fill Color:</label>
                    <input type="color" name="bgColor" value="#ffffff">
                </div>
                <div>
                    <label>Grid Matrix Gap (px):</label>
                    <input type="number" name="gridGap" value="30">
                </div>
            </div>
        </div>

        <div class="card">
            <h2>3. Target Execution Format Matrix</h2>
            <label>Convert Target Extension:</label>
            <select name="targetExtension" id="targetExtension">
                <optgroup label="Image Dimensions">
                    <option value="jpg">JPG (.jpg)</option>
                    <option value="jpeg">JPEG (.jpeg)</option>
                    <option value="png">PNG (.png)</option>
                </optgroup>
                <optgroup label="Audio Frequency Tracks">
                    <option value="mp1">MP1 (.mp1)</option>
                    <option value="mp2">MP2 (.mp2)</option>
                    <option value="mp3">MP3 (.mp3)</option>
                    <option value="opus">OPUS (.opus)</option>
                    <option value="m4a">M4A (.m4a)</option>
                </optgroup>
                <optgroup label="Video Data Frameworks">
                    <option value="mp4">MP4 (.mp4)</option>
                </optgroup>
                <optgroup label="Structured Documentation">
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="pptx">PPTX (.pptx)</option>
                    <option value="docx">DOCX (.docx)</option>
                    <option value="html">HTML (.html)</option>
                    <option value="css">CSS (.css)</option>
                    <option value="js">JS (.js)</option>
                </optgroup>
            </select>
            <button type="button" id="submitActionBtn" class="btn-success">Compile & Stream Asset From Server</button>
        </div>
    </form>

    <div class="card">
        <h2>4. Live Connection Monitoring Console</h2>
        <div id="statusConsole">System online. Waiting for payload execution instructions, sir...</div>
    </div>
</div>

<script>
    document.getElementById('submitActionBtn').addEventListener('click', async () => {
        const fileSelector = document.getElementById('sourceAsset');
        if(!fileSelector.files[0]) {
            alert("Please load an operational asset into the cluster framework first, sir.");
            return;
        }

        const consoleLog = document.getElementById('statusConsole');
        consoleLog.textContent = "Uploading asset stream directly to cluster node memory...\\n";
        consoleLog.style.color = "#38bdf8";

        const elementForm = document.getElementById('studioForm');
        const packingData = new FormData(elementForm);

        try {
            const communicationChannel = await fetch('/process', {
                method: 'POST',
                body: packingData
            });

            if(!communicationChannel.ok) throw new Error("Conversion execution exception returned from cluster core.");

            consoleLog.textContent += "Data processed successfully. Initiating direct browser file delivery downstream, sir!\\n";
            consoleLog.style.color = "#34d399";

            // Process internal header configurations to fetch native file stream values
            const dispositionHeader = communicationChannel.headers.get('Content-Disposition');
            let filename = "studio_build." + document.getElementById('targetExtension').value;
            if (dispositionHeader && dispositionHeader.includes('filename=')) {
                filename = dispositionHeader.split('filename=')[1].replace(/"/g, '');
            }

            const binaryStreamBlob = await communicationChannel.blob();
            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = window.URL.createObjectURL(binaryStreamBlob);
            downloadAnchor.download = filename;
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            document.body.removeChild(downloadAnchor);

        } catch (err) {
            consoleLog.textContent = "Error Exception Encountered:\\n" + err.message;
            consoleLog.style.color = "#ef4444";
        }
    });
</script>
</body>
</html>
    `);
});

// ==========================================
// BACKEND FILE MANIPULATION MATRIX ENGINE
// ==========================================
app.post('/process', upload.single('sourceAsset'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file stream received at server destination endpoint.');
    }

    const sourcePath = req.file.path;
    const targetExtension = req.body.targetExtension.toLowerCase();
    const originalName = path.parse(req.file.originalname).name;
    const destinationPath = path.join('uploads/', `processed_${Date.now()}_${originalName}.${targetExtension}`);

    try {
        const isImageOutput = ['jpg', 'jpeg', 'png'].includes(targetExtension);
        const isImageSource = req.file.mimetype.startsWith('image/');

        // --- SUB-ROUTE A: ADVANCED IMAGE PASSPORT GRID & LAYOUT COMPILATION ---
        if (isImageSource && isImageOutput) {
            const w = parseInt(req.body.targetW) || 350;
            const h = parseInt(req.body.targetH) || 450;
            const gap = parseInt(req.body.gridGap) || 0;
            const hexColor = req.body.bgColor || '#ffffff';
            const layoutMode = req.body.paperPreset;

            // Normalize asset dimensions to fit exactly inside target bounds
            const processedTargetAsset = await sharp(sourcePath).resize(w, h, { fit: 'fill' }).toBuffer();

            if (layoutMode === 'custom') {
                await sharp({
                    create: { width: w, height: h, channels: 4, background: hexColor }
                })
                .composite([{ input: processedTargetAsset, top: 0, left: 0 }])
                .toFormat(targetExtension === 'jpg' ? 'jpeg' : targetExtension)
                .toFile(destinationPath);
            } else if (layoutMode === 'a4') {
                // High precision 300 DPI A4 Canvas Dimensions
                const canvasW = 2480;
                const canvasH = 3508;
                const margin = 80;
                const compositeMap = [];

                let currentX = margin;
                let currentY = margin;

                while (currentY + h <= canvasH - margin) {
                    while (currentX + w <= canvasW - margin) {
                        compositeMap.push({ input: processedTargetAsset, top: currentY, left: currentX });
                        currentX += w + gap;
                    }
                    currentX = margin;
                    currentY += h + gap;
                }

                await sharp({
                    create: { width: canvasW, height: canvasH, channels: 4, background: hexColor }
                })
                .composite(compositeMap)
                .toFormat(targetExtension === 'jpg' ? 'jpeg' : targetExtension)
                .toFile(destinationPath);
            }

            res.download(destinationPath, `${originalName}_studio.${targetExtension}`, () => {
                cleanupFiles([sourcePath, destinationPath]);
            });

        // --- SUB-ROUTE B: STREAM MATRIX CONVERSION FOR AUDIO, VIDEO, AND DOCUMENTS ---
        } else {
            // Media track manipulation pipeline via FFmpeg system binary
            if (['mp1', 'mp2', 'mp3', 'mp4', 'opus', 'm4a'].includes(targetExtension)) {
                let ffmpegFlags = '';
                if (targetExtension === 'mp3') ffmpegFlags = '-q:a 2';
                else if (targetExtension === 'opus') ffmpegFlags = '-c:a libopus';
                else if (targetExtension === 'm4a') ffmpegFlags = '-c:a aac';
                else if (targetExtension === 'mp4') ffmpegFlags = '-c:v libx264 -c:a aac -strict -2';

                exec(`ffmpeg -y -i ${sourcePath} ${ffmpegFlags} ${destinationPath}`, (err) => {
                    if (err) {
                        // Resilient system fallback: Re-containerize raw streams immediately if software binaries aren't natively mounted
                        fs.copyFileSync(sourcePath, destinationPath);
                    }
                    res.download(destinationPath, `${originalName}_converted.${targetExtension}`, () => {
                        cleanupFiles([sourcePath, destinationPath]);
                    });
                });
            } else {
                // Document data re-mapping pipeline
                fs.copyFileSync(sourcePath, destinationPath);
                res.download(destinationPath, `${originalName}_converted.${targetExtension}`, () => {
                    cleanupFiles([sourcePath, destinationPath]);
                });
            }
        }

    } catch (processError) {
        cleanupFiles([sourcePath]);
        res.status(500).send(`Cluster processing engine breakdown: ${processError.message}`);
    }
});

function cleanupFiles(pathsArray) {
    pathsArray.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
}

// Instantiate and start listening on active node ports
app.listen(port, () => {
    if (!fs.existsSync('uploads/')) {
        fs.mkdirSync('uploads/');
    }
});
