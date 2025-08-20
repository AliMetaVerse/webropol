# Question & Survey Library - Technical Implementation Guide

## Component Architecture

### Page Structure
```
Library Page
├── Header (webropol-header)
├── Breadcrumbs (webropol-breadcrumbs)
├── Main Content Area
│   ├── Page Header with Kebab Menu
│   ├── Content Grid (lg:grid-cols-12)
│   │   ├── Sidebar (lg:col-span-3)
│   │   │   ├── Tab Navigation (Questions/Surveys)
│   │   │   ├── Language Selector
│   │   │   ├── Search Box
│   │   │   └── Folder Tree
│   │   └── Content Area (lg:col-span-9)
│   │       ├── Questions View
│   │       │   ├── Header with Search/Toggle
│   │       │   ├── Bulk Actions Bar
│   │       │   └── Questions List
│   │       └── Surveys View
│   │           ├── Header with Search
│   │           ├── Bulk Actions Bar
│   │           ├── Survey Table
│   │           └── Pagination
│   └── Modal Collection (15+ modals)
└── Floating Action Button (webropol-floating-button)
```

### Alpine.js State Management

#### Core State Object
```javascript
{
  // View State
  currentView: 'surveys' | 'questions',
  selectedLanguage: 'en' | 'fi',
  tabsOrientation: 'horizontal' | 'vertical',
  showOnlyTitles: boolean,
  
  // Search and Filter
  searchTerm: string,
  questionSearchTerm: string,
  surveySearchTerm: string,
  selectedFolderId: number | null,
  
  // UI State
  expandedFolders: number[],
  showLibraryMenu: boolean,
  showContextMenu: string | null,
  
  // Selection State
  selectedQuestions: number[],
  selectedSurveys: number[],
  selectAllQuestions: boolean,
  selectAllSurveys: boolean,
  
  // Modal States (15 different modals)
  showPreviewModal: boolean,
  showCreateFolder: boolean,
  showCreateFolderFromMove: boolean,
  showCreateModal: boolean,
  showMoveModal: boolean,
  showFreezeModal: boolean,
  showAddSubfolderModal: boolean,
  showRenameModal: boolean,
  showDeleteModal: boolean,
  showSurveyInfoModal: boolean,
  showQuestionInfoModal: boolean,
  showEditQuestionModal: boolean,
  showBulkDeleteModal: boolean,
  showBulkFreezeModal: boolean,
  
  // Data
  folders: Folder[],
  questions: Question[],
  surveys: Survey[]
}
```

### Key Methods and Functions

#### Content Filtering
```javascript
// Get filtered questions based on language, search, and folder
getFilteredQuestions() {
  return this.questions.filter(question => {
    const matchesLanguage = question.language === this.selectedLanguage;
    const matchesSearch = !this.searchTerm || 
      question.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    
    let matchesFolder = true;
    if (this.selectedFolderId !== null) {
      const allowedFolderIds = this.getAllChildFolderIds(this.selectedFolderId);
      matchesFolder = allowedFolderIds.includes(question.folderId);
    }
    
    return matchesLanguage && matchesSearch && matchesFolder;
  });
}

// Get filtered surveys with same logic
getFilteredSurveys() {
  // Similar implementation for surveys
}
```

#### Folder Management
```javascript
// Find folder by ID in nested structure
findFolderById(folderId, folders = this.folders) {
  for (let folder of folders) {
    if (folder.id === folderId) return folder;
    if (folder.children?.length > 0) {
      const found = this.findFolderById(folderId, folder.children);
      if (found) return found;
    }
  }
  return null;
}

// Build folder path for display
buildFolderPath(folderId) {
  const folder = this.findFolderById(folderId);
  if (!folder) return null;
  
  let path = folder.name;
  let currentFolder = folder;
  
  while (currentFolder.parentId) {
    const parentFolder = this.findFolderById(currentFolder.parentId);
    if (parentFolder) {
      path = parentFolder.name + ' > ' + path;
      currentFolder = parentFolder;
    } else break;
  }
  
  return path;
}

// Get total item count for folder (recursive)
getTotalFolderItemCount(folder) {
  let count = 0;
  const currentItems = this.currentView === 'questions' ? this.questions : this.surveys;
  
  // Count direct items
  const directItems = currentItems.filter(item => {
    const matchesFolder = item.folderId === folder.id;
    const matchesLanguage = item.language === this.selectedLanguage;
    const matchesSearch = !this.searchTerm || 
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    return matchesFolder && matchesLanguage && matchesSearch;
  });
  count += directItems.length;
  
  // Count children recursively
  if (folder.children?.length > 0) {
    folder.children.forEach(child => {
      count += this.getTotalFolderItemCount(child);
    });
  }
  
  return count;
}
```

#### Selection Management
```javascript
// Toggle individual item selection
toggleQuestionSelection(questionId) {
  if (this.selectedQuestions.includes(questionId)) {
    this.selectedQuestions = this.selectedQuestions.filter(id => id !== questionId);
  } else {
    this.selectedQuestions.push(questionId);
  }
  this.updateSelectAllQuestions();
}

// Select all visible items
toggleSelectAllQuestions() {
  if (this.selectAllQuestions) {
    this.selectedQuestions = this.getFilteredQuestions().map(q => q.id);
  } else {
    this.selectedQuestions = [];
  }
}

// Update select all checkbox state
updateSelectAllQuestions() {
  const filteredQuestions = this.getFilteredQuestions();
  this.selectAllQuestions = filteredQuestions.length > 0 && 
    filteredQuestions.every(q => this.selectedQuestions.includes(q.id));
}
```

## Modal System Implementation

### Modal Structure Pattern
```html
<!-- Modal Wrapper -->
<div x-show="modalState" x-cloak
     class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
     x-transition:enter="ease-out duration-300"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100">
  
  <!-- Modal Content -->
  <div @click.away="modalState = false"
       class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
       x-transition:enter="ease-out duration-300"
       x-transition:enter-start="opacity-0 translate-y-8 scale-95"
       x-transition:enter-end="opacity-100 translate-y-0 scale-100">
    
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-6 border-b border-webropol-gray-200">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-sun-to-br from-color-100 to-color-100 rounded-full flex items-center justify-center mr-4">
          <i class="fal fa-icon text-color-600 text-lg"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-webropol-gray-900">Modal Title</h3>
          <p class="text-sm text-webropol-gray-600">Modal Description</p>
        </div>
      </div>
      <button @click="modalState = false"
              class="w-8 h-8 flex items-center justify-center text-webropol-gray-400 hover:text-webropol-gray-600 hover:bg-webropol-gray-100 rounded-lg transition-all">
        <i class="fal fa-times text-lg"></i>
      </button>
    </div>
    
    <!-- Modal Content -->
    <div class="p-6">
      <!-- Modal specific content -->
    </div>
    
    <!-- Modal Footer -->
    <div class="p-6 border-t border-webropol-gray-200 flex items-center justify-end space-x-3">
      <button @click="modalState = false"
              class="px-6 py-2.5 text-webropol-gray-700 font-medium rounded-full hover:bg-webropol-teal-200 transition-all border border-webropol-teal-700">
        Cancel
      </button>
      <button @click="confirmAction()"
              class="px-6 py-2.5 bg-webropol-teal-700 hover:bg-webropol-teal-800 text-white font-medium rounded-full transition-all">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Modal Types and Configuration

#### 1. Simple Action Modals
- Create Folder
- Add Subfolder  
- Rename Item
- Delete Confirmation
- Bulk Delete Confirmation
- Bulk Freeze Confirmation

#### 2. Complex Data Modals
- Move Item (with folder tree selection)
- Survey Details (with expandable sections)
- Question Details (with rich text editing)
- Edit Question (with form validation)

#### 3. Preview Modals
- Survey Preview (full survey rendering)
- Question Preview (question display)

#### 4. Create Content Modal
- Grid layout with multiple options
- Navigation to different creation flows

#### 5. Freeze Modal
- Complex multi-section modal
- Question selection interface
- Settings configuration

### Context Menu System

#### Context Menu Structure
```html
<div x-show="showContextMenu === itemId" 
     @click.stop
     x-transition:enter="transition ease-out duration-100"
     x-transition:enter-start="transform opacity-0 scale-95"
     x-transition:enter-end="transform opacity-100 scale-100"
     style="position: fixed; z-index: 9999;"
     class="right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-webropol-gray-200"
     @click.away="showContextMenu = null">
  <div class="py-1">
    <button @click="action1()"
            class="flex items-center w-full px-4 py-2 text-sm text-black hover:bg-webropol-gray-50 transition-colors">
      <i class="fal fa-icon mr-3 text-black"></i>
      Action Label
    </button>
    <!-- More menu items -->
  </div>
</div>
```

#### Context Menu Types
1. **Folder Context Menu**: Add Subfolder
2. **Subfolder Context Menu**: Add Subfolder, Move, Rename, Delete
3. **Question Context Menu**: Question Details, Move, Delete
4. **Survey Context Menu**: Survey Details, Rename, Move, Freeze, Delete

### Event Handling System

#### Click Events
```javascript
// Toggle context menu
toggleContextMenu(itemId, itemType) {
  if (this.showContextMenu === itemId) {
    this.showContextMenu = null;
  } else {
    this.showContextMenu = itemId;
  }
}

// Handle modal opening
openDeleteConfirmationModal(itemId, itemName, itemType = 'folder') {
  this.deleteItemId = itemId;
  this.deleteItemName = itemName;
  this.deleteItemType = itemType;
  
  if (itemType === 'folder') {
    const folder = this.findFolderById(itemId);
    this.deleteItemCount = folder ? this.getTotalFolderItemCount(folder) : 0;
  }
  
  this.showDeleteModal = true;
  this.showContextMenu = null;
}
```

#### Form Submissions
```javascript
// Create folder with validation
createFolder() {
  if (!this.newFolderName.trim()) return;
  
  const newFolder = {
    id: Date.now(),
    name: this.newFolderName.trim(),
    description: this.newFolderDescription.trim(),
    level: 0,
    parentId: null,
    children: []
  };
  
  this.folders.push(newFolder);
  this.newFolderName = '';
  this.newFolderDescription = '';
  this.showCreateFolder = false;
}
```

### Data Flow and State Updates

#### Folder Operations
```javascript
// Create subfolder
createSubfolder() {
  if (!this.newSubfolderName.trim() || !this.addSubfolderParentId) return;
  
  const parentFolder = this.findFolderById(this.addSubfolderParentId);
  if (parentFolder && parentFolder.level < 3) {
    const newSubfolder = {
      id: Date.now(),
      name: this.newSubfolderName.trim(),
      description: this.newSubfolderDescription.trim(),
      level: parentFolder.level + 1,
      parentId: this.addSubfolderParentId,
      children: []
    };
    
    parentFolder.children.push(newSubfolder);
    this.showAddSubfolderModal = false;
    // Reset form state
  }
}

// Move item between folders
confirmMove() {
  if (!this.selectedMoveLocationId || !this.moveItemId) return;
  
  if (this.moveItemType === 'question') {
    const question = this.questions.find(q => q.id === this.moveItemId);
    if (question) {
      question.folderId = this.selectedMoveLocationId;
    }
  } else if (this.moveItemType === 'survey') {
    const survey = this.surveys.find(s => s.id === this.moveItemId);
    if (survey) {
      survey.folderId = this.selectedMoveLocationId;
    }
  }
  
  // Reset modal state
  this.showMoveModal = false;
  this.moveItemId = null;
  this.moveItemName = '';
  this.selectedMoveLocation = null;
}
```

#### Bulk Operations
```javascript
// Bulk delete with confirmation
confirmBulkDelete() {
  if (this.currentView === 'questions') {
    this.questions = this.questions.filter(q => !this.selectedQuestions.includes(q.id));
    this.selectedQuestions = [];
    this.selectAllQuestions = false;
  } else {
    this.surveys = this.surveys.filter(s => !this.selectedSurveys.includes(s.id));
    this.selectedSurveys = [];
    this.selectAllSurveys = false;
  }
  this.showBulkDeleteModal = false;
}
```

## Responsive Design Implementation

### Breakpoint Strategy
- **Mobile**: < 640px - Single column, simplified interface
- **Tablet**: 640px - 1024px - Adapted layout, touch-friendly
- **Desktop**: > 1024px - Full multi-column layout

### Key Responsive Elements

#### Navigation Tabs
```html
<div :class="tabsOrientation === 'horizontal' ? 
    'flex items-center space-x-2 mb-6' : 
    'flex flex-col space-y-2 mb-6'">
  <!-- Tab content adapts to orientation -->
</div>
```

#### Content Grid
```html
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div class="lg:col-span-3"><!-- Sidebar --></div>
  <div class="lg:col-span-9"><!-- Content --></div>
</div>
```

#### Mobile Optimizations
- Stack sidebar below content on mobile
- Simplify folder tree display
- Touch-friendly tap targets (min 44px)
- Swipe gestures for modal dismissal
- Responsive table to card layout for surveys

### Accessibility Implementation

#### ARIA Labels and Roles
```html
<!-- Folder tree -->
<div role="tree" aria-label="Content folders">
  <div role="treeitem" aria-expanded="true" aria-level="1">
    <!-- Folder content -->
  </div>
</div>

<!-- Modal dialogs -->
<div role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
  <!-- Modal content -->
</div>

<!-- Buttons -->
<button aria-label="Delete selected items" 
        aria-describedby="delete-help-text">
  Delete
</button>
```

#### Keyboard Navigation
```javascript
// Handle keyboard events
handleKeydown(event) {
  switch(event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      this.handleClick(event);
      break;
    case 'Escape':
      this.closeModal();
      break;
    case 'ArrowDown':
      this.navigateDown();
      break;
    case 'ArrowUp':
      this.navigateUp();
      break;
  }
}
```

#### Focus Management
- Trap focus within modals
- Return focus to trigger element on modal close
- Visible focus indicators
- Skip links for screen readers

### Performance Optimizations

#### Virtual Scrolling for Large Lists
```javascript
// For questions/surveys lists > 100 items
const visibleItems = computed(() => {
  const start = scrollPosition / itemHeight;
  const end = start + visibleCount;
  return filteredItems.slice(start, end);
});
```

#### Debounced Search
```javascript
// Search input with debounce
let searchTimeout;
function handleSearchInput(value) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    this.performSearch(value);
  }, 300);
}
```

#### Lazy Loading
- Load folder contents on expansion
- Paginate large result sets
- Progressive image loading for previews

### Testing Strategy

#### Unit Tests
- State management functions
- Filtering and search logic
- Validation rules
- Data transformations

#### Integration Tests
- Modal workflows
- Bulk operations
- Folder management
- Search functionality

#### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Mobile device testing
- Accessibility compliance

#### Performance Tests
- Load time with 10,000+ items
- Search response time
- Modal opening/closing
- Memory usage monitoring

### Browser Support Matrix

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Chrome Mobile | 90+ | Full |
| Safari Mobile | 14+ | Full |

### Deployment Considerations

#### CDN Resources
- Tailwind CSS via CDN for rapid development
- Font Awesome icons via CDN
- Alpine.js via CDN
- Local fallbacks for production

#### Performance Monitoring
- Core Web Vitals tracking
- User interaction metrics
- Error reporting and logging
- Real user monitoring (RUM)

#### Caching Strategy
- Static assets: 1 year cache
- API responses: 5 minutes cache
- User preferences: Local storage
- Search results: Session storage

This technical implementation guide provides the detailed blueprint needed to build and maintain the Question & Survey Library page with enterprise-grade quality and performance.
