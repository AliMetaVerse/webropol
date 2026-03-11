const vscode = require('vscode');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const STORAGE_FILE_NAME = 'planner-state.json';
const VIEW_TYPES = {
  dashboard: 'plannerDashboardView'
};

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatLongDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createEmptyPlan(date = todayIso()) {
  return {
    date,
    mode: 'planning',
    currentTaskId: null,
    topPriorities: [
      { id: createId('task'), title: 'Implement API caching', completed: false, skipped: false, estimateMinutes: 90, timeBlockId: '' },
      { id: createId('task'), title: 'Fix onboarding bug', completed: false, skipped: false, estimateMinutes: 60, timeBlockId: '' },
      { id: createId('task'), title: 'Write documentation', completed: false, skipped: false, estimateMinutes: 45, timeBlockId: '' }
    ],
    plannedTasks: [
      { id: createId('task'), title: 'Review PR #142', completed: false, skipped: false, estimateMinutes: 30, timeBlockId: '' },
      { id: createId('task'), title: 'Update analytics tracking', completed: false, skipped: false, estimateMinutes: 45, timeBlockId: '' },
      { id: createId('task'), title: 'Design survey UI', completed: false, skipped: false, estimateMinutes: 90, timeBlockId: '' }
    ],
    timeBlocks: [
      { id: createId('block'), start: '09:00', end: '10:30', label: 'Deep Work' },
      { id: createId('block'), start: '11:00', end: '11:30', label: 'Code Review' },
      { id: createId('block'), start: '14:00', end: '15:30', label: 'Feature Development' }
    ]
  };
}

function createAssistantState() {
  return {
    selectedModelId: '',
    messages: [],
    isLoading: false,
    lastError: ''
  };
}

function normalizeTask(task = {}) {
  return {
    id: task.id || createId('task'),
    title: typeof task.title === 'string' ? task.title : '',
    completed: Boolean(task.completed),
    skipped: Boolean(task.skipped),
    estimateMinutes: Number.isFinite(task.estimateMinutes) ? task.estimateMinutes : '',
    timeBlockId: typeof task.timeBlockId === 'string' ? task.timeBlockId : ''
  };
}

function normalizeBlock(block = {}) {
  return {
    id: block.id || createId('block'),
    start: typeof block.start === 'string' ? block.start : '',
    end: typeof block.end === 'string' ? block.end : '',
    label: typeof block.label === 'string' ? block.label : ''
  };
}

function normalizeAssistantMessage(message = {}) {
  return {
    id: message.id || createId('chat'),
    role: message.role === 'user' ? 'user' : 'assistant',
    content: typeof message.content === 'string' ? message.content : '',
    modelId: typeof message.modelId === 'string' ? message.modelId : '',
    createdAt: typeof message.createdAt === 'string' ? message.createdAt : new Date().toISOString()
  };
}

function normalizeAssistantState(assistant = {}) {
  return {
    selectedModelId: typeof assistant.selectedModelId === 'string' ? assistant.selectedModelId : '',
    messages: Array.isArray(assistant.messages) ? assistant.messages.map(normalizeAssistantMessage) : [],
    isLoading: Boolean(assistant.isLoading),
    lastError: typeof assistant.lastError === 'string' ? assistant.lastError : ''
  };
}

function normalizePlan(plan = {}) {
  const normalized = {
    date: typeof plan.date === 'string' ? plan.date : todayIso(),
    mode: ['planning', 'executing', 'paused'].includes(plan.mode) ? plan.mode : 'planning',
    currentTaskId: typeof plan.currentTaskId === 'string' ? plan.currentTaskId : null,
    topPriorities: Array.isArray(plan.topPriorities) ? plan.topPriorities.map(normalizeTask) : [],
    plannedTasks: Array.isArray(plan.plannedTasks) ? plan.plannedTasks.map(normalizeTask) : [],
    timeBlocks: Array.isArray(plan.timeBlocks) ? plan.timeBlocks.map(normalizeBlock) : []
  };

  syncCurrentTask(normalized);
  return normalized;
}

function normalizeState(raw = {}) {
  const safeRaw = raw && typeof raw === 'object' ? raw : {};
  const activePlan = normalizePlan(safeRaw.activePlan || createEmptyPlan());
  const history = Array.isArray(safeRaw.history)
    ? safeRaw.history.map((entry) => ({
        date: typeof entry.date === 'string' ? entry.date : todayIso(),
        endedAt: typeof entry.endedAt === 'string' ? entry.endedAt : new Date().toISOString(),
        mode: ['planning', 'executing', 'paused'].includes(entry.mode) ? entry.mode : 'planning',
        summary: typeof entry.summary === 'string' ? entry.summary : '',
        progressPercent: Number.isFinite(entry.progressPercent) ? entry.progressPercent : 0,
        tasks: Array.isArray(entry.tasks) ? entry.tasks.map(normalizeTask) : [],
        timeBlocks: Array.isArray(entry.timeBlocks) ? entry.timeBlocks.map(normalizeBlock) : []
      }))
    : [];

  const assistant = normalizeAssistantState(safeRaw.assistant || createAssistantState());

  return { version: 1, activePlan, history, assistant };
}

function serializeModelInfo(model) {
  return {
    id: model.id,
    name: model.name,
    vendor: model.vendor,
    family: model.family,
    version: model.version,
    maxInputTokens: model.maxInputTokens
  };
}

async function listAvailableModels() {
  if (!vscode.lm || typeof vscode.lm.selectChatModels !== 'function') {
    return [];
  }

  const models = await vscode.lm.selectChatModels();
  return models
    .map(serializeModelInfo)
    .sort((left, right) => `${left.vendor}/${left.family}/${left.name}`.localeCompare(`${right.vendor}/${right.family}/${right.name}`));
}

async function resolveSelectedModel(selectedModelId) {
  if (!vscode.lm || typeof vscode.lm.selectChatModels !== 'function') {
    return undefined;
  }

  if (selectedModelId) {
    const exactMatches = await vscode.lm.selectChatModels({ id: selectedModelId });
    if (exactMatches.length > 0) {
      return exactMatches[0];
    }
  }

  const models = await vscode.lm.selectChatModels();
  return models[0];
}

function summarizePlanContext(plan) {
  const topPriorities = plan.topPriorities
    .filter((task) => task.title.trim())
    .map((task) => `- ${task.title}`)
    .join('\n');
  const plannedTasks = plan.plannedTasks
    .filter((task) => task.title.trim())
    .map((task) => `- ${task.title}`)
    .join('\n');
  const currentTask = getCurrentTask(plan);

  return [
    'You are helping the user inside Gravity Planner in VS Code.',
    `Date: ${plan.date}`,
    currentTask ? `Current task: ${currentTask.title}` : 'Current task: none selected',
    topPriorities ? `Top priorities:\n${topPriorities}` : 'Top priorities: none',
    plannedTasks ? `Planned tasks:\n${plannedTasks}` : 'Planned tasks: none',
    'Keep answers concise, practical, and focused on planning or development work unless the user asks otherwise.'
  ].join('\n\n');
}

function buildLanguageModelMessages(plan, assistantMessages) {
  const messages = [vscode.LanguageModelChatMessage.User(summarizePlanContext(plan))];
  const history = assistantMessages.filter((message) => message.content.trim()).slice(-12);

  for (const message of history) {
    if (message.role === 'assistant') {
      messages.push(vscode.LanguageModelChatMessage.Assistant(message.content));
      continue;
    }

    messages.push(vscode.LanguageModelChatMessage.User(message.content));
  }

  return messages;
}

function formatLanguageModelError(error) {
  if (typeof vscode.LanguageModelError === 'function' && error instanceof vscode.LanguageModelError) {
    return error.message || 'The selected VS Code model could not complete the request.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'The selected VS Code model could not complete the request.';
}

function getAllTasks(plan) {
  return [...plan.topPriorities, ...plan.plannedTasks];
}

function getCurrentTask(plan) {
  return getAllTasks(plan).find((task) => task.id === plan.currentTaskId) || null;
}

function getPendingTasks(plan) {
  return getAllTasks(plan).filter((task) => !task.completed && !task.skipped && task.title.trim());
}

function syncCurrentTask(plan) {
  const currentTask = getCurrentTask(plan);
  if (currentTask && !currentTask.completed && !currentTask.skipped && currentTask.title.trim()) {
    return;
  }

  const nextPending = getPendingTasks(plan)[0] || null;
  plan.currentTaskId = nextPending ? nextPending.id : null;
}

function getProgress(plan) {
  const tasks = getAllTasks(plan).filter((task) => task.title.trim());
  if (!tasks.length) {
    return { completed: 0, total: 0, percent: 0 };
  }

  const completed = tasks.filter((task) => task.completed).length;
  return {
    completed,
    total: tasks.length,
    percent: Math.round((completed / tasks.length) * 100)
  };
}

function createArchiveEntry(plan) {
  const progress = getProgress(plan);
  return {
    date: plan.date,
    endedAt: new Date().toISOString(),
    mode: plan.mode,
    summary: `${progress.completed}/${progress.total} tasks completed`,
    progressPercent: progress.percent,
    tasks: clone(getAllTasks(plan)),
    timeBlocks: clone(plan.timeBlocks)
  };
}

class PlannerStore {
  constructor(context) {
    this.context = context;
    this.state = normalizeState();
  }

  async init() {
    this.state = normalizeState(await this.readStateFile());
    this.ensureTodayPlan();
    await this.writeStateFile();
    return this.state;
  }

  ensureTodayPlan() {
    const today = todayIso();
    if (this.state.activePlan.date !== today) {
      const previousPlan = this.state.activePlan;
      const hasWork = getAllTasks(previousPlan).some((task) => task.title.trim());
      if (hasWork) {
        this.state.history.unshift(createArchiveEntry(previousPlan));
      }
      this.state.activePlan = createEmptyPlan(today);
    }
    syncCurrentTask(this.state.activePlan);
  }

  getState() {
    this.ensureTodayPlan();
    return normalizeState(this.state);
  }

  async update(mutator) {
    const draft = this.getState();
    mutator(draft);
    this.state = normalizeState(draft);
    this.ensureTodayPlan();
    await this.writeStateFile();
    return this.getState();
  }

  async resetToday() {
    this.state.activePlan = createEmptyPlan(todayIso());
    await this.writeStateFile();
    return this.getState();
  }

  async readStateFile() {
    if (!this.context.storageUri) {
      return null;
    }

    const filePath = path.join(this.context.storageUri.fsPath, STORAGE_FILE_NAME);

    try {
      const contents = await fs.readFile(filePath, 'utf8');
      return JSON.parse(contents);
    } catch (error) {
      return null;
    }
  }

  async writeStateFile() {
    if (!this.context.storageUri) {
      return;
    }

    await fs.mkdir(this.context.storageUri.fsPath, { recursive: true });
    const filePath = path.join(this.context.storageUri.fsPath, STORAGE_FILE_NAME);
    await fs.writeFile(filePath, JSON.stringify(this.state, null, 2), 'utf8');
  }
}

class PlannerViewProvider {
  constructor(context, store, viewType, title) {
    this.context = context;
    this.store = store;
    this.viewType = viewType;
    this.title = title;
    this.view = undefined;
    this.activeSection = 'planning';
  }

  resolveWebviewView(webviewView) {
    this.view = webviewView;
    webviewView.title = this.title;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')]
    };
    webviewView.webview.html = this.getHtml(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((message) => this.handleMessage(message));
    this.postState();
  }

  async handleMessage(message) {
    if (!message || typeof message.type !== 'string') {
      return;
    }

    switch (message.type) {
      case 'ready':
        if (typeof message.section === 'string' && message.section) {
          this.activeSection = message.section;
        }
        this.postState();
        return;
      case 'setSection':
        this.activeSection = typeof message.section === 'string' && message.section ? message.section : 'planning';
        this.postState();
        return;
      case 'refreshAiModels':
        this.activeSection = 'ai';
        this.postState();
        return;
      case 'selectAiModel':
        this.activeSection = 'ai';
        await this.store.update((draft) => {
          draft.assistant.selectedModelId = typeof message.modelId === 'string' ? message.modelId : '';
          draft.assistant.lastError = '';
        });
        PlannerViewProvider.broadcast();
        return;
      case 'clearAiConversation':
        this.activeSection = 'ai';
        await this.store.update((draft) => {
          draft.assistant.messages = [];
          draft.assistant.lastError = '';
          draft.assistant.isLoading = false;
        });
        PlannerViewProvider.broadcast();
        return;
      case 'sendAiPrompt':
        this.activeSection = 'ai';
        await this.sendAiPrompt(message);
        return;
      case 'savePlan':
        this.activeSection = 'planning';
        await this.store.update((draft) => {
          draft.activePlan = normalizePlan(message.plan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'startExecution':
        this.activeSection = 'execution';
        await this.store.update((draft) => {
          if (message.plan) {
            draft.activePlan = normalizePlan(message.plan);
          }
          draft.activePlan.mode = 'executing';
          syncCurrentTask(draft.activePlan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'pauseExecution':
        this.activeSection = 'execution';
        await this.store.update((draft) => {
          draft.activePlan.mode = 'paused';
        });
        PlannerViewProvider.broadcast();
        return;
      case 'resumeExecution':
        this.activeSection = 'execution';
        await this.store.update((draft) => {
          draft.activePlan.mode = 'executing';
          syncCurrentTask(draft.activePlan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'completeCurrentTask':
        this.activeSection = 'execution';
        await this.store.update((draft) => {
          const task = getCurrentTask(draft.activePlan);
          if (task) {
            task.completed = true;
            task.skipped = false;
          }
          syncCurrentTask(draft.activePlan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'skipCurrentTask':
        this.activeSection = 'execution';
        await this.store.update((draft) => {
          const task = getCurrentTask(draft.activePlan);
          if (task) {
            task.skipped = true;
            task.completed = false;
          }
          syncCurrentTask(draft.activePlan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'endSession':
        this.activeSection = 'history';
        await this.store.update((draft) => {
          draft.history.unshift(createArchiveEntry(draft.activePlan));
          draft.activePlan = createEmptyPlan(todayIso());
        });
        PlannerViewProvider.broadcast();
        return;
      default:
        return;
    }
  }

  async sendAiPrompt(message) {
    const prompt = typeof message.prompt === 'string' ? message.prompt.trim() : '';
    if (!prompt) {
      return;
    }

    const userMessage = {
      id: createId('chat'),
      role: 'user',
      content: prompt,
      modelId: typeof message.modelId === 'string' ? message.modelId : '',
      createdAt: new Date().toISOString()
    };

    const assistantMessageId = createId('chat');

    await this.store.update((draft) => {
      draft.assistant.selectedModelId = typeof message.modelId === 'string' ? message.modelId : draft.assistant.selectedModelId;
      draft.assistant.messages.push(userMessage, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        modelId: draft.assistant.selectedModelId,
        createdAt: new Date().toISOString()
      });
      draft.assistant.isLoading = true;
      draft.assistant.lastError = '';
    });

    PlannerViewProvider.broadcast();

    try {
      if (!vscode.lm || typeof vscode.lm.selectChatModels !== 'function') {
        throw new Error('This VS Code build does not expose integrated chat models to extensions.');
      }

      const currentState = this.store.getState();
      const model = await resolveSelectedModel(currentState.assistant.selectedModelId);

      if (!model) {
        throw new Error('No integrated VS Code chat models are currently available.');
      }

      const modelMessages = buildLanguageModelMessages(
        currentState.activePlan,
        currentState.assistant.messages.filter((entry) => entry.id !== assistantMessageId)
      );

      const response = await model.sendRequest(modelMessages, {
        justification: 'Gravity Planner AI chat lets the user discuss tasks and daily plans using models already available in VS Code.'
      });

      let responseText = '';
      for await (const fragment of response.text) {
        responseText += fragment;
      }

      await this.store.update((draft) => {
        const assistantMessage = draft.assistant.messages.find((entry) => entry.id === assistantMessageId);
        if (assistantMessage) {
          assistantMessage.content = responseText.trim() || 'No response returned by the selected model.';
          assistantMessage.modelId = model.id;
        }
        draft.assistant.selectedModelId = model.id;
        draft.assistant.isLoading = false;
        draft.assistant.lastError = '';
      });
    } catch (error) {
      const errorMessage = formatLanguageModelError(error);
      await this.store.update((draft) => {
        const assistantMessage = draft.assistant.messages.find((entry) => entry.id === assistantMessageId);
        if (assistantMessage) {
          assistantMessage.content = errorMessage;
        }
        draft.assistant.isLoading = false;
        draft.assistant.lastError = errorMessage;
      });
    }

    PlannerViewProvider.broadcast();
  }

  async postState() {
    if (!this.view) {
      return;
    }

    const state = this.store.getState();
    const progress = getProgress(state.activePlan);
    const models = await listAvailableModels();

    if (!state.assistant.selectedModelId && models.length > 0) {
      await this.store.update((draft) => {
        if (!draft.assistant.selectedModelId) {
          draft.assistant.selectedModelId = models[0].id;
        }
      });
    }

    const hydratedState = this.store.getState();
    this.view.description = `${progress.percent}% complete`;
    this.view.webview.postMessage({
      type: 'state',
      payload: {
        viewType: this.viewType,
        state: hydratedState,
        meta: {
          todayLabel: formatLongDate(hydratedState.activePlan.date),
          progress,
          currentTask: getCurrentTask(hydratedState.activePlan),
          section: this.activeSection,
          models
        }
      }
    });
  }

  getHtml(webview) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'planner.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'planner.css'));

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${styleUri}">
  <title>Gravity Planner</title>
</head>
<body data-view-type="${this.viewType}">
  <div id="app"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  reveal(section = this.activeSection) {
    this.activeSection = section;
    if (this.view) {
      this.view.show?.(true);
    }
    this.postState();
  }

  static register(provider) {
    PlannerViewProvider.providers.push(provider);
  }

  static broadcast() {
    for (const provider of PlannerViewProvider.providers) {
      provider.postState();
    }
  }
}

PlannerViewProvider.providers = [];

async function activate(context) {
  const store = new PlannerStore(context);
  await store.init();

  const dashboardProvider = new PlannerViewProvider(context, store, 'panel', 'Gravity Planner');

  PlannerViewProvider.register(dashboardProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(VIEW_TYPES.dashboard, dashboardProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.commands.registerCommand('planner.openDashboard', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.dailyPlanner');
      dashboardProvider.reveal('planning');
    }),
    vscode.commands.registerCommand('planner.openPlanning', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.dailyPlanner');
      dashboardProvider.reveal('planning');
    }),
    vscode.commands.registerCommand('planner.openExecution', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.dailyPlanner');
      dashboardProvider.reveal('execution');
    }),
    vscode.commands.registerCommand('planner.resetToday', async () => {
      await store.resetToday();
      PlannerViewProvider.broadcast();
    })
  );

  if (vscode.lm && typeof vscode.lm.onDidChangeChatModels === 'function') {
    context.subscriptions.push(
      vscode.lm.onDidChangeChatModels(() => {
        PlannerViewProvider.broadcast();
      })
    );
  }

  if (context.extensionMode === vscode.ExtensionMode.Development) {
    vscode.window.showInformationMessage('Gravity Planner activated (dev)');
    setTimeout(async () => {
      await vscode.commands.executeCommand('workbench.view.extension.dailyPlanner');
      dashboardProvider.reveal('planning');
    }, 300);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};