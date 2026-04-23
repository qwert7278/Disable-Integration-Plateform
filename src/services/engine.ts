import { IntakeData, AnalysisReport, ActionStep, MindMapNode, DimensionScore, RiskItem } from '../types';

export function analyzeIntake(data: IntakeData): AnalysisReport {
  const prioritySteps: ActionStep[] = [];
  const central: ActionStep[] = [];
  const local: ActionStep[] = [];

  // --- 1. Calculate Dimension Scores ---
  const calculateAverage = (obj: Record<string, number>) => {
    const values = Object.values(obj);
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
  if (data.physical.balance <= 2 || data.physical.pain <= 2) {
    risks.push({ type: 'fall', level: 'high', description: '個案平衡能力弱或疼痛感強，跌倒風險極高，建議加強居家無障礙與防滑。' });
  }
  if (data.family.careHours <= 1 || data.family.familyConflict <= 2) {
    risks.push({ type: 'burnout', level: 'high', description: '照顧時數不足或家庭衝突嚴重，照顧者面臨極大壓力，需優先導入喘息服務。' });
  }
  if (data.social.isolation <= 2 || data.social.communityParticipation <= 2) {
    risks.push({ type: 'isolation', level: 'medium', description: '社交活動極少且感到孤立，長期可能導致憂鬱或功能退化。' });
  }
  if (data.family.caregiverHealth <= 2 && data.selfCare.bathing <= 2) {
    risks.push({ type: 'institutionalization', level: 'high', description: '照顧者健康欠佳且個案自理能力弱，居家照顧難以維持，需考慮轉銜機構。' });
  }
  if (data.economy.economicPressure <= 2) {
    risks.push({ type: 'economic', level: 'medium', description: '醫療與照顧支出造成沉重負擔，應優先確認各項補助資格。' });
  }
  // Add low risk if no high/medium risks found for a dimension
  if (risks.length === 0) {
    risks.push({ type: 'other', level: 'low', description: '目前各項指標尚屬穩定，建議維持現有生活習慣並定期進行自我健康監測。' });
  }

  // --- 4. Two-Axis & Four-Quadrant Analysis ---
  let stability = (radarData[4].score + radarData[1].score + radarData[0].score) / 3; // 家庭支持 x 自理能力 x 身體功能
  
  // 修正規則：若居住環境或交通可近性極差，穩定度再扣除權重
  if (data.transportation.score <= 2) stability *= 0.9;
  if (data.accessibility.overallBarrier <= 2) stability *= 0.9;
  if (data.accessibility.exitDifficulty || data.accessibility.streetDifficulty) stability *= 0.9;

  const development = (data.economy.intent + data.economy.capacity + data.economy.economicPressure) / 3; // 工作意願 x 工作能力 x 經濟壓力

  let quadrant: AnalysisReport['quadrant'];
  if (stability >= 2.5 && development >= 2.5) {
    quadrant = {
      id: 'I',
      name: '自立發展型',
      description: '照顧穩定高 × 發展高。具備穩定生活基礎與發展潛力，應優先導入職業重建。',
      stability,
      development
    };
  } else if (stability >= 2.5 && development < 2.5) {
    quadrant = {
      id: 'II',
      name: '穩定生活型',
      description: '照顧穩定高 × 發展低。生活基礎穩固但發展潛力受限，應強化生活品質與社區參與。',
      stability,
      development
    };
  } else if (stability < 2.5 && development >= 2.5) {
    quadrant = {
      id: 'III',
      name: '潛力待援型',
      description: '照顧穩定低 × 發展高。具備發展潛力但生活支持不足，應先補足生活支持再導入職重。',
      stability,
      development
    };
  } else {
    quadrant = {
      id: 'IV',
      name: '高危支持型',
      description: '照顧穩定低 × 發展低。生活與發展皆面臨困境，應優先導入長照與照顧管理，避免崩潰。',
      stability,
      development
    };
  }

  // --- 5. Generate Priority Steps (Improve Plan) ---
  const prioritizedTasks: ActionStep[] = [];
  const documentChecklist: string[] = ['身分證正反面影本', '印章', '3個月內診斷證明書'];

  // Mapping Logic
  if (data.hasCertificate === 'none' || data.hasCertificate === 'unsure') {
    prioritizedTasks.push({
      title: '身心障礙鑑定申請',
      agency: '戶籍地區公所社會課',
      description: '這是取得政府資源的第一步，解決「資源分散、資格不明」的痛點。',
      painPoint: '不知道自己算不算身障、不知道去哪申請。',
      sop: [
        { step: '1. 領表', action: '至公所領取「身心障礙鑑定表」。', docs: ['身分證', '印章', '1吋照片3張'] },
        { step: '2. 鑑定', action: '至指定醫院進行醫師鑑定與需求評估。' },
        { step: '3. 審核', action: '醫院送回公所，社會局進行資格審核。' }
      ]
    });
    documentChecklist.push('1吋照片3張');
  }

  // LTC Mapping
  if (radarData[0].score <= 3 || radarData[1].score <= 3 || risks.some(r => r.type === 'burnout')) {
    prioritizedTasks.push({
      title: '1966 長照服務申請',
      agency: '各縣市長期照顧管理中心',
      description: '導入居家服務、喘息服務或輔具資源，減輕家庭照顧負擔。',
      painPoint: '照顧壓力大，不知道如何找專業人力。',
      sop: [
        { step: '1. 撥打', action: '直撥 1966 專線提出申請。' },
        { step: '2. 評估', action: '照管專員到府進行失能等級評估。' },
        { step: '3. 派案', action: '媒合居家服務或喘息服務。' }
      ]
    });
  }

  // Vocational Mapping
  if (quadrant.id === 'I' || quadrant.id === 'III') {
    prioritizedTasks.push({
      title: '職業重建與就業服務',
      agency: '各縣市勞工局/就業服務站',
      description: '提供職務再設計、就業媒合與職業訓練，協助重返職場。',
      sop: [
        { step: '1. 諮詢', action: '找「職重個管員」進行初步面談。' },
        { step: '2. 評量', action: '進行職業輔導評量，了解工作能力。' }
      ]
    });
    documentChecklist.push('最高學歷證明', '勞保投保明細');
  }

  // Housing Mapping
  if (!data.accessibility.bathroom || data.housingType === 'no-elevator' || data.housingType === 'townhouse') {
    prioritizedTasks.push({
      title: '居家無障礙環境改善補助',
      agency: '地方政府社會局/長照中心',
      description: '改善浴廁安全或解決公寓爬梯問題，降低跌倒風險。',
      sop: [
        { step: '1. 評估', action: '由治療師到府進行環境評估。' },
        { step: '2. 施工', action: '核定補助後進行施工。' }
      ]
    });
  }

  // Smart Home & Appointment Service Guidance
  if (data.accessibility.smartHome || data.accessibility.appointmentService) {
    prioritizedTasks.push({
      title: '智慧居家與預約服務對接',
      agency: '社區資源中心/科技輔具中心',
      description: '整合智慧家居設備與線上預約服務，提升生活自主性。',
      sop: [
        { step: '1. 規劃', action: '評估智慧設備（如自動門、語音控制）之需求。' },
        { step: '2. 訓練', action: '指導個案使用線上預約系統進行復健或採買。' }
      ]
    });
  }

  // Transportation Guidance
  if (data.travelCardStatus === 'none') {
    prioritizedTasks.push({
      title: '愛心悠遊卡/博愛卡申請',
      agency: '各縣市區公所社會課',
      description: '提供身心障礙者大眾運輸工具半價優惠或點數補助，降低外出成本。',
      sop: [
        { step: '1. 備齊', action: '準備身障證明、身分證、1吋照片2張。', docs: ['身障證明', '身分證', '照片'] },
        { step: '2. 辦理', action: '至公所臨櫃辦理，通常可現場領卡。' }
      ]
    });
  }

  if (data.transportation.score <= 2 || (!data.transportation.bus && !data.transportation.mrt)) {
    prioritizedTasks.push({
      title: '無障礙交通導航與接送服務',
      agency: '交通局/復康巴士中心',
      description: `針對住家遠離交通樞紐之困境，提供復康巴士或通用計程車資訊。目前具備：${[
        data.transportation.bus ? '公車' : '',
        data.transportation.mrt ? '捷運' : '',
        data.transportation.train ? '火車' : '',
        data.transportation.taxi ? '計程車' : ''
      ].filter(Boolean).join('、') || '無'}。`,
      sop: [
        { step: '1. 註冊', action: '申請復康巴士使用資格。' },
        { step: '2. 查詢', action: '了解住家附近最近的低底盤公車或捷運接駁資訊。' }
      ]
    });
  }

  // Assistive Device & Rehab Mapping
  if (radarData[0].score <= 3 || data.physical.transfer <= 2 || data.physical.transferToilet <= 2 || data.physical.indoorMobility <= 2 || data.physical.outdoorMobility <= 2) {
    prioritizedTasks.push({
      title: '專業輔具評估與復健規劃',
      agency: '各縣市輔具資源中心/復健科醫院',
      description: '由治療師評估合適輔具並規劃個別化復健方案，提升行動安全與生活品質。',
      sop: [
        { step: '1. 諮詢', action: '預約輔具中心進行到府或到點評估。' },
        { step: '2. 規劃', action: '配合物理/職能治療師建議，選擇合適輔具。' }
      ]
    });
  }

  // Psychological Support Mapping
  if (data.social.emotionalDistress <= 2 || data.social.lifeGoals <= 2 || data.social.socialSupport <= 2) {
    prioritizedTasks.push({
      title: '心理支持與社交連結',
      agency: '社區心理衛生中心/身障團體',
      description: '提供心理諮商、支持團體或社交活動，緩解情緒壓力並建立生活目標。',
      sop: [
        { step: '1. 傾聽', action: '尋求專業心理諮商或參與病友支持團體。' },
        { step: '2. 參與', action: '根據興趣選擇適合的社區據點活動。' }
      ]
    });
  }

  // Friendly and Caring Business Guidance
  if (data.social.communityParticipation <= 3 || quadrant.id === 'II' || quadrant.id === 'IV') {
    prioritizedTasks.push({
      title: '有愛店家與友善商家導航',
      agency: '基隆市政府社會處/身障平台支持整合計畫',
      description: '連結社區內提供友善空間、優先服務或特殊協助的「有愛店家」。',
      sop: [
        { step: '1. 識別', action: '認明門口貼有「有愛店家」標章之商家。' },
        { step: '2. 互動', action: '主動告知需求，享受友善環境與貼心服務。' }
      ]
    });
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
    const stageMap = { 
      'hospitalized': '住院中', 
      'just-discharged': '剛出院回到家', 
      'home-awhile': '已經在家一段時間', 
      'stable': '生活大致穩定', 
      'planning-work': '想開始規劃工作/重返社會' 
    };
    const concernMap = { 
      'care': '身體照顧', 
      'daily-life': '日常生活', 
      'cognition': '溝通/認知', 
      'work-economy': '工作/經濟', 
      'family-pressure': '家庭照顧壓力', 
      'social-emotional': '情緒/社會參與', 
      'housing-transport': '居家環境/交通', 
      'unknown': '未明示' 
    };

    let text = `根據${data.respondentType === 'self' ? '您本人' : '家屬代填'}的初步現況說明，個案目前處於「${stageMap[data.currentStage]}」階段，最關注的議題為「${concernMap[data.primaryConcern]}」。`;
    text += ` 綜合評估結果，目前處於「${quadrant.name}」狀態（穩定度：${stability.toFixed(1)}，發展度：${development.toFixed(1)}）。`;
    
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
    }
  };
}
