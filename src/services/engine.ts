import { IntakeData, AnalysisReport, ActionStep, MindMapNode, DimensionScore, RiskItem } from '../types';

export function analyzeIntake(data: IntakeData): AnalysisReport {
  const prioritySteps: ActionStep[] = [];
  const central: ActionStep[] = [];
  const local: ActionStep[] = [];

  // --- 1. Calculate Dimension Scores ---
  const calculateAverage = (obj: Record<string, number | undefined>) => {
    const values = Object.values(obj).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const radarData: DimensionScore[] = [
    { 
      name: '身體功能', 
      score: calculateAverage(data.physical), 
      fullMark: 5,
      description: '行動能力、慢性病控制、復健',
      icon: 'Activity'
    },
    { 
      name: '生活自理', 
      score: calculateAverage(data.selfCare), 
      fullMark: 5,
      description: '進食、沐浴、用藥管理',
      icon: 'Utensils'
    },
    { 
      name: '認知溝通', 
      score: calculateAverage(data.cognition), 
      fullMark: 5,
      description: '記憶判斷、手機電腦使用能力',
      icon: 'Smartphone'
    },
    { 
      name: '工作經濟', 
      score: calculateAverage(data.economy), 
      fullMark: 5,
      description: '工作意願、技能、經濟壓力',
      icon: 'Briefcase'
    },
    { 
      name: '家庭支持', 
      score: calculateAverage(data.family), 
      fullMark: 5,
      description: '照顧者狀況、支持程度',
      icon: 'Home'
    },
    { 
      name: '社會心理', 
      score: calculateAverage(data.social), 
      fullMark: 5,
      description: '社交支持、孤立程度',
      icon: 'Users'
    },
  ];

  // --- 2. Identify Strengths & Weaknesses ---
  const sortedDimensions = [...radarData].sort((a, b) => b.score - a.score);
  const strengths = sortedDimensions.slice(0, 3).map(d => d.name);
  const weaknesses = sortedDimensions.slice(-3).reverse().map(d => d.name);

  // --- 3. Risk Assessment ---
  const risks: RiskItem[] = [];
  
  // 跌倒高風險
  if (data.physical.balance <= 2 || data.physical.indoorMobility <= 2) {
    risks.push({ type: 'fall', level: 'high', description: '個案平衡能力弱或室內移動困難，跌倒風險極高，建議加強居家無障礙與防滑。' });
  }
  
  // 自傷風險
  if (data.cognition.selfHarmThoughts === true) {
    risks.push({ type: 'self-harm', level: 'high', description: '個案有自傷想法，屬極高風險，需立即轉介心理諮商或醫療介入。' });
  }
  
  // 照顧崩潰風險
  if (data.family.caregiverHealth <= 2 || data.family.familyConflict <= 2 || data.family.familyCrisis === true) {
    risks.push({ type: 'burnout', level: 'high', description: '照顧者健康欠佳、家庭衝突嚴重或曾發生家庭危機，照顧者面臨極大壓力，需優先導入喘息服務。' });
  }
  
  // 經濟危機風險
  if (data.economy.economicPressure <= 2 || data.economy.hasDebt === true || data.economy.delayedMedicalCare === true) {
    risks.push({ type: 'economic', level: 'high', description: '經濟壓力極大、有債務或曾因經濟延誤就醫，面臨經濟危機，應優先確認各項補助資格與急難救助。' });
  }
  
  // 社會孤立風險
  if (data.social.isolation <= 2 || data.social.socialSupport <= 2) {
    risks.push({ type: 'isolation', level: 'high', description: '社交活動極少、缺乏支持系統且感到孤立，長期可能導致憂鬱或功能退化。' });
  }

  // Add low risk if no high/medium risks found for a dimension
  if (risks.length === 0) {
    risks.push({ type: 'other', level: 'low', description: '目前各項指標尚屬穩定，建議維持現有生活習慣並定期進行自我健康監測。' });
  }

  // --- 4. Two-Axis & Four-Quadrant Analysis ---
  // Step 1: Calculate average for each dimension (already done in radarData)
  const PF = radarData[0].score;
  const ADL = radarData[1].score;
  const COG = radarData[2].score;
  const WORK = radarData[3].score;
  const FAM = radarData[4].score;
  const SOC = radarData[5].score;

  // Step 2: Core Indicators
  let CSS = (ADL * 0.4) + (FAM * 0.4) + (PF * 0.2);
  let DPS = (WORK * 0.4) + (COG * 0.3) + (SOC * 0.3);

  // Step 3: Risk Modifier
  if (risks.some(r => r.type === 'self-harm')) CSS -= 0.5;
  if (risks.some(r => r.type === 'fall')) CSS -= 0.3;
  if (risks.some(r => r.type === 'burnout')) CSS -= 0.5;
  if (risks.some(r => r.type === 'economic')) DPS -= 0.3;

  CSS = Math.max(0, CSS);
  DPS = Math.max(0, DPS);

  const stability = CSS;
  const development = DPS;

  let quadrant: AnalysisReport['quadrant'];
  if (stability < 2.5 && development < 2.5) {
    quadrant = {
      id: 'I',
      name: '🔴 第一象限（高度依賴區）',
      description: '低功能 × 低支持。立即整合資源型，優先穩定生活與醫療。',
      stability,
      development
    };
  } else if (stability >= 2.5 && development < 2.5) {
    quadrant = {
      id: 'II',
      name: '🟠 第二象限（家庭可撐型）',
      description: '低功能 × 高支持。重點在於減輕家庭照顧負擔。',
      stability,
      development
    };
  } else if (stability < 2.5 && development >= 2.5) {
    quadrant = {
      id: 'III',
      name: '🟡 第三象限（高潛力孤立型）',
      description: '高功能 × 低支持。具備發展潛力但生活基礎不足，平台最關鍵族群。',
      stability,
      development
    };
  } else {
    quadrant = {
      id: 'IV',
      name: '🟢 第四象限（穩定預防型）',
      description: '高功能 × 高支持。重點在於優化生活品質與持續發展。',
      stability,
      development
    };
  }

  // --- 5. Generate Resource Categories (Improve Plan) ---
  const resourceCategories: ResourceCategory[] = [];

  if (quadrant.id === 'I') {
    resourceCategories.push({
      title: '🏥 醫療整合',
      items: ['重大傷病證明', '勞保傷病給付', '職災傷病給付', '失能給付（一次金 / 年金）', '整形外科壓瘡手術', '長照服務評估']
    });
    resourceCategories.push({
      title: '🏠 長期照護',
      items: ['長照2.0服務', '居家服務員', '日照中心', '喘息服務']
    });
    resourceCategories.push({
      title: '🦽 輔具支持',
      items: ['輔具補助', '居家無障礙改善補助', '民間輔具（如環保輔具）']
    });
    resourceCategories.push({
      title: '💰 經濟補助',
      items: ['急難救助', '身障生活津貼', '低收入戶申請', '中低收入戶申請', '租屋補助']
    });
    resourceCategories.push({
      title: '👨‍👩‍👧‍👦 家庭支援',
      items: ['外籍看護聘僱', '就業安定費免繳', '照顧者支持團體']
    });
  } else if (quadrant.id === 'II') {
    resourceCategories.push({
      title: '🏠 長照與家庭支援',
      items: ['外籍看護', '看護費補助', '就安費減免', '長照居家服務']
    });
    resourceCategories.push({
      title: '🦽 輔具與環境',
      items: ['輔具補助', '居家改善補助']
    });
    resourceCategories.push({
      title: '🏥 醫療整合',
      items: ['重大傷病證明']
    });
  } else if (quadrant.id === 'III') {
    resourceCategories.push({
      title: '💼 工作與經濟',
      items: ['職業重建', '庇護工場', '就業媒合', '遠距工作訓練', '技能培訓補助']
    });
    resourceCategories.push({
      title: '💰 經濟支持',
      items: ['租屋補助', '身障生活補助', '勞保給付', '國民年金']
    });
    resourceCategories.push({
      title: '🧠 社會支持',
      items: ['社區參與計畫', '心理諮商補助', '同儕支持團體']
    });
  } else if (quadrant.id === 'IV') {
    resourceCategories.push({
      title: '🌟 生活品質優化',
      items: ['社區參與補助', '自立生活計畫', '輔具升級補助', '教育進修補助']
    });
    resourceCategories.push({
      title: '💼 發展與就業',
      items: ['就業發展', '創業補助']
    });
  }

  // Cross-quadrant universal resources (制度型)
  // We can add these based on specific conditions or just keep them in the general resources list.
  // For now, we will just use the quadrant-specific ones as requested.

  const prioritizedTasks: ActionStep[] = []; // Keeping this empty to satisfy the interface for now, or we can remove it from interface later.
  const documentChecklist: string[] = ['身分證正反面影本', '印章', '3個月內診斷證明書'];

  if (data.hasCertificate === 'none' || data.hasCertificate === 'unsure') {
    documentChecklist.push('1吋照片3張');
  }
  if (quadrant.id === 'I' || quadrant.id === 'III') {
    documentChecklist.push('最高學歷證明', '勞保投保明細');
  }

  // --- 6. Resources ---
  central.push({
    title: '輔具補助申請',
    agency: '衛福部社家署',
    description: '根據經濟狀況提供不同比例的輔具購置補助。',
    link: 'https://repat.mohw.gov.tw/'
  });
  local.push({
    title: `${data.city} 輔具資源中心`,
    agency: '社會局委辦單位',
    description: '提供輔具諮詢、租借與維修服務。'
  });

  // --- 7. Mind Map Data ---
  const mindMapData: MindMapNode = {
    name: "跨體系整合導航",
    children: [
      {
        name: "能力評估 (六邊形)",
        children: [
          { name: "優勢維度", value: strengths.join(', ') },
          { name: "困境維度", value: weaknesses.join(', ') },
          { name: "分群象限", value: quadrant.name }
        ]
      },
      {
        name: "對接體系 (六大系統)",
        children: [
          { name: "長照體系", value: "1966、居家/喘息服務" },
          { name: "身障社福", value: "身障鑑定、生活補助" },
          { name: "醫療衛生", value: "復健資源、重大傷病" },
          { name: "勞動職業", value: "職業重建、就業服務" },
          { name: "勞保保險", value: "失能給付、傷病給付" },
          { name: "社區民間", value: "據點、支持團體" }
        ]
      },
      {
        name: "行動方案 (Improve Plan)",
        children: [
          { name: "優先序 1", value: prioritizedTasks[0]?.title || "評估中" },
          { name: "優先序 2", value: prioritizedTasks[1]?.title || "評估中" },
          { name: "目標", value: quadrant.description.split('。')[0] }
        ]
      }
    ]
  };

  // --- 8. Generate Detailed Summary (Depth & Alignment Report) ---
  const generateDetailedSummary = () => {
    let text = `根據評估結果，個案目前處於「${quadrant.name}」狀態（穩定度：${stability.toFixed(1)}，發展度：${development.toFixed(1)}）。`;
    
    if (data.hasCertificate === 'yes' && data.certificateDetails) {
      const degreeMap = { mild: '輕度', moderate: '中度', severe: '重度', profound: '極重度' };
      text += ` 個案已持有身心障礙證明（編號：${data.certificateDetails.number || '未提供'}，類別：${data.certificateDetails.category || '未提供'}，等級：${degreeMap[data.certificateDetails.degree]}）。`;
    }

    if (data.travelCardStatus === 'yes') {
      text += ` 已辦理愛心悠遊卡/博愛卡，具備基本交通補貼。`;
    } else if (data.travelCardStatus === 'applying') {
      text += ` 愛心悠遊卡/博愛卡辦理中。`;
    } else {
      text += ` 尚未辦理愛心悠遊卡/博愛卡，建議優先申請以降低交通成本。`;
    }

    if (data.transportation.mobilityAid !== 'none') {
      const aidMap = { 
        'manual-wheelchair': '手動輪椅', 
        'electric-wheelchair': '電動輪椅', 
        'walker': '助行器', 
        'cane': '拐杖' 
      };
      text += ` 目前使用${aidMap[data.transportation.mobilityAid as keyof typeof aidMap]}作為主要輔具。`;
    }

    const eduMap = { none: '不識字', primary: '國小', 'junior-high': '國中', 'senior-high': '高中/職', university: '大學/專科', graduate: '研究所及以上' };
    text += ` 教育程度為${eduMap[data.education]}。`;

    if (data.cognition.aiUsage >= 4) {
      text += ` 具備良好的 AI 工具使用潛力，有利於數位轉型與遠距工作。`;
    }

    if (stability < 2.5) {
      text += ` 核心困境在於「照顧穩定度」不足，主要受${weaknesses.includes('家庭支持') ? '家庭照顧量能受限' : '自理能力缺口'}影響，建議優先導入長照資源以穩固生活基盤。`;
    } else {
      text += ` 生活基盤相對穩固，具備良好的家庭支持或自理基礎，這為後續的發展提供了有利條件。`;
    }

    if (development >= 2.5) {
      text += ` 在「自立發展度」方面表現積極，具備重返社會或職場的潛力，應重點對接職業重建與社會參與資源。`;
    } else {
      text += ` 目前發展動能受限，可能受限於${weaknesses.includes('工作經濟') ? '經濟壓力或職業技能缺口' : '認知溝通障礙'}，建議現階段以維持生活品質與功能復健為主。`;
    }

    if (risks.length > 0) {
      text += ` 需特別注意安全風險：${risks.map(r => r.description).join(' ')}`;
    }

    return text;
  };

  const detailedSummary = generateDetailedSummary();

  return {
    summary: detailedSummary,
    recommendedPath: quadrant.name,
    prioritySteps: prioritizedTasks,
    resources: { central, local },
    mindMapData,
    radarData,
    strengths,
    weaknesses,
    risks,
    quadrant,
    actionPlan: {
      prioritizedTasks,
      referralSummary: {
        goals: [
          `提升${weaknesses[0] || '生活'}維度能力`,
          quadrant.id === 'I' || quadrant.id === 'III' ? '啟動職業重建評估' : '穩固居家照顧體系',
          '降低潛在跌倒與照顧崩潰風險'
        ],
        keyDifficulties: [
          ...weaknesses,
          ...risks.map(r => r.type)
        ]
      },
      documentChecklist
    },
    resourceCategories
  };
}
