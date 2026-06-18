const postForm = document.querySelector("#postForm");
const posts = document.querySelector("#posts");
const inquiryForm = document.querySelector("#inquiryForm");
const inquiryMessage = document.querySelector("#inquiryMessage");
const districtTabs = document.querySelectorAll(".district-tab");
const districtDescription = document.querySelector("#districtDescription");
const recommendTabs = document.querySelectorAll(".recommend-tab");
const recommendPanels = document.querySelectorAll(".recommend-panel");
const recommendList = document.querySelector("#recommendList");
const recommendReason = document.querySelector("#recommendReason");

const districtTexts = {
  all: "울산은 4개 구와 1개 군으로 구성되어 있으며, 주거 환경은 해안 생활권, 도심 생활권, 산업단지 인접 생활권, 자연 친화 생활권 등으로 다양하게 나뉩니다.",
  jung: "울산의 원도심\n시청은 없지만 전통적인 중심지\n태화강국가정원, 성남동 등이 있음\n\n행정·상업 중심",
  nam: "현재 울산의 중심 상권\n울산시청 위치\n삼산동, 달동, 신정동 등 번화가 밀집\n인구가 가장 많음\n\n원도심·문화",
  dong: "현대중공업이 있는 조선 산업 중심지\n방어진항, 대왕암공원 유명\n\n조선업",
  buk: "현대자동차 공장 위치\n산업단지와 신도시가 함께 발전\n\n자동차 산업",
  ulju: "울산 면적의 대부분 차지\n언양, 온양, 범서, 삼남 등 포함\n영남알프스, 간절곶 등 관광자원 풍부\n군(郡)이라 읍·면이 있음\n\n관광·농촌·산업단지",
};

const renderDistrictDescription = (text) => {
  const [normalText, emphasizedText] = text.split("\n\n");

  districtDescription.textContent = "";
  districtDescription.append(document.createTextNode(normalText));

  if (emphasizedText) {
    const emphasis = document.createElement("span");
    emphasis.className = "district-emphasis";
    emphasis.textContent = emphasizedText;
    districtDescription.append(document.createElement("br"), document.createElement("br"), emphasis);
  }
};

if (districtTabs.length && districtDescription) {
  renderDistrictDescription(districtTexts.all);

  districtTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      districtTabs.forEach((button) => button.classList.remove("active"));
      tab.classList.add("active");
      renderDistrictDescription(districtTexts[tab.dataset.district]);
    });
  });
}

if (postForm) {
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector("#postTitle");
    const body = document.querySelector("#postBody");
    const item = document.createElement("li");

    item.innerHTML = `<strong></strong><span></span>`;
    item.querySelector("strong").textContent = title.value.trim();
    item.querySelector("span").textContent = body.value.trim();
    posts.prepend(item);
    postForm.reset();
  });
}

if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    inquiryMessage.textContent = "문의가 접수되었습니다.";
    inquiryForm.reset();
  });
}

const areaScores = {
  중구: { traffic: 82, job: 68, housing: 78, life: 88, stability: 72, welfare: 78 },
  남구: { traffic: 92, job: 88, housing: 60, life: 95, stability: 76, welfare: 82 },
  동구: { traffic: 66, job: 92, housing: 72, life: 72, stability: 70, welfare: 68 },
  북구: { traffic: 76, job: 94, housing: 76, life: 78, stability: 82, welfare: 72 },
  울주군: { traffic: 58, job: 76, housing: 88, life: 66, stability: 90, welfare: 70 },
};

const typeRecommendations = {
  young: {
    areas: ["남구", "중구"],
    reason: "취업 준비 청년은 교통, 상권, 생활편의 접근성이 높은 남구와 중구가 적합합니다.",
  },
  car: {
    areas: ["북구"],
    reason: "자동차 산업 근로자는 현대자동차와 산업단지 접근성이 좋은 북구를 우선 추천합니다.",
  },
  ship: {
    areas: ["동구"],
    reason: "조선업 근로자는 현대중공업과 방어진 생활권이 가까운 동구가 적합합니다.",
  },
  family: {
    areas: ["남구", "울주군"],
    reason: "가족 단위는 생활편의가 좋은 남구와 안정적 주거 환경을 찾기 좋은 울주군을 추천합니다.",
  },
  nature: {
    areas: ["울주군"],
    reason: "자연과 관광 자원을 선호하면 영남알프스와 간절곶이 있는 울주군이 잘 맞습니다.",
  },
  oldtown: {
    areas: ["중구"],
    reason: "원도심 생활을 선호하면 성남동과 태화강국가정원 접근성이 좋은 중구를 추천합니다.",
  },
};

const distanceMinutes = {
  hyundaiCar: { 중구: 28, 남구: 30, 동구: 42, 북구: 10, 울주군: 45 },
  hyundaiShip: { 중구: 34, 남구: 38, 동구: 8, 북구: 30, 울주군: 58 },
  ulsanCityHall: { 중구: 18, 남구: 8, 동구: 35, 북구: 30, 울주군: 34 },
  koreaEnergy: { 중구: 36, 남구: 34, 동구: 62, 북구: 48, 울주군: 12 },
  university: { 중구: 26, 남구: 16, 동구: 42, 북구: 38, 울주군: 22 },
};

const showRecommendations = (areas, reason) => {
  if (!recommendList || !recommendReason) return;

  recommendList.textContent = "";
  areas.forEach((area) => {
    const item = document.createElement("li");
    item.textContent = area;
    recommendList.append(item);
  });
  recommendReason.textContent = reason;
};

const updateWeightOutputs = () => {
  document.querySelectorAll("[data-weight]").forEach((input) => {
    const output = document.querySelector(`[data-weight-value="${input.dataset.weight}"]`);
    if (output) output.value = input.value;
  });
};

const getWeightedRecommendations = () => {
  const weights = {};
  document.querySelectorAll("[data-weight]").forEach((input) => {
    weights[input.dataset.weight] = Number(input.value);
  });

  const ranked = Object.entries(areaScores)
    .map(([area, scores]) => {
      const total = Object.entries(weights).reduce((sum, [key, weight]) => sum + scores[key] * (weight / 100), 0);
      return { area, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return {
    areas: ranked.map((item) => `${item.area} ${item.total.toFixed(1)}점`),
    reason: "",
  };
};

const getSurveyRecommendations = () => {
  const values = Object.fromEntries(
    Array.from(document.querySelectorAll("[data-survey]")).map((select) => [select.dataset.survey, select.value]),
  );
  const points = { 중구: 0, 남구: 0, 동구: 0, 북구: 0, 울주군: 0 };

  if (values.work === "nam") points.남구 += 35;
  if (values.work === "buk") points.북구 += 35;
  if (values.work === "dong") points.동구 += 35;
  if (values.work === "ulju") points.울주군 += 35;
  if (values.traffic === "high") points.남구 += 20, points.중구 += 18;
  if (values.budget === "low") points.중구 += 12, points.울주군 += 16, points.북구 += 10;
  if (values.budget === "high") points.남구 += 14;
  if (values.amenity === "life") points.남구 += 18, points.중구 += 14;
  if (values.amenity === "nature") points.울주군 += 22, points.중구 += 10;
  if (values.amenity === "market") points.남구 += 20, points.중구 += 14;
  if (values.mood === "quiet") points.울주군 += 18, points.북구 += 10;
  if (values.mood === "busy") points.남구 += 18, points.중구 += 12;

  const ranked = Object.entries(points).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return {
    areas: ranked.map(([area, score]) => `${area} ${score}점`),
    reason: "설문 답변에 따라 교통, 직장 접근성, 예산, 생활편의, 동네 분위기를 고려하여 추천하였습니다.",
  };
};

const getDistanceRecommendations = () => {
  const base = document.querySelector("#distanceBase")?.value || "hyundaiCar";
  const mode = document.querySelector("#distanceMode")?.value || "car";
  const penalty = mode === "transit" ? 1.2 : 1;
  const ranked = Object.entries(distanceMinutes[base])
    .map(([area, minutes]) => ({ area, score: Math.max(0, 100 - minutes * penalty) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    areas: ranked.map((item) => `${item.area} ${item.score.toFixed(0)}점`),
    reason: "대중교통 선택 시 이동 부담을 조금 더 크게 반영합니다.",
  };
};

const getAiRecommendations = () => {
  const text = document.querySelector("#aiInput")?.value || "";
  const points = { 중구: 0, 남구: 0, 동구: 0, 북구: 0, 울주군: 0 };

  if (/청년|대중교통|버스|상권|번화/.test(text)) points.남구 += 20, points.중구 += 15;
  if (/북구|자동차|현대자동차/.test(text)) points.북구 += 35;
  if (/동구|조선|현대중공업|방어진/.test(text)) points.동구 += 35;
  if (/자연|조용|관광|영남알프스|간절곶|저렴|월세/.test(text)) points.울주군 += 24;
  if (/원도심|태화강|성남동|문화/.test(text)) points.중구 += 24;
  if (/시청|삼산|달동|신정|마트|병원/.test(text)) points.남구 += 24;

  const ranked = Object.entries(points).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return {
    areas: ranked.map(([area, score]) => `${area} ${score}점`),
    reason: "입력 문장에서 교통, 직장, 예산, 자연, 상권 관련 키워드를 찾아 지역별 점수로 변환했습니다.",
  };
};

const updateRecommendation = () => {
  const activeMethod = document.querySelector(".recommend-tab.active")?.dataset.method;
  updateWeightOutputs();
  let result = getWeightedRecommendations();

  if (activeMethod === "survey") result = getSurveyRecommendations();
  if (activeMethod === "type") {
    const activeType = document.querySelector(".type-option.active")?.dataset.type || "young";
    result = typeRecommendations[activeType];
  }
  if (activeMethod === "distance") result = getDistanceRecommendations();
  if (activeMethod === "ai") result = getAiRecommendations();

  showRecommendations(result.areas, result.reason);
};

if (recommendTabs.length) {
  recommendTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      recommendTabs.forEach((button) => button.classList.remove("active"));
      recommendPanels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-panel="${tab.dataset.method}"]`)?.classList.add("active");
      updateRecommendation();
    });
  });

  document.querySelectorAll("[data-weight], [data-survey], #distanceBase, #distanceMode, #aiInput").forEach((control) => {
    control.addEventListener("input", updateRecommendation);
    control.addEventListener("change", updateRecommendation);
  });

  document.querySelectorAll(".type-option").forEach((option) => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".type-option").forEach((button) => button.classList.remove("active"));
      option.classList.add("active");
      updateRecommendation();
    });
  });

  updateRecommendation();
}
