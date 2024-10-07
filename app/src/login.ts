import 'beercss';
import 'material-dynamic-colors';
import 'remixicon/fonts/remixicon.css';
import '../static/css/style.css';
import '../static/css/theme.css';

document.addEventListener('DOMContentLoaded', function () {
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
