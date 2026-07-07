// ─── College Enrichment Data ───────────────────────────────────
//
// Honors programs and scholarships sourced from official college
// websites and academic catalogs. Last verified: July 2026.
//
// Sources:
//   UT Austin   https://admissions.utexas.edu/explore/texas-honors/
//               https://www.texasexes.org/scholarships/forty-acres-scholars-program
//   Texas A&M   https://honors.tamu.edu/
//               https://aggie.tamu.edu/paying-for-college/apply-for-scholarships
//   Rice        https://ga.rice.edu/undergraduate-students/honors-distinctions/
//               https://financialaid.rice.edu/types-aid/merit-scholarships
//   Baylor      https://honors.baylor.edu/
//   SMU         https://www.smu.edu/provost/saes/academic-enrichment/honors-and-scholars-programs
//   TCU         https://honors.tcu.edu/
//               https://admissions.tcu.edu/afford/scholarship-aid/
//   UT Dallas   https://honors.utdallas.edu/
//   Texas Tech  https://www.depts.ttu.edu/honors/

import type { HonorsProgram, Scholarship } from "@/types";

// ─── Honors Programs ──────────────────────────────────────────

export const collegeHonors: Record<string, HonorsProgram[]> = {
  // ── UT Austin ──────────────────────────────────────────────
  "ut-austin": [
    {
      id: "ut-plan-ii",
      name: "Plan II Honors Program",
      collegeId: "ut-austin",
      description:
        "One of the top honors programs in the country. Plan II is a small, selective group of students exploring discussion-based courses across the arts and sciences. Students earn a major in Plan II and often pair it with another major both within and outside of Liberal Arts.",
      features: [
        "Interdisciplinary core curriculum spanning biology, literature, history, psychology, physics, economics, mathematics, and art",
        "Small, discussion-based seminar courses",
        "Honors thesis required for graduation",
        "Priority registration for courses",
        "Access to exclusive Plan II study abroad programs",
      ],
      eligibility: [
        "Open to incoming first-year students via separate application through UT's Texas Honors application",
        "Holistic review including essays, extracurriculars, and academic record",
      ],
      website:
        "https://liberalarts.utexas.edu/plan2/",
    },
    {
      id: "ut-deans-scholars",
      name: "Dean's Scholars Honors Program",
      collegeId: "ut-austin",
      description:
        "The oldest honors program in the College of Natural Sciences. Students earn a BS honors degree in majors offered by CNS, with smaller courses, a research-centered curriculum, and more elective hours than standard degree plans, ending with a thesis project.",
      features: [
        "Automatic admission to the Freshman Research Initiative",
        "Smaller honors-specific courses with tight-knit community",
        "More elective hours than standard degree plans for certificates, minors, or double majors",
        "Honors-specific academic advisor and faculty mentorship",
        "Honors thesis showcasing research project",
      ],
      eligibility: [
        "Open to incoming first-year and transfer students via Texas Honors application",
        "Demonstrated interest in scientific research",
      ],
      website:
        "https://www.deansscholars.org/",
    },
    {
      id: "ut-turing-scholars",
      name: "Turing Scholars Honors Program (Computer Science)",
      collegeId: "ut-austin",
      description:
        "A major-specific honors program within the College of Natural Sciences for Computer Science majors. The curriculum includes 10 honors courses starting with an intensive first-year advanced honors coursework sequence.",
      features: [
        "10 honors courses including an intensive first-year sequence",
        "Priority access to CS research opportunities",
        "Close mentorship from CS faculty",
        "Honors thesis in computer science",
      ],
      eligibility: [
        "Open to incoming first-year students admitted to CS major",
        "Separate application through UT's honors system",
      ],
      website:
        "https://www.cs.utexas.edu/turing-scholars-honors-program",
    },
  ],

  // ── Texas A&M ──────────────────────────────────────────────
  "texas-am": [
    {
      id: "tamu-honors-academy",
      name: "Honors Academy",
      collegeId: "texas-am",
      description:
        "The Honors Academy provides university-level support and recognition for high-achieving undergraduate students. Students accepted pursue either the Honors Fellows distinction or the Honors Academy Minor. The program focuses on the Aggie Core Values as a framework for understanding personal motivation and opportunities to impact the greater good.",
      features: [
        "Honors Fellows distinction or Honors Academy Minor track options",
        "Aggie Core Values seminar series",
        "Culminating experience (Undergraduate Research Scholars thesis, Performance/Service/Teacher Scholar Capstone)",
        "Honors Housing Community option in designated LLC",
        "Priority access to undergraduate research opportunities",
        "Support for nationally competitive fellowship applications",
      ],
      eligibility: [
        "Open to students in all majors",
        "Separate application required (available after August 1)",
        "Incoming freshmen in top 10% of HS class or National Merit/Recognition Scholars may register for honors courses",
        "Current students with cumulative GPR of 3.5+ eligible to apply",
      ],
      website: "https://honors.tamu.edu/",
    },
    {
      id: "tamu-honors-fellows",
      name: "Honors Fellows",
      collegeId: "texas-am",
      description:
        "The Honors Fellows distinction is a transcript designation for students who complete an advanced curriculum of honors coursework, undergraduate research, and leadership development. Fellows emerge with a portfolio of work demonstrating deep inquiry and creative achievement.",
      features: [
        "Transcript distinction for honors completion",
        "Interdisciplinary honors seminar courses",
        "Faculty-mentored research or creative project",
        "Leadership and professional development programming",
      ],
      eligibility: [
        "Admission to the Honors Academy",
        "Maintain good academic standing",
      ],
      website: "https://honors.tamu.edu/",
    },
  ],

  // ── Rice University ─────────────────────────────────────────
  rice: [
    {
      id: "rice-rusp",
      name: "Rice Undergraduate Scholars Program (RUSP)",
      collegeId: "rice",
      description:
        "The university-wide honors program for juniors and seniors in all disciplines who are considering graduate study and an academic career. Students engage in independent research under a faculty mentor and attend weekly seminars on pursuing careers in academia.",
      features: [
        "Two-semester for-credit program (HONS 470/471)",
        "Faculty-mentored independent research project",
        "Weekly seminars on research careers, graduate school applications, and fellowships",
        "Up to $1,000 funding for research materials or conference travel",
        "Peer cohort with shared intellectual community",
      ],
      eligibility: [
        "Open to juniors and seniors in all disciplines",
        "Application in spring each year",
        "Must have faculty sponsor for research project",
      ],
      website: "https://ouri.rice.edu/research-programs/rusp",
    },
    {
      id: "rice-dept-honors",
      name: "Departmental Honors Programs",
      collegeId: "rice",
      description:
        "Individual departments offer undergraduates the option of honors program enrollment. These programs enable students to receive advanced training and deepen understanding of a discipline through intensive, supervised independent research culminating in an honors thesis and oral examination.",
      features: [
        "Intensive independent research under faculty supervision",
        "Honors thesis evaluated by advisor and two readers",
        "Oral examination on thesis work",
        "Formal recognition for outstanding project work",
      ],
      eligibility: [
        "Varies by department; acceptance at discretion of faculty",
        "Students submit proposed project to department Undergraduate Committee",
      ],
      website:
        "https://ga.rice.edu/undergraduate-students/honors-distinctions/programs/",
    },
  ],

  // ── Baylor University ───────────────────────────────────────
  baylor: [
    {
      id: "baylor-honors-college",
      name: "Baylor Honors College",
      collegeId: "baylor",
      description:
        "Baylor's Honors College offers an enriched liberal arts education with small, discussion-based seminars, research opportunities, and a vibrant residential community. The Honors College awards over $1 million in scholarships each year.",
      features: [
        "Small, discussion-based honors seminars",
        "Honors Residential College (HRC) living-learning community",
        "Undergraduate research and thesis opportunities",
        "Study abroad programs",
        "Great Texts major option",
        "Bachelor of Philosophy degree track",
      ],
      eligibility: [
        "Separate application to the Honors College required",
        "Holistic review of academic record, essays, and recommendations",
      ],
      website: "https://honors.baylor.edu/",
    },
    {
      id: "baylor-getterman-scholars",
      name: "Getterman Scholars Program",
      collegeId: "baylor",
      description:
        "Baylor Honors College's premier scholarship and leadership program for exceptional students. Scholars receive a full-tuition scholarship, housing and meals in the Honors Residential College, and funding for study abroad and mission experiences.",
      features: [
        "Full-tuition scholarship (minus other merit scholarships received)",
        "Housing and meals in the Honors Residential College",
        "Book allowance and course-related fees for 8 semesters",
        "Support for one Honors College-led study abroad",
        "Support for one approved mission/service experience",
        "Up to $2,500 for a research-focused internship",
        "Leadership training and mentorship through Getterman Fellows community",
      ],
      eligibility: [
        "Invitation-only after competitive application process",
        "Getterman Scholars Day finalist weekend required",
        "Demonstrated academic excellence, leadership, and service orientation",
      ],
      website: "https://honors.baylor.edu/getterman",
    },
  ],

  // ── SMU ─────────────────────────────────────────────────────
  smu: [
    {
      id: "smu-uhp",
      name: "University Honors Program (UHP)",
      collegeId: "smu",
      description:
        "The UHP prepares undergraduate students of all majors by emphasizing a broad-based education in the humanities and sciences. Up to 250 first-year students are invited each year to participate in this rigorous program.",
      features: [
        "Interdisciplinary curriculum across humanities and sciences",
        "Honors seminars within the Common Curriculum",
        "Engaging discussion-based courses",
        "Honors community with faculty mentorship",
      ],
      eligibility: [
        "Open to qualified students of all majors",
        "No separate application; automatically reviewed upon admission to SMU",
        "Top ~10% of entering first-year class typically invited",
        "Continuing students with 3.5+ GPA may apply after first semester",
      ],
      website:
        "https://www.smu.edu/provost/saes/academic-enrichment/honors-and-scholars-programs/university-honors-program",
    },
    {
      id: "smu-dedman-scholars",
      name: "Dedman College Scholars Program",
      collegeId: "smu",
      description:
        "A merit-based scholarship program for students with a primary major in Dedman College of Humanities and Sciences. Scholars receive up to $15,000 per year and must maintain membership in the University Honors Program.",
      features: [
        "Up to $15,000 per year in merit-based scholarship",
        "Renewable for 4 years (8 consecutive semesters)",
        "Requires active UHP membership",
      ],
      eligibility: [
        "Must be admitted to SMU as a first-year student with primary major in Dedman College",
        "Must qualify for the University Honors Program",
        "Invitation to submit essay and interview",
        "Maintain 3.3 GPA and full-time enrollment",
      ],
      website:
        "https://www.smu.edu/dedman/prospective-students/undergraduate-students/dedmancollegescholarsprogram/about",
    },
  ],

  // ── TCU ─────────────────────────────────────────────────────
  tcu: [
    {
      id: "tcu-roach-honors",
      name: "John V. Roach Honors College",
      collegeId: "tcu",
      description:
        "The Roach Honors College engages students in high-impact practices including intercultural inquiry, discussion-based seminars, independent research, creative projects, and community-engaged learning. First-year honors students live together in Milton Daniel Hall.",
      features: [
        "Interdisciplinary lower-division and upper-division honors curriculum",
        "Milton Daniel Hall residential community for first-year honors students",
        "Departmental Honors research projects with faculty mentorship",
        "Honors study abroad programs",
        "Fogelson Honors Forum speaker series",
        "Honors in Action Day of Service",
        "Dedicated honors academic advisors",
      ],
      eligibility: [
        "Supplemental honors application required (with essay)",
        "Current/transfer students with 3.5+ GPA and 2+ semesters remaining may apply",
        "First-year honors students required to live in Milton Daniel Hall",
      ],
      website: "https://honors.tcu.edu/",
    },
  ],

  // ── UT Dallas ──────────────────────────────────────────────
  "ut-dallas": [
    {
      id: "utd-honors-college",
      name: "Hobson Wildenthal Honors College",
      collegeId: "ut-dallas",
      description:
        "The Hobson Wildenthal Honors College houses several programs dedicated to promoting excellence in undergraduate education, including the Collegium V honors program, Terry Scholars, National Merit Scholars, and the Model United Nations program.",
      features: [
        "Small, seminar-style honors courses",
        "Research opportunities with faculty mentors",
        "Priority registration for courses",
        "Honors housing options",
        "Career and graduate school preparation",
        "Study abroad scholarship opportunities",
      ],
      eligibility: [
        "Open to any enrolled undergraduate in good academic standing",
        "Separate application required",
        "Scholarships available for admitted students",
      ],
      website: "https://honors.utdallas.edu/",
    },
    {
      id: "utd-terry-scholars",
      name: "Terry Scholars at UT Dallas",
      collegeId: "ut-dallas",
      description:
        "The Terry Foundation awards full-cost-of-attendance scholarships to Texas students attending UT Dallas. Scholars receive comprehensive support including tuition, fees, housing, meals, textbooks, and $5,000 for study abroad.",
      features: [
        "Full cost of attendance for up to 8 semesters",
        "Includes tuition, fees, meal plan, housing, and textbooks",
        "$5,000 study abroad allowance",
        "Terry Scholar community and leadership development",
        "Mentorship and networking opportunities",
      ],
      eligibility: [
        "Texas residents",
        "Demonstrated leadership, academic achievement, and financial need",
        "Separate application and interview process",
      ],
      website: "https://honors.utdallas.edu/terry-scholars/",
    },
    {
      id: "utd-national-merit",
      name: "National Merit Scholars Program",
      collegeId: "ut-dallas",
      description:
        "National Merit Scholars at UT Dallas receive complete coverage of tuition and mandatory fees for up to eight semesters, along with research opportunities and exclusive programming.",
      features: [
        "Full tuition and mandatory fees for up to 8 semesters",
        "Research alongside leading faculty",
        "Exclusive honors seminars and activities",
        "Priority course registration",
      ],
      eligibility: [
        "National Merit Finalist status",
        "Named UT Dallas as first-choice institution with NMSC",
      ],
      website:
        "https://honors.utdallas.edu/national-merit-scholars-program/",
    },
  ],

  // ── Texas Tech ──────────────────────────────────────────────
  "texas-tech": [
    {
      id: "ttu-honors-college",
      name: "Honors College",
      collegeId: "texas-tech",
      description:
        "The Texas Tech Honors College is a nationally ranked program offering Honors pedagogy, research, and mentorship across 150+ majors. Students engage in the Undergraduate Research Scholars program, externships, social entrepreneurship, and more through the Honors House System.",
      features: [
        "150+ majors available with Honors designation",
        "Honors Sciences and Humanities major option",
        "Undergraduate Research Scholars program",
        "Externship and social entrepreneurship opportunities",
        "Research Away program",
        "Honors House System for community and mentorship",
        "First-Year Experience program",
        "Texas Leaders Scholars program",
        "Bayless and Alumni Mentoring programs",
      ],
      eligibility: [
        "Competitive holistic admission review",
        "Incoming first-year students apply alongside TTU application",
        "Transfer and current students (after 1 semester) also eligible",
        "Some programs by invitation only (Senarian Leaders, San Francisco Scholars)",
      ],
      website: "https://www.depts.ttu.edu/honors/",
    },
  ],

  // ── UNT ─────────────────────────────────────────────────────
  unt: [
    {
      id: "unt-honors-college",
      name: "Honors College",
      collegeId: "unt",
      description:
        "UNT's Honors College provides a challenging, interdisciplinary curriculum with small classes, close faculty mentorship, and research opportunities for high-achieving students across all majors.",
      features: [
        "Interdisciplinary honors curriculum",
        "Small, discussion-based seminar courses",
        "Faculty-mentored research and creative projects",
        "Honors thesis/capstone option",
        "Priority registration",
        "Honors housing available",
      ],
      eligibility: [
        "Separate application to the Honors College",
        "Competitive academic record",
        "Holistic review including essays and recommendations",
      ],
      website: "https://honors.unt.edu/",
    },
  ],

  // ── Texas State ─────────────────────────────────────────────
  "texas-state": [
    {
      id: "txstate-honors-college",
      name: "Honors College",
      collegeId: "texas-state",
      description:
        "The Texas State Honors College offers motivated students an enriched educational experience through interdisciplinary seminars, undergraduate research, and a supportive community of scholars.",
      features: [
        "Interdisciplinary honors seminar courses",
        "Undergraduate research opportunities",
        "Honors thesis program",
        "Study abroad grants",
        "Honors housing in dedicated LLC",
        "Priority registration",
      ],
      eligibility: [
        "Separate application with essay",
        "Competitive GPA and class rank",
        "Transfer and current students with strong academic record may apply",
      ],
      website: "https://www.honors.txstate.edu/",
    },
  ],
};

// ─── Scholarships ────────────────────────────────────────────

export const collegeScholarships: Record<string, Scholarship[]> = {
  // ── UT Austin ──────────────────────────────────────────────
  "ut-austin": [
    {
      id: "ut-forty-acres",
      name: "Forty Acres Scholars Program",
      type: "merit",
      provider: "Texas Exes Alumni Association",
      description:
        "The premier full-ride, merit-based scholarship for UT Austin. Inspires and nurtures visionary leaders with outstanding academic, leadership, and community service achievement. Includes full tuition, fees, housing, enrichment funding, and a global experience stipend.",
      amount: 0, // Full ride — exact amounts vary
      eligibility: [
        "U.S. citizen or permanent resident",
        "Apply to UT Austin via Common App or ApplyTexas by December 1",
        "In-state and out-of-state students eligible",
        "Transfer and international students not eligible",
      ],
      deadline: "December 1",
      website: "https://www.texasexes.org/scholarships/forty-acres-scholars-program",
      essayRequired: false, // Considered automatically from admission application
      renewable: true,
      national: true,
      collegeId: "ut-austin",
    },
    {
      id: "ut-texas-exes",
      name: "Texas Exes Scholarships",
      type: "merit",
      provider: "Texas Exes Alumni Association",
      description:
        "Various merit-based scholarships awarded by the Texas Exes Alumni Association to UT Austin students, including regional scholarship programs and endowed awards.",
      amount: 0, // varies by scholarship
      eligibility: [
        "UT Austin admitted or current student",
        "Various criteria by specific scholarship",
      ],
      deadline: "Varies",
      website: "https://www.texasexes.org/scholarships",
      essayRequired: false,
      renewable: false,
      national: true,
      collegeId: "ut-austin",
    },
    {
      id: "ut-institutional",
      name: "UT Austin Institutional Scholarships",
      type: "merit",
      provider: "UT Austin Office of Scholarships and Financial Aid",
      description:
        "Every admitted freshman is automatically considered for university-wide general scholarships as well as college and school-specific awards. Scholarship Interest Form is required to be considered.",
      amount: 0, // varies
      eligibility: [
        "Complete Scholarship Interest Form in MyStatus by January 15",
        "FAFSA/TASFA completion recommended for maximum consideration",
      ],
      deadline: "January 15",
      website: "https://admissions.utexas.edu/cost-aid/financial-aid/",
      essayRequired: false,
      renewable: false,
      national: false,
      collegeId: "ut-austin",
    },
  ],

  // ── Texas A&M ──────────────────────────────────────────────
  "texas-am": [
    {
      id: "tamu-presidents-achievement",
      name: "President's Achievement Scholarship",
      type: "merit",
      provider: "Texas A&M Scholarships & Financial Aid",
      description:
        "A four-year award for students who demonstrate academic achievement under difficult circumstances, co-curricular involvement, and leadership. Recognizes students who have overcome challenges to excel.",
      amount: 0, // varies
      eligibility: [
        "Graduate from a recruited Texas high school",
        "Demonstrate academic achievement under difficult circumstances",
        "Show co-curricular involvement, campus/community activities, and leadership",
        "Submit Common App or ApplyTexas with scholarship portions by December 1",
        "Submit Self-Reported Academic Record (SRAR)",
      ],
      deadline: "December 1",
      website: "https://aggie.tamu.edu/paying-for-college/apply-for-scholarships/presidents-achievement-scholarship.html",
      essayRequired: false,
      renewable: true,
      national: false,
      collegeId: "texas-am",
    },
    {
      id: "tamu-academic-scholarships",
      name: "Texas A&M Academic Scholarships",
      type: "merit",
      provider: "Texas A&M Scholarships & Financial Aid",
      description:
        "Merit-based scholarships awarded on the basis of academic merit, leadership, and financial need (or combination). Texas A&M does not stack academic scholarships — the highest eligible award is offered.",
      amount: 0, // varies
      eligibility: [
        "Apply via Common App or ApplyTexas with scholarship consideration",
        "Submit SRAR (Self-Reported Academic Record)",
        "Various criteria by specific scholarship",
      ],
      deadline: "December 1",
      website: "https://aggie.tamu.edu/paying-for-college/apply-for-scholarships/undergraduate-scholarships.html",
      essayRequired: false,
      renewable: true,
      national: false,
      collegeId: "texas-am",
    },
  ],

  // ── Rice University ──────────────────────────────────────
  rice: [
    {
      id: "rice-merit",
      name: "Rice Merit Scholarships",
      type: "merit",
      provider: "Rice Office of Admission",
      description:
        "Merit-based scholarships awarded to incoming first-year students who distinguish themselves academically and personally. About 20% of admitted students receive a merit scholarship. No separate application required — all admitted students are automatically considered.",
      amount: 0, // varies — up to full tuition
      eligibility: [
        "No separate application required — automatic consideration from admission application",
        "Open to both domestic and international students",
        "Based solely on merit; financial need not considered",
      ],
      deadline: "Varies by admission round (typically January 1 for Regular Decision)",
      website: "https://financialaid.rice.edu/types-aid/merit-scholarships",
      essayRequired: false,
      renewable: true,
      national: true,
      collegeId: "rice",
    },
  ],

  // ── Baylor University ─────────────────────────────────────
  baylor: [
    {
      id: "baylor-getterman-scholarship",
      name: "Getterman Scholarship",
      type: "merit",
      provider: "Baylor Honors College",
      description:
        "Baylor Honors College's premier full-tuition scholarship. Includes tuition (minus other merit scholarships), book allowance, course-related fees, housing and meals in the Honors Residential College for 8 semesters, plus support for study abroad, mission trips, and research internships (up to $20,000 combined).",
      amount: 0, // Full tuition + room/board + enrichment
      eligibility: [
        "Invitation-only via competitive application process",
        "Participation in Getterman Scholars Day finalist weekend",
        "Must be admitted to Baylor Honors College",
        "Exceptional academic record, leadership, and service orientation",
      ],
      deadline: "Varies (notified March/April)",
      website: "https://honors.baylor.edu/getterman",
      essayRequired: true,
      renewable: true,
      national: true,
      collegeId: "baylor",
    },
    {
      id: "baylor-honors-scholarships",
      name: "Baylor Honors College Scholarships",
      type: "need-based",
      provider: "Baylor Honors College",
      description:
        "The Honors College awards over $1 million annually in scholarships based on academic records and need. All Honors College applicants are automatically considered. Completing FAFSA and/or CSS Profile maximizes consideration for endowed scholarship support.",
      amount: 0, // varies
      eligibility: [
        "Must be admitted to Baylor Honors College or be a Great Texts major",
        "FAFSA and/or CSS Profile recommended",
        "Non-binding Honors College decision form required",
      ],
      deadline: "March 1 (Round 1) / April 1 (Round 2)",
      website: "https://honors.baylor.edu/scholarships",
      essayRequired: false,
      renewable: true,
      national: false,
      collegeId: "baylor",
    },
  ],

  // ── SMU ─────────────────────────────────────────────────
  smu: [
    {
      id: "smu-dedman-scholarship",
      name: "Dedman College Scholars Award",
      type: "merit",
      provider: "Dedman College of Humanities and Sciences, SMU",
      description:
        "A merit-based scholarship for first-year students with a primary major in Dedman College. Recipients receive up to $15,000 per year for 4 years and must maintain membership in the University Honors Program.",
      amount: 15000,
      eligibility: [
        "Admitted to SMU as first-year student with primary major in Dedman College",
        "Must qualify for the University Honors Program (UHP)",
        "Invited to submit essay and interview",
        "Maintain 3.3 GPA, full-time enrollment, and UHP membership",
      ],
      deadline: "Varies",
      website: "https://www.smu.edu/dedman/prospective-students/undergraduate-students/dedmancollegescholarsprogram/about",
      essayRequired: true,
      renewable: true,
      national: false,
      collegeId: "smu",
    },
    {
      id: "smu-presidents-scholars",
      name: "President's Scholars",
      type: "merit",
      provider: "SMU Office of Admission",
      description:
        "SMU's premier merit scholarship program. President's Scholars awards supersede other SMU merit awards. Selection is highly competitive based on academic achievement, leadership, and extracurricular distinction.",
      amount: 0, // varies — among the highest SMU awards
      eligibility: [
        "Admitted to SMU as a first-year student",
        "Top academic achievement and leadership profile",
        "Automatic consideration upon admission",
      ],
      deadline: "Varies (aligned with admission deadlines)",
      website: "https://www.smu.edu/enrollment-services/student-financial-services/scholarships",
      essayRequired: false,
      renewable: true,
      national: true,
      collegeId: "smu",
    },
    {
      id: "smu-hunt-leadership",
      name: "Hunt Leadership Scholars",
      type: "merit",
      provider: "SMU Office of Admission",
      description:
        "A merit scholarship program for students who demonstrate exceptional leadership potential. Scholars participate in leadership development programming and receive a significant merit award.",
      amount: 0, // varies
      eligibility: [
        "Admitted to SMU as first-year student",
        "Demonstrated leadership in school and community",
      ],
      deadline: "Varies (aligned with admission deadlines)",
      website: "https://www.smu.edu/enrollment-services/student-financial-services/scholarships",
      essayRequired: true,
      renewable: true,
      national: true,
      collegeId: "smu",
    },
  ],

  // ── TCU ─────────────────────────────────────────────────
  tcu: [
    {
      id: "tcu-chancellors",
      name: "Chancellor's Scholarship",
      type: "merit",
      provider: "TCU Office of Admission",
      description:
        "TCU's most prestigious merit scholarship covering full tuition for four years. Requires application to the John V. Roach Honors College for consideration.",
      amount: 0, // Full tuition
      eligibility: [
        "Must apply to the John V. Roach Honors College",
        "Top academic achievement (GPA, test scores, curriculum rigor)",
        "Holistic review including leadership and extracurriculars",
      ],
      deadline: "November 1 (Honors College supplemental application)",
      website: "https://admissions.tcu.edu/afford/scholarship-aid/",
      essayRequired: true,
      renewable: true,
      national: true,
      collegeId: "tcu",
    },
    {
      id: "tcu-deans",
      name: "Dean's Scholarship",
      type: "merit",
      provider: "TCU Office of Admission",
      description:
        "A four-year merit scholarship valued at $32,000 per year. Automatically considered for all high-achieving admitted first-year students.",
      amount: 32000,
      eligibility: [
        "High-achieving admitted first-year students",
        "Based on GPA, ACT/SAT (superscored), and curriculum rigor",
        "Automatic consideration — no separate application",
        "Maintain renewal requirements",
      ],
      deadline: "Varies (aligned with admission deadlines)",
      website: "https://admissions.tcu.edu/afford/scholarship-aid/",
      essayRequired: false,
      renewable: true,
      national: true,
      collegeId: "tcu",
    },
    {
      id: "tcu-faculty",
      name: "Faculty Scholarship",
      type: "merit",
      provider: "TCU Office of Admission",
      description:
        "A four-year merit scholarship valued at $30,000 per year. Automatically considered based on grades, test scores, and curriculum rigor.",
      amount: 30000,
      eligibility: [
        "High-achieving admitted first-year students",
        "Automatic consideration",
        "Maintain renewal requirements",
      ],
      deadline: "Varies (aligned with admission deadlines)",
      website: "https://admissions.tcu.edu/afford/scholarship-aid/",
      essayRequired: false,
      renewable: true,
      national: true,
      collegeId: "tcu",
    },
    {
      id: "tcu-founders",
      name: "Founders' Scholarship",
      type: "merit",
      provider: "TCU Office of Admission",
      description:
        "A four-year merit scholarship valued at $17,000 per year. Automatically considered based on academic credentials.",
      amount: 17000,
      eligibility: [
        "Admitted first-year students meeting academic thresholds",
        "Automatic consideration",
        "Maintain renewal requirements",
      ],
      deadline: "Varies (aligned with admission deadlines)",
      website: "https://admissions.tcu.edu/afford/scholarship-aid/",
      essayRequired: false,
      renewable: true,
      national: true,
      collegeId: "tcu",
    },
  ],

  // ── UT Dallas ──────────────────────────────────────────
  "ut-dallas": [
    {
      id: "utd-terry",
      name: "Terry Scholars at UT Dallas",
      type: "merit",
      provider: "Hobson Wildenthal Honors College / Terry Foundation",
      description:
        "Full cost of attendance scholarship including tuition, fees, meal plan, housing, textbooks and other educational expenses. Includes $5,000 for study abroad. Covers up to 8 semesters.",
      amount: 0, // Full cost of attendance
      eligibility: [
        "Texas residents",
        "Demonstrated leadership, academic achievement, and financial need",
        "Separate application and interview process",
      ],
      deadline: "Varies",
      website: "https://honors.utdallas.edu/terry-scholars/",
      essayRequired: true,
      renewable: true,
      national: false,
      collegeId: "ut-dallas",
    },
    {
      id: "utd-national-merit",
      name: "National Merit Scholars Program at UT Dallas",
      type: "merit",
      provider: "Hobson Wildenthal Honors College",
      description:
        "Complete coverage of UT Dallas tuition and mandatory fees for up to eight semesters. Scholars work alongside leading faculty on research and attend exclusive programming.",
      amount: 0, // Full tuition + fees
      eligibility: [
        "National Merit Finalist",
        "Must designate UT Dallas as first-choice institution with NMSC",
      ],
      deadline: "NMSC deadlines",
      website: "https://honors.utdallas.edu/national-merit-scholars-program/",
      essayRequired: false,
      renewable: true,
      national: false,
      collegeId: "ut-dallas",
    },
  ],

  // ── Texas Tech ──────────────────────────────────────────
  "texas-tech": [
    {
      id: "ttu-honors-incoming-scholarship",
      name: "Honors College Incoming First-Year Scholarships",
      type: "merit",
      provider: "Texas Tech Honors College",
      description:
        "Merit-based scholarships for incoming first-year Honors College students. Apply to the Honors College by December 1 for priority consideration.",
      amount: 0, // varies
      eligibility: [
        "Incoming first-year student admitted to Honors College",
        "Apply by December 1 for priority consideration",
        "Demonstrated academic excellence",
      ],
      deadline: "December 1 (priority)",
      website: "https://www.depts.ttu.edu/honors/scholarships/incomingfirstyear.php",
      essayRequired: true,
      renewable: true,
      national: false,
      collegeId: "texas-tech",
    },
    {
      id: "ttu-honors-current",
      name: "Honors College Current Student Scholarships",
      type: "merit",
      provider: "Texas Tech Honors College",
      description:
        "Competitive scholarships for current Honors College students who demonstrate exceptional academic performance, Honors and campus involvement, and consistent service. Financial need may also be considered.",
      amount: 0, // varies
      eligibility: [
        "Current Honors College student in good standing",
        "Completed at least one semester of Honors coursework",
        "Demonstrates exceptional academic performance and campus/service involvement",
      ],
      deadline: "Spring semester annually",
      website: "https://www.depts.ttu.edu/honors/scholarships/current.php",
      essayRequired: true,
      renewable: false,
      national: false,
      collegeId: "texas-tech",
    },
  ],
};
