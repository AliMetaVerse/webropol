# Gravity Planner

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
3. In the Extension Development Host, open the `Gravity Planner` activity bar item.

## Install without Node.js

If you do not have Node.js or `npx`, you can still install the extension by copying this folder into your VS Code extensions directory.

### Option 1: Use the included PowerShell installer

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\vscode-planner-extension\install-local.ps1
```

For VS Code Insiders:

```powershell
powershell -ExecutionPolicy Bypass -File .\vscode-planner-extension\install-local.ps1 -Target insiders
```

### Option 2: Copy manually

Copy the folder [vscode-planner-extension](vscode-planner-extension) to one of these locations and rename it to `alimetaverse.webropol-daily-planner-0.0.1`:

- VS Code: `C:\Users\<your-user>\.vscode\extensions\`
- VS Code Insiders: `C:\Users\<your-user>\.vscode-insiders\extensions\`

After copying, reload VS Code and search for `Gravity Planner` in the Command Palette.

## Storage

Gravity Planner state is stored in the extension workspace storage as `planner-state.json`.