import 'beercss';
import 'material-dynamic-colors';
import '../static/css/style.css';
import '../static/css/science-theme.css';
import '@mdi/font/css/materialdesignicons.min.css';
import ScienceCurriculumManager from "./utils/scienceCurriculumManager"
import CookieManager from './utils/cookieManager';
import { ScienceLearningOutcome } from "./utils/scienceLearningOutcome";
import { clusterIconDictionary } from './utils/icons';

class FilterManager {
    container: HTMLDivElement;
    tabsNav: HTMLElement;
    searchInput: HTMLInputElement;
    alwaysOpenOutcomeCheckbox: HTMLInputElement;
    alwaysOpenSLOCheckbox: HTMLInputElement;
    alwaysOpenGLOCheckbox: HTMLInputElement;
    clusterContainer: HTMLDivElement;
    curriculumManager: ScienceCurriculumManager;

    constructor() {
        this.container = document.querySelector(`#tabs-container`) as HTMLDivElement;
        this.tabsNav = this.container.querySelector('#tabs') as HTMLElement;
        this.searchInput = document.querySelector('#search') as HTMLInputElement;
        this.alwaysOpenOutcomeCheckbox = document.getElementById('always-open-outcome') as HTMLInputElement;
        this.alwaysOpenSLOCheckbox = document.getElementById('always-open-specific-learning-outcome') as HTMLInputElement;
        this.alwaysOpenGLOCheckbox = document.getElementById('always-open-general-learning-outcomes') as HTMLInputElement;
        this.clusterContainer = document.getElementById('clusters-container') as HTMLDivElement;
        this.curriculumManager = new ScienceCurriculumManager();
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
        CookieManager.setCookie('searchQuery', this.searchInput.value, '/manitobaScienceCurriculum.html');
        this.filterContent();
    }

    handleCheckboxChange() {
        this.saveCheckboxStates();
        this.filterContent();
    }

    saveCheckboxStates() {
        CookieManager.setCookie('alwaysOpenOutcome', String(this.alwaysOpenOutcomeCheckbox.checked), '/manitobaScienceCurriculum.html');
        CookieManager.setCookie('alwaysOpenSLO', String(this.alwaysOpenSLOCheckbox.checked), '/manitobaScienceCurriculum.html');
        CookieManager.setCookie('alwaysOpenGLO', String(this.alwaysOpenGLOCheckbox.checked), '/manitobaScienceCurriculum.html');
    }

    loadSettingsFromCookies() {
        // Load search query from cookie
        const searchQuery = CookieManager.getCookie('searchQuery');
        if (searchQuery) {
            this.searchInput.value = searchQuery;
        }

        this.loadClusters(this.tabsNav.dataset.ui || '#grade_k');

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
            CookieManager.setCookie('lastSelectedTab', tabId, '/manitobaScienceCurriculum.html');
        }
        this.loadClusters(tabId);
        this.filterContent();
    }

    loadClusters(tabId: string) {
        const grade = tabId.replace('#grade_', '').toUpperCase();
        const activeClusters = this.getActiveClusters();
        const clusters = this.curriculumManager.clusters[grade];

        this.clusterContainer.innerHTML = "";
        Object.keys(clusters).forEach(clusterKey => {
            const button = document.createElement('button');
            button.classList.add('tiny-margin', 'surface', 'border', 'round');

            const strandIcon = document.createElement('i');
            strandIcon.innerHTML = clusterIconDictionary[clusters[clusterKey]];
            button.appendChild(strandIcon);

            const text = document.createElement('span');
            text.textContent = clusters[clusterKey];
            button.appendChild(text);

            const icon = document.createElement('i');
            icon.classList.add('mdi', 'hidden'); // default icon
            button.appendChild(icon);

            if (activeClusters.includes(clusterKey)) {
                button.classList.add('fill');
                icon.classList.replace('hidden', 'mdi-check-circle');
            }

            button.addEventListener('click', () => {
                this.toggleCluster(button, clusterKey);
            });

            this.clusterContainer.appendChild(button);
        });
    }

    toggleCluster(button: HTMLButtonElement, cluster: string) {
        const icons = button.querySelectorAll('i');
        const icon = icons[1];
        if (button.classList.contains('fill')) {
            button.classList.remove('fill');
            icon?.classList.replace('mdi-check-circle', 'hidden');
            this.removeActiveCluster(cluster);
        } else {
            button.classList.add('fill');
            icon?.classList.replace('hidden', 'mdi-check-circle');
            this.addActiveCluster(cluster);
        }
        this.filterContent();
    }

    addActiveCluster(cluster: string) {
        const activeClusters = this.getActiveClusters();
        if (!activeClusters.includes(cluster)) {
            activeClusters.push(cluster);  // Add the cluster to the active clusters list
            CookieManager.setCookie('activeClusters', JSON.stringify(activeClusters), '/manitobaScienceCurriculum.html');
        }
    }

    removeActiveCluster(cluster: string) {
        const activeClusters = this.getActiveClusters();
        const updatedClusters = activeClusters.filter(s => s !== cluster);  // Remove the cluster from the active clusters
        CookieManager.setCookie('activeClusters', JSON.stringify(updatedClusters), '/manitobaScienceCurriculum.html');
    }

    getActiveClusters(): string[] {
        const activeClusters = CookieManager.getCookie('activeClusters');
        return activeClusters ? JSON.parse(activeClusters) : [];
    }

    setActiveTabFromCookie() {
        const lastSelectedTab = CookieManager.getCookie('lastSelectedTab') || '#grade_k';
        if (lastSelectedTab) {
            this.setActiveTab(lastSelectedTab);
        }
    }

    filterContent() {
        const activeGradeElement = this.tabsNav.querySelector('a.active') as HTMLElement;
        let activeGrade = '#grade_k';

        if (activeGradeElement.dataset.ui) {
            activeGrade = activeGradeElement.dataset.ui;
        }

        const searchQuery = this.searchInput.value.toLowerCase();
        const filteredData = this.curriculumManager.filterData({
            grade: activeGrade,
            searchQuery: searchQuery,
            clusters: this.getActiveClusters(),
        });

        this.renderContent(filteredData, searchQuery);
    }

    renderContent(learningOutcomes: ScienceLearningOutcome[], searchQuery: string) {
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = ''; // Clear previous content

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

                // Create summary element for main outcome
                const summary = document.createElement('summary');
                summary.classList.add('bold');
                summary.style.fontSize = '18pt';
                summary.innerHTML = searchQuery ? learningOutcome.getID().replace(new RegExp(searchQuery, 'gi'), (match) => `<span class="highlight">${match}</span>`) : learningOutcome.getID();

                // Append summary to details
                details.appendChild(summary);

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
                if (alwaysOpenGLO || (searchQuery && learningOutcome.generalLearningOutcomes.some(gloCode => this.curriculumManager.generalOutcomes[gloCode].toLowerCase().includes(searchQuery.toLowerCase())))) {
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
                learningOutcome.generalLearningOutcomes.forEach(gloCode => {
                    const gloListItem = document.createElement('li');
                    const glo = gloCode + ": " + this.curriculumManager.generalOutcomes[gloCode];
                    gloListItem.innerHTML = searchQuery ? glo.replace(new RegExp(searchQuery, 'gi'), (match) => `<span class="highlight">${match}</span>`) : glo;
                    gloList.appendChild(gloListItem);
                });

                gloDetails.appendChild(gloList);
                details.appendChild(gloDetails);
                const createLessonPlanButton = document.createElement('button');
                createLessonPlanButton.classList.add('small-round');
                createLessonPlanButton.textContent = 'Create Lesson Plan';
                createLessonPlanButton.onclick = function () {
                    window.open(`/lessonPlan.html?id=${learningOutcome.getID()}&curriculum=science`, '_blank');
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
