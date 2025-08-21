import nlp from 'compromise';
import sentiment from 'sentiment';

const Sentiment = new sentiment();

// Enhanced risk keywords with context
const RISK_PATTERNS = {
  high: [
    'seniors forcing', 'made me do', 'threatened me', 'hurt me', 'scared to tell',
    'don\'t tell anyone', 'keep it secret', 'meet me alone', 'empty place',
    'after midnight', 'no one around', 'isolated area', 'physical harm',
    'sexual harassment', 'inappropriate touching', 'strip', 'remove clothes',
    'beat me up', 'hit me', 'slapped me', 'punched me', 'kicked me',
    'forced to drink', 'made me strip', 'touched inappropriately', 'abused me'
  ],
  medium: [
    'seniors', 'ragging', 'bullying', 'harassment', 'pressure', 'force',
    'afraid', 'scared', 'uncomfortable', 'unwanted', 'inappropriate',
    'tonight', 'late night', 'empty ground', 'alone', 'isolated',
    'senior students', 'final year', 'hostel seniors', 'room seniors',
    'made fun of', 'laughed at', 'humiliated', 'embarrassed', 'mocked'
  ],
  low: [
    'worried', 'concerned', 'anxious', 'stressed', 'upset', 'bothered',
    'uncomfortable situation', 'peer pressure', 'social pressure',
    'don\'t like', 'feeling bad', 'not happy', 'disturbed', 'troubled'
  ]
};

const LOCATION_KEYWORDS = [
  'hostel', 'dormitory', 'mess', 'canteen', 'library', 'ground', 'field',
  'parking', 'basement', 'terrace', 'roof', 'bathroom', 'washroom',
  'corridor', 'staircase', 'lab', 'classroom', 'auditorium'
];

const TIME_KEYWORDS = [
  'tonight', 'midnight', 'late night', 'early morning', 'after hours',
  'when everyone sleeps', 'during break', 'lunch time', 'evening'
];

export interface NLPAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  detectedKeywords: string[];
  sentiment: {
    score: number;
    comparative: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  entities: {
    locations: string[];
    times: string[];
    people: string[];
  };
  intent: string;
  urgency: number; // 1-10 scale
}

export function analyzeMessage(message: string): NLPAnalysis {
  const doc = nlp(message.toLowerCase());
  const text = message.toLowerCase();
  
  // Sentiment analysis
  const sentimentResult = Sentiment.analyze(message);
  const sentimentLabel = sentimentResult.score > 0 ? 'positive' : 
                        sentimentResult.score < 0 ? 'negative' : 'neutral';

  // Risk keyword detection with context
  const detectedKeywords: string[] = [];
  let riskScore = 0;
  
  // Check high-risk patterns
  RISK_PATTERNS.high.forEach(pattern => {
    if (text.includes(pattern)) {
      detectedKeywords.push(pattern);
      riskScore += 4;
    }
  });
  
  // Check medium-risk patterns
  RISK_PATTERNS.medium.forEach(pattern => {
    if (text.includes(pattern)) {
      detectedKeywords.push(pattern);
      riskScore += 2;
    }
  });
  
  // Check low-risk patterns
  RISK_PATTERNS.low.forEach(pattern => {
    if (text.includes(pattern)) {
      detectedKeywords.push(pattern);
      riskScore += 1;
    }
  });

  // Additional context analysis
  if (sentimentResult.score < -2 && detectedKeywords.length > 0) {
    riskScore += 2; // Boost risk if negative sentiment + keywords
  }

  // Check for question words that might indicate seeking help
  const helpIndicators = ['what should i do', 'can you help', 'i need help', 'please help'];
  helpIndicators.forEach(indicator => {
    if (text.includes(indicator)) {
      riskScore += 1;
      detectedKeywords.push('seeking help');
    }
  });

  // Entity extraction
  const locations = LOCATION_KEYWORDS.filter(loc => text.includes(loc));
  const times = TIME_KEYWORDS.filter(time => text.includes(time));
  const people = doc.people().out('array') as string[];

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 5) riskLevel = 'high';
  else if (riskScore >= 2) riskLevel = 'medium';

  // Calculate confidence based on multiple factors
  const confidence = Math.min(100, Math.max(20, (riskScore * 12) + (detectedKeywords.length * 8) + Math.abs(sentimentResult.score * 5)));

  // Intent classification
  let intent = 'general_conversation';
  if (text.includes('help') || text.includes('scared') || text.includes('afraid')) {
    intent = 'seeking_help';
  } else if (detectedKeywords.length > 0) {
    intent = 'potential_incident';
  } else if (text.includes('report') || text.includes('complain')) {
    intent = 'reporting_incident';
  }

  // Urgency calculation (1-10)
  let urgency = 1;
  if (riskLevel === 'high') urgency = Math.min(10, 8 + (detectedKeywords.length * 0.3));
  else if (riskLevel === 'medium') urgency = Math.min(7, 5 + (detectedKeywords.length * 0.2));
  else urgency = Math.min(4, 2 + (detectedKeywords.length * 0.1));

  return {
    riskLevel,
    confidence: Math.round(confidence),
    detectedKeywords: [...new Set(detectedKeywords)], // Remove duplicates
    sentiment: {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      label: sentimentLabel
    },
    entities: {
      locations,
      times,
      people
    },
    intent,
    urgency: Math.round(urgency)
  };
}

export function generateContextualResponse(analysis: NLPAnalysis, message: string): string {
  const { riskLevel, intent, sentiment, entities, urgency } = analysis;

  // High-risk responses
  if (riskLevel === 'high' || urgency >= 8) {
    const responses = [
      "I'm very concerned about what you're telling me. This sounds like a serious situation that needs immediate attention. I've automatically alerted the administrators about this conversation. Would you also like me to help you contact campus security right away?",
      "What you're describing sounds extremely serious and potentially dangerous. Your safety is my top priority. I've sent an alert to the admin team, and they will reach out to you soon. Can you tell me if you're in a safe place right now?",
      "This is a very serious situation, and I want to help you get to safety. I've already notified the administrators about our conversation. Should I also help you contact campus security? You don't have to face this alone.",
      "I'm deeply concerned about your safety based on what you've shared. This type of behavior is completely unacceptable. I've alerted the admin team immediately. Are you somewhere safe right now?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Medium-risk responses
  if (riskLevel === 'medium' || urgency >= 5) {
    if (entities.locations.length > 0) {
      return `I understand you're dealing with a difficult situation${entities.locations.length > 0 ? ` at the ${entities.locations[0]}` : ''}. This kind of behavior is not acceptable. I've flagged this conversation for the admin team to review. Would you like me to help you report this formally or connect you with someone who can provide support?`;
    }
    
    const responses = [
      "What you're describing sounds really concerning. No one should have to deal with this kind of treatment. I've made note of this conversation for the admin team. There are people here who can help you. Would you like me to connect you with a counselor or help you file a report?",
      "I can hear that this situation is causing you distress. You have every right to feel safe on campus. I've flagged this for review by the administrators. Let's talk about what support options are available to you.",
      "This sounds like a challenging and uncomfortable situation. You're brave for reaching out. I've noted this conversation for the admin team. What kind of help would feel most supportive to you right now?",
      "I'm sorry you're going through this. What you're describing is not okay, and you deserve support. I've alerted the administrators about our conversation. Would you like to explore some options for getting help?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Intent-based responses for low risk
  if (intent === 'seeking_help') {
    return "I'm here to listen and support you. Can you tell me more about what's been happening? Remember, there are people and resources available to help you through this.";
  }

  if (intent === 'reporting_incident') {
    return "Thank you for wanting to report this. Reporting incidents helps keep everyone safe. I can guide you through the process or connect you with the right people. What would be most helpful for you?";
  }

  // Sentiment-based responses
  if (sentiment.label === 'negative') {
    const responses = [
      "I can sense that you're going through a tough time. Sometimes talking about what's bothering us can help. What's on your mind?",
      "It sounds like something is troubling you. I'm here to listen without judgment. Would you like to share what's been happening?",
      "I notice you seem upset or worried about something. That's completely understandable. What's been weighing on your mind lately?",
      "You seem to be dealing with something difficult. Remember that it's okay to ask for help, and there are people who care about your wellbeing."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Positive sentiment responses
  if (sentiment.label === 'positive') {
    const responses = [
      "I'm glad to hear you're feeling positive! Is there anything specific you'd like to talk about or any way I can help you today?",
      "That's wonderful to hear! I'm here if you need someone to chat with or if you have any questions about campus resources.",
      "It's great that you're feeling good! Feel free to share what's on your mind, or let me know if there's anything I can help you with."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default supportive responses
  const defaultResponses = [
    "I'm listening. Can you tell me more about what's been on your mind?",
    "Thank you for sharing that with me. How are you feeling about this situation?",
    "I appreciate you opening up. What would help you feel better about this?",
    "That sounds like it's been on your mind. Is there anything specific you'd like to talk about?",
    "I'm here to support you. What's the most important thing you'd like me to understand about your situation?",
    "I understand. Can you help me understand more about what you're experiencing?",
    "Thank you for trusting me with this. What would be most helpful for you right now?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}