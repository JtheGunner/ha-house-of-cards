export interface CardDefinition {
  tag: string;
  ctor: CustomElementConstructor;
  name: string;
  description: string;
  editorTag?: string;
  editorCtor?: CustomElementConstructor;
  preview?: boolean;
}

export interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

/** Every card of the bundle. New cards add one entry here. */
export const cards: CardDefinition[] = [];

function defineOnce(tag: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

export function registerCards(definitions: CardDefinition[] = cards): void {
  window.customCards ??= [];
  for (const card of definitions) {
    defineOnce(card.tag, card.ctor);
    if (card.editorTag && card.editorCtor) defineOnce(card.editorTag, card.editorCtor);
    if (!window.customCards.some((entry) => entry.type === card.tag)) {
      window.customCards.push({
        type: card.tag,
        name: card.name,
        description: card.description,
        preview: card.preview ?? false,
      });
    }
  }
}
