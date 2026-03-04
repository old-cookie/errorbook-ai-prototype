export type EriItemType = 'hat' | 'clothes';

export interface EriShopItem {
    id: string;
    type: EriItemType;
    name: string;
    price: number;
    description: string;
}

export const ERI_HAT_ITEMS: EriShopItem[] = [
    {
        id: 'hat-cap',
        type: 'hat',
        name: 'Sky Cap',
        price: 120,
        description: 'A sporty cap for focused missions.',
    },
    {
        id: 'hat-star',
        type: 'hat',
        name: 'Star Hat',
        price: 160,
        description: 'A shiny star hat from Badge Journey.',
    },
];

export const ERI_CLOTHES_ITEMS: EriShopItem[] = [
    {
        id: 'clothes-hoodie',
        type: 'clothes',
        name: 'Cozy Hoodie',
        price: 140,
        description: 'Warm hoodie for daily practice.',
    },
    {
        id: 'clothes-jacket',
        type: 'clothes',
        name: 'Comet Jacket',
        price: 180,
        description: 'A premium jacket for high streak days.',
    },
];
