export function openAutoSuggestSettingsModal() {
    if (typeof window.openQuestionSettingsModal === 'function') {
        window.openQuestionSettingsModal('autosuggest');
    }
}

window.openAutoSuggestSettingsModal = openAutoSuggestSettingsModal;
