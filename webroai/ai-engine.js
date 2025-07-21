// AI Engine - Core AI functionality for WebropAI
class AIEngine {
    constructor() {
        this.models = {
            survey: new SurveyAI(),
            events: new EventAI(),
            analytics: new AnalyticsAI(),
            distribution: new DistributionAI()
        };
        this.init();
    }

    init() {
        console.log('🧠 WebropAI Engine initialized');
        this.loadUserPreferences();
        this.startBackgroundProcessing();
    }

    loadUserPreferences() {
        // Load user preferences and AI learning data
        this.userProfile = {
            industry: 'technology',
            surveyTypes: ['customer satisfaction', 'employee feedback'],
            responsePatterns: {},
            aiPreferences: {
                suggestionLevel: 'high',
                autoOptimize: true
            }
        };
    }

    startBackgroundProcessing() {
        // Background AI processing for insights and optimizations
        setInterval(() => {
            this.processBackgroundInsights();
        }, 30000); // Every 30 seconds
    }

    processBackgroundInsights() {
        // Simulate AI processing for insights
        this.models.analytics.generateInsights();
    }

    // Natural Language Processing
    processNaturalLanguage(input, context = 'general') {
        const processed = {
            intent: this.detectIntent(input),
            entities: this.extractEntities(input),
            sentiment: this.analyzeSentiment(input),
            confidence: Math.random() * 0.3 + 0.7 // Simulate confidence
        };
        
        return processed;
    }

    detectIntent(input) {
        const intents = {
            'create_survey': ['create', 'build', 'make', 'survey', 'questionnaire'],
            'measure_satisfaction': ['satisfaction', 'happy', 'pleased', 'content'],
            'get_feedback': ['feedback', 'opinion', 'thoughts', 'input'],
            'analyze_data': ['analyze', 'insights', 'patterns', 'trends'],
            'optimize': ['optimize', 'improve', 'better', 'enhance']
        };

        const inputLower = input.toLowerCase();
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => inputLower.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }

    extractEntities(input) {
        const entities = {
            topics: [],
            metrics: [],
            timeframes: [],
            departments: []
        };

        // Simple entity extraction (in real implementation, use NER models)
        const topicPatterns = ['customer', 'employee', 'product', 'service', 'brand'];
        const metricPatterns = ['nps', 'csat', 'ces', 'satisfaction', 'loyalty'];
        
        topicPatterns.forEach(topic => {
            if (input.toLowerCase().includes(topic)) {
                entities.topics.push(topic);
            }
        });

        metricPatterns.forEach(metric => {
            if (input.toLowerCase().includes(metric)) {
                entities.metrics.push(metric);
            }
        });

        return entities;
    }

    analyzeSentiment(input) {
        // Simple sentiment analysis (in production, use proper sentiment models)
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'satisfied'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated'];
        
        const inputLower = input.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (inputLower.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (inputLower.includes(word)) score -= 1;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }
}

// Survey AI Model
class SurveyAI {
    constructor() {
        this.questionTemplates = this.loadQuestionTemplates();
        this.logicPatterns = this.loadLogicPatterns();
    }

    loadQuestionTemplates() {
        return {
            'customer_satisfaction': [
                "How satisfied are you with our {product/service}?",
                "How likely are you to recommend us to a friend or colleague?",
                "What is the main reason for your score?",
                "How can we improve your experience?"
            ],
            'employee_feedback': [
                "How satisfied are you with your current role?",
                "Do you feel valued by your manager?",
                "What would improve your work experience?",
                "How likely are you to recommend this company as a place to work?"
            ],
            'product_feedback': [
                "How easy was it to use our {product}?",
                "Which features do you use most often?",
                "What features are missing that you would like to see?",
                "How does our {product} compare to alternatives?"
            ],
            'event_feedback': [
                "How would you rate the overall event?",
                "What was the most valuable part of the event?",
                "How likely are you to attend future events?",
                "What improvements would you suggest?"
            ]
        };
    }

    loadLogicPatterns() {
        return {
            'nps_followup': {
                condition: 'score <= 6',
                action: 'show_improvement_question'
            },
            'satisfaction_deep_dive': {
                condition: 'rating < 4',
                action: 'show_detailed_feedback'
            }
        };
    }

    generateSurvey(userInput) {
        const nlp = new AIEngine().processNaturalLanguage(userInput);
        const surveyType = this.detectSurveyType(nlp);
        
        return {
            title: this.generateTitle(surveyType, nlp),
            questions: this.generateQuestions(surveyType, nlp),
            logic: this.generateLogic(surveyType),
            design: this.suggestDesign(surveyType),
            distribution: this.suggestDistribution(nlp)
        };
    }

    detectSurveyType(nlp) {
        const { intent, entities } = nlp;
        
        if (entities.topics.includes('customer') && intent === 'measure_satisfaction') {
            return 'customer_satisfaction';
        }
        if (entities.topics.includes('employee')) {
            return 'employee_feedback';
        }
        if (entities.topics.includes('product')) {
            return 'product_feedback';
        }
        
        return 'general';
    }

    generateTitle(surveyType, nlp) {
        const titles = {
            'customer_satisfaction': 'Customer Satisfaction Survey',
            'employee_feedback': 'Employee Experience Survey',
            'product_feedback': 'Product Feedback Survey',
            'general': 'Feedback Survey'
        };
        
        return titles[surveyType] || 'AI-Generated Survey';
    }

    generateQuestions(surveyType, nlp) {
        const templates = this.questionTemplates[surveyType] || this.questionTemplates['general'] || [];
        
        return templates.map((template, index) => ({
            id: `q${index + 1}`,
            text: template,
            type: this.suggestQuestionType(template),
            required: index < 2, // First two questions required
            aiGenerated: true
        }));
    }

    suggestQuestionType(questionText) {
        if (questionText.includes('likely') || questionText.includes('recommend')) {
            return 'nps';
        }
        if (questionText.includes('satisfied') || questionText.includes('rate')) {
            return 'rating';
        }
        if (questionText.includes('what') || questionText.includes('how can')) {
            return 'text';
        }
        return 'multiple-choice';
    }

    generateLogic(surveyType) {
        return this.logicPatterns[surveyType] || {};
    }

    suggestDesign(surveyType) {
        return {
            theme: 'professional',
            colors: ['#667eea', '#764ba2'],
            layout: 'single-page',
            aiRecommendation: 'Based on survey type, this design will maximize completion rates'
        };
    }

    suggestDistribution(nlp) {
        const { entities } = nlp;
        
        if (entities.topics.includes('employee')) {
            return {
                channels: ['email', 'intranet'],
                timing: 'Tuesday 10 AM',
                reminder: '3 days after'
            };
        }
        
        return {
            channels: ['email', 'social'],
            timing: 'Wednesday 2 PM',
            reminder: '5 days after'
        };
    }
}

// Event AI Model
class EventAI {
    constructor() {
        this.eventPatterns = this.loadEventPatterns();
        this.predictionModels = this.initPredictionModels();
    }

    loadEventPatterns() {
        return {
            'webinar': {
                avgNoShowRate: 0.25,
                peakRegistrationTime: '2-3 days before',
                optimalDuration: '45-60 minutes'
            },
            'workshop': {
                avgNoShowRate: 0.15,
                peakRegistrationTime: '1 week before',
                optimalDuration: '2-3 hours'
            },
            'conference': {
                avgNoShowRate: 0.20,
                peakRegistrationTime: '2 weeks before',
                optimalDuration: '1-2 days'
            }
        };
    }

    initPredictionModels() {
        return {
            attendancePredictor: new AttendancePredictionModel(),
            overbookingOptimizer: new OverbookingModel(),
            engagementPredictor: new EngagementModel()
        };
    }

    generateEventPlan(description) {
        const analysis = this.analyzeEventDescription(description);
        const predictions = this.generatePredictions(analysis);
        
        return {
            eventType: analysis.type,
            recommendations: this.generateRecommendations(analysis),
            predictions: predictions,
            optimization: this.optimizeEvent(analysis),
            followUp: this.generateFollowUpSurvey(analysis)
        };
    }

    analyzeEventDescription(description) {
        const eventTypes = ['webinar', 'workshop', 'conference', 'training', 'meeting'];
        const detected = eventTypes.find(type => 
            description.toLowerCase().includes(type)
        ) || 'general';
        
        return {
            type: detected,
            topic: this.extractTopic(description),
            targetAudience: this.extractAudience(description),
            complexity: this.estimateComplexity(description)
        };
    }

    extractTopic(description) {
        // Simple topic extraction
        const topics = ['product', 'sales', 'training', 'marketing', 'technical'];
        return topics.find(topic => description.toLowerCase().includes(topic)) || 'general';
    }

    extractAudience(description) {
        const audiences = ['customer', 'employee', 'partner', 'public'];
        return audiences.find(audience => description.toLowerCase().includes(audience)) || 'general';
    }

    estimateComplexity(description) {
        const complexWords = ['advanced', 'technical', 'detailed', 'comprehensive'];
        const simpleWords = ['basic', 'introduction', 'overview', 'simple'];
        
        const hasComplex = complexWords.some(word => description.toLowerCase().includes(word));
        const hasSimple = simpleWords.some(word => description.toLowerCase().includes(word));
        
        if (hasComplex) return 'high';
        if (hasSimple) return 'low';
        return 'medium';
    }

    generatePredictions(analysis) {
        const pattern = this.eventPatterns[analysis.type] || this.eventPatterns['webinar'];
        
        return {
            expectedNoShowRate: pattern.avgNoShowRate,
            overbookingSuggestion: Math.round(pattern.avgNoShowRate * 100),
            optimalCapacity: this.calculateOptimalCapacity(analysis),
            engagementScore: this.predictEngagement(analysis)
        };
    }

    calculateOptimalCapacity(analysis) {
        const baseCapacity = {
            'webinar': 100,
            'workshop': 30,
            'conference': 200,
            'training': 25
        };
        
        return baseCapacity[analysis.type] || 50;
    }

    predictEngagement(analysis) {
        let score = 0.7; // Base score
        
        if (analysis.complexity === 'low') score += 0.1;
        if (analysis.targetAudience === 'employee') score += 0.1;
        if (analysis.topic === 'product') score += 0.05;
        
        return Math.min(score, 0.95);
    }

    generateRecommendations(analysis) {
        return [
            `Based on the ${analysis.type} type, consider a ${this.eventPatterns[analysis.type]?.optimalDuration || '1 hour'} duration`,
            `Target audience: ${analysis.targetAudience} - optimize communications accordingly`,
            `Send reminders ${this.eventPatterns[analysis.type]?.peakRegistrationTime || '2 days before'} for best results`,
            `AI suggests interactive elements to boost engagement for ${analysis.complexity} complexity content`
        ];
    }

    optimizeEvent(analysis) {
        return {
            timing: this.suggestOptimalTiming(analysis),
            communication: this.optimizeCommunication(analysis),
            format: this.suggestFormat(analysis)
        };
    }

    suggestOptimalTiming(analysis) {
        const timings = {
            'webinar': 'Tuesday or Wednesday, 2-4 PM',
            'workshop': 'Wednesday or Thursday, 9 AM - 12 PM',
            'training': 'Tuesday or Wednesday, 10 AM - 3 PM'
        };
        
        return timings[analysis.type] || 'Wednesday, 2 PM';
    }

    optimizeCommunication(analysis) {
        return {
            initialInvite: `Send 2 weeks before for ${analysis.type}`,
            reminder1: 'Send 1 week before with agenda',
            reminder2: 'Send 24 hours before with login details',
            followUp: 'Send feedback survey within 2 hours after event'
        };
    }

    suggestFormat(analysis) {
        const formats = {
            'webinar': 'Live presentation with Q&A',
            'workshop': 'Interactive sessions with breakouts',
            'training': 'Hands-on learning with exercises'
        };
        
        return formats[analysis.type] || 'Interactive presentation';
    }

    generateFollowUpSurvey(analysis) {
        return {
            questions: [
                "How would you rate the overall event?",
                "What was the most valuable part?",
                "How likely are you to attend future events?",
                "What improvements would you suggest?"
            ],
            timing: 'Send within 2 hours after event ends',
            aiOptimization: true
        };
    }
}

// Analytics AI Model
class AnalyticsAI {
    constructor() {
        this.anomalyThresholds = this.setAnomalyThresholds();
        this.insightPatterns = this.loadInsightPatterns();
        this.currentInsights = [];
    }

    setAnomalyThresholds() {
        return {
            responseRateDropPercent: 15,
            sentimentChangePoints: 10,
            npsChangePoints: 12,
            completionRateDropPercent: 20
        };
    }

    loadInsightPatterns() {
        return {
            sentiment_trends: {
                positive_increase: "Positive sentiment increased by {change}% - great job on recent improvements!",
                negative_spike: "Negative sentiment spiked by {change}% - investigate recent changes",
                neutral_plateau: "Sentiment has been neutral for {period} - consider engagement strategies"
            },
            response_patterns: {
                low_response: "Response rate is {rate}% below average - optimize distribution strategy",
                high_engagement: "Engagement is {rate}% above normal - replicate successful elements",
                completion_issues: "Drop-off at question {question_num} - consider simplifying"
            }
        };
    }

    generateInsights() {
        // Simulate real-time insight generation
        const mockData = this.getMockData();
        const insights = [];

        // Analyze sentiment trends
        const sentimentInsights = this.analyzeSentimentTrends(mockData.sentiment);
        insights.push(...sentimentInsights);

        // Detect anomalies
        const anomalies = this.detectAnomalies(mockData);
        insights.push(...anomalies);

        // Generate recommendations
        const recommendations = this.generateRecommendations(mockData);
        insights.push(...recommendations);

        this.currentInsights = insights;
        return insights;
    }

    getMockData() {
        return {
            sentiment: {
                current: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
                previous: Math.random() * 0.4 + 0.3,
                trend: Math.random() > 0.5 ? 'up' : 'down'
            },
            nps: {
                current: Math.random() * 40 + 30, // 30 to 70
                previous: Math.random() * 40 + 30
            },
            responseRate: {
                current: Math.random() * 30 + 40, // 40% to 70%
                previous: Math.random() * 30 + 40
            },
            completionRate: {
                current: Math.random() * 25 + 65, // 65% to 90%
                previous: Math.random() * 25 + 65
            }
        };
    }

    analyzeSentimentTrends(sentimentData) {
        const insights = [];
        const change = ((sentimentData.current - sentimentData.previous) / sentimentData.previous) * 100;
        
        if (Math.abs(change) > this.anomalyThresholds.sentimentChangePoints) {
            if (change > 0) {
                insights.push({
                    type: 'positive_trend',
                    title: 'Sentiment Improvement Detected',
                    description: `Positive sentiment increased by ${Math.round(change)}%`,
                    priority: 'medium',
                    actionable: true
                });
            } else {
                insights.push({
                    type: 'negative_trend',
                    title: 'Sentiment Decline Alert',
                    description: `Negative sentiment increased by ${Math.round(Math.abs(change))}%`,
                    priority: 'high',
                    actionable: true
                });
            }
        }
        
        return insights;
    }

    detectAnomalies(data) {
        const insights = [];
        
        // NPS anomaly detection
        const npsChange = Math.abs(data.nps.current - data.nps.previous);
        if (npsChange > this.anomalyThresholds.npsChangePoints) {
            insights.push({
                type: 'nps_anomaly',
                title: 'NPS Score Anomaly',
                description: `NPS changed by ${Math.round(npsChange)} points - investigate recent changes`,
                priority: 'high',
                actionable: true
            });
        }
        
        // Response rate anomaly
        const responseChange = ((data.responseRate.current - data.responseRate.previous) / data.responseRate.previous) * 100;
        if (Math.abs(responseChange) > this.anomalyThresholds.responseRateDropPercent) {
            insights.push({
                type: 'response_anomaly',
                title: 'Response Rate Change',
                description: `Response rate changed by ${Math.round(responseChange)}%`,
                priority: responseChange < 0 ? 'high' : 'medium',
                actionable: true
            });
        }
        
        return insights;
    }

    generateRecommendations(data) {
        const recommendations = [];
        
        // Timing recommendations
        if (data.responseRate.current < 50) {
            recommendations.push({
                type: 'timing_optimization',
                title: 'Optimize Send Time',
                description: 'AI suggests sending surveys on Tuesday at 10 AM for 23% higher response rates',
                priority: 'medium',
                actionable: true,
                action: 'optimize_timing'
            });
        }
        
        // Content recommendations
        if (data.completionRate.current < 75) {
            recommendations.push({
                type: 'content_optimization',
                title: 'Survey Length Optimization',
                description: 'Consider reducing survey length - completion drops significantly after question 8',
                priority: 'medium',
                actionable: true,
                action: 'optimize_length'
            });
        }
        
        return recommendations;
    }

    predictTrends(timeframe = '30days') {
        // Simulate trend predictions
        return {
            sentiment: {
                predicted: Math.random() * 0.2 + 0.4,
                confidence: 0.85,
                factors: ['recent product updates', 'improved customer service', 'seasonal trends']
            },
            nps: {
                predicted: Math.random() * 20 + 40,
                confidence: 0.78,
                factors: ['competitor actions', 'market conditions', 'product improvements']
            },
            responseRate: {
                predicted: Math.random() * 15 + 55,
                confidence: 0.82,
                factors: ['email deliverability', 'survey fatigue', 'incentive effectiveness']
            }
        };
    }
}

// Distribution AI Model
class DistributionAI {
    constructor() {
        this.channelEffectiveness = this.loadChannelData();
        this.audienceSegments = this.loadAudienceSegments();
    }

    loadChannelData() {
        return {
            email: { responseRate: 0.68, openRate: 0.24, costPerResponse: 0.50 },
            sms: { responseRate: 0.45, openRate: 0.98, costPerResponse: 2.10 },
            social: { responseRate: 0.12, openRate: 0.85, costPerResponse: 0.25 },
            inapp: { responseRate: 0.78, openRate: 0.95, costPerResponse: 0.10 },
            web: { responseRate: 0.35, openRate: 0.90, costPerResponse: 0.05 }
        };
    }

    loadAudienceSegments() {
        return {
            millennials: { preferredChannels: ['sms', 'social'], optimalTiming: '7-9 PM' },
            genx: { preferredChannels: ['email', 'web'], optimalTiming: '10 AM - 2 PM' },
            boomers: { preferredChannels: ['email'], optimalTiming: '9-11 AM' },
            enterprise: { preferredChannels: ['email', 'inapp'], optimalTiming: '10 AM - 4 PM' }
        };
    }

    optimizeDistribution(surveyData, audienceData) {
        const recommendations = {
            channels: this.selectOptimalChannels(audienceData),
            timing: this.optimizeTiming(audienceData),
            segmentation: this.suggestSegmentation(audienceData),
            personalization: this.generatePersonalization(surveyData, audienceData)
        };
        
        return recommendations;
    }

    selectOptimalChannels(audienceData) {
        // AI-powered channel selection based on audience
        const segments = this.identifyAudienceSegments(audienceData);
        const channelScores = {};
        
        Object.keys(this.channelEffectiveness).forEach(channel => {
            channelScores[channel] = this.calculateChannelScore(channel, segments);
        });
        
        // Sort channels by score
        const sortedChannels = Object.entries(channelScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([channel]) => channel);
            
        return sortedChannels;
    }

    identifyAudienceSegments(audienceData) {
        // Simplified audience segmentation
        return {
            millennials: 0.4,
            genx: 0.35,
            boomers: 0.15,
            enterprise: 0.1
        };
    }

    calculateChannelScore(channel, segments) {
        let score = 0;
        const channelData = this.channelEffectiveness[channel];
        
        // Base effectiveness
        score += channelData.responseRate * 100;
        
        // Audience preference adjustment
        Object.entries(segments).forEach(([segment, weight]) => {
            const segmentData = this.audienceSegments[segment];
            if (segmentData && segmentData.preferredChannels.includes(channel)) {
                score += weight * 20; // Boost for preferred channels
            }
        });
        
        // Cost efficiency
        score -= channelData.costPerResponse * 10;
        
        return score;
    }

    optimizeTiming(audienceData) {
        return {
            optimalDay: 'Tuesday',
            optimalTime: '10:00 AM',
            timezone: 'recipient local time',
            reasoning: 'AI analysis shows 23% higher response rates on Tuesday mornings',
            alternatives: [
                { day: 'Wednesday', time: '2:00 PM', effectiveness: '89%' },
                { day: 'Thursday', time: '11:00 AM', effectiveness: '85%' }
            ]
        };
    }

    suggestSegmentation(audienceData) {
        return {
            demographic: ['age', 'location', 'role'],
            behavioral: ['previous response rate', 'engagement level', 'survey frequency'],
            psychographic: ['interests', 'values', 'attitudes'],
            aiRecommendation: 'Segment by previous engagement for 15% better response rates'
        };
    }

    generatePersonalization(surveyData, audienceData) {
        return {
            subjectLine: {
                template: 'Hi {firstName}, help us improve {productName}',
                variations: [
                    'Your opinion matters - 2 minutes survey',
                    'Quick feedback needed from our valued customer',
                    'Help shape the future of {productName}'
                ]
            },
            content: {
                greeting: 'personalized by name and company',
                context: 'reference previous interactions or purchases',
                incentive: 'tailored to segment preferences'
            },
            aiOptimization: 'Personalization increases response rates by 34%'
        };
    }
}

// Helper Models for Predictions
class AttendancePredictionModel {
    predict(eventData) {
        // Simplified prediction model
        const baseRate = 0.75;
        let prediction = baseRate;
        
        if (eventData.type === 'webinar') prediction -= 0.1;
        if (eventData.complexity === 'high') prediction -= 0.05;
        if (eventData.targetAudience === 'employee') prediction += 0.1;
        
        return Math.max(0.3, Math.min(0.95, prediction));
    }
}

class OverbookingModel {
    optimize(eventData, capacity) {
        const noShowRate = 1 - new AttendancePredictionModel().predict(eventData);
        const overbookingFactor = noShowRate + 0.05; // 5% buffer
        
        return {
            recommendedCapacity: Math.round(capacity / (1 - overbookingFactor)),
            confidence: 0.82,
            riskLevel: noShowRate > 0.3 ? 'high' : 'low'
        };
    }
}

class EngagementModel {
    predict(eventData) {
        let engagement = 0.7; // Base engagement
        
        if (eventData.type === 'workshop') engagement += 0.1;
        if (eventData.complexity === 'low') engagement += 0.05;
        if (eventData.topic === 'product') engagement += 0.05;
        
        return Math.min(0.95, engagement);
    }
}

// Export for use in main application
window.AIEngine = AIEngine;
