const PAID_PROVIDERS = new Set(['openai', 'anthropic', 'gemini', 'kimi']);

function disablePaidControls() {
  const providerSelect = document.getElementById('providerSelect');
  if (providerSelect) {
    for (const option of providerSelect.options) {
      if (!PAID_PROVIDERS.has(option.value)) continue;
      option.disabled = true;
      const label = option.textContent.replace(/\s*·.*$/, '');
      option.textContent = `${label} · disabled (paid)`;
    }
    if (PAID_PROVIDERS.has(providerSelect.value)) providerSelect.value = 'auto';
  }

  const budgetSelect = document.getElementById('budgetSelect');
  if (budgetSelect) {
    const premium = [...budgetSelect.options].find((option) => option.value === 'premium');
    if (premium) {
      premium.disabled = true;
      premium.textContent = 'Premium · disabled in zero-cost mode';
    }
    if (budgetSelect.value === 'premium') budgetSelect.value = 'economy';
  }

  for (const chip of document.querySelectorAll('[data-provider]')) {
    if (!PAID_PROVIDERS.has(chip.dataset.provider)) continue;
    chip.classList.remove('live', 'pending');
    chip.classList.add('unavailable');
    chip.title = 'Disabled by SakthiAI zero-cost policy';
  }

  const buildLabel = document.querySelector('.sidebar-section .eyebrow');
  if (buildLabel) buildLabel.textContent = 'Owner build 011';

  const footerVersion = document.querySelector('.footer span:last-child');
  if (footerVersion) footerVersion.textContent = 'Zero-cost owner platform · v0.11.0';

  const governanceScore = document.querySelector('.governance-score .score-ring');
  if (governanceScore) governanceScore.textContent = '11';
}

async function verifyServerCostSafety() {
  try {
    const response = await fetch('/api/v1/platform/cost-safety', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Cost safety status ${response.status}`);
    const data = await response.json();
    const unsafe = data.zeroCostMode !== true || data.paidProviderCallsAllowed !== false;
    if (unsafe) throw new Error('The server did not confirm zero-cost enforcement.');

    const status = await fetch('/api/v1/status', { cache: 'no-store' }).then((result) => result.json());
    const paidSelectable = (status.providers || []).filter((provider) => PAID_PROVIDERS.has(provider.id) && provider.selectable);
    if (paidSelectable.length) throw new Error(`Paid provider selectable: ${paidSelectable.map((provider) => provider.id).join(', ')}`);
  } catch (error) {
    console.error('SakthiAI zero-cost safety verification failed', error);
    const runButton = document.getElementById('runButton');
    if (runButton) runButton.disabled = true;
    const platformStatus = document.getElementById('platformStatus');
    if (platformStatus) {
      platformStatus.classList.remove('online');
      platformStatus.classList.add('offline');
      platformStatus.innerHTML = '<span class="status-dot"></span> Cost safety check failed';
    }
    const runtimeState = document.getElementById('runtimeState');
    if (runtimeState) runtimeState.textContent = 'Blocked for safety';
  }
}

disablePaidControls();
addEventListener('DOMContentLoaded', disablePaidControls, { once: true });
addEventListener('load', verifyServerCostSafety, { once: true });
