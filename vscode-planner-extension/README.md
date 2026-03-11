# Webropol Daily Planner

MVP VS Code extension for planning a workday and then running it in focus mode.

## Included

- Planning view with top priorities, planned tasks, and time blocks
- Start Execution flow that switches into single-task focus mode
- Execution controls for complete, skip, pause, resume, and end session
- History view for archived sessions
- Local JSON persistence in the extension storage folder

## Run locally

1. Open this repository in VS Code.
2. Use the workspace launch configuration named `Run Daily Planner Extension`.
3. In the Extension Development Host, open the `Planner` activity bar item.

## Storage

Planner state is stored in the extension workspace storage as `planner-state.json`.