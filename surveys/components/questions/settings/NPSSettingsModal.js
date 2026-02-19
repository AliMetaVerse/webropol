export function openNPSSettingsModal() {
    if (typeof window.openQuestionSettingsModal === 'function') {
        window.openQuestionSettingsModal('nps');
    }
}

window.openNPSSettingsModal = openNPSSettingsModal;
