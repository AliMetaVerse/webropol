# Import Auto Suggestions File — Feature Documentation

Checklist
- [x] Overview and purpose
- [x] Feature location and entry points
- [x] Step-by-step workflow (download template, upload, apply)
- [x] File format and validation rules
- [x] UI state management and persistence
- [x] Technical implementation notes and key functions
- [x] Best practices and accessibility considerations

## Overview
The Import Auto Suggestions File feature allows users to bulk import answer options for auto-suggest questions in surveys. This streamlines adding large sets of predefined options that respondents can select from.

## Feature Location
Accessible from the Survey Edit page:

1. Main Question Editor — "Import Auto Suggestions File" button in the question content area.

## Workflow

### 1) Initiate import
From the Survey Edit page, click the "Import Auto Suggestions File" button to open the Upload Auto-Suggest Modal.

### 2) Download template
Purpose: provide a correct CSV structure.

- Click "Get template file" to download `auto-suggest-template.csv`.
- Template content example:

```csv
Answer Option
"Option 1"
"Option 2"
"Option 3"
```

### 3) Select and validate file
Requirements:
- CSV format (comma delimited)
- Recommended: follow the template structure
- Max size (UI helper text): 10MB

Selection flow:
- Click "Choose File" or drag & drop the CSV into the upload area.
- Client checks the file extension (.csv).
- Selected filename is displayed; "Upload" becomes enabled.

### 4) Upload and processing
- Click "Upload" to start.
- UI shows an uploading spinner and disables the upload button.
- On success:
  - Upload button shows success state (checkmark)
  - "Apply" becomes enabled
  - "Remove uploaded auto-suggest list" becomes enabled
- If the file contains > 1,000 options, it will be placed into a processing queue; while processing, sending surveys may be blocked and the user will receive an email when processing completes.

### 5) Apply changes
- Click "Apply" to confirm and insert the imported suggestions into the question.
- Modal closes and the options become available.

### 6) Remove / Manage
- Remove before upload: clears the selected file.!!!!!!!!!!!
- Remove uploaded list: prompts confirmation and clears persisted data.


## Technical Implementation Notes

### Validation
- Basic validation: extension check for `.csv`.
- The UI should also guard and warn for very large files (>10MB) and queue large imports (>1,000 rows).

### UI feedback
- Use a spinner and clear success state on upload button.
- Enable/disable `Apply` and `Remove` buttons according to upload state.
- Show an uploading indicator in the question UI while processing.

## Best Practices
1. Download the template and verify the CSV structure before uploading.
2. For large datasets (>1,000 options), expect processing delays — upload during off-hours if possible.
3. Keep a local backup copy of the CSV.
4. Test with a small sample first before full production imports.
5. If the site supports server-side validation, add CSV schema checks (duplicates, allowed characters, max rows) on the backend.

## Accessibility
- Modal has keyboard focus behavior and ARIA-friendly close controls.
- Buttons provide clear labels and visual states.
- Provide text-only feedback for upload status for screen readers.

## Error Handling & Edge Cases
- Invalid file type: show a clear error message and keep upload disabled.
- Network failure: show retry option and keep the file selection intact.
- Processing queue timeout/failure: show status with an option to re-try or contact support.

