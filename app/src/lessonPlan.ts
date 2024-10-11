import 'beercss';
import 'material-dynamic-colors';
import '../static/css/printout-style.css';
import '../static/css/theme.css';
import '@mdi/font/css/materialdesignicons.min.css';
import MathCurriculumManager from "./utils/mathCurriculumManager"
import { MathLearningOutcome } from './utils/mathLearningOutcome';

class LessonPlan{
    topicTitle: HTMLInputElement;
    gradeLevel: HTMLSelectElement;
    timeLength: HTMLInputElement;
    date: HTMLInputElement;
    curricularOutcomes: HTMLElement;
    addCurricularOutcome: HTMLButtonElement;
    crossCurricularConnections: HTMLTextAreaElement;
    assessmentEvidence: HTMLTableElement;
    materialsConsidered: HTMLTextAreaElement;
    studentSpecificPlanning: HTMLTextAreaElement;
    learningPlan: HTMLTableElement;
    reflections: HTMLTextAreaElement;
    mathCurriculumManager: MathCurriculumManager;

    constructor(){
        this.topicTitle = document.getElementById('topic-title') as HTMLInputElement;
        this.gradeLevel = document.getElementById('grade-level') as HTMLSelectElement;
        this.timeLength = document.getElementById('time-length') as HTMLInputElement;
        this.date = document.getElementById('date') as HTMLInputElement;
        this.curricularOutcomes = document.getElementById('curricular-outcomes') as HTMLElement;
        this.addCurricularOutcome = document.getElementById('add-curricular-outcome') as HTMLButtonElement;
        this.crossCurricularConnections = document.getElementById('cross-curricular-connections') as HTMLTextAreaElement;
        this.assessmentEvidence = document.getElementById('assessment-evidence') as HTMLTableElement;
        this.materialsConsidered = document.getElementById('materials-considered') as HTMLTextAreaElement;
        this.studentSpecificPlanning = document.getElementById('student-specific-planning') as HTMLTextAreaElement;
        this.learningPlan = document.getElementById('learning-plan') as HTMLTableElement;
        this.reflections = document.getElementById('reflections') as HTMLTextAreaElement;
        this.mathCurriculumManager = new MathCurriculumManager();
    }

    init(){
        this.date.value = new Date().toISOString().split('T')[0];
        this.mathCurriculumManager.load().then(() => {
            const url = new URL(window.location.href);
            const id = url.searchParams.get('id');
            let selectedLearningOutcome: MathLearningOutcome | undefined;
            if (id){
                console.log(`Lesson Plan ID: ${id}`);
                selectedLearningOutcome = this.mathCurriculumManager.getLearningOutcomeByID(id);
            }
            console.log(selectedLearningOutcome);
            if (selectedLearningOutcome){
                this.gradeLevel.value = selectedLearningOutcome.grade;
            }
        });
    }
}

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

document.addEventListener('DOMContentLoaded', function() {
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

    const lessonPlan = new LessonPlan()
    lessonPlan.init();
});

window.onbeforeprint = function () {
    document.body.classList.remove("light", "dark");
    document.body.classList.add("light");
};

window.onafterprint = function () {
    setTheme(localStorage.getItem("theme") || "light");
};