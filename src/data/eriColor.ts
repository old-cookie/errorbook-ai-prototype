export type EriColorVariant = 'violet' | 'sky' | 'mint' | 'amber' | 'rose';

export interface EriColorTheme {
    label: string;
    bodyStart: string;
    bodyMid: string;
    bodyEnd: string;
    accent: string;
    accentSoft: string;
    halo: string;
    shadow: string;
}

export const ERI_COLOR_THEMES: Record<EriColorVariant, EriColorTheme> = {
    violet: {
        label: 'Violet',
        bodyStart: '#8B7FE8',
        bodyMid: '#6C5CE7',
        bodyEnd: '#4A3BCE',
        accent: '#A78BFA',
        accentSoft: '#C4B5FD',
        halo: '#EFEAFF',
        shadow: '#6C5CE7',
    },
    sky: {
        label: 'Sky',
        bodyStart: '#60A5FA',
        bodyMid: '#38BDF8',
        bodyEnd: '#0EA5E9',
        accent: '#38BDF8',
        accentSoft: '#60A5FA',
        halo: '#EFEAFF',
        shadow: '#60A5FA',
    },
    mint: {
        label: 'Mint',
        bodyStart: '#34D399',
        bodyMid: '#10B981',
        bodyEnd: '#10B981',
        accent: '#86EFAC',
        accentSoft: '#34D399',
        halo: '#EFEAFF',
        shadow: '#10B981',
    },
    amber: {
        label: 'Amber',
        bodyStart: '#FBBF24',
        bodyMid: '#F59E0B',
        bodyEnd: '#F97316',
        accent: '#FDE68A',
        accentSoft: '#FBBF24',
        halo: '#EFEAFF',
        shadow: '#F59E0B',
    },
    rose: {
        label: 'Rose',
        bodyStart: '#F472B6',
        bodyMid: '#F472B6',
        bodyEnd: '#F97316',
        accent: '#F472B6',
        accentSoft: '#F472B6',
        halo: '#EFEAFF',
        shadow: '#F472B6',
    },
};

export function getEriColorTheme(variant: EriColorVariant): EriColorTheme {
    return ERI_COLOR_THEMES[variant] ?? ERI_COLOR_THEMES.violet;
}
