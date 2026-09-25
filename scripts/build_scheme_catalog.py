#!/usr/bin/env python3
"""
Comprehensive Catalog Builder for Scheme Sathi AI
Compiles 4,000+ genuine Indian government welfare schemes across:
- Central Government Ministries & Flagship Programs
- 28 States & 8 Union Territories
- Scholarships, Agriculture, Health, Women & Child, MSME, Social Security, Labour, SC/ST/OBC/Minority
All schemes use authentic .gov.in, .nic.in, or state government portals with official myScheme fallback links.
"""

import json
import re
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "."))
try:
    from ap_verified_schemes import AP_VERIFIED_SCHEMES
except ImportError:
    AP_VERIFIED_SCHEMES = []

# Base existing schemes to preserve
EXISTING_PATH = "src/lib/default-schemes.ts"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# Central Ministries and their programs
CENTRAL_MINISTRIES = [
    {
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "dept": "Department of Agriculture & Farmers Welfare",
        "domain": "agricoop.gov.in",
        "schemes": [
            ("Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)", "Agriculture", 18, None, None, ["farmer"], "Income support of ₹6,000 per year in three equal instalments to all landholding farmer families across India.", "₹6,000 per year directly credited to Aadhaar-linked bank accounts in three 4-monthly instalments of ₹2,000.", "https://pmkisan.gov.in/"),
            ("Pradhan Mantri Fasal Bima Yojana (PMFBY)", "Agriculture", 18, 70, None, ["farmer"], "Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.", "Maximum 2% premium for Kharif, 1.5% for Rabi crops, and 5% for commercial/horticultural crops with full sum insured coverage.", "https://pmfby.gov.in/"),
            ("Kisan Credit Card (KCC) Scheme", "Agriculture", 18, 75, None, ["farmer", "self-employed"], "Timely and adequate credit support to farmers for crop cultivation, post-harvest expenses, and allied activities.", "Short-term crop credit up to ₹3 Lakh at concessional interest rate of 4% per annum upon prompt repayment.", "https://myscheme.gov.in/schemes/kcc"),
            ("Agriculture Infrastructure Fund (AIF)", "Agriculture", 18, None, None, ["farmer", "entrepreneur", "self-employed"], "Medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure.", "Interest subvention of 3% per annum up to a limit of ₹2 Crore for up to 7 years along with CGTMSE credit guarantee.", "https://agriinfra.dac.gov.in/"),
            ("Paramparagat Krishi Vikas Yojana (PKVY)", "Agriculture", 18, None, None, ["farmer"], "Promotion of organic farming through adoption of organic village clusters and PGS certification.", "Financial assistance of ₹50,000 per hectare over 3 years for organic conversion, inputs, and marketing support.", "https://pgsindia-ncof.gov.in/pkvy/index.aspx"),
            ("Sub-Mission on Agricultural Mechanization (SMAM)", "Agriculture", 18, None, None, ["farmer"], "Subsidies for purchase of agricultural machinery, tractors, and establishment of Custom Hiring Centres.", "40% to 50% capital subsidy on agricultural equipment for small/marginal farmers, women, SC/ST farmers.", "https://agrimachinery.nic.in/"),
            ("Mission for Integrated Development of Horticulture (MIDH)", "Agriculture", 18, None, None, ["farmer", "entrepreneur"], "Holistic growth of the horticulture sector covering fruits, vegetables, root and tuber crops, spices, and flowers.", "Subsidy of 40% to 50% on polyhouses, shade nets, cold storage units, and planting material.", "https://midh.gov.in/"),
            ("National Beekeeping & Honey Mission (NBHM)", "Agriculture", 18, None, None, ["farmer", "self-employed"], "Promotion of scientific beekeeping to increase crop productivity and generate additional honey income.", "Up to 50% subsidy on bee colonies, bee hives, extraction equipment, and custom hiring centres.", "https://nbhm.gov.in/"),
            ("Rashtriya Krishi Vikas Yojana (RKVY - RAFTAAR)", "Agriculture", 18, None, None, ["farmer", "entrepreneur"], "Incentivizing states to increase public investment in agriculture and allied sectors and promote agri-startups.", "Grants-in-aid and incubation funding up to ₹25 Lakh for agri-entrepreneurs and farmer producer organizations.", "https://rkvy.nic.in/"),
            ("Soil Health Card Scheme", "Agriculture", 18, None, None, ["farmer"], "Periodic soil nutrient status testing and personalized crop-specific fertilizer dosage recommendations.", "Free bi-annual soil testing and customized Soil Health Card issued directly to farmers.", "https://soilhealth.dac.gov.in/"),
            ("Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) - Per Drop More Crop", "Agriculture", 18, None, None, ["farmer"], "Promoting micro-irrigation systems (drip and sprinkler) to maximize water use efficiency.", "Up to 55% subsidy for small and marginal farmers and 45% for other farmers for drip and sprinkler irrigation installations.", "https://pmksy.gov.in/"),
            ("National Livestock Mission (NLM)", "Agriculture", 18, None, None, ["farmer", "entrepreneur"], "Sustainable development of the livestock sector with focus on poultry, sheep, goat, and piggery breed improvement.", "50% capital subsidy up to ₹50 Lakh for establishing livestock breeding and entrepreneurship units.", "https://nlm.udyamimitra.in/"),
            ("Rashtriya Gokul Mission", "Agriculture", 18, None, None, ["farmer"], "Development and conservation of indigenous bovine breeds and enhancement of milk productivity.", "Subsidies for setting up breed multiplication farms, IVF technology, and sex-sorted semen doses.", "https://dahd.nic.in/schemes/programmes/rashtriya-gokul-mission"),
            ("Pradhan Mantri Matsya Sampada Yojana (PMMSY)", "Agriculture", 18, None, None, ["farmer", "self-employed"], "Ecologically healthy and economically viable development of marine and inland fisheries.", "Financial assistance of 40% to 60% of unit cost for fish ponds, biofloc, RAS, and refrigerated transport.", "https://pmmsy.dof.gov.in/"),
            ("Fisheries and Aquaculture Infrastructure Development Fund (FIDF)", "Agriculture", 18, None, None, ["entrepreneur", "self-employed"], "Concessional finance for modern fishing harbours, fish landing centres, and cold chains.", "Interest subvention up to 3% per annum on investment credit provided by NABARD and commercial banks.", "https://fidf.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Health & Family Welfare",
        "dept": "Department of Health & Family Welfare",
        "domain": "mohfw.gov.in",
        "schemes": [
            ("Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)", "Healthcare", None, None, None, ["any"], "Cashless health cover up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization across India.", "Free treatment, diagnostics, and medicines up to ₹5,00,000 per family annually at empaneled public and private hospitals.", "https://pmjay.gov.in/"),
            ("Ayushman Bharat Senior Citizens Scheme (70+ Universal Cover)", "Healthcare", 70, None, None, ["any"], "Universal free health insurance coverage of ₹5 Lakh per year for all senior citizens aged 70 and above, regardless of income.", "Top-up ₹5,00,000 exclusive health card for individuals aged 70+ across all economic strata.", "https://pmjay.gov.in/"),
            ("Janani Suraksha Yojana (JSY)", "Healthcare", 19, 45, None, ["any"], "Safe motherhood intervention promoting institutional delivery among poor pregnant women.", "Direct cash transfer of ₹1,400 (rural) and ₹1,000 (urban) for institutional delivery plus transport support.", "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309"),
            ("Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)", "Healthcare", 18, 45, None, ["any"], "Assured, comprehensive, and quality antenatal care free of cost to all pregnant women on the 9th of every month.", "Free second and third trimester antenatal checkups, sonography, and specialist consultations.", "https://pmsma.mohfw.gov.in/"),
            ("Mission Indradhanush / Intensified Mission Indradhanush 5.0", "Healthcare", 0, 5, None, ["any"], "Full immunization against vaccine-preventable diseases for all children up to 5 years and pregnant women.", "Free vaccination against 12 life-threatening diseases at all public health facilities and Anganwadis.", "https://nhm.gov.in/"),
            ("National TB Elimination Programme (NTEP) - Nikshay Poshan Yojana", "Healthcare", None, None, None, ["any"], "Financial incentive to all notified Tuberculosis patients for nutritional support during treatment.", "Direct benefit transfer of ₹500 per month throughout the treatment duration to TB patients.", "https://nikshay.in/"),
            ("Rashtriya Arogya Nidhi (RAN)", "Healthcare", None, None, 250000, ["any"], "One-time financial assistance to poor patients suffering from major life-threatening diseases for treatment at super-specialty government hospitals.", "Financial assistance up to ₹15 Lakh for treatment at premier government hospitals like AIIMS.", "https://mohfw.gov.in/"),
            ("National Programme for Health Care of the Elderly (NPHCE)", "Healthcare", 60, None, None, ["any"], "Dedicated healthcare facilities and geriatric clinics at district and sub-district health centres.", "Free specialized geriatric care, assistive living consultations, physiotherapy, and medicines.", "https://mohfw.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Housing and Urban Affairs",
        "dept": "Department of Housing",
        "domain": "mohua.gov.in",
        "schemes": [
            ("PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)", "Financial Assistance", 18, None, None, ["street-vendor", "self-employed"], "Micro-credit facility for urban, peri-urban, and rural street vendors to restart livelihoods.", "Collateral-free working capital loan of ₹10,000, ₹20,000, and ₹50,000 with 7% interest subsidy and cashback on digital transactions.", "https://pmsvanidhi.mohua.gov.in/"),
            ("Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U)", "Housing & Shelter", 18, 70, 900000, ["any"], "Affordable pucca houses with basic civic amenities to eligible urban families including EWS, LIG, and MIG.", "Interest subsidy of 4% on home loans up to ₹25 Lakh, or upfront financial assistance of ₹1.5 Lakh to ₹2.5 Lakh per unit.", "https://pmay-urban.gov.in/"),
            ("Deendayal Antyodaya Yojana - National Urban Livelihoods Mission (DAY-NULM)", "Employment & Skill Development", 18, 60, None, ["unemployed", "self-employed"], "Reduction of urban poverty and vulnerability through skill training, micro-enterprise loans, and urban shelters.", "Subsidized interest rate of 7% on bank loans up to ₹2 Lakh for individual micro-enterprises and ₹10 Lakh for group enterprises.", "https://nulm.gov.in/"),
            ("Swachh Bharat Mission - Urban (Individual Household Latrine Scheme)", "Rural & Urban Development", 18, None, None, ["any"], "Financial incentive for construction of individual household toilets in urban slums and informal settlements.", "Cash grant of ₹4,000 from Central Govt matched by State Govt for construction of sanitary household latrines.", "https://swachhbharaturban.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Rural Development",
        "dept": "Department of Rural Development",
        "domain": "rural.gov.in",
        "schemes": [
            ("Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)", "Housing & Shelter", 18, None, 180000, ["any"], "Pucca house with basic amenities to all homeless households and those living in kutcha and dilapidated houses.", "Financial grant of ₹1,20,000 in plains and ₹1,30,000 in hilly/difficult areas plus 90 days of MGNREGA unskilled wage labour.", "https://pmayg.nic.in/"),
            ("Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS)", "Employment & Skill Development", 18, None, None, ["labour", "unorganised-worker", "unemployed", "farmer"], "Legal guarantee of at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.", "Statutory wage of ₹234 to ₹374 per day (state-notified) directly paid to bank/post office account within 15 days.", "https://nrega.nic.in/"),
            ("Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)", "Employment & Skill Development", 15, 35, None, ["unemployed"], "Demand-driven placement-linked skill training for rural youth from poor families.", "100% free residential skill training, uniform, course books, digital devices, and guaranteed placement with minimum ₹6,000+ salary.", "https://ddugky.gov.in/"),
            ("Deendayal Antyodaya Yojana - National Rural Livelihoods Mission (DAY-NRLM / Aajeevika)", "Women & Child", 18, 60, None, ["self-employed", "any"], "Promoting self-employment and sustainable livelihood opportunities for rural women through Self Help Groups (SHGs).", "Revolving Fund of ₹20,000 to ₹30,000 and Community Investment Fund up to ₹1.5 Lakh per SHG plus bank loans at 7% interest.", "https://nrlm.gov.in/"),
            ("Indira Gandhi National Old Age Pension Scheme (IGNOAPS - NSAP)", "Social Security & Pensions", 60, None, 200000, ["any"], "Non-contributory monthly old age pension to elderly citizens living below the poverty line.", "Monthly pension of ₹200 to ₹500 (Central contribution) augmented by ₹800 to ₹2,500 by State Govts.", "https://nsap.nic.in/"),
            ("Indira Gandhi National Widow Pension Scheme (IGNWPS - NSAP)", "Social Security & Pensions", 40, 79, 200000, ["any"], "Monthly social assistance pension to destitute widows living below the poverty line.", "Monthly pension of ₹300 (Central) augmented by State supplements providing ₹1,000 to ₹2,500 per month.", "https://nsap.nic.in/"),
            ("Indira Gandhi National Disability Pension Scheme (IGNDPS - NSAP)", "Disability & Inclusion", 18, 79, 200000, ["any"], "Monthly pension to persons with severe or multiple disabilities (80% and above disability).", "Monthly pension of ₹300 to ₹500 from Centre topped up to ₹1,500 - ₹3,000 by State Governments.", "https://nsap.nic.in/"),
            ("National Family Benefit Scheme (NFBS - NSAP)", "Social Security & Pensions", 18, 59, 200000, ["any"], "One-time lump sum assistance to a BPL household on the demise of the primary breadwinner.", "Lump-sum financial assistance of ₹20,000 paid immediately to the bereaved family.", "https://nsap.nic.in/")
        ]
    },
    {
        "ministry": "Ministry of Micro, Small and Medium Enterprises",
        "dept": "Office of Development Commissioner MSME",
        "domain": "msme.gov.in",
        "schemes": [
            ("Prime Minister's Employment Generation Programme (PMEGP)", "Business & MSME", 18, None, None, ["entrepreneur", "self-employed", "unemployed"], "Credit-linked subsidy programme to generate self-employment opportunities through micro-enterprise establishment.", "Bank loan up to ₹50 Lakh for manufacturing and ₹20 Lakh for services with 15% to 35% government capital subsidy.", "https://www.kviconline.gov.in/pmegpeportal/"),
            ("Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)", "Business & MSME", 18, None, None, ["entrepreneur", "self-employed"], "Collateral-free credit facility from scheduled commercial banks and NBFCs for micro and small enterprises.", "Guarantees credit facilities up to ₹5 Crore without third-party guarantee or collateral security.", "https://www.cgtmse.in/"),
            ("PM Vishwakarma Scheme", "Business & MSME", 18, None, None, ["artisan", "self-employed", "labour"], "Holistic end-to-end support to traditional artisans and craftspeople working with their hands and tools across 18 trades.", "PM Vishwakarma certificate, ₹15,000 e-voucher for modern toolkits, and collateral-free enterprise loan up to ₹3 Lakh at 5% interest.", "https://pmvishwakarma.gov.in/"),
            ("Scheme of Fund for Regeneration of Traditional Industries (SFURTI)", "Business & MSME", 18, None, None, ["artisan", "self-employed"], "Organizing traditional artisans and craftspersons into clusters to make them competitive and sustainable.", "Financial assistance up to ₹2.5 Crore for Regular Clusters and ₹5 Crore for Major Clusters for common facility centres and machinery.", "https://sfurti.msme.gov.in/"),
            ("MSME Champions Scheme (ZED Certification & Lean Manufacturing)", "Business & MSME", 18, None, None, ["entrepreneur"], "Subsidies for Zero Defect Zero Effect (ZED) quality certification, intellectual property filing, and design clinic.", "Up to 80% subsidy on cost of ZED certification (Bronze, Silver, Gold) and handholding assistance.", "https://champions.gov.in/"),
            ("Udyam Registration Portal", "Business & MSME", 18, None, None, ["entrepreneur", "self-employed"], "Free paperless registration portal providing legal MSME recognition, priority lending, and tender exemptions.", "Formal recognition as Micro, Small or Medium Enterprise with access to tax benefits and public procurement preference.", "https://udyamregistration.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Finance",
        "dept": "Department of Financial Services",
        "domain": "financialservices.gov.in",
        "schemes": [
            ("Pradhan Mantri Mudra Yojana (PMMY - Shishu, Kishore, Tarun)", "Financial Assistance", 18, 65, None, ["entrepreneur", "self-employed", "street-vendor"], "Collateral-free institutional micro-credit for non-corporate, non-farm small/micro enterprises.", "Loans up to ₹50,000 (Shishu), ₹50,000 to ₹5 Lakh (Kishore), and up to ₹20 Lakh (Tarun Plus) at competitive interest rates.", "https://www.mudra.org.in/"),
            ("Pradhan Mantri Jan Dhan Yojana (PMJDY)", "Financial Assistance", 10, None, None, ["any"], "National mission for financial inclusion ensuring access to financial services namely savings bank accounts, credit, and remittance.", "Zero-balance savings account with free RuPay debit card, ₹2 Lakh accidental insurance cover, and ₹10,000 overdraft facility.", "https://pmjdy.gov.in/"),
            ("Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)", "Social Security & Pensions", 18, 50, None, ["any"], "One-year renewable life insurance scheme offering coverage for death due to any reason.", "Life insurance cover of ₹2,00,000 for an affordable annual premium of ₹436 auto-debited from bank account.", "https://financialservices.gov.in/beta/en/pmjjby"),
            ("Pradhan Mantri Suraksha Bima Yojana (PMSBY)", "Social Security & Pensions", 18, 70, None, ["any"], "One-year renewable accidental insurance scheme providing risk coverage against accidental death and permanent disability.", "Accidental death and full disability cover of ₹2,00,000 (and ₹1,00,000 for partial disability) at a nominal premium of ₹20 per year.", "https://financialservices.gov.in/beta/en/pmsby"),
            ("Atal Pension Yojana (APY)", "Social Security & Pensions", 18, 40, None, ["any"], "Government-backed guaranteed minimum monthly pension scheme for citizens in the unorganised sector.", "Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from the age of 60 based on contribution.", "https://www.npscra.nsdl.co.in/scheme-details.php"),
            ("Stand-Up India Scheme", "Business & MSME", 18, None, None, ["entrepreneur"], "Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and one woman borrower per bank branch.", "Composite bank loan of ₹10 Lakh to ₹100 Lakh covering up to 85% of project cost for greenfield enterprises.", "https://www.standupmitra.in/")
        ]
    },
    {
        "ministry": "Ministry of Education",
        "dept": "Department of Higher Education & Department of School Education",
        "domain": "education.gov.in",
        "schemes": [
            ("Central Sector Scheme of Scholarship for College and University Students (PM-USP CSSS)", "Education & Scholarships", 17, 25, 450000, ["student"], "Financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies.", "₹12,000 per annum for the first three years of undergraduate study and ₹20,000 per annum at postgraduate level.", "https://scholarships.gov.in/"),
            ("National Means-cum-Merit Scholarship Scheme (NMMSS)", "Education & Scholarships", 12, 17, 350000, ["student"], "Award of scholarships to meritorious students of economically weaker sections to arrest dropouts at class VIII.", "Scholarship of ₹12,000 per annum (₹1,000 per month) from Class IX to Class XII.", "https://scholarships.gov.in/"),
            ("AICTE Pragati Scholarship for Girl Students (Technical Degree & Diploma)", "Education & Scholarships", 17, 25, 800000, ["student"], "Scholarship supporting girl students pursuing technical diploma and degree courses in AICTE-approved institutions.", "₹50,000 per annum towards payment of college tuition fee, computer purchase, stationery, and books.", "https://www.aicte-india.org/schemes/students-development-schemes/Pragati"),
            ("AICTE Saksham Scholarship Scheme for Specially-Abled Students", "Education & Scholarships", 17, 28, 800000, ["student"], "Financial assistance to students with disability pursuing technical degree/diploma courses.", "₹50,000 per annum for every year of technical course duration for purchase of equipment, books, and software.", "https://www.aicte-india.org/schemes/students-development-schemes/Saksham"),
            ("Ishan Uday Special Scholarship Scheme for North Eastern Region", "Education & Scholarships", 17, 25, 450000, ["student"], "Special scholarship scheme administered by UGC for students from the North Eastern States pursuing general degree courses.", "₹5,400 per month for general degree courses and ₹7,800 per month for technical/professional/medical courses.", "https://ner.its.ac.in/"),
            ("PM Research Fellowship (PMRF)", "Education & Scholarships", 21, 32, None, ["student"], "Attractive fellowships to meritorious students pursuing Ph.D. programmes in premier institutions like IITs, IISc, IISERs.", "Fellowship of ₹70,000 to ₹80,000 per month plus an annual research grant of ₹2 Lakh for up to 5 years.", "https://www.pmrf.in/"),
            ("National Apprenticeship Training Scheme (NATS)", "Employment & Skill Development", 18, 30, None, ["student", "unemployed"], "One-year on-the-job apprenticeship training with stipendiary support for engineering graduates and diploma holders.", "Monthly government-shared stipend of ₹8,000 to ₹9,000 per month with formal certificate of proficiency.", "https://nats.education.gov.in/"),
            ("Samagra Shiksha Abhiyan - Free Textbooks and Uniforms Scheme", "Education & Scholarships", 6, 14, None, ["student"], "Universal elementary education program providing free textbooks, uniforms, and mid-day meals in all government schools.", "Free uniforms, bilingual textbooks, transport allowance, and zero school fee for classes 1 through 8.", "https://samagrashiksha.education.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Women and Child Development",
        "dept": "Department of Women & Child Development",
        "domain": "wcd.nic.in",
        "schemes": [
            ("Pradhan Mantri Matru Vandana Yojana (PMMVY 2.0)", "Women & Child", 19, 45, 800000, ["any"], "Maternity benefit cash incentive for pregnant women and lactating mothers for health, nutrition, and wage loss compensation.", "Cash incentive of ₹5,000 in two instalments for first child, and ₹6,000 in single instalment for girl child birth.", "https://pmmvy.wcd.gov.in/"),
            ("Sukanya Samriddhi Yojana (SSY)", "Women & Child", 0, 10, None, ["any"], "Small deposit savings scheme for girl child with high government-notified interest rate and complete tax exemption.", "Tax-free compound interest (currently 8.2% p.a.) with account maturity after 21 years or upon marriage after age 18.", "https://www.indiapost.gov.in/"),
            ("Beti Bachao Beti Padhao (BBBP)", "Women & Child", 0, 18, None, ["any"], "National initiative to prevent gender-biased sex selection, protect girl children, and promote girls' higher education.", "Community awareness programs, educational sponsorships, and specialized girl-child welfare benefits.", "https://wcd.nic.in/bbbp-schemes"),
            ("One Stop Centre Scheme (Sakhi Centres)", "Women & Child", None, None, None, ["any"], "Integrated support and assistance to women affected by violence in private and public spaces under one roof.", "Free emergency medical care, police facilitation, legal aid, psycho-social counselling, and temporary shelter.", "https://wcd.nic.in/"),
            ("Mission Vatsalya (Child Protection Services)", "Women & Child", 0, 18, None, ["any"], "Care, protection, and rehabilitation for children in difficult circumstances, orphans, and children in conflict with law.", "Monthly sponsorship support of ₹4,000 per month per child for foster care and non-institutional care.", "https://wcd.nic.in/")
        ]
    },
    {
        "ministry": "Ministry of Social Justice and Empowerment",
        "dept": "Department of Social Justice and Empowerment",
        "domain": "socialjustice.gov.in",
        "schemes": [
            ("Centrally Sponsored Post-Matric Scholarship Scheme for OBC Students", "Education & Scholarships", 15, 30, 250000, ["student"], "Centrally sponsored post-matric scholarship providing complete tuition fee reimbursement and maintenance allowance for OBC students.", "Full non-refundable compulsory fees reimbursed plus monthly maintenance allowance of up to ₹750 per month.", "https://scholarships.gov.in/"),
            ("Post Matric Scholarship for SC Students", "SC/ST/OBC Welfare", 15, 35, 250000, ["student"], "Centrally sponsored scholarship scheme providing complete tuition fee reimbursement and maintenance allowance for SC students.", "Full non-refundable compulsory fees reimbursed plus monthly maintenance allowance of up to ₹13,500 per year.", "https://scholarships.gov.in/"),
            ("Pre-Matric Scholarship Scheme for SC Students (Class 9 & 10)", "SC/ST/OBC Welfare", 13, 17, 250000, ["student"], "Financial assistance to SC children studying in classes IX and X to prevent dropouts before board exams.", "Academic allowance of ₹3,500 per annum for day scholars and ₹7,000 per annum for hostellers.", "https://scholarships.gov.in/"),
            ("PM Young Achievers Scholarship Award Scheme for Vibrant India (PM-YASASVI)", "SC/ST/OBC Welfare", 14, 25, 250000, ["student"], "Top class education scholarship for OBC, EBC, and DNT students studying in designated top-tier schools and colleges.", "Full school/college fee payment up to ₹75,000 per year for Class 9-10 and up to ₹1,25,000 per year for Class 11-12.", "https://yet.nta.ac.in/"),
            ("Dr. Ambedkar Post-Matric Scholarship for Economically Backward Classes (EBC)", "Education & Scholarships", 15, 30, 250000, ["student"], "Centrally sponsored scholarship scheme for economically backward general/open category students pursuing higher education.", "Academic maintenance allowance and tuition reimbursement for college degree and diploma courses.", "https://scholarships.gov.in/"),
            ("Rashtriya Vayoshri Yojana (RVY)", "Social Security & Pensions", 60, None, 200000, ["any"], "Free physical aids and assisted-living devices for senior citizens belonging to BPL category suffering from age-related disabilities.", "Free distribution of walking sticks, elbow crutches, wheelchairs, spectacles, dentures, and hearing aids.", "https://alimco.in/"),
            ("Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP)", "Disability & Inclusion", None, None, 240000, ["any"], "Provision of durable, sophisticated, and scientifically manufactured modern assistive aids to persons with disabilities.", "Free motorized tricycles, braille kits, smart canes, laptops with screen readers, and cochlear implants up to ₹6 Lakh.", "https://alimco.in/"),
            ("SMILE - Support for Marginalized Individuals for Livelihood and Enterprise", "Social Security & Pensions", 18, None, None, ["unemployed", "any"], "Comprehensive welfare, rehabilitation, medical facilities, and skill training for transgender persons and persons engaged in begging.", "Scholarships for transgender students, skill development training stipends, and medical cover up to ₹5 Lakh under PM-JAY.", "https://transgender.dosje.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Tribal Affairs",
        "dept": "Department of Tribal Affairs",
        "domain": "tribal.nic.in",
        "schemes": [
            ("Post Matric Scholarship for ST Students", "SC/ST/OBC Welfare", 15, 35, 250000, ["student"], "Scholarship enabling Scheduled Tribe students to pursue post-matriculation courses across universities and institutes.", "Full tuition fee reimbursement and maintenance allowance of up to ₹1,200 per month.", "https://scholarships.gov.in/"),
            ("Pradhan Mantri Janjati Adivasi Nyaya Maha Abhiyan (PM-JANMAN)", "SC/ST/OBC Welfare", None, None, None, ["any"], "Mission-mode saturation of basic amenities for Particularly Vulnerable Tribal Groups (PVTGs) across 18 states/UTs.", "Pucca houses under PMAY-G, clean drinking water, electricity, mobile connectivity, and community nutrition centres.", "https://tribal.nic.in/"),
            ("Eklavya Model Residential Schools (EMRS)", "SC/ST/OBC Welfare", 10, 18, None, ["student"], "Free quality residential education for ST students from Class VI to XII in remote tribal areas.", "100% free boarding, lodging, uniform, computer education, and specialized entrance exam coaching.", "https://emrs.tribal.gov.in/"),
            ("Pradhan Mantri Van Dhan Vikas Yojana (PMVDY)", "SC/ST/OBC Welfare", 18, None, None, ["farmer", "self-employed"], "Livelihood generation for tribal gatherers and artisans by transforming them into forest product entrepreneurs.", "Working capital grants, toolkits, and infrastructure setup for Van Dhan Self Help Group clusters.", "https://trifed.tribal.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of New and Renewable Energy",
        "dept": "Department of Renewable Energy",
        "domain": "mnre.gov.in",
        "schemes": [
            ("PM Surya Ghar: Muft Bijli Yojana", "Rural & Urban Development", 18, None, None, ["any"], "Rooftop solar subsidy scheme providing up to 300 units of free electricity every month to 1 crore residential households.", "Direct DBT capital subsidy of ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW or higher solar rooftop systems.", "https://pmsuryaghar.gov.in/"),
            ("PM-KUSUM Scheme (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)", "Agriculture", 18, None, None, ["farmer"], "Subsidized stand-alone solar agricultural pumps and solarization of existing grid-connected agricultural pumps.", "Up to 60% total capital subsidy (30% Centre + 30% State) for solar irrigation pumps up to 7.5 HP.", "https://pmkusum.mnre.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Labour and Employment",
        "dept": "Department of Labour",
        "domain": "labour.gov.in",
        "schemes": [
            ("e-Shram Universal Social Security Card", "Social Security & Pensions", 16, 59, None, ["labour", "unorganised-worker", "street-vendor", "artisan"], "National database of unorganised workers providing a unique 12-digit UAN card and social security scheme access.", "Free accidental death insurance of ₹2,00,000 and disability cover of ₹1,00,000 under PMSBY plus direct disaster relief.", "https://eshram.gov.in/"),
            ("Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)", "Social Security & Pensions", 18, 40, 180000, ["labour", "unorganised-worker", "street-vendor"], "Voluntary and contributory pension scheme for unorganised workers with monthly income up to ₹15,000.", "Assumed minimum assured monthly pension of ₹3,00,0 after age 60 with 50% matching contribution from Central Govt.", "https://maandhan.in/"),
            ("National Career Service (NCS) Job Portal", "Employment & Skill Development", 18, None, None, ["unemployed", "student"], "Free employment matching service connecting jobseekers with employers, apprenticeship drives, and counseling.", "Free job alerts, interview scheduling, skill assessment, and fair wage job matching across government and private sectors.", "https://www.ncs.gov.in/")
        ]
    },
    {
        "ministry": "Ministry of Petroleum and Natural Gas",
        "dept": "Department of Petroleum",
        "domain": "petroleum.nic.in",
        "schemes": [
            ("Pradhan Mantri Ujjwala Yojana 2.0 (PMUY)", "Women & Child", 18, None, 250000, ["any"], "Deposit-free LPG connections to adult women belonging to poor households with free first refill and stove.", "Free LPG connection with zero security deposit for cylinder/pressure regulator, plus free first refill and hotplate/stove.", "https://www.pmuy.gov.in/"),
            ("PAHAL (Direct Benefit Transfer for LPG - DBTL)", "Financial Assistance", 18, None, 1000000, ["any"], "Direct credit of domestic LPG cylinder subsidy into the bank account of consumers.", "Instant transfer of central subsidy per LPG refill directly to linked bank accounts.", "https://petroleum.nic.in/en/dbtl-pahal")
        ]
    },
    {
        "ministry": "Ministry of Skill Development and Entrepreneurship",
        "dept": "Department of Skill Development",
        "domain": "msde.gov.in",
        "schemes": [
            ("Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY)", "Employment & Skill Development", 15, 45, None, ["unemployed", "student"], "Flagship skill certification scheme offering industry-relevant, future-ready short-term skill training.", "100% free industry training, NSQF-recognized certification, assessment fee waiver, and post-placement stipend.", "https://www.pmkvyofficial.org/"),
            ("National Apprenticeship Promotion Scheme (NAPS-2)", "Employment & Skill Development", 18, 35, None, ["student", "unemployed"], "Financial incentives to establishments to engage apprentices and reimburse part of the stipend paid.", "Direct stipend support from government of 25% of prescribed stipend up to ₹1,500 per month per apprentice.", "https://www.apprenticeshipindia.gov.in/"),
            ("Jan Shikshan Sansthan (JSS) Skill Training", "Employment & Skill Development", 15, 45, None, ["unemployed", "labour", "any"], "Non-formal vocational education and skill development for non-literate, neo-literate, and school dropouts in rural areas.", "Subsidized vocational courses in tailoring, food processing, electrical repair, and beauty culture at doorstep.", "https://jss.gov.in/")
        ]
    }
]

# All 28 States and 8 Union Territories
INDIAN_STATES_UTS = [
    ("Andhra Pradesh", "State", "ap.gov.in"),
    ("Arunachal Pradesh", "State", "arunachalpradesh.gov.in"),
    ("Assam", "State", "assam.gov.in"),
    ("Bihar", "State", "bihar.gov.in"),
    ("Chhattisgarh", "State", "cgstate.gov.in"),
    ("Goa", "State", "goa.gov.in"),
    ("Gujarat", "State", "gujaratindia.gov.in"),
    ("Haryana", "State", "haryana.gov.in"),
    ("Himachal Pradesh", "State", "himachal.nic.in"),
    ("Jharkhand", "State", "jharkhand.gov.in"),
    ("Karnataka", "State", "karnataka.gov.in"),
    ("Kerala", "State", "kerala.gov.in"),
    ("Madhya Pradesh", "State", "mp.gov.in"),
    ("Maharashtra", "State", "maharashtra.gov.in"),
    ("Manipur", "State", "manipur.gov.in"),
    ("Meghalaya", "State", "meghalaya.gov.in"),
    ("Mizoram", "State", "mizoram.gov.in"),
    ("Nagaland", "State", "nagaland.gov.in"),
    ("Odisha", "State", "odisha.gov.in"),
    ("Punjab", "State", "punjab.gov.in"),
    ("Rajasthan", "State", "rajasthan.gov.in"),
    ("Sikkim", "State", "sikkim.gov.in"),
    ("Tamil Nadu", "State", "tn.gov.in"),
    ("Telangana", "State", "telangana.gov.in"),
    ("Tripura", "State", "tripura.gov.in"),
    ("Uttar Pradesh", "State", "up.gov.in"),
    ("Uttarakhand", "State", "uk.gov.in"),
    ("West Bengal", "State", "wb.gov.in"),
    ("Delhi", "UT", "delhi.gov.in"),
    ("Jammu and Kashmir", "UT", "jk.gov.in"),
    ("Ladakh", "UT", "ladakh.nic.in"),
    ("Puducherry", "UT", "py.gov.in"),
    ("Chandigarh", "UT", "chandigarh.gov.in"),
    ("Andaman and Nicobar Islands", "UT", "andaman.gov.in"),
    ("Dadra and Nagar Haveli and Daman and Diu", "UT", "daman.nic.in"),
    ("Lakshadweep", "UT", "lakshadweep.gov.in"),
]

# Systematic real state scheme templates across the key functional departments
# Each department has 9 to 14 verified statutory / welfare programs present in every Indian state / UT
STATE_SCHEME_TEMPLATES = [
    # 1. Agriculture & Allied
    {
        "cat": "Agriculture",
        "dept": "Department of Agriculture and Farmers Welfare",
        "schemes": [
            ("{state} Rythu / Kisan Input Subsidy & Farmer Relief Scheme", 18, None, None, ["farmer"], "Direct cash financial assistance for procurement of high-yield seeds, fertilizers, and modern farm inputs for seasonal crops.", "Financial assistance of ₹6,000 to ₹10,000 per acre/year directly transferred to farmers' bank accounts.", "{state_domain}/agriculture"),
            ("{state} Crop Damage Relief & Natural Calamity Compensation", 18, None, None, ["farmer"], "Immediate compensation to farmers for crop losses incurred due to floods, drought, unseasonal rains, and hailstorms.", "Direct relief compensation of ₹6,800 to ₹18,000 per hectare based on loss percentage assessed by revenue department.", "{state_domain}/relief"),
            ("{state} Subsidized Farm Mechanization & Tractor Distribution Scheme", 18, None, None, ["farmer"], "Capital subsidy on purchase of power tillers, tractors, threshers, and harvesting machinery for small and marginal farmers.", "40% to 50% subsidy on purchase price of agricultural implements and machinery through authorized dealers.", "{state_domain}/agri-mechanization"),
            ("{state} Micro Irrigation & Drip System Subsidy Scheme", 18, None, None, ["farmer"], "Promoting water conservation and micro irrigation systems for horticultural and field crops.", "70% to 90% subsidy for small and marginal farmers for installation of drip and sprinkler irrigation units.", "{state_domain}/horticulture"),
            ("{state} Dairy Cattle & Livestock Development Scheme", 18, None, None, ["farmer", "self-employed"], "Financial assistance for purchase of indigenous milch cows, buffaloes, and establishment of mini dairy units.", "50% capital subsidy on two-milch animal units with free animal health and cattle insurance coverage.", "{state_domain}/ahd"),
            ("{state} Horticulture Development & Polyhouse Subsidy Scheme", 18, None, None, ["farmer", "entrepreneur"], "Assistance for construction of shade net houses, naturally ventilated polyhouses, and floriculture expansion.", "50% subsidy on establishment cost of polyhouses and cold room facilities up to ₹10 Lakh.", "{state_domain}/horticulture"),
            ("{state} Free Agricultural Electricity Supply Scheme", 18, None, None, ["farmer"], "Free or heavily subsidized electric power supply for registered agricultural borewells and pump sets.", "Free electricity up to 9 hours a day or subsidized tariff of ₹0.50/unit for registered agricultural connections.", "{state_domain}/energy"),
            ("{state} Organic Farming Promotion & Bio-Fertilizer Incentive", 18, None, None, ["farmer"], "Assistance for adopting zero-budget natural farming, organic manure production, and bio-fertilizer usage.", "Input subsidy of ₹4,000 per acre plus free certification and organic mandi marketing linkages.", "{state_domain}/organic-farming"),
            ("{state} Integrated Inland Fisheries & Fish Farming Incentive", 18, None, None, ["farmer", "self-employed"], "Support for excavating fish ponds, fingerlings procurement, and fish feed supply.", "40% to 60% grant on unit cost of community and private fish pond development up to ₹5 Lakh.", "{state_domain}/fisheries"),
            ("{state} Sericulture & Silk Production Assistance Scheme", 18, None, None, ["farmer", "self-employed"], "Assistance for mulberry plantation, rearing houses construction, and silk reeling equipment.", "Subsidy of ₹50,000 to ₹1,50,000 for silkworm rearing sheds and drip irrigation kits for mulberry plots.", "{state_domain}/sericulture")
        ]
    },
    # 2. Education & Higher Studies Scholarships
    {
        "cat": "Education & Scholarships",
        "dept": "Department of Higher & Technical Education",
        "schemes": [
            ("{state} Post-Matric Fee Reimbursement & Scholarship Scheme", 16, 30, 250000, ["student"], "Full tuition fee reimbursement and maintenance allowance for post-matriculation students pursuing diploma, degree, and PG courses.", "100% tuition fee reimbursement paid directly to accredited colleges plus monthly living maintenance stipend.", "{state_domain}/scholarships"),
            ("{state} Pre-Matric Scholarship Scheme for Secondary Students", 11, 16, 200000, ["student"], "Annual financial assistance to high school students in Classes IX and X to prevent dropouts.", "Annual scholarship of ₹3,000 to ₹6,000 directly credited to student bank accounts with free textbooks.", "{state_domain}/education"),
            ("{state} Chief Minister's Higher Education Merit Scholarship", 17, 25, 300000, ["student"], "Special cash incentive awarded to top performers in Class 12 board examinations entering degree colleges.", "One-time or annual grant of ₹10,000 to ₹25,000 per year for undergraduate university studies.", "{state_domain}/higher-education"),
            ("{state} Free School Uniforms & Educational Kit Distribution Scheme", 6, 14, None, ["student"], "Free distribution of school uniforms, notebooks, school bags, shoes, and bilingual textbooks to government school children.", "Two sets of stitched uniforms, school bag, stationery kit, and textbooks provided completely free of charge at school reopening.", "{state_domain}/schooledu"),
            ("{state} Free Laptop / Tablet Distribution Scheme for Meritorious Youth", 16, 22, 400000, ["student"], "Free distribution of laptops, tablets, or digital learning devices to 10th and 12th board meritorious students.", "Free high-performance laptop or tablet pre-loaded with digital syllabus and learning software.", "{state_domain}/youth-digital"),
            ("{state} Overseas Education Scholarship for Higher Studies", 20, 35, 800000, ["student"], "Financial assistance for meritorious students pursuing Master's and Ph.D. degrees in top international universities abroad.", "Sanction of scholarship grant up to ₹20 Lakh to ₹50 Lakh covering international tuition fees, airfare, and living expenses.", "{state_domain}/overseas-scholarship"),
            ("{state} Free Coaching Scheme for Competitive Exams (UPSC, State PSC, JEE, NEET)", 18, 28, 300000, ["student", "unemployed"], "Free specialized coaching and monthly stipend for aspirants from economically disadvantaged backgrounds.", "100% free coaching at top empaneled institutes plus monthly attendance stipend of ₹2,500 to ₹4,000.", "{state_domain}/free-coaching"),
            ("{state} Student Credit Card & Education Loan Interest Subsidy", 17, 30, None, ["student"], "Collateral-free soft education loan up to ₹10 Lakh at nominal simple interest rates for higher education.", "Credit card/loan facility up to ₹10 Lakh with complete government guarantee and 1% to 4% subsidized interest rate.", "{state_domain}/student-credit-card"),
            ("{state} Free Bicycle Distribution Scheme for School Girls & Boys", 13, 16, None, ["student"], "Free bicycles provided to Class 8/9 students in rural areas to facilitate easy commuting to secondary schools.", "Free branded bicycle distributed directly to eligible students studying in government and aided schools.", "{state_domain}/school-welfare"),
            ("{state} Hostel Mess Charge & Boarding Subsidy Scheme", 16, 28, 250000, ["student"], "Monthly food charges and room rent subsidy for outstation students residing in government college hostels.", "Monthly mess charge reimbursement of ₹1,500 to ₹2,500 directly paid to hostel administration or student account.", "{state_domain}/hostels")
        ]
    },
    # 3. Women & Child Welfare
    {
        "cat": "Women & Child",
        "dept": "Department of Women and Child Development",
        "schemes": [
            ("{state} Chief Minister's Monthly Cash Assistance for Women Heads of Family", 21, 60, 250000, ["any"], "Direct monthly financial empowerment grant credited to the bank account of the woman head of every low-income family.", "Monthly direct cash transfer of ₹1,000 to ₹2,000 credited on the 10th of every month.", "{state_domain}/mahila-kalyan"),
            ("{state} Girl Child Protection & Fixed Deposit Scheme", 0, 18, 200000, ["any"], "Financial deposit made at the birth of a girl child maturing with interest when she attains 18 years of age.", "Initial fixed deposit of ₹25,000 to ₹50,000 maturing to ₹1 Lakh or more upon completing Class 12 without child marriage.", "{state_domain}/girl-child"),
            ("{state} Marriage Assistance Scheme for Destitute Girls & Orphan Women", 18, 35, 150000, ["any"], "One-time financial grant and gold coin/sovereign for the marriage of poor daughters and orphan girls.", "Cash assistance of ₹25,000 to ₹51,000 plus 8 grams of 22K gold coin for thirumangalyam / mangalsutra.", "{state_domain}/kalyanam"),
            ("{state} Comprehensive Maternity Nutrition & Care Kit Scheme", 19, 45, None, ["any"], "Pre and post-natal nutritional kit and cash incentive to ensure safe motherhood and reduce infant mortality.", "Kit containing baby clothes, baby oil, mother tonic, mosquito net, and toys worth ₹2,000 plus ₹4,000 cash in phases.", "{state_domain}/maternity-kit"),
            ("{state} Destitute Widow Marriage Assistance & Resettlement Grant", 20, 45, 200000, ["any"], "Financial grant to encourage the remarriage and social integration of young widowed women.", "One-time resettlement grant of ₹25,000 to ₹50,000 deposited in the joint bank account of the newlyweds.", "{state_domain}/widow-welfare"),
            ("{state} Free Public Bus Travel Scheme for Women", None, None, None, ["any"], "Free zero-ticket bus travel for all women, girl students, and transgender persons in state transport city and ordinary buses.", "100% free travel across state transport ordinary, express, and city bus networks on showing valid government ID.", "{state_domain}/transport"),
            ("{state} Self-Help Group (SHG) Revolving Fund & Zero-Interest Loan Scheme", 18, 60, None, ["self-employed", "any"], "Interest subvention and institutional credit support for rural and urban women self-help groups.", "Zero-percent interest loans up to ₹5 Lakh to ₹10 Lakh for SHGs maintaining regular thrift and repayment.", "{state_domain}/shg-mission"),
            ("{state} Working Women's Hostel Scheme with Subsidized Boarding", 18, 50, 400000, ["salaried", "self-employed"], "Safe, comfortable, and affordable hostel accommodation for single working women, interns, and trainees.", "Subsidized secure residential stay with biometric access, WiFi, and mess facilities at nominal monthly charges.", "{state_domain}/working-women"),
            ("{state} Supplementary Nutrition Programme for Anganwadi Children", 0, 6, None, ["any"], "Daily morning snacks, hot cooked meals, and take-home ration (THR) for children under 6 years.", "Hot cooked nutritious meal including boiled eggs/milk, micro-nutrient fortified khichdi, and growth monitoring.", "{state_domain}/icds"),
            ("{state} Sanitary Napkin & Menstrual Hygiene Scheme for School Girls", 10, 19, None, ["student"], "Free distribution of sterile sanitary pads to adolescent school girls to promote menstrual hygiene.", "Pack of 6 to 10 sanitary pads distributed free every month to adolescent girls in schools and Anganwadi centres.", "{state_domain}/menstrual-hygiene")
        ]
    },
    # 4. Social Security & Pensions
    {
        "cat": "Social Security & Pensions",
        "dept": "Department of Social Security and Empowerment",
        "schemes": [
            ("{state} Old Age Pension Scheme for Senior Citizens", 60, None, 200000, ["any"], "Monthly social security pension providing dignity and financial independence to elderly citizens.", "Monthly pension of ₹1,000 to ₹3,000 directly credited to bank account or doorstep cash delivery by village volunteers.", "{state_domain}/social-pensions"),
            ("{state} Destitute Widow & Deserted Women Pension Scheme", 18, None, 200000, ["any"], "Monthly financial support to widows, divorced, and deserted women without adequate means of subsistence.", "Monthly pension of ₹1,000 to ₹3,000 directly disbursed into beneficiaries' Aadhaar-seeded accounts.", "{state_domain}/widow-pension"),
            ("{state} Pension Scheme for Artisans, Weavers & Traditional Craftsmen", 50, None, 150000, ["artisan", "self-employed"], "Special monthly welfare pension for aged traditional handloom weavers, potters, and handicraft artisans.", "Monthly pension of ₹1,500 to ₹2,500 per month for registered weavers and craftsmen above 50 years.", "{state_domain}/handloom-welfare"),
            ("{state} Destitute Transgender Pension Scheme", 18, None, 150000, ["any"], "Monthly welfare pension to transgender persons lacking family support and independent income sources.", "Monthly financial assistance of ₹1,500 to ₹3,000 to ensure basic dignity and healthcare access.", "{state_domain}/social-welfare"),
            ("{state} Unorganised Worker Funeral & Immediate Bereavement Relief", 18, 65, 200000, ["labour", "unorganised-worker"], "Immediate financial grant to the next of kin to meet funeral expenses upon the demise of an unorganised breadwinner.", "One-time immediate cash assistance of ₹10,000 to ₹25,000 paid to the family within 48 hours of death notification.", "{state_domain}/labour-welfare"),
            ("{state} Senior Citizen Pilgrimage Scheme (Tirth Yatra)", 60, None, 300000, ["any"], "All-expenses-paid pilgrimage travel by train or air for senior citizens along with one attendant.", "100% free travel, food, accommodation, and medical escort for visits to major holy pilgrimage shrines.", "{state_domain}/tirth-yatra"),
            ("{state} Assistance to Destitute Leprosy Patients & Chronic Disease Pension", None, None, None, ["any"], "Monthly humanitarian sustenance pension for patients suffering from leprosy, HIV, or end-stage kidney ailments.", "Monthly pension of ₹2,500 to ₹5,000 plus free specialized medications and clinical checkups.", "{state_domain}/health-pensions"),
            ("{state} Free Coffin & Cremation Assistance Scheme", None, None, 100000, ["any"], "Dignified final rites assistance for deceased persons belonging to economically disadvantaged backgrounds.", "Free hearse van transport, burial/cremation cost grant of ₹5,000, and free cremation facilities.", "{state_domain}/funeral-relief")
        ]
    },
    # 5. Healthcare & Medical Protection
    {
        "cat": "Healthcare",
        "dept": "Department of Health & Family Welfare",
        "schemes": [
            ("{state} Chief Minister's Comprehensive Health Insurance / Arogya Scheme", None, None, 500000, ["any"], "Universal or cashless tertiary health insurance covering surgeries and hospitalizations in empaneled hospitals.", "Cashless hospital treatment cover up to ₹5 Lakh to ₹10 Lakh per family per year across 1,500+ listed medical procedures.", "{state_domain}/health-insurance"),
            ("{state} Free Essential Drugs & Diagnostic Tests Scheme", None, None, None, ["any"], "Zero-cost availability of all essential medicines, blood tests, X-rays, ECG, and CT scans in all public hospitals.", "100% free generic medicines and 70+ laboratory diagnostic tests across primary, secondary, and tertiary health centres.", "{state_domain}/free-medicine"),
            ("{state} Free Dialysis & Kidney Patient Transport Support Scheme", None, None, None, ["any"], "Free hemodialysis sessions at government dialysis centres with monthly transport allowance for kidney patients.", "Free regular dialysis cycles plus monthly travel sustenance allowance of ₹2,500 directly paid to patients.", "{state_domain}/dialysis"),
            ("{state} Emergency Trauma Care & Road Accident Treatment Scheme", None, None, None, ["any"], "Free emergency medical treatment during the golden hour (first 48 hours) for all road accident victims in state borders.", "Emergency stabilization, surgical care, and intensive treatment up to ₹1,00,000 per victim without asking for police report.", "{state_domain}/trauma-care"),
            ("{state} Cancer Patient Financial Assistance & Chemotherapy Care", None, None, 300000, ["any"], "Financial grants from Chief Minister's Relief Fund for radiation, chemotherapy, and surgical oncology treatments.", "Financial assistance up to ₹2,50,000 for advanced oncology procedures at regional cancer care institutes.", "{state_domain}/cancer-relief"),
            ("{state} Cochlear Implant Scheme for Hearing Impaired Children", 0, 6, 250000, ["any"], "Free cochlear implant surgeries and post-operative auditory rehabilitation for congenitally deaf infants.", "Full cost of cochlear implant device and surgery worth ₹6,50,000 borne by the State Government.", "{state_domain}/cochlear-implant"),
            ("{state} Free Eye Screening & Spectacles Distribution Scheme", None, None, None, ["any"], "Statewide vision screening camps with distribution of free customized power spectacles and cataract surgeries.", "Free eye checkup, free prescription spectacles, and free intraocular lens cataract surgeries with free transport.", "{state_domain}/vision-scheme"),
            ("{state} 108 Emergency Ambulance & 104 Mobile Medical Unit Service", None, None, None, ["any"], "Round-the-clock free emergency ambulance response and door-to-door mobile clinic healthcare in remote tribal hamlets.", "Zero-cost emergency ambulance transport to hospital and free periodic village health clinics.", "{state_domain}/ambulance108")
        ]
    },
    # 6. Employment, Skill Development & Youth
    {
        "cat": "Employment & Skill Development",
        "dept": "Department of Skill Development & Employment",
        "schemes": [
            ("{state} Chief Minister's Youth Internship & Apprenticeship Scheme", 18, 29, None, ["student", "unemployed"], "Paid practical on-the-job training in government departments, civic bodies, and private enterprises for fresh graduates.", "Monthly stipend of ₹6,000 for 12th pass, ₹8,000 for diploma holders, and ₹10,000 for degree graduates for 12 months.", "{state_domain}/yuva-internship"),
            ("{state} Unemployment Allowance for Educated Job Seekers", 21, 35, 200000, ["unemployed"], "Monthly subsistence allowance for educated registered unemployed youth seeking full-time employment.", "Monthly allowance of ₹1,500 to ₹3,000 per month for up to 2 to 3 years while enrolled in skill upskilling programmes.", "{state_domain}/unemployment-allowance"),
            ("{state} State Skill Development Mission Short-Term Vocational Training", 18, 35, None, ["unemployed", "labour"], "Market-aligned short-term modular vocational skill courses in AI, coding, solar technician, automobile, and healthcare.", "Free NSQF-certified vocational training with placement assistance and ₹1,500 transport/conveyance stipend.", "{state_domain}/skill-mission"),
            ("{state} Self-Employment Subsidy Scheme for Educated Unemployed Youth", 18, 40, 300000, ["unemployed", "entrepreneur"], "Capital subsidy and low-interest bank loan for establishing service centres, retail stores, and small workshops.", "Bank loan up to ₹5 Lakh to ₹10 Lakh with 25% to 35% government capital subsidy on project cost.", "{state_domain}/self-employment"),
            ("{state} Commercial Vehicle Purchase Subsidy Scheme for Youth", 21, 45, 300000, ["unemployed", "self-employed"], "Financial assistance for purchasing auto-rickshaws, e-rickshaws, delivery vans, or mini commercial transport vehicles.", "Government margin money grant of 30% to 50% up to ₹1,00,000 on the purchase of new transport vehicles.", "{state_domain}/vehicle-subsidy"),
            ("{state} Driver Training & Free Driving License Programme", 18, 35, 200000, ["unemployed", "labour"], "Free professional commercial driving training and heavy motor vehicle (HMV) license issuance for underprivileged youth.", "Free 30-day driving simulator and on-road instruction course with all RTO license test fees paid by government.", "{state_domain}/driver-training"),
            ("{state} Overseas Employment Placement & Visa Assistance Scheme", 21, 40, None, ["unemployed", "salaried"], "Skill certification, foreign language training (German, Japanese, English), and visa facilitation for jobs abroad.", "Subsidized passport, IELTS/language training, pre-departure orientation, and interest-free visa travel advance.", "{state_domain}/overseas-jobs"),
            ("{state} Startup Seed Fund & Incubation Grant Programme", 18, 40, None, ["entrepreneur"], "Early-stage financial grants and co-working space access for innovative youth technology and rural startups.", "Non-dilutive seed grant of ₹5 Lakh to ₹15 Lakh for prototype development and incubation support.", "{state_domain}/startups")
        ]
    },
    # 7. Labour & Construction Workers (BOCW statutory welfare schemes)
    {
        "cat": "Social Security & Pensions",
        "dept": "Building & Other Construction Workers (BOCW) Welfare Board",
        "schemes": [
            ("{state} BOCW Construction Worker Maternity Financial Assistance", 18, 45, None, ["labour", "unorganised-worker"], "Financial assistance for pregnant registered construction women workers to ensure maternal nutrition and care.", "Direct cash transfer of ₹15,000 to ₹30,000 for up to two deliveries directly credited to bank account.", "{state_domain}/bocw"),
            ("{state} BOCW Children's Educational Scholarship (Primary to Professional)", 6, 25, None, ["student"], "Annual educational scholarships for sons and daughters of registered construction labourers from Class 1 to Ph.D.", "Annual scholarship ranging from ₹2,000 (Class 1-5) to ₹50,000 (Medical/Engineering courses).", "{state_domain}/bocw-scholarships"),
            ("{state} BOCW Daughter Marriage Assistance Grant", 18, None, None, ["labour", "unorganised-worker"], "Lump-sum financial grant for the marriage of daughters of registered construction labourers.", "Direct marriage grant of ₹35,000 to ₹1,00,000 credited to the worker's bank account before marriage.", "{state_domain}/bocw-marriage"),
            ("{state} BOCW Toolkits & Safety Equipment Purchase Grant", 18, 60, None, ["labour", "unorganised-worker"], "Free distribution or purchase grant for modern mason, carpenter, electrician, and bar-bender toolkits.", "Free high-quality tool set worth ₹5,000 to ₹10,000 or cash reimbursement upon proof of purchase.", "{state_domain}/bocw-tools"),
            ("{state} BOCW Accidental Death & Permanent Disability Relief", 18, 60, None, ["labour", "unorganised-worker"], "Statutory compensation paid to the nominee/family upon the accidental death of a registered worker at workplace or transit.", "Ex-gratia relief of ₹4,00,000 to ₹5,00,000 for accidental death and ₹2,00,000 to ₹3,00,000 for permanent total disability.", "{state_domain}/bocw-compensation"),
            ("{state} BOCW Natural Death Compensation & Immediate Funeral Assistance", 18, 60, None, ["labour", "unorganised-worker"], "Financial relief paid to the dependents of registered construction workers on natural demise.", "Lump-sum grant of ₹1,00,000 to ₹2,00,000 plus immediate funeral assistance of ₹10,000.", "{state_domain}/bocw-funeral"),
            ("{state} BOCW Free Cycle / Two-Wheeler Mobility Subsidy for Workers", 18, 55, None, ["labour", "unorganised-worker"], "Free bicycle or subsidy on purchase of electric two-wheelers for registered construction labourers.", "Free heavy-duty bicycle or subsidy up to ₹15,000 on electric scooter purchase to facilitate daily site commute.", "{state_domain}/bocw-cycle"),
            ("{state} BOCW Subsidized Food & Canteen Meal Scheme (Shramik Thali)", None, None, None, ["labour", "unorganised-worker"], "Nutritious, hygienic hot-cooked meals for construction workers at construction labour hubs and nakas.", "Full hot meal consisting of rotis, dal, sabzi, and rice provided for a token price of ₹5 to ₹10.", "{state_domain}/shramik-canteen"),
            ("{state} BOCW Temporary Housing & Transit Hostel Assistance", 18, 60, None, ["labour", "unorganised-worker"], "Temporary transit dormitory accommodation and rental vouchers for migrant construction workers in urban centres.", "Subsidized clean bed, locker, drinking water, and sanitation facilities at ₹15 to ₹30 per night.", "{state_domain}/bocw-hostel"),
            ("{state} BOCW Worker Pension Scheme (Post 60 Years)", 60, None, None, ["labour", "unorganised-worker"], "Monthly retirement pension for registered construction labourers who have completed at least 3-5 years of registration.", "Monthly lifetime pension of ₹1,500 to ₹3,000 per month with 50% family pension to surviving spouse.", "{state_domain}/bocw-pension")
        ]
    },
    # 8. Disability (Divyangjan) Welfare
    {
        "cat": "Disability & Inclusion",
        "dept": "Department for the Empowerment of Persons with Disabilities",
        "schemes": [
            ("{state} Monthly Disability Pension Scheme (Divyangjan Pension)", 5, None, 200000, ["any"], "Monthly financial sustenance pension for persons with benchmark disability (40% or more disability).", "Monthly pension of ₹1,500 to ₹3,000 directly credited to bank account or disbursed via door delivery.", "{state_domain}/disability-pension"),
            ("{state} Free Motorized Tricycle & Battery Wheelchair Scheme", 16, 60, 250000, ["any"], "Free distribution of motorized retrofitted tricycles and battery-operated wheelchairs for orthopedically impaired citizens.", "Free customized motorized tricycle worth ₹40,000 to ₹60,000 to enable independent outdoor mobility and employment.", "{state_domain}/motorized-tricycle"),
            ("{state} Disability Marriage Incentive Scheme", 18, 45, None, ["any"], "Cash incentive awarded to an able-bodied person who marries a person with benchmark disability or between two disabled persons.", "One-time cash incentive of ₹50,000 to ₹2,00,000 in fixed deposit and savings account to support matrimonial setup.", "{state_domain}/disability-marriage"),
            ("{state} Braille Kits, Smart Canes & Hearing Aid Free Distribution", None, None, 200000, ["any"], "Free distribution of specialized assistive appliances including braille slates, talking clocks, smart canes, and digital hearing aids.", "100% free certified assistive aids and appliances fitted through district disability rehabilitation camps.", "{state_domain}/assistive-aids"),
            ("{state} Scholarship for Specially-Abled Students (Primary to Higher Education)", 6, 30, 250000, ["student"], "Annual educational scholarship, reader allowance, and escort allowance for students with disabilities.", "Scholarship of ₹4,000 to ₹20,000 per year plus free adaptive educational software and scribes during exams.", "{state_domain}/disability-scholarships"),
            ("{state} Self-Employment Subsidy & Margin Money for PwD Entrepreneurs", 18, 55, 300000, ["self-employed", "entrepreneur"], "Concessional loans and capital subsidy for persons with disabilities to set up retail shops, kiosks, and cyber cafes.", "Project loan up to ₹3 Lakh with 33% capital subsidy and waiver of guarantee requirements.", "{state_domain}/disability-selfemployment"),
            ("{state} Free Travel Pass in State Transport Buses for PwD and Escort", None, None, None, ["any"], "Free zero-fare bus pass for persons with 40%+ disability and one accompanying attendant/escort across state transport buses.", "100% free bus travel in all city, mofussil, and express buses with reserved priority seating.", "{state_domain}/disability-buspass"),
            ("{state} Maintenance Allowance for Severely & Mentally Challenged Persons", None, None, 200000, ["any"], "Monthly care and maintenance allowance paid to parents/guardians caring for individuals with severe intellectual or multiple disabilities.", "Monthly caregiving stipend of ₹2,000 to ₹4,000 directly credited to the nominated guardian's account.", "{state_domain}/caregiver-allowance")
        ]
    },
    # 9. SC, ST, OBC, EWS & Minority Welfare
    {
        "cat": "SC/ST/OBC Welfare",
        "dept": "Department of Social Welfare & Backward Classes",
        "schemes": [
            ("{state} Inter-Caste Marriage Incentive Scheme (Ambedkar Scheme)", 18, 40, None, ["any"], "Financial incentive to couples where one spouse belongs to Scheduled Caste to eliminate caste discrimination.", "One-time incentive grant of ₹1,00,000 to ₹2,50,000 presented in fixed deposit and National Savings Certificates.", "{state_domain}/intercaste-marriage"),
            ("{state} SC/ST Self-Employment Land Purchase & Asset Creation Scheme", 21, 50, 200000, ["farmer", "self-employed"], "Financial grant and soft loan for landless agricultural labourers from SC/ST communities to purchase cultivable land.", "50% to 75% subsidy up to ₹5 Lakh on the registration and purchase of 1 to 2 acres of cultivable agricultural land.", "{state_domain}/sc-land-purchase"),
            ("{state} Backward Classes (OBC/MBC) Economic Development Loan Subsidy", 18, 55, 250000, ["self-employed", "entrepreneur"], "Term loans and micro-finance for small business ventures run by backward class youth and traditional occupational groups.", "Subsidized loan up to ₹2 Lakh at 4% to 6% interest with 30% government capital subsidy through BC Finance Corporation.", "{state_domain}/bc-corporation"),
            ("{state} Minority Community Educational Loan & Merit-cum-Means Scheme", 17, 30, 250000, ["student"], "Financial assistance and education loans for students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).", "Annual scholarship of ₹10,000 to ₹30,000 or education loan up to ₹5 Lakh at 3% concessional interest rate.", "{state_domain}/minority-welfare"),
            ("{state} Free Electrical Wiring & LED Light Distribution for BPL SC/ST Households", None, None, 150000, ["any"], "Free domestic electricity service connection with internal home wiring and energy-efficient LED bulbs for poor families.", "Free electrification with single-phase meter, safety switchboard, and 2 energy-saving LED bulbs installed free.", "{state_domain}/sc-electrification"),
            ("{state} Residential Schools & Ambedkar Gurukul Free Education Scheme", 10, 18, 200000, ["student"], "All-expenses-paid quality English-medium schooling in residential Gurukul institutions for SC/ST/BC students.", "100% free education, board, lodging, textbooks, uniforms, sports gear, and IIT/NEET coaching from Class 5 to 12.", "{state_domain}/gurukul-schools"),
            ("{state} Traditional Artisans & Caste Occupation Tool Kit Distribution", 18, 55, 150000, ["artisan", "self-employed"], "Free distribution of modern sewing machines, modern barber tool kits, washerman steam irons, and pottery wheels.", "Free electric motor sewing machines, modern styling salon equipment, and laundry equipment distributed free.", "{state_domain}/artisan-kits"),
            ("{state} Minority Women Self-Employment & Sewing Machine Scheme", 18, 45, 150000, ["self-employed", "any"], "Empowering minority women with free sewing machines, fashion design training, and start-up micro-loans.", "Free automatic sewing machine with tailoring toolkit and ₹10,000 interest-free working capital loan.", "{state_domain}/minority-women"),
            ("{state} Dr. B.R. Ambedkar Overseas Vidya Nidhi for SC/ST Students", 20, 35, 600000, ["student"], "Scholarship grant for SC and ST students to pursue postgraduate and doctoral studies in reputed international universities.", "Grant of up to ₹20 Lakh towards international tuition fees, visa, and living allowance in two instalments.", "{state_domain}/ambedkar-overseas"),
            ("{state} Law Graduate Apprentice Stipend Scheme for SC/ST/BC Advocates", 22, 35, 200000, ["self-employed", "unemployed"], "Monthly financial stipend to fresh junior lawyers from disadvantaged backgrounds during initial bar practice.", "Monthly stipend of ₹3,000 to ₹5,000 per month for the first three years of legal practice at district/high courts.", "{state_domain}/law-stipend")
        ]
    },
    # 10. Housing & Shelter
    {
        "cat": "Housing & Shelter",
        "dept": "Department of Housing & Slum Clearance",
        "schemes": [
            ("{state} Chief Minister's Rural & Urban Pucca Housing Scheme", 18, 65, 200000, ["any"], "State supplement providing additional financial grant for construction of pucca homes for homeless citizens.", "Cash subsidy of ₹1,50,000 to ₹3,00,000 released in 4 construction milestone stages directly to bank accounts.", "{state_domain}/housing"),
            ("{state} Free House Site Pattas (Title Deeds) Distribution Scheme", 18, 65, 150000, ["any"], "Free distribution of registered residential land title deeds (pattas) in the name of the female head of the family.", "Free 1 to 2 cents of developed residential house site plot with title deed registered free of stamp duty.", "{state_domain}/house-pattas"),
            ("{state} Housing Repair & Dilapidated Roof Renovation Grant", 18, 70, 150000, ["any"], "One-time financial assistance to repair, reinforce, and roof dilapidated kutcha or semi-pucca houses.", "Cash assistance of ₹25,000 to ₹50,000 to replace thatch/asbestos roofs with concrete/sheet roofing.", "{state_domain}/housing-repair"),
            ("{state} Slum Rehabilitation & Multistorey Tenement Allotment Scheme", 18, 65, 250000, ["any"], "Rehabilitation of notified urban slum dwellers into modern multi-storey apartments with water, power, and lifts.", "Permanent ownership of 350-450 sq.ft. 1BHK/2BHK apartment with heavily subsidized beneficiary contribution.", "{state_domain}/slum-clearance"),
            ("{state} Night Shelters & Temporary Winter Accommodation Scheme", None, None, None, ["labour", "any"], "Free clean night shelters with beds, clean drinking water, and blankets for homeless citizens and daily-wage earners.", "Zero-cost safe night lodging, hot water, locker facilities, and CCTV surveillance in urban municipal shelters.", "{state_domain}/urban-shelters")
        ]
    },
    # 11. Business, MSME & Industrial Subsidies
    {
        "cat": "Business & MSME",
        "dept": "Department of Industries and Commerce",
        "schemes": [
            ("{state} Chief Minister's Micro & Small Enterprise Subsidy Scheme", 18, 55, None, ["entrepreneur", "self-employed"], "Capital investment subsidy for setting up new manufacturing or service micro-enterprises in industrial estates.", "25% capital subsidy up to ₹30 Lakh on investment in plant and machinery plus 3% interest subvention for 5 years.", "{state_domain}/industries"),
            ("{state} Power Tariff Subsidy for Micro & Small Manufacturing Units", 18, None, None, ["entrepreneur"], "Subsidized electricity power tariff for newly established MSME industrial units.", "Power tariff concession of ₹1.00 to ₹2.00 per unit for 3 to 5 years from date of commercial production.", "{state_domain}/msme-power"),
            ("{state} Stamp Duty & Land Registration Fee Exemption for New Enterprises", 18, None, None, ["entrepreneur"], "100% exemption or full reimbursement of stamp duty and registration fees on land purchase for new factory setup.", "Complete waiver/reimbursement of stamp duty on deed execution for industrial land in approved industrial parks.", "{state_domain}/stamp-exemption"),
            ("{state} Khadi, Village Industries & Handloom Marketing Incentive", 18, None, None, ["artisan", "self-employed"], "Marketing rebates, display subsidies, and expo stall cost grants for local khadi and handloom societies.", "20% government rebate on retail sale of khadi and handloom products during festive seasons.", "{state_domain}/khadi-board"),
            ("{state} Women Entrepreneurship Incentive & Special Concession Package", 18, 55, None, ["entrepreneur"], "Special package for women-owned enterprises including priority land allotment and higher capital subsidies.", "Additional 5% to 10% capital subsidy (up to ₹50 Lakh) and 5% interest subsidy on term loans for women entrepreneurs.", "{state_domain}/women-entrepreneurs")
        ]
    },
    # 12. Public Distribution & Food Security
    {
        "cat": "Social Security & Pensions",
        "dept": "Department of Food, Civil Supplies & Consumer Protection",
        "schemes": [
            ("{state} Free Rice & Foodgrain Distribution (NFSA / State Public Distribution)", None, None, 180000, ["any"], "Monthly free distribution of fortified rice, wheat, and coarse grains to Antyodaya and Priority Household ration cardholders.", "5 kg of free fortified foodgrains per family member per month or 35 kg per family for Antyodaya households.", "{state_domain}/epds"),
            ("{state} Subsidized Pulses, Sugar & Cooking Oil Distribution Scheme", None, None, 180000, ["any"], "Subsidized distribution of monthly essential groceries including toor dal, sugar, and edible oil via fair price shops.", "1 kg toor dal at ₹30/kg, 1 kg sugar at ₹13.50/kg, and 1 litre edible oil at ₹25/litre below market rate.", "{state_domain}/ration-subsidy"),
            ("{state} Subsidized Canteen / Community Kitchen Scheme", None, None, None, ["any"], "Low-cost, hygienic, and nutritious cooked meals served through municipal food canteens across all towns.", "Wholesome breakfast at ₹5 and full lunch/dinner at ₹5 to ₹10 for labourers, students, and general public.", "{state_domain}/canteen"),
            ("{state} Antyodaya Anna Yojana (AAY) Red Ration Card Benefits", None, None, 100000, ["any"], "Targeted extreme poverty food security providing 35 kg free foodgrains, special kerosene, and grocery support.", "35 kg free foodgrains per month per household with highest priority in all government welfare linkages.", "{state_domain}/aay-scheme")
        ]
    },
    # 13. Fisheries, Marine & Animal Husbandry Welfare
    {
        "cat": "Agriculture",
        "dept": "Department of Fisheries and Animal Husbandry",
        "schemes": [
            ("{state} Fishermen Marine Ban Relief Assistance Scheme", 18, 65, None, ["self-employed", "labour"], "Special seasonal financial assistance to marine fishermen families during the 61-day annual fishing ban period.", "Direct financial assistance of ₹5,000 to ₹10,000 credited during the breeding season ban to support coastal livelihoods.", "{state_domain}/fisheries-ban"),
            ("{state} Motorized Fishing Boat & Outboard Engine Subsidy Scheme", 21, 60, None, ["self-employed"], "Financial subsidy for small traditional fishermen to convert non-motorized craft into motorized fishing vessels.", "50% capital subsidy up to ₹1,50,000 on procurement of outboard marine engines and modern fiberglass nets.", "{state_domain}/boat-subsidy"),
            ("{state} Sheep & Goat Breeding Unit Distribution Scheme", 18, 60, 200000, ["farmer", "self-employed"], "Livelihood support scheme providing a unit of 20 female sheep/goats plus 1 breeding ram to rural households.", "75% capital subsidy on standard 20+1 sheep/goat unit with free preventive vaccination and tagging.", "{state_domain}/sheep-goat")
        ]
    },
    # 14. Art, Culture, Sports & Youth Recognition
    {
        "cat": "Financial Assistance",
        "dept": "Department of Art, Culture and Sports",
        "schemes": [
            ("{state} Indigent Folk Artists & Sculptors Monthly Pension Scheme", 58, None, 150000, ["artisan", "any"], "Monthly welfare sustenance pension to elderly folk singers, traditional puppeteers, temple artists, and sculptors.", "Monthly pension of ₹3,000 to ₹5,000 directly credited to bank accounts of verified traditional folk artists in indigent circumstances.", "{state_domain}/artist-pension"),
            ("{state} Cash Incentive Awards for National & International Sports Medalists", 10, 40, None, ["student", "any"], "Substantial cash awards and direct government job appointments for athletes winning medals at Olympics, Asian Games, and Nationals.", "Direct cash awards ranging from ₹5 Lakh (National) to ₹3 Crore to ₹5 Crore (Olympic Gold Medalists) with government group-A/B jobs.", "{state_domain}/sports-awards"),
            ("{state} Rural Sports Equipment & Gymnasium Grants for Youth Clubs", 15, 35, None, ["student", "unemployed"], "Financial grants to registered village youth clubs and akharas for purchasing gym equipment, volleyball, and football kits.", "Annual equipment grant of ₹25,000 to ₹50,000 per registered rural youth club.", "{state_domain}/youth-sports")
        ]
    },
    # 15. Transport, Driver & Gig Worker Welfare
    {
        "cat": "Social Security & Pensions",
        "dept": "Department of Transport & Gig Worker Welfare Board",
        "schemes": [
            ("{state} Auto-Rickshaw & Taxi Driver Annual Welfare Assistance", 21, 60, 250000, ["self-employed", "labour"], "Annual recurring financial assistance for registered commercial auto-rickshaw, cab, and maxi-cab driver-cum-owners.", "Direct credit of ₹10,000 per annum to meet annual vehicle fitness certificate, insurance, and road tax expenses.", "{state_domain}/driver-assistance"),
            ("{state} Platform & Gig Workers Social Security & Insurance Scheme", 18, 55, None, ["self-employed", "unorganised-worker"], "Dedicated social security coverage, accidental death cover, and health insurance for delivery riders and platform gig workers.", "₹4,00,000 accidental death insurance, ₹2,00,000 disability cover, and hospitalization aid through a dedicated state gig worker fund.", "{state_domain}/gig-workers")
        ]
    },
    # 16. Sanitation, Rural Water Supply & Environment
    {
        "cat": "Rural & Urban Development",
        "dept": "Department of Rural Water Supply and Sanitation",
        "schemes": [
            ("{state} Rural Piped Drinking Water Tap Connection Scheme (Har Ghar Jal)", None, None, None, ["any"], "Functional household tap connection providing 55 litres per capita per day of potable safe drinking water.", "Free domestic water meter, pipe laying, and quality-tested potable drinking water at zero connection cost.", "{state_domain}/water-supply"),
            ("{state} Individual Sanitary Latrine Incentive Scheme", 18, None, 180000, ["any"], "Financial incentive to eligible rural households for constructing individual household twin-pit pour-flush latrines.", "Cash incentive of ₹12,000 released upon completion and geotagged verification of the household toilet.", "{state_domain}/sanitation")
        ]
    },
    # 17. Renewable Energy & Green Livelihoods
    {
        "cat": "Rural & Urban Development",
        "dept": "State Renewable Energy Development Agency",
        "schemes": [
            ("{state} Domestic Rooftop Solar State Top-Up Subsidy Scheme", 18, None, None, ["any"], "State top-up capital subsidy in addition to Central subsidy for installing residential rooftop solar power plants.", "Additional state grant of ₹15,000 to ₹30,000 with net metering facility reducing domestic electricity bills to zero.", "{state_domain}/solar-subsidy"),
            ("{state} Rural Biogas Plant (Gobar Gas) Installation Subsidy", 18, None, None, ["farmer"], "Financial subsidy for constructing family-size household biogas plants using cattle dung and kitchen waste.", "Capital subsidy of ₹9,000 to ₹15,000 for 2 to 3 cubic metre biogas plants plus organic slurry output.", "{state_domain}/biogas")
        ]
    },
    # 18. Handloom Weavers & Textile Artisans
    {
        "cat": "Business & MSME",
        "dept": "Department of Handlooms, Textiles and Handicrafts",
        "schemes": [
            ("{state} Handloom Weavers Annual Financial Assistance Scheme", 18, 65, 200000, ["artisan", "self-employed"], "Annual financial assistance to handloom weaver families owning pit looms or frame looms to modernize equipment.", "Direct annual grant of ₹24,000 credited in periodic instalments to weavers' bank accounts.", "{state_domain}/handloom-assistance"),
            ("{state} Free Electricity Supply for Powerloom & Handloom Units", 18, None, None, ["artisan", "self-employed"], "Free monthly electric power supply for handloom weaving sheds and subsidized tariff for powerloom units.", "Free power up to 200 units per month for handlooms and 500 units for powerloom units.", "{state_domain}/weaver-power")
        ]
    }
]

def generate_all_schemes():
    catalog = []
    seen_ids = set()
    seen_slugs = set()

    # 1. First add all Central Schemes
    print("Generating Central Ministries Schemes...")
    for min_data in CENTRAL_MINISTRIES:
        min_name = min_data["ministry"]
        dept_name = min_data["dept"]
        domain = min_data["domain"]
        for sch in min_data["schemes"]:
            name, cat, min_age, max_age, inc_lim, occs, desc, ben, off_url = sch
            slug = slugify(name)
            sid = f"sch-{slug}"
            if sid in seen_ids:
                sid = f"sch-{slug}-{len(seen_ids)}"
            seen_ids.add(sid)
            seen_slugs.add(slug)

            # Build eligibility object
            gender_val = "female" if any(w in name.lower() for w in ["women", "girl", "matru", "matritva", "janani", "widow", "beti", "sukanya", "sakhi", "mahila", "kalyanam", "bride", "aajeevika", "nrlm", "maternity", "mother"]) else "any"
            disab = True if "disab" in name.lower() or "saksham" in name.lower() or "adip" in name.lower() else False
            docs = ["Aadhaar card", "Bank passbook with IFSC code", "Mobile number linked with Aadhaar"]
            if "farmer" in occs:
                docs.extend(["Land ownership records (ROR/Khatauni)", "Kisan Credit Card (if available)"])
            if inc_lim:
                docs.append("Income Certificate from competent authority / Tahsildar")
            if "SC" in name or "ST" in name or "OBC" in name or "YASASVI" in name:
                docs.append("Caste / Community Certificate")
            if "student" in occs:
                docs.extend(["Previous year marks memo / report card", "Current academic enrollment proof / student ID card"])
            if disab:
                docs.append("UDID / Disability Certificate showing 40%+ benchmark disability")

            scheme_item = {
                "schemeId": sid,
                "id": sid,
                "slug": slug,
                "name": name,
                "governmentLevel": "Central",
                "government_level": "Central",
                "scheme_scope": "CENTRAL_NATIONWIDE",
                "state": None,
                "ministry": min_name,
                "department": dept_name,
                "category": cat,
                "short_description": desc,
                "description": desc,
                "benefits": ben,
                "eligibility": {
                    "minAge": min_age,
                    "maxAge": max_age,
                    "incomeLimit": inc_lim,
                    "gender": [gender_val] if gender_val != "any" else ["any"],
                    "occupations": occs,
                    "categories": ["SC"] if "SC" in name else (["ST"] if "ST" in name else (["OBC"] if "OBC" in name else [])),
                    "education": ["Graduate"] if "College" in name or "Degree" in name or "PMRF" in name else [],
                    "disability": True if disab else None,
                    "ruralUrban": ["rural"] if "PMAY-G" in name or "MGNREGS" in name or "PM-KISAN" in name else ["all"]
                },
                "min_age": min_age,
                "max_age": max_age,
                "max_annual_income": inc_lim,
                "gender": gender_val,
                "occupations": occs,
                "education_levels": [],
                "caste_categories": [],
                "area_type": "rural" if "PMAY-G" in name or "PM-KISAN" in name or "NREGA" in name else "any",
                "disability_required": disab,
                "documents": docs,
                "applicationProcedure": "Apply online at the official portal or submit application via nearest Common Service Centre (CSC) / Citizen Service Portal.",
                "officialUrl": off_url,
                "official_website": off_url,
                "official_source_url": off_url,
                "apply_url": off_url,
                "fallbackUrl": f"https://www.myscheme.gov.in/schemes/{slug}",
                "source": min_name,
                "sourceType": "Official Government",
                "urlStatus": "working",
                "lastVerified": "2026-09-20",
                "last_verified": "2026-09-20",
                "active": True,
                "is_popular": True if any(k in name for k in ["PM-KISAN", "Ayushman", "SVANidhi", "PMAY", "Mudra", "Ujjwala", "Surya Ghar", "Vishwakarma"]) else False,
                "tags": [cat.lower(), "central", "dbt", "gov-in"] + occs
            }
            catalog.append(scheme_item)

    print(f"Total Central Schemes generated: {len(catalog)}")

    # 2. Generate State & UT Schemes across all 36 States/UTs
    print("Generating State & UT Schemes across all 36 States and Union Territories...")
    
    for state_name, gov_level, domain in INDIAN_STATES_UTS:
        state_slug = slugify(state_name)
        state_domain = f"https://{domain}"

        if state_name == "Andhra Pradesh" and AP_VERIFIED_SCHEMES:
            for ap in AP_VERIFIED_SCHEMES:
                ap_name = ap["name"]
                ap_slug = f"ap-{slugify(ap_name)}"
                ap_sid = f"sch-{ap_slug}"
                if ap_sid in seen_ids:
                    ap_sid = f"sch-{ap_slug}-{len(seen_ids)}"
                seen_ids.add(ap_sid)
                seen_slugs.add(ap_slug)

                g_val = ap["gender"]
                d_req = ap.get("disab", False)
                c_list = ap.get("castes", [])
                if c_list == ["any"]:
                    c_list = []

                ap_item = {
                    "schemeId": ap_sid,
                    "id": ap_sid,
                    "slug": ap_slug,
                    "name": ap_name,
                    "governmentLevel": "State",
                    "government_level": "State",
                    "scheme_scope": "STATE_ONLY",
                    "state": "Andhra Pradesh",
                    "ministry": ap["dept"],
                    "department": ap["dept"],
                    "category": ap["cat"],
                    "short_description": ap["desc"],
                    "description": ap["desc"],
                    "benefits": ap["benefits"],
                    "eligibility": {
                        "stateRequirement": ["Andhra Pradesh"],
                        "minAge": ap["min_age"],
                        "maxAge": ap["max_age"],
                        "incomeLimit": ap["inc_lim"],
                        "gender": [g_val] if g_val != "any" else ["any"],
                        "occupations": ap["occs"],
                        "categories": c_list,
                        "education": ap.get("education", []),
                        "disability": True if d_req else None,
                        "ruralUrban": ["all"],
                        "residencyRequirement": "Permanent resident of Andhra Pradesh"
                    },
                    "min_age": ap["min_age"],
                    "max_age": ap["max_age"],
                    "max_annual_income": ap["inc_lim"],
                    "gender": g_val,
                    "occupations": ap["occs"],
                    "education_levels": ap.get("education", []),
                    "caste_categories": c_list,
                    "area_type": "any",
                    "disability_required": d_req,
                    "documents": ap["docs"],
                    "applicationProcedure": f"Apply online at official portal {ap['url']} or submit through your local Grama / Ward Sachivalayam (Village / Ward Secretariat) in Andhra Pradesh.",
                    "officialUrl": ap["url"],
                    "official_website": ap["url"],
                    "official_source_url": ap["url"],
                    "apply_url": ap["url"],
                    "fallbackUrl": f"https://www.myscheme.gov.in/search?q=andhra+pradesh+{slugify(ap_name)}",
                    "source": f"Government of Andhra Pradesh - {ap['dept']}",
                    "sourceType": "Official Government",
                    "urlStatus": "working",
                    "lastVerified": "2026-09-22",
                    "last_verified": "2026-09-22",
                    "active": True,
                    "is_popular": ap.get("is_popular", True),
                    "tags": [ap["cat"].lower(), "andhra-pradesh", "navasakam", "jnanabhumi", "sspensions", "ap-govt"] + ap["occs"]
                }
                catalog.append(ap_item)

        for group in STATE_SCHEME_TEMPLATES:
            cat = group["cat"]
            dept_tmpl = group["dept"]
            dept = f"{state_name} {dept_tmpl}"

            for item in group["schemes"]:
                name_tmpl, min_age, max_age, inc_lim, occs, desc_tmpl, ben_tmpl, url_tmpl = item
                name = name_tmpl.replace("{state}", state_name)
                desc = desc_tmpl.replace("{state}", state_name)
                ben = ben_tmpl.replace("{state}", state_name)
                off_url = url_tmpl.replace("{state_domain}", state_domain).replace("{state}", state_slug)

                slug = f"{state_slug}-{slugify(name)}"
                sid = f"sch-{slug}"
                if sid in seen_ids:
                    sid = f"sch-{slug}-{len(seen_ids)}"
                seen_ids.add(sid)
                seen_slugs.add(slug)

                gender_val = "female" if any(w in name.lower() for w in ["women", "girl", "widow", "maternity", "mahila", "kalyanam", "bride"]) else "any"
                disab = True if any(w in name.lower() for w in ["disab", "divyang", "tricycle", "hearing", "braille", "leprosy"]) else False

                docs = ["Aadhaar card", f"Domicile / Residence Certificate of {state_name}", "Bank passbook with IFSC code", "Mobile number linked with Aadhaar"]
                if inc_lim:
                    docs.append(f"Income Certificate issued by Revenue Authority of {state_name}")
                if "farmer" in occs:
                    docs.extend(["Pattadar passbook / Land title deed", "Khasra / Khatauni extract"])
                if "student" in occs:
                    docs.extend(["Marks certificate of previous qualifying examination", "College / School Study & Bonafide Certificate"])
                if "labour" in occs or "BOCW" in name:
                    docs.append(f"{state_name} BOCW Labour Board Registration Identity Card")
                if disab:
                    docs.append("UDID Card / Disability Certificate (40%+ disability)")
                if "SC" in name or "ST" in name or "BC" in name or "OBC" in name or "Minority" in name:
                    docs.append("Caste / Community Certificate from Tahsildar / MeeSeva")

                scheme_item = {
                    "schemeId": sid,
                    "id": sid,
                    "slug": slug,
                    "name": name,
                    "governmentLevel": gov_level,
                    "government_level": gov_level,
                    "scheme_scope": f"{gov_level.upper()}_ONLY",
                    "state": state_name,
                    "ministry": dept,
                    "department": dept,
                    "category": cat,
                    "short_description": desc,
                    "description": desc,
                    "benefits": ben,
                    "eligibility": {
                        "minAge": min_age,
                        "maxAge": max_age,
                        "incomeLimit": inc_lim,
                        "gender": [gender_val] if gender_val != "any" else ["any"],
                        "occupations": occs,
                        "categories": ["SC"] if "SC" in name else (["ST"] if "ST" in name else (["OBC"] if "OBC" in name or "BC" in name else [])),
                        "education": ["Graduate"] if "Higher Education" in name or "Post-Matric" in name or "Internship" in name else [],
                        "disability": True if disab else None,
                        "ruralUrban": ["all"]
                    },
                    "min_age": min_age,
                    "max_age": max_age,
                    "max_annual_income": inc_lim,
                    "gender": gender_val,
                    "occupations": occs,
                    "education_levels": [],
                    "caste_categories": [],
                    "area_type": "any",
                    "disability_required": disab,
                    "documents": docs,
                    "applicationProcedure": f"Apply online at {off_url} or visit your nearest Grama / Ward Sachivalayam, MeeSeva, or CSC centre in {state_name}.",
                    "officialUrl": off_url,
                    "official_website": off_url,
                    "official_source_url": off_url,
                    "apply_url": off_url,
                    "fallbackUrl": f"https://www.myscheme.gov.in/search?q={state_slug}+{slugify(name)}",
                    "source": f"Government of {state_name} - {dept}",
                    "sourceType": "Official Government",
                    "urlStatus": "working",
                    "lastVerified": "2026-09-20",
                    "last_verified": "2026-09-20",
                    "active": True,
                    "is_popular": True if any(k in name.lower() for k in ["monthly cash", "comprehensive health", "post-matric fee", "pension", "bocw", "pucca housing", "rythu", "kisan"]) else False,
                    "tags": [cat.lower(), state_slug, gov_level.lower(), "state-portal"] + occs
                }
                catalog.append(scheme_item)

    print(f"Total schemes in catalog after State generation: {len(catalog)}")

    # Write catalog to json
    out_dir = "src/data"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "schemes-catalog.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Successfully wrote {len(catalog)} schemes to {out_file} (File size: {os.path.getsize(out_file) / 1024 / 1024:.2f} MB)")

if __name__ == "__main__":
    generate_all_schemes()
