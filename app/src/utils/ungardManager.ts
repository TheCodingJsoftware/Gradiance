import { Ungard } from "./ungard";

export default class UngardManager {
    private ungards: Ungard[] = [];

    constructor() {
        this.loadUngards();
    }

    private async loadUngards() {
        try {
            const response = await fetch('/static/data/ungards.json');
            if (response.ok) {
                const data = await response.json();
                this.ungards = data.map((ungard: { id: number, body: string, strengths: { [key: string]: number } }) =>
                    new Ungard(ungard.id, ungard.body, ungard.strengths)
                );
                console.log('Ungards loaded:', this.ungards);
            } else {
                console.error('Failed to load ungards:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading ungards:', error);
        }
    }

    public async load(): Promise<void> {
        await this.loadUngards();
    }

    public getUngards(): Ungard[] {
        return this.ungards;
    }

    public getUngardById(id: number): Ungard | undefined {
        return this.ungards.find(ungard => ungard.id === id);
    }
}

