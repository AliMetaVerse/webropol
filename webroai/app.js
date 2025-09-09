// Main Application JavaScript for WebropAI
class WebropAI {
    constructor() {
        this.aiEngine = new AIEngine();
        this.currentSection = 'dashboard';
        this.surveys = this.loadMockSurveys();
        this.events = this.loadMockEvents();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAIAssistant();
        this.initializeCharts();
        this.startRealTimeUpdates();
        console.log('🚀 WebropAI Application initialized');
    }

    // Navigation System
    setupNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('.nav a, .action-card').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.navigateToSection(href.substring(1));
                }
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const section = e.state?.section || 'dashboard';
            this.navigateToSection(section, false);
        });

        // Set initial state
        history.replaceState({section: 'dashboard'}, '', '#dashboard');
    }

    navigateToSection(sectionId, pushState = true) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;

            // Update browser history
            if (pushState) {
                history.pushState({section: sectionId}, '', `#${sectionId}`);
            }

            // Load section-specific content
            this.loadSectionContent(sectionId);
        }
    }

    loadSectionContent(sectionId) {
        switch(sectionId) {
            case 'surveys':
                this.loadSurveyBuilder();
                break;
            case 'events':
                this.loadEventManager();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'admin':
                // Initialize admin section
                setTimeout(() => {
                    const firstTab = document.querySelector('.admin-tab');
                    if (firstTab && !firstTab.classList.contains('active')) {
                        firstTab.click();
                    }
                    loadAdminSection();
                }, 100);
                break;
            default:
                this.loadDashboard();
        }
    }

    // Mock Data Loaders
    loadMockSurveys() {
        return [
            {
                id: 1,
                title: "Customer Satisfaction Q1 2024",
                status: "active",
                responses: 234,
                completionRate: 0.78,
                avgRating: 4.2,
                aiInsights: ["High satisfaction with product quality", "Concerns about pricing mentioned 34 times"]
            },
            {
                id: 2,
                title: "Employee Engagement Survey",
                status: "draft",
                responses: 0,
                completionRate: 0,
                avgRating: 0,
                aiInsights: ["Ready to launch", "AI suggests optimal timing: Tuesday 10 AM"]
            }
        ];
    }

    loadMockEvents() {
        return [
            {
                id: 1,
                title: "Product Launch Webinar",
                date: "2024-03-15T14:00:00Z",
                registered: 150,
                capacity: 120,
                status: "warning",
                aiPredictions: {
                    attendance: 0.75,
                    noShowRate: 0.25,
                    engagement: 0.82
                }
            },
            {
                id: 2,
                title: "Customer Feedback Session",
                date: "2024-03-20T10:00:00Z",
                registered: 45,
                capacity: 50,
                status: "success",
                aiPredictions: {
                    attendance: 0.89,
                    noShowRate: 0.11,
                    engagement: 0.91
                }
            }
        ];
    }

    // Dashboard Functions
    loadDashboard() {
        this.updateDashboardStats();
        this.generateAIInsights();
    }

    updateDashboardStats() {
        // Simulate real-time stat updates
        const stats = {
            activeSurveys: this.surveys.filter(s => s.status === 'active').length,
            upcomingEvents: this.events.length,
            totalResponses: this.surveys.reduce((sum, s) => sum + s.responses, 0),
            aiInsights: 89
        };

        // Update dashboard with animation
        this.animateCounters(stats);
    }

    animateCounters(stats) {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach((counter, index) => {
            const values = [stats.activeSurveys, stats.upcomingEvents, stats.totalResponses, stats.aiInsights];
            const target = values[index];
            const current = parseInt(counter.textContent) || 0;
            
            this.animateNumber(counter, current, target, 1000);
        });
    }

    animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    generateAIInsights() {
        const insights = this.aiEngine.models.analytics.generateInsights();
        // Update UI with insights
        console.log('Generated AI insights:', insights);
    }

    // Survey Builder Functions
    loadSurveyBuilder() {
        this.initializeChatInterface();
        this.loadQuestionBuilder();
        this.resetSurveyBuilder();
    }

    resetSurveyBuilder() {
        // Hide builder container initially
        const builderContainer = document.getElementById('builderContainer');
        if (builderContainer) {
            builderContainer.style.display = 'none';
        }

        // Reset all selections
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.method-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.channel-card').forEach(card => {
            card.classList.remove('active');
        });

        // Clear form inputs
        const surveyTitle = document.querySelector('.survey-title');
        if (surveyTitle) surveyTitle.value = '';
        
        // Reset selected survey type
        this.selectedSurveyType = null;
        this.selectedPublishMethod = null;
        this.selectedChannels = [];
    }

    initializeChatInterface() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Clear existing messages except the first AI greeting
        const firstMessage = chatMessages.querySelector('.ai-message');
        chatMessages.innerHTML = '';
        if (firstMessage) {
            chatMessages.appendChild(firstMessage);
        }
    }

    loadQuestionBuilder() {
        const builder = document.getElementById('questionBuilder');
        if (!builder) return;

        // Initialize with one question
        this.questionCount = 1;
        this.updateQuestionNumbers();
    }

    // Event Management Functions
    loadEventManager() {
        this.renderEventCards();
        this.initializeEventPredictions();
    }

    renderEventCards() {
        // Events are already rendered in HTML, but we could make them dynamic
        this.events.forEach(event => {
            console.log(`Event: ${event.title}, Predicted attendance: ${event.aiPredictions.attendance * 100}%`);
        });
    }

    initializeEventPredictions() {
        // Initialize AI predictions for events
        this.events.forEach(event => {
            const predictions = this.aiEngine.models.events.generatePredictions({
                type: this.detectEventType(event.title),
                registered: event.registered,
                capacity: event.capacity
            });
            event.aiPredictions = {...event.aiPredictions, ...predictions};
        });
    }

    detectEventType(title) {
        if (title.toLowerCase().includes('webinar')) return 'webinar';
        if (title.toLowerCase().includes('workshop')) return 'workshop';
        if (title.toLowerCase().includes('training')) return 'training';
        return 'general';
    }

    // Analytics Functions
    loadAnalytics() {
        this.updateAnalyticsInsights();
        this.updateCharts();
    }

    updateAnalyticsInsights() {
        const insights = this.aiEngine.models.analytics.generateInsights();
        console.log('Analytics insights updated:', insights);
        
        // Update insights UI
        this.renderInsights(insights);
    }

    renderInsights(insights) {
        const insightsPanel = document.querySelector('.insights-panel');
        if (!insightsPanel) return;

        // Create insight cards dynamically
        const insightCards = insights.map(insight => this.createInsightCard(insight)).join('');
        
        // Update only the insight cards, keep the title
        const existingCards = insightsPanel.querySelectorAll('.insight-card');
        existingCards.forEach(card => card.remove());
        
        const title = insightsPanel.querySelector('h2');
        title.insertAdjacentHTML('afterend', insightCards);
    }

    createInsightCard(insight) {
        const iconClass = this.getInsightIcon(insight.type);
        const priorityClass = this.getPriorityClass(insight.priority);
        
        return `
            <div class="insight-card">
                <div class="insight-header">
                    <i class="fal ${iconClass} ${priorityClass}"></i>
                    <h3>${insight.title}</h3>
                </div>
                <p>${insight.description}</p>
                ${insight.actionable ? '<button class="btn-primary">Take Action</button>' : ''}
            </div>
        `;
    }

    getInsightIcon(type) {
        const icons = {
            'positive_trend': 'fa-trending-up',
            'negative_trend': 'fa-trending-down',
            'nps_anomaly': 'fa-exclamation-circle',
            'response_anomaly': 'fa-chart-line',
            'timing_optimization': 'fa-clock',
            'content_optimization': 'fa-edit'
        };
        return icons[type] || 'fa-lightbulb';
    }

    getPriorityClass(priority) {
        const classes = {
            'high': 'text-danger',
            'medium': 'text-warning',
            'low': 'text-info'
        };
        return classes[priority] || 'text-info';
    }

    // Chart Initialization
    initializeCharts() {
        this.initSentimentChart();
        this.initResponseChart();
    }

    initSentimentChart() {
        const ctx = document.getElementById('sentimentChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Positive Sentiment',
                    data: [65, 72, 68, 78],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Negative Sentiment',
                    data: [20, 15, 22, 12],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sentiment Trends'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    initResponseChart() {
        const ctx = document.getElementById('responseChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Email', 'SMS', 'Social', 'In-App'],
                datasets: [{
                    label: 'Response Rate %',
                    data: [68, 45, 12, 78],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)',
                        'rgba(40, 167, 69, 1)',
                        'rgba(255, 193, 7, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Response Rates by Channel'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    updateCharts() {
        // Update charts with new data
        // This would typically fetch real data and update the chart instances
        console.log('Charts updated with latest data');
    }

    // AI Assistant Functions
    setupAIAssistant() {
        const aiButton = document.querySelector('.nav .ai-button');
        const aiPanel = document.getElementById('aiAssistant');
        const overlay = document.getElementById('overlay');

        if (aiButton) {
            aiButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAIAssistant();
            });
        }

        // Close on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.toggleAIAssistant();
            });
        }
    }

    // Real-time Updates
    startRealTimeUpdates() {
        // Update dashboard stats every 30 seconds
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.updateDashboardStats();
            }
        }, 30000);

        // Update insights every 2 minutes
        setInterval(() => {
            this.generateAIInsights();
        }, 120000);
    }
}

// Global Functions for HTML Event Handlers
function openSurveyBuilder() {
    window.app.navigateToSection('surveys');
}

function openEventPlanner() {
    window.app.navigateToSection('events');
}

function openAnalytics() {
    window.app.navigateToSection('analytics');
}

function openOptimizer() {
    // Future functionality for campaign optimizer
    alert('Campaign Optimizer coming soon! 🚀');
}

function toggleAIAssistant() {
    const panel = document.getElementById('aiAssistant');
    const overlay = document.getElementById('overlay');
    
    if (panel && overlay) {
        panel.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatMessages) {
        // Add user message
        const userMessage = createChatMessage(message, 'user');
        chatMessages.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Process with AI and respond
        setTimeout(() => {
            const aiResponse = window.app.aiEngine.processNaturalLanguage(message);
            const response = generateAIResponse(aiResponse);
            const aiMessage = createChatMessage(response, 'ai');
            chatMessages.appendChild(aiMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

function createChatMessage(content, sender) {
    const message = document.createElement('div');
    message.className = `message ${sender}-message`;
    
    const icon = document.createElement('i');
    icon.className = sender === 'ai' ? 'fal fa-robot' : 'fal fa-user';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${content}</p>`;
    
    if (sender === 'user') {
        message.appendChild(messageContent);
        message.appendChild(icon);
    } else {
        message.appendChild(icon);
        message.appendChild(messageContent);
    }
    
    return message;
}

function generateAIResponse(aiProcessing) {
    const responses = {
        'create_survey': 'Great! I can help you create a survey. Based on your description, I recommend starting with customer satisfaction questions. Would you like me to generate some questions for you?',
        'measure_satisfaction': 'For measuring satisfaction, I suggest using a combination of NPS, CSAT, and open-ended questions. Let me create a template for you.',
        'get_feedback': 'I recommend a structured feedback approach. Would you like questions focused on a specific product, service, or general experience?',
        'analyze_data': 'I can analyze your current data and provide insights. I see patterns in sentiment and response rates that might interest you.',
        'optimize': 'I can help optimize your surveys and events. Based on your data, I have several recommendations for improving response rates.'
    };
    
    return responses[aiProcessing.intent] || 'I understand you want to improve your surveys and events. Could you be more specific about what you\'d like help with?';
}

function suggestTitle() {
    const titleInput = document.querySelector('.survey-title');
    if (titleInput) {
        const suggestions = [
            'Customer Experience Survey 2024',
            'Product Feedback Collection',
            'Employee Satisfaction Survey',
            'Service Quality Assessment',
            'Brand Perception Study'
        ];
        
        const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
        titleInput.value = randomTitle;
        
        // Add visual feedback
        titleInput.style.background = 'linear-gradient(135deg, #e3f2fd, #f3e5f5)';
        setTimeout(() => {
            titleInput.style.background = '';
        }, 2000);
    }
}

function suggestQuestion(questionNumber) {
    const questionInput = document.querySelector('.question-input');
    if (questionInput) {
        const suggestions = [
            'How satisfied are you with our product/service?',
            'How likely are you to recommend us to others?',
            'What is the main reason for your rating?',
            'How can we improve your experience?',
            'Which features do you value most?'
        ];
        
        const randomQuestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        questionInput.value = randomQuestion;
        
        // Add visual feedback
        questionInput.style.borderColor = '#667eea';
        setTimeout(() => {
            questionInput.style.borderColor = '';
        }, 2000);
    }
}

function deleteQuestion(questionNumber) {
    if (confirm('Are you sure you want to delete this question?')) {
        // In a real app, this would remove the question from the data structure
        alert(`Question ${questionNumber} deleted`);
    }
}

// Survey Type Selection Functions
function selectSurveyType(type) {
    // Remove previous selection
    document.querySelectorAll('.type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-type="${type}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Store selected type
    window.app.selectedSurveyType = type;
    
    // Show builder container
    const builderContainer = document.getElementById('builderContainer');
    if (builderContainer) {
        builderContainer.style.display = 'flex';
        builderContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update survey type info and AI assistant
    updateSurveyTypeInfo(type);
    generateSurveyFromType(type);
}

function updateSurveyTypeInfo(type) {
    const surveyTypeInfo = document.getElementById('surveyTypeInfo');
    if (!surveyTypeInfo) return;
    
    const typeInfo = {
        'etest': {
            title: 'eTest - Assessment & Quiz Builder',
            description: 'Create educational assessments, skill tests, and knowledge evaluations with AI-powered question generation.',
            questions: ['Multiple Choice Questions', 'True/False', 'Essay Questions', 'Scoring & Grading'],
            aiTips: 'AI suggests adaptive testing and personalized question difficulty.'
        },
        '360': {
            title: '360° Feedback Survey',
            description: 'Comprehensive multi-source feedback collection from peers, supervisors, and subordinates.',
            questions: ['Self-Assessment', 'Peer Evaluation', 'Supervisor Review', 'Development Goals'],
            aiTips: 'AI recommends anonymous feedback and competency-based questions.'
        },
        'sms-survey': {
            title: 'SMS Survey',
            description: 'Mobile-first surveys optimized for SMS distribution with high engagement rates.',
            questions: ['Short Questions', 'Rating Scales', 'Yes/No Questions', 'Quick Feedback'],
            aiTips: 'AI optimizes for mobile screens and suggests concise wording.'
        },
        'cx-survey': {
            title: 'Customer Experience Survey',
            description: 'Measure and optimize customer experience across all touchpoints and interactions.',
            questions: ['NPS Score', 'Journey Mapping', 'Touchpoint Rating', 'Improvement Areas'],
            aiTips: 'AI suggests journey-based questions and real-time feedback collection.'
        },
        'feedback-table': {
            title: 'Feedback Table',
            description: 'Structured feedback collection using data tables for systematic evaluation and comparison.',
            questions: ['Structured Data', 'Comparison Tables', 'Rating Matrices', 'Categorized Feedback'],
            aiTips: 'AI recommends optimal table structures and data validation.'
        },
        'custom': {
            title: 'Custom Survey',
            description: 'Build a survey from scratch with AI assistance based on your specific needs.',
            questions: ['Custom Questions', 'Flexible Format', 'Tailored Logic', 'Personalized Design'],
            aiTips: 'AI will help you design questions based on your objectives.'
        }
    };
    
    const info = typeInfo[type];
    if (info) {
        surveyTypeInfo.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.description}</p>
            <div class="ai-tip">
                <i class="fal fa-lightbulb"></i>
                <span>${info.aiTips}</span>
            </div>
        `;
    }
}

function generateSurveyFromType(type) {
    // Use AI engine to generate survey based on type
    const aiSurvey = window.app.aiEngine.models.survey.generateSurvey(`Create a ${type.replace('-', ' ')} survey`);
    
    // Update survey title
    const titleInput = document.querySelector('.survey-title');
    if (titleInput && aiSurvey.title) {
        titleInput.value = aiSurvey.title;
    }
    
    // Generate questions based on type
    setTimeout(() => {
        populateAIQuestions(aiSurvey.questions || []);
        showAIRecommendations(type);
    }, 500);
}

function populateAIQuestions(questions) {
    const questionBuilder = document.getElementById('questionBuilder');
    if (!questionBuilder || questions.length === 0) return;
    
    // Clear existing questions
    questionBuilder.innerHTML = '';
    
    // Add AI-generated questions
    questions.forEach((question, index) => {
        const questionHTML = createQuestionHTML(question, index + 1);
        questionBuilder.insertAdjacentHTML('beforeend', questionHTML);
    });
}

function createQuestionHTML(question, number) {
    return `
        <div class="question-item">
            <div class="question-header">
                <span>Question ${number}</span>
                <div class="question-actions">
                    <button class="ai-suggest-btn" onclick="suggestQuestion(${number})">
                        <i class="fal fa-lightbulb"></i> AI Suggest
                    </button>
                    <button class="btn-icon" onclick="deleteQuestion(${number})">
                        <i class="fal fa-trash"></i>
                    </button>
                </div>
            </div>
            <textarea placeholder="Enter your question here..." class="question-input">${question.text || ''}</textarea>
            <select class="question-type">
                <option value="text" ${question.type === 'text' ? 'selected' : ''}>Text</option>
                <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                <option value="rating" ${question.type === 'rating' ? 'selected' : ''}>Rating Scale</option>
                <option value="yes-no" ${question.type === 'yes-no' ? 'selected' : ''}>Yes/No</option>
                <option value="nps" ${question.type === 'nps' ? 'selected' : ''}>NPS</option>
            </select>
        </div>
    `;
}

function showAIRecommendations(type) {
    const recommendationsList = document.querySelector('.recommendation-list');
    if (!recommendationsList) return;
    
    const recommendations = {
        'etest': [
            'Include a mix of question types for comprehensive assessment',
            'Set appropriate time limits for each section',
            'Use adaptive difficulty based on previous answers',
            'Implement automatic grading and feedback'
        ],
        '360': [
            'Ensure complete anonymity for honest feedback',
            'Include competency-based evaluation criteria',
            'Allow self-assessment for comparison',
            'Schedule follow-up development discussions'
        ],
        'sms-survey': [
            'Keep questions under 160 characters when possible',
            'Use simple rating scales (1-5 or 1-10)',
            'Include opt-out instructions for compliance',
            'Send during optimal hours (10 AM - 6 PM)'
        ],
        'cx-survey': [
            'Map questions to customer journey stages',
            'Include emotion-based questions',
            'Use real-time triggers for timely feedback',
            'Focus on actionable improvement areas'
        ],
        'feedback-table': [
            'Structure data in logical categories',
            'Use consistent rating scales across tables',
            'Include validation rules for data quality',
            'Allow bulk editing for efficiency'
        ],
        'custom': [
            'Define clear objectives first',
            'Consider your target audience',
            'Plan question flow logically',
            'Test survey before launch'
        ]
    };
    
    const typeRecommendations = recommendations[type] || recommendations['custom'];
    const recommendationsHTML = typeRecommendations.map(rec => 
        `<div class="recommendation-item">
            <i class="fal fa-check-circle"></i>
            <span>${rec}</span>
        </div>`
    ).join('');
    
    recommendationsList.innerHTML = recommendationsHTML;
}

// Publishing Method Functions
function selectPublishMethod(method) {
    // Remove previous selection
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-method="${method}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Store selected method
    window.app.selectedPublishMethod = method;
    
    // Show/hide schedule options
    const scheduleOptions = document.getElementById('scheduleOptions');
    if (scheduleOptions) {
        scheduleOptions.style.display = method === 'scheduled' ? 'block' : 'none';
    }
    
    // Set default date/time if scheduled
    if (method === 'scheduled') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const publishDate = document.getElementById('publishDate');
        if (publishDate) {
            publishDate.value = tomorrow.toISOString().split('T')[0];
        }
    }
}

// Distribution Channel Functions
function toggleDistributionChannel(channel) {
    const channelCard = document.querySelector(`[data-channel="${channel}"]`);
    const toggle = document.getElementById(`${channel}-toggle`);
    
    if (channelCard && toggle) {
        const isActive = toggle.checked;
        
        if (isActive) {
            channelCard.classList.remove('active');
            toggle.checked = false;
            // Remove from selected channels
            window.app.selectedChannels = window.app.selectedChannels.filter(c => c !== channel);
        } else {
            channelCard.classList.add('active');
            toggle.checked = true;
            // Add to selected channels
            if (!window.app.selectedChannels) window.app.selectedChannels = [];
            window.app.selectedChannels.push(channel);
        }
        
        updateDistributionSummary();
    }
}

function updateDistributionSummary() {
    // Update UI to show selected channels summary
    const selectedCount = window.app.selectedChannels ? window.app.selectedChannels.length : 0;
    console.log(`${selectedCount} distribution channels selected:`, window.app.selectedChannels);
}

// AI Optimization Functions
function applyOptimization(type) {
    switch(type) {
        case 'timing':
            // Apply optimal timing
            const publishTime = document.getElementById('publishTime');
            if (publishTime) publishTime.value = '10:00';
            
            // Set to next Tuesday
            const nextTuesday = getNextTuesday();
            const publishDate = document.getElementById('publishDate');
            if (publishDate) publishDate.value = nextTuesday.toISOString().split('T')[0];
            
            alert('🤖 AI Optimization Applied: Survey scheduled for Tuesday at 10:00 AM');
            break;
            
        case 'segmentation':
            const targetAudience = document.getElementById('targetAudience');
            if (targetAudience) targetAudience.value = 'custom';
            alert('🤖 AI Optimization Applied: Custom segmentation enabled');
            break;
            
        case 'personalization':
            alert('🤖 AI Optimization Applied: Personalized messaging templates activated');
            break;
    }
}

function getNextTuesday() {
    const today = new Date();
    const daysUntilTuesday = (2 - today.getDay() + 7) % 7; // 2 = Tuesday
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + (daysUntilTuesday === 0 ? 7 : daysUntilTuesday));
    return nextTuesday;
}

// Survey Launch Functions
function launchSurvey() {
    // Validate survey
    if (!window.app.selectedSurveyType) {
        alert('Please select a survey type first!');
        return;
    }
    
    if (!window.app.selectedPublishMethod) {
        alert('Please select a publishing method!');
        return;
    }
    
    if (!window.app.selectedChannels || window.app.selectedChannels.length === 0) {
        alert('Please select at least one distribution channel!');
        return;
    }
    
    const surveyTitle = document.querySelector('.survey-title').value;
    if (!surveyTitle.trim()) {
        alert('Please enter a survey title!');
        return;
    }
    
    // Show launch confirmation
    const channelNames = window.app.selectedChannels.join(', ');
    const publishMethod = window.app.selectedPublishMethod;
    
    const confirmMessage = `
        🚀 Ready to Launch Survey!
        
        Title: ${surveyTitle}
        Type: ${window.app.selectedSurveyType}
        Publishing: ${publishMethod}
        Channels: ${channelNames}
        
        Launch now?
    `;
    
    if (confirm(confirmMessage)) {
        // Simulate launch process
        showLaunchProgress();
    }
}

function showLaunchProgress() {
    // Create and show progress modal
    const progressHTML = `
        <div class="launch-progress-modal">
            <div class="progress-content">
                <h3><i class="fal fa-rocket"></i> Launching Survey</h3>
                <div class="progress-steps">
                    <div class="step active">
                        <i class="fal fa-check"></i>
                        <span>Survey validated</span>
                    </div>
                    <div class="step active">
                        <i class="fal fa-check"></i>
                        <span>Distribution channels configured</span>
                    </div>
                    <div class="step loading">
                        <i class="fal fa-spinner fa-spin"></i>
                        <span>Publishing survey...</span>
                    </div>
                    <div class="step">
                        <i class="fal fa-clock"></i>
                        <span>Sending invitations</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', progressHTML);
    
    // Simulate launch steps
    setTimeout(() => {
        const steps = document.querySelectorAll('.step');
        steps[2].classList.remove('loading');
        steps[2].classList.add('active');
        steps[2].innerHTML = '<i class="fal fa-check"></i><span>Survey published successfully!</span>';
        
        steps[3].classList.add('loading');
        steps[3].innerHTML = '<i class="fal fa-spinner fa-spin"></i><span>Sending invitations...</span>';
        
        setTimeout(() => {
            steps[3].classList.remove('loading');
            steps[3].classList.add('active');
            steps[3].innerHTML = '<i class="fal fa-check"></i><span>Invitations sent!</span>';
            
            setTimeout(() => {
                document.querySelector('.launch-progress-modal').remove();
                showLaunchSuccess();
            }, 1000);
        }, 2000);
    }, 2000);
}

function showLaunchSuccess() {
    alert(`
        🎉 Survey Launched Successfully!
        
        Your survey is now live and invitations have been sent via your selected channels.
        
        You can track responses in the Analytics dashboard.
    `);
    
    // Reset the builder for next survey
    window.app.resetSurveyBuilder();
}

function previewSurvey() {
    alert('🔍 Survey preview will open in a new window (feature coming soon!)');
}

function testSurvey() {
    alert('🧪 Test mode activated! You can now test your survey with sample responses.');
}

function addQuestion() {
    const questionBuilder = document.getElementById('questionBuilder');
    if (questionBuilder) {
        const questionCount = questionBuilder.children.length + 1;
        
        const questionHTML = createQuestionHTML({
            text: '',
            type: 'text'
        }, questionCount);
        
        questionBuilder.insertAdjacentHTML('beforeend', questionHTML);
    }
}

// Admin Panel Functions
function switchAdminTab(tabName) {
    // Remove active class from all tabs and update ARIA
    document.querySelectorAll('.webropol-unified-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    // Hide all admin content
    document.querySelectorAll('.admin-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`admin-${tabName}`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Add active class to clicked tab and update ARIA
    event.target.classList.add('active');
    event.target.setAttribute('aria-selected', 'true');
}

function openAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset form
    const form = document.getElementById('addUserForm');
    if (form) {
        form.reset();
    }
}

function addUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const environment = document.getElementById('environment').value;
    const sendInvite = document.getElementById('sendInvite').checked;
    
    if (!firstName || !lastName || !email || !role || !environment) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Create new user object
    const newUser = {
        firstName,
        lastName,
        email,
        role,
        environment,
        status: 'pending',
        lastActive: 'Never',
        surveysCreated: 0,
        sendInvite
    };
    
    // Add user to table (in real app, this would be an API call)
    addUserToTable(newUser);
    
    // Show success message
    alert(`✅ User ${firstName} ${lastName} has been added successfully!${sendInvite ? ' An invitation email has been sent.' : ''}`);
    
    // Close modal
    closeAddUserModal();
}

function addUserToTable(user) {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    const userRow = document.createElement('tr');
    userRow.innerHTML = `
        <td>
            <div class="user-info">
                <img src="https://via.placeholder.com/40" alt="User Avatar" class="user-avatar" />
                <div class="user-details">
                    <strong>${user.firstName} ${user.lastName}</strong>
                    <span>${user.email}</span>
                </div>
            </div>
        </td>
        <td><span class="role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
        <td><span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
        <td>${user.lastActive}</td>
        <td>${user.surveysCreated}</td>
        <td>${user.environment.charAt(0).toUpperCase() + user.environment.slice(1)}</td>
        <td>
            <div class="action-buttons">
                <button class="action-btn edit" onclick="editUser('${user.email}')">
                    <i class="fal fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteUser('${user.email}')">
                    <i class="fal fa-trash"></i>
                </button>
                <button class="action-btn more" onclick="showUserMenu('${user.email}')">
                    <i class="fal fa-ellipsis-v"></i>
                </button>
            </div>
        </td>
    `;
    
    tableBody.appendChild(userRow);
}

function editUser(userEmail) {
    alert(`Edit user functionality for ${userEmail} would open here`);
    // In real app, this would open an edit modal with user details
}

function deleteUser(userEmail) {
    if (confirm(`Are you sure you want to delete the user: ${userEmail}?`)) {
        alert(`User ${userEmail} has been deleted`);
        // In real app, this would make an API call to delete the user
        // and remove the row from the table
    }
}

function showUserMenu(userEmail) {
    alert(`User menu for ${userEmail}:\n- View Details\n- Reset Password\n- Change Role\n- Deactivate Account`);
    // In real app, this would show a dropdown menu with user actions
}

function applyUserFilters() {
    const roleFilter = document.getElementById('userRoleFilter').value;
    const statusFilter = document.getElementById('userStatusFilter').value;
    const searchQuery = document.getElementById('userSearch').value.toLowerCase();
    
    console.log(`Applying filters: Role=${roleFilter}, Status=${statusFilter}, Search="${searchQuery}"`);
    // In real app, this would filter the users table based on the selected criteria
    alert(`Filters applied: Role=${roleFilter}, Status=${statusFilter}, Search="${searchQuery}"`);
}

function openAddEnvironmentModal() {
    alert('Add Environment modal would open here with fields for:\n- Environment Name\n- URL\n- Configuration\n- Resource Limits');
}

function manageEnvironment(envName) {
    alert(`Environment management for ${envName}:\n- View Logs\n- Update Configuration\n- Scale Resources\n- Deploy Updates\n- Backup Data`);
}

// Initialize admin charts when admin section is loaded
function initAdminAnalytics() {
    // Survey Trends Chart
    const trendsCtx = document.getElementById('surveyTrendsChart');
    if (trendsCtx) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Surveys Created',
                    data: [45, 52, 38, 61, 58, 73],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // User Activity Chart
    const activityCtx = document.getElementById('userActivityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active Users', 'Inactive Users', 'Pending'],
                datasets: [{
                    data: [189, 50, 8],
                    backgroundColor: [
                        '#28a745',
                        '#dc3545',
                        '#ffc107'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Load admin analytics when admin section becomes active
function loadAdminSection() {
    setTimeout(() => {
        initAdminAnalytics();
    }, 100);
}

function generateEventPlan() {
    const description = document.getElementById('eventDescription');
    if (!description || !description.value.trim()) {
        alert('Please describe your event first!');
        return;
    }
    
    const eventPlan = window.app.aiEngine.models.events.generateEventPlan(description.value);
    const predictionsDiv = document.getElementById('eventPredictions');
    
    if (predictionsDiv) {
        predictionsDiv.innerHTML = `
            <div class="event-predictions">
                <h3><i class="fal fa-magnifying-glass-chart"></i> AI Event Plan</h3>
                <div class="prediction-item">
                    <strong>Event Type:</strong> ${eventPlan.eventType}
                </div>
                <div class="prediction-item">
                    <strong>Recommendations:</strong>
                    <ul>
                        ${eventPlan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="prediction-item">
                    <strong>AI Predictions:</strong>
                    <ul>
                        <li>Expected No-show Rate: ${Math.round(eventPlan.predictions.expectedNoShowRate * 100)}%</li>
                        <li>Recommended Overbooking: ${eventPlan.predictions.overbookingSuggestion}%</li>
                        <li>Engagement Score: ${Math.round(eventPlan.predictions.engagementScore * 100)}%</li>
                    </ul>
                </div>
            </div>
        `;
        
        predictionsDiv.style.display = 'block';
    }
}

// AI Assistant Panel Functions
function aiSuggestSurvey() {
    alert('🤖 AI suggests: Create a customer satisfaction survey with NPS, CSAT, and open feedback questions for maximum insights!');
}

function aiAnalyzeData() {
    alert('🤖 AI Analysis: Your response rates are 15% above average, but completion drops at question 6. Consider shortening your surveys.');
}

function aiOptimizeDistribution() {
    alert('🤖 AI Optimization: Send surveys on Tuesday at 10 AM for 23% higher response rates. Use email for your primary audience.');
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WebropAI();
});

// Handle Enter key in chat input
document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendAIMessage();
            }
        });
    }
});

// Smooth scrolling for all anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export for global access
window.WebropAI = WebropAI;
