import 'beercss';
import 'material-dynamic-colors';
import 'remixicon/fonts/remixicon.css';
import '../static/css/style.css';
import '../static/css/theme.css';
import { createClient } from '@supabase/supabase-js'
import CookieManager from "./utils/cookieManager"

const supabase = createClient('https://xkdozxeodahnzrkmcjze.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZG96eGVvZGFobnpya21janplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0NDE2NDMsImV4cCI6MjA0MjAxNzY0M30.fdgIZAXEKg7mRs-n1XrhUAyrgkbF3lqyaSrMUyqesZ0')

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
            CookieManager.setCookie('lastSelectedTab', tabId, '/gradebook');
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