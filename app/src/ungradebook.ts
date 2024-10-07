import 'beercss';
import 'material-dynamic-colors';
import 'remixicon/fonts/remixicon.css';
import '../static/css/style.css';
import '../static/css/theme.css';
import CookieManager from "./utils/cookieManager"
import UngardManager from "./utils/ungardManager"
import { Ungard } from "./utils/ungard";


let tabManager: TabManager;
let gradeBook: UnGradeBook;
let ungardManager: UngardManager;

class TabManager {
    container: HTMLDivElement;
    tabsNav: HTMLElement;
    gradeBook: UnGradeBook;
    ungardPage: UngardPage;
    attendancePage: AttendancePage;
    studentsPage: StudentsPage;
    coursesPage: CoursesPage;

    constructor() {
        this.container = document.querySelector(`#tabs-container`) as HTMLDivElement;
        this.tabsNav = this.container.querySelector('#tabs') as HTMLElement;
        this.gradeBook = new UnGradeBook();
        this.ungardPage = new UngardPage();
        this.attendancePage = new AttendancePage();
        this.studentsPage = new StudentsPage();
        this.coursesPage = new CoursesPage();
    }

    init() {
        if (this.tabsNav) {
            this.tabsNav.addEventListener('click', this.handleClick.bind(this));
        }
        this.setActiveTabFromCookie();
    }

    handleClick(event: Event) {
        const target = event.target as HTMLElement;
        if (target.dataset.ui) {
            this.setActiveTab(target.dataset.ui);
        }
    }

    setActiveTab(tabId: string) {
        this.tabsNav.querySelectorAll('a').forEach(tab => tab.classList.remove('active'));
        this.container.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

        const selectedTab = this.tabsNav.querySelector(`a[data-ui="${tabId}"]`);
        const selectedPage = this.container.querySelector(`${tabId}`);
        if (selectedTab && selectedPage) {
            selectedTab.classList.add('active');
            selectedPage.classList.add('active');
            CookieManager.setCookie('lastSelectedTab', tabId, '/ungradebook');
        }

        if (tabId === "#ungradebook") {
            this.gradeBook.init();
        }else if (tabId === "#ungards") {
            this.ungardPage.init();
        }else if (tabId === "#attendance") {
            this.attendancePage.init();
        }else if (tabId === "#students") {
            this.studentsPage.init();
        }else if (tabId === "#courses") {
            this.coursesPage.init();
        }
    }

    setActiveTabFromCookie() {
        const lastSelectedTab = CookieManager.getCookie('lastSelectedTab');
        if (lastSelectedTab) {
            this.setActiveTab(lastSelectedTab);
        }
    }
}

class UnGradeBook {
    containerId: string;
    constructor(containerId: string="ungradebook") {
        this.containerId = containerId;
    }
    init() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "Hello, world!";
        }
    }
}

class UngardPage {
    containerId: string;
    container?: HTMLElement;
    ungardsContainer?: HTMLElement;

    constructor(containerId: string = "ungards") {
        this.containerId = containerId;
    }

    init() {
        this.container = document.getElementById(this.containerId) as HTMLElement;
        this.ungardsContainer = this.container?.querySelector('#ungards-container') as HTMLElement;
        this.loadUnGards();
    }

    generateUngardHTML(ungard: Ungard): HTMLElement {
        const article = document.createElement('article') as HTMLElement;
        article.classList.add('ungard', 's12', 'm6', 'l4');
        article.innerHTML = `<p>${ungard.body}</p>
            <ul>
                ${Object.keys(ungard.strengths)
                    .map(key => `<li>${key}: ${ungard.strengths[key]}</li>`)
                    .join('')}
            </ul>`;
        return article;
    }
    async loadUnGards() {
        if (this.ungardsContainer) {
            this.ungardsContainer.innerHTML = "";
        }

        const ungardManager = new UngardManager();
        await ungardManager.load();

        const ungards = ungardManager.getUngards();
        for (let i = 0; i < ungards.length; i++) {
            const ungard = ungards[i];
            this.ungardsContainer?.appendChild(this.generateUngardHTML(ungard));
        }
    }
}


class AttendancePage {
    containerId: string;
    constructor(containerId: string="attendance") {
        this.containerId = containerId;
    }
    init() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "Hello, world!";
        }
    }
}

class StudentsPage {
    containerId: string;
    constructor(containerId: string="students") {
        this.containerId = containerId;
    }
    init() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "Hello, world!";
        }
    }
}

class CoursesPage {
    containerId: string;
    constructor(containerId: string="courses") {
        this.containerId = containerId;
    }
    init() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "Hello, world!";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    tabManager = new TabManager();
    tabManager.init();

    function setTheme(theme: string) {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);

        const themeIcon = document.getElementById("theme-icon") as HTMLElement;
        themeIcon.innerText = theme === "dark" ? "dark_mode" : "light_mode";
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
});