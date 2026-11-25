(() => {
  const translations = {
    ko: {
      nav: ['홈', '소개', '포트폴리오', '전문 분야', '작업 환경', '작업 과정', '공지사항', '자주 묻는 질문', '외주서비스', '관리자'],
      guideMenu: '이용안내', workflowMenu: '작업 과정', portfolioMenu: '포트폴리오', outsourcingMenu: '외주서비스',
      navHome: '홈', navAbout: '소개', navExpertise: '전문 분야', navWorkspace: '작업 환경', faqMenu: '자주 묻는 질문', navAdmin: '관리자', termsMenu: '이용약관', privacyMenu: '개인정보처리방침', emailPolicyMenu: '이메일 무단 수집 거부', charterMenu: '이용자 권리 헌장', portfolioDisclaimer: '본 사이트는 상업적 목적이 아닌 개인 포트폴리오 사이트로 제작되었습니다.',
      outsourcingPageTitle: '외주서비스 | JWB STUDIO', outsourcingMetaTitle: '외주 서비스 | JWB STUDIO', outsourcingMetaDescription: 'JWB STUDIO의 모션그래픽, 3D 비주얼, 영상·웹 제작 외주 서비스입니다. 크몽에서 의뢰할 수 있습니다.', outsourcingCreativeServices: '크리에이티브 서비스', outsourcingHeroTitleA: '브랜드의 다음 장면을', outsourcingHeroTitleB: '완성도 있게 만듭니다.', outsourcingHeroDescription: '모션그래픽과 3D 비주얼로 아이디어를 선명한 결과물로 완성합니다. 프로젝트의 목적과 활용 방식에 맞춰 작업 범위부터 함께 정합니다.', outsourcingBrowseServices: '서비스 살펴보기', outsourcingPrepareInquiry: '문의 준비하기', outsourcingScroll: '서비스 둘러보기', outsourcingServiceGuide: 'SERVICE GUIDE', outsourcingServiceHeading: '서비스 분야 및 안내', outsourcingServiceIntro: '작업 범위와 기본 금액은 프로젝트 규모와 크몽 상품 구성에 따라 달라질 수 있습니다. 최신 구성과 가격은 각 서비스 페이지에서 확인해 주세요.', outsourcingMotionTitle: '영상 제작 & 모션그래픽', outsourcingMotionDescription: '브랜드·제품·서비스에 어울리는 영상과 모션그래픽 제작을 상담합니다.', outsourcingMotionFeature1: '브랜드·제품 소개 영상', outsourcingMotionFeature2: '2D 모션그래픽과 편집', outsourcingMotionFeature3: '목적에 맞춘 결과물 규격', outsourcingPriceLabel: '시작 가격', outsourcingPriceFallback: '크몽에서 확인', outsourcingDurationLabel: '예상 작업 기간', outsourcingDurationFallback: '범위 확정 후 안내', outsourcingViewService: '서비스 보기', outsourcing3DTitle: '3D 비주얼라이제이션', outsourcing3DDescription: '프로젝트 목적과 활용 매체에 맞는 3D 비주얼 작업 범위를 협의합니다.', outsourcing3DFeature1: '제품·공간 3D 비주얼', outsourcing3DFeature2: '3D 모션그래픽', outsourcing3DFeature3: '온라인·영상용 렌더링', outsourcingBeforeOrder: 'BEFORE YOU ORDER', outsourcingPrepHeading: '크몽 문의 전 준비하면 좋은 내용', outsourcingPrepIntro: '아래 내용을 정리해 두면 필요한 작업과 견적을 더 정확하게 상담할 수 있습니다.', outsourcingPrepItem1: '프로젝트 목적과 영상·3D 비주얼 사용처', outsourcingPrepItem2: '원하는 결과물의 길이·규격·화면 비율', outsourcingPrepItem3: '참고 이미지, 로고, 기존 자료 또는 레퍼런스', outsourcingPrepItem4: '희망 마감일과 중간 확인 일정', outsourcingPrepItem5: '예상 예산과 필요한 수정 범위', outsourcingPrepProgress: '준비 항목 {checked} / {total}', outsourcingPrepCta: '준비한 내용으로 크몽 문의하기', outsourcingKmongHeading: '크몽에서 프로젝트 의뢰하기', outsourcingKmongIntro: '서비스 상세 내용과 의뢰 절차를 확인하고 크몽에서 문의해 주세요.', outsourcingKmongCard: '프로젝트 내용과 참고 자료를 준비하셨다면 크몽 서비스 페이지에서 바로 상담을 시작할 수 있습니다.', outsourcingKmongCta: '크몽에서 의뢰·문의하기', outsourcingReviewLabel: '크몽 후기', outsourcingReviewTitle: '실제 리뷰와 평점 확인', outsourcingReviewDescription: '최신 후기와 평점은 크몽 서비스 페이지에서 확인해 주세요.', outsourcingReviewCta: '크몽 리뷰·평점 보기',
      workflowHeading: 'WORKFLOW', workflowDiscovery: 'DISCOVERY', workflowDiscoveryTitle: '문의 및 기획 상담', workflowDiscoveryText: '프로젝트 개요, 예산, 일정 및 참고 레퍼런스를 분석하여 최적의 방향성을 설정합니다.',
      workflowDirection: 'DIRECTION', workflowDirectionTitle: '콘티 및 시안 제작', workflowDirectionText: '상세 기획을 바탕으로 2D/3D 콘티 및 디자인 시안을 도출하여 세부 조율을 거칩니다.',
      workflowProduction: 'PRODUCTION', workflowProductionTitle: '본 작업 및 렌더링', workflowProductionText: '모션그래픽 애니메이션, 3D 렌더링 및 웹 인터랙션 구현 등 전문적인 본 제작을 진행합니다.',
      workflowDelivery: 'DELIVERY', workflowDeliveryTitle: '피드백 및 최종 전달', workflowDeliveryText: '클라이언트 피드백을 신속하게 반영한 후 고화질 최종 결과물과 소스를 안전하게 전달합니다.',
      workflowNoteTitle: '견적·수정·납품 안내', workflowNoteText: '견적은 작업 범위, 난이도, 일정과 필요한 산출물을 확인한 뒤 안내합니다. 작업 시작 전 수정 범위, 일정, 납품 형식과 원본 파일 제공 여부를 서면으로 확정합니다.',
      portfolioAll: '전체 포트폴리오', catMotion: '모션그래픽', cat3d: '3D 비주얼', catTypography: '타이포그래픽', catPoster: '포스터 디자인', catVarietyPoster: '예능 포스터', catAdvertising: '광고영상', catWebVariety: '웹예능', catYoutube: '유튜브 홍보영상', catWebsite: '웹사이트', catAutomation: '자동화·봇', catOther: '기타',
      heroDescriptions: [
        '체계적인 프로세스와 압도적인 모션그래픽·웹 개발로 브랜드의 가치를 높입니다.',
        '움직임과 입체감으로 브랜드의 이야기를 선명하게 전합니다.',
        '기획부터 구현까지, 브랜드에 필요한 디지털 경험을 만듭니다.',
        '2D·3D 그래픽과 영상, 웹 구현까지 아이디어를 완성도 높은 결과물로 만듭니다.',
        '브랜드의 목표와 분위기를 읽고, 목적이 분명한 시각 언어로 완성합니다.',
        '리듬과 타이밍을 설계해 핵심 메시지가 오래 기억되도록 전달합니다.',
        '다양한 화면과 환경에서도 자연스럽게 이어지는 디지털 경험을 만듭니다.',
        '처음 상담부터 최종 전달까지, 단계별 소통으로 방향을 함께 맞춥니다.',
        '작은 디테일까지 세심하게 다듬어 결과물의 완성도를 높입니다.',
        '함께 만들고 싶은 아이디어가 있다면 프로젝트 이야기를 들려주세요.'
      ],
      ctas: ['포트폴리오 보기', '프로젝트 문의하기', '작업 환경 보기', '전문 분야 보기', '작업물 확인하기', '작업 과정 보기', '작업 과정 보기', '작업 환경 보기', '프로젝트 문의하기'], portfolioHeading: 'PORTFOLIO',
      portfolioIntro: '브랜드와 아이디어를 시각적인 결과물로 완성한 작업을 소개합니다.', categoryPageIntro: '선택한 분야의 프로젝트와 제작 결과물을 확인해 보세요.',
      searchLabel: '프로젝트 검색', searchPlaceholder: '프로젝트 검색 (예: 모션그래픽, 웹예능, 유튜브 홍보영상)...',
      emptySearch: '검색 결과가 없습니다. 다른 단어로 검색해 보세요.', projectDetails: '프로젝트 상세',
      portfolioSortLabel: '작품 정렬', sortNewest: '최신순', sortViews: '조회순', sortTitle: '제목순', portfolioYearLabel: '작업 연도', yearAll: '전체 연도', favoriteAdd: '즐겨찾기 추가', favoriteRemove: '즐겨찾기 해제', favoritesOnly: '즐겨찾기만 보기', favoritesOnlyOn: '전체 작품 보기', favoritesEmpty: '저장한 즐겨찾기가 없습니다.',
      projectOverview: '프로젝트 개요', projectStory: '제작 과정과 결과',
      categories: { all: '전체', '전체': '전체', '모션그래픽': '모션그래픽', '3D 비주얼': '3D 비주얼', '타이포그래픽': '타이포그래픽', '포스터 디자인': '포스터 디자인', '예능 포스터': '예능 포스터', '광고영상': '광고영상', '웹예능': '웹예능', '유튜브 홍보영상': '유튜브 홍보영상', '기타': '기타', '웹사이트': '웹사이트', '자동화·봇': '자동화·봇' },
      noticeCategories: { all: '전체', notice: '공지사항', update: '업데이트', work: '작업 소식', event: '이벤트', maintenance: '점검 안내', other: '기타' },
      noticesMenu: '공지사항', noticeAll: '전체 공지', noticeCategoryNotice: '공지사항', noticeCategoryUpdate: '업데이트', noticeCategoryWork: '작업 소식', noticeCategoryEvent: '이벤트', noticeCategoryMaintenance: '점검 안내', noticeCategoryOther: '기타', noticeHeading: 'STUDIO NOTICES',
      websiteHistoryMenu: '웹사이트 연혁', websiteHistoryHeading: 'WEBSITE HISTORY', websiteHistoryIntro: '사이트에 추가된 기능과 디자인 변경, 운영 업데이트를 시간순으로 확인하세요.', historyLoading: '업데이트 내역을 불러오는 중입니다.', historyEmpty: '공개된 업데이트 내역이 없습니다.', historyError: '업데이트 내역을 불러오지 못했습니다.', historyFeature: '기능 추가', historyDesign: '디자인 변경', historyFix: '수정', historyOperations: '운영', historyDetails: '업데이트 상세 보기',
      inquiryStatusMenu: '문의 진행 확인', inquiryStatusHeading: '문의 진행 확인 서비스', inquiryStatusIntro: '관리자가 전달한 조회 코드와 발급번호를 모두 입력해 프로젝트 진행 상태를 확인하세요.', inquiryStatusCodeLabel: '문의 조회 코드', inquiryStatusCodePlaceholder: '예: JWB-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX', inquiryStatusIssueNumberLabel: '발급번호', inquiryStatusIssueNumberPlaceholder: '예: 1234-5678-9012', inquiryStatusSubmit: '진행 상태 확인', inquiryStatusLoading: '진행 상태를 확인하고 있습니다…', inquiryStatusNotFound: '조회 코드와 발급번호가 일치하지 않습니다. 전달받은 두 값을 확인한 후 다시 입력해 주세요.', inquiryStatusError: '상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.', inquiryStatusUpdated: '최근 업데이트', inquiryStatusLabel: '진행 상태', inquiryStatusProject: '프로젝트', inquiryReceived: '문의 접수', inquiryConsulting: '상담 중', inquiryInProgress: '작업 중', inquiryReview: '검토·피드백', inquiryCompleted: '완료', inquiryOnHold: '보류',
      labels: ['담당 역할', '사용 툴', '목표', '제작 과정', '결과'], previous: '← 이전 작품', next: '다음 작품 →',
      projectLink: '프로젝트 상세 보기', views: '조회수', share: '프로젝트 공유 링크 복사', copied: '링크 복사 완료',
      external: 'Google Drive에서 보기', youtube: 'YouTube에서 보기', noMedia: '등록된 영상이 없습니다.',
      toggle: 'KO', toggleLabel: '언어 선택', close: '프로젝트 상세 닫기', prevSlide: '이전 슬라이드', nextSlide: '다음 슬라이드',
      slideLabel: '{number}번 슬라이드',
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
      faqProcessA: '외주 서비스 페이지에서 원하는 서비스의 크몽 링크로 프로젝트 개요, 예산, 마감일을 남겨 주시면 상담과 견적을 안내해 드립니다.',
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
      workspaceMemory: '32GB · 3600MHz', workspacePower: '마이크로닉스 700W', workspaceOs: 'Windows 11 Pro 정품', workspaceSoftware: '주요 제작 소프트웨어',
      workspaceSoftwareNote: '프로젝트 성격과 결과물에 맞춰 적합한 도구를 선택합니다.'
    },
    en: {
      nav: ['HOME', 'ABOUT', 'PORTFOLIO', 'SKILLS', 'WORKSPACE', 'WORKFLOW', 'NOTICES', 'FAQ', 'Services', 'Admin'],
      guideMenu: 'Information', workflowMenu: 'Workflow', portfolioMenu: 'Portfolio', outsourcingMenu: 'Outsourcing',
      navHome: 'Home', navAbout: 'About', navExpertise: 'Expertise', navWorkspace: 'Workspace', faqMenu: 'FAQ', navAdmin: 'Admin', termsMenu: 'Terms of Service', privacyMenu: 'Privacy Policy', emailPolicyMenu: 'No Unauthorized Email Collection', charterMenu: 'User Rights Charter', portfolioDisclaimer: 'This website is a personal portfolio and is not intended for commercial purposes.',
      outsourcingPageTitle: 'Outsourcing Services | JWB STUDIO', outsourcingMetaTitle: 'Creative Services | JWB STUDIO', outsourcingMetaDescription: 'Motion graphics, 3D visuals, video, and web production services by JWB STUDIO. Available through Kmong.', outsourcingCreativeServices: 'CREATIVE SERVICES', outsourcingHeroTitleA: 'Shape the next chapter', outsourcingHeroTitleB: 'of your brand.', outsourcingHeroDescription: 'We turn ideas into clear, polished visuals with motion graphics and 3D. We define the scope together around your project goals and where the work will be used.', outsourcingBrowseServices: 'Explore services', outsourcingPrepareInquiry: 'Prepare an inquiry', outsourcingScroll: 'SCROLL TO EXPLORE', outsourcingServiceGuide: 'SERVICE GUIDE', outsourcingServiceHeading: 'Services & information', outsourcingServiceIntro: 'Scope and base pricing vary by project size and Kmong package. Check each service page for the latest offer and pricing.', outsourcingMotionTitle: 'Video production & motion graphics', outsourcingMotionDescription: 'Discuss video and motion graphics tailored to your brand, product, or service.', outsourcingMotionFeature1: 'Brand and product introduction videos', outsourcingMotionFeature2: '2D motion graphics and editing', outsourcingMotionFeature3: 'Deliverable formats suited to your goals', outsourcingPriceLabel: 'Starting price', outsourcingPriceFallback: 'Check on Kmong', outsourcingDurationLabel: 'Estimated timeline', outsourcingDurationFallback: 'Confirmed after scope review', outsourcingViewService: 'View service', outsourcing3DTitle: '3D visualization', outsourcing3DDescription: 'We define the 3D visual scope based on your project goals and intended channels.', outsourcing3DFeature1: 'Product and space visualization', outsourcing3DFeature2: '3D motion graphics', outsourcing3DFeature3: 'Rendering for web and video', outsourcingBeforeOrder: 'BEFORE YOU ORDER', outsourcingPrepHeading: 'What to prepare before contacting us on Kmong', outsourcingPrepIntro: 'Preparing the details below helps us discuss the right scope and provide a more accurate quote.', outsourcingPrepItem1: 'Project goals and where the video or 3D visuals will be used', outsourcingPrepItem2: 'Desired duration, specifications, and aspect ratio', outsourcingPrepItem3: 'Reference images, logos, existing materials, or examples', outsourcingPrepItem4: 'Preferred deadline and review milestones', outsourcingPrepItem5: 'Estimated budget and expected revision scope', outsourcingPrepProgress: 'Items prepared: {checked} / {total}', outsourcingPrepCta: 'Contact us on Kmong with these details', outsourcingKmongHeading: 'Start a project on Kmong', outsourcingKmongIntro: 'Review the service details and process, then send your inquiry through Kmong.', outsourcingKmongCard: 'Once your project brief and references are ready, you can start a consultation directly on the Kmong service page.', outsourcingKmongCta: 'Inquire on Kmong', outsourcingReviewLabel: 'Kmong reviews', outsourcingReviewTitle: 'See client reviews and ratings', outsourcingReviewDescription: 'Visit the Kmong service page for the latest reviews and ratings.', outsourcingReviewCta: 'View Kmong reviews and ratings',
      workflowHeading: 'WORKFLOW', workflowDiscovery: 'DISCOVERY', workflowDiscoveryTitle: 'Inquiry & project briefing', workflowDiscoveryText: 'We review the project brief, budget, schedule, and references to define the right direction.',
      workflowDirection: 'DIRECTION', workflowDirectionTitle: 'Storyboards & design concepts', workflowDirectionText: 'We develop 2D/3D storyboards and visual concepts from the brief, then refine the details together.',
      workflowProduction: 'PRODUCTION', workflowProductionTitle: 'Production & rendering', workflowProductionText: 'We produce the project, including motion graphics, 3D rendering, and web interactions as needed.',
      workflowDelivery: 'DELIVERY', workflowDeliveryTitle: 'Feedback & final delivery', workflowDeliveryText: 'We apply feedback within the agreed scope and securely deliver the final high-resolution files and assets.',
      workflowNoteTitle: 'Quotes, revisions & delivery', workflowNoteText: 'Quotes are based on scope, complexity, schedule, and deliverables. Before work begins, we confirm the revision scope, schedule, delivery format, and source-file availability in writing.',
      portfolioAll: 'All projects', catMotion: 'Motion Graphics', cat3d: '3D Visuals', catTypography: 'Typography', catPoster: 'Poster Design', catVarietyPoster: 'Entertainment Posters', catAdvertising: 'Advertising Videos', catWebVariety: 'Web Variety', catYoutube: 'YouTube Promos', catWebsite: 'Websites', catAutomation: 'Automation & Bots', catOther: 'Other',
      heroDescriptions: [
        'We elevate brands through a thoughtful process, motion graphics, and web development.',
        'We bring brand stories to life with motion and dimensional visuals.',
        'From concept to implementation, we build digital experiences for your brand.',
        'We turn ideas into polished results with 2D and 3D graphics, video, and web production.',
        'We translate your brand goals and character into a clear visual language.',
        'We shape rhythm and timing so your core message stays with its audience.',
        'We create digital experiences that feel natural across screens and devices.',
        'We align on direction through clear communication from first discussion to delivery.',
        'Careful attention to the smallest details raises the quality of every result.',
        'Have an idea you would like to build together? Tell us about your next project.'
      ],
      ctas: ['Explore portfolio', 'Discuss your project', 'Explore the workspace', 'Explore expertise', 'View selected work', 'See the workflow', 'See the workflow', 'Explore the workspace', 'Discuss your project'], portfolioHeading: 'PORTFOLIO',
      portfolioIntro: 'Selected work that turns brand ideas into visual experiences.', categoryPageIntro: 'Explore projects and finished work in this category.',
      searchLabel: 'Search projects', searchPlaceholder: 'Search projects (e.g. motion graphics, web, video)...',
      emptySearch: 'No projects found. Try another search term.', projectDetails: 'Project details',
      portfolioSortLabel: 'Sort projects', sortNewest: 'Newest', sortViews: 'Most viewed', sortTitle: 'Title', portfolioYearLabel: 'Year', yearAll: 'All years', favoriteAdd: 'Add to favorites', favoriteRemove: 'Remove from favorites', favoritesOnly: 'Favorites only', favoritesOnlyOn: 'Show all projects', favoritesEmpty: 'You have no saved favorites yet.',
      projectOverview: 'Project overview', projectStory: 'Process and outcome',
      categories: { all: 'All', '전체': 'All', '모션그래픽': 'Motion Graphics', '3D 비주얼': '3D Visual', '타이포그래픽': 'Typography', '포스터 디자인': 'Poster Design', '예능 포스터': 'Entertainment Poster', '광고영상': 'Advertising', '웹예능': 'Web Variety', '유튜브 홍보영상': 'YouTube Promo', '기타': 'Other', '웹사이트': 'Web', '자동화·봇': 'Automation' },
      noticeCategories: { all: 'All', notice: 'Notices', update: 'Updates', work: 'Studio work', event: 'Events', maintenance: 'Maintenance', other: 'Other' },
      noticesMenu: 'Notices', noticeAll: 'All notices', noticeCategoryNotice: 'Notices', noticeCategoryUpdate: 'Updates', noticeCategoryWork: 'Studio work', noticeCategoryEvent: 'Events', noticeCategoryMaintenance: 'Maintenance', noticeCategoryOther: 'Other', noticeHeading: 'STUDIO NOTICES',
      websiteHistoryMenu: 'Website history', websiteHistoryHeading: 'WEBSITE HISTORY', websiteHistoryIntro: 'Browse feature releases, design changes, and site updates in chronological order.', historyLoading: 'Loading website updates…', historyEmpty: 'There are no published updates yet.', historyError: 'Could not load website updates.', historyFeature: 'Feature', historyDesign: 'Design', historyFix: 'Fix', historyOperations: 'Operations', historyDetails: 'View update details',
      inquiryStatusMenu: 'Project status', inquiryStatusHeading: 'PROJECT STATUS', inquiryStatusIntro: 'Enter both the tracking code and issue number shared by the studio to check your project status.', inquiryStatusCodeLabel: 'Inquiry tracking code', inquiryStatusCodePlaceholder: 'e.g. JWB-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX', inquiryStatusIssueNumberLabel: 'Issue number', inquiryStatusIssueNumberPlaceholder: 'e.g. 1234-5678-9012', inquiryStatusSubmit: 'Check status', inquiryStatusLoading: 'Checking project status…', inquiryStatusNotFound: 'The tracking code and issue number do not match. Check both values and try again.', inquiryStatusError: 'Could not check the status. Please try again shortly.', inquiryStatusUpdated: 'Last updated', inquiryStatusLabel: 'Status', inquiryStatusProject: 'Project', inquiryReceived: 'Inquiry received', inquiryConsulting: 'Consultation', inquiryInProgress: 'In progress', inquiryReview: 'Review & feedback', inquiryCompleted: 'Completed', inquiryOnHold: 'On hold',
      labels: ['Role', 'Tools', 'Objective', 'Process', 'Outcome'], previous: '← Previous project', next: 'Next project →',
      projectLink: 'View project details', views: 'Views', share: 'Copy project link', copied: 'Link copied',
      external: 'Open in Google Drive', youtube: 'Watch on YouTube', noMedia: 'No media has been added.',
      toggle: 'EN', toggleLabel: 'Choose language', close: 'Close project details', prevSlide: 'Previous slide', nextSlide: 'Next slide',
      slideLabel: 'Slide {number}',
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
      workspaceMemory: '32GB · 3600MHz', workspacePower: 'Micronics 700W', workspaceOs: 'Genuine Windows 11 Pro', workspaceSoftware: 'Production software',
      workspaceSoftwareNote: 'Tools are selected to suit each project and its deliverables.'
    },
    ja: {
      nav: ['ホーム', 'プロフィール', 'ポートフォリオ', '専門分野', '制作環境', '制作の流れ', 'お知らせ', 'よくある質問', 'サービス', '管理者'],
      guideMenu: 'ご利用案内', workflowMenu: '制作の流れ', portfolioMenu: 'ポートフォリオ', outsourcingMenu: '外注サービス',
      navHome: 'ホーム', navAbout: '紹介', navExpertise: '専門分野', navWorkspace: '制作環境', faqMenu: 'よくある質問', navAdmin: '管理者', termsMenu: '利用規約', privacyMenu: 'プライバシーポリシー', emailPolicyMenu: 'メールアドレスの無断収集拒否', charterMenu: '利用者権利憲章', portfolioDisclaimer: '本サイトは商業目的ではなく、個人ポートフォリオとして制作されています。',
      outsourcingPageTitle: '外注サービス | JWB STUDIO', outsourcingMetaTitle: 'クリエイティブサービス | JWB STUDIO', outsourcingMetaDescription: 'JWB STUDIOのモーショングラフィックス、3Dビジュアル、映像・ウェブ制作サービスです。Kmongからご依頼いただけます。', outsourcingCreativeServices: 'クリエイティブサービス', outsourcingHeroTitleA: 'ブランドの次のシーンを', outsourcingHeroTitleB: '高い完成度で形にします。', outsourcingHeroDescription: 'モーショングラフィックスと3Dビジュアルで、アイデアを鮮明な成果物に仕上げます。プロジェクトの目的と用途に合わせて、制作範囲を一緒に決めます。', outsourcingBrowseServices: 'サービスを見る', outsourcingPrepareInquiry: 'お問い合わせの準備', outsourcingScroll: 'サービスを見る', outsourcingServiceGuide: 'サービス案内', outsourcingServiceHeading: 'サービス内容とご案内', outsourcingServiceIntro: '制作範囲と基本料金は、プロジェクトの規模やKmongのプランによって異なります。最新の内容と料金は各サービスページをご確認ください。', outsourcingMotionTitle: '映像制作・モーショングラフィックス', outsourcingMotionDescription: 'ブランド・製品・サービスに合わせた映像とモーショングラフィックスをご相談いただけます。', outsourcingMotionFeature1: 'ブランド・製品紹介映像', outsourcingMotionFeature2: '2Dモーショングラフィックスと編集', outsourcingMotionFeature3: '目的に合わせた納品形式', outsourcingPriceLabel: '開始価格', outsourcingPriceFallback: 'Kmongで確認', outsourcingDurationLabel: '制作期間の目安', outsourcingDurationFallback: '範囲確定後にご案内', outsourcingViewService: 'サービスを見る', outsourcing3DTitle: '3Dビジュアライゼーション', outsourcing3DDescription: 'プロジェクトの目的と使用媒体に合わせて、3Dビジュアルの制作範囲をご相談します。', outsourcing3DFeature1: '製品・空間の3Dビジュアル', outsourcing3DFeature2: '3Dモーショングラフィックス', outsourcing3DFeature3: 'ウェブ・映像向けレンダリング', outsourcingBeforeOrder: 'ご依頼前に', outsourcingPrepHeading: 'Kmongで相談する前にご準備いただきたい内容', outsourcingPrepIntro: '以下の内容をご用意いただくと、必要な作業とお見積もりをより正確にご相談いただけます。', outsourcingPrepItem1: 'プロジェクトの目的と映像・3Dビジュアルの用途', outsourcingPrepItem2: '希望する長さ・仕様・画面比率', outsourcingPrepItem3: '参考画像、ロゴ、既存資料やリファレンス', outsourcingPrepItem4: '希望納期と中間確認のスケジュール', outsourcingPrepItem5: 'ご予算の目安と希望する修正範囲', outsourcingPrepProgress: '準備項目 {checked} / {total}', outsourcingPrepCta: '準備した内容でKmongに問い合わせる', outsourcingKmongHeading: 'Kmongでプロジェクトを依頼', outsourcingKmongIntro: 'サービス内容と依頼手順をご確認のうえ、Kmongからお問い合わせください。', outsourcingKmongCard: 'プロジェクト内容と参考資料をご用意いただくと、Kmongのサービスページからすぐに相談を始められます。', outsourcingKmongCta: 'Kmongで依頼・相談する', outsourcingReviewLabel: 'Kmongレビュー', outsourcingReviewTitle: '実際のレビューと評価を見る', outsourcingReviewDescription: '最新のレビューと評価はKmongのサービスページでご確認ください。', outsourcingReviewCta: 'Kmongのレビュー・評価を見る',
      workflowHeading: '制作の流れ', workflowDiscovery: 'DISCOVERY', workflowDiscoveryTitle: 'お問い合わせ・企画相談', workflowDiscoveryText: 'プロジェクトの概要、予算、スケジュール、参考資料を確認し、最適な方向性を設定します。',
      workflowDirection: 'DIRECTION', workflowDirectionTitle: '絵コンテ・デザイン案', workflowDirectionText: '企画内容をもとに2D・3Dの絵コンテやデザイン案を作成し、細部を調整します。',
      workflowProduction: 'PRODUCTION', workflowProductionTitle: '本制作・レンダリング', workflowProductionText: 'モーショングラフィックス、3Dレンダリング、Webインタラクションなどの本制作を進めます。',
      workflowDelivery: 'DELIVERY', workflowDeliveryTitle: '修正・最終納品', workflowDeliveryText: '合意した範囲でフィードバックを反映し、高画質の最終データと素材を安全に納品します。',
      workflowNoteTitle: '見積もり・修正・納品について', workflowNoteText: '作業範囲、難易度、スケジュール、成果物を確認したうえでお見積もりします。開始前に修正範囲、日程、納品形式、制作データの提供可否を書面で確認します。',
      portfolioAll: 'すべての実績', catMotion: 'モーショングラフィックス', cat3d: '3Dビジュアル', catTypography: 'タイポグラフィ', catPoster: 'ポスターデザイン', catVarietyPoster: 'バラエティポスター', catAdvertising: '広告映像', catWebVariety: 'Webバラエティ', catYoutube: 'YouTubeプロモーション', catWebsite: 'Webサイト', catAutomation: '自動化・ボット', catOther: 'その他',
      heroDescriptions: [
        '丁寧なプロセスとモーショングラフィックス、Web制作でブランドの価値を高めます。',
        '動きと立体感で、ブランドのストーリーを鮮明に伝えます。',
        '企画から実装まで、ブランドに必要なデジタル体験をつくります。',
        '2D・3Dグラフィックス、映像、Web制作を通してアイデアを完成度の高い成果物に仕上げます。',
        'ブランドの目標や雰囲気をくみ取り、意図の伝わるビジュアルに仕上げます。',
        'リズムとタイミングを設計し、大切なメッセージを印象的に伝えます。',
        'さまざまな画面や環境で自然につながるデジタル体験をつくります。',
        '最初の相談から納品まで、段階ごとの対話で方向性を共有します。',
        '細かな部分まで丁寧に仕上げ、成果物全体の完成度を高めます。',
        '一緒につくりたいアイデアがあれば、ぜひお聞かせください。'
      ],
      ctas: ['制作実績を見る', 'プロジェクトを相談する', '制作環境を見る', '専門分野を見る', '制作実績を見る', '制作の流れを見る', '制作の流れを見る', '制作環境を見る', 'プロジェクトを相談する'], portfolioHeading: 'PORTFOLIO',
      portfolioIntro: 'ブランドやアイデアを視覚的な成果物へと形にした制作実績をご紹介します。', categoryPageIntro: 'このカテゴリーのプロジェクトと制作実績をご覧ください。',
      searchLabel: 'プロジェクト検索', searchPlaceholder: 'モーショングラフィックス、動画などで検索',
      emptySearch: '該当する作品がありません。別のキーワードをお試しください。', projectDetails: 'プロジェクト詳細',
      portfolioSortLabel: '作品の並び替え', sortNewest: '新着順', sortViews: '閲覧数順', sortTitle: 'タイトル順', portfolioYearLabel: '制作年', yearAll: 'すべての年', favoriteAdd: 'お気に入りに追加', favoriteRemove: 'お気に入りから削除', favoritesOnly: 'お気に入りのみ', favoritesOnlyOn: 'すべての作品を見る', favoritesEmpty: '保存したお気に入りはありません。',
      projectOverview: 'プロジェクト概要', projectStory: '制作プロセスと成果',
      categories: { all: 'すべて', '전체': 'すべて', '모션그래픽': 'モーショングラフィックス', '3D 비주얼': '3Dビジュアル', '타이포그래픽': 'タイポグラフィ', '포스터 디자인': 'ポスターデザイン', '예능 포스터': 'バラエティ番組ポスター', '광고영상': '広告映像', '웹예능': 'Webバラエティ', '유튜브 홍보영상': 'YouTubeプロモーション', '기타': 'その他', '웹사이트': 'Webサイト', '자동화·봇': '自動化・ボット' },
      noticeCategories: { all: 'すべて', notice: 'お知らせ', update: 'アップデート', work: '制作ニュース', event: 'イベント', maintenance: 'メンテナンス', other: 'その他' },
      noticesMenu: 'お知らせ', noticeAll: 'すべてのお知らせ', noticeCategoryNotice: 'お知らせ', noticeCategoryUpdate: 'アップデート', noticeCategoryWork: '制作ニュース', noticeCategoryEvent: 'イベント', noticeCategoryMaintenance: 'メンテナンス', noticeCategoryOther: 'その他', noticeHeading: 'STUDIO NOTICES',
      websiteHistoryMenu: 'サイトの更新履歴', websiteHistoryHeading: 'WEBSITE HISTORY', websiteHistoryIntro: '追加された機能、デザイン変更、運営に関する更新を時系列でご覧いただけます。', historyLoading: '更新履歴を読み込み中です。', historyEmpty: '公開中の更新履歴はありません。', historyError: '更新履歴を読み込めませんでした。', historyFeature: '機能追加', historyDesign: 'デザイン変更', historyFix: '修正', historyOperations: '運営', historyDetails: '更新内容を見る',
      inquiryStatusMenu: 'お問い合わせ状況', inquiryStatusHeading: 'PROJECT STATUS', inquiryStatusIntro: 'スタジオから共有された照会コードと発行番号を両方入力すると、プロジェクトの進行状況を確認できます。', inquiryStatusCodeLabel: 'お問い合わせ照会コード', inquiryStatusCodePlaceholder: '例: JWB-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX', inquiryStatusIssueNumberLabel: '発行番号', inquiryStatusIssueNumberPlaceholder: '例: 1234-5678-9012', inquiryStatusSubmit: '状況を確認', inquiryStatusLoading: '進行状況を確認しています…', inquiryStatusNotFound: '照会コードと発行番号が一致しません。共有された2つの値を確認して、もう一度入力してください。', inquiryStatusError: '状況を確認できませんでした。しばらくしてから再度お試しください。', inquiryStatusUpdated: '最終更新', inquiryStatusLabel: '進行状況', inquiryStatusProject: 'プロジェクト', inquiryReceived: 'お問い合わせ受付', inquiryConsulting: '相談中', inquiryInProgress: '制作中', inquiryReview: '確認・フィードバック', inquiryCompleted: '完了', inquiryOnHold: '保留',
      labels: ['担当内容', '使用ツール', '目的', '制作プロセス', '成果'], previous: '← 前の作品', next: '次の作品 →',
      projectLink: 'プロジェクト詳細を見る', views: '閲覧数', share: 'プロジェクトリンクをコピー', copied: 'リンクをコピーしました',
      external: 'Google Driveで見る', youtube: 'YouTubeで見る', noMedia: '動画は登録されていません。',
      toggle: 'JA', toggleLabel: '言語を選択', close: 'プロジェクト詳細を閉じる', prevSlide: '前のスライド', nextSlide: '次のスライド',
      slideLabel: 'スライド {number}',
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
      workspaceMemory: '32GB · 3600MHz', workspacePower: 'Micronics 700W', workspaceOs: '正規版 Windows 11 Pro',
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
    if (document.body.dataset.portfolioCategoryI18n) {
      document.querySelector('.portfolio-section-head h2')?.setAttribute('data-i18n', document.body.dataset.portfolioCategoryI18n);
      document.querySelector('.portfolio-intro')?.setAttribute('data-i18n', 'categoryPageIntro');
      const categoryTitle = t[document.body.dataset.portfolioCategoryI18n] || t.portfolioHeading;
      document.title = `${categoryTitle} | JWB STUDIO`;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
    }
    if (document.body.dataset.noticeCategory) {
      const categoryKeys = { '공지사항':'noticeCategoryNotice', '업데이트':'noticeCategoryUpdate', '작업 소식':'noticeCategoryWork', '이벤트':'noticeCategoryEvent', '점검 안내':'noticeCategoryMaintenance', '기타':'noticeCategoryOther' };
      const heading = document.querySelector('.notice-section-head .headline-l');
      const translatedHeading = t[categoryKeys[document.body.dataset.noticeCategory]] || t.noticeHeading;
      if (heading) heading.textContent = translatedHeading;
      document.title = `${translatedHeading} | JWB STUDIO`;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
    }
    const navPageIndexes = new Map([['index.html', 0], ['about.html', 1], ['portfolio.html', 2], ['skills.html', 3], ['workspace.html', 4], ['workflow.html', 5], ['notices.html', 6], ['faq.html', 7], ['outsourcing.html', 8], ['admin-login.html', 9]]);
    const navLinks = [...document.querySelectorAll('#site-nav-menu > li > a')];
    navLinks.forEach((link, i) => {
      const pageName = new URL(link.href, window.location.href).pathname.split('/').pop() || 'index.html';
      const index = Number.isInteger(Number(link.dataset.navIndex)) ? Number(link.dataset.navIndex) : (navPageIndexes.get(pageName) ?? i);
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
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) el.placeholder = t[key];
    });
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
      const key = el.dataset.i18nContent;
      if (t[key]) el.setAttribute('content', t[key]);
    });
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
    document.querySelectorAll('.hero-dot').forEach((dot, index) => dot.setAttribute('aria-label', t.slideLabel.replace('{number}', String(index + 1))));
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
