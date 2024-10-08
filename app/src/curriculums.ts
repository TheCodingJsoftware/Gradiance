import 'beercss';
import 'material-dynamic-colors';
import '../static/css/style.css';
import '../static/css/theme.css';
import '@mdi/font/css/materialdesignicons.min.css';

document.addEventListener('DOMContentLoaded', function() {
    function setTheme(theme: string) {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);

        const themeIcon = document.getElementById("theme-icon") as HTMLElement;
        themeIcon.innerText = theme === "light" ? "dark_mode" : "light_mode";

        const icons = document.querySelectorAll('.icon') as NodeListOf<HTMLElement>;
        const mathBackground = document.getElementById("math-background") as HTMLElement;
        const ELABackground = document.getElementById("ela-background") as HTMLElement;
        const scienceBackground = document.getElementById("science-background") as HTMLElement;
        const socialStudiesBackground = document.getElementById("social-studies-background") as HTMLElement;

        if (theme === 'light') {
            icons.forEach(icon => {
                icon.style.filter = 'invert(1)';
            });
            mathBackground.style.backgroundColor = '#006493';
            ELABackground.style.backgroundColor = '#9a25ae';
            scienceBackground.style.backgroundColor = '#006e1c';
            socialStudiesBackground.style.backgroundColor = '#b02f00';
        }else{
            icons.forEach(icon => {
                icon.style.filter = 'invert(0)';
            });
            mathBackground.style.backgroundColor = '#8dcdff';
            ELABackground.style.backgroundColor = '#f9abff';
            scienceBackground.style.backgroundColor = '#78dc77';
            socialStudiesBackground.style.backgroundColor = '#ffb5a0';
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
});
