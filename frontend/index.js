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
    component.textContent = componentType;
    component.draggable = true;

    component.addEventListener('dragstart', (e) => {
        const rect = component.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: componentType, offsetX, offsetY }));
    });

    component.addEventListener('click', () => showProperties(component));
    canvas.appendChild(component);

    // Make the component draggable within the canvas
    component.addEventListener('dragstart', (e) => {
        const style = window.getComputedStyle(e.target, null);
        e.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"),10) - e.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - e.clientY));
    });
}

canvas.addEventListener('dragover', function(e) { 
    e.preventDefault(); 
    return false; 
});

canvas.addEventListener('drop', function(e) {
    var offset = e.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('dragme');
    dm.style.left = (e.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (e.clientY + parseInt(offset[1],10)) + 'px';
    e.preventDefault();
    return false;
});

function showProperties(element) {
    const propertiesPanel = document.getElementById('properties-panel');
    propertiesPanel.innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="text-sm font-medium text-slate-700">Width</label>
                <input type="text" class="mt-1 w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${element.style.width || 'auto'}">
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Height</label>
                <input type="text" class="mt-1 w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${element.style.height || 'auto'}">
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Padding</label>
                <div class="grid grid-cols-4 gap-2 mt-1">
                    ${['Top', 'Right', 'Bottom', 'Left'].map(side => `
                        <input type="text" placeholder="${side[0]}" class="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
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
