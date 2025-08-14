# Question & Survey Library - Complete User Stories, Specifications & Workflows

## Table of Contents
1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [Technical Specifications](#technical-specifications)
4. [End-to-End Workflows](#end-to-end-workflows)
5. [Modal Dialog Copy](#modal-dialog-copy)
6. [Error Messages](#error-messages)
7. [API Specifications](#api-specifications)
8. [Validation Rules](#validation-rules)

## Overview

The Question & Survey Library is a comprehensive content management system that allows users to organize, search, manage, and reuse survey questions and complete surveys in a hierarchical folder structure. It supports multi-language content, bulk operations, and various content types.

### Key Features
- **Dual Content Views**: Switch between Questions and Surveys
- **Hierarchical Organization**: 4-level folder structure (Organization Library → Category → Subcategory → Final Level)
- **Multi-language Support**: Content available in supported languages
- **Advanced Search & Filtering**: Real-time search with folder-based filtering
- **Bulk Operations**: Select multiple items for mass actions
- **Content Management**: Create folders and subfolders, edit, move, rename, delete, and freeze operations
- **Preview & Details**: In-depth content examination before use
- **Tab Layout Options**: Horizontal and vertical tab orientations for different screen sizes

## User Stories

### US-001: View and Navigate Library Content
**As a** survey creator  
**I want to** browse the question and survey library with clear organization  
**So that** I can quickly find and reuse existing content

**Acceptance Criteria:**
- Library displays both Questions and Surveys in tabbed interface
- Folder tree shows hierarchical organization with expand/collapse functionality
- Content counts are visible for each folder
- Active folder highlighting shows current selection
- Breadcrumb navigation shows current location context

**Technical Requirements:**
- Load initial content within 500ms
- Support up to 10,000 items per view
- Real-time folder expansion/collapse animations
- Keyboard navigation support (Tab, Enter, Arrow keys)

### US-002: Search and Filter Content
**As a** content manager  
**I want to** search for specific questions or surveys across the library  
**So that** I can quickly locate content without manual browsing

**Acceptance Criteria:**
- Folder and Content search across all visible content
- Search within selected folder scope
- Language filter affects search results
- Clear indicators when no results found

**Technical Requirements:**
- Search debounce delay: 300ms
- Minimum search term length: 2 characters
- Case-insensitive search
- Search in title, description, and keywords
- Maximum search results: 100 items

### US-003: Manage Folder Structure
**As a** library administrator  
**I want to** create and organize folders to categorize content  
**So that** users can find relevant content efficiently

**Acceptance Criteria:**
- Create subfolders up to 4 levels deep
- Rename folders with validation
- Move folders between locations
- Delete folders with impact warning
- Folder actions via context menu

**Technical Requirements:**
- Duplicate folder name prevention within same parent
- Cascading delete confirmation for folders with content

### US-004: Bulk Content Operations
**As a** content curator  
**I want to** perform actions on multiple items simultaneously  
**So that** I can efficiently manage large amounts of content

**Acceptance Criteria:**
- Select multiple questions/surveys via checkboxes
- Select all/none options available
- Bulk delete with confirmation
- Bulk freeze for questions (prevent editing)
- Clear selection state management

**Technical Requirements:**
- Maximum bulk selection: 500 items
- Atomic bulk operations (all succeed or all fail)
- Progress indication for operations > 5 seconds
- Rollback capability for failed operations

### US-005: Content Preview and Details
**As a** survey designer  
**I want to** preview questions and surveys before using them  
**So that** I can ensure they meet my needs

**Acceptance Criteria:**
- Preview modal shows complete content rendering
- Question details include type, options, and metadata
- Survey details show all questions and structure
- Keywords and categorization visible
- Creation and modification history

**Technical Requirements:**
- Preview loads within 1 second
- Support all question types (selection, multiple choice, rating, text)
- Responsive preview for mobile devices
- Print-friendly preview format

### US-006: Multi-language Content Management
**As a** international user  
**I want to** work with content in multiple languages  
**So that** I can create surveys for different audiences

**Acceptance Criteria:**
- Language selector affects displayed content
- Content count updates per language selection
- Language-specific search results
- Clear indicators for available languages
- Translation linking for related content

**Technical Requirements:**
- Supported languages: Supported lanugeas by Weblropl
- Character encoding: UTF-8
- Right-to-left language support (future)
- Translation metadata tracking

### US-007: Content Lifecycle Management
**As a** quality manager  
**I want to** freeze content to prevent modifications  
**So that** approved content remains consistent

**Acceptance Criteria:**
- Freeze individual questions or entire surveys
- Configure freeze permissions (add questions/pages)
- Visual indicators for frozen content
- Selective question freezing within surveys
- Frozen content usage tracking

**Technical Requirements:**
- Freeze state persistence across sessions
- Version control for frozen content
- Audit trail for freeze/unfreeze actions
- Frozen content backup and recovery

### US-008: Library Configuration and Preferences
**As a** power user  
**I want to** customize the library interface  
**So that** it matches my workflow preferences

**Acceptance Criteria:**
- Toggle between horizontal and vertical tab layout
- Show/hide question content vs. titles only
- Persistent preference storage
- Quick toggle access via menu
- Interface responsiveness across devices

**Technical Requirements:**
- Preference storage: localStorage
- Layout change animation: 200ms transition
- Minimum screen width: 320px (mobile)
- Maximum supported resolution: 4K

## Technical Specifications

### Frontend Architecture
- **Framework**: Alpine.js 3.x with Tailwind CSS 3.x
- **Components**: Webropol Design System custom components
- **State Management**: Alpine.js reactive data
- **Icons**: Font Awesome 6.x
- **Animations**: CSS transitions and Tailwind utilities

### Data Models

#### Folder Structure
Folders contain metadata including ID, name, description, hierarchical level (0-3), parent relationship, child folders, creation timestamps, and creator information.

#### Question Model
Questions include identification, content, type classification, language settings, folder association, categorization metadata, creation details, configuration options, and lifecycle status.

#### Survey Model
Surveys contain identification, content, language settings, folder association, creator information, keyword categorization, question collections, lifecycle status, location data, and metrics.

### State Management

#### Global State
The application maintains state for current view mode, language selection, search terms, folder selection, interface preferences, item selections, folder expansion status, and data collections.

#### Modal States
Modal state management tracks the visibility status of all dialog windows including preview, creation, editing, confirmation, and information modals.

### Performance Requirements
- **Initial Load**: < 2 seconds for 10,000 items
- **Search Response**: < 300ms for real-time results
- **Modal Open**: < 100ms
- **Bulk Operations**: < 5 seconds for 100 items
- **Memory Usage**: < 50MB for typical session

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES6 modules, CSS Grid, Alpine.js support

## End-to-End Workflows

### Workflow 1: Creating and Organizing Content

#### Step 1: Access Library
1. User navigates to MyWebropol → Library
2. Page loads with default survey view
3. Folder tree shows Organization Library and My Templates

#### Step 2: Create Folder Structure
1. Right-click on "Organization Library"
2. Select "Add Sub Folder" from context menu
3. Modal opens: "Add Subfolder"
4. User enters folder name and description
5. Click "Create Subfolder"
6. New folder appears in tree with expand icon

#### Step 3: Add Questions to Folder
1. Click on newly created folder
2. Folder becomes selected (highlighted)
3. Switch to Questions tab
4. Create new questions (external workflow)
5. Questions appear in selected folder

#### Step 4: Organize with Subfolders
1. Right-click on folder containing questions
2. Select "Add Sub Folder"
3. Create "Product Feedback" subfolder
4. Select questions in parent folder
5. Use context menu "Move Question"
6. Select "Product Feedback" as destination
7. Questions moved to subfolder

### Workflow 2: Multi-language Content Management

#### Step 1: Create English Content
1. Set language selector to "English"
2. Create survey in selected folder
3. Add questions to survey
4. Save survey with keywords

#### Step 2: Create Finnish Translation
1. Keep language selector on "English"
2. Right-click on survey
3. Select "Create Translation"
4. Modal opens with language selection
5. Select "Finnish" as target language
6. Translation form opens with English content
7. Translate all text fields
8. Save Finnish version

#### Step 3: Link Translations
1. System automatically links translations
2. Language count shows "2 languages"
3. Switch language selector to "Finnish"
4. Only Finnish content visible
5. Translation relationship maintained

### Workflow 3: Bulk Content Operations

#### Step 1: Select Multiple Items
1. In Questions view, check "Select All Questions"
2. All visible questions selected
3. Or manually select specific questions
4. Selection counter shows "X questions selected"

#### Step 2: Bulk Delete
1. Click "Delete" in selection toolbar
2. Bulk delete confirmation modal opens
3. Warning shows number of items to delete
4. User confirms deletion
5. All selected questions removed
6. Selection cleared

#### Step 3: Bulk Freeze
1. Select multiple questions
2. Click "Freeze" in selection toolbar
3. Freeze confirmation modal opens
4. User configures freeze settings
5. Confirms freeze operation
6. Questions marked as frozen
7. Visual indicators updated

### Workflow 4: Content Search and Discovery

#### Step 1: Global Search
1. User types in search box
2. Real-time filtering as user types
3. Results update across current view
4. Search highlights matching terms

#### Step 2: Folder-Scoped Search
1. User clicks on specific folder
2. Folder becomes selected/highlighted
3. Search now limited to folder contents
4. Folder indicator shows active filter

#### Step 3: Language-Specific Search
1. User changes language selector
2. Content refreshes for selected language
3. Search maintains current term
4. Results update for new language

#### Step 4: Clear and Reset
1. User clears search term
2. All content for current scope shows
3. Or user clicks different folder
4. Search scope changes to new folder

### Workflow 5: Content Preview and Usage

#### Step 1: Preview Survey
1. User clicks eye icon on survey row
2. Preview modal opens
3. Complete survey renders with all questions
4. User can scroll through content
5. Close preview or proceed to use

#### Step 2: View Details
1. User clicks three dots menu
2. Select "Survey Details" or "Question Details"
3. Details modal opens
4. Shows metadata, keywords, descriptions
5. Expandable sections for additional info

#### Step 3: Edit Content
1. From details modal or context menu
2. Select "Edit" option
3. Edit modal opens with current values
4. User modifies content
5. Saves changes with validation

## Modal Dialog Copy

### Create New Folder Modal
```
Title: "Create New Folder"
Subtitle: "Organize your questions and surveys"

Fields:
- Folder Name: "Enter folder name..."
- Description (Optional): "Describe what this folder contains..."

Buttons: "Cancel" | "Create Folder"
```

### Add Subfolder Modal
```
Title: "Add Subfolder"
Subtitle: "Create a new subfolder to organize your content"

Content:
- Parent Folder: [Shows current folder name with folder icon]
- Subfolder Name: "Enter subfolder name..."
- Description (Optional): "Describe what this subfolder contains..."

Buttons: "Cancel" | "Create Subfolder"
```

### Move Item Modal
```
Title: "Move [Folder/Question/Survey]"
Subtitle: "Select a new location for this [item type]"

Current Item Section:
"[Item type] you're moving:"
[Icon] [Item name]

New Location Section:
"New location:"
[Selection display or "Not selected yet"]

Location Tree:
"Select a new location"
[Hierarchical folder tree with selection]

Footer:
[Create New Folder] | "Cancel" | "Move"
```

### Delete Confirmation Modal
```
Title: "Delete [Item Type]"
Subtitle: "This action cannot be undone"

Warning Box:
⚠️ "Warning"
"Are you sure you want to delete '[Item Name]'?"
[Additional context based on item type]

Item Display:
[Icon] [Item Name] [Item count if folder]

Buttons: "Cancel" | "Delete [Item Type]"
```

### Freeze Survey Modal
```
Title: "Freeze Survey Question(s) or Page(s)"

Survey Info:
Survey Name: [Name]
"Survey to be frozen"

Settings:
User Permissions:
☑️ "Allow adding questions"
☑️ "Allow adding pages"

Display Options:
☑️ "Show titles only"

Question Selection:
☑️ "Select all" | "Choose questions to include in frozen survey"

[Search box for questions]

Footer: "Cancel" | "Freeze"
```

### Survey Details Modal
```
Title: "Survey Details"
Subtitle: "Survey information and settings"

Basic Information:
- Name: [Read-only field] "(The name in survey folder list)"
- Survey ID: [Auto-generated, read-only]
- Location: [Folder path, read-only]
- Created by: [Username, read-only]

Keywords (Expandable):
"Keywords (X)"
[Add keyword field] [Add button]
[Keyword tags with X to remove]

Excel Management:
"Manage survey, question and option keywords (for this survey) via Excel"
1. Export excel to get current keywords
2. Import Excel with added keywords

Survey Description (Expandable):
[Rich text editor with full formatting toolbar]

Buttons: "Cancel" | "Apply"
```

### Question Details Modal
```
Title: "Question Details"
Subtitle: "View question details and properties"

Information:
- Question name: [Name with lightbulb icon if special]
- Question type: [Type]
- Question keyword(s): [Keywords]
- Question folder name: [Folder path]
- Created by: [Username]

Question Description (Expandable):
[Rich text editor with formatting options]

Buttons: "Cancel" | "Apply"
```

### Edit Question Modal
```
Title: "Edit question"
Subtitle: "Modify question properties and settings"

Fields:
- Question title: [Dropdown with options like "Open ended", "Multiple choice", etc.]
- Question text: [Text input]
☑️ "Question is mandatory"

Buttons: "Cancel" | "Apply"
```

### Bulk Delete Confirmation Modal
```
Title: "Delete Selected [Questions/Surveys]"
Subtitle: "This action cannot be undone"

Warning:
⚠️ "Warning"
"Are you sure you want to delete X [questions/surveys]? This will permanently remove them from your library."

Buttons: "Cancel" | "Delete [Questions/Surveys]"
```

### Bulk Freeze Confirmation Modal
```
Title: "Freeze Selected Questions"
Subtitle: "Confirm freezing action"

Warning:
❄️ "Freeze Questions"
"Are you sure you want to freeze X question(s)? This will make them read-only and prevent further modifications."

Buttons: "Cancel" | "Freeze Questions"
```

### Preview Modal (Survey)
```
Title: "Preview"

Content: [Complete survey rendering]
- Survey title prominently displayed
- Questions numbered and formatted
- Options shown as they would appear to respondents
- Interactive elements (disabled for preview)

Footer: "Close" | [Optional: "Use This Survey"]
```

### Create New Content Modal
```
Title: "Create New Survey or Question Library"
Subtitle: "Choose what you want to create. This will take to create new page of each survey"

Grid of Options:
[Icon] Surveys - "Create custom surveys"
[Icon] Events - "Event management"
[Icon] EXW Surveys - "Employee experience"
[Icon] Case Management - "Manage cases"
[Icon] eTests - "Online testing"
[Icon] Assessments - "Performance review"
[Icon] Touch Tablets - "Tablet surveys"
[Icon] Direct Mobile Surveys - "Mobile optimized"

Footer: "Cancel"
```

## Error Messages

### Validation Errors

#### Folder Name Validation
```
Empty Name: "Folder name is required"
Too Long: "Folder name cannot exceed 100 characters"
Invalid Characters: "Folder name cannot contain: / \ : * ? \" < > |"
Duplicate Name: "A folder with this name already exists in this location"
```

#### Search Errors
```
No Results: "No [questions/surveys] found"
Search Too Short: "Please enter at least 2 characters to search"
Search Failed: "Search temporarily unavailable. Please try again."
```

#### Selection Errors
```
No Items Selected: "Please select at least one item to continue"
Too Many Selected: "Cannot select more than 500 items at once"
Mixed Selection: "Cannot perform this action on mixed item types"
```

### Operation Errors

#### Network Errors
```
Connection Lost: "Connection lost. Please check your internet connection and try again."
Server Error: "Server temporarily unavailable. Please try again in a few moments."
Timeout: "Operation timed out. Please try again."
```

#### Permission Errors
```
No Permission: "You don't have permission to perform this action"
Read Only: "This item is read-only and cannot be modified"
Frozen Content: "Cannot modify frozen content. Please unfreeze first."
```

#### Content Errors
```
Item Not Found: "The requested item could not be found"
Already Deleted: "This item has been deleted by another user"
Version Conflict: "This item has been modified by another user. Please refresh and try again."
```

### Success Messages

#### Folder Operations
```
Created: "Folder '[Name]' created successfully"
Renamed: "Folder renamed successfully"
Moved: "Folder moved successfully"
Deleted: "Folder and X items deleted successfully"
```

#### Content Operations
```
Question Created: "Question saved successfully"
Survey Created: "Survey saved successfully"
Bulk Deleted: "X items deleted successfully"
Bulk Frozen: "X questions frozen successfully"
Content Moved: "Content moved successfully"
```

#### Settings
```
Preferences Saved: "Preferences saved successfully"
Language Changed: "Language changed to [Language]"
Layout Updated: "Layout changed to [orientation]"
```

## API Specifications

### REST Endpoints

#### Folders
API endpoints support full folder management including listing with hierarchy, creation, updates, deletion, and content retrieval.

#### Questions
Question management endpoints provide comprehensive CRUD operations, bulk operations for deletion and freezing, and detailed information retrieval.

#### Surveys
Survey endpoints enable complete lifecycle management including creation, modification, deletion, bulk operations, detailed views, and preview data access.

#### Search
Dedicated search endpoints support filtered queries across questions and surveys with language and folder scope parameters.

### Request/Response Formats

API requests use standard HTTP methods with JSON payloads for POST and PUT operations. Request bodies include all necessary fields for data validation and processing.

Responses follow consistent patterns with standard HTTP status codes. Success responses include the requested data or operation confirmation. Error responses provide detailed error information with appropriate status codes and descriptive messages for troubleshooting.

## Validation Rules

### Input Validation

#### Folder Names
- Required: Yes
- Min Length: 1 character
- Max Length: 100 characters
- Forbidden Characters: / \ : * ? " < > |
- Trim whitespace
- Unique within parent folder

#### Search Terms
- Min Length: 2 characters (for auto-search)
- Max Length: 100 characters
- Allow all Unicode characters
- HTML encode special characters

#### Keywords
- Individual keyword max: 50 characters
- Total keywords per item: 20
- Comma-separated input parsing
- Duplicate removal
- Case-insensitive storage

### Business Rules

#### Folder Hierarchy
- Maximum depth: 4 levels (0-3)
- Root folders: Organization Library, My Templates
- Cannot move folder into its own subtree
- Cannot delete folders with content (unless confirmed)

#### Language Support
- Default language: English
- Supported: English (en), Finnish (fi)
- Question language filtering applies to display only
- Survey language affects content visibility

#### Bulk Operations
- Maximum selection: 500 items
- Cannot mix questions and surveys in single operation
- Frozen content cannot be bulk deleted
- Atomic operations (all or nothing)

#### Content Lifecycle
- Frozen content is read-only
- Frozen status is persistent
- Audit trail for all freeze/unfreeze operations
- Version control for frozen content changes

### Security Rules

#### Access Control
- User must be authenticated
- Folder access based on user permissions
- Read-only users cannot modify content
- Audit log for all destructive operations

#### Data Protection
- All inputs sanitized and validated
- SQL injection prevention
- XSS protection for user-generated content
- CSRF tokens for state-changing operations

This comprehensive specification provides the foundation for implementing a robust, user-friendly Question & Survey Library that meets enterprise requirements while maintaining excellent user experience.
