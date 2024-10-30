import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Stripe configuration
  const stripeConfigBtn = document.createElement('button');
  stripeConfigBtn.textContent = 'Configure Stripe';
  stripeConfigBtn.classList.add('px-4', 'py-1.5', 'bg-green-600', 'text-white', 'rounded-lg', 'hover:bg-green-700', 'ml-2');
  document.querySelector('.h-12.bg-white').appendChild(stripeConfigBtn);

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

  // Other existing code...
});
