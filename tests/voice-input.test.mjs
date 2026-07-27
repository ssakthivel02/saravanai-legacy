import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeTranscript,
  normaliseTranscript,
  shouldRestartRecognition,
  speechRecognitionConstructor,
  voiceErrorMessage
} from '../assets/voice-input.js';

test('normaliseTranscript collapses whitespace and preserves Unicode text', () => {
  assert.equal(normaliseTranscript('  hello   world  '), 'hello world');
  assert.equal(normaliseTranscript('  முருகன்   அருள்  '), 'முருகன் அருள்');
});

test('mergeTranscript appends spoken text without destroying existing prompt content', () => {
  assert.equal(mergeTranscript('Existing prompt', 'new speech'), 'Existing prompt new speech');
  assert.equal(mergeTranscript('', 'new speech'), 'new speech');
  assert.equal(mergeTranscript('Existing prompt', '   '), 'Existing prompt');
});

test('speechRecognitionConstructor supports standard and prefixed browser implementations', () => {
  function Standard() {}
  function Prefixed() {}
  assert.equal(speechRecognitionConstructor({ SpeechRecognition: Standard }), Standard);
  assert.equal(speechRecognitionConstructor({ webkitSpeechRecognition: Prefixed }), Prefixed);
  assert.equal(speechRecognitionConstructor({}), null);
});

test('voice errors are converted into clear user-facing messages', () => {
  assert.match(voiceErrorMessage('not-allowed'), /permission/i);
  assert.match(voiceErrorMessage('network'), /could not be reached/i);
  assert.match(voiceErrorMessage('unknown'), /could not be completed/i);
});

test('continuous recognition restarts only while the user still requests listening', () => {
  assert.equal(shouldRestartRecognition({ requestedListening: true }), true);
  assert.equal(shouldRestartRecognition({ requestedListening: false }), false);
  assert.equal(shouldRestartRecognition({ requestedListening: true, documentHidden: true }), false);
  assert.equal(shouldRestartRecognition({ requestedListening: true, lastError: 'not-allowed' }), false);
  assert.equal(shouldRestartRecognition({ requestedListening: true, lastError: 'no-speech' }), true);
});
