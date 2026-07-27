const DEFAULT_LANGUAGE = 'en-GB';
const LANGUAGES = Object.freeze([
  ['en-GB', 'English (UK)'],
  ['en-IN', 'English (India)'],
  ['ta-IN', 'தமிழ் (India)']
]);
const FATAL_ERRORS = new Set(['not-allowed', 'service-not-allowed', 'audio-capture', 'language-not-supported']);

export function speechRecognitionConstructor(scope = globalThis) {
  return scope?.SpeechRecognition || scope?.webkitSpeechRecognition || null;
}

export function normaliseTranscript(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

export function mergeTranscript(existing = '', spoken = '') {
  const left = String(existing).trimEnd();
  const right = normaliseTranscript(spoken);
  if (!right) return left;
  if (!left) return right;
  return `${left} ${right}`;
}

export function voiceErrorMessage(code = '') {
  const messages = {
    'not-allowed': 'Microphone permission was not granted.',
    'service-not-allowed': 'Speech recognition is blocked by the browser or device policy.',
    'audio-capture': 'No working microphone was found.',
    'network': 'The browser speech service could not be reached.',
    'no-speech': 'No speech was detected. Keep speaking or press Stop listening.',
    'language-not-supported': 'The selected language is not supported by this browser.'
  };
  return messages[code] || 'Voice input could not be completed.';
}

export function shouldRestartRecognition({ requestedListening = false, lastError = '', documentHidden = false } = {}) {
  return requestedListening && !documentHidden && !FATAL_ERRORS.has(lastError);
}

function ensureVoiceStylesheet(documentRef) {
  if (documentRef.querySelector('link[href="/assets/voice-input.css"]')) return;
  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/voice-input.css';
  documentRef.head.append(link);
}

function createLanguageSelect(documentRef) {
  const select = documentRef.createElement('select');
  select.id = 'voiceLanguage';
  select.className = 'voice-language';
  select.setAttribute('aria-label', 'Voice input language');
  for (const [value, label] of LANGUAGES) {
    const option = documentRef.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = value === DEFAULT_LANGUAGE;
    select.append(option);
  }
  return select;
}

function initialiseVoiceInput(documentRef = globalThis.document, scope = globalThis) {
  const input = documentRef?.getElementById('promptInput');
  const composerOptions = documentRef?.querySelector('#taskForm .composer-options');
  if (!input || !composerOptions || documentRef.getElementById('voiceInputPanel')) return;

  ensureVoiceStylesheet(documentRef);
  const SpeechRecognition = speechRecognitionConstructor(scope);
  const panel = documentRef.createElement('div');
  panel.id = 'voiceInputPanel';
  panel.className = 'voice-input-panel';

  const button = documentRef.createElement('button');
  button.id = 'voiceInputButton';
  button.type = 'button';
  button.className = 'button secondary voice-button';
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = '<span aria-hidden="true">🎙</span><span>Start voice input</span>';

  const language = createLanguageSelect(documentRef);
  const status = documentRef.createElement('span');
  status.id = 'voiceInputStatus';
  status.className = 'muted small voice-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const privacy = documentRef.createElement('small');
  privacy.className = 'muted voice-privacy';
  privacy.textContent = 'Press Start once, speak naturally, then press Stop. Voice is transcribed by the browser speech service and is never auto-submitted. Audio may be processed by the browser provider; SakthiAI does not store the recording.';

  const controls = documentRef.createElement('div');
  controls.className = 'voice-input-controls';
  controls.append(button, language, status);
  panel.append(controls, privacy);
  composerOptions.before(panel);

  if (!SpeechRecognition) {
    button.disabled = true;
    language.disabled = true;
    status.textContent = 'Voice input is unavailable in this browser. Device keyboard dictation can still be used.';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  let listening = false;
  let requestedListening = false;
  let startingText = '';
  let finalTranscript = '';
  let lastError = '';
  let restartTimer = null;

  function renderListeningState(active) {
    listening = active;
    button.setAttribute('aria-pressed', String(requestedListening));
    button.classList.toggle('listening', requestedListening);
    button.querySelector('span:last-child').textContent = requestedListening ? 'Stop listening' : 'Start voice input';
    language.disabled = requestedListening;
  }

  function clearRestartTimer() {
    if (restartTimer) clearTimeout(restartTimer);
    restartTimer = null;
  }

  function startRecognition() {
    clearRestartTimer();
    recognition.lang = language.value || DEFAULT_LANGUAGE;
    try {
      recognition.start();
    } catch (error) {
      const message = String(error?.message || '');
      if (/already started|recognition has already started/i.test(message)) return;
      requestedListening = false;
      renderListeningState(false);
      status.textContent = message || 'Voice input could not start.';
    }
  }

  button.addEventListener('click', () => {
    if (requestedListening) {
      requestedListening = false;
      clearRestartTimer();
      renderListeningState(listening);
      status.textContent = 'Stopping voice input…';
      try { recognition.stop(); } catch { renderListeningState(false); }
      return;
    }
    startingText = input.value;
    finalTranscript = '';
    lastError = '';
    requestedListening = true;
    renderListeningState(listening);
    status.textContent = 'Starting microphone…';
    startRecognition();
  });

  recognition.onstart = () => {
    listening = true;
    lastError = '';
    renderListeningState(true);
    status.textContent = 'Listening continuously… Press Stop listening when finished.';
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index]?.[0]?.transcript || '';
      if (event.results[index].isFinal) finalTranscript = mergeTranscript(finalTranscript, transcript);
      else interimTranscript = mergeTranscript(interimTranscript, transcript);
    }
    input.value = mergeTranscript(startingText, mergeTranscript(finalTranscript, interimTranscript));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    status.textContent = interimTranscript ? `Listening: ${normaliseTranscript(interimTranscript)}` : 'Speech captured. Continue speaking or press Stop listening.';
  };

  recognition.onerror = (event) => {
    lastError = event.error || '';
    status.textContent = voiceErrorMessage(lastError);
    if (FATAL_ERRORS.has(lastError)) requestedListening = false;
  };

  recognition.onend = () => {
    listening = false;
    renderListeningState(false);
    const documentHidden = Boolean(documentRef.hidden);
    if (shouldRestartRecognition({ requestedListening, lastError, documentHidden })) {
      status.textContent = lastError === 'no-speech' ? 'No speech detected; microphone is resuming…' : 'Browser paused the microphone; resuming…';
      lastError = '';
      restartTimer = setTimeout(startRecognition, 300);
      return;
    }
    requestedListening = false;
    clearRestartTimer();
    renderListeningState(false);
    status.textContent = finalTranscript ? 'Voice text added. Review or edit it before submitting.' : status.textContent || 'Voice input stopped.';
    input.focus({ preventScroll: true });
  };

  documentRef.addEventListener('visibilitychange', () => {
    if (!documentRef.hidden || !requestedListening) return;
    requestedListening = false;
    clearRestartTimer();
    status.textContent = 'Voice input stopped because the page is no longer visible.';
    try { recognition.stop(); } catch { renderListeningState(false); }
  });
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initialiseVoiceInput(), { once: true });
  else initialiseVoiceInput();
}

export const __test = { DEFAULT_LANGUAGE, LANGUAGES, ensureVoiceStylesheet, initialiseVoiceInput };
