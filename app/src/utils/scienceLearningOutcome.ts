export class ScienceLearningOutcome {
    specificLearningOutcome: string;
    generalLearningOutcomes: string[];
    grade: string;
    id: number;
    cluster: string;

    constructor(
        specificLearningOutcome: string,
        generalLearningOutcomes: string[],
        grade: string,
        id: number,
        cluster: string
    ) {
        this.specificLearningOutcome = specificLearningOutcome;
        this.generalLearningOutcomes = generalLearningOutcomes;
        this.grade = grade;
        this.id = id;
        this.cluster = cluster;
    }
    getID(): string{
        return `${this.grade}.${this.cluster}.${this.id}`;
    }
}
