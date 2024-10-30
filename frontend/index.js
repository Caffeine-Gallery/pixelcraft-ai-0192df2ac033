import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initComponents();
    initDeviceButtons();
    initAIPanel();
    initDragAndDrop();
});

function initComponents() {
    const components = ['Header', 'Text', 'Image', 'Button', 'Form', 'Gallery', 'Video', 'Social', 'Menu', 'Footer'];
    const grid = document.getElementById('components-grid');

    components.forEach(component => {
        const div = document.createElement('div');
        div.className = 'aspect-square bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-move p-4 flex flex-col items-center justify-center gap-2 transition-all';
        div.draggable = true;
        div.dataset.component = component;

        const icon = document.createElement('div');
        icon.className = 'w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600';
        icon.innerHTML = `<i data-lucide="${getIconForComponent(component)}"></i>`;

        const span = document.createElement('span');
        span.className = 'text-sm text-slate-600';
        span.textContent = component;

        div.appendChild(icon);
        div.appendChild(span);
        grid.appendChild(div);
    });

    lucide.createIcons();
}

function getIconForComponent(component) {
    switch (component) {
        case 'Text': return 'type';
        case 'Image': return 'image';
        case 'Layout': return 'layout';
        case 'Grid': return 'grid';
        default: return 'box';
    }
}

function initDeviceButtons() {
    const buttons = ['desktop', 'tablet', 'mobile'];
    buttons.forEach(device => {
        document.getElementById(`${device}-btn`).addEventListener('click', () => {
            setActiveDevice(device);
        });
    });
}

function setActiveDevice(device) {
    const canvas = document.getElementById('canvas');
    canvas.className = canvas.className.replace(/max-w-\w+/, '');
    canvas.classList.add(device === 'mobile' ? 'max-w-sm' : device === 'tablet' ? 'max-w-2xl' : 'max-w-6xl');

    ['desktop', 'tablet', 'mobile'].forEach(d => {
        const btn = document.getElementById(`${d}-btn`);
        btn.className = btn.className.replace(/bg-white shadow text-blue-600/, '');
        if (d === device) {
            btn.classList.add('bg-white', 'shadow', 'text-blue-600');
        } else {
            btn.classList.add('text-slate-600');
        }
    });
}

function initAIPanel() {
    const aiPanelBtn = document.getElementById('ai-panel-btn');
    const aiPanel = document.getElementById('ai-panel');
    const closeAiPanelBtn = document.getElementById('close-ai-panel-btn');

    aiPanelBtn.addEventListener('click', () => {
        aiPanel.classList.toggle('hidden');
    });

    closeAiPanelBtn.addEventListener('click', () => {
        aiPanel.classList.add('hidden');
    });
}

function initDragAndDrop() {
    const componentsGrid = document.getElementById('components-grid');
    const canvas = document.getElementById('canvas');

    componentsGrid.addEventListener('dragstart', (e) => {
        if (e.target.dataset.component) {
            e.dataTransfer.setData('text/plain', e.target.dataset.component);
            e.dataTransfer.effectAllowed = 'copy';
        }
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text');
        if (componentType) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            addComponentToCanvas(componentType, x, y);
        }
    });
}

function addComponentToCanvas(componentType, x, y) {
    const canvas = document.getElementById('canvas');
    const component = document.createElement('div');
    component.className = 'absolute bg-white border border-slate-200 p-4 rounded-lg shadow-sm cursor-move';
    component.style.left = `${x}px`;
    component.style.top = `${y}px`;
    component.style.minWidth = '100px';
    component.style.minHeight = '50px';
    
    if (componentType === 'Text') {
        const textElement = document.createElement('div');
        textElement.contentEditable = true;
        textElement.textContent = 'Edit this text';
        textElement.className = 'outline-none';
        component.appendChild(textElement);
    } else {
        component.textContent = componentType;
    }

    component.addEventListener('mousedown', startDragging);
    component.addEventListener('click', (e) => {
        e.stopPropagation();
        selectComponent(component);
    });

    const resizer = document.createElement('div');
    resizer.className = 'absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize';
    resizer.addEventListener('mousedown', startResizing);
    component.appendChild(resizer);

    canvas.appendChild(component);
}

let isDragging = false;
let isResizing = false;
let selectedComponent = null;
let startX, startY, startWidth, startHeight;

function startDragging(e) {
    if (e.target === selectedComponent) {
        isDragging = true;
        startX = e.clientX - selectedComponent.offsetLeft;
        startY = e.clientY - selectedComponent.offsetTop;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }
}

function drag(e) {
    if (isDragging && selectedComponent) {
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        let newX = e.clientX - startX - canvasRect.left;
        let newY = e.clientY - startY - canvasRect.top;

        // Constrain to canvas boundaries
        newX = Math.max(0, Math.min(newX, canvasRect.width - selectedComponent.offsetWidth));
        newY = Math.max(0, Math.min(newY, canvasRect.height - selectedComponent.offsetHeight));

        selectedComponent.style.left = `${newX}px`;
        selectedComponent.style.top = `${newY}px`;
    }
}

function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
}

function startResizing(e) {
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(selectedComponent).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(selectedComponent).height, 10);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
}

function resize(e) {
    if (isResizing && selectedComponent) {
        const width = startWidth + e.clientX - startX;
        const height = startHeight + e.clientY - startY;
        selectedComponent.style.width = `${width}px`;
        selectedComponent.style.height = `${height}px`;
    }
}

function stopResizing() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
}

function selectComponent(component) {
    if (selectedComponent) {
        selectedComponent.classList.remove('border-blue-500');
        selectedComponent.classList.add('border-slate-200');
    }
    selectedComponent = component;
    component.classList.remove('border-slate-200');
    component.classList.add('border-blue-500');
    showProperties(component);
}

function showProperties(element) {
    const propertiesPanel = document.getElementById('properties-panel');
    propertiesPanel.innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="text-sm font-medium text-slate-700">Width</label>
                <input type="text" id="width-input" class="mt-1 w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${element.style.width || 'auto'}">
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Height</label>
                <input type="text" id="height-input" class="mt-1 w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${element.style.height || 'auto'}">
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Background Color</label>
                <input type="color" id="bg-color-input" class="mt-1 w-full" value="${rgbToHex(element.style.backgroundColor) || '#ffffff'}">
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Text Color</label>
                <input type="color" id="text-color-input" class="mt-1 w-full" value="${rgbToHex(element.style.color) || '#000000'}">
            </div>
        </div>
    `;

    document.getElementById('width-input').addEventListener('change', (e) => {
        selectedComponent.style.width = e.target.value;
    });

    document.getElementById('height-input').addEventListener('change', (e) => {
        selectedComponent.style.height = e.target.value;
    });

    document.getElementById('bg-color-input').addEventListener('change', (e) => {
        selectedComponent.style.backgroundColor = e.target.value;
    });

    document.getElementById('text-color-input').addEventListener('change', (e) => {
        selectedComponent.style.color = e.target.value;
    });
}

function rgbToHex(rgb) {
    if (!rgb) return null;
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return null;
    const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}

// Backend interaction functions
async function saveWebsite(design) {
    try {
        await backend.saveWebsite(design);
        console.log('Website saved successfully');
    } catch (error) {
        console.error('Error saving website:', error);
    }
}

async function loadWebsite() {
    try {
        const design = await backend.loadWebsite();
        console.log('Website loaded:', design);
        // TODO: Implement rendering of loaded design
    } catch (error) {
        console.error('Error loading website:', error);
    }
}

async function publishWebsite() {
    try {
        const result = await backend.publishWebsite();
        console.log('Website published:', result);
        // TODO: Show success message to user
    } catch (error) {
        console.error('Error publishing website:', error);
    }
}

async function getAIAssistance(prompt) {
    try {
        const suggestion = await backend.getAIAssistance(prompt);
        console.log('AI suggestion:', suggestion);
        // TODO: Implement rendering of AI suggestion
    } catch (error) {
        console.error('Error getting AI assistance:', error);
    }
}

// Initialize the canvas click event to deselect components
document.getElementById('canvas').addEventListener('click', () => {
    if (selectedComponent) {
        selectedComponent.classList.remove('border-blue-500');
        selectedComponent.classList.add('border-slate-200');
        selectedComponent = null;
        showProperties(null);
    }
});
