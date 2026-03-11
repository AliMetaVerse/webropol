const vscode = require('vscode');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const STORAGE_FILE_NAME = 'planner-state.json';
const VIEW_TYPES = {
  planning: 'plannerPlanningView',
  execution: 'plannerExecutionView',
  history: 'plannerHistoryView'
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
  const activePlan = normalizePlan(raw.activePlan || createEmptyPlan());
  const history = Array.isArray(raw.history)
    ? raw.history.map((entry) => ({
        date: typeof entry.date === 'string' ? entry.date : todayIso(),
        endedAt: typeof entry.endedAt === 'string' ? entry.endedAt : new Date().toISOString(),
        mode: ['planning', 'executing', 'paused'].includes(entry.mode) ? entry.mode : 'planning',
        summary: typeof entry.summary === 'string' ? entry.summary : '',
        progressPercent: Number.isFinite(entry.progressPercent) ? entry.progressPercent : 0,
        tasks: Array.isArray(entry.tasks) ? entry.tasks.map(normalizeTask) : [],
        timeBlocks: Array.isArray(entry.timeBlocks) ? entry.timeBlocks.map(normalizeBlock) : []
      }))
    : [];

  return { version: 1, activePlan, history };
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
        this.postState();
        return;
      case 'savePlan':
        await this.store.update((draft) => {
          draft.activePlan = normalizePlan(message.plan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'startExecution':
        await this.store.update((draft) => {
          if (message.plan) {
            draft.activePlan = normalizePlan(message.plan);
          }
          draft.activePlan.mode = 'executing';
          syncCurrentTask(draft.activePlan);
        });
        PlannerViewProvider.broadcast();
        vscode.commands.executeCommand('planner.openExecution');
        return;
      case 'pauseExecution':
        await this.store.update((draft) => {
          draft.activePlan.mode = 'paused';
        });
        PlannerViewProvider.broadcast();
        return;
      case 'resumeExecution':
        await this.store.update((draft) => {
          draft.activePlan.mode = 'executing';
          syncCurrentTask(draft.activePlan);
        });
        PlannerViewProvider.broadcast();
        return;
      case 'completeCurrentTask':
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
        await this.store.update((draft) => {
          draft.history.unshift(createArchiveEntry(draft.activePlan));
          draft.activePlan = createEmptyPlan(todayIso());
        });
        PlannerViewProvider.broadcast();
        vscode.commands.executeCommand('planner.openPlanning');
        return;
      default:
        return;
    }
  }

  postState() {
    if (!this.view) {
      return;
    }

    const state = this.store.getState();
    const progress = getProgress(state.activePlan);
    this.view.description = `${progress.percent}% complete`;
    this.view.webview.postMessage({
      type: 'state',
      payload: {
        viewType: this.viewType,
        state,
        meta: {
          todayLabel: formatLongDate(state.activePlan.date),
          progress,
          currentTask: getCurrentTask(state.activePlan)
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
  <title>Planner</title>
</head>
<body data-view-type="${this.viewType}">
  <div id="app"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  reveal() {
    if (this.view) {
      this.view.show?.(true);
    }
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

  if (context.extensionMode === vscode.ExtensionMode.Development) {
    vscode.window.showInformationMessage('Webropol Daily Planner activated');
  }

  const planningProvider = new PlannerViewProvider(context, store, 'planning', 'Planning');
  const executionProvider = new PlannerViewProvider(context, store, 'execution', 'Execution');
  const historyProvider = new PlannerViewProvider(context, store, 'history', 'History');

  PlannerViewProvider.register(planningProvider);
  PlannerViewProvider.register(executionProvider);
  PlannerViewProvider.register(historyProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(VIEW_TYPES.planning, planningProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.window.registerWebviewViewProvider(VIEW_TYPES.execution, executionProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.window.registerWebviewViewProvider(VIEW_TYPES.history, historyProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.commands.registerCommand('planner.openPlanning', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.dailyPlanner');
      planningProvider.reveal();
    }),
    vscode.commands.registerCommand('planner.openExecution', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.dailyPlanner');
      executionProvider.reveal();
    }),
    vscode.commands.registerCommand('planner.resetToday', async () => {
      await store.resetToday();
      PlannerViewProvider.broadcast();
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};