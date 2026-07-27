const DEFAULT_LANGUAGE = 'en-GB';
const LANGUAGES = Object.freeze([
  ['en-GB', 'English (UK)'],
  ['en-IN', 'English (India)'],
  ['ta-IN', 'தமிழ் (India)']
]);

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
    'no-speech': 'No speech was detected. Try again and speak clearly.',
    'language-not-supported': 'The selected language is not supported by this browser.'
  };
  return messages[code] || 'Voice input could not be completed.';
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
  privacy.textContent = 'Voice is transcribed by the browser speech service and is never auto-submitted. Audio may be processed by the browser provider; SakthiAI does not store the recording.';

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
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  let listening = false;
  let startingText = '';
  let finalTranscript = '';

  function renderListeningState(active) {
    listening = active;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('listening', active);
    button.querySelector('span:last-child').textContent = active ? 'Stop listening' : 'Start voice input';
    language.disabled = active;
  }

  button.addEventListener('click', () => {
    if (listening) {
      recognition.stop();
      return;
    }
    startingText = input.value;
    finalTranscript = '';
    recognition.lang = language.value || DEFAULT_LANGUAGE;
    status.textContent = 'Starting microphone…';
    try {
      recognition.start();
    } catch (error) {
      status.textContent = error?.message || 'Voice input could not start.';
    }
  });

  recognition.onstart = () => {
    renderListeningState(true);
    status.textContent = 'Listening… Speak in the selected language.';
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
    status.textContent = interimTranscript ? `Listening: ${normaliseTranscript(interimTranscript)}` : 'Speech captured. You can continue speaking.';
  };

  recognition.onerror = (event) => {
    status.textContent = voiceErrorMessage(event.error);
  };

  recognition.onend = () => {
    renderListeningState(false);
    status.textContent = finalTranscript ? 'Voice text added. Review or edit it before submitting.' : status.textContent || 'Voice input stopped.';
    input.focus({ preventScroll: true });
  };
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initialiseVoiceInput(), { once: true });
  else initialiseVoiceInput();
}

export const __test = { DEFAULT_LANGUAGE, LANGUAGES, ensureVoiceStylesheet, initialiseVoiceInput };
