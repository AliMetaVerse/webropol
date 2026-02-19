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
    quantity: settings.quantity || '',
    showLabels: settings.showLabels !== false,
    orientationDesktop: settings.orientationDesktop || 'vertical',
    orientationMobile: settings.orientationMobile || 'horizontal',
    showDescription: settings.showDescription !== false,
    descPlacement: settings.descPlacement || 'below'
  };
}

function normalizeTexts(texts = {}) {
  return {
    title: texts.title || 'On a scale from 0 to 100, how would you rate your overall health today?',
    instructions: texts.instructions || `<ul>
<li>We would like to know how good or bad your health is TODAY.</li>
<li>You will see a scale numbered from 0 to 100.</li>
<li>100 means the best health you can imagine.</li>
<li>0 means the worst health you can imagine.</li>
<li>Please indicate on the scale how your health is TODAY.</li>
</ul>`,
    boxLabel1: texts.boxLabel1 || 'YOUR',
    boxLabel2: texts.boxLabel2 || 'HEALTH',
    boxLabel3: texts.boxLabel3 || 'TODAY',
    bestLabel1: texts.bestLabel1 || 'Best health',
    bestLabel2: texts.bestLabel2 || 'you can',
    bestLabel3: texts.bestLabel3 || 'imagine',
    worstLabel1: texts.worstLabel1 || 'Worst health',
    worstLabel2: texts.worstLabel2 || 'you can',
    worstLabel3: texts.worstLabel3 || 'imagine'
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
      settings: normalizeSettings(),
      texts: normalizeTexts()
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
        question.texts = normalizeTexts(sliderData.texts || {});
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
  target.texts = { ...(target.texts || {}), ...(incoming.texts || {}) };
  return target;
}
