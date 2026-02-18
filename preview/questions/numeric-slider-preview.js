function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeSettings(settings = {}) {
  return {
    min: toNumber(settings.min, 0),
    max: toNumber(settings.max, 10),
    step: toNumber(settings.step, 1),
    start: toNumber(settings.start, 0),
    questionType: settings.questionType || 'slider',
    direction: settings.direction || 'min-max',
    showDontKnow: Boolean(settings.showDontKnow),
    dontKnowLabel: settings.dontKnowLabel || "I don't know",
    showValue: settings.showValue !== false,
    quantity: settings.quantity || ''
  };
}

export function extractFromOpener(openerWindow) {
  try {
    const openerDoc = openerWindow && openerWindow.document;
    if (!openerDoc) return null;

    const sliderEl = openerDoc.querySelector('webropol-numeric-slider');
    if (!sliderEl) return null;

    const question = {
      id: sliderEl.getAttribute('question-id') || 'numeric-slider-1',
      text: 'Numeric Slider',
      type: 'numeric-slider',
      required: false,
      options: [],
      settings: normalizeSettings()
    };

    const rootWithXData = sliderEl.querySelector('[x-data]');
    if (rootWithXData && openerWindow.Alpine && typeof openerWindow.Alpine.$data === 'function') {
      const sliderData = openerWindow.Alpine.$data(rootWithXData);
      if (sliderData) {
        question.text = sliderData.texts?.title || question.text;
        question.settings = normalizeSettings({
          ...(sliderData.settings || {}),
          questionType: sliderData.questionType || 'slider'
        });
      }
    }

    return question;
  } catch (error) {
    console.warn('Numeric slider preview extraction failed:', error);
    return null;
  }
}

export function mergeQuestion(target, incoming) {
  if (!target || !incoming) return target;
  target.id = incoming.id;
  target.text = incoming.text;
  target.type = incoming.type;
  target.required = incoming.required;
  target.options = incoming.options || [];
  target.settings = { ...(target.settings || {}), ...(incoming.settings || {}) };
  return target;
}
