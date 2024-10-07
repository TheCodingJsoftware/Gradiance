export class LearningOutcome {
    specificLearningOutcome: string;
    generalLearningOutcomes: string[];
    skills: string[];
    grade: string;
    id: number;
    strand: string;

    constructor(
        specificLearningOutcome: string,
        generalLearningOutcomes: string[],
        skills: string[],
        grade: string,
        id: number,
        strand: string
    ) {
        this.specificLearningOutcome = specificLearningOutcome;
        this.generalLearningOutcomes = generalLearningOutcomes;
        this.skills = skills;
        this.grade = grade;
        this.id = id;
        this.strand = strand;
    }
    getID(): string{
        return `${this.grade}.${this.strand}.${this.id}`;
    }
}
