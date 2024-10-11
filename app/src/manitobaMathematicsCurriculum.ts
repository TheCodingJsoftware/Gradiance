import 'beercss';
import 'material-dynamic-colors';
import '../static/css/style.css';
import '../static/css/math-theme.css';
import '@mdi/font/css/materialdesignicons.min.css';
import MathCurriculumManager from "./utils/mathCurriculumManager"
import CookieManager from './utils/cookieManager';
import { MathLearningOutcome } from "./utils/mathLearningOutcome";
import { ScienceLearningOutcome } from './utils/scienceLearningOutcome';


const iconDictionary: { [key: string]: string } = {
    'C': 'chat',
    'CN': 'link',
    'ME': 'calculate',
    'PS': 'lightbulb',
    'R': 'psychology',
    'T': 'devices',
    'V': 'visibility',
};

const skillsDictionary: { [key: string]: string } = {
    'C': 'Communication',
    'CN': 'Connections',
    'ME': 'Mental Mathematics and Estimation',
    'PS': 'Problem Solving',
    'R': 'Reasoning',
    'T': 'Technology',
    'V': 'Visualization',
};
const strandIconDictionary: { [key: string]: string } = {
    'N': 'plus_one',
    'PR': 'timeline',
    'SS': 'shapes',
    'SP': 'bar_chart',
    'PF': 'account_balance_wallet',
    'M': 'straighten',
    'G': 'category',
    'AG': 'functions',
    'TG': 'square_foot',
    'CD': 'shopping_cart',
    'T': 'transform',
    'AC': 'geometry',
    'A': 'calculate',
    'R': 'scatter_plot',
    'L': 'psychology',
    'S': 'analytics',
    'RP': 'science',
    'I': 'credit_card',
    'MM': 'attach_money',
    'D': 'design_services',
    'FM': 'request_quote',
    'P': 'casino',
    'V': 'directions_car',
    'PM': 'speed',
    'C': 'work',
    'H': 'home',
    'GT': 'rule',
    'B': 'business_center',
    'PCB': 'functions',
}

const strandDictionary: { [key: string]: string } = {
    'N': 'Number Sense',
    'PR': 'Patterns and Relations',
    'SS': 'Shape and Space',
    'SP': 'Statistics and Probability',
    'PF': 'Personal Finance',
    'M': 'Measurement',
    'G': 'Geometry',
    'AG': 'Analysis of Games and Numbers',
    'TG': 'Trigonometry',
    'CD': 'Consumer Decisions',
    'T': 'Transformations',
    'AC': 'Angle Construction',
    'A': 'Algebra and Numbers',
    'R': 'Relations and Functions',
    'L': 'Logical Reasoning',
    'S': 'Statistics',
    'RP': 'Research Project',
    'I': 'Interest and Credit',
    'MM': 'Managing Money',
    'D': 'Design Modelling',
    'FM': 'Financial Mathematics',
    'P': 'Probability',
    'V': 'Vehicle Finanace',
    'PM': 'Precision Measurement',
    'C': 'Career Life',
    'H': 'Home Finance',
    'GT': 'Geometry and Trigonometry',
    'B': 'Business Finance',
    'PCB': 'Permutations, Combinations, and Binomial Theorem',
};

const quickSearchKeyWords: string[] = [
    "3-D Object",
    "3-D Shape",
    "3-D Space",
    "2-D Object",
    "2-D Shape",
    "Subtract zero",
    "Add zero",
    "Addition",
    "Arrays",
    "Base-10",
    "Chart",
    "Compare",
    "Ten frames",
    "coins",
    "Counting",
    "Data collection",
    "Clock",
    "Cartesian plane",
    "Independent events",
    "Quadrilaterals",
    "Degree",
    "Decimal",
    "Division",
    "Equal groups",
    "Equality",
    "Inequality",
    "Equation",
    "Estimation",
    "Estimate",
    "Fractions",
    "Exponent",
    "Graph",
    "Slope",
    "Confidence interval",
    "Margin of error",
    "Confidence level",
    "Linear",
    "Grouping",
    "Inequalities",
    "Multiplication",
    "Measure",
    "Perimeter",
    "Percentage",
    "Surface Area",
    "Volume",
    "Orientation",
    "Number line",
    "Pattern",
    "Place value",
    "Mental Mathematics",
    "Problem-solving",
    "Repeated addition",
    "Repeated subtraction",
    "Represent",
    "Line plot",
    "Statistics",
    "Statistical",
    "Permutation",
    "Combination",
    "Shapes",
    "Sequence",
    "Skip counting",
    "Sine law",
    "Cosine law",
    "Polygon",
    "Population",
    "Collecting data",
    "Probablity",
    "Subtraction",
    "Symbols",
    "Unit measure",
    "Record data",
    "Visualization",
]

class FilterManager {
    container: HTMLDivElement;
    tabsNav: HTMLElement;
    searchInput: HTMLInputElement;
    alwaysOpenOutcomeCheckbox: HTMLInputElement;
    alwaysOpenSLOCheckbox: HTMLInputElement;
    alwaysOpenGLOCheckbox: HTMLInputElement;
    quickSearchContainer: HTMLDivElement;
    strandsContainer: HTMLDivElement;
    skillsContainer: HTMLDivElement;
    curriculumManager: MathCurriculumManager;

    constructor() {
        this.container = document.querySelector(`#tabs-container`) as HTMLDivElement;
        this.tabsNav = this.container.querySelector('#tabs') as HTMLElement;
        this.searchInput = document.querySelector('#search') as HTMLInputElement;
        this.alwaysOpenOutcomeCheckbox = document.getElementById('always-open-outcome') as HTMLInputElement;
        this.alwaysOpenSLOCheckbox = document.getElementById('always-open-specific-learning-outcome') as HTMLInputElement;
        this.alwaysOpenGLOCheckbox = document.getElementById('always-open-general-learning-outcomes') as HTMLInputElement;
        this.quickSearchContainer = document.getElementById('quick-search-container') as HTMLDivElement;
        this.strandsContainer = document.getElementById('strands-container') as HTMLDivElement;
        this.skillsContainer = document.getElementById('skills-container') as HTMLDivElement;
        this.curriculumManager = new MathCurriculumManager();
    }

    init() {
        if (this.tabsNav) {
            this.tabsNav.addEventListener('click', this.handleClick.bind(this));
        }
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
        this.alwaysOpenOutcomeCheckbox.addEventListener('change', this.handleCheckboxChange.bind(this));
        this.alwaysOpenSLOCheckbox.addEventListener('change', this.handleCheckboxChange.bind(this));
        this.alwaysOpenGLOCheckbox.addEventListener('change', this.handleCheckboxChange.bind(this));

        this.curriculumManager.load().then(() => {
            this.loadSettingsFromCookies();
            this.setActiveTabFromCookie();
            this.filterContent();
        });
    }

    handleClick(event: Event) {
        const target = event.target as HTMLElement;
        if (target.dataset.ui) {
            this.setActiveTab(target.dataset.ui);
        }
    }

    handleSearch() {
        CookieManager.setCookie('searchQuery', this.searchInput.value, '/manitoba_mathematics_curriculum');
        this.filterContent();
    }

    handleCheckboxChange() {
        this.saveCheckboxStates();
        this.filterContent();
    }

    async loadStrands(tabId: string) {
        const strands = this.curriculumManager.getStrands(tabId);
        const activeStrands = this.getActiveStrands(); // Always get active strands
        this.strandsContainer.innerHTML = "";

        // Merge active strands to ensure they are always visible
        const mergedStrands = [...new Set([...strands, ...activeStrands])];

        mergedStrands.forEach(strand => {
            const button = document.createElement('button');
            button.classList.add('tiny-margin', 'surface', 'border', 'round');

            const strandIcon = document.createElement('i');
            strandIcon.innerHTML = strandIconDictionary[strand];
            button.appendChild(strandIcon);

            const text = document.createElement('span');
            text.textContent = strandDictionary[strand];
            button.appendChild(text);

            const icon = document.createElement('i');
            icon.classList.add('mdi', 'hidden'); // default icon
            button.appendChild(icon);

            // Check if this strand is active
            if (activeStrands.includes(strand)) {
                button.classList.add('fill');
                icon.classList.replace('hidden', 'mdi-check-circle');
            }

            button.addEventListener('click', () => {
                this.toggleStrand(button, strand);
            });

            this.strandsContainer.appendChild(button);
        });
    }

    async loadSkills(tabId: string) {
        const skills = this.curriculumManager.getSkills(tabId);
        const activeSkills = this.getActiveSkills(); // Always get active skills
        this.skillsContainer.innerHTML = "";

        // Merge active skills to ensure they are always visible
        const mergedSkills = [...new Set([...skills, ...activeSkills])];

        mergedSkills.forEach(skill => {
            const button = document.createElement('button');
            button.classList.add('tiny-margin', 'surface', 'border', 'round');

            const skillIcon = document.createElement('i');
            skillIcon.innerHTML = iconDictionary[skill];
            button.appendChild(skillIcon);

            const span = document.createElement('span');
            span.textContent = skillsDictionary[skill];
            button.appendChild(span);

            const icon = document.createElement('i');
            icon.classList.add('mdi', 'hidden'); // default icon
            button.appendChild(icon);

            // Check if this skill is active
            if (activeSkills.includes(skill)) {
                button.classList.add('fill');
                icon.classList.replace('hidden', 'mdi-check-circle');
            }

            button.addEventListener('click', () => {
                this.toggleSkill(button, skill);
            });

            this.skillsContainer.appendChild(button);
        });
    }

    async loadQuickSearch(tabId: string) {
        this.quickSearchContainer.innerHTML = "";

        const learningOutcomes = this.curriculumManager.getOutcomesByGrade(tabId);

        const matchingKeywords = new Set<string>();

        learningOutcomes.forEach(learningOutcome => {
            quickSearchKeyWords.forEach(keyword => {
                const isKeywordInSLO = learningOutcome.specificLearningOutcome.toLowerCase().includes(keyword.toLowerCase());
                const isKeywordInGLO = learningOutcome.generalLearningOutcomes.some(glo => glo.toLowerCase().includes(keyword.toLowerCase()));

                if (isKeywordInSLO || isKeywordInGLO) {
                    matchingKeywords.add(keyword);
                }
            });
        });

        const sortedKeywords = Array.from(matchingKeywords).sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
        });

        sortedKeywords.forEach(keyword => {
            const button = document.createElement('button');
            button.classList.add('tiny-margin', 'surface', 'border', 'small-round');

            const icon = document.createElement('i');
            icon.classList.add('mdi', 'mdi-magnify');
            button.appendChild(icon);

            const text = document.createElement('span');
            text.textContent = keyword;
            button.appendChild(text);

            button.addEventListener('click', () => {
                this.searchInput.value = keyword;
                CookieManager.setCookie('searchQuery', this.searchInput.value, '/manitoba_mathematics_curriculum');
                this.filterContent();
            });

            this.quickSearchContainer.appendChild(button);
        });
    }

    toggleStrand(button: HTMLButtonElement, strand: string) {
        const icons = button.querySelectorAll('i');
        const icon = icons[1];
        if (button.classList.contains('fill')) {
            button.classList.remove('fill');
            icon?.classList.replace('mdi-check-circle', 'hidden');
            this.removeActiveStrand(strand);
        } else {
            button.classList.add('fill');
            icon?.classList.replace('hidden', 'mdi-check-circle');
            this.addActiveStrand(strand);
        }
        this.filterContent();
    }

    toggleSkill(button: HTMLButtonElement, skill: string) {
        const icons = button.querySelectorAll('i');
        const icon = icons[1]; // Get the second icon
        if (button.classList.contains('fill')) {
            button.classList.remove('fill');
            icon?.classList.replace('mdi-check-circle', 'hidden');
            this.removeActiveSkill(skill);
        } else {
            button.classList.add('fill');
            icon?.classList.replace('hidden', 'mdi-check-circle');
            this.addActiveSkill(skill);
        }
        this.filterContent();
    }

    addActiveStrand(strand: string) {
        const activeStrands = this.getActiveStrands();
        if (!activeStrands.includes(strand)) {
            activeStrands.push(strand);
            CookieManager.setCookie('activeStrands', JSON.stringify(activeStrands), '/manitoba_mathematics_curriculum');
        }
    }

    removeActiveStrand(strand: string) {
        const activeStrands = this.getActiveStrands();
        const updatedStrands = activeStrands.filter(s => s !== strand);
        CookieManager.setCookie('activeStrands', JSON.stringify(updatedStrands), '/manitoba_mathematics_curriculum');
    }

    addActiveSkill(skill: string) {
        const activeSkills = this.getActiveSkills();
        if (!activeSkills.includes(skill)) {
            activeSkills.push(skill);
            CookieManager.setCookie('activeSkills', JSON.stringify(activeSkills), '/manitoba_mathematics_curriculum');
        }
    }

    removeActiveSkill(skill: string) {
        const activeSkills = this.getActiveSkills();
        const updatedSkills = activeSkills.filter(s => s !== skill);
        CookieManager.setCookie('activeSkills', JSON.stringify(updatedSkills), '/manitoba_mathematics_curriculum');
    }

    getActiveStrands(): string[] {
        const activeStrands = CookieManager.getCookie('activeStrands');
        return activeStrands ? JSON.parse(activeStrands) : [];
    }

    getActiveSkills(): string[] {
        const activeSkills = CookieManager.getCookie('activeSkills');
        return activeSkills ? JSON.parse(activeSkills) : [];
    }

    saveCheckboxStates() {
        CookieManager.setCookie('alwaysOpenOutcome', String(this.alwaysOpenOutcomeCheckbox.checked), '/manitoba_mathematics_curriculum');
        CookieManager.setCookie('alwaysOpenSLO', String(this.alwaysOpenSLOCheckbox.checked), '/manitoba_mathematics_curriculum');
        CookieManager.setCookie('alwaysOpenGLO', String(this.alwaysOpenGLOCheckbox.checked), '/manitoba_mathematics_curriculum');
    }

    loadSettingsFromCookies() {
        // Load search query from cookie
        const searchQuery = CookieManager.getCookie('searchQuery');
        if (searchQuery) {
            this.searchInput.value = searchQuery;
        }
        Promise.all([
            this.loadStrands(this.tabsNav.dataset.ui || '#grade_k'),
            this.loadSkills(this.tabsNav.dataset.ui || '#grade_k'),
            this.loadQuickSearch(this.tabsNav.dataset.ui || '#grade_k')
        ]).catch(console.error);

        // Load always open settings
        this.alwaysOpenOutcomeCheckbox.checked = CookieManager.getCookie('alwaysOpenOutcome') === 'true';
        this.alwaysOpenSLOCheckbox.checked = CookieManager.getCookie('alwaysOpenSLO') === 'true';
        this.alwaysOpenGLOCheckbox.checked = CookieManager.getCookie('alwaysOpenGLO') === 'true';
    }

    setActiveTab(tabId: string) {
        this.tabsNav.querySelectorAll('a').forEach(tab => tab.classList.remove('active'));

        const selectedTab = this.tabsNav.querySelector(`a[data-ui="${tabId}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
            CookieManager.setCookie('lastSelectedTab', tabId, '/manitoba_mathematics_curriculum');
        }
        Promise.all([
            this.filterContent(),
            this.loadStrands(tabId),
            this.loadSkills(tabId),
            this.loadQuickSearch(tabId)
        ]).catch(console.error);
    }

    setActiveTabFromCookie() {
        const lastSelectedTab = CookieManager.getCookie('lastSelectedTab') || '#grade_k';
        if (lastSelectedTab) {
            this.setActiveTab(lastSelectedTab);
        }
    }

    async filterContent() {
        const activeGrade = this.tabsNav.querySelector('a.active') as HTMLElement;
        if (activeGrade.dataset.ui) {
            const searchQuery = this.searchInput.value.toLowerCase();
            const filteredData = this.curriculumManager.filterData({
                grade: activeGrade.dataset.ui,
                searchQuery: searchQuery,
                strands: this.getActiveStrands(),
                skills: this.getActiveSkills()
            });

            this.renderContent(filteredData, searchQuery, this.getActiveSkills());
        }
    }

    getKeyword(learningOutcome: MathLearningOutcome): string {
        const keywords = new Set<string>();

        quickSearchKeyWords.forEach(keyword => {
            const lowerCaseKeyword = keyword.toLowerCase();

            if (learningOutcome.specificLearningOutcome.toLowerCase().includes(lowerCaseKeyword)) {
                keywords.add(keyword);
            }

            learningOutcome.generalLearningOutcomes.forEach(glo => {
                if (glo.toLowerCase().includes(lowerCaseKeyword)) {
                    keywords.add(keyword);
                }
            });
        });

        return keywords.size > 0 ? `: ${Array.from(keywords).join(', ')}` : '';
    }


    async renderContent(learningOutcomes: MathLearningOutcome[], searchQuery: string, selectedSkills: string[]) {
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = '';

            // Check settings checkboxes
            const alwaysOpenOutcome = this.alwaysOpenOutcomeCheckbox.checked;
            const alwaysOpenSLO = this.alwaysOpenSLOCheckbox.checked;
            const alwaysOpenGLO = this.alwaysOpenGLOCheckbox.checked;

            let contentAdded = false;

            learningOutcomes.forEach(learningOutcome => {
                contentAdded = true;
                const details = document.createElement('details');
                details.classList.add('s12', 'm12', 'l12', 'learning-outcome');

                if (alwaysOpenOutcome || (searchQuery && (learningOutcome.specificLearningOutcome.toLowerCase().includes(searchQuery.toLowerCase()) || alwaysOpenGLO || (searchQuery && learningOutcome.generalLearningOutcomes.some(glo => glo.toLowerCase().includes(searchQuery.toLowerCase())))))) {
                    details.setAttribute('open', '');
                }

                const summary = document.createElement('summary');
                summary.classList.add('bold');
                summary.style.fontSize = '18pt';
                const title = learningOutcome.getID() + this.getKeyword(learningOutcome);
                summary.innerHTML = searchQuery ? title.replace(new RegExp(searchQuery, 'gi'), (match) => `<span class="highlight">${match}</span>`) : title;

                details.appendChild(summary);

                const skillDiv = document.createElement('div');
                learningOutcome.skills.forEach(skill => {
                    const button = document.createElement('button');
                    button.classList.add('tiny-margin', 'chip');
                    if (selectedSkills.includes(skill)) {
                        button.classList.add('fill');
                    }
                    button.onclick = function () {
                        ui(`#${skill}-dialog`);
                    }

                    const icon = document.createElement('i');
                    icon.classList.add('primary-text');
                    icon.textContent = iconDictionary[skill];

                    const span = document.createElement('span');
                    span.textContent = skillsDictionary[skill];

                    button.appendChild(icon);
                    button.appendChild(span);
                    skillDiv.appendChild(button);
                });

                details.appendChild(skillDiv);

                const sloDetails = document.createElement('details');
                sloDetails.classList.add('specific-learning-outcome');
                sloDetails.id = `slo-${learningOutcome.getID()}`;
                if (alwaysOpenSLO || (searchQuery && learningOutcome.specificLearningOutcome.toLowerCase().includes(searchQuery.toLowerCase()))) {
                    sloDetails.setAttribute('open', '');
                }

                const sloSummary = document.createElement('summary');
                sloSummary.textContent = 'Specific Learning Outcome';
                sloDetails.appendChild(sloSummary);

                const sloContent = searchQuery ? learningOutcome.specificLearningOutcome.replace(new RegExp(searchQuery, 'gi'), (match) => `<span class="highlight">${match}</span>`) : learningOutcome.specificLearningOutcome;

                const sloText = document.createElement('p');
                sloText.classList.add('no-line', 'tiny-margin');
                sloText.innerHTML = 'It is expected that students will: ' + sloContent;

                sloDetails.appendChild(sloText);

                details.appendChild(sloDetails);

                const gloDetails = document.createElement('details');
                gloDetails.classList.add('general-learning-outcomes');
                gloDetails.id = `glo-${learningOutcome.getID()}`;
                if (alwaysOpenGLO || (searchQuery && learningOutcome.generalLearningOutcomes.some(glo => glo.toLowerCase().includes(searchQuery.toLowerCase())))) {
                    gloDetails.setAttribute('open', '');
                }

                const gloSummary = document.createElement('summary');
                gloSummary.textContent = 'General Learning Outcomes';
                gloDetails.appendChild(gloSummary);

                const gloDescription = document.createElement('p');
                gloDescription.classList.add('no-line', 'bottom-margin');
                gloDescription.innerHTML = 'The following set of indicators <b>may</b> be used to determine whether the students have met the corresponding specific outcome.';
                gloDetails.appendChild(gloDescription);

                const gloList = document.createElement('ul');
                learningOutcome.generalLearningOutcomes.forEach(glo => {
                    const gloListItem = document.createElement('li');
                    gloListItem.classList.add('no-line', 'bottom-margin');
                    gloListItem.innerHTML = searchQuery ? glo.replace(new RegExp(searchQuery, 'gi'), (match) => `<span class="highlight">${match}</span>`) : glo;
                    gloList.appendChild(gloListItem);
                });

                gloDetails.appendChild(gloList);
                details.appendChild(gloDetails);
                const createLessonPlanButton = document.createElement('button');
                createLessonPlanButton.classList.add('small-round');
                createLessonPlanButton.textContent = 'Create Lesson Plan';
                createLessonPlanButton.onclick = function () {
                    window.open(`/lesson_plan?id=${learningOutcome.getID()}`, '_blank');
                }
                details.appendChild(createLessonPlanButton);
                contentDiv.appendChild(details);
            });
            if (!contentAdded) {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.classList.add('s12', 'm12', 'l12', 'center-align', 'medium-width');
                noResultsMessage.textContent = 'No results found with the filter settings applied.';
                contentDiv.appendChild(noResultsMessage);
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    function setTheme(theme: string) {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);

        const themeIcon = document.getElementById("theme-icon") as HTMLElement;
        themeIcon.innerText = theme === "light" ? "dark_mode" : "light_mode";

        const icons = document.querySelectorAll('.icon') as NodeListOf<HTMLElement>;
        if (theme === 'light') {
            icons.forEach(icon => {
                icon.style.filter = 'invert(1)';
            });
        }else{
            icons.forEach(icon => {
                icon.style.filter = 'invert(0)';
            });
        }
    }

    const themeToggle = document.getElementById("theme-toggle") as HTMLInputElement;
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.body.classList.contains("dark") ?
            "dark" :
            "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    });

    themeToggle.checked = localStorage.getItem("theme") === "dark";

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const tabManager = new FilterManager();
    tabManager.init();
});
