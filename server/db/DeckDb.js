import {randomUUID} from 'node:crypto';

export class DeckDatabase {
    #deck = new Map();

    create(cardID, cardName) {
        const cardNo = randomUUID()

        this.#deck.set(cardNo, cardID, cardName)
    }

    list() {
        return Array.from(this.#deck.values())
    }
}