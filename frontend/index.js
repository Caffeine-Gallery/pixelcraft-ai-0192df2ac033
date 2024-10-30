import { backend } from 'declarations/backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

let stripePromise;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initComponents();
    initDeviceButtons();
    initAIPanel();
    initDragAndDrop();
});

function initComponents() {
    const components = ['Header', 'Text', 'Image', 'Button', 'Form', 'Gallery', 'Video', 'Social', 'Menu', 'Footer', 'Stripe Payment'];
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
        case 'Button': return 'mouse-pointer-click';
        case 'Form': return 'form-input';
        case 'Gallery': return 'image-plus';
        case 'Video': return 'video';
        case 'Social': return 'share-2';
        case 'Menu': return 'menu';
        case 'Header': return 'heading-1';
        case 'Footer': return 'footprints';
        case 'Stripe Payment': return 'credit-card';
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
    const canvasPlaceholder = document.getElementById('canvas-placeholder');

    componentsGrid.addEventListener('dragstart', (e) => {
        if (e.target.dataset.component) {
            e.dataTransfer.setData('text/plain', e.target.dataset.component);
            e.dataTransfer.effectAllowed = 'copy';
        }
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', () => {
        canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('drag-over');
        const componentType = e.dataTransfer.getData('text');
        if (componentType) {
            const canvasRect = canvas.getBoundingClientRect();
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            addComponentToCanvas(componentType, x, y);
            canvasPlaceholder.style.display = 'none';
        }
    });
}

function addComponentToCanvas(componentType, x, y) {
    const canvas = document.getElementById('canvas');
    const component = document.createElement('div');
    component.className = 'absolute bg-white border border-slate-200 p-4 rounded-lg shadow-sm cursor-move component';
    component.style.left = `${x}px`;
    component.style.top = `${y}px`;
    component.style.minWidth = '200px';
    component.style.minHeight = '100px';
    component.dataset.componentType = componentType;
    
    switch (componentType) {
        case 'Header':
            component.innerHTML = `
                <h1 contenteditable="true" class="text-2xl font-bold">Header</h1>
                <nav>
                    <ul class="flex space-x-4">
                        <li><a href="#" class="text-blue-600" contenteditable="true">Home</a></li>
                        <li><a href="#" class="text-blue-600" contenteditable="true">About</a></li>
                        <li><a href="#" class="text-blue-600" contenteditable="true">Contact</a></li>
                    </ul>
                </nav>
            `;
            break;
        case 'Text':
            component.innerHTML = `<p contenteditable="true" class="text-base">Edit this text</p>`;
            break;
        case 'Image':
            component.innerHTML = `
                <img src="https://via.placeholder.com/300x200" alt="Placeholder" class="max-w-full h-auto">
                <input type="file" accept="image/*" class="mt-2">
            `;
            break;
        case 'Button':
            component.innerHTML = `
                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                    <span contenteditable="true">Click me</span>
                </button>
            `;
            component.dataset.url = '#';
            break;
        case 'Form':
            component.innerHTML = `
                <form>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="name">Name</label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="email">Email</label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email">
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Submit
                        </button>
                    </div>
                </form>
            `;
            break;
        case 'Gallery':
            component.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <img src="https://via.placeholder.com/150" alt="Placeholder" class="w-full h-auto">
                    <img src="https://via.placeholder.com/150" alt="Placeholder" class="w-full h-auto">
                    <img src="https://via.placeholder.com/150" alt="Placeholder" class="w-full h-auto">
                    <img src="https://via.placeholder.com/150" alt="Placeholder" class="w-full h-auto">
                </div>
            `;
            break;
        case 'Video':
            component.innerHTML = `
                <video width="320" height="240" controls>
                    <source src="movie.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            break;
        case 'Social':
            component.innerHTML = `
                <div class="flex space-x-4" id="social-icons">
                    <a href="#" class="text-blue-600" data-platform="facebook"><i data-lucide="facebook"></i></a>
                    <a href="#" class="text-blue-400" data-platform="twitter"><i data-lucide="twitter"></i></a>
                    <a href="#" class="text-pink-600" data-platform="instagram"><i data-lucide="instagram"></i></a>
                    <a href="#" class="text-red-600" data-platform="youtube"><i data-lucide="youtube"></i></a>
                </div>
                <button class="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm" id="add-social">Add Social</button>
            `;
            break;
        case 'Menu':
            component.innerHTML = `
                <nav>
                    <ul class="space-y-2" id="menu-items">
                        <li><a href="#" class="text-blue-600" contenteditable="true">Home</a></li>
                        <li><a href="#" class="text-blue-600" contenteditable="true">Products</a></li>
                        <li><a href="#" class="text-blue-600" contenteditable="true">About Us</a></li>
                        <li><a href="#" class="text-blue-600" contenteditable="true">Contact</a></li>
                    </ul>
                </nav>
                <button class="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm" id="add-menu-item">Add Menu Item</button>
            `;
            break;
        case 'Footer':
            component.innerHTML = `
                <footer class="text-center">
                    <p contenteditable="true">&copy; 2023 Your Company. All rights reserved.</p>
                    <nav class="mt-4">
                        <a href="#" class="text-blue-600 mx-2" contenteditable="true">Privacy Policy</a>
                        <a href="#" class="text-blue-600 mx-2" contenteditable="true">Terms of Service</a>
                        <a href="#" class="text-blue-600 mx-2" contenteditable="true">Contact Us</a>
                    </nav>
                </footer>
            `;
            break;
        case 'Stripe Payment':
            component.innerHTML = `
                <div class="text-center">
                    <h3 class="text-lg font-semibold mb-2">Stripe Payment</h3>
                    <form id="payment-form" class="mt-4">
                        <div id="payment-element" class="mb-4">
                            <!-- Stripe Elements Placeholder -->
                        </div>
                        <button id="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                            <div class="spinner hidden" id="spinner"></div>
                            <span id="button-text">Pay now</span>
                        </button>
                        <div id="payment-message" class="hidden"></div>
                    </form>
                </div>
            `;
            initializeStripe(component);
            break;
        default:
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

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        canvas.removeChild(component);
    });
    component.appendChild(deleteBtn);

    canvas.appendChild(component);
    lucide.createIcons();

    if (componentType === 'Social') {
        initSocialComponent(component);
    } else if (componentType === 'Menu') {
        initMenuComponent(component);
    }
}

function initSocialComponent(component) {
    const addSocialBtn = component.querySelector('#add-social');
    const socialIcons = component.querySelector('#social-icons');

    addSocialBtn.addEventListener('click', () => {
        const platform = prompt('Enter social media platform (e.g., linkedin, github):');
        if (platform) {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'text-gray-600';
            link.dataset.platform = platform;
            link.innerHTML = `<i data-lucide="${platform}"></i>`;
            socialIcons.appendChild(link);
            lucide.createIcons();
        }
    });

    socialIcons.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            e.preventDefault();
            const link = e.target.closest('a');
            const newUrl = prompt('Enter the URL for this social media profile:', link.href);
            if (newUrl) {
                link.href = newUrl;
            }
        }
    });
}

function initMenuComponent(component) {
    const addMenuItemBtn = component.querySelector('#add-menu-item');
    const menuItems = component.querySelector('#menu-items');

    addMenuItemBtn.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = '<a href="#" class="text-blue-600" contenteditable="true">New Item</a>';
        menuItems.appendChild(li);
    });

    menuItems.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const newUrl = prompt('Enter the URL for this menu item:', e.target.href);
            if (newUrl) {
                e.target.href = newUrl;
            }
        }
    });
}

async function initializeStripe(component) {
    if (!stripePromise) {
        const publishableKey = await backend.getStripePublishableKey();
        stripePromise = loadStripe(publishableKey);
    }

    const stripe = await stripePromise;
    const elements = stripe.elements();

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    const form = component.querySelector("#payment-form");
    form.addEventListener("submit", handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const stripe = await stripePromise;
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `${window.location.origin}/completion`,
        },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occurred.");
    }

    setLoading(false);
}

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

function setLoading(isLoading) {
    if (isLoading) {
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}

let isDragging = false;
let isResizing = false;
let selectedComponent = null;
let startX, startY, startLeft, startTop, startWidth, startHeight;

function startDragging(e) {
    isDragging = true;
    selectedComponent = e.target.closest('.component');
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(selectedComponent.style.left, 10);
    startTop = parseInt(selectedComponent.style.top, 10);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
}

function drag(e) {
    if (isDragging && selectedComponent) {
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        let newX = startLeft + e.clientX - startX;
        let newY = startTop + e.clientY - startY;

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
    selectedComponent = e.target.closest('.component');
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(selectedComponent).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(selectedComponent).height, 10);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
}

function resize(e) {
    if (isResizing && selectedComponent) {
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        const width = Math.min(startWidth + e.clientX - startX, canvasRect.width - selectedComponent.offsetLeft);
        const height = Math.min(startHeight + e.clientY - startY, canvasRect.height - selectedComponent.offsetTop);
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
    const componentType = element.dataset.componentType;

    let propertiesHTML = `
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
    `;

    if (componentType === 'Button') {
        propertiesHTML += `
            <div>
                <label class="text-sm font-medium text-slate-700">Button URL</label>
                <input type="text" id="button-url-input" class="mt-1 w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${element.dataset.url || '#'}">
            </div>
        `;
    }

    propertiesHTML += `</div>`;
    propertiesPanel.innerHTML = propertiesHTML;

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

    if (componentType === 'Button') {
        document.getElementById('button-url-input').addEventListener('change', (e) => {
            selectedComponent.dataset.url = e.target.value;
        });
    }
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

// Load Stripe.js
const script = document.createElement('script');
script.src = 'https://js.stripe.com/v3/';
document.head.appendChild(script);
