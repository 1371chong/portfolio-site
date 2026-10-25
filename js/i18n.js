(() => {
  const translations = {
    ko: {
      nav: ['HOME', 'ABOUT', 'PORTFOLIO', 'SKILLS', 'WORKSPACE', 'WORKFLOW', 'NOTICES', 'FAQ', '외주서비스', '관리자'],
      heroDescriptions: [
        '체계적인 프로세스와 압도적인 모션그래픽·웹 개발로 브랜드의 가치를 높입니다.',
        '움직임과 입체감으로 브랜드의 이야기를 선명하게 전합니다.',
        '기획부터 구현까지, 브랜드에 필요한 디지털 경험을 만듭니다.'
      ],
      ctas: ['포트폴리오 보기', '프로젝트 문의하기'], portfolioHeading: 'PORTFOLIO',
      portfolioIntro: '브랜드와 아이디어를 시각적인 결과물로 완성한 작업을 소개합니다.',
      searchLabel: '프로젝트 검색', searchPlaceholder: '프로젝트 검색 (예: 모션그래픽, 웹예능, 유튜브 홍보영상)...',
      emptySearch: '검색 결과가 없습니다. 다른 단어로 검색해 보세요.', projectDetails: '프로젝트 상세',
      portfolioSortLabel: '작품 정렬', sortNewest: '최신순', sortViews: '조회순', sortTitle: '제목순',
      projectOverview: '프로젝트 개요', projectStory: '제작 과정과 결과',
      categories: { all: '전체', '전체': '전체', '모션그래픽': '모션그래픽', '3D 비주얼': '3D 비주얼', '타이포그래픽': '타이포그래픽', '광고영상': '광고영상', '웹예능': '웹예능', '유튜브 홍보영상': '유튜브 홍보영상', '기타': '기타', '웹사이트': '웹사이트', '자동화·봇': '자동화·봇' },
      noticeCategories: { all: '전체', notice: '공지사항', update: '업데이트', work: '작업 소식', other: '기타' },
      labels: ['담당 역할', '사용 툴', '목표', '제작 과정', '결과'], previous: '← 이전 작품', next: '다음 작품 →',
      projectLink: '프로젝트 상세 보기', views: '조회수', share: '프로젝트 공유 링크 복사', copied: '링크 복사 완료',
      external: 'Google Drive에서 보기', youtube: 'YouTube에서 보기', noMedia: '등록된 영상이 없습니다.',
      toggle: 'KO', toggleLabel: '언어 선택', close: '프로젝트 상세 닫기', prevSlide: '이전 슬라이드', nextSlide: '다음 슬라이드',
      pause: '자동 재생 일시 정지', play: '자동 재생 시작',
      faqIntro: '프로젝트 의뢰 전, 자주 궁금해하시는 내용을 확인해 보세요.',
      faqMaterialsQ: 'Q. 의뢰 전에 어떤 자료를 준비하면 되나요?',
      faqMaterialsA: '프로젝트 목적, 결과물 길이와 화면 비율, 참고 자료, 희망 일정과 예산을 준비해 크몽 문의에 남겨 주세요. 제공 자료의 사용 권한이나 라이선스 제한이 있다면 함께 알려 주세요.',
      faqSourceQ: 'Q. 작업 원본 파일도 받을 수 있나요?',
      faqSourceA: '납품 형식과 원본 파일 제공 여부는 프로젝트마다 다릅니다. 필요한 파일 형식을 주문 전에 알려 주시면 제공 가능 여부와 범위, 비용을 함께 확인해 드립니다.',
      faqUsageQ: 'Q. 완성된 결과물을 상업적으로 사용할 수 있나요?',
      faqUsageA: '결과물의 사용 목적과 범위는 주문별 합의에 따라 정합니다. 광고, SNS, 방송 등 사용할 매체와 활용 범위를 주문 전에 알려 주시면 계약 내용에 반영해 안내해 드립니다.',
      faqShowcaseQ: 'Q. 작업물이나 제작 과정을 포트폴리오에 공개하나요?',
      faqShowcaseA: '공개 여부와 시점은 의뢰인과 사전에 협의합니다. 별도 공개 동의나 합의가 없는 작업물, 의뢰인의 식별 정보와 비공개 자료는 포트폴리오에 게시하지 않습니다.',
      faqProcessQ: 'Q. 외주 작업 의뢰는 어떤 절차로 진행되나요?',
      faqProcessA: '외주 서비스 페이지의 크몽 문의 링크를 눌러 프로젝트 개요, 예산, 마감일을 남겨 주시면 상담과 견적을 안내해 드립니다.',
      faqScopeQ: 'Q. 제작 가능한 프로젝트의 전문 분야 범위는 어떻게 되나요?',
      faqScopeA: '주요 분야는 영상 편집, 2D·3D 모션그래픽 및 3D 비주얼 제작입니다. 진행 가능한 작업 범위와 조건은 크몽 서비스 페이지에서 확인해 주세요.',
      faqTimelineQ: 'Q. 작업 기간과 수정(피드백) 반영은 어떻게 이루어지나요?',
      faqTimelineA: '프로젝트 규모와 난이도에 따라 일정을 조율하며, 기획 단계에서 충분히 협의한 뒤 본 작업에 착수합니다. 수정 요청은 사전 합의된 범위 안에서 반영합니다.',
      faqPriceQ: 'Q. 서비스 비용과 예상 작업 기간은 어떻게 확인하나요?',
      faqPriceA: '영상·모션그래픽과 3D 비주얼 서비스의 가격과 예상 기간은 작업 범위, 결과물 규격, 일정에 따라 달라집니다. 외주서비스 페이지에서 크몽 상품의 최신 가격과 구성을 확인하고, 세부 범위를 정한 뒤 확정 견적과 일정을 안내받으실 수 있습니다.',
      latestNotice: '최신 공지', noticeSearchLabel: '공지사항 검색', noticeSearchPlaceholder: '공지 제목이나 내용 검색',
      noticeIntro: '작업 소식과 스튜디오의 새로운 소식을 확인하세요.',
      expertiseIntro: '모션그래픽부터 3D 비주얼까지, 프로젝트에 맞는 도구로 아이디어를 결과물로 만듭니다.',
      workspaceHeading: 'WORK ENVIRONMENT', workspaceIntro: '영상 편집과 모션그래픽, 3D 제작에 사용하는 작업 환경을 소개합니다.',
      workspaceStatus: '현재 작업 환경', workspaceHardware: '작업용 PC 사양',
      workspaceHardwareNote: '영상 편집·모션그래픽·3D 비주얼 제작에 사용하는 작업용 PC 구성입니다.',
      workspaceCpu: 'Intel Core i7-8700K', workspaceGpu: 'NVIDIA GeForce RTX 3060 · 12GB',
      workspaceMemory: '32GB', workspacePower: '마이크로닉스 700W', workspaceOs: 'Windows 11 Pro 정품', workspaceSoftware: '주요 제작 소프트웨어',
      workspaceSoftwareNote: '프로젝트 성격과 결과물에 맞춰 적합한 도구를 선택합니다.'
    },
    en: {
      nav: ['HOME', 'ABOUT', 'PORTFOLIO', 'SKILLS', 'WORKSPACE', 'WORKFLOW', 'NOTICES', 'FAQ', 'Services', 'Admin'],
      heroDescriptions: [
        'We elevate brands through a thoughtful process, motion graphics, and web development.',
        'We bring brand stories to life with motion and dimensional visuals.',
        'From concept to implementation, we build digital experiences for your brand.'
      ],
      ctas: ['Explore portfolio', 'Discuss your project'], portfolioHeading: 'PORTFOLIO',
      portfolioIntro: 'Selected work that turns brand ideas into visual experiences.',
      searchLabel: 'Search projects', searchPlaceholder: 'Search projects (e.g. motion graphics, web, video)...',
      emptySearch: 'No projects found. Try another search term.', projectDetails: 'Project details',
      portfolioSortLabel: 'Sort projects', sortNewest: 'Newest', sortViews: 'Most viewed', sortTitle: 'Title',
      projectOverview: 'Project overview', projectStory: 'Process and outcome',
      categories: { all: 'All', '전체': 'All', '모션그래픽': 'Motion Graphics', '3D 비주얼': '3D Visual', '타이포그래픽': 'Typography', '광고영상': 'Advertising', '웹예능': 'Web Variety', '유튜브 홍보영상': 'YouTube Promo', '기타': 'Other', '웹사이트': 'Web', '자동화·봇': 'Automation' },
      noticeCategories: { all: 'All', notice: 'Notices', update: 'Updates', work: 'Studio work', other: 'Other' },
      labels: ['Role', 'Tools', 'Objective', 'Process', 'Outcome'], previous: '← Previous project', next: 'Next project →',
      projectLink: 'View project details', views: 'Views', share: 'Copy project link', copied: 'Link copied',
      external: 'Open in Google Drive', youtube: 'Watch on YouTube', noMedia: 'No media has been added.',
      toggle: 'EN', toggleLabel: 'Choose language', close: 'Close project details', prevSlide: 'Previous slide', nextSlide: 'Next slide',
      pause: 'Pause autoplay', play: 'Start autoplay',
      faqIntro: 'Find answers to common questions before starting a project.',
      faqMaterialsQ: 'Q. What should I prepare before placing an order?',
      faqMaterialsA: 'Please share the project goal, output length and aspect ratio, references, preferred schedule, and budget in your Kmong inquiry. Let us know about usage rights or license restrictions for any supplied materials.',
      faqSourceQ: 'Q. Can I receive the original project files?',
      faqSourceA: 'Delivery formats and source-file availability vary by project. Tell us which file formats you need before ordering so we can confirm availability, scope, and cost.',
      faqUsageQ: 'Q. Can I use the finished work commercially?',
      faqUsageA: 'The permitted purpose and scope of use are agreed for each order. Tell us where you plan to use the work, such as advertising, social media, or broadcast, before ordering so we can include it in the agreement.',
      faqShowcaseQ: 'Q. Will you publish the work or production process in your portfolio?',
      faqShowcaseA: 'We agree on whether and when to publish in advance. Work, identifying information, and confidential materials are not posted without separate permission or agreement.',
      faqProcessQ: 'Q. How do I start a project?',
      faqProcessA: 'Use the Kmong inquiry link on the outsourcing page and share your project overview, budget, and deadline. We will discuss the project and provide a quote.',
      faqScopeQ: 'Q. What types of projects do you specialize in?',
      faqScopeA: 'Our main areas are video editing, 2D and 3D motion graphics, and 3D visual production. Please check the Kmong service page for available scope and terms.',
      faqTimelineQ: 'Q. How long does a project take, and how are revisions handled?',
      faqTimelineA: 'We set the schedule based on the project size and complexity, and begin production after discussing the plan. Revisions are handled within the scope agreed in advance.',
      faqPriceQ: 'Q. Where can I check pricing and estimated timelines?',
      faqPriceA: 'Pricing and timelines for video, motion graphics, and 3D visuals depend on the scope, deliverable specifications, and schedule. Check the latest packages and prices on the outsourcing page; we can confirm a quote and schedule once the details are agreed.',
      latestNotice: 'Latest notice', noticeSearchLabel: 'Search notices', noticeSearchPlaceholder: 'Search notice titles or content',
      noticeIntro: 'Project updates and the latest news from the studio.',
      expertiseIntro: 'From motion graphics to 3D visuals, we turn ideas into finished work with the right tools for each project.',
      workspaceHeading: 'WORK ENVIRONMENT', workspaceIntro: 'A look at the tools and workstation used for video, motion graphics, and 3D production.',
      workspaceStatus: 'CURRENT WORKSTATION', workspaceHardware: 'Workstation specifications',
      workspaceHardwareNote: 'The PC configuration used for video editing, motion graphics, and 3D visual production.',
      workspaceCpu: 'Intel Core i7-8700K', workspaceGpu: 'NVIDIA GeForce RTX 3060 · 12GB',
      workspaceMemory: '32GB', workspacePower: 'Micronics 700W', workspaceOs: 'Genuine Windows 11 Pro', workspaceSoftware: 'Production software',
      workspaceSoftwareNote: 'Tools are selected to suit each project and its deliverables.'
    },
    ja: {
      nav: ['ホーム', 'プロフィール', 'ポートフォリオ', '専門分野', '制作環境', '制作の流れ', 'お知らせ', 'よくある質問', 'サービス', '管理者'],
      heroDescriptions: [
        '丁寧なプロセスとモーショングラフィックス、Web制作でブランドの価値を高めます。',
        '動きと立体感で、ブランドのストーリーを鮮明に伝えます。',
        '企画から実装まで、ブランドに必要なデジタル体験をつくります。'
      ],
      ctas: ['制作実績を見る', 'プロジェクトを相談する'], portfolioHeading: 'PORTFOLIO',
      portfolioIntro: 'ブランドやアイデアを視覚的な成果物へと形にした制作実績をご紹介します。',
      searchLabel: 'プロジェクト検索', searchPlaceholder: 'モーショングラフィックス、動画などで検索',
      emptySearch: '該当する作品がありません。別のキーワードをお試しください。', projectDetails: 'プロジェクト詳細',
      portfolioSortLabel: '作品の並び替え', sortNewest: '新着順', sortViews: '閲覧数順', sortTitle: 'タイトル順',
      projectOverview: 'プロジェクト概要', projectStory: '制作プロセスと成果',
      categories: { all: 'すべて', '전체': 'すべて', '모션그래픽': 'モーショングラフィックス', '3D 비주얼': '3Dビジュアル', '타이포그래픽': 'タイポグラフィ', '광고영상': '広告映像', '웹예능': 'Webバラエティ', '유튜브 홍보영상': 'YouTubeプロモーション', '기타': 'その他', '웹사이트': 'Webサイト', '자동화·봇': '自動化・ボット' },
      noticeCategories: { all: 'すべて', notice: 'お知らせ', update: 'アップデート', work: '制作ニュース', other: 'その他' },
      labels: ['担当内容', '使用ツール', '目的', '制作プロセス', '成果'], previous: '← 前の作品', next: '次の作品 →',
      projectLink: 'プロジェクト詳細を見る', views: '閲覧数', share: 'プロジェクトリンクをコピー', copied: 'リンクをコピーしました',
      external: 'Google Driveで見る', youtube: 'YouTubeで見る', noMedia: '動画は登録されていません。',
      toggle: 'JA', toggleLabel: '言語を選択', close: 'プロジェクト詳細を閉じる', prevSlide: '前のスライド', nextSlide: '次のスライド',
      pause: '自動再生を一時停止', play: '自動再生を開始',
      faqIntro: 'ご依頼の前によくある質問をご確認ください。',
      faqMaterialsQ: 'Q. 依頼前に準備するものはありますか？',
      faqMaterialsA: 'プロジェクトの目的、成果物の長さや画面比率、参考資料、ご希望の納期と予算をご用意ください。素材の使用権やライセンス上の制限がある場合は、あわせてお知らせください。',
      faqSourceQ: 'Q. 制作データも受け取れますか？',
      faqSourceA: '納品形式や制作データの提供可否はプロジェクトによって異なります。必要なファイル形式を事前にお知らせいただければ、対応範囲と費用をご案内します。',
      faqUsageQ: 'Q. 完成した成果物を商用利用できますか？',
      faqUsageA: '利用目的と範囲はご依頼ごとに合意して決定します。広告、SNS、放送などの利用媒体と範囲を事前にお知らせください。',
      faqShowcaseQ: 'Q. 制作物や制作過程はポートフォリオに掲載されますか？',
      faqShowcaseA: '掲載の可否と時期は事前にご相談します。個別の許可や合意がない制作物、個人を特定できる情報、非公開資料は掲載しません。',
      faqProcessQ: 'Q. 制作依頼はどのように進みますか？',
      faqProcessA: 'サービスページのKmongお問い合わせリンクから、概要・予算・納期をお知らせください。内容を確認し、ご相談とお見積もりをご案内します。',
      faqScopeQ: 'Q. どのような分野の制作に対応していますか？',
      faqScopeA: '動画編集、2D・3Dモーショングラフィックス、3Dビジュアル制作を中心に対応しています。詳細な範囲と条件はKmongのサービスページをご確認ください。',
      faqTimelineQ: 'Q. 制作期間や修正対応について教えてください。',
      faqTimelineA: 'プロジェクトの規模と難易度に応じてスケジュールを調整し、内容を確認してから制作を開始します。修正は事前に合意した範囲で対応します。',
      faqPriceQ: 'Q. 料金と制作期間はどこで確認できますか？',
      faqPriceA: '料金と期間は制作範囲、成果物の仕様、スケジュールによって異なります。サービスページで最新のプランをご確認ください。詳細決定後にお見積もりと納期をご案内します。',
      latestNotice: '最新のお知らせ', noticeSearchLabel: 'お知らせを検索', noticeSearchPlaceholder: 'タイトルや内容を検索',
      noticeIntro: '制作の進捗やスタジオからのお知らせをご覧いただけます。',
      expertiseIntro: 'モーショングラフィックスから3Dビジュアルまで、プロジェクトに適したツールでアイデアを形にします。',
      workspaceHeading: 'WORK ENVIRONMENT', workspaceIntro: '動画編集、モーショングラフィックス、3D制作に使用する作業環境をご紹介します。',
      workspaceStatus: '現在の制作環境', workspaceHardware: '制作PCの仕様',
      workspaceHardwareNote: '動画編集、モーショングラフィックス、3Dビジュアル制作に使用しているPC構成です。',
      workspaceCpu: 'Intel Core i7-8700K', workspaceGpu: 'NVIDIA GeForce RTX 3060 · 12GB',
      workspaceMemory: '32GB', workspacePower: 'Micronics 700W', workspaceOs: '正規版 Windows 11 Pro',
      workspaceSoftware: '主な制作ソフトウェア', workspaceSoftwareNote: 'プロジェクトの内容と成果物に合わせてツールを選択します。'
    }
  };
  const supportedLanguages = ['ko', 'en', 'ja'];
  const savedLanguage = localStorage.getItem('jwb-language');
  let language = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'ko';
  const dict = () => translations[language];
  window.JWB_I18N = {
    get language() { return language; },
    t(key) { return dict()[key] ?? key; },
    category(label) { return dict().categories[label] || label; },
    refresh() { applyLanguage(); window.dispatchEvent(new CustomEvent('jwb:languagechange', { detail: { language } })); }
  };

  function applyLanguage() {
    const t = dict();
    document.documentElement.lang = language;
    const navLinks = [...document.querySelectorAll('#site-nav-menu > li > a')];
    navLinks.forEach((link, i) => {
      const index = Number.isInteger(Number(link.dataset.navIndex)) ? Number(link.dataset.navIndex) : i;
      if (t.nav[index]) link.textContent = t.nav[index];
    });
    document.querySelectorAll('.hero-desc').forEach((el, i) => { el.textContent = t.heroDescriptions[i] || el.textContent; });
    document.querySelectorAll('.hero-cta').forEach((el, i) => {
      const arrow = el.querySelector('span');
      el.firstChild.nodeValue = `${t.ctas[i] || t.ctas[0]} `;
      if (arrow) el.append(arrow);
    });
    const searchLabel = document.querySelector('[data-i18n="searchLabel"]');
    if (searchLabel) searchLabel.textContent = t.searchLabel;
    const search = document.getElementById('work-search-input');
    if (search) search.placeholder = t.searchPlaceholder;
    const noticeSearch = document.getElementById('notice-search');
    if (noticeSearch) noticeSearch.placeholder = t.noticeSearchPlaceholder;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) el.textContent = t[key];
    });
    const toggle = document.getElementById('language-toggle');
    if (toggle) { toggle.textContent = t.toggle; toggle.setAttribute('aria-label', t.toggleLabel); }
    document.querySelectorAll('#language-menu [data-language]').forEach(option => {
      const selected = option.dataset.language === language;
      option.setAttribute('aria-pressed', String(selected));
      option.classList.toggle('is-selected', selected);
    });
    document.getElementById('project-modal-close')?.setAttribute('aria-label', t.close);
    document.querySelector('[data-hero-direction="prev"]')?.setAttribute('aria-label', t.prevSlide);
    document.querySelector('[data-hero-direction="next"]')?.setAttribute('aria-label', t.nextSlide);
    const autoplay = document.querySelector('.hero-autoplay');
    if (autoplay) autoplay.setAttribute('aria-label', autoplay.getAttribute('aria-pressed') === 'true' ? t.play : t.pause);
    document.getElementById('project-prev')?.replaceChildren(document.createTextNode(t.previous));
    document.getElementById('project-next')?.replaceChildren(document.createTextNode(t.next));
    const share = document.getElementById('project-share');
    if (share && !share.dataset.copied) share.textContent = t.share;
    window.dispatchEvent(new CustomEvent('jwb:languagechange', { detail: { language } }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('language-toggle');
    const menu = document.getElementById('language-menu');
    const setLanguageMenuOpen = open => {
      if (!toggle || !menu) return;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle?.addEventListener('click', () => setLanguageMenuOpen(menu?.hidden ?? true));
    menu?.querySelectorAll('[data-language]').forEach(option => option.addEventListener('click', () => {
      if (supportedLanguages.includes(option.dataset.language)) {
        language = option.dataset.language;
        localStorage.setItem('jwb-language', language);
        applyLanguage();
      }
      setLanguageMenuOpen(false);
      toggle?.focus();
    }));
    document.addEventListener('click', event => {
      if (!event.target.closest('.language-control')) setLanguageMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu && !menu.hidden) {
        setLanguageMenuOpen(false);
        toggle?.focus();
      }
    });
    applyLanguage();
  });
})();
