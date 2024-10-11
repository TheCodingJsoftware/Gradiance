import 'beercss';
import 'material-dynamic-colors';
import '../static/css/curriki-style.css';
import '../static/css/curriki-theme.css';
import '@mdi/font/css/materialdesignicons.min.css';

document.addEventListener('DOMContentLoaded', function () {
    function setTheme(theme: string) {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);

        const themeIcon = document.getElementById("theme-icon") as HTMLElement;
        themeIcon.innerText = theme === "light" ? "dark_mode" : "light_mode";

        const icons = document.querySelectorAll('.icon') as NodeListOf<HTMLElement>;

        const mathBanner = document.getElementById("math-banner") as HTMLElement;
        const ELABanner = document.getElementById("ela-banner") as HTMLElement;
        const scienceBanner = document.getElementById("science-banner") as HTMLElement;
        const socialStudiesBanner = document.getElementById("social-studies-banner") as HTMLElement;

        const mathBackground = document.getElementById("math-background") as HTMLElement;
        const scienceBackground = document.getElementById("science-background") as HTMLElement;
        const ELABackground = document.getElementById("ela-background") as HTMLElement;
        const socialStudiesBackground = document.getElementById("social-studies-background") as HTMLElement;

        if (theme === 'light') {
            icons.forEach(icon => {
                icon.style.filter = 'invert(1)';
            });
            mathBanner.style.backgroundColor = '#006493';
            mathBackground.style.backgroundColor = '#f9f9fc';

            ELABanner.style.backgroundColor = '#9a25ae';
            ELABackground.style.backgroundColor = '#fff7fa';

            scienceBanner.style.backgroundColor = '#006e1c';
            scienceBackground.style.backgroundColor = '#f9faf4';

            socialStudiesBanner.style.backgroundColor = '#b02f00';
            socialStudiesBackground.style.backgroundColor = '#fff8f6';
        } else {
            icons.forEach(icon => {
                icon.style.filter = 'invert(0)';
            });
            mathBanner.style.backgroundColor = '#8dcdff';
            mathBackground.style.backgroundColor = '#111416';

            ELABanner.style.backgroundColor = '#f9abff';
            ELABackground.style.backgroundColor = '#161215';

            scienceBanner.style.backgroundColor = '#78dc77';
            scienceBackground.style.backgroundColor = '#121411';

            socialStudiesBanner.style.backgroundColor = '#ffb5a0';
            socialStudiesBackground.style.backgroundColor = '#181210';
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
