import 'beercss';
import 'material-dynamic-colors';
import 'remixicon/fonts/remixicon.css';
import '../static/css/style.css';
import '../static/css/theme.css';
import CookieManager from "./utils/cookieManager"


let tabManager: TabManager;
let gradeBook: GradeBook;

class TabManager {
    container: HTMLDivElement;
    tabsNav: HTMLElement;

    constructor() {
        this.container = document.querySelector(`#tabs-container`) as HTMLDivElement;
        this.tabsNav = this.container.querySelector('#tabs') as HTMLElement;
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
    }

    setActiveTabFromCookie() {
        const lastSelectedTab = CookieManager.getCookie('lastSelectedTab');
        if (lastSelectedTab) {
            this.setActiveTab(lastSelectedTab);
        }
    }
}

class GradeBook {
    containerId: string;
    constructor(containerId: string="gradebook") {
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

    gradeBook = new GradeBook();
    gradeBook.init();
});