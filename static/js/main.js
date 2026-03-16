let currentId = 0;
mermaid.initialize({ 
    startOnLoad: false,
    theme: 'default',
    fontFamily: 'Inter, sans-serif'
});

Split(['#editor-area', '#preview-area'], {
    sizes: [40, 60],
    minSize: 300,
    gutterSize: 6,
    cursor: 'col-resize',
});

const editor = document.getElementById('editor');
const preview = document.getElementById('graph');

let renderTimeout;
async function render() {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(async () => {
        const code = editor.value;
        preview.removeAttribute('data-processed');
        try {
            const { svg } = await mermaid.render('mermaid-svg', code);
            preview.innerHTML = svg;
        } catch (e) {
            console.error("Mermaid syntax error", e);
        }
    }, 300); // debounce 300ms
}

async function saveToDB() {
    const title = document.getElementById('title').value || "Untitled";
    const category = document.getElementById('category').value || "General";
    const content = editor.value;
    
    try {
        await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentId, title, category, content })
        });
        loadHistory();
    } catch(e) {
        console.warn('Could not save to DB', e);
    }
}

async function loadHistory() {
    try {
        const res = await fetch('/api/list');
        const data = await res.json();
        const list = document.getElementById('history-list');
        list.innerHTML = '';

        const groups = {};
        (data || []).forEach(d => {
            const cat = d.category || "General";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(d);
        });

        for (const [cat, items] of Object.entries(groups)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'folder-group';
            groupDiv.innerHTML = `<div class="folder-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                ${cat}
            </div>`;
            
            items.forEach(d => {
                const item = document.createElement('div');
                item.className = 'item';
                item.innerHTML = `
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${d.title}</span>
                    <div class="delete-btn" onclick="deleteFromDB(${d.id}, event)" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </div>
                `;
                item.onclick = () => {
                    currentId = d.id;
                    document.getElementById('title').value = d.title;
                    document.getElementById('category').value = d.category;
                    editor.value = d.content;
                    render();
                };
                groupDiv.appendChild(item);
            });
            list.appendChild(groupDiv);
        }
    } catch(e) {
        console.warn('Could not load from DB', e);
    }
}

function resetEditor() {
    currentId = 0;
    document.getElementById('title').value = "";
    document.getElementById('category').value = "";
    editor.value = "graph TD\n    A[Start] --> B(Premium UI Design)\n    B --> C{Looks Good?}\n    C -->|Yes| D[Ship It!]\n    C -->|No| E[Refactor]";
    render();
}

async function deleteFromDB(id, e) {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this diagram?')) {
        try {
            await fetch('/api/delete?id='+id);
            loadHistory();
        } catch(e) {}
    }
}

function downloadImage(format) {
    const svgElement = document.querySelector('#graph svg');
    if (!svgElement) return alert('No diagram to download');
    
    if (!svgElement.getAttribute('xmlns')) {
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const title = document.getElementById('title').value || 'mermaid-diagram';
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;

    if (format === 'svg') {
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        triggerDownload(URL.createObjectURL(blob), filename);
        return;
    }

    // Convert to canvas for PNG/JPEG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Create blob URL for the SVG to load into the image
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function() {
        // High-res export
        const scale = 2; // Increase for better resolution
        canvas.width = svgElement.getBoundingClientRect().width * scale;
        canvas.height = svgElement.getBoundingClientRect().height * scale;
        
        ctx.scale(scale, scale);
        
        // Add white background for JPEG, since JPEG does not support transparency
        if (format === 'jpeg') {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        URL.revokeObjectURL(url);
        
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const imgUrl = canvas.toDataURL(mimeType, 1.0);
        triggerDownload(imgUrl, filename);
    };
    
    img.src = url;
}

function triggerDownload(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

render();
loadHistory();
