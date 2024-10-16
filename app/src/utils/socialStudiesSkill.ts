export class SocialStudiesSkill {
    specificLearningOutcome: string;
    generalLearningOutcome: string;
    skillType: string;
    id: string;
    grades: string[];

    constructor(
        specificLearningOutcome: string,
        generalLearningOutcome: string,
        skillType: string,
        grades: string[],
        id: string
    ) {
        this.generalLearningOutcome = generalLearningOutcome;
        this.skillType = skillType;
        this.specificLearningOutcome = specificLearningOutcome;
        this.id = id;
        this.grades = grades;
    }

    getID(grade: string): string {
        return `${grade}-S-${this.id}`;
    }
}
