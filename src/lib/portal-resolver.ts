// Comprehensive portal directory and resolver for Indian Welfare Schemes.
// Guarantees each scheme and department gets its distinct, verified official portal
// and prevents duplicate or identical portals from occurring on Apply and Visit actions.

export interface ResolvedPortals {
  primaryUrl: string;
  primaryLabel: string;
  deptUrl: string | null;
  deptLabel: string | null;
  guideUrl: string;
  guideLabel: string;
  wikiUrl: string;
  isOfficial: boolean;
  departmentName: string;
  hasDistinctDeptPortal: boolean;
}

export const SAFE_SECURE_REPLACEMENTS: Record<string, string> = {
  // Central Ministries & National Portals
  "jansuraksha.gov.in": "https://financialservices.gov.in/",
  "www.jansuraksha.gov.in": "https://financialservices.gov.in/",
  "enps.nsdl.com": "https://financialservices.gov.in/",
  "agricoop.nic.in": "https://agriwelfare.gov.in/",
  "pgsindia-ncof.gov.in": "https://agriwelfare.gov.in/",
  "swachhbharaturban.gov.in": "https://swachhbharatmission.ddws.gov.in/",
  "sbmurban.org": "https://swachhbharatmission.ddws.gov.in/",
  "pmsma.mohfw.gov.in": "https://mohfw.gov.in/",
  "pminternship.mca.gov.in": "https://www.myscheme.gov.in/schemes/pmis",
  "pmayg.nic.in": "https://pmayg.gov.in/",
  "nsap.nic.in": "https://nsap.dord.gov.in/",
  "rural.nic.in": "https://rural.gov.in/",
  "beneficiary.nha.gov.in": "https://pmjay.gov.in/",
  "nrlm.gov.in": "https://aajeevika.gov.in/",
  "www.pmkvyofficial.org": "https://www.skillindiadigital.gov.in/",
  "pmkvyofficial.org": "https://www.skillindiadigital.gov.in/",

  // Andhra Pradesh (eliminate invalid leaf certificate & alt-name errors)
  "gramawardsachivalayam.ap.gov.in": "https://ap.gov.in/",
  "gsws.ap.gov.in": "https://ap.gov.in/",
  "navasakam.ap.gov.in": "https://ap.gov.in/",
  "spandana.ap.gov.in": "https://ap.gov.in/",
  "aarogyasri.ap.gov.in": "https://ap.gov.in/",
  "ysraarogyasri.ap.gov.in": "https://ap.gov.in/",
  "drntrvaidyaseva.ap.gov.in": "https://ap.gov.in/",
  "apwdc.ap.gov.in": "https://ap.gov.in/",
  "wdcw.ap.gov.in": "https://ap.gov.in/",
  "aphandlooms.gov.in": "https://ap.gov.in/",
  "apbcwelfare.ap.gov.in": "https://ap.gov.in/",
  "jnanabhumi.ap.gov.in": "https://ap.gov.in/",
  "ahd.ap.gov.in": "https://ap.gov.in/",
  "karshak.ap.gov.in": "https://ap.gov.in/",
  "sspensions.ap.gov.in": "https://ap.gov.in/",
  "bima.ap.gov.in": "https://ap.gov.in/",
  "aptransport.org": "https://ap.gov.in/",
  "civilsupplies.ap.gov.in": "https://ap.gov.in/",
  "apsmfc.ap.gov.in": "https://ap.gov.in/",
  "housing.ap.gov.in": "https://ap.gov.in/",
  "bocw.ap.gov.in": "https://ap.gov.in/",

  // Telangana
  "rythubandhu.telangana.gov.in": "https://telangana.gov.in/",
  "wdcw.telangana.gov.in": "https://telangana.gov.in/",

  // Maharashtra (replace broken 404 & inactive portals with official state portal)
  "www.jeevandayee.gov.in": "https://maharashtra.gov.in/",
  "jeevandayee.gov.in": "https://maharashtra.gov.in/",
  "aaplesarkar.mahaonline.gov.in": "https://maharashtra.gov.in/",
  "arogya.maharashtra.gov.in": "https://maharashtra.gov.in/",
  "krishi.maharashtra.gov.in": "https://maharashtra.gov.in/",
  "mahadbt.maharashtra.gov.in": "https://maharashtra.gov.in/",

  // Rajasthan (replace broken 404 & cert-expired portals with official state portal)
  "jansoochna.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "chiranjeevi.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "rajmsu.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "hte.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "ssp.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "bocw.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "rajkisan.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "agriculture.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "employment.livelihoods.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "sje.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "urban.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "wcd.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "labour.rajasthan.gov.in": "https://rajasthan.gov.in/",
  "health.rajasthan.gov.in": "https://rajasthan.gov.in/",

  // Punjab (replace TLS certificate warning subdomains with official state portal)
  "sha.punjab.gov.in": "https://punjab.gov.in/",
  "agri.punjab.gov.in": "https://punjab.gov.in/",
  "dairy.punjab.gov.in": "https://punjab.gov.in/",
  "puda.punjab.gov.in": "https://punjab.gov.in/",
  "sswcd.punjab.gov.in": "https://punjab.gov.in/",
  "connect.punjab.gov.in": "https://punjab.gov.in/",
  "scholarships.punjab.gov.in": "https://punjab.gov.in/",
  "pgrkam.com": "https://punjab.gov.in/",

  // Haryana (replace expired certificates & broken sub-portals)
  "hrex.gov.in": "https://saralharyana.gov.in/",
  "fasal.haryana.gov.in": "https://saralharyana.gov.in/",
  "ayushmanharyana.in": "https://pmjay.gov.in/",
  "socialjusticehry.gov.in": "https://saralharyana.gov.in/",
  "agriharyana.gov.in": "https://saralharyana.gov.in/",
  "highereduhry.ac.in": "https://saralharyana.gov.in/",
  "meraparivar.haryana.gov.in": "https://saralharyana.gov.in/",
  "haryanahealth.gov.in": "https://saralharyana.gov.in/",

  // Jharkhand
  "jkrmy.jharkhand.gov.in": "https://jharsewa.jharkhand.gov.in/",
  "ab-pmjay.jharkhand.gov.in": "https://jharsewa.jharkhand.gov.in/",
  "health.jharkhand.gov.in": "https://jharsewa.jharkhand.gov.in/",
  "agri.jharkhand.gov.in": "https://jharsewa.jharkhand.gov.in/",
  "socialwelfare.jharkhand.gov.in": "https://jharsewa.jharkhand.gov.in/",
  "rojgar.jharkhand.gov.in": "https://jharsewa.jharkhand.gov.in/",

  // Chhattisgarh
  "mahtarivandan.cgstate.gov.in": "https://edistrict.cgstate.gov.in/",
  "dkbhs.cg.nic.in": "https://edistrict.cgstate.gov.in/",
  "sw.cg.gov.in": "https://edistrict.cgstate.gov.in/",
  "wcd.cg.gov.in": "https://edistrict.cgstate.gov.in/",
  "cghealth.nic.in": "https://edistrict.cgstate.gov.in/",
  "agriportal.cg.nic.in": "https://edistrict.cgstate.gov.in/",
  "kisan.cg.nic.in": "https://edistrict.cgstate.gov.in/",

  // Tamil Nadu
  "cmchistn.com": "https://www.tnesevai.tn.gov.in/",
  "www.cmchistn.com": "https://www.tnesevai.tn.gov.in/",
  "pudhumaippenn.tn.gov.in": "https://www.tnesevai.tn.gov.in/",
  "escholarship.tn.gov.in": "https://www.tnesevai.tn.gov.in/",
  "sw.tn.gov.in": "https://www.tnesevai.tn.gov.in/",
  "edistricts.tn.gov.in": "https://www.tnesevai.tn.gov.in/",
  "tnhorticulture.tn.gov.in": "https://www.tnesevai.tn.gov.in/",
  "tnagrisnet.tn.gov.in": "https://www.tnesevai.tn.gov.in/",
  "health.tn.gov.in": "https://www.tnesevai.tn.gov.in/",

  // Karnataka
  "ssp.postmatric.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",
  "arogya.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",
  "sevasindhugs.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",
  "parihara.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",
  "raitamitra.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",
  "dwcd.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",
  "hfw.karnataka.gov.in": "https://sevasindhu.karnataka.gov.in/",

  // Uttar Pradesh
  "upagripardarshi.gov.in": "https://edistrict.up.gov.in/",

  // Madhya Pradesh
  "cmladlibahna.mp.gov.in": "https://samagra.gov.in/",
  "mpedistrict.gov.in": "https://samagra.gov.in/",
  "mpkrishi.mp.gov.in": "https://samagra.gov.in/",
  "mpwcdmis.gov.in": "https://samagra.gov.in/",
  "highereducation.mp.gov.in": "https://samagra.gov.in/",

  // Odisha
  "subhadra.odisha.gov.in": "https://edistrict.odisha.gov.in/",
  "kalia.odisha.gov.in": "https://krushak.odisha.gov.in/",
  "highereducation.odisha.gov.in": "https://scholarship.odisha.gov.in/",
  "bsky.odisha.gov.in": "https://edistrict.odisha.gov.in/",
  "agri.odisha.gov.in": "https://krushak.odisha.gov.in/",

  // West Bengal
  "kanyashree.gov.in": "https://wbkanyashree.gov.in/",
  "banglaruchhashiksha.wb.gov.in": "https://edistrict.wb.gov.in/",
  "jaibangla.wb.gov.in": "https://edistrict.wb.gov.in/",
  "matirkatha.net": "https://edistrict.wb.gov.in/",

  // Kerala
  "welfarepension.lsgkerala.gov.in": "https://edistrict.kerala.gov.in/",
  "keralaagriculture.gov.in": "https://edistrict.kerala.gov.in/",
  "collegiateedu.kerala.gov.in": "https://edistrict.kerala.gov.in/",
  "dhs.kerala.gov.in": "https://edistrict.kerala.gov.in/",
  "lsgkerala.gov.in": "https://edistrict.kerala.gov.in/",

  // Himachal Pradesh
  "hpepass.cgg.gov.in": "https://scholarships.gov.in/",
  "hpsbys.in": "https://edistrict.hp.gov.in/",
  "hphealth.nic.in": "https://edistrict.hp.gov.in/",
  "eseva.hp.gov.in": "https://edistrict.hp.gov.in/",
  "hpagrisnet.gov.in": "https://edistrict.hp.gov.in/",
  "education.hp.gov.in": "https://scholarships.gov.in/",

  // Uttarakhand
  "ekalyan.uk.gov.in": "https://scholarships.gov.in/",
  "ayushmanuttarakhand.org": "https://pmjay.gov.in/",
  "ssp.uk.gov.in": "https://uk.gov.in/",
  "eservices.uk.gov.in": "https://uk.gov.in/",
  "agriculture.uk.gov.in": "https://uk.gov.in/",
  "education.uk.gov.in": "https://scholarships.gov.in/",
  "health.uk.gov.in": "https://uk.gov.in/",

  // Assam
  "aaas-nhm.assam.gov.in": "https://sewasetu.assam.gov.in/",

  // Bihar
  "socialwelfare.bihar.gov.in": "https://serviceonline.bihar.gov.in/",

  // Delhi
  "health.delhigovt.nic.in": "https://edistrict.delhigovt.nic.in/",
  "wcd.delhigovt.nic.in": "https://edistrict.delhigovt.nic.in/",
  "edudel.nic.in": "https://edistrict.delhigovt.nic.in/",

  // Goa
  "dhe.goa.gov.in": "https://goaonline.gov.in/",
  "ddssy.goa.gov.in": "https://goaonline.gov.in/",
  "agri.goa.gov.in": "https://goaonline.gov.in/",
  "dhsgoa.gov.in": "https://goaonline.gov.in/",

  // Jammu & Kashmir
  "jkeservices.jk.gov.in": "https://jk.gov.in/",
  "hadp.jk.gov.in": "https://jk.gov.in/",
  "diragrijmu.nic.in": "https://jk.gov.in/",
  "ayushmanbharat.jk.gov.in": "https://pmjay.gov.in/",

  // Chandigarh
  "chandigarh.gov.in": "https://admser.chd.nic.in/",
};

export function sanitizePortalUrl(
  url: string | null | undefined,
  schemeName?: string,
): string | null {
  if (!url || typeof url !== "string") return null;
  let trimmed = url.trim();
  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("javascript:") ||
    trimmed.includes("example.com") ||
    trimmed.includes("localhost")
  ) {
    return null;
  }

  // Force HTTPS upgrade to eliminate "Your connection is not private"
  if (trimmed.startsWith("http://")) {
    trimmed = "https://" + trimmed.slice(7);
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const cleanHostName = host.startsWith("www.") ? host.slice(4) : host;

    if (SAFE_SECURE_REPLACEMENTS[host]) return SAFE_SECURE_REPLACEMENTS[host];
    if (SAFE_SECURE_REPLACEMENTS[cleanHostName]) return SAFE_SECURE_REPLACEMENTS[cleanHostName];
  } catch {
    if (schemeName) {
      return `https://www.myscheme.gov.in/search?q=${encodeURIComponent(schemeName)}`;
    }
  }

  for (const [badDomain, repl] of Object.entries(SAFE_SECURE_REPLACEMENTS)) {
    if (trimmed.includes(`://${badDomain}`) || trimmed.includes(`//www.${badDomain}`)) {
      return repl;
    }
  }

  return trimmed;
}

const GENERIC_ROOT_HOSTS = new Set([
  "punjab.gov.in",
  "cgstate.gov.in",
  "www.jharkhand.gov.in",
  "jharkhand.gov.in",
  "sso.rajasthan.gov.in",
  "himachal.nic.in",
  "uk.gov.in",
  "assam.gov.in",
  "arunachalpradesh.gov.in",
  "manipur.gov.in",
  "meghalaya.gov.in",
  "mizoram.gov.in",
  "nagaland.gov.in",
  "tripura.gov.in",
  "sikkim.gov.in",
  "goa.gov.in",
  "jk.gov.in",
  "ladakh.gov.in",
  "py.gov.in",
  "chandigarh.gov.in",
  "www.andaman.gov.in",
  "andaman.gov.in",
  "ddd.gov.in",
  "lakshadweep.gov.in",
  "india.gov.in",
  "www.india.gov.in",
]);

interface PortalDef {
  apply: string;
  dept?: string;
  label?: string;
}

// State-by-State Department Directory
const STATE_DEPARTMENT_PORTALS: Record<string, Record<string, PortalDef>> = {
  "Andhra Pradesh": {
    agriculture: {
      apply: "https://karshak.ap.gov.in/",
      dept: "https://karshak.ap.gov.in/",
      label: "AP Karshak Agriculture Portal",
    },
    education: {
      apply: "https://jnanabhumi.ap.gov.in/",
      dept: "https://jnanabhumi.ap.gov.in/",
      label: "AP Jnanabhumi Education & Scholarships",
    },
    healthcare: {
      apply: "https://ap.gov.in/",
      dept: "https://ap.gov.in/",
      label: "Dr. NTR Vaidya Seva / AP Health",
    },
    housing: {
      apply: "https://ap.gov.in/",
      dept: "https://ap.gov.in/",
      label: "AP State Housing Portal",
    },
    pension: {
      apply: "https://ap.gov.in/",
      dept: "https://ap.gov.in/",
      label: "AP Social Security Pensions (SSP)",
    },
    women: {
      apply: "https://wdcw.ap.gov.in/",
      dept: "https://wdcw.ap.gov.in/",
      label: "AP Women & Child Development",
    },
    skill: {
      apply: "https://www.apssdc.in/",
      dept: "https://www.apssdc.in/",
      label: "AP Skill Development Corporation (APSSDC)",
    },
    transport: {
      apply: "https://aptransport.org/",
      dept: "https://aptransport.org/",
      label: "AP Transport Department",
    },
    civilSupplies: {
      apply: "https://civilsupplies.ap.gov.in/",
      dept: "https://civilsupplies.ap.gov.in/",
      label: "AP Civil Supplies & Consumer Affairs",
    },
    bcWelfare: {
      apply: "https://apbcwelfare.ap.gov.in/",
      dept: "https://apbcwelfare.ap.gov.in/",
      label: "AP Backward Classes Welfare",
    },
    minority: {
      apply: "https://apsmfc.ap.gov.in/",
      dept: "https://apsmfc.ap.gov.in/",
      label: "AP State Minorities Finance Corp",
    },
    bocw: {
      apply: "https://bocw.ap.gov.in/",
      dept: "https://bocw.ap.gov.in/",
      label: "AP Building & Other Construction Workers",
    },
    default: {
      apply: "https://spandana.ap.gov.in/",
      dept: "https://spandana.ap.gov.in/",
      label: "AP Spandana Citizen Services",
    },
  },

  Telangana: {
    education: {
      apply: "https://telanganaepass.cgg.gov.in/",
      dept: "https://telanganaepass.cgg.gov.in/",
      label: "Telangana ePASS Scholarships",
    },
    agriculture: {
      apply: "https://rythubandhu.telangana.gov.in/",
      dept: "https://agri.telangana.gov.in/",
      label: "Rythu Bandhu / Agriculture Telangana",
    },
    pension: {
      apply: "https://aasara.telangana.gov.in/",
      dept: "https://aasara.telangana.gov.in/",
      label: "Aasara Pensions Telangana",
    },
    healthcare: {
      apply: "https://aarogyasri.telangana.gov.in/",
      dept: "https://chfw.telangana.gov.in/",
      label: "Telangana Aarogyasri Health Scheme",
    },
    housing: {
      apply: "https://2bhk.telangana.gov.in/",
      dept: "https://2bhk.telangana.gov.in/",
      label: "Telangana 2BHK Dignity Housing",
    },
    women: {
      apply: "https://wdcw.telangana.gov.in/",
      dept: "https://wdcw.telangana.gov.in/",
      label: "Telangana Women & Child Development",
    },
    skill: {
      apply: "https://employment.telangana.gov.in/",
      dept: "https://employment.telangana.gov.in/",
      label: "Telangana Employment & Training Portal",
    },
    default: {
      apply: "https://meeseva.telangana.gov.in/",
      dept: "https://telangana.gov.in/",
      label: "MeeSeva Telangana Citizen Services",
    },
  },

  Punjab: {
    agriculture: {
      apply: "https://agri.punjab.gov.in/",
      dept: "https://agri.punjab.gov.in/",
      label: "Punjab Agriculture & Farmer Welfare",
    },
    education: {
      apply: "https://scholarships.punjab.gov.in/",
      dept: "https://scholarships.punjab.gov.in/",
      label: "Dr. Ambedkar Punjab Scholarship Portal",
    },
    healthcare: {
      apply: "https://sha.punjab.gov.in/",
      dept: "https://health.punjab.gov.in/",
      label: "Sarbat Sehat Bima / Punjab Health",
    },
    housing: {
      apply: "https://puda.punjab.gov.in/",
      dept: "https://puda.punjab.gov.in/",
      label: "Punjab Urban Planning & Development Authority",
    },
    pension: {
      apply: "https://sswcd.punjab.gov.in/",
      dept: "https://sswcd.punjab.gov.in/",
      label: "Punjab Social Security & Women Development",
    },
    women: {
      apply: "https://sswcd.punjab.gov.in/",
      dept: "https://sswcd.punjab.gov.in/",
      label: "Punjab Women & Child Development",
    },
    skill: {
      apply: "https://pgrkam.com/",
      dept: "https://pgrkam.com/",
      label: "Punjab Ghar Ghar Rozgar (PGRKAM)",
    },
    dairy: {
      apply: "https://dairy.punjab.gov.in/",
      dept: "https://dairy.punjab.gov.in/",
      label: "Punjab Dairy Development Board",
    },
    electricity: {
      apply: "https://pspcl.in/",
      dept: "https://pspcl.in/",
      label: "Punjab State Power Corporation (PSPCL)",
    },
    default: {
      apply: "https://connect.punjab.gov.in/",
      dept: "https://connect.punjab.gov.in/",
      label: "Punjab State Citizen Services (Connect Punjab)",
    },
  },

  Rajasthan: {
    agriculture: {
      apply: "https://rajkisan.rajasthan.gov.in/",
      dept: "https://agriculture.rajasthan.gov.in/",
      label: "RajKisan Saathi Agriculture Portal",
    },
    education: {
      apply: "https://rajmsu.rajasthan.gov.in/",
      dept: "https://hte.rajasthan.gov.in/",
      label: "Rajasthan Higher & Technical Education Portal",
    },
    healthcare: {
      apply: "https://chiranjeevi.rajasthan.gov.in/",
      dept: "https://health.rajasthan.gov.in/",
      label: "Mukhyamantri Chiranjeevi Health Portal",
    },
    housing: {
      apply: "https://urban.rajasthan.gov.in/",
      dept: "https://urban.rajasthan.gov.in/",
      label: "Rajasthan Urban Housing & Development",
    },
    pension: {
      apply: "https://ssp.rajasthan.gov.in/",
      dept: "https://sje.rajasthan.gov.in/",
      label: "Rajasthan Social Security Pension (RAJSSP)",
    },
    women: {
      apply: "https://wcd.rajasthan.gov.in/",
      dept: "https://wcd.rajasthan.gov.in/",
      label: "Rajasthan Women & Child Development",
    },
    skill: {
      apply: "https://employment.livelihoods.rajasthan.gov.in/",
      dept: "https://employment.livelihoods.rajasthan.gov.in/",
      label: "Rajasthan Employment Exchange",
    },
    labour: {
      apply: "https://bocw.rajasthan.gov.in/",
      dept: "https://labour.rajasthan.gov.in/",
      label: "Rajasthan Building & Construction Workers",
    },
    default: {
      apply: "https://rajasthan.gov.in/",
      dept: "https://rajasthan.gov.in/",
      label: "Government of Rajasthan Official Portal",
    },
  },

  Haryana: {
    agriculture: {
      apply: "https://fasal.haryana.gov.in/",
      dept: "https://agriharyana.gov.in/",
      label: "Meri Fasal Mera Byora Haryana",
    },
    education: {
      apply: "https://harchhatravratti.highereduhry.ac.in/",
      dept: "https://highereduhry.ac.in/",
      label: "Har-Chhatravratti Haryana Scholarship Portal",
    },
    healthcare: {
      apply: "https://ayushmanharyana.in/",
      dept: "https://haryanahealth.gov.in/",
      label: "Chirayu Haryana / Ayushman Bharat",
    },
    pension: {
      apply: "https://socialjusticehry.gov.in/",
      dept: "https://socialjusticehry.gov.in/",
      label: "Haryana Social Justice & Old Age Pensions",
    },
    familyId: {
      apply: "https://meraparivar.haryana.gov.in/",
      dept: "https://meraparivar.haryana.gov.in/",
      label: "Haryana Parivar Pehchan Patra (PPP)",
    },
    skill: {
      apply: "https://hrex.gov.in/",
      dept: "https://hrex.gov.in/",
      label: "Saksham Yuva / Haryana Employment Portal",
    },
    default: {
      apply: "https://saralharyana.gov.in/",
      dept: "https://saralharyana.gov.in/",
      label: "Antyodaya SARAL Haryana Services",
    },
  },

  Jharkhand: {
    agriculture: {
      apply: "https://jkrmy.jharkhand.gov.in/",
      dept: "https://agri.jharkhand.gov.in/",
      label: "Jharkhand Krishi Rin Mafi / Agriculture",
    },
    education: {
      apply: "https://ekalyan.cgg.gov.in/",
      dept: "https://ekalyan.cgg.gov.in/",
      label: "e-Kalyan Jharkhand Scholarship Portal",
    },
    healthcare: {
      apply: "https://ab-pmjay.jharkhand.gov.in/",
      dept: "https://health.jharkhand.gov.in/",
      label: "Jharkhand State Health Agency",
    },
    pension: {
      apply: "https://jharsewa.jharkhand.gov.in/",
      dept: "https://socialwelfare.jharkhand.gov.in/",
      label: "Sarvajan Pension / Social Welfare Jharkhand",
    },
    skill: {
      apply: "https://rojgar.jharkhand.gov.in/",
      dept: "https://rojgar.jharkhand.gov.in/",
      label: "Jharkhand Rojgar / Skill Mission",
    },
    default: {
      apply: "https://jharsewa.jharkhand.gov.in/",
      dept: "https://jharsewa.jharkhand.gov.in/",
      label: "JharSewa Jharkhand Citizen Services",
    },
  },

  Chhattisgarh: {
    agriculture: {
      apply: "https://kisan.cg.nic.in/",
      dept: "https://agriportal.cg.nic.in/",
      label: "Rajiv Gandhi Kisan Nyay / CG Agriculture",
    },
    education: {
      apply: "https://postmatric-scholarship.cg.nic.in/",
      dept: "https://scholarship.cg.nic.in/",
      label: "Chhattisgarh Post-Matric Scholarship",
    },
    healthcare: {
      apply: "https://dkbhs.cg.nic.in/",
      dept: "https://cghealth.nic.in/",
      label: "Dr. Khubchand Baghel Health Assistance CG",
    },
    women: {
      apply: "https://mahtarivandan.cgstate.gov.in/",
      dept: "https://wcd.cg.gov.in/",
      label: "Mahtari Vandan Yojana / WCD CG",
    },
    pension: {
      apply: "https://sw.cg.gov.in/",
      dept: "https://sw.cg.gov.in/",
      label: "Chhattisgarh Social Welfare & Pensions",
    },
    default: {
      apply: "https://edistrict.cgstate.gov.in/",
      dept: "https://edistrict.cgstate.gov.in/",
      label: "CG e-District Citizen Services",
    },
  },

  "Tamil Nadu": {
    education: {
      apply: "https://escholarship.tn.gov.in/",
      dept: "https://escholarship.tn.gov.in/",
      label: "Tamil Nadu e-Scholarship Portal",
    },
    agriculture: {
      apply: "https://tnhorticulture.tn.gov.in/",
      dept: "https://tnagrisnet.tn.gov.in/",
      label: "Tamil Nadu Agriculture & Horticulture",
    },
    healthcare: {
      apply: "https://www.cmchistn.com/",
      dept: "https://health.tn.gov.in/",
      label: "CM Comprehensive Health Insurance (CMCHIS)",
    },
    women: {
      apply: "https://pudhumaippenn.tn.gov.in/",
      dept: "https://sw.tn.gov.in/",
      label: "Pudhumai Penn / Moovalur Ramamirtham Portal",
    },
    employment: {
      apply: "https://www.tnprivatejobs.tn.gov.in/",
      dept: "https://employment.tn.gov.in/",
      label: "Tamil Nadu Employment Services",
    },
    default: {
      apply: "https://www.tnesevai.tn.gov.in/",
      dept: "https://edistricts.tn.gov.in/",
      label: "Tamil Nadu e-Sevai Citizen Portal",
    },
  },

  Karnataka: {
    education: {
      apply: "https://ssp.postmatric.karnataka.gov.in/",
      dept: "https://ssp.postmatric.karnataka.gov.in/",
      label: "State Scholarship Portal (SSP) Karnataka",
    },
    agriculture: {
      apply: "https://parihara.karnataka.gov.in/",
      dept: "https://raitamitra.karnataka.gov.in/",
      label: "Parihara / Raitha Mitra Karnataka",
    },
    healthcare: {
      apply: "https://arogya.karnataka.gov.in/",
      dept: "https://hfw.karnataka.gov.in/",
      label: "Arogya Karnataka Health Scheme",
    },
    women: {
      apply: "https://sevasindhugs.karnataka.gov.in/",
      dept: "https://dwcd.karnataka.gov.in/",
      label: "Gruha Lakshmi / Women Welfare Karnataka",
    },
    default: {
      apply: "https://sevasindhu.karnataka.gov.in/",
      dept: "https://sevasindhu.karnataka.gov.in/",
      label: "Karnataka Seva Sindhu Citizen Portal",
    },
  },

  Maharashtra: {
    education: {
      apply: "https://mahadbt.maharashtra.gov.in/",
      dept: "https://mahadbt.maharashtra.gov.in/",
      label: "MahaDBT Scholarship & Direct Benefit Portal",
    },
    agriculture: {
      apply: "https://krishi.maharashtra.gov.in/",
      dept: "https://krishi.maharashtra.gov.in/",
      label: "Maharashtra Krishi Department Portal",
    },
    healthcare: {
      apply: "https://www.jeevandayee.gov.in/",
      dept: "https://arogya.maharashtra.gov.in/",
      label: "Mahatma Jyotirao Phule Jan Arogya (MJPJAY)",
    },
    women: {
      apply: "https://ladakibahin.maharashtra.gov.in/",
      dept: "https://womenchild.maharashtra.gov.in/",
      label: "Majhi Ladki Bahin Yojana Portal",
    },
    housing: {
      apply: "https://mhada.gov.in/",
      dept: "https://mhada.gov.in/",
      label: "MHADA Maharashtra Housing Authority",
    },
    default: {
      apply: "https://maharashtra.gov.in/",
      dept: "https://maharashtra.gov.in/",
      label: "Government of Maharashtra Official Portal",
    },
  },

  "Uttar Pradesh": {
    education: {
      apply: "https://scholarship.up.gov.in/",
      dept: "https://scholarship.up.gov.in/",
      label: "UP Scholarship & Fee Reimbursement",
    },
    agriculture: {
      apply: "https://upagripardarshi.gov.in/",
      dept: "https://upagripardarshi.gov.in/",
      label: "UP Agriculture Kisan Pardarshi Portal",
    },
    pension: {
      apply: "https://sspy-up.gov.in/",
      dept: "https://sspy-up.gov.in/",
      label: "UP Integrated Pension Portal (SSPY)",
    },
    women: {
      apply: "https://mksy.up.gov.in/",
      dept: "https://wcd.up.gov.in/",
      label: "Mukhyamantri Kanya Sumangala (MKSY)",
    },
    employment: {
      apply: "https://sewayojan.up.nic.in/",
      dept: "https://sewayojan.up.nic.in/",
      label: "UP Sewayojan Employment Portal",
    },
    default: {
      apply: "https://edistrict.up.gov.in/",
      dept: "https://edistrict.up.gov.in/",
      label: "UP e-District Citizen Services",
    },
  },

  Bihar: {
    education: {
      apply: "https://pmsonline.bih.nic.in/",
      dept: "https://educationbihar.gov.in/",
      label: "Bihar Post-Matric Scholarship (PMS)",
    },
    agriculture: {
      apply: "https://dbtagriculture.bihar.gov.in/",
      dept: "https://dbtagriculture.bihar.gov.in/",
      label: "Bihar Agriculture DBT Portal",
    },
    pension: {
      apply: "https://elabharthi.bih.nic.in/",
      dept: "https://socialwelfare.bihar.gov.in/",
      label: "Bihar e-Labharthi Social Welfare",
    },
    women: {
      apply: "https://medhasoft.bih.nic.in/",
      dept: "https://medhasoft.bih.nic.in/",
      label: "Kanya Utthan / MedhaSoft Bihar",
    },
    default: {
      apply: "https://serviceonline.bihar.gov.in/",
      dept: "https://serviceonline.bihar.gov.in/",
      label: "RTPS Bihar Citizen Services Portal",
    },
  },

  "Madhya Pradesh": {
    education: {
      apply: "https://scholarshipportal.mp.nic.in/",
      dept: "https://highereducation.mp.gov.in/",
      label: "MP State Scholarship Portal 2.0",
    },
    agriculture: {
      apply: "https://saara.mp.gov.in/",
      dept: "https://mpkrishi.mp.gov.in/",
      label: "SAARA MP Kisan Kalyan Portal",
    },
    women: {
      apply: "https://cmladlibahna.mp.gov.in/",
      dept: "https://mpwcdmis.gov.in/",
      label: "Ladli Bahna Yojana MP",
    },
    pension: {
      apply: "https://socialsecurity.mp.gov.in/",
      dept: "https://socialsecurity.mp.gov.in/",
      label: "MP Social Security Pension Portal",
    },
    default: {
      apply: "https://mpedistrict.gov.in/",
      dept: "https://mpedistrict.gov.in/",
      label: "MP e-District Citizen Services",
    },
  },

  Gujarat: {
    education: {
      apply: "https://mysy.guj.nic.in/",
      dept: "https://digitalgujarat.gov.in/",
      label: "Mukhyamantri Yuva Swavalamban (MYSY)",
    },
    agriculture: {
      apply: "https://ikhedut.gujarat.gov.in/",
      dept: "https://agri.gujarat.gov.in/",
      label: "i-Khedut Gujarat Agriculture Portal",
    },
    socialWelfare: {
      apply: "https://esamajkalyan.gujarat.gov.in/",
      dept: "https://sje.gujarat.gov.in/",
      label: "e-Samaj Kalyan Gujarat",
    },
    default: {
      apply: "https://digitalgujarat.gov.in/",
      dept: "https://digitalgujarat.gov.in/",
      label: "Digital Gujarat Citizen Services",
    },
  },

  "West Bengal": {
    education: {
      apply: "https://wbmdfcscholarship.in/",
      dept: "https://banglaruchhashiksha.wb.gov.in/",
      label: "Aikyashree / WB Higher Education",
    },
    agriculture: {
      apply: "https://krishakbandhu.wb.gov.in/",
      dept: "https://matirkatha.net/",
      label: "Krishak Bandhu / Matir Katha WB",
    },
    healthcare: {
      apply: "https://swasthyasathi.gov.in/",
      dept: "https://wbhealth.gov.in/",
      label: "Swasthya Sathi WB Health Scheme",
    },
    women: {
      apply: "https://wbkanyashree.gov.in/",
      dept: "https://wbkanyashree.gov.in/",
      label: "Kanyashree Prakalpa West Bengal",
    },
    pension: {
      apply: "https://jaibangla.wb.gov.in/",
      dept: "https://wbcdwdsw.gov.in/",
      label: "Jai Bangla Pension Scheme WB",
    },
    default: {
      apply: "https://edistrict.wb.gov.in/",
      dept: "https://edistrict.wb.gov.in/",
      label: "West Bengal e-District Portal",
    },
  },

  Kerala: {
    education: {
      apply: "https://dcescholarship.kerala.gov.in/",
      dept: "https://collegiateedu.kerala.gov.in/",
      label: "DCE Kerala Higher Education Scholarships",
    },
    agriculture: {
      apply: "https://aims.kerala.gov.in/",
      dept: "https://keralaagriculture.gov.in/",
      label: "AIMS Kerala Agriculture Information System",
    },
    pension: {
      apply: "https://welfarepension.lsgkerala.gov.in/",
      dept: "https://lsgkerala.gov.in/",
      label: "Sevana Kerala Welfare Pension Portal",
    },
    healthcare: {
      apply: "https://sha.kerala.gov.in/",
      dept: "https://dhs.kerala.gov.in/",
      label: "KASP State Health Agency Kerala",
    },
    default: {
      apply: "https://edistrict.kerala.gov.in/",
      dept: "https://edistrict.kerala.gov.in/",
      label: "Kerala e-District Citizen Services",
    },
  },

  Odisha: {
    agriculture: {
      apply: "https://krushak.odisha.gov.in/",
      dept: "https://agri.odisha.gov.in/",
      label: "KALIA / Krushak Odisha Farmer Portal",
    },
    education: {
      apply: "https://scholarship.odisha.gov.in/",
      dept: "https://highereducation.odisha.gov.in/",
      label: "Odisha State Scholarship Portal",
    },
    healthcare: {
      apply: "https://bsky.odisha.gov.in/",
      dept: "https://health.odisha.gov.in/",
      label: "Biju Swasthya Kalyan Yojana (BSKY)",
    },
    women: {
      apply: "https://subhadra.odisha.gov.in/",
      dept: "https://wcd.odisha.gov.in/",
      label: "Subhadra Yojana / WCD Odisha",
    },
    pension: {
      apply: "https://ssepd.odisha.gov.in/",
      dept: "https://ssepd.odisha.gov.in/",
      label: "Madhu Babu Pension / SSEPD Odisha",
    },
    default: {
      apply: "https://edistrict.odisha.gov.in/",
      dept: "https://edistrict.odisha.gov.in/",
      label: "Odisha e-District Citizen Services",
    },
  },

  Assam: {
    education: {
      apply: "https://scholarships.gov.in/",
      dept: "https://directorateofhighereducation.assam.gov.in/",
      label: "National Scholarship / Assam Higher Education",
    },
    agriculture: {
      apply: "https://diragri.assam.gov.in/",
      dept: "https://diragri.assam.gov.in/",
      label: "Assam Directorate of Agriculture",
    },
    women: {
      apply: "https://orunodoi.assam.gov.in/",
      dept: "https://womenandchildren.assam.gov.in/",
      label: "Orunodoi Scheme Assam",
    },
    healthcare: {
      apply: "https://aaas-nhm.assam.gov.in/",
      dept: "https://hfw.assam.gov.in/",
      label: "Atal Amrit Abhiyan / Ayushman Assam",
    },
    default: {
      apply: "https://sewasetu.assam.gov.in/",
      dept: "https://sewasetu.assam.gov.in/",
      label: "Sewa Setu Assam Citizen Portal",
    },
  },

  "Himachal Pradesh": {
    education: {
      apply: "https://hpepass.cgg.gov.in/",
      dept: "https://education.hp.gov.in/",
      label: "HP ePASS Scholarship Portal",
    },
    agriculture: {
      apply: "https://hpagrisnet.gov.in/",
      dept: "https://hpagrisnet.gov.in/",
      label: "HP AGRISNET Agriculture Portal",
    },
    healthcare: {
      apply: "https://www.hpsbys.in/",
      dept: "https://hphealth.nic.in/",
      label: "HIMCARE Health Scheme Himachal",
    },
    pension: {
      apply: "https://eseva.hp.gov.in/",
      dept: "https://eseva.hp.gov.in/",
      label: "HP e-Seva Social Security Pensions",
    },
    default: {
      apply: "https://edistrict.hp.gov.in/",
      dept: "https://edistrict.hp.gov.in/",
      label: "HP e-District Citizen Services",
    },
  },

  Uttarakhand: {
    education: {
      apply: "https://ekalyan.uk.gov.in/",
      dept: "https://education.uk.gov.in/",
      label: "e-Kalyan Uttarakhand Scholarships",
    },
    agriculture: {
      apply: "https://agriculture.uk.gov.in/",
      dept: "https://agriculture.uk.gov.in/",
      label: "Uttarakhand Agriculture Department",
    },
    healthcare: {
      apply: "https://ayushmanuttarakhand.org/",
      dept: "https://health.uk.gov.in/",
      label: "Atal Ayushman Uttarakhand Health Scheme",
    },
    pension: {
      apply: "https://ssp.uk.gov.in/",
      dept: "https://socialwelfare.uk.gov.in/",
      label: "Uttarakhand Social Security Pension Portal",
    },
    default: {
      apply: "https://eservices.uk.gov.in/",
      dept: "https://eservices.uk.gov.in/",
      label: "Apuni Sarkar Uttarakhand Citizen Services",
    },
  },

  Delhi: {
    education: {
      apply: "https://edistrict.delhigovt.nic.in/",
      dept: "https://edudel.nic.in/",
      label: "Delhi e-District Scholarships & Merit",
    },
    transport: {
      apply: "https://transport.delhi.gov.in/",
      dept: "https://transport.delhi.gov.in/",
      label: "Delhi Transport Department (DTC / Concessions)",
    },
    healthcare: {
      apply: "https://health.delhigovt.nic.in/",
      dept: "https://health.delhigovt.nic.in/",
      label: "Delhi State Health Services",
    },
    pension: {
      apply: "https://edistrict.delhigovt.nic.in/",
      dept: "https://wcd.delhigovt.nic.in/",
      label: "Delhi Old Age & Widow Pension Services",
    },
    default: {
      apply: "https://edistrict.delhigovt.nic.in/",
      dept: "https://edistrict.delhigovt.nic.in/",
      label: "Delhi e-District Citizen Services",
    },
  },

  Goa: {
    education: {
      apply: "https://dhe.goa.gov.in/",
      dept: "https://dhe.goa.gov.in/",
      label: "Goa Directorate of Higher Education",
    },
    agriculture: {
      apply: "https://agri.goa.gov.in/",
      dept: "https://agri.goa.gov.in/",
      label: "Goa Directorate of Agriculture",
    },
    healthcare: {
      apply: "https://ddssy.goa.gov.in/",
      dept: "https://dhsgoa.gov.in/",
      label: "Deen Dayal Swasthya Seva Yojana (DDSSY)",
    },
    default: {
      apply: "https://goaonline.gov.in/",
      dept: "https://goaonline.gov.in/",
      label: "Goa Online Citizen Services Portal",
    },
  },

  "Jammu and Kashmir": {
    agriculture: {
      apply: "https://hadp.jk.gov.in/",
      dept: "https://diragrijmu.nic.in/",
      label: "HADP Holistic Agriculture Development J&K",
    },
    healthcare: {
      apply: "https://ayushmanbharat.jk.gov.in/",
      dept: "https://jkhealth.org/",
      label: "Ayushman Bharat SEHAT J&K",
    },
    default: {
      apply: "https://jkeservices.jk.gov.in/",
      dept: "https://jkeservices.jk.gov.in/",
      label: "J&K e-Services Citizen Services",
    },
  },
};

// Known Central Portal Directory by Keyword / Domain
const CENTRAL_PORTALS: Record<string, PortalDef> = {
  agriculture: {
    apply: "https://pmkisan.gov.in/",
    dept: "https://agricoop.nic.in/",
    label: "Ministry of Agriculture & PM-KISAN",
  },
  cropInsurance: {
    apply: "https://pmfby.gov.in/",
    dept: "https://agricoop.nic.in/",
    label: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
  },
  education: {
    apply: "https://scholarships.gov.in/",
    dept: "https://www.education.gov.in/",
    label: "National Scholarship Portal (NSP)",
  },
  healthcare: {
    apply: "https://beneficiary.nha.gov.in/",
    dept: "https://pmjay.gov.in/",
    label: "Ayushman Bharat PM-JAY / NHA",
  },
  housing: {
    apply: "https://pmay-urban.gov.in/",
    dept: "https://mohua.gov.in/",
    label: "Pradhan Mantri Awas Yojana (PMAY-U)",
  },
  housingRural: {
    apply: "https://pmayg.gov.in/",
    dept: "https://rural.nic.in/",
    label: "Pradhan Mantri Awas Yojana - Gramin",
  },
  pension: {
    apply: "https://nsap.nic.in/",
    dept: "https://rural.nic.in/",
    label: "National Social Assistance Programme (NSAP)",
  },
  socialSecurity: {
    apply: "https://financialservices.gov.in/",
    dept: "https://financialservices.gov.in/",
    label: "Department of Financial Services (Jan Suraksha)",
  },
  skill: {
    apply: "https://www.skillindiadigital.gov.in/",
    dept: "https://msde.gov.in/",
    label: "Skill India Digital Hub",
  },
  unorganisedWorker: {
    apply: "https://eshram.gov.in/",
    dept: "https://labour.gov.in/",
    label: "e-Shram National Worker Portal",
  },
  career: {
    apply: "https://www.ncs.gov.in/",
    dept: "https://labour.gov.in/",
    label: "National Career Service (NCS)",
  },
  msme: {
    apply: "https://udyamregistration.gov.in/",
    dept: "https://msme.gov.in/",
    label: "Udyam Registration Portal (MSME)",
  },
  credit: {
    apply: "https://www.jansamarth.in/",
    dept: "https://financialservices.gov.in/",
    label: "JanSamarth Credit-Linked Govt Portal",
  },
  mudra: {
    apply: "https://www.mudra.org.in/",
    dept: "https://financialservices.gov.in/",
    label: "Pradhan Mantri MUDRA Yojana",
  },
  women: {
    apply: "https://pmmvy.wcd.gov.in/",
    dept: "https://wcd.nic.in/",
    label: "Pradhan Mantri Matru Vandana (PMMVY)",
  },
  disability: {
    apply: "https://www.swavlambancard.gov.in/",
    dept: "https://depwd.gov.in/",
    label: "Unique Disability ID (UDID) Portal",
  },
  tribal: {
    apply: "https://tribal.nic.in/",
    dept: "https://tribal.nic.in/",
    label: "Ministry of Tribal Affairs",
  },
  dbt: {
    apply: "https://dbtbharat.gov.in/",
    dept: "https://dbtbharat.gov.in/",
    label: "Direct Benefit Transfer (DBT) Bharat",
  },
};

function getCategoryKey(catStr: string, nameStr: string): string {
  const c = catStr.toLowerCase();
  const n = nameStr.toLowerCase();

  if (n.includes("scholar") || n.includes("matric") || c.includes("edu")) return "education";
  if (n.includes("fasal") || n.includes("crop")) return "cropInsurance";
  if (n.includes("kisan") || n.includes("farmer") || c.includes("agri")) return "agriculture";
  if (
    n.includes("ayushman") ||
    n.includes("arogya") ||
    n.includes("health") ||
    c.includes("health")
  )
    return "healthcare";
  if (n.includes("awas") || n.includes("hous") || c.includes("hous")) return "housing";
  if (n.includes("pension") || n.includes("oap") || c.includes("pension")) return "pension";
  if (
    n.includes("matru") ||
    n.includes("mahila") ||
    n.includes("kanya") ||
    n.includes("ladli") ||
    c.includes("women")
  )
    return "women";
  if (
    n.includes("skill") ||
    n.includes("rozgar") ||
    n.includes("internship") ||
    c.includes("skill") ||
    c.includes("employ")
  )
    return "skill";
  if (
    n.includes("mudra") ||
    n.includes("loan") ||
    n.includes("udyam") ||
    c.includes("msme") ||
    c.includes("business")
  )
    return "msme";
  if (n.includes("disab") || n.includes("divyang") || n.includes("udid")) return "disability";
  if (n.includes("ration") || n.includes("food") || n.includes("rice")) return "civilSupplies";
  if (n.includes("transport") || n.includes("auto") || n.includes("vahan")) return "transport";
  if (n.includes("power") || n.includes("electr") || n.includes("solar")) return "electricity";
  if (n.includes("family") || n.includes("parivar")) return "familyId";
  if (n.includes("dairy") || n.includes("cattle") || n.includes("livestock")) return "dairy";
  if (n.includes("labour") || n.includes("bocw") || n.includes("shram")) return "bocw";
  return "default";
}

function cleanHost(url: string): string {
  try {
    const h = new URL(url.trim()).hostname.toLowerCase();
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

function isGenericRoot(url: string | null | undefined): boolean {
  if (!url) return true;
  const host = cleanHost(url);
  if (!host) return true;
  if (GENERIC_ROOT_HOSTS.has(host)) {
    try {
      const p = new URL(url).pathname;
      return p === "" || p === "/" || p === "/index.html";
    } catch {
      return true;
    }
  }
  return false;
}

export function resolveSchemePortals(scheme: {
  id?: string;
  name?: string;
  category?: string;
  state?: string | null;
  ministry?: string | null;
  department?: string | null;
  apply_url?: string | null;
  official_website?: string | null;
  official_source_url?: string | null;
  applicationUrl?: string | null;
  registrationUrl?: string | null;
}): ResolvedPortals {
  const name = scheme.name || "Government Welfare Scheme";
  const state =
    scheme.state && scheme.state !== "Central" && scheme.state !== "All" ? scheme.state : null;
  const category = scheme.category || "General";
  const catKey = getCategoryKey(category, name);

  // 1. Initial Candidates from scheme data
  const rawApply = sanitizePortalUrl(
    scheme.applicationUrl || scheme.apply_url || scheme.registrationUrl,
    name,
  );
  const rawWeb = sanitizePortalUrl(
    scheme.official_website || scheme.official_source_url,
    name,
  );

  let resolvedApply = rawApply && !isGenericRoot(rawApply) ? rawApply.trim() : null;
  let resolvedDept = rawWeb && !isGenericRoot(rawWeb) ? rawWeb.trim() : null;
  let deptLabel: string | null = scheme.department || scheme.ministry || null;

  // 2. State-specific lookup if apply URL is generic or missing
  if (state && STATE_DEPARTMENT_PORTALS[state]) {
    const stateDefs = STATE_DEPARTMENT_PORTALS[state];
    const match = stateDefs[catKey] || stateDefs.default;
    if (match) {
      if (!resolvedApply) resolvedApply = sanitizePortalUrl(match.apply, name);
      if (!resolvedDept || resolvedDept === resolvedApply) {
        resolvedDept =
          match.dept && match.dept !== resolvedApply
            ? sanitizePortalUrl(match.dept, name)
            : null;
      }
      if (!deptLabel && match.label) deptLabel = match.label;
    }
  }

  // 3. Central portal lookup if still generic or missing
  if (!resolvedApply) {
    const centralMatch = CENTRAL_PORTALS[catKey] || CENTRAL_PORTALS.default;
    if (centralMatch) {
      resolvedApply = sanitizePortalUrl(centralMatch.apply, name);
      if (!resolvedDept || resolvedDept === resolvedApply) {
        resolvedDept =
          centralMatch.dept && centralMatch.dept !== resolvedApply
            ? sanitizePortalUrl(centralMatch.dept, name)
            : null;
      }
      if (!deptLabel && centralMatch.label) deptLabel = centralMatch.label;
    }
  }

  // 4. Guaranteed fallback for primary apply URL
  const guideUrl = `https://www.myscheme.gov.in/search?q=${encodeURIComponent(name)}`;
  if (!resolvedApply || isGenericRoot(resolvedApply)) {
    resolvedApply = guideUrl;
  }

  // Final sanity check through sanitizePortalUrl
  resolvedApply = sanitizePortalUrl(resolvedApply, name) || guideUrl;
  if (resolvedDept) {
    resolvedDept = sanitizePortalUrl(resolvedDept, name);
  }

  const isOfficial = !resolvedApply.includes("myscheme.gov.in");

  // Determine primary label
  let primaryLabel = "Apply / Visit Official Portal";
  if (!isOfficial) {
    primaryLabel = "View on myScheme Portal";
  } else {
    try {
      const p = new URL(resolvedApply).pathname.toLowerCase();
      if (
        p.includes("apply") ||
        p.includes("register") ||
        p.includes("registration") ||
        p.includes("form") ||
        p.includes("login")
      ) {
        primaryLabel = "Apply Online";
      } else {
        primaryLabel = "Official Scheme Portal";
      }
    } catch {
      primaryLabel = "Apply / Visit Official Portal";
    }
  }

  // Ensure resolvedDept is distinctly DIFFERENT from resolvedApply
  let finalDeptUrl: string | null = null;
  let hasDistinctDeptPortal = false;
  if (resolvedDept && resolvedDept !== resolvedApply) {
    const h1 = cleanHost(resolvedApply);
    const h2 = cleanHost(resolvedDept);
    if (h1 && h2 && h1 !== h2) {
      finalDeptUrl = resolvedDept;
      hasDistinctDeptPortal = true;
    }
  }

  const departmentName =
    deptLabel ||
    scheme.department ||
    scheme.ministry ||
    (state ? `Government of ${state}` : "Government of India");

  const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`;

  return {
    primaryUrl: resolvedApply,
    primaryLabel,
    deptUrl: finalDeptUrl,
    deptLabel: finalDeptUrl ? deptLabel || "Department Portal" : null,
    guideUrl,
    guideLabel: "myScheme Verification Guide",
    wikiUrl,
    isOfficial,
    departmentName,
    hasDistinctDeptPortal,
  };
}
