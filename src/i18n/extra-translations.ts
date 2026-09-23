export type ExtraTranslation = {
  questionnaire: {
    steps: {
      personal: string;
      location: string;
      financial: string;
      occupation: string;
    };
    step0: {
      title: string;
      subtitle: string;
      ageLabel: string;
      agePlaceholder: string;
      genderLabel: string;
      male: string;
      female: string;
      other: string;
      disabilityLabel: string;
      yes: string;
      no: string;
    };
    step1: {
      title: string;
      subtitle: string;
      stateLabel: string;
      selectState: string;
      areaTypeLabel: string;
      urban: string;
      rural: string;
    };
    step2: {
      title: string;
      subtitle: string;
      incomeLabel: string;
      incomePlaceholder: string;
      educationLabel: string;
      selectEducation: string;
      casteLabel: string;
      selectCaste: string;
    };
    step3: {
      title: string;
      subtitle: string;
      parentOccupationLabel: string;
      parentOccupationSubtitle: string;
    };
    nav: {
      back: string;
      next: string;
      seeResults: string;
    };
    occupations: Record<string, string>;
    parentOccupations: Record<string, string>;
    educationLevels: Record<string, string>;
    casteCategories: Record<string, string>;
  };
  schemes: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
    central: string;
    state: string;
    allStates: string;
    allCategories: string;
    centralGovt: string;
    stateGovt: string;
    noMatch: string;
    learnMore: string;
    save: string;
    saved: string;
  };
  about: {
    badge: string;
    title: string;
    description: string;
    card1Title: string;
    card1Body: string;
    card2Title: string;
    card2Body: string;
    card3Title: string;
    card3Body: string;
    cautionTitle: string;
    cautionBody: string;
    checkEligibility: string;
    browseSchemes: string;
  };
};

export const extraTranslations: Record<string, ExtraTranslation> = {
  en: {
    questionnaire: {
      steps: {
        personal: "Personal",
        location: "Location",
        financial: "Financial",
        occupation: "Occupation",
      },
      step0: {
        title: "Tell us about yourself",
        subtitle: "These help us filter age & gender-specific schemes.",
        ageLabel: "Age",
        agePlaceholder: "e.g. 32",
        genderLabel: "Gender",
        male: "Male",
        female: "Female",
        other: "Other",
        disabilityLabel: "Do you have a disability?",
        yes: "Yes",
        no: "No",
      },
      step1: {
        title: "Where do you live?",
        subtitle: "Some schemes are state-specific or targeted to urban/rural residents.",
        stateLabel: "State / UT",
        selectState: "Select your state…",
        areaTypeLabel: "Area type",
        urban: "Urban",
        rural: "Rural",
      },
      step2: {
        title: "Financial & background details",
        subtitle: "Used only for income, education and category based eligibility.",
        incomeLabel: "Annual household income (₹)",
        incomePlaceholder: "e.g. 180000",
        educationLabel: "Highest education level",
        selectEducation: "Select education…",
        casteLabel: "Caste category",
        selectCaste: "Select category…",
      },
      step3: {
        title: "Your occupation",
        subtitle: "Pick the closest match.",
        parentOccupationLabel: "Parent / Guardian's occupation",
        parentOccupationSubtitle:
          "Some student & child welfare schemes depend on the parent's job type.",
      },
      nav: {
        back: "Back",
        next: "Next",
        seeResults: "See Results",
      },
      occupations: {
        farmer: "Farmer",
        student: "Student",
        salaried: "Salaried Employee",
        "self-employed": "Self-employed / Business",
        labour: "Daily Wage / Labour",
        "unorganised-worker": "Gig / Informal Worker",
        "street-vendor": "Street Vendor",
        entrepreneur: "Entrepreneur / MSME",
        business: "Business Owner",
        unemployed: "Unemployed",
      },
      parentOccupations: {
        govt: "Government Employee",
        pvt: "Private Employee",
        "self-employed": "Self-employed / Business",
        farmer: "Farmer",
        labour: "Daily Wage / Labour",
        unemployed: "Unemployed",
        na: "Not applicable",
      },
      educationLevels: {
        none: "No formal education",
        primary: "Primary",
        secondary: "Secondary (10th)",
        "higher-secondary": "Higher Secondary (12th)",
        diploma: "Diploma / ITI",
        graduate: "Graduate",
        postgraduate: "Post Graduate or above",
      },
      casteCategories: {
        general: "General",
        obc: "OBC",
        sc: "SC",
        st: "ST",
        ews: "EWS",
        minority: "Minority",
      },
    },
    schemes: {
      title: "Browse all schemes",
      subtitle: "Search across Central & State government welfare programs.",
      searchPlaceholder: "Search schemes…",
      all: "All",
      central: "Central",
      state: "State",
      allStates: "All states",
      allCategories: "All categories",
      centralGovt: "Central Government",
      stateGovt: "State Government",
      noMatch: "No schemes match your search.",
      learnMore: "Learn more",
      save: "Save",
      saved: "Saved",
    },
    about: {
      badge: "About",
      title: "Every citizen deserves the schemes they qualify for.",
      description:
        "India runs hundreds of welfare programs — but most people never learn about the ones they're eligible for. Scheme Sathi AI is a simple, free tool that changes that.",
      card1Title: "Independent",
      card1Body: "Not affiliated with any government body. We link only to official portals.",
      card2Title: "For Everyone",
      card2Body: "Farmers, students, women, seniors, workers, PwD — no one left behind.",
      card3Title: "Always Free",
      card3Body: "No sign-up, no ads, no upsell. Ever.",
      cautionTitle: "A word of caution",
      cautionBody:
        "Eligibility rules change often. Always cross-check on the official government portal linked from each scheme card, and never share your Aadhaar OTP or bank details with anyone claiming to help you apply.",
      checkEligibility: "Check Your Eligibility",
      browseSchemes: "Browse Schemes",
    },
  },

  hi: {
    questionnaire: {
      steps: {
        personal: "व्यक्तिगत",
        location: "स्थान",
        financial: "वित्तीय",
        occupation: "व्यवसाय",
      },
      step0: {
        title: "अपने बारे में बताएं",
        subtitle: "यह आयु और लिंग-विशिष्ट योजनाओं को खोजने में मदद करता है।",
        ageLabel: "आयु",
        agePlaceholder: "उदा. 32",
        genderLabel: "लिंग",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        disabilityLabel: "क्या आप दिव्यांग (PwD) हैं?",
        yes: "हाँ",
        no: "नहीं",
      },
      step1: {
        title: "आप कहाँ रहते हैं?",
        subtitle: "कुछ योजनाएँ राज्य-विशिष्ट या शहरी/ग्रामीण निवासियों के लिए होती हैं।",
        stateLabel: "राज्य / केंद्र शासित प्रदेश",
        selectState: "अपना राज्य चुनें…",
        areaTypeLabel: "क्षेत्र प्रकार",
        urban: "शहरी",
        rural: "ग्रामीण",
      },
      step2: {
        title: "वित्तीय और पृष्ठभूमि विवरण",
        subtitle: "केवल आय, शिक्षा और श्रेणी आधारित पात्रता के लिए उपयोग किया जाता है।",
        incomeLabel: "वार्षिक पारिवारिक आय (₹)",
        incomePlaceholder: "उदा. 180000",
        educationLabel: "उच्चतम शिक्षा स्तर",
        selectEducation: "शिक्षा चुनें…",
        casteLabel: "जाति श्रेणी",
        selectCaste: "श्रेणी चुनें…",
      },
      step3: {
        title: "आपका व्यवसाय",
        subtitle: "सबसे उपयुक्त विकल्प चुनें।",
        parentOccupationLabel: "माता-पिता / अभिभावक का व्यवसाय",
        parentOccupationSubtitle:
          "कुछ छात्र और बाल कल्याण योजनाएं माता-पिता के कार्य प्रकार पर निर्भर करती हैं।",
      },
      nav: {
        back: "पीछे",
        next: "आगे",
        seeResults: "परिणाम देखें",
      },
      occupations: {
        farmer: "किसान",
        student: "विद्यार्थी",
        salaried: "वेतनभोगी कर्मचारी",
        "self-employed": "स्व-रोजगार / व्यवसाय",
        labour: "दैनिक वेतन / मजदूर",
        "unorganised-worker": "असंगठित / गिग वर्कर",
        "street-vendor": "स्ट्रीट वेंडर / फेरीवाला",
        entrepreneur: "उद्यमी / एमएसएमई",
        business: "व्यापारी",
        unemployed: "बेरोजगार",
      },
      parentOccupations: {
        govt: "सरकारी कर्मचारी",
        pvt: "निजी कर्मचारी",
        "self-employed": "स्व-रोजगार / व्यवसाय",
        farmer: "किसान",
        labour: "दैनिक वेतन मजदूर",
        unemployed: "बेरोजगार",
        na: "लागू नहीं",
      },
      educationLevels: {
        none: "कोई औपचारिक शिक्षा नहीं",
        primary: "प्राथमिक",
        secondary: "माध्यमिक (10वीं)",
        "higher-secondary": "उच्चतर माध्यमिक (12वीं)",
        diploma: "डिप्लोमा / आईटीआई",
        graduate: "स्नातक (Graduate)",
        postgraduate: "स्नातकोत्तर या उच्च",
      },
      casteCategories: {
        general: "सामान्य (General)",
        obc: "ओबीसी (OBC)",
        sc: "एससी (SC)",
        st: "एसटी (ST)",
        ews: "ईडब्ल्यूएस (EWS)",
        minority: "अल्पसंख्यक (Minority)",
      },
    },
    schemes: {
      title: "सभी योजनाएं देखें",
      subtitle: "केंद्र और राज्य सरकार के कल्याणकारी कार्यक्रमों में खोजें।",
      searchPlaceholder: "योजनाएं खोजें…",
      all: "सभी",
      central: "केंद्रीय",
      state: "राज्य",
      allStates: "सभी राज्य",
      allCategories: "सभी श्रेणियां",
      centralGovt: "केंद्र सरकार की योजनाएं",
      stateGovt: "राज्य सरकार की योजनाएं",
      noMatch: "आपकी खोज से कोई योजना मेल नहीं खाती।",
      learnMore: "और जानें",
      save: "सहेजें",
      saved: "सहेजा गया",
    },
    about: {
      badge: "परिचय",
      title: "हर नागरिक उन योजनाओं का हकदार है जिनके लिए वह पात्र है।",
      description:
        "भारत में सैकड़ों कल्याणकारी योजनाएं संचालित हैं — लेकिन अधिकांश लोगों को उनके बारे में जानकारी नहीं मिल पाती। स्कीम साथी एआई एक सरल, मुफ़्त साधन है जो इसे बदलता है।",
      card1Title: "स्वतंत्र",
      card1Body: "किसी भी सरकारी संस्था से संबद्ध नहीं। हम केवल आधिकारिक पोर्टलों से जोड़ते हैं।",
      card2Title: "सभी के लिए",
      card2Body: "किसान, छात्र, महिलाएं, बुजुर्ग, मजदूर, दिव्यांग — कोई पीछे न छूटे।",
      card3Title: "हमेशा मुफ़्त",
      card3Body: "कोई साइन-अप नहीं, कोई विज्ञापन नहीं, कोई शुल्क नहीं। कभी भी नहीं।",
      cautionTitle: "एक आवश्यक चेतावनी",
      cautionBody:
        "पात्रता नियम अक्सर बदलते रहते हैं। प्रत्येक योजना कार्ड से जुड़े आधिकारिक सरकारी पोर्टल पर हमेशा पुष्टि करें, और आवेदन में मदद का दावा करने वाले किसी भी व्यक्ति के साथ अपना आधार ओटीपी या बैंक विवरण साझा न करें।",
      checkEligibility: "अपनी पात्रता जाँचें",
      browseSchemes: "योजनाएँ देखें",
    },
  },

  te: {
    questionnaire: {
      steps: {
        personal: "వ్యక్తిగత",
        location: "ప్రాంతం",
        financial: "ఆర్థిక",
        occupation: "వృత్తి",
      },
      step0: {
        title: "మీ గురించి తెలియజేయండి",
        subtitle: "ఇవి మీ వయస్సు, లింగ నిర్దిష్ట పథకాలను ఫిల్టర్ చేయడంలో సహాయపడతాయి.",
        ageLabel: "వయస్సు",
        agePlaceholder: "ఉదా. 32",
        genderLabel: "లింగం",
        male: "పురుషుడు",
        female: "స్త్రీ",
        other: "ఇతర",
        disabilityLabel: "దివ్యాంగులా (దివ్యాంగ స్థితి)?",
        yes: "అవును",
        no: "కాదు",
      },
      step1: {
        title: "మీరు ఎక్కడ నివసిస్తున్నారు?",
        subtitle:
          "కొన్ని పథకాలు రాష్ట్ర నిర్దిష్టమైనవి లేదా పట్టణ/గ్రామీణ ప్రాంతాల వారికి ప్రత్యేకించబడినవి.",
        stateLabel: "రాష్ట్రం / కేంద్రపాలిత ప్రాంతం",
        selectState: "మీ రాష్ట్రాన్ని ఎంచుకోండి…",
        areaTypeLabel: "ప్రాంతం రకం",
        urban: "పట్టణ (Urban)",
        rural: "గ్రామీణ (Rural)",
      },
      step2: {
        title: "ఆర్థిక మరియు నేపథ్య వివరాలు",
        subtitle: "ఆదాయం, విద్య మరియు సామాజిక వర్గ ఆధారిత అర్హతకు మాత్రమే ఉపయోగించబడుతుంది.",
        incomeLabel: "వార్షిక కుటుంబ ఆదాయం (₹)",
        incomePlaceholder: "ఉదా. 180000",
        educationLabel: "అత్యున్నత విద్యార్హత",
        selectEducation: "విద్యార్హతను ఎంచుకోండి…",
        casteLabel: "సామాజిక వర్గం / కులం",
        selectCaste: "వర్గాన్ని ఎంచుకోండి…",
      },
      step3: {
        title: "మీ వృత్తి / ఉద్యోగం",
        subtitle: "సరిపోయే ఎంపికను ఎంచుకోండి.",
        parentOccupationLabel: "తల్లిదండ్రులు / సంరక్షకుల వృత్తి",
        parentOccupationSubtitle:
          "కొన్ని విద్యార్థి మరియు బాలల సంక్షేమ పథకాలు తల్లిదండ్రుల వృత్తిపై ఆధారపడి ఉంటాయి.",
      },
      nav: {
        back: "వెనుకకు",
        next: "తరువాత",
        seeResults: "ఫలితాలు చూడండి",
      },
      occupations: {
        farmer: "రైతు",
        student: "విద్యార్థి",
        salaried: "వేతన ఉద్యోగి",
        "self-employed": "స్వయం ఉపాధి / వ్యాపారం",
        labour: "రోజువారీ కూలీ / శ్రామికుడు",
        "unorganised-worker": "అసంఘటిత / గిగ్ వర్కర్",
        "street-vendor": "వీధి వ్యాపారి",
        entrepreneur: "వ్యవస్థాపకుడు / ఎంఎస్ఎంఈ",
        business: "వ్యాపారవేత్త",
        unemployed: "నిరుద్యోగి",
      },
      parentOccupations: {
        govt: "ప్రభుత్వ ఉద్యోగి",
        pvt: "ప్రైవేట్ ఉద్యోగి",
        "self-employed": "స్వయం ఉపాధి / వ్యాపారం",
        farmer: "రైతు",
        labour: "రోజువారీ కూలీ",
        unemployed: "నిరుద్యోగి",
        na: "వర్తించదు",
      },
      educationLevels: {
        none: "అధికారిక విద్య లేదు",
        primary: "ప్రాథమిక",
        secondary: "సెకండరీ (10వ తరగతి)",
        "higher-secondary": "హయ్యర్ సెకండరీ (12వ తరగతి / ఇంటర్)",
        diploma: "డిప్లొమా / ఐటీఐ",
        graduate: "డిగ్రీ / గ్రాడ్యుయేట్",
        postgraduate: "పోస్ట్ గ్రాడ్యుయేట్ లేదా అంతకంటే ఎక్కువ",
      },
      casteCategories: {
        general: "జనరల్ (General)",
        obc: "ఓబీసీ (OBC)",
        sc: "ఎస్సీ (SC)",
        st: "ఎస్టీ (ST)",
        ews: "ఈడబ్ల్యూఎస్ (EWS)",
        minority: "మైనారిటీ (Minority)",
      },
    },
    schemes: {
      title: "అన్ని పథకాలను బ్రౌజ్ చేయండి",
      subtitle: "కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ సంక్షేమ పథకాలలో శోధించండి.",
      searchPlaceholder: "పథకాలను శోధించండి…",
      all: "అన్నీ",
      central: "కేంద్ర ప్రభుత్వం",
      state: "రాష్ట్ర ప్రభుత్వం",
      allStates: "అన్ని రాష్ట్రాలు",
      allCategories: "అన్ని వర్గాలు",
      centralGovt: "కేంద్ర ప్రభుత్వ పథకాలు",
      stateGovt: "రాష్ట్ర ప్రభుత్వ పథకాలు",
      noMatch: "మీ శోధనకు తగిన పథకాలు కనిపించలేదు.",
      learnMore: "మరింత తెలుసుకోండి",
      save: "భద్రపరచు",
      saved: "భద్రపరచబడింది",
    },
    about: {
      badge: "మా గురించి",
      title: "ప్రతి పౌరుడికి తాము అర్హులైన సంక్షేమ పథకాలు అందాలి.",
      description:
        "భారతదేశంలో వందలాది సంక్షేమ పథకాలు అమలులో ఉన్నాయి — కానీ చాలామందికి తమకు లభించే పథకాల సమాచారం తెలియదు. స్కీమ్ సాథీ ఏఐ దీనిని సులభంగా మారుస్తుంది.",
      card1Title: "స్వతంత్ర వేదిక",
      card1Body:
        "ఏ ప్రభుత్వ సంస్థతోనూ సంబంధం లేదు. మేము అధికారిక పోర్టల్స్ లింక్లను మాత్రమే అందిస్తాము.",
      card2Title: "అందరి కోసం",
      card2Body:
        "రైతులు, విద్యార్థులు, మహిళలు, వృద్ధులు, శ్రామికులు, దివ్యాంగులు — అందరికీ సంక్షేమం.",
      card3Title: "ఎల్లప్పుడూ ఉచితం",
      card3Body: "ఎటువంటి ఛార్జీలు, ప్రకటనలు లేదా చెల్లింపులు లేవు. ఎల్లప్పుడూ ఉచితం.",
      cautionTitle: "ముఖ్యమైన గమనిక",
      cautionBody:
        "అర్హత నిబంధనలు మారుతుంటాయి. దరఖాస్తు చేసే ముందు సంబంధిత అధికారిక ప్రభుత్వ పోర్టల్లో వివరాలను సరిచూసుకోండి. మీ ఆధార్ ఓటీపీ లేదా బ్యాంకు వివరాలను ఎవరితోనూ పంచుకోవద్దు.",
      checkEligibility: "మీ అర్హతను తనిఖీ చేయండి",
      browseSchemes: "పథకాలను చూడండి",
    },
  },

  ta: {
    questionnaire: {
      steps: {
        personal: "தனிப்பட்ட",
        location: "இருப்பிடம்",
        financial: "நிதி",
        occupation: "தொழில்",
      },
      step0: {
        title: "உங்களைப் பற்றி கூறுங்கள்",
        subtitle: "வயது மற்றும் பாலின திட்டங்களை தேர்ந்தெடுக்க இவை உதவுகின்றன.",
        ageLabel: "வயது",
        agePlaceholder: "எ.கா. 32",
        genderLabel: "பாலினம்",
        male: "ஆண்",
        female: "பெண்",
        other: "மற்றவை",
        disabilityLabel: "மாற்றுத்திறனாளியா?",
        yes: "ஆம்",
        no: "இல்லை",
      },
      step1: {
        title: "நீங்கள் எங்கு வசிக்கிறீர்கள்?",
        subtitle: "சில திட்டங்கள் மாநில மற்றும் நகர்ப்புற/கிராமப்புற பகுதிகளுக்கு உரியவை.",
        stateLabel: "மாநிலம் / யூனியன் பிரதேசம்",
        selectState: "உங்கள் மாநிலத்தை தேர்ந்தெடுக்கவும்…",
        areaTypeLabel: "பகுதி வகை",
        urban: "நகர்ப்புறம்",
        rural: "கிராமப்புறம்",
      },
      step2: {
        title: "நிதி மற்றும் பின்னணி விவரங்கள்",
        subtitle: "வருமானம், கல்வி மற்றும் சமூக பிரிவு தகுதிக்காக மட்டுமே பயன்படுத்தப்படுகிறது.",
        incomeLabel: "ஆண்டு குடும்ப வருமானம் (₹)",
        incomePlaceholder: "எ.கா. 180000",
        educationLabel: "கல்வித் தகுதி",
        selectEducation: "கல்வியை தேர்ந்தெடுக்கவும்…",
        casteLabel: "சமூகப் பிரிவு",
        selectCaste: "பிரிவை தேர்ந்தெடுக்கவும்…",
      },
      step3: {
        title: "உங்கள் தொழில்",
        subtitle: "பொருத்தமான ஒன்றைத் தேர்ந்தெடுக்கவும்.",
        parentOccupationLabel: "பெற்றோர் / பாதுகாவலர் தொழில்",
        parentOccupationSubtitle:
          "சில மாணவர் நலத்திட்டங்கள் பெற்றோரின் தொழிலை அடிப்படையாகக் கொண்டவை.",
      },
      nav: {
        back: "பின்செல்",
        next: "அடுத்து",
        seeResults: "முடிவுகளை காண்க",
      },
      occupations: {
        farmer: "விவசாயி",
        student: "மாணவர்",
        salaried: "சம்பளப் பணியாளர்",
        "self-employed": "சுயதொழில் / வணிகம்",
        labour: "தினக்கூலி / தொழிலாளி",
        "unorganised-worker": "அமைப்புசாரா தொழிலாளி",
        "street-vendor": "தெருவோர வியாபாரி",
        entrepreneur: "தொழில்முனைவோர் / குறுந்தொழில்",
        business: "வணிக உரிமையாளர்",
        unemployed: "வேலையில்லாதவர்",
      },
      parentOccupations: {
        govt: "அரசு ஊழியர்",
        pvt: "தனியார் ஊழியர்",
        "self-employed": "சுயதொழில்",
        farmer: "விவசாயி",
        labour: "தினக்கூலி",
        unemployed: "வேலையில்லாதவர்",
        na: "பொருந்தாது",
      },
      educationLevels: {
        none: "முறைசார் கல்வி இல்லை",
        primary: "தொடக்கக் கல்வி",
        secondary: "பத்தாம் வகுப்பு (10th)",
        "higher-secondary": "மேல்நிலைக் கல்வி (12th)",
        diploma: "டிப்ளமோ / ஐடிஐ",
        graduate: "பட்டதாரி",
        postgraduate: "முதுகலை அல்லது அதற்கு மேல்",
      },
      casteCategories: {
        general: "பொதுப் பிரிவு (General)",
        obc: "ஓபிசி (OBC)",
        sc: "எஸ்சி (SC)",
        st: "எஸ்டி (ST)",
        ews: "இடபிள்யுஎஸ் (EWS)",
        minority: "சிறுபான்மையினர் (Minority)",
      },
    },
    schemes: {
      title: "அனைத்து திட்டங்களையும் காண்க",
      subtitle: "மத்திய மற்றும் மாநில அரசின் நலத்திட்டங்களை தேடுங்கள்.",
      searchPlaceholder: "திட்டங்களை தேடுங்கள்…",
      all: "அனைத்தும்",
      central: "மத்திய அரசு",
      state: "மாநில அரசு",
      allStates: "அனைத்து மாநிலங்கள்",
      allCategories: "அனைத்து பிரிவுகள்",
      centralGovt: "மத்திய அரசு திட்டங்கள்",
      stateGovt: "மாநில அரசு திட்டங்கள்",
      noMatch: "உங்கள் தேடலுக்கு திட்டங்கள் எதுவும் பொருந்தவில்லை.",
      learnMore: "மேலும் அறிய",
      save: "சேமி",
      saved: "சேமிக்கப்பட்டது",
    },
    about: {
      badge: "பற்றி",
      title: "தகுதி வாய்ந்த திட்டங்கள் ஒவ்வொரு குடிமகனையும் சென்றடைய வேண்டும்.",
      description:
        "இந்தியாவில் நூற்றுக்கணக்கான நலத்திட்டங்கள் உள்ளன — ஆனால் பெரும்பாலோருக்கு தங்களுக்குரிய திட்டங்கள் தெரிவதில்லை. ஸ்கீம் சாத்தி ஏஐ இதை எளிதாக்குகிறது.",
      card1Title: "சுயேச்சையானது",
      card1Body: "எந்த அரசு அமைப்பையும் சாராதது. அதிகாரப்பூர்வ இணையதளங்களுடன் மட்டுமே இணைக்கிறோம்.",
      card2Title: "அனைவருக்கும்",
      card2Body:
        "விவசாயிகள், மாணவர்கள், பெண்கள், முதியவர்கள், தொழிலாளர்கள் — அனைவருக்கும் நலத்திட்டங்கள்.",
      card3Title: "எப்போதும் இலவசம்",
      card3Body: "பதிவு தேவையில்லை, விளம்பரங்கள் இல்லை, முற்றிலும் இலவசம்.",
      cautionTitle: "முக்கிய எச்சரிக்கை",
      cautionBody:
        "தகுதி விதிகள் மாறக்கூடும். திட்ட அட்டையில் உள்ள அதிகாரப்பூர்வ அரசு தளத்தில் சரிபார்க்கவும். ஆதார் ஓடிபி அல்லது வங்கி விவரங்களை யாரிடமும் பகிர வேண்டாம்.",
      checkEligibility: "உங்கள் தகுதியை சரிபார்க்கவும்",
      browseSchemes: "திட்டங்களை பார்க்கவும்",
    },
  },

  kn: {
    questionnaire: {
      steps: {
        personal: "ವೈಯಕ್ತಿಕ",
        location: "ಸ್ಥಳ",
        financial: "ಆರ್ಥಿಕ",
        occupation: "ಉದ್ಯೋಗ",
      },
      step0: {
        title: "ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ",
        subtitle: "ವಯಸ್ಸು ಮತ್ತು ಲಿಂಗ-ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಇದು ಸಹಕಾರಿ.",
        ageLabel: "ವಯಸ್ಸು",
        agePlaceholder: "ಉದಾ. 32",
        genderLabel: "ಲಿಂಗ",
        male: "ಪುರುಷ",
        female: "ಮಹಿಳೆ",
        other: "ಇತರ",
        disabilityLabel: "ನೀವು ವಿಕಲಾಂಗತೆ ಹೊಂದಿದ್ದೀರಾ?",
        yes: "ಹೌದು",
        no: "ಇಲ್ಲ",
      },
      step1: {
        title: "ನೀವು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?",
        subtitle: "ಕೆಲವು ಯೋಜನೆಗಳು ರಾಜ್ಯ ಅಥವಾ ನಗರ/ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಿಗೆ ಸೀಮಿತವಾಗಿರುತ್ತವೆ.",
        stateLabel: "ರಾಜ್ಯ / ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ",
        selectState: "ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ…",
        areaTypeLabel: "ಪ್ರದೇಶದ ಪ್ರಕಾರ",
        urban: "ನಗರ (Urban)",
        rural: "ಗ್ರಾಮೀಣ (Rural)",
      },
      step2: {
        title: "ಆರ್ಥಿಕ ಮತ್ತು ಹಿನ್ನೆಲೆ ವಿವರಗಳು",
        subtitle: "ಆದಾಯ, ಶಿಕ್ಷಣ ಮತ್ತು ವರ್ಗದ ಆಧಾರದ ಮೇಲೆ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸಲು ಮಾತ್ರ.",
        incomeLabel: "ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ (₹)",
        incomePlaceholder: "ಉದಾ. 180000",
        educationLabel: "ಗರಿಷ್ಠ ಶಿಕ್ಷಣ ಮಟ್ಟ",
        selectEducation: "ಶಿಕ್ಷಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ…",
        casteLabel: "ಜಾತಿ ವರ್ಗ",
        selectCaste: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ…",
      },
      step3: {
        title: "ನಿಮ್ಮ ಉದ್ಯೋಗ",
        subtitle: "ಅತ್ಯಂತ ಸೂಕ್ತವಾದದ್ದನ್ನು ಆರಿಸಿ.",
        parentOccupationLabel: "ಪೋಷಕರ ಉದ್ಯೋಗ",
        parentOccupationSubtitle: "ಕೆಲವು ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಗಳು ಪೋಷಕರ ಉದ್ಯೋಗವನ್ನು ಆಧರಿಸಿರುತ್ತವೆ.",
      },
      nav: {
        back: "ಹಿಂದೆ",
        next: "ಮುಂದೆ",
        seeResults: "ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿ",
      },
      occupations: {
        farmer: "ರೈತ",
        student: "ವಿದ್ಯಾರ್ಥಿ",
        salaried: "ವೇತನ ಪಡೆಯುವ ನೌಕರ",
        "self-employed": "ಸ್ವಯಂ ಉದ್ಯೋಗ / ವ್ಯಾಪಾರ",
        labour: "ದೈನಂದಿನ ಕೂಲಿ ಕಾರ್ಮಿಕ",
        "unorganised-worker": "ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕ",
        "street-vendor": "ಬೀದಿ ಬದಿ ವ್ಯಾಪಾರಿ",
        entrepreneur: "ಉದ್ಯಮಿ / ಎಂಎಸ್ಎಂಇ",
        business: "ವ್ಯಾಪಾರ ಮಾಲೀಕ",
        unemployed: "ನಿರುದ್ಯೋಗಿ",
      },
      parentOccupations: {
        govt: "ಸರ್ಕಾರಿ ನೌಕರ",
        pvt: "ಖಾಸಗಿ ನೌಕರ",
        "self-employed": "ಸ್ವಯಂ ಉದ್ಯೋಗ",
        farmer: "ರೈತ",
        labour: "ಕೂಲಿ ಕಾರ್ಮಿಕ",
        unemployed: "ನಿರುದ್ಯೋಗಿ",
        na: "ಅನ್ವಯಿಸುವುದಿಲ್ಲ",
      },
      educationLevels: {
        none: "ಯಾವುದೇ ಔಪಚಾರಿಕ ಶಿಕ್ಷಣವಿಲ್ಲ",
        primary: "ಪ್ರಾಥಮಿಕ",
        secondary: "ಪ್ರೌಢಶಾಲೆ (10ನೇ ತರಗತಿ)",
        "higher-secondary": "ಪಿಯುಸಿ / 12ನೇ ತರಗತಿ",
        diploma: "ಡಿಪ್ಲೊಮಾ / ಐಟಿಐ",
        graduate: "ಪದವೀಧರ",
        postgraduate: "ಸ್ನಾತಕೋತ್ತರ ಅಥವಾ ಹೆಚ್ಚಿನ",
      },
      casteCategories: {
        general: "ಸಾಮಾನ್ಯ (General)",
        obc: "ಒಬಿಸಿ (OBC)",
        sc: "ಎಸ್ಸಿ (SC)",
        st: "ಎಸ್ಟಿ (ST)",
        ews: "ಇಡಬ್ಲ್ಯುಎಸ್ (EWS)",
        minority: "ಅಲ್ಪಸಂಖ್ಯಾತ (Minority)",
      },
    },
    schemes: {
      title: "ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ",
      subtitle: "ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
      searchPlaceholder: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ…",
      all: "ಎಲ್ಲಾ",
      central: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
      state: "ರಾಜ್ಯ ಸರ್ಕಾರ",
      allStates: "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು",
      allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
      centralGovt: "ಕೇಂದ್ರ ಸರ್ಕಾರದ ಯೋಜನೆಗಳು",
      stateGovt: "ರಾಜ್ಯ ಸರ್ಕಾರದ ಯೋಜನೆಗಳು",
      noMatch: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಯೋಜನೆಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
      learnMore: "ಹೆಚ್ಚು ತಿಳಿಯಿರಿ",
      save: "ಉಳಿಸಿ",
      saved: "ಉಳಿಸಲಾಗಿದೆ",
    },
    about: {
      badge: "ಕುರಿತು",
      title: "ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನೂ ತನಗೆ ಅರ್ಹವಾದ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಬೇಕು.",
      description:
        "ಭಾರತದಲ್ಲಿ ನೂರಾರು ಕಲ್ಯಾಣ ಯೋಜನೆಗಳಿವೆ — ಆದರೆ ಅನೇಕರಿಗೆ ತಮಗೆ ಲಭ್ಯವಿರುವ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತಿಳಿದಿರುವುದಿಲ್ಲ. ಸ್ಕೀಮ್ ಸಾಥಿ ಎಐ ಇದನ್ನು ಸರಳಗೊಳಿಸುತ್ತದೆ.",
      card1Title: "ಸ್ವತಂತ್ರ ವೇದಿಕೆ",
      card1Body:
        "ಯಾವುದೇ ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಗೆ ಸೇರಿಲ್ಲ. ನಾವು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ಮಾತ್ರ ಲಿಂಕ್ ಮಾಡುತ್ತೇವೆ.",
      card2Title: "ಎಲ್ಲರಿಗೂ ಲಭ್ಯ",
      card2Body:
        "ರೈತರು, ವಿದ್ಯಾರ್ಥಿಗಳು, ಮಹಿಳೆಯರು, ಹಿರಿಯರು, ಕಾರ್ಮಿಕರು, ಅಂಗವಿಕಲರು — ಎಲ್ಲರಿಗೂ ಯೋಜನೆಗಳು.",
      card3Title: "ಸದಾ ಉಚಿತ",
      card3Body: "ಯಾವುದೇ ಸೈನ್-ಅಪ್ ಇಲ್ಲ, ಜಾಹೀರಾತುಗಳಿಲ್ಲ, ಸಂಪೂರ್ಣ ಉಚಿತ.",
      cautionTitle: "ಮುನ್ನೆಚ್ಚರಿಕೆ",
      cautionBody:
        "ಅರ್ಹತೆಯ ನಿಯಮಗಳು ಬದಲಾಗಬಹುದು. ಪ್ರತಿ ಯೋಜನಾ ಕಾರ್ಡ್‌ನಲ್ಲಿ ನೀಡಲಾದ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ನಿಮ್ಮ ಆಧಾರ್ ಒಟಿಪಿ ಅಥವಾ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಯಾರಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
      checkEligibility: "ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
      browseSchemes: "ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    },
  },

  ml: {
    questionnaire: {
      steps: {
        personal: "വ്യക്തിഗതം",
        location: "സ്ഥലം",
        financial: "സാമ്പത്തികം",
        occupation: "തൊഴിൽ",
      },
      step0: {
        title: "നിങ്ങളെക്കുറിച്ച് പറയുക",
        subtitle: "പ്രായവും ലിംഗഭേദവും അടിസ്ഥാനമാക്കിയുള്ള പദ്ധതികൾ കണ്ടെത്താൻ ഇത് സഹായിക്കുന്നു.",
        ageLabel: "പ്രായം",
        agePlaceholder: "ഉദാ. 32",
        genderLabel: "ലിംഗം",
        male: "പുരുഷൻ",
        female: "സ്ത്രീ",
        other: "മറ്റുള്ളവ",
        disabilityLabel: "ഭിന്നശേഷിയുണ്ടോ?",
        yes: "ഉണ്ട്",
        no: "ഇല്ല",
      },
      step1: {
        title: "നിങ്ങൾ എവിടെയാണ് താമസിക്കുന്നത്?",
        subtitle: "ചില പദ്ധതികൾ സംസ്ഥാനങ്ങൾക്കോ നഗര/ഗ്രാമീണ മേഖലകൾക്കോ മാത്രമുള്ളതാണ്.",
        stateLabel: "സംസ്ഥാനം / കേന്ദ്രഭരണ പ്രദേശം",
        selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക…",
        areaTypeLabel: "മേഖല തരം",
        urban: "നഗരം (Urban)",
        rural: "ഗ്രാമം (Rural)",
      },
      step2: {
        title: "സാമ്പത്തിക വിവരങ്ങൾ",
        subtitle: "വരുമാനം, വിദ്യാഭ്യാസം, വിഭാഗം എന്നിവയുടെ അടിസ്ഥാനത്തിലുള്ള അർഹതയ്ക്ക് മാത്രം.",
        incomeLabel: "വാർഷിക കുടുംബ വരുമാനം (₹)",
        incomePlaceholder: "ഉദാ. 180000",
        educationLabel: "വിദ്യാഭ്യാസ യോഗ്യത",
        selectEducation: "വിദ്യാഭ്യാസം തിരഞ്ഞെടുക്കുക…",
        casteLabel: "സാമൂഹിക വിഭാഗം",
        selectCaste: "വിഭാഗം തിരഞ്ഞെടുക്കുക…",
      },
      step3: {
        title: "നിങ്ങളുടെ തൊഴിൽ",
        subtitle: "ഏറ്റവും അനുയോജ്യമായത് തിരഞ്ഞെടുക്കുക.",
        parentOccupationLabel: "മാതാപിതാക്കളുടെ തൊഴിൽ",
        parentOccupationSubtitle:
          "ചില വിദ്യാർത്ഥി പദ്ധതികൾ മാതാപിതാക്കളുടെ തൊഴിലിനെ ആശ്രയിച്ചിരിക്കുന്നു.",
      },
      nav: {
        back: "പുറകോട്ട്",
        next: "അടുത്തത്",
        seeResults: "ഫലങ്ങൾ കാണുക",
      },
      occupations: {
        farmer: "കർഷകൻ",
        student: "വിദ്യാർത്ഥി",
        salaried: "ശമ്പളമുള്ള ജീവനക്കാരൻ",
        "self-employed": "സ്വയംതൊഴിൽ / ബിസിനസ്",
        labour: "ദിവസവേതന തൊഴിലാളി",
        "unorganised-worker": "അസംഘടിത തൊഴിലാളി",
        "street-vendor": "തെരുവ് കച്ചവടക്കാരൻ",
        entrepreneur: "സംരംഭകൻ",
        business: "ബിസിനസ് ഉടമ",
        unemployed: "തൊഴിലില്ലാത്തയാൾ",
      },
      parentOccupations: {
        govt: "സർക്കാർ ജീവനക്കാരൻ",
        pvt: "സ്വകാര്യ ജീവനക്കാരൻ",
        "self-employed": "സ്വയംതൊഴിൽ",
        farmer: "കർഷകൻ",
        labour: "ദിവസവേതന തൊഴിലാളി",
        unemployed: "തൊഴിലില്ലാത്തയാൾ",
        na: "ബാധകമല്ല",
      },
      educationLevels: {
        none: "ഔപചാരിക വിദ്യാഭ്യാസമില്ല",
        primary: "പ്രൈമറി",
        secondary: "സെക്കൻഡറി (10-ാം ക്ലാസ്)",
        "higher-secondary": "ഹയർ സെക്കൻഡറി (പ്ലസ് ടു)",
        diploma: "ഡിപ്ലോമ / ഐടിഐ",
        graduate: "ബിരുദം",
        postgraduate: "ബിരുദാനന്തര ബിരുദം അല്ലെങ്കിൽ ഉയർന്നത്",
      },
      casteCategories: {
        general: "ജനറൽ (General)",
        obc: "ഒബിസി (OBC)",
        sc: "എസ്.സി (SC)",
        st: "എസ്.ടി (ST)",
        ews: "ഇഡബ്ല്യുഎസ് (EWS)",
        minority: "ന്യൂനപക്ഷം (Minority)",
      },
    },
    schemes: {
      title: "എല്ലാ പദ്ധതികളും കാണുക",
      subtitle: "കേന്ദ്ര, സംസ്ഥാന സർക്കാരുകളുടെ ക്ഷേമ പദ്ധതികൾ തിരയുക.",
      searchPlaceholder: "പദ്ധതികൾ തിരയുക…",
      all: "എല്ലാം",
      central: "കേന്ദ്ര സർക്കാർ",
      state: "സംസ്ഥാന സർക്കാർ",
      allStates: "എല്ലാ സംസ്ഥാനങ്ങളും",
      allCategories: "എല്ലാ വിഭാഗങ്ങളും",
      centralGovt: "കേന്ദ്ര സർക്കാർ പദ്ധതികൾ",
      stateGovt: "സംസ്ഥാന സർക്കാർ പദ്ധതികൾ",
      noMatch: "പദ്ധതികൾ ഒന്നും കണ്ടെത്താനായില്ല.",
      learnMore: "കൂടുതൽ അറിയുക",
      save: "സൂക്ഷിക്കുക",
      saved: "സൂക്ഷിച്ചു",
    },
    about: {
      badge: "ഞങ്ങളെക്കുറിച്ച്",
      title: "ഓരോ പൗരനും തങ്ങൾക്ക് അർഹതപ്പെട്ട പദ്ധതികൾ ലഭ്യമാകണം.",
      description:
        "ഇന്ത്യയിൽ നൂറുകണക്കിന് ക്ഷേമപദ്ധതികൾ നിലവിലുണ്ട് — എന്നാൽ ഭൂരിഭാഗം പേർക്കും തങ്ങൾക്ക് ലഭിക്കുന്ന പദ്ധതികളെക്കുറിച്ച് അറിയില്ല. സ്കീം സാഥി എഐ ഇതിന് ലളിതമായ പരിഹാരം നൽകുന്നു.",
      card1Title: "സ്വതന്ത്ര പ്ലാറ്റ്‌ഫോം",
      card1Body:
        "സർക്കാർ സ്ഥാപനങ്ങളുമായി ബന്ധമില്ല. ഔദ്യോഗിക പോർട്ടലുകളിലേക്ക് മാത്രം ലിങ്ക് ചെയ്യുന്നു.",
      card2Title: "എല്ലാവർക്കും",
      card2Body:
        "കർഷകർ, വിദ്യാർത്ഥികൾ, സ്ത്രീകൾ, മുതിർന്ന പൗരന്മാർ, തൊഴിലാളികൾ, ഭിന്നശേഷിക്കാർ — എല്ലാവർക്കും.",
      card3Title: "പൂർണ്ണമായും സൗജന്യം",
      card3Body: "രജിസ്ട്രേഷൻ ആവശ്യമില്ല, പരസ്യങ്ങളില്ല, തികച്ചും സൗജന്യം.",
      cautionTitle: "ശ്രദ്ധിക്കുക",
      cautionBody:
        "യോഗ്യതാ മാനദണ്ഡങ്ങൾ മാറാം. പദ്ധതി കാർഡിലെ ഔദ്യോഗിക പോർട്ടലിൽ പരിശോധിച്ച് ഉറപ്പുവരുത്തുക. നിങ്ങളുടെ ആധാർ ഒടിപിയോ ബാങ്ക് വിവരങ്ങളോ ആരുമായും പങ്കിടരുത്.",
      checkEligibility: "അർഹത പരിശോധിക്കുക",
      browseSchemes: "പദ്ധതികൾ കാണുക",
    },
  },

  mr: {
    questionnaire: {
      steps: {
        personal: "वैयक्तिक",
        location: "स्थान",
        financial: "आर्थिक",
        occupation: "व्यवसाय",
      },
      step0: {
        title: "तुमच्याबद्दल सांगा",
        subtitle: "हे वय आणि लिंग-विशिष्ट योजना शोधण्यात मदत करते.",
        ageLabel: "वय",
        agePlaceholder: "उदा. 32",
        genderLabel: "लिंग",
        male: "पुरुष",
        female: "महिला",
        other: "इतर",
        disabilityLabel: "दिव्यांगत्व आहे का?",
        yes: "होय",
        no: "नाही",
      },
      step1: {
        title: "तुम्ही कुठे राहता?",
        subtitle: "काही योजना राज्य किंवा शहरी/ग्रामीण भागांसाठी असतात.",
        stateLabel: "राज्य / केंद्रशासित प्रदेश",
        selectState: "तुमचे राज्य निवडा…",
        areaTypeLabel: "भागाचा प्रकार",
        urban: "शहरी",
        rural: "ग्रामीण",
      },
      step2: {
        title: "आर्थिक आणि पार्श्वभूमी तपशील",
        subtitle: "केवळ उत्पन्न, शिक्षण आणि प्रवर्गानुसार पात्रता तपासण्यासाठी.",
        incomeLabel: "वार्षिक कौटुंबिक उत्पन्न (₹)",
        incomePlaceholder: "उदा. 180000",
        educationLabel: "सर्वोच्च शिक्षण पातळी",
        selectEducation: "शिक्षण निवडा…",
        casteLabel: "जातीचा प्रवर्ग",
        selectCaste: "प्रवर्ग निवडा…",
      },
      step3: {
        title: "तुमचा व्यवसाय",
        subtitle: "योग्य पर्याय निवडा.",
        parentOccupationLabel: "पालकांचा व्यवसाय",
        parentOccupationSubtitle: "काही विद्यार्थी योजना पालकांच्या व्यवसायावर अवलंबून असतात.",
      },
      nav: {
        back: "मागे",
        next: "पुढे",
        seeResults: "निकाल पहा",
      },
      occupations: {
        farmer: "शेतकरी",
        student: "विद्यार्थी",
        salaried: "पगारदार कर्मचारी",
        "self-employed": "स्वयंरोजगार / व्यवसाय",
        labour: "दैनिक मजुरी / कामगार",
        "unorganised-worker": "असंघटित कामगार",
        "street-vendor": "फेरीवाला",
        entrepreneur: "उद्योजक / एमएसएमई",
        business: "व्यापारी",
        unemployed: "बेरोजगार",
      },
      parentOccupations: {
        govt: "सरकारी कर्मचारी",
        pvt: "खाजगी कर्मचारी",
        "self-employed": "स्वयंरोजगार",
        farmer: "शेतकरी",
        labour: "दैनिक मजूर",
        unemployed: "बेरोजगार",
        na: "लागू नाही",
      },
      educationLevels: {
        none: "औपचारिक शिक्षण नाही",
        primary: "प्राथमिक",
        secondary: "माध्यમિક (10 वी)",
        "higher-secondary": "उच्च माध्यमिक (12 वी)",
        diploma: "डिप्लोमा / आयटीआय",
        graduate: "पदवीधर",
        postgraduate: "पदव्युत्तर किंवा उच्च",
      },
      casteCategories: {
        general: "खुला (General)",
        obc: "ओबीसी (OBC)",
        sc: "एससी (SC)",
        st: "एसटी (ST)",
        ews: "ईडब्ल्यूएस (EWS)",
        minority: "अल्पसंख्याक (Minority)",
      },
    },
    schemes: {
      title: "सर्व योजना पहा",
      subtitle: "केंद्र आणि राज्य सरकारच्या कल्याणकारी योजनांमध्ये शोधा.",
      searchPlaceholder: "योजना शोधा…",
      all: "सर्व",
      central: "केंद्र सरकार",
      state: "राज्य सरकार",
      allStates: "सर्व राज्ये",
      allCategories: "सर्व प्रवर्ग",
      centralGovt: "केंद्र सरकारच्या योजना",
      stateGovt: "राज्य सरकारच्या योजना",
      noMatch: "तुमच्या शोधाशी जुळणाऱ्या योजना आढळल्या नाहीत.",
      learnMore: "अधिक माहिती",
      save: "जतन करा",
      saved: "जतन केले",
    },
    about: {
      badge: "बद्दल",
      title: "प्रत्येक नागरिकाला त्याच्या हक्काच्या योजना मिळायला हव्यात.",
      description:
        "भारतात शेकडो कल्याणकारी योजना आहेत — परंतु बहुतेकांना त्याबद्दल माहिती नसते. स्कीम साथी एआय हे सोपे करते.",
      card1Title: "स्वतंत्र",
      card1Body: "कोणत्याही सरकारी संस्थेशी संलग्न नाही. आम्ही फक्त अधिकृत पोर्टलशी जोडतो.",
      card2Title: "सर्वांसाठी",
      card2Body: "शेतकरी, विद्यार्थी, महिला, ज्येष्ठ नागरिक, कामगार, दिव्यांग — सर्वांसाठी योजना.",
      card3Title: "कायम मोफत",
      card3Body: "नोंदणी नाही, जाहिराती नाहीत, पूर्णपणे मोफत.",
      cautionTitle: "महत्त्वाची सूचना",
      cautionBody:
        "पात्रतेचे नियम बदलू शकतात. अधिकृत सरकारी पोर्टलवर नेहमी पडताळणी करा. आपला आधार ओटीपी किंवा बँक तपशील कोणाशीही शेअर करू नका.",
      checkEligibility: "पात्रता तपासा",
      browseSchemes: "योजना पहा",
    },
  },

  bn: {
    questionnaire: {
      steps: {
        personal: "ব্যক্তিগত",
        location: "অবস্থান",
        financial: "আর্থিক",
        occupation: "পেশা",
      },
      step0: {
        title: "আপনার সম্পর্কে বলুন",
        subtitle: "এটি বয়স ও লিঙ্গ ভিত্তিক সরকারি প্রকল্প খুঁজতে সাহায্য করে।",
        ageLabel: "বয়স",
        agePlaceholder: "যেমন ৩২",
        genderLabel: "লিঙ্গ",
        male: "পুরুষ",
        female: "মহিলা",
        other: "অন্যান্য",
        disabilityLabel: "প্রতিবন্ধকতা রয়েছে কি?",
        yes: "হ্যাঁ",
        no: "না",
      },
      step1: {
        title: "আপনি কোথায় বসবাস করেন?",
        subtitle: "কিছু প্রকল্প নির্দিষ্ট রাজ্য বা শহর/গ্রামাঞ্চলের জন্য প্রযোজ্য।",
        stateLabel: "রাজ্য / কেন্দ্রশাসিত অঞ্চল",
        selectState: "রাজ্য নির্বাচন করুন…",
        areaTypeLabel: "এলাকার ধরন",
        urban: "শহরাঞ্চল",
        rural: "গ্রামাঞ্চল",
      },
      step2: {
        title: "আর্থিক ও অন্যান্য বিবরণ",
        subtitle: "আয়, শিক্ষা এবং সামাজিক বিভাগের যোগ্যতার জন্য ব্যবহৃত।",
        incomeLabel: "বার্ষিক পারিবারিক আয় (₹)",
        incomePlaceholder: "যেমন ১৮০০০০",
        educationLabel: "সর্বোচ্চ শিক্ষাগত যোগ্যতা",
        selectEducation: "শিক্ষা নির্বাচন করুন…",
        casteLabel: "সামাজিক বিভাগ / বর্ণ",
        selectCaste: "বিভাগ নির্বাচন করুন…",
      },
      step3: {
        title: "আপনার পেশা",
        subtitle: "সবচেয়ে উপযুক্তটি বেছে নিন।",
        parentOccupationLabel: "পিতা-মাতা / অভিভাবকের পেশা",
        parentOccupationSubtitle:
          "কিছু ছাত্র ও শিশু কল্যাণ প্রকল্প অভিভাবকদের পেশার ওপর নির্ভরশীল।",
      },
      nav: {
        back: "পিছনে",
        next: "পরবর্তী",
        seeResults: "ফলাফল দেখুন",
      },
      occupations: {
        farmer: "কৃষক",
        student: "শিক্ষার্থী",
        salaried: "বেতনভোগী কর্মচারী",
        "self-employed": "স্বনিযুক্ত / ব্যবসা",
        labour: "দিনমজুর / শ্রমিক",
        "unorganised-worker": "অসংগঠিত শ্রমিক",
        "street-vendor": "হকার / বিক্রেতা",
        entrepreneur: "উদ্যোক্তা / ক্ষুদ্র ব্যবসা",
        business: "ব্যবসায়ী",
        unemployed: "বেকার",
      },
      parentOccupations: {
        govt: "সরকারি কর্মচারী",
        pvt: "বেসরকারি কর্মচারী",
        "self-employed": "স্বনিযুক্ত",
        farmer: "কৃষক",
        labour: "দিনমজুর",
        unemployed: "বেকার",
        na: "প্রযোজ্য নয়",
      },
      educationLevels: {
        none: "প্রাতিষ্ঠানিক শিক্ষা নেই",
        primary: "প্রাথমিক",
        secondary: "মাধ্যমিক (১০ম)",
        "higher-secondary": "উচ্চ মাধ্যমিক (১২ম)",
        diploma: "ডিপ্লোমা / আইটিআই",
        graduate: "স্নাতক",
        postgraduate: "স্নাতকোত্তর বা তদুর্ধ্ব",
      },
      casteCategories: {
        general: "সাধারণ (General)",
        obc: "ওবিসি (OBC)",
        sc: "এসসি (SC)",
        st: "এসটি (ST)",
        ews: "ইডব্লিউএস (EWS)",
        minority: "সংখ্যালঘু (Minority)",
      },
    },
    schemes: {
      title: "সমস্ত প্রকল্প ব্রাউজ করুন",
      subtitle: "কেন্দ্র ও রাজ্য সরকারের কল্যাণমূলক প্রকল্প অনুসন্ধান করুন।",
      searchPlaceholder: "প্রকল্প খুঁজুন…",
      all: "সব",
      central: "কেন্দ্রীয় সরকার",
      state: "রাজ্য সরকার",
      allStates: "সমস্ত রাজ্য",
      allCategories: "সমস্ত বিভাগ",
      centralGovt: "কেন্দ্রীয় সরকারের প্রকল্প",
      stateGovt: "রাজ্য সরকারের প্রকল্প",
      noMatch: "কোনো প্রকল্প মেলেনি।",
      learnMore: "আরও জানুন",
      save: "সংরক্ষণ",
      saved: "সংরক্ষিত",
    },
    about: {
      badge: "পরিচিতি",
      title: "প্রত্যেক নাগরিকের প্রাপ্য সরকারি প্রকল্প পাওয়া উচিত।",
      description:
        "ভারতে শত শত কল্যাণমূলক প্রকল্প রয়েছে — কিন্তু বেশিরভাগ মানুষ এগুলি সম্পর্কে জানেন না। স্কিম সাথী এআই এটিকে সহজ করে তোলে।",
      card1Title: "স্বাধীন",
      card1Body: "কোনো সরকারি সংস্থার সাথে যুক্ত নয়। আমরা কেবল অফিসিয়াল পোর্টালে সংযুক্ত করি।",
      card2Title: "সকলের জন্য",
      card2Body: "কৃষক, ছাত্র, মহিলা, প্রবীণ, শ্রমিক, প্রতিবন্ধী — সকলের জন্য প্রকল্প।",
      card3Title: "সর্বদা বিনামূল্যে",
      card3Body: "কোনো সাইন-আপ নেই, বিজ্ঞাপন নেই, সম্পূর্ণ বিনামূল্যে।",
      cautionTitle: "সতর্কবার্তা",
      cautionBody:
        "যোগ্যতার নিয়ম পরিবর্তিত হতে পারে। সর্বদা অফিসিয়াল সরকারি পোর্টালে যাচাই করুন। আপনার আধার ওটিপি বা ব্যাংক বিবরণ কারও সাথে ভাগ করবেন না।",
      checkEligibility: "যোগ্যতা যাচাই করুন",
      browseSchemes: "প্রকল্প দেখুন",
    },
  },

  gu: {
    questionnaire: {
      steps: {
        personal: "વ્યક્તિગત",
        location: "સ્થળ",
        financial: "નાણાકીય",
        occupation: "વ્યવસાય",
      },
      step0: {
        title: "તમારા વિશે જણાવો",
        subtitle: "આ ઉંમર અને લિંગ આધારિત યોજનાઓ શોધવામાં મદદ કરે છે.",
        ageLabel: "ઉંમર",
        agePlaceholder: "દા.ત. 32",
        genderLabel: "જાતિ / લિંગ",
        male: "પુરુષ",
        female: "સ્ત્રી",
        other: "અન્ય",
        disabilityLabel: "શું તમે દિવ્યાંગ છો?",
        yes: "હા",
        no: "ના",
      },
      step1: {
        title: "તમે ક્યાં રહો છો?",
        subtitle: "કેટલીક યોજનાઓ રાજ્ય અથવા શહેરી/ગ્રામીણ વિસ્તારો માટે હોય છે.",
        stateLabel: "રાજ્ય / કેન્દ્રશાસિત પ્રદેશ",
        selectState: "તમારું રાજ્ય પસંદ કરો…",
        areaTypeLabel: "વિસ્તાર પ્રકાર",
        urban: "શહેરી",
        rural: "ગ્રામીણ",
      },
      step2: {
        title: "નાણાકીય અને પૃષ્ઠભૂમિ વિગતો",
        subtitle: "માત્ર આવક, શિક્ષણ અને જાતિ આધારિત પાત્રતા માટે વપરાય છે.",
        incomeLabel: "વાર્ષિક પારિવારિક આવક (₹)",
        incomePlaceholder: "દા.ત. 180000",
        educationLabel: "શિક્ષણનું ઉચ્ચતમ સ્તર",
        selectEducation: "શિક્ષણ પસંદ કરો…",
        casteLabel: "સામાજિક વર્ગ / જ્ઞાતિ",
        selectCaste: "વર્ગ પસંદ કરો…",
      },
      step3: {
        title: "તમારો વ્યવસાય",
        subtitle: "સૌથી યોગ્ય વિકલ્પ પસંદ કરો.",
        parentOccupationLabel: "માતાપિતા / વાલીનો વ્યવસાય",
        parentOccupationSubtitle: "કેટલીક વિદ્યાર્થી યોજનાઓ માતાપિતાના વ્યવસાય પર આધારિત હોય છે.",
      },
      nav: {
        back: "પાછળ",
        next: "આગળ",
        seeResults: "પરિણામો જુઓ",
      },
      occupations: {
        farmer: "ખેડૂત",
        student: "વિદ્યાર્થી",
        salaried: "પગારદાર કર્મચારી",
        "self-employed": "સ્વરોજગાર / વ્યવસાય",
        labour: "રોજમદાર / મજૂર",
        "unorganised-worker": "અસંગઠિત કામદાર",
        "street-vendor": "ફેરીવાળા",
        entrepreneur: "ઉદ્યોગસાહસિક",
        business: "વેપારી",
        unemployed: "બેરોજગાર",
      },
      parentOccupations: {
        govt: "સરકારી કર્મચારી",
        pvt: "ખાનગી કર્મચારી",
        "self-employed": "સ્વરોજગાર",
        farmer: "ખેડૂત",
        labour: "રોજમદાર મજૂર",
        unemployed: "બેરોજગાર",
        na: "લાગુ પડતું નથી",
      },
      educationLevels: {
        none: "કોઈ ઔપચારિક શિક્ષણ નથી",
        primary: "પ્રાથમિક",
        secondary: "માધ્યમિક (10 પાસ)",
        "higher-secondary": "ઉચ્ચતર માધ્યમિક (12 પાસ)",
        diploma: "ડિપ્લોમા / આઈટીઆઈ",
        graduate: "સ્નાતક (Graduate)",
        postgraduate: "અનુસ્નાતક અથવા વધુ",
      },
      casteCategories: {
        general: "સામાન્ય (General)",
        obc: "ઓબીસી (OBC)",
        sc: "એસસી (SC)",
        st: "એસટી (ST)",
        ews: "ઇડબ્લ્યુએસ (EWS)",
        minority: "લઘુમતી (Minority)",
      },
    },
    schemes: {
      title: "બધી યોજનાઓ બ્રાઉઝ કરો",
      subtitle: "કેન્દ્ર અને રાજ્ય સરકારની કલ્યાણકારી યોજનાઓ શોધો.",
      searchPlaceholder: "યોજનાઓ શોધો…",
      all: "બધું",
      central: "કેન્દ્ર સરકાર",
      state: "રાજ્ય સરકાર",
      allStates: "બધા રાજ્યો",
      allCategories: "બધી શ્રેણીઓ",
      centralGovt: "કેન્દ્ર સરકારની યોજનાઓ",
      stateGovt: "રાજ્ય સરકારની યોજનાઓ",
      noMatch: "કોઈ યોજના મળી નથી.",
      learnMore: "વધુ જાણો",
      save: "સાચવો",
      saved: "સાચવેલ",
    },
    about: {
      badge: "વિશે",
      title: "દરેક નાગરિકને તેમની પાત્રતા મુજબની સરકારી યોજનાઓ મળવી જોઈએ.",
      description:
        "ભારતમાં સેંકડો કલ્યાણકારી યોજનાઓ છે — પણ મોટાભાગના લોકોને તેની માહિતી હોતી નથી. સ્કીમ સાથી એઆઈ તેને સરળ બનાવે છે.",
      card1Title: "સ્વતંત્ર",
      card1Body: "કોઈ સરકારી સંસ્થા સાથે જોડાયેલ નથી. અમે ફક્ત સત્તાવાર પોર્ટલ સાથે લિંક કરીએ છીએ.",
      card2Title: "દરેક માટે",
      card2Body: "ખેડૂતો, વિદ્યાર્થીઓ, મહિલાઓ, વરિષ્ઠ નાગરિકો, કામદારો, દિવ્યાંગો — સૌ માટે.",
      card3Title: "કાયમ મફત",
      card3Body: "કોઈ સાઇન-અપ નથી, જાહેરાતો નથી, તદ્દન મફત.",
      cautionTitle: "સાવચેતી",
      cautionBody:
        "પાત્રતાના નિયમો બદલાઈ શકે છે. હંમેશા સત્તાવાર સરકારી પોર્ટલ પર ચકાસો. તમારો આધાર ઓટીપી કે બેંક વિગતો કોઈ સાથે શેર કરશો નહીં.",
      checkEligibility: "પાત્રતા તપાસો",
      browseSchemes: "યોજનાઓ જુઓ",
    },
  },

  or: {
    questionnaire: {
      steps: {
        personal: "ବ୍ୟକ୍ତିଗତ",
        location: "ସ୍ଥାନ",
        financial: "ଆର୍ଥିକ",
        occupation: "ବୃତ୍ତି",
      },
      step0: {
        title: "ଆପଣଙ୍କ ବିଷୟରେ ଜଣାନ୍ତୁ",
        subtitle: "ଏହା ବୟସ ଏବଂ ଲିଙ୍ଗ-ଆଧାରିତ ଯୋଜନା ଖୋଜିବାରେ ସାହାଯ୍ୟ କରେ।",
        ageLabel: "ବୟସ",
        agePlaceholder: "ଯଥା: 32",
        genderLabel: "ଲିଙ୍ଗ",
        male: "ପୁରୁଷ",
        female: "ମହିଳା",
        other: "ଅନ୍ୟାନ୍ୟ",
        disabilityLabel: "ଦିବ୍ୟାଙ୍ଗ ଅଟନ୍ତି କି?",
        yes: "ହଁ",
        no: "ନାହିଁ",
      },
      step1: {
        title: "ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି?",
        subtitle: "କେତେକ ଯୋଜନା ରାଜ୍ୟ କିମ୍ବା ସହରାଞ୍ଚଳ/ଗ୍ରାମାଞ୍ଚଳ ବାସିନ୍ଦାଙ୍କ ପାଇଁ ଉଦ୍ଦିଷ୍ଟ।",
        stateLabel: "ରାଜ୍ୟ / କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳ",
        selectState: "ଆପଣଙ୍କ ରାଜ୍ୟ ଚୟନ କରନ୍ତୁ…",
        areaTypeLabel: "ଅଞ୍ଚଳ ପ୍ରକାର",
        urban: "ସହରାଞ୍ଚଳ",
        rural: "ଗ୍ରାମାଞ୍ଚଳ",
      },
      step2: {
        title: "ଆର୍ଥିକ ଏବଂ ପୃଷ୍ଠଭୂମି ବିବରଣୀ",
        subtitle: "କେବଳ ଆୟ, ଶିକ୍ଷା ଏବଂ ବର୍ଗ ଆଧାରିତ ଯୋଗ୍ୟତା ପାଇଁ ବ୍ୟବହୃତ।",
        incomeLabel: "ବାର୍ଷିକ ପାରିବାରିକ ଆୟ (₹)",
        incomePlaceholder: "ଯଥା: 180000",
        educationLabel: "ସର୍ବୋଚ୍ଚ ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା",
        selectEducation: "ଶିକ୍ଷା ଚୟନ କରନ୍ତୁ…",
        casteLabel: "ଜାତି ବର୍ଗ",
        selectCaste: "ବର୍ଗ ଚୟନ କରନ୍ତୁ…",
      },
      step3: {
        title: "ଆପଣଙ୍କ ବୃତ୍ତି / ପେଶା",
        subtitle: "ଉପଯୁକ୍ତ ବିକଳ୍ପ ବାଛନ୍ତୁ।",
        parentOccupationLabel: "ପିତାମାତା / ଅଭିଭାବକଙ୍କ ବୃତ୍ତି",
        parentOccupationSubtitle: "କେତେକ ଛାତ୍ର ଯୋଜନା ପିତାମାତାଙ୍କ ବୃତ୍ତି ଉପରେ ନିର୍ଭର କରେ।",
      },
      nav: {
        back: "ପଛକୁ",
        next: "ପରବର୍ତ୍ତୀ",
        seeResults: "ଫଳାଫଳ ଦେଖନ୍ତୁ",
      },
      occupations: {
        farmer: "କୃଷକ",
        student: "ଛାତ୍ର / ଛାତ୍ରୀ",
        salaried: "ବେତନଭୋଗୀ କର୍ମଚାରୀ",
        "self-employed": "ସ୍ୱନିୟୋଜିତ / ବ୍ୟବସାୟ",
        labour: "ଦିନମଜୁରିଆ / ଶ୍ରମିକ",
        "unorganised-worker": "ଅଣସଂଗଠିତ ଶ୍ରମିକ",
        "street-vendor": "ଉଠାଦୋକାନୀ",
        entrepreneur: "ଉଦ୍ୟୋଗୀ / କ୍ଷୁଦ୍ର ବ୍ୟବସାୟ",
        business: "ବ୍ୟବସାୟୀ",
        unemployed: "ବେକାର",
      },
      parentOccupations: {
        govt: "ସରକାରୀ କର୍ମଚାରୀ",
        pvt: "ବେସରକାରୀ କର୍ମଚାରୀ",
        "self-employed": "ସ୍ୱନିୟୋଜିତ",
        farmer: "କୃଷକ",
        labour: "ଦିନମଜୁରିଆ",
        unemployed: "ବେକାର",
        na: "ପ୍ରଯୁଜ୍ୟ ନୁହେଁ",
      },
      educationLevels: {
        none: "କୌଣସି ଆନୁଷ୍ଠାନିକ ଶିକ୍ଷା ନାହିଁ",
        primary: "ପ୍ରାଥମିକ",
        secondary: "ମାଧ୍ୟମିକ (୧୦ମ)",
        "higher-secondary": "ଉଚ୍ଚ ମାଧ୍ୟମିକ (+୨)",
        diploma: "ଡିପ୍ଲୋମା / ଆଇଟିଆଇ",
        graduate: "ସ୍ନାତକ (Graduate)",
        postgraduate: "ସ୍ନାତକୋତ୍ତର ବା ତଦୁର୍ଦ୍ଧ୍ୱ",
      },
      casteCategories: {
        general: "ସାଧାରଣ (General)",
        obc: "ଓବିସି (OBC)",
        sc: "ଏସସି (SC)",
        st: "ଏସଟି (ST)",
        ews: "ଇଡବ୍ଲ୍ୟୁଏସ (EWS)",
        minority: "ସଂଖ୍ୟାଲଘୁ (Minority)",
      },
    },
    schemes: {
      title: "ସମସ୍ତ ଯୋଜନା ଦେଖନ୍ତୁ",
      subtitle: "କେନ୍ଦ୍ର ଏବଂ ରାଜ୍ୟ ସରକାରଙ୍କ କଲ୍ୟାଣକାରୀ ଯୋଜନା ଖୋଜନ୍ତୁ।",
      searchPlaceholder: "ଯୋଜନା ଖୋଜନ୍ତୁ…",
      all: "ସବୁ",
      central: "କେନ୍ଦ୍ର ସରକାର",
      state: "ରାଜ୍ୟ ସରକାର",
      allStates: "ସମସ୍ତ ରାଜ୍ୟ",
      allCategories: "ସମସ୍ତ ବର୍ଗ",
      centralGovt: "କେନ୍ଦ୍ର ସରକାରଙ୍କ ଯୋଜନା",
      stateGovt: "ରାଜ୍ୟ ସରକାରଙ୍କ ଯୋଜନା",
      noMatch: "କୌଣସି ଯୋଜନା ମିଳିଲା ନାହିଁ।",
      learnMore: "ଅଧିକ ଜାଣନ୍ତୁ",
      save: "ସଂରକ୍ଷଣ",
      saved: "ସଂରକ୍ଷିତ",
    },
    about: {
      badge: "ବିଷୟରେ",
      title: "ପ୍ରତ୍ୟେକ ନାଗରିକ ସେମାନେ ଯୋଗ୍ୟ ଥିବା ସରକାରୀ ଯୋଜନା ପାଇବା ଉଚିତ।",
      description:
        "ଭାରତରେ ଶହ ଶହ କଲ୍ୟାଣକାରୀ ଯୋଜନା ରହିଛି — ମାତ୍ର ଅନେକ ଲୋକ ଜାଣିପାରନ୍ତି ନାହିଁ। ସ୍କିମ୍ ସାଥୀ ଏଆଇ ଏହାକୁ ସହଜ କରିଥାଏ।",
      card1Title: "ସ୍ୱାଧୀନ",
      card1Body: "କୌଣସି ସରକାରୀ ସଂସ୍ଥା ସହ ଜଡିତ ନୁହେଁ। ଆମେ କେବଳ ସରକାରୀ ପୋର୍ଟାଲ ସହିତ ସଂଯୋଗ କରୁ।",
      card2Title: "ସମସ୍ତଙ୍କ ପାଇଁ",
      card2Body: "କୃଷକ, ଛାତ୍ରଛାତ୍ରୀ, ମହିଳା, ବରିଷ୍ଠ ନାଗରିକ, ଶ୍ରମିକ, ଦିବ୍ୟାଙ୍ଗ — ସମସ୍ତଙ୍କ ପାଇଁ।",
      card3Title: "ସବୁଦିନ ପାଇଁ ମାଗଣା",
      card3Body: "କୌଣସି ପଞ୍ଜୀକରଣ ନାହିଁ, ବିଜ୍ଞାପନ ନାହିଁ, ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା।",
      cautionTitle: "ସତର୍କତା",
      cautionBody:
        "ଯୋଗ୍ୟତା ନିୟମ ପରିବର୍ତ୍ତିତ ହୋଇପାରେ। ସରକାରୀ ପୋର୍ଟାଲରେ ଯାଞ୍ଚ କରନ୍ତୁ। ନିଜର ଆଧାର ଓଟିପି କିମ୍ବା ବ୍ୟାଙ୍କ ତଥ୍ୟ କାହା ସହିତ ସେୟାର କରନ୍ତୁ ନାହିଁ।",
      checkEligibility: "ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ",
      browseSchemes: "ଯୋଜନା ଦେଖନ୍ତୁ",
    },
  },
};
