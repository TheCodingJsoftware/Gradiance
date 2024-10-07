import { LearningOutcome } from "./learningOutcome";

export default class MathCurriculumManager {
    private learningOutcomes: LearningOutcome[] = [];
    private strands: string[] = [];
    private skills: string[] = [];

    constructor() {
        this.loadCurriculum();
    }

    private async loadCurriculum() {
        try {
            const response = await fetch('/static/data/mathematics_curriculum.json');
            if (response.ok) {
                const data = await response.json();
                this.learningOutcomes = data.map((learningOutcome: { specific_learning_outcome: string, general_learning_outcomes: string[], skills: string[], grade: string, id: number, strand: string }) =>
                    new LearningOutcome(learningOutcome.specific_learning_outcome, learningOutcome.general_learning_outcomes, learningOutcome.skills, learningOutcome.grade, learningOutcome.id, learningOutcome.strand)
                );
                this.strands = this.learningOutcomes.map(learningOutcome => learningOutcome.strand);
                this.skills = this.learningOutcomes.map(learningOutcome => learningOutcome.skills).flat();
                console.log('Learning outcomes loaded:', this.learningOutcomes);
            } else {
                console.error('Failed to load learning outcomes:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading learning outcomes:', error);
        }
    }
    filterData({ grade, searchQuery, strands, skills }: { grade?: string, searchQuery?: string, strands?: string[], skills?: string[] }): LearningOutcome[] {
        return this.learningOutcomes.filter(outcome => {
            grade = grade?.replace('grade_', '');
            grade = grade?.replace('#', '');
            grade = grade?.toUpperCase();

            const matchesGrade = grade ? outcome.grade === grade : true;
            const matchesSearch = searchQuery ?
                outcome.specificLearningOutcome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                outcome.generalLearningOutcomes.some(glo => glo.toLowerCase().includes(searchQuery.toLowerCase())) ||
                outcome.getID().toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            const matchesStrands = strands ? strands.length > 0 ? strands.includes(outcome.strand) : true : true;
            const matchesSkills = skills ? skills.length > 0 ? skills.every(skill => outcome.skills.includes(skill)) : true : true;

            return matchesGrade && matchesSearch && matchesStrands && matchesSkills;
        });
    }

    public getStrands(grade: string): string[] {
        grade = grade?.replace('grade_', '');
        grade = grade?.replace('#', '');
        grade = grade?.toUpperCase();
        return [...new Set(this.learningOutcomes.filter(outcome => outcome.grade === grade).map(outcome => outcome.strand))];
    }

    public getSkills(grade: string): string[] {
        grade = grade?.replace('grade_', '');
        grade = grade?.replace('#', '');
        grade = grade?.toUpperCase();

        return [...new Set(this.learningOutcomes.filter(outcome => outcome.grade === grade).map(outcome => outcome.skills).flat())];
    }

    public async load(): Promise<void> {
        await this.loadCurriculum();
    }

    public getCurriculum(): LearningOutcome[] {
        return this.learningOutcomes;
    }

    public getAllGrades(): string[] {
        return this.learningOutcomes.map(learningOutcome => learningOutcome.grade);
    }

}

