(function () {
  const vscode = acquireVsCodeApi();
  const app = document.getElementById('app');
  const viewType = document.body.dataset.viewType;
  let latestPayload = null;
  let activePanelSection = 'planning';

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (!message || message.type !== 'state') {
      return;
    }

    latestPayload = message.payload;
    if (viewType === 'panel' && message.payload?.meta?.section) {
      activePanelSection = message.payload.meta.section;
    }
    render();
  });

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) {
      return;
    }

    const action = actionTarget.dataset.action;
    if (action === 'show-planning' || action === 'show-execution' || action === 'show-history') {
      activePanelSection = action.replace('show-', '');
      render();
      return;
    }

    if (action === 'start-execution') {
      const plan = collectPlanningForm();
      if (!plan) {
        return;
      }
      if (viewType === 'panel') {
        activePanelSection = 'execution';
      }
      vscode.postMessage({ type: 'startExecution', plan });
      return;
    }

    if (action === 'save-plan') {
      submitPlanningForm();
      return;
    }

    if (action === 'complete-task') {
      vscode.postMessage({ type: 'completeCurrentTask' });
      return;
    }

    if (action === 'skip-task') {
      vscode.postMessage({ type: 'skipCurrentTask' });
      return;
    }

    if (action === 'pause-task') {
      vscode.postMessage({ type: 'pauseExecution' });
      return;
    }

    if (action === 'resume-task') {
      vscode.postMessage({ type: 'resumeExecution' });
      return;
    }

    if (action === 'end-session') {
      if (viewType === 'panel') {
        activePanelSection = 'history';
      }
      vscode.postMessage({ type: 'endSession' });
      return;
    }

    if (action === 'add-priority') {
      addTaskRow('topPriorities');
      return;
    }

    if (action === 'add-task') {
      addTaskRow('plannedTasks');
      return;
    }

    if (action === 'add-block') {
      addBlockRow();
      return;
    }

    if (action === 'remove-row') {
      const row = actionTarget.closest('[data-row]');
      if (row) {
        row.remove();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (!modifier || event.key !== 'Enter') {
      return;
    }

    if (viewType === 'planning') {
      event.preventDefault();
      const plan = collectPlanningForm();
      if (!plan) {
        return;
      }
      vscode.postMessage({ type: 'startExecution', plan });
      return;
    }

    if (viewType === 'execution') {
      event.preventDefault();
      vscode.postMessage({ type: 'completeCurrentTask' });
    }
  });

  function render() {
    if (!latestPayload) {
      app.innerHTML = '<div class="empty-state">Loading planner…</div>';
      return;
    }

    if (viewType === 'planning') {
      renderPlanningView();
      return;
    }

    if (viewType === 'execution') {
      renderExecutionView();
      return;
    }

    if (viewType === 'panel') {
      renderPanelView();
      return;
    }

    renderHistoryView();
  }

  function renderPanelView() {
    const { meta } = latestPayload;
    app.innerHTML = `
      <div class="shell panel-shell">
        <div class="hero-card compact">
          <div>
            <p class="eyebrow">Planner Dashboard</p>
            <h1>${escapeHtml(meta.todayLabel)}</h1>
          </div>
          <div class="progress-chip">${meta.progress.percent}% complete</div>
        </div>
        <div class="panel-tabs">
          <button type="button" class="tab-button${activePanelSection === 'planning' ? ' active' : ''}" data-action="show-planning">Planning</button>
          <button type="button" class="tab-button${activePanelSection === 'execution' ? ' active' : ''}" data-action="show-execution">Execution</button>
          <button type="button" class="tab-button${activePanelSection === 'history' ? ' active' : ''}" data-action="show-history">History</button>
        </div>
        <div class="panel-stage">
          ${renderSectionMarkup(activePanelSection)}
        </div>
      </div>
    `;
  }

  function renderSectionMarkup(section) {
    if (section === 'planning') {
      return planningMarkup();
    }

    if (section === 'execution') {
      return executionMarkup();
    }

    return historyMarkup();
  }

  function renderPlanningView() {
    app.innerHTML = `<div class="shell">${planningMarkup()}</div>`;
  }

  function renderExecutionView() {
    app.innerHTML = `<div class="shell">${executionMarkup()}</div>`;
  }

  function renderHistoryView() {
    app.innerHTML = `<div class="shell">${historyMarkup()}</div>`;
  }

  function planningMarkup() {
    const { state, meta } = latestPayload;
    const plan = state.activePlan;
    return `
      <div class="hero-card">
        <div>
          <p class="eyebrow">Daily Plan</p>
          <h1>${escapeHtml(meta.todayLabel)}</h1>
        </div>
        <div class="progress-chip">${meta.progress.percent}% planned complete</div>
      </div>

      <div class="progress-card">
        <div class="progress-header">
          <span>Day Progress</span>
          <strong>${meta.progress.completed}/${meta.progress.total || 0}</strong>
        </div>
        <div class="progress-bar"><span style="width:${meta.progress.percent}%"></span></div>
      </div>

      <form id="planning-form" class="stack">
        <section class="panel">
          <div class="section-header">
            <h2>Top Priorities</h2>
            <button type="button" class="ghost-button" data-action="add-priority">Add</button>
          </div>
          <div class="task-list" data-list="topPriorities">
            ${plan.topPriorities.map((task) => taskRow(task, plan.timeBlocks)).join('')}
          </div>
        </section>

        <section class="panel">
          <div class="section-header">
            <h2>Planned Tasks</h2>
            <button type="button" class="ghost-button" data-action="add-task">Add</button>
          </div>
          <div class="task-list" data-list="plannedTasks">
            ${plan.plannedTasks.map((task) => taskRow(task, plan.timeBlocks)).join('')}
          </div>
        </section>

        <section class="panel">
          <div class="section-header">
            <h2>Time Blocks</h2>
            <button type="button" class="ghost-button" data-action="add-block">Add</button>
          </div>
          <div class="block-list" data-list="timeBlocks">
            ${plan.timeBlocks.map(blockRow).join('')}
          </div>
        </section>

        <div class="footer-actions">
          <button type="button" class="secondary-button" data-action="save-plan">Save Plan</button>
          <button type="button" class="primary-button" data-action="start-execution">Start Execution</button>
        </div>
        <p class="hint">Keyboard: Ctrl/Cmd+Enter starts execution from this view.</p>
      </form>
    `;
  }

  function executionMarkup() {
    const { state, meta } = latestPayload;
    const plan = state.activePlan;
    const currentTask = meta.currentTask;
    const currentBlock = currentTask ? plan.timeBlocks.find((block) => block.id === currentTask.timeBlockId) : null;
    const isPaused = plan.mode === 'paused';

    if (!currentTask) {
      return `
        <div class="hero-card compact">
          <div>
            <p class="eyebrow">Execution Mode</p>
            <h1>All queued tasks are done</h1>
          </div>
          <div class="progress-chip">${meta.progress.percent}% complete</div>
        </div>
        <div class="panel centered">
          <p class="empty-copy">You have no remaining active tasks for today.</p>
          <div class="footer-actions single">
            <button type="button" class="secondary-button" data-action="end-session">End Session</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="hero-card compact">
        <div>
          <p class="eyebrow">${isPaused ? 'Paused' : 'Current Task'}</p>
          <h1>${escapeHtml(currentTask.title)}</h1>
        </div>
        <div class="progress-chip">${meta.progress.percent}% complete</div>
      </div>

      <section class="panel focus-panel">
        <div class="focus-row">
          <span class="label">Time Block</span>
          <strong>${currentBlock ? `${escapeHtml(currentBlock.start)} - ${escapeHtml(currentBlock.end)}  ${escapeHtml(currentBlock.label)}` : 'Not assigned'}</strong>
        </div>
        <div class="focus-row">
          <span class="label">Estimate</span>
          <strong>${currentTask.estimateMinutes ? `${escapeHtml(String(currentTask.estimateMinutes))} min` : 'Not set'}</strong>
        </div>
        <div class="focus-row">
          <span class="label">Mode</span>
          <strong>${escapeHtml(plan.mode)}</strong>
        </div>
        <div class="progress-bar large"><span style="width:${meta.progress.percent}%"></span></div>
      </section>

      <div class="footer-actions spread">
        <button type="button" class="primary-button" data-action="complete-task">Complete Task</button>
        <button type="button" class="secondary-button" data-action="skip-task">Skip Task</button>
        <button type="button" class="secondary-button" data-action="${isPaused ? 'resume-task' : 'pause-task'}">${isPaused ? 'Resume' : 'Pause'}</button>
        <button type="button" class="ghost-button" data-action="end-session">End Session</button>
      </div>
      <p class="hint">Keyboard: Ctrl/Cmd+Enter completes the current task.</p>
    `;
  }

  function historyMarkup() {
    const { state } = latestPayload;
    if (!state.history.length) {
      return `
        <div class="panel centered">
          <p class="empty-copy">No previous planner sessions yet.</p>
        </div>
      `;
    }

    return `
      <div class="stack">
        ${state.history.map((entry) => `
          <section class="panel history-card">
            <div class="section-header dense">
              <h2>${escapeHtml(entry.date)}</h2>
              <span class="progress-chip small">${escapeHtml(String(entry.progressPercent))}%</span>
            </div>
            <p class="history-summary">${escapeHtml(entry.summary || 'Session archived')}</p>
            <p class="history-meta">Ended ${escapeHtml(new Date(entry.endedAt).toLocaleString())}</p>
          </section>
        `).join('')}
      </div>
    `;
  }

  function taskRow(task, timeBlocks) {
    return `
      <div class="task-row" data-row data-kind="task">
        <input type="hidden" name="task-id" value="${escapeHtml(task.id)}">
        <label>
          <span>Task</span>
          <input type="text" name="task-title" value="${escapeHtml(task.title)}" placeholder="Task title">
        </label>
        <label>
          <span>Minutes</span>
          <input type="number" min="0" step="5" name="task-estimate" value="${escapeHtml(task.estimateMinutes === '' ? '' : String(task.estimateMinutes))}" placeholder="45">
        </label>
        <label>
          <span>Time Block</span>
          <select name="task-time-block">
            <option value="">None</option>
            ${buildTimeBlockOptions(timeBlocks, task.timeBlockId)}
          </select>
        </label>
        <button type="button" class="icon-button" data-action="remove-row" aria-label="Remove task">Remove</button>
      </div>
    `;
  }

  function blockRow(block) {
    return `
      <div class="block-row" data-row data-kind="block">
        <input type="hidden" name="block-id" value="${escapeHtml(block.id)}">
        <label>
          <span>Start</span>
          <input type="time" name="block-start" value="${escapeHtml(block.start)}">
        </label>
        <label>
          <span>End</span>
          <input type="time" name="block-end" value="${escapeHtml(block.end)}">
        </label>
        <label class="grow">
          <span>Label</span>
          <input type="text" name="block-label" value="${escapeHtml(block.label)}" placeholder="Deep Work">
        </label>
        <button type="button" class="icon-button" data-action="remove-row" aria-label="Remove time block">Remove</button>
      </div>
    `;
  }

  function addTaskRow(listName) {
    const list = document.querySelector(`[data-list="${listName}"]`);
    list.insertAdjacentHTML('beforeend', taskRow({ id: `task-${Date.now()}`, title: '', estimateMinutes: '', timeBlockId: '' }, readBlocksFromDom()));
  }

  function addBlockRow() {
    const list = document.querySelector('[data-list="timeBlocks"]');
    list.insertAdjacentHTML('beforeend', blockRow({ id: `block-${Date.now()}`, start: '', end: '', label: '' }));
  }

  function buildTimeBlockOptions(blocks, selectedId) {
    return blocks.map((block) => {
      const label = [block.start, block.end].filter(Boolean).join(' - ');
      const text = [label, block.label].filter(Boolean).join('  ');
      const selected = block.id === selectedId ? ' selected' : '';
      return `<option value="${escapeHtml(block.id)}"${selected}>${escapeHtml(text || 'Time Block')}</option>`;
    }).join('');
  }

  function readBlocksFromDom() {
    return Array.from(document.querySelectorAll('.block-row')).map((row) => ({
      id: row.querySelector('[name="block-id"]').value || `block-${Date.now()}`,
      start: row.querySelector('[name="block-start"]').value,
      end: row.querySelector('[name="block-end"]').value,
      label: row.querySelector('[name="block-label"]').value.trim()
    }));
  }

  function submitPlanningForm() {
    const plan = collectPlanningForm();
    if (!plan) {
      return;
    }

    vscode.postMessage({
      type: 'savePlan',
      plan
    });
  }

  function collectPlanningForm() {
    const form = document.getElementById('planning-form');
    if (!form || !latestPayload) {
      return null;
    }

    const plan = latestPayload.state.activePlan;
    const timeBlocks = readBlocksFromDom();
    const topPriorities = readTasksFromDom('topPriorities', plan.topPriorities);
    const plannedTasks = readTasksFromDom('plannedTasks', plan.plannedTasks);

    return {
      date: plan.date,
      mode: plan.mode,
      currentTaskId: plan.currentTaskId,
      topPriorities,
      plannedTasks,
      timeBlocks
    };
  }

  function readTasksFromDom(listName, previousTasks) {
    const previousMap = new Map(previousTasks.map((task) => [task.id, task]));
    return Array.from(document.querySelectorAll(`[data-list="${listName}"] .task-row`)).map((row) => {
      const id = row.querySelector('[name="task-id"]').value || `task-${Date.now()}`;
      const previous = previousMap.get(id) || {};
      return {
        id,
        title: row.querySelector('[name="task-title"]').value.trim(),
        estimateMinutes: parseNumber(row.querySelector('[name="task-estimate"]').value),
        timeBlockId: row.querySelector('[name="task-time-block"]').value,
        completed: Boolean(previous.completed),
        skipped: Boolean(previous.skipped)
      };
    });
  }

  function parseNumber(value) {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : '';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  vscode.postMessage({ type: 'ready', section: activePanelSection });
  render();
})();