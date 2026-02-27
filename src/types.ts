import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DisabilityStatus = 'none' | 'unsure' | 'failed' | 'yes';
export type DisabilityDegree = 'mild' | 'moderate' | 'severe' | 'profound';
export type AbilityLevel = 'high' | 'medium' | 'low';
export type TravelCardStatus = 'none' | 'applying' | 'yes';
export type MobilityAid = 'none' | 'manual-wheelchair' | 'electric-wheelchair' | 'walker' | 'cane';
export type Environment = 'hospital' | 'home' | 'institution';
export type IncomeLevel = 'low' | 'middle-low' | 'normal';
export type CaregiverStatus = 'good' | 'tired' | 'exhausted' | 'none';

export type EducationLevel = 'none' | 'primary' | 'junior-high' | 'senior-high' | 'university' | 'graduate';

export interface IntakeData {
  // A1. Basic Background
  age: string;
  city: string;
  district: string;
  education: EducationLevel;
  livingStatus: 'alone' | 'with-family' | 'other';
  source: 'congenital' | 'disease' | 'accident' | 'occupational' | 'aging';
  onsetTime: 'acute' | 'recovery' | 'stable';
  hasCertificate: DisabilityStatus;
  certificateDetails?: {
    degree: DisabilityDegree;
    number: string;
    category: string;
  };
  travelCardStatus: TravelCardStatus;
  condition: string;

  // A2. Six Dimensions (Sub-scores 0-5)
  // 1. Physical Function
  physical: {
    indoorMobility: number;
    outdoorMobility: number;
    transfer: number;
    balance: number;
    endurance: number;
    chronicControl: number;
    pain: number;
    rehabStatus: number;
  };
  // 2. Self-Care
  selfCare: {
    eating: number;
    bathing: number;
    toileting: number;
    dressing: number;
    medication: number;
    housework: number;
    errands: number;
  };
  // 3. Cognition & Communication
  cognition: {
    orientation: number;
    memory: number;
    judgment: number;
    expression: number;
    comprehension: number;
    mood: number;
    mobileUse: number;
    computerUse: number;
    aiUsage: number;
    learningAbility: number;
    softwareUsage: number;
    reading: number;
    writing: number;
    signedUnunderstoodDoc?: boolean;
    persistentLowMood?: boolean;
    selfHarmThoughts?: boolean;
  };
  // 4. Work & Economy
  economy: {
    skills: number;
    intent: number;
    capacity: number;
    remoteFeasibility: number;
    supportNeeds: number;
    economicRole: number;
    economicPressure: number;
    welfareStatus: number;
    delayedMedicalCare: boolean;
    stableIncome: boolean;
    willingToTrain: boolean;
    needJobRedesign?: boolean;
    hasDebt?: boolean;
  };
  // 5. Family Support
  family: {
    cohabitants: number;
    caregiverHealth: number;
    careHours: number;
    familyAttitude: number;
    resourceKnowledge: number;
    familyConflict: number;
    emergencyBackup: number;
    caregiverRespite: boolean;
    familyCrisis: boolean;
  };
  // 6. Social & Quality of Life
  social: {
    socialSupport: number;
    communityParticipation: number;
    isolation: number;
    lifeGoals: number;
    selfEfficacy: number;
    sleep: number;
    emotionalDistress: number;
    lifeSatisfaction: number;
    feelsRespected: boolean;
    experiencedDiscrimination: boolean;
  };

  // A3. Environment
  housingType: 'elevator' | 'no-elevator' | 'ground' | 'townhouse';
  accessibility: {
    // Home Accessibility (Inside)
    bathroom: boolean;
    threshold: boolean;
    aisle: boolean;
    bedside: boolean;
    entrance: boolean;
    kitchen: boolean;
    bedroom: boolean;
    livingRoom: boolean;
    smartHome: boolean;
    
    // Outdoor Accessibility (Convenience)
    outdoorRamp: boolean; // 門口斜坡
    outdoorElevator: boolean; // 社區電梯
    outdoorSidewalk: boolean; // 人行道平整
    outdoorLighting: boolean; // 夜間照明
    exitDifficulty: boolean; // 進出門口困難
    streetDifficulty: boolean; // 到街道不便
    appointmentService: boolean; // 是否能預約巴士/接送
    iBusApp: boolean; // 是否會使用公車預約App
  };
  transportation: {
    score: number; // 0-5
    mobilityAid: MobilityAid;
    bus: boolean;
    mrt: boolean;
    train: boolean;
    taxi: boolean;
    travelCard: boolean;
  };
  missedMedicalDueToTransport: boolean;
  reducedOutingsDueToEnvironment: boolean;
}

export interface DimensionScore {
  name: string;
  score: number;
  fullMark: number;
  description?: string;
  icon?: string;
}

export interface RiskItem {
  type: 'fall' | 'burnout' | 'isolation' | 'institutionalization' | 'economic' | 'self-harm' | 'other';
  level: 'high' | 'medium' | 'low';
  description: string;
}

export interface SOPStep {
  step: string;
  action: string;
  docs?: string[];
}

export interface ActionStep {
  title: string;
  description: string;
  link?: string;
  agency: string;
  contact?: string;
  sop?: SOPStep[];
  painPoint?: string;
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
  value?: string;
}

export interface ResourceCategory {
  title: string;
  items: string[];
}

export interface AnalysisReport {
  summary: string;
  recommendedPath: string;
  prioritySteps: ActionStep[];
  resources: {
    central: ActionStep[];
    local: ActionStep[];
  };
  mindMapData: MindMapNode;
  
  // Analytics
  radarData: DimensionScore[];
  strengths: string[];
  weaknesses: string[];
  risks: RiskItem[];

  // New Multi-Axis Analysis
  quadrant: {
    id: 'I' | 'II' | 'III' | 'IV';
    name: string;
    description: string;
    stability: number;
    development: number;
  };
  actionPlan: {
    prioritizedTasks: ActionStep[];
    referralSummary: {
      goals: string[];
      keyDifficulties: string[];
    };
    documentChecklist: string[];
  };
  resourceCategories: ResourceCategory[];
}
