export function openOpenEndedSettingsModal() {
    if (typeof window.openQuestionSettingsModal === 'function') {
        window.openQuestionSettingsModal('openended');
    }
}

window.openOpenEndedSettingsModal = openOpenEndedSettingsModal;
