import type { College, DegreeOffering, Course, DegreePlan, Semester } from "@/types";

// ─── Shared Course Catalogs by Program ────────────────────────────

const csCourses: Course[] = [
  { code: "CS 1420", name: "Introduction to Computer Science", credits: 3, description: "Fundamentals of programming and computational thinking." },
  { code: "CS 2420", name: "Data Structures & Algorithms", credits: 4, description: "Linear and non-linear data structures, sorting, searching, and algorithm analysis." },
  { code: "CS 3100", name: "Computer Architecture", credits: 3, description: "Digital logic, processor architecture, memory hierarchy, and assembly language." },
  { code: "CS 3300", name: "Operating Systems", credits: 3, description: "Process management, memory management, file systems, and concurrency." },
  { code: "CS 3500", name: "Software Engineering", credits: 3, description: "Software design patterns, version control, testing, and agile methodologies." },
  { code: "CS 3700", name: "Artificial Intelligence", credits: 3, description: "Search, knowledge representation, machine learning fundamentals, and neural networks." },
];

const engCourses: Course[] = [
  { code: "ENGR 1201", name: "Engineering Fundamentals", credits: 3, description: "Engineering design process, problem-solving, and technical communication." },
  { code: "ENGR 2301", name: "Statics", credits: 3, description: "Force systems, equilibrium, trusses, frames, and distributed forces." },
  { code: "ENGR 2401", name: "Thermodynamics", credits: 3, description: "Energy, entropy, heat transfer, and thermodynamic cycles." },
  { code: "ENGR 3300", name: "Fluid Mechanics", credits: 3, description: "Fluid statics, dynamics, conservation laws, and pipe flow." },
  { code: "ENGR 3400", name: "Engineering Economics", credits: 3, description: "Economic analysis of engineering projects, cost-benefit, and lifecycle analysis." },
  { code: "ENGR 4600", name: "Capstone Design", credits: 4, description: "Team-based design project integrating engineering principles and professional practice." },
];

const busCourses: Course[] = [
  { code: "BUS 1101", name: "Principles of Management", credits: 3, description: "Management functions, organizational behavior, and leadership theories." },
  { code: "BUS 2101", name: "Financial Accounting", credits: 3, description: "Financial statements, accounting cycle, and fundamental accounting principles." },
  { code: "BUS 2201", name: "Marketing Principles", credits: 3, description: "Market research, consumer behavior, branding, and marketing strategy." },
  { code: "BUS 3101", name: "Corporate Finance", credits: 3, description: "Time value of money, capital budgeting, risk and return, and valuation." },
  { code: "BUS 3301", name: "Business Ethics", credits: 3, description: "Ethical frameworks, corporate social responsibility, and stakeholder analysis." },
  { code: "BUS 4401", name: "Strategic Management", credits: 3, description: "Competitive strategy, industry analysis, and strategic decision-making." },
];

const commCourses: Course[] = [
  { code: "COMM 1301", name: "Introduction to Communication", credits: 3, description: "Communication theories, models, and media literacy foundations." },
  { code: "COMM 2301", name: "Interpersonal Communication", credits: 3, description: "Verbal and non-verbal communication, conflict resolution, and relationship dynamics." },
  { code: "COMM 3300", name: "Mass Media & Society", credits: 3, description: "Role of media in society, media effects, and ethical issues in journalism." },
  { code: "COMM 3400", name: "Digital Media Production", credits: 3, description: "Video, audio, and multimedia content creation for digital platforms." },
  { code: "COMM 4200", name: "Public Relations", credits: 3, description: "PR strategy, crisis communication, media relations, and campaign management." },
  { code: "COMM 4500", name: "Communication Research", credits: 3, description: "Research methods, data analysis, and audience measurement techniques." },
];

const laCourses: Course[] = [
  { code: "HIST 1301", name: "U.S. History to 1877", credits: 3, description: "Colonial era through Reconstruction — political, social, and economic development." },
  { code: "HIST 1302", name: "U.S. History Since 1877", credits: 3, description: "Industrialization, world wars, civil rights, and modern America." },
  { code: "ENGL 2301", name: "British Literature Survey", credits: 3, description: "Major works of British literature from Beowulf to the modern era." },
  { code: "PHIL 1301", name: "Introduction to Philosophy", credits: 3, description: "Western philosophical traditions, logic, ethics, and metaphysics." },
  { code: "POLS 2301", name: "American Government", credits: 3, description: "Constitutional foundations, federalism, branches of government, and civil liberties." },
  { code: "SOC 1301", name: "Introduction to Sociology", credits: 3, description: "Social structures, inequality, culture, and sociological research methods." },
];

const bioCourses: Course[] = [
  { code: "BIOL 1401", name: "General Biology I", credits: 4, description: "Cell biology, genetics, molecular biology, and biological chemistry." },
  { code: "BIOL 1402", name: "General Biology II", credits: 4, description: "Evolution, ecology, biodiversity, and organismal biology." },
  { code: "BIOL 2401", name: "Genetics", credits: 3, description: "Mendelian genetics, population genetics, genomics, and gene regulation." },
  { code: "BIOL 3300", name: "Microbiology", credits: 3, description: "Microbial structure, metabolism, pathogenesis, and immunology." },
  { code: "BIOL 3400", name: "Cell Biology", credits: 3, description: "Cell structure, signaling, membrane transport, and cytoskeleton." },
  { code: "BIOL 4500", name: "Molecular Biology Lab", credits: 3, description: "DNA/RNA techniques, PCR, cloning, and bioinformatics." },
];

const healthCourses: Course[] = [
  { code: "HSCI 1301", name: "Foundations of Health Science", credits: 3, description: "Healthcare systems, health promotion, and professional roles in health." },
  { code: "HSCI 2301", name: "Human Anatomy & Physiology I", credits: 4, description: "Structure and function of the human body, including lab component." },
  { code: "HSCI 2302", name: "Human Anatomy & Physiology II", credits: 4, description: "Continuation of A&P I with cardiovascular, respiratory, and nervous systems." },
  { code: "HSCI 3300", name: "Nutrition & Dietetics", credits: 3, description: "Nutrient metabolism, dietary guidelines, and therapeutic nutrition." },
  { code: "HSCI 3400", name: "Health Informatics", credits: 3, description: "Electronic health records, health data standards, and clinical decision support." },
  { code: "HSCI 4100", name: "Public Health Epidemiology", credits: 3, description: "Disease patterns, biostatistics, outbreak investigation, and prevention strategies." },
];

const sciCourses: Course[] = [
  { code: "PHYS 1401", name: "General Physics I", credits: 4, description: "Mechanics, thermodynamics, and waves with laboratory." },
  { code: "PHYS 1402", name: "General Physics II", credits: 4, description: "Electromagnetism, optics, and modern physics with laboratory." },
  { code: "CHEM 1401", name: "General Chemistry I", credits: 4, description: "Atomic structure, bonding, stoichiometry, and chemical reactions." },
  { code: "CHEM 1402", name: "General Chemistry II", credits: 4, description: "Kinetics, equilibrium, thermodynamics, and electrochemistry." },
  { code: "MATH 2413", name: "Calculus I", credits: 4, description: "Limits, derivatives, integrals, and the Fundamental Theorem of Calculus." },
  { code: "MATH 2414", name: "Calculus II", credits: 4, description: "Integration techniques, series, parametric equations, and polar coordinates." },
];

const eduCourses: Course[] = [
  { code: "EDUC 1301", name: "Introduction to Teaching", credits: 3, description: "Historical, social, and philosophical foundations of education." },
  { code: "EDUC 2301", name: "Educational Psychology", credits: 3, description: "Learning theories, cognitive development, and classroom motivation." },
  { code: "EDUC 3300", name: "Curriculum & Instruction", credits: 3, description: "Lesson planning, assessment design, and differentiated instruction." },
  { code: "EDUC 3400", name: "Child & Adolescent Development", credits: 3, description: "Physical, cognitive, and social-emotional development from childhood through adolescence." },
  { code: "EDUC 4200", name: "Classroom Management", credits: 3, description: "Behavior management strategies, restorative practices, and positive learning environments." },
  { code: "EDUC 4600", name: "Student Teaching Internship", credits: 6, description: "Full-semester supervised teaching in a K-12 classroom setting." },
];

const agCourses: Course[] = [
  { code: "AGRI 1301", name: "Introduction to Agriculture", credits: 3, description: "Overview of agricultural systems, food production, and sustainability." },
  { code: "AGRI 2301", name: "Soil Science", credits: 3, description: "Soil formation, classification, fertility, and conservation practices." },
  { code: "AGRI 3300", name: "Animal Science", credits: 3, description: "Animal nutrition, reproduction, genetics, and livestock management." },
  { code: "AGRI 3400", name: "Crop Production", credits: 3, description: "Plant science, pest management, irrigation, and sustainable farming." },
  { code: "AGRI 3500", name: "Agricultural Economics", credits: 3, description: "Farm management, commodity markets, and agricultural policy." },
  { code: "AGRI 4300", name: "Agribusiness Management", credits: 3, description: "Supply chain management, food marketing, and agribusiness strategy." },
];

const cjCourses: Course[] = [
  { code: "CRIJ 1301", name: "Introduction to Criminal Justice", credits: 3, description: "Overview of the criminal justice system: police, courts, and corrections." },
  { code: "CRIJ 2301", name: "Criminology", credits: 3, description: "Theories of crime causation, criminal behavior patterns, and crime data analysis." },
  { code: "CRIJ 3300", name: "Constitutional Law", credits: 3, description: "Fourth, Fifth, Sixth, and Eighth Amendment issues in criminal procedure." },
  { code: "CRIJ 3400", name: "Forensic Science", credits: 3, description: "Crime scene investigation, evidence collection, and laboratory analysis." },
  { code: "CRIJ 3500", name: "Corrections", credits: 3, description: "Penal system, rehabilitation, parole, and prison reform movements." },
  { code: "CRIJ 4300", name: "Juvenile Justice", credits: 3, description: "Juvenile law, delinquency prevention, and the juvenile court system." },
];

const musicCourses: Course[] = [
  { code: "MUSI 1301", name: "Music Theory I", credits: 3, description: "Harmony, counterpoint, voice leading, and tonal analysis." },
  { code: "MUSI 1302", name: "Music Theory II", credits: 3, description: "Advanced harmony, chromaticism, and 20th-century techniques." },
  { code: "MUSI 2301", name: "Music History: Medieval to Baroque", credits: 3, description: "Western music from antiquity through the Baroque era." },
  { code: "MUSI 2302", name: "Music History: Classical to Modern", credits: 3, description: "Western music from the Classical period to the present." },
  { code: "MUSI 3400", name: "Ensemble Performance", credits: 1, description: "Participation in a performing ensemble with weekly rehearsals." },
  { code: "MUSI 4200", name: "Conducting", credits: 3, description: "Fundamentals of baton technique, score reading, and rehearsal leadership." },
];

const artCourses: Course[] = [
  { code: "ART 1301", name: "Drawing Foundations", credits: 3, description: "Observational drawing, perspective, composition, and mixed media." },
  { code: "ART 2301", name: "Art History Survey I", credits: 3, description: "Ancient through Medieval art and architecture." },
  { code: "ART 2302", name: "Art History Survey II", credits: 3, description: "Renaissance through Contemporary art and architecture." },
  { code: "ART 3300", name: "Painting", credits: 3, description: "Oil and acrylic techniques, color theory, and expressive painting." },
  { code: "ART 3400", name: "Sculpture", credits: 3, description: "Three-dimensional design, materials, and fabrication techniques." },
  { code: "ART 4500", name: "Senior Studio", credits: 3, description: "Capstone portfolio development and exhibition preparation." },
];

const lawCourses: Course[] = [
  { code: "LAW 1301", name: "Introduction to Legal Studies", credits: 3, description: "Legal reasoning, court systems, and the American legal tradition." },
  { code: "LAW 2301", name: "Constitutional Law", credits: 3, description: "Supreme Court jurisprudence, federalism, separation of powers, and individual rights." },
  { code: "LAW 3300", name: "Criminal Law", credits: 3, description: "Elements of crimes, defenses, and criminal procedure fundamentals." },
  { code: "LAW 3400", name: "Torts", credits: 3, description: "Negligence, strict liability, intentional torts, and damages." },
  { code: "LAW 3500", name: "Contracts", credits: 3, description: "Offer, acceptance, consideration, breach, and remedies." },
  { code: "LAW 4200", name: "Legal Writing & Research", credits: 3, description: "Case briefing, legal citation, memo writing, and oral argument." },
];

const theoCourses: Course[] = [
  { code: "THEO 1301", name: "Introduction to Theology", credits: 3, description: "Revelation, faith, scripture, and the nature of God across traditions." },
  { code: "THEO 2301", name: "Old Testament Studies", credits: 3, description: "Historical-critical and literary analysis of the Hebrew Bible." },
  { code: "THEO 2302", name: "New Testament Studies", credits: 3, description: "Gospels, Pauline literature, and the formation of the Christian canon." },
  { code: "THEO 3300", name: "Christian Ethics", credits: 3, description: "Moral theology, virtue ethics, and contemporary moral issues." },
  { code: "THEO 3400", name: "World Religions", credits: 3, description: "Comparative study of Judaism, Islam, Hinduism, Buddhism, and Christianity." },
  { code: "THEO 4500", name: "Theology Capstone", credits: 3, description: "Senior seminar integrating theological knowledge through a research project." },
];

const archCourses: Course[] = [
  { code: "ARCH 1301", name: "Architectural Design I", credits: 4, description: "Fundamentals of design, spatial reasoning, and visual communication." },
  { code: "ARCH 2301", name: "Architectural History I", credits: 3, description: "Ancient, classical, and medieval architecture and urbanism." },
  { code: "ARCH 2302", name: "Architectural History II", credits: 3, description: "Renaissance through modern architecture and urban design." },
  { code: "ARCH 3300", name: "Structures", credits: 3, description: "Structural systems, material mechanics, and building technology." },
  { code: "ARCH 3400", name: "Environmental Systems", credits: 3, description: "Building physics, lighting, acoustics, HVAC, and sustainable design." },
  { code: "ARCH 4500", name: "Design Studio V", credits: 6, description: "Advanced comprehensive design project integrating all architectural systems." },
];

const pharmCourses: Course[] = [
  { code: "PHAR 1301", name: "Pharmacy Fundamentals", credits: 3, description: "Pharmacy practice, professional ethics, and healthcare systems." },
  { code: "PHAR 2301", name: "Pharmacology I", credits: 3, description: "Drug classification, mechanisms of action, and therapeutic applications." },
  { code: "PHAR 2302", name: "Pharmacology II", credits: 3, description: "Advanced pharmacotherapeutics and disease-state management." },
  { code: "PHAR 3300", name: "Pharmaceutical Chemistry", credits: 3, description: "Drug design, synthesis, structure-activity relationships, and analysis." },
  { code: "PHAR 3400", name: "Pharmacy Law & Ethics", credits: 3, description: "Regulatory framework, controlled substances, and professional responsibility." },
  { code: "PHAR 4500", name: "Clinical Rotations", credits: 6, description: "Supervised clinical experience in hospital and community pharmacy settings." },
];

const socialWorkCourses: Course[] = [
  { code: "SWK 1301", name: "Introduction to Social Work", credits: 3, description: "Social welfare history, professional values, and fields of practice." },
  { code: "SWK 2301", name: "Human Behavior & Social Environment", credits: 3, description: "Ecological systems theory, lifespan development, and diversity." },
  { code: "SWK 3300", name: "Social Welfare Policy", credits: 3, description: "Policy analysis, advocacy, and the impact of social policy on clients." },
  { code: "SWK 3400", name: "Research Methods for Social Work", credits: 3, description: "Evidence-based practice, program evaluation, and data analysis." },
  { code: "SWK 3500", name: "Clinical Practice I", credits: 3, description: "Interviewing, assessment, and intervention with individuals and families." },
  { code: "SWK 4600", name: "Field Internship", credits: 6, description: "Supervised field experience in a social service agency." },
];

// ─── Program Catalog ──────────────────────────────────────────────

interface ProgramCatalogInfo {
  degreeTypes: string[];
  commonCourses: Course[];
  description: string;
  typicalCredits: number;
}

const programCatalog: Record<string, ProgramCatalogInfo> = {
  "Computer Science": {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: csCourses,
    description: "Study of computation, algorithms, programming, and systems design.",
    typicalCredits: 120,
  },
  Engineering: {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Science in Engineering (BSE)"],
    commonCourses: engCourses,
    description: "Application of scientific and mathematical principles to design and build structures, machines, and systems.",
    typicalCredits: 128,
  },
  Business: {
    degreeTypes: ["Bachelor of Business Administration (BBA)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: busCourses,
    description: "Study of management, finance, marketing, and organizational leadership.",
    typicalCredits: 120,
  },
  Communication: {
    degreeTypes: ["Bachelor of Arts (BA)", "Bachelor of Science (BS)", "Minor"],
    commonCourses: commCourses,
    description: "Study of how information is created, transmitted, and interpreted across media and contexts.",
    typicalCredits: 120,
  },
  "Liberal Arts": {
    degreeTypes: ["Bachelor of Arts (BA)", "Bachelor of Science (BS)", "Minor"],
    commonCourses: laCourses,
    description: "Broad-based education in humanities, social sciences, and natural sciences.",
    typicalCredits: 120,
  },
  Biology: {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: bioCourses,
    description: "Study of living organisms from molecular mechanisms to ecosystem interactions.",
    typicalCredits: 120,
  },
  "Science & Research": {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Arts (BA)"],
    commonCourses: sciCourses,
    description: "Interdisciplinary scientific inquiry with emphasis on research methodology and laboratory work.",
    typicalCredits: 120,
  },
  "Health & Nursing": {
    degreeTypes: ["Bachelor of Science in Nursing (BSN)", "Bachelor of Science (BS)", "Minor"],
    commonCourses: healthCourses,
    description: "Preparation for careers in healthcare, nursing, and health sciences.",
    typicalCredits: 120,
  },
  Education: {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Arts (BA)", "Bachelor of Education (BEd)"],
    commonCourses: eduCourses,
    description: "Preparation for teaching careers with classroom experience and pedagogical training.",
    typicalCredits: 120,
  },
  Agriculture: {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Science in Agriculture (BSAg)"],
    commonCourses: agCourses,
    description: "Study of agricultural production, natural resources, and food systems.",
    typicalCredits: 120,
  },
  "Criminal Justice": {
    degreeTypes: ["Bachelor of Science (BS)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: cjCourses,
    description: "Study of the justice system, law enforcement, courts, corrections, and criminology.",
    typicalCredits: 120,
  },
  Music: {
    degreeTypes: ["Bachelor of Music (BM)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: musicCourses,
    description: "Study of music theory, history, performance, and composition.",
    typicalCredits: 120,
  },
  Arts: {
    degreeTypes: ["Bachelor of Fine Arts (BFA)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: artCourses,
    description: "Studio practice, art history, and visual culture studies.",
    typicalCredits: 120,
  },
  Law: {
    degreeTypes: ["Bachelor of Arts (BA)", "Bachelor of Science (BS)", "Minor"],
    commonCourses: lawCourses,
    description: "Pre-law education covering legal reasoning, constitutional law, and legal writing.",
    typicalCredits: 120,
  },
  Theology: {
    degreeTypes: ["Bachelor of Arts (BA)", "Bachelor of Theology (BTh)", "Minor"],
    commonCourses: theoCourses,
    description: "Study of religious traditions, scripture, ethics, and philosophical theology.",
    typicalCredits: 120,
  },
  Architecture: {
    degreeTypes: ["Bachelor of Architecture (BArch)", "Bachelor of Science (BS)"],
    commonCourses: archCourses,
    description: "Design of buildings and environments integrating aesthetics, structure, and sustainability.",
    typicalCredits: 150,
  },
  Pharmacy: {
    degreeTypes: ["Doctor of Pharmacy (PharmD)", "Bachelor of Science (BS)"],
    commonCourses: pharmCourses,
    description: "Study of drug therapy, pharmaceutical chemistry, and patient care.",
    typicalCredits: 0,
  },
  "Social Work": {
    degreeTypes: ["Bachelor of Social Work (BSW)", "Bachelor of Arts (BA)", "Minor"],
    commonCourses: socialWorkCourses,
    description: "Preparation for professional social work practice with individuals, families, and communities.",
    typicalCredits: 120,
  },
};

// ─── College-Specific Program Descriptions ────────────────────────

const programDescriptions: Record<string, string> = {
  "ut-austin_Computer Science": "UT Austin's computer science program is nationally ranked, with strengths in AI, systems, and theory. Students have access to the Texas Advanced Computing Center and strong industry connections in Austin's tech hub.",
  "ut-austin_Engineering": "The Cockrell School of Engineering is one of the top engineering schools in the nation, offering rigorous programs across all major engineering disciplines with extensive research opportunities.",
  "ut-austin_Business": "McCombs School of Business is a top-tier business school with strong programs in finance, marketing, management, and accounting, supported by a vast alumni network.",
  "rice_Computer Science": "Rice's computer science program emphasizes small class sizes and undergraduate research. The department is known for strengths in computational science, AI/ML, and robotics.",
  "rice_Engineering": "Rice Engineering offers a collaborative, project-based curriculum with strong programs in bioengineering, civil, mechanical, and electrical engineering.",
  "rice_Business": "Rice's Jones Graduate School of Business (undergraduate business minor) provides foundational business education with emphasis on entrepreneurship and leadership.",
  "texas-am_Engineering": "Texas A&M Engineering is one of the largest and most respected engineering programs in the country, with 15+ majors and unmatched facilities.",
  "texas-am_Agriculture": "As a land-grant institution, Texas A&M offers premier agricultural sciences programs with extensive research farms, labs, and industry partnerships.",
  "texas-am_Business": "Mays Business School offers highly ranked undergraduate programs in accounting, finance, management, and marketing with strong corporate recruiting.",
  "smu_Business": "SMU's Cox School of Business offers a highly regarded BBA with concentrations in finance, accounting, marketing, and strategy, benefiting from Dallas's corporate hub.",
  "baylor_Business": "Baylor's Hankamer School of Business combines rigorous academics with a Christian mission, offering strong programs in entrepreneurship, accounting, and healthcare administration.",
};

// ─── Department Name Generation ───────────────────────────────────

const departmentNames: Record<string, string> = {
  "Computer Science": "Department of Computer Science",
  Engineering: "College of Engineering",
  Business: "School of Business",
  Communication: "Department of Communication",
  "Liberal Arts": "College of Liberal Arts",
  Biology: "Department of Biology",
  "Science & Research": "College of Sciences",
  "Health & Nursing": "School of Health Sciences",
  Education: "College of Education",
  Agriculture: "College of Agriculture",
  "Criminal Justice": "Department of Criminal Justice",
  Music: "School of Music",
  Arts: "Department of Art",
  Law: "School of Law",
  Theology: "Department of Theology",
  Architecture: "School of Architecture",
  Pharmacy: "School of Pharmacy",
  "Social Work": "School of Social Work",
};

// ─── College Academic Catalog URLs ──────────────────────────────
//
// Maps each college ID to its official academic catalog / course bulletin URL.
// Confirmed via live web search where noted; others are best-effort based on
// the college's catalog system (Acalog / SmartCatalogIQ / custom portal).

const collegeCatalogUrl: Record<string, string> = {
  // ── Public Universities (confirmed via web search) ──────────────
  "ut-austin":        "https://catalog.utexas.edu/",
  "texas-am":         "https://catalog.tamu.edu/",
  "unt":              "https://catalog.unt.edu/",
  "texas-state":      "https://mycatalog.txstate.edu/",
  "texas-tech":       "https://catalog.ttu.edu/",
  "ut-dallas":        "https://catalog.utdallas.edu/",
  "ut-arlington":     "https://catalog.uta.edu/",
  "utsa":             "https://catalog.utsa.edu/",
  "utep":             "https://catalog.utep.edu/",
  "uh-main":          "https://www.uh.edu/catalogs/",
  "tamucc":           "https://catalog.tamucc.edu/",
  "tamuk":            "https://catalog.tamuk.edu/",
  "tamu-commerce":    "https://coursecatalog.tamuc.edu/",
  "tamiu":            "https://catalog.tamiu.edu/",
  "shsu":             "https://catalog.shsu.edu/",
  "sfasu":            "https://www.sfasu.edu/academics/catalogs",
  "sul-ross":         "https://catalog.sulross.edu/",
  "wtamu":            "https://catalog.wtamu.edu/",
  "lamar":            "https://catalog.lamar.edu/",
  "tarleton":         "https://catalog.tarleton.edu/",
  "utrgv":            "https://catalog.utrgv.edu/",
  "ut-tyler":         "https://catalog.uttyler.edu/",
  "utpb":             "https://catalog.utpb.edu/",
  "tamut":            "https://catalog.tamut.edu/",
  "angelo-state":     "https://catalog.angelo.edu/",
  "mwsu":             "https://catalog.mwsu.edu/",
  "pvamu":            "https://catalog.pvamu.edu/",

  // ── Private Universities (confirmed via web search) ─────────────
  "rice":             "https://ga.rice.edu/",
  "smu":              "https://catalog.smu.edu/",
  "baylor":           "https://catalog.baylor.edu/",
  "tcu":              "https://catalog.tcu.edu/",
  "acu":              "https://catalog.acu.edu/",
  "dbu":              "https://catalog.dbu.edu/",
  "schreiner":        "https://catalog.schreiner.edu/",

  // ── Private Universities (best-effort URLs) ─────────────────────
  "trinity-u":               "https://catalog.trinity.edu/",
  "southwestern-u":          "https://www.southwestern.edu/academics/catalog/",
  "austin-college":          "https://www.austincollege.edu/academics/catalog/",
  "st-edwards":              "https://www.stedwards.edu/academics/academic-catalogs",
  "st-marys":                "https://www.stmarytx.edu/academics/catalog/",
  "udallas":                 "https://udallas.edu/academics/catalog/",
  "hcu":                     "https://www.hc.edu/academics/catalog/",
  "uiw":                     "https://www.uiw.edu/academics/catalog/",
  "ollu":                    "https://www.ollusa.edu/academics/catalog/",
  "sag-u":                   "https://www.sagu.edu/academics/catalog",
  "tx-lutheran":             "https://www.tlu.edu/academics/catalog",
  "tx-wesleyan":             "https://txwes.edu/academics/catalog/",
  "wayland":                 "https://www.wbu.edu/academics/catalog/",
  "wiley":                   "https://www.wileycollege.edu/academics/",
  "paul-quinn":              "https://www.pqc.edu/academics/",
  "jarvis-christian":        "https://www.jarvis.edu/academics/",
  "letourneau":              "https://www.letu.edu/academics/catalog/",
  "concordia-texas":         "https://www.concordia.edu/academics/catalog/",
  "huston-tillotson":        "https://www.htu.edu/academics/catalog/",
  "hardin-simmons":          "https://www.hsutx.edu/academics/catalog/",
  "mcmurry":                 "https://www.mcm.edu/academics/catalog/",
  "southwestern-assemblies": "https://www.sagu.edu/academics/catalog",
  "southwest-adventist":     "https://www.swau.edu/academics/catalog/",
  "hill-college":            "https://www.hillcollege.edu/academics/",
};

/**
 * Returns the best-known academic catalog URL for a given college ID.
 * Falls back to the college's main website if no dedicated catalog URL exists.
 */
export function getCollegeSourceUrl(college: { id: string; website?: string }): string {
  return collegeCatalogUrl[college.id] ?? college.website ?? "";
}

// ─── Public API ───────────────────────────────────────────────────

function getKey(collegeId: string, program: string): string {
  return `${collegeId}_${program}`;
}

export function getDegreesForCollege(college: College): DegreeOffering[] {
  return college.programs.map((program) => {
    const catalog = programCatalog[program];
    const key = getKey(college.id, program);
    const customDescription = programDescriptions[key];
    const dept = departmentNames[program] ?? `Department of ${program}`;

    return {
      program,
      degreeType: catalog?.degreeTypes[0] ?? "Bachelor of Arts (BA)",
      department: dept,
      description:
        customDescription ??
        `${college.name} offers a ${(catalog?.degreeTypes[0] ?? "Bachelor's").toLowerCase()} in ${program} through the ${dept}.`,
      sampleCourses: catalog?.commonCourses.slice(0, 5) ?? [],
      totalCredits: catalog?.typicalCredits ?? 120,
    };
  });
}

export function getProgramCatalog(): Record<string, ProgramCatalogInfo> {
  return programCatalog;
}

export function getCourseList(program: string): Course[] {
  return programCatalog[program.toLowerCase()]?.commonCourses ?? [];
}

export function getAllPrograms(): string[] {
  return Object.keys(programCatalog).sort();
}

// ─── Semester Plans ───────────────────────────────────────────────

const csSemesters: Semester[] = [
  { name: "Fall Year 1", courses: [
    { code: "CS 1420", name: "Introduction to Computer Science", credits: 3 },
    { code: "MATH 2413", name: "Calculus I", credits: 4 },
    { code: "ENGL 1301", name: "English Composition", credits: 3 },
    { code: "HIST 1301", name: "U.S. History to 1877", credits: 3 },
    { code: "XXX 1000", name: "General Elective", credits: 3 },
  ]},
  { name: "Spring Year 1", courses: [
    { code: "CS 2420", name: "Data Structures & Algorithms", credits: 4 },
    { code: "MATH 2414", name: "Calculus II", credits: 4 },
    { code: "ENGL 2301", name: "British Literature Survey", credits: 3 },
    { code: "PHYS 1401", name: "General Physics I", credits: 4 },
  ]},
  { name: "Fall Year 2", courses: [
    { code: "CS 3100", name: "Computer Architecture", credits: 3 },
    { code: "MATH 2200", name: "Discrete Mathematics", credits: 3 },
    { code: "PHYS 1402", name: "General Physics II", credits: 4 },
    { code: "POLS 2301", name: "American Government", credits: 3 },
    { code: "XXX 2000", name: "General Elective", credits: 3 },
  ]},
  { name: "Spring Year 2", courses: [
    { code: "CS 3300", name: "Operating Systems", credits: 3 },
    { code: "CS 3200", name: "Database Systems", credits: 3 },
    { code: "STAT 3300", name: "Probability & Statistics", credits: 3 },
    { code: "SOC 1301", name: "Introduction to Sociology", credits: 3 },
    { code: "XXX 2000", name: "General Elective", credits: 3 },
  ]},
  { name: "Fall Year 3", courses: [
    { code: "CS 3500", name: "Software Engineering", credits: 3 },
    { code: "CS 3400", name: "Computer Networks", credits: 3 },
    { code: "MATH 3300", name: "Linear Algebra", credits: 3 },
    { code: "PHIL 1301", name: "Introduction to Philosophy", credits: 3 },
    { code: "XXX 3000", name: "Program Elective", credits: 3 },
  ]},
  { name: "Spring Year 3", courses: [
    { code: "CS 3700", name: "Artificial Intelligence", credits: 3 },
    { code: "CS 3600", name: "Programming Languages", credits: 3 },
    { code: "CS 3000", name: "Technical Writing for CS", credits: 3 },
    { code: "XXX 3000", name: "Program Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Fall Year 4", courses: [
    { code: "CS 4300", name: "Machine Learning", credits: 3 },
    { code: "CS 4100", name: "Human-Computer Interaction", credits: 3 },
    { code: "XXX 4000", name: "CS Elective", credits: 3 },
    { code: "XXX 4000", name: "CS Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Spring Year 4", courses: [
    { code: "CS 4500", name: "Senior Capstone Project", credits: 4 },
    { code: "XXX 4000", name: "CS Elective", credits: 3 },
    { code: "XXX 4000", name: "Free Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
];

const engSemesters: Semester[] = [
  { name: "Fall Year 1", courses: [
    { code: "ENGR 1201", name: "Engineering Fundamentals", credits: 3 },
    { code: "MATH 2413", name: "Calculus I", credits: 4 },
    { code: "ENGL 1301", name: "English Composition", credits: 3 },
    { code: "CHEM 1401", name: "General Chemistry I", credits: 4 },
  ]},
  { name: "Spring Year 1", courses: [
    { code: "ENGR 2301", name: "Statics", credits: 3 },
    { code: "MATH 2414", name: "Calculus II", credits: 4 },
    { code: "PHYS 1401", name: "General Physics I", credits: 4 },
    { code: "HIST 1301", name: "U.S. History to 1877", credits: 3 },
  ]},
  { name: "Fall Year 2", courses: [
    { code: "ENGR 2401", name: "Thermodynamics", credits: 3 },
    { code: "MATH 2415", name: "Calculus III", credits: 4 },
    { code: "PHYS 1402", name: "General Physics II", credits: 4 },
    { code: "POLS 2301", name: "American Government", credits: 3 },
  ]},
  { name: "Spring Year 2", courses: [
    { code: "ENGR 3300", name: "Fluid Mechanics", credits: 3 },
    { code: "MATH 3300", name: "Linear Algebra", credits: 3 },
    { code: "ENGR 2000", name: "Materials Science", credits: 3 },
    { code: "ENGL 2301", name: "Technical Communication", credits: 3 },
    { code: "XXX 2000", name: "General Elective", credits: 3 },
  ]},
  { name: "Fall Year 3", courses: [
    { code: "ENGR 3400", name: "Engineering Economics", credits: 3 },
    { code: "ENGR 3500", name: "Mechanics of Materials", credits: 3 },
    { code: "ENGR 3600", name: "Electrical Circuits", credits: 3 },
    { code: "STAT 3300", name: "Probability & Statistics", credits: 3 },
    { code: "XXX 3000", name: "Program Elective", credits: 3 },
  ]},
  { name: "Spring Year 3", courses: [
    { code: "ENGR 3700", name: "Heat Transfer", credits: 3 },
    { code: "ENGR 3800", name: "System Dynamics", credits: 3 },
    { code: "ENGR 3000", name: "Engineering Ethics", credits: 3 },
    { code: "SOC 1301", name: "Introduction to Sociology", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Fall Year 4", courses: [
    { code: "ENGR 4100", name: "Senior Design I", credits: 3 },
    { code: "XXX 4000", name: "Engineering Elective", credits: 3 },
    { code: "XXX 4000", name: "Engineering Elective", credits: 3 },
    { code: "PHIL 1301", name: "Introduction to Philosophy", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Spring Year 4", courses: [
    { code: "ENGR 4600", name: "Capstone Design", credits: 4 },
    { code: "XXX 4000", name: "Engineering Elective", credits: 3 },
    { code: "XXX 4000", name: "Free Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
];

const busSemesters: Semester[] = [
  { name: "Fall Year 1", courses: [
    { code: "BUS 1101", name: "Principles of Management", credits: 3 },
    { code: "ECON 2301", name: "Principles of Macroeconomics", credits: 3 },
    { code: "MATH 2413", name: "Calculus I", credits: 4 },
    { code: "ENGL 1301", name: "English Composition", credits: 3 },
    { code: "HIST 1301", name: "U.S. History to 1877", credits: 3 },
  ]},
  { name: "Spring Year 1", courses: [
    { code: "BUS 2101", name: "Financial Accounting", credits: 3 },
    { code: "ECON 2302", name: "Principles of Microeconomics", credits: 3 },
    { code: "MATH 2414", name: "Calculus II", credits: 4 },
    { code: "ENGL 2301", name: "British Literature Survey", credits: 3 },
  ]},
  { name: "Fall Year 2", courses: [
    { code: "BUS 2201", name: "Marketing Principles", credits: 3 },
    { code: "BUS 2301", name: "Managerial Accounting", credits: 3 },
    { code: "STAT 3300", name: "Business Statistics", credits: 3 },
    { code: "POLS 2301", name: "American Government", credits: 3 },
    { code: "XXX 2000", name: "General Elective", credits: 3 },
  ]},
  { name: "Spring Year 2", courses: [
    { code: "BUS 3101", name: "Corporate Finance", credits: 3 },
    { code: "BUS 2401", name: "Business Law", credits: 3 },
    { code: "BUS 2501", name: "Organizational Behavior", credits: 3 },
    { code: "PHYS 1401", name: "General Physics I", credits: 4 },
  ]},
  { name: "Fall Year 3", courses: [
    { code: "BUS 3301", name: "Business Ethics", credits: 3 },
    { code: "BUS 3201", name: "Operations Management", credits: 3 },
    { code: "XXX 3000", name: "Business Elective", credits: 3 },
    { code: "SOC 1301", name: "Introduction to Sociology", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Spring Year 3", courses: [
    { code: "BUS 3501", name: "International Business", credits: 3 },
    { code: "BUS 3401", name: "Supply Chain Management", credits: 3 },
    { code: "XXX 3000", name: "Business Elective", credits: 3 },
    { code: "PHIL 1301", name: "Introduction to Philosophy", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Fall Year 4", courses: [
    { code: "BUS 4401", name: "Strategic Management", credits: 3 },
    { code: "XXX 4000", name: "Business Elective", credits: 3 },
    { code: "XXX 4000", name: "Business Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Spring Year 4", courses: [
    { code: "BUS 4601", name: "Business Capstone", credits: 3 },
    { code: "XXX 4000", name: "Business Elective", credits: 3 },
    { code: "XXX 4000", name: "Free Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
];

const healthSemesters: Semester[] = [
  { name: "Fall Year 1", courses: [
    { code: "HSCI 1301", name: "Foundations of Health Science", credits: 3 },
    { code: "BIOL 1401", name: "General Biology I", credits: 4 },
    { code: "CHEM 1401", name: "General Chemistry I", credits: 4 },
    { code: "ENGL 1301", name: "English Composition", credits: 3 },
  ]},
  { name: "Spring Year 1", courses: [
    { code: "HSCI 2301", name: "Human Anatomy & Physiology I", credits: 4 },
    { code: "BIOL 1402", name: "General Biology II", credits: 4 },
    { code: "CHEM 1402", name: "General Chemistry II", credits: 4 },
    { code: "HIST 1301", name: "U.S. History to 1877", credits: 3 },
  ]},
  { name: "Fall Year 2", courses: [
    { code: "HSCI 2302", name: "Human Anatomy & Physiology II", credits: 4 },
    { code: "MATH 2413", name: "Calculus I", credits: 4 },
    { code: "PSYC 1301", name: "Introduction to Psychology", credits: 3 },
    { code: "POLS 2301", name: "American Government", credits: 3 },
  ]},
  { name: "Spring Year 2", courses: [
    { code: "HSCI 3300", name: "Nutrition & Dietetics", credits: 3 },
    { code: "HSCI 3400", name: "Health Informatics", credits: 3 },
    { code: "BIOL 2401", name: "Microbiology", credits: 3 },
    { code: "STAT 3300", name: "Statistics for Health Sciences", credits: 3 },
    { code: "ENGL 2301", name: "Technical Writing", credits: 3 },
  ]},
  { name: "Fall Year 3", courses: [
    { code: "HSCI 3500", name: "Pathophysiology", credits: 3 },
    { code: "HSCI 3600", name: "Pharmacology Fundamentals", credits: 3 },
    { code: "HSCI 3700", name: "Health Assessment", credits: 3 },
    { code: "SOC 1301", name: "Introduction to Sociology", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Spring Year 3", courses: [
    { code: "HSCI 4100", name: "Public Health Epidemiology", credits: 3 },
    { code: "HSCI 4200", name: "Healthcare Ethics", credits: 3 },
    { code: "HSCI 4300", name: "Clinical Skills Lab", credits: 3 },
    { code: "XXX 3000", name: "Health Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Fall Year 4", courses: [
    { code: "HSCI 4400", name: "Community Health", credits: 3 },
    { code: "HSCI 4500", name: "Health Policy & Management", credits: 3 },
    { code: "XXX 4000", name: "Health Elective", credits: 3 },
    { code: "PHIL 1301", name: "Introduction to Ethics", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
  { name: "Spring Year 4", courses: [
    { code: "HSCI 4600", name: "Clinical Internship", credits: 6 },
    { code: "XXX 4000", name: "Health Elective", credits: 3 },
    { code: "XXX 3000", name: "Free Elective", credits: 3 },
  ]},
];

const suggestedPlanCatalog: Record<string, Semester[]> = {
  "Computer Science": csSemesters,
  Engineering: engSemesters,
  Business: busSemesters,
  "Health & Nursing": healthSemesters,
};

export function getDegreePlan(
  college: College,
  program: string
): DegreePlan | null {
  const semesters = suggestedPlanCatalog[program];
  if (!semesters) return null;

  const totalCredits = semesters.reduce(
    (sum, sem) => sum + sem.courses.reduce((s, c) => s + c.credits, 0),
    0
  );

  return {
    id: `${college.id}-${program.toLowerCase().replace(/\s+/g, "-")}-plan`,
    collegeId: college.id,
    collegeName: college.name,
    program,
    degree: programCatalog[program]?.degreeTypes[0] ?? "Bachelor's Degree",
    totalCredits,
    semesters,
  };
}
