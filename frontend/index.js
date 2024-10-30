import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Stripe configuration
  const stripeConfigBtn = document.getElementById('stripe-config-btn');
  const stripeConfigModal = document.getElementById('stripe-config-modal');
  const stripeConfigForm = document.getElementById('stripe-config-form');
  const stripeConfigCancel = document.getElementById('stripe-config-cancel');

  stripeConfigBtn.addEventListener('click', () => {
    stripeConfigModal.classList.remove('hidden');
  });

  stripeConfigCancel.addEventListener('click', () => {
    stripeConfigModal.classList.add('hidden');
  });

  stripeConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(stripeConfigForm);
    const publishableKey = formData.get('publishableKey');
    const secretKey = formData.get('secretKey');
    const webhookSecret = formData.get('webhookSecret');

    try {
      await backend.setupStripe(secretKey, publishableKey, webhookSecret);
      alert('Stripe configuration saved successfully!');
      stripeConfigModal.classList.add('hidden');
    } catch (error) {
      console.error('Error saving Stripe configuration:', error);
      alert('Failed to save Stripe configuration. Please try again.');
    }
  });

  // Load existing Stripe configuration
  try {
    const config = await backend.getStripeConfig();
    document.getElementById('stripe-publishable-key').value = config.publishableKey;
  } catch (error) {
    console.error('Error loading Stripe configuration:', error);
  }

  // Website builder functionality
  const componentsGrid = document.getElementById('components-grid');
  const canvas = document.getElementById('canvas');
  const canvasPlaceholder = document.getElementById('canvas-placeholder');
  const propertiesPanel = document.getElementById('properties-panel');
  const aiPanel = document.getElementById('ai-panel');
  const aiPanelBtn = document.getElementById('ai-panel-btn');
  const closeAiPanelBtn = document.getElementById('close-ai-panel-btn');

  // Sample components
  const components = [
    { name: 'Header', icon: 'type' },
    { name: 'Image', icon: 'image' },
    { name: 'Text Block', icon: 'align-left' },
    { name: 'Button', icon: 'mouse-pointer' },
    { name: 'Form', icon: 'box' },
    { name: 'Video', icon: 'video' },
  ];

  // Render components
  components.forEach(component => {
    const componentEl = document.createElement('div');
    componentEl.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-sm', 'flex', 'flex-col', 'items-center', 'justify-center', 'space-y-2', 'cursor-move');
    componentEl.innerHTML = `
      <i data-lucide="${component.icon}" class="w-8 h-8 text-slate-600"></i>
      <span class="text-sm text-slate-600">${component.name}</span>
    `;
    componentEl.draggable = true;
    componentEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', component.name);
    });
    componentsGrid.appendChild(componentEl);
  });

  // Canvas drop functionality
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvas.classList.add('bg-slate-100');
  });

  canvas.addEventListener('dragleave', () => {
    canvas.classList.remove('bg-slate-100');
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('bg-slate-100');
    const componentName = e.dataTransfer.getData('text');
    addComponentToCanvas(componentName, e.clientX, e.clientY);
  });

  function addComponentToCanvas(componentName, x, y) {
    const componentEl = document.createElement('div');
    componentEl.classList.add('absolute', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'cursor-move');
    componentEl.innerHTML = `<h3 class="text-lg font-semibold mb-2">${componentName}</h3>`;
    componentEl.style.left = `${x - canvas.offsetLeft}px`;
    componentEl.style.top = `${y - canvas.offsetTop}px`;
    
    componentEl.addEventListener('click', () => {
      showComponentProperties(componentName, componentEl);
    });

    canvas.appendChild(componentEl);
    canvasPlaceholder.style.display = 'none';
    
    // Make the component draggable within the canvas
    componentEl.draggable = true;
    componentEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', 'move');
      e.dataTransfer.setData('application/json', JSON.stringify({
        offsetX: e.clientX - componentEl.offsetLeft,
        offsetY: e.clientY - componentEl.offsetTop
      }));
    });
  }

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('bg-slate-100');
    const data = e.dataTransfer.getData('text');
    if (data === 'move') {
      const component = e.target.closest('.absolute');
      if (component) {
        const { offsetX, offsetY } = JSON.parse(e.dataTransfer.getData('application/json'));
        component.style.left = `${e.clientX - canvas.offsetLeft - offsetX}px`;
        component.style.top = `${e.clientY - canvas.offsetTop - offsetY}px`;
      }
    } else {
      addComponentToCanvas(data, e.clientX, e.clientY);
    }
  });

  function showComponentProperties(componentName, componentEl) {
    propertiesPanel.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">${componentName} Properties</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Width</label>
          <input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-md" value="${componentEl.style.width || 'auto'}">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Height</label>
          <input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-md" value="${componentEl.style.height || 'auto'}">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
          <input type="color" class="w-full h-10 border border-slate-300 rounded-md" value="#ffffff">
        </div>
      </div>
    `;
  }

  // AI Panel functionality
  aiPanelBtn.addEventListener('click', () => {
    aiPanel.classList.toggle('hidden');
  });

  closeAiPanelBtn.addEventListener('click', () => {
    aiPanel.classList.add('hidden');
  });

  // Responsive preview buttons
  const desktopBtn = document.getElementById('desktop-btn');
  const tabletBtn = document.getElementById('tablet-btn');
  const mobileBtn = document.getElementById('mobile-btn');

  desktopBtn.addEventListener('click', () => setPreviewMode('desktop'));
  tabletBtn.addEventListener('click', () => setPreviewMode('tablet'));
  mobileBtn.addEventListener('click', () => setPreviewMode('mobile'));

  function setPreviewMode(mode) {
    canvas.classList.remove('max-w-6xl', 'max-w-md', 'max-w-sm');
    switch (mode) {
      case 'desktop':
        canvas.classList.add('max-w-6xl');
        break;
      case 'tablet':
        canvas.classList.add('max-w-md');
        break;
      case 'mobile':
        canvas.classList.add('max-w-sm');
        break;
    }
  }

  // Initialize with desktop mode
  setPreviewMode('desktop');

  // Reinitialize Lucide icons after dynamic content is added
  lucide.createIcons();
});
