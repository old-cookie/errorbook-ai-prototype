import { ChevronLeft, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EriCharacterSvg } from '../components/EriCharacterSvg';
import { equipEriItem, purchaseEriItem } from '../data/appState';
import { ERI_CLOTHES_ITEMS, ERI_HAT_ITEMS, EriShopItem } from '../data/eriCustomization';
import { useAppSettings } from '../data/useAppSettings';
import { useGameProgress } from '../data/useGameProgress';

interface EriCustomizeProps {
    onBack: () => void;
}

function ShopSection({
    title,
    items,
    owned,
    equipped,
    onBuy,
    onEquip,
    coins,
}: {
    title: string;
    items: EriShopItem[];
    owned: string[];
    equipped: string;
    onBuy: (item: EriShopItem) => void;
    onEquip: (item: EriShopItem) => void;
    coins: number;
}) {
    return (
        <Card padding="md">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <div className="space-y-3">
                {items.map((item) => {
                    const isOwned = owned.includes(item.id);
                    const isEquipped = equipped === item.id;
                    const canBuy = coins >= item.price;

                    return (
                        <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                </div>
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                                    <Coins size={13} className="text-amber-600" />
                                    <span className="text-xs font-semibold text-amber-700">{item.price}</span>
                                </div>
                            </div>

                            <div className="mt-3">
                                {!isOwned ? (
                                    <Button
                                        onClick={() => onBuy(item)}
                                        size="sm"
                                        fullWidth
                                        disabled={!canBuy}
                                    >
                                        {canBuy ? 'Buy' : 'Not enough coins'}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => onEquip(item)}
                                        size="sm"
                                        fullWidth
                                        variant={isEquipped ? 'secondary' : 'primary'}
                                        disabled={isEquipped}
                                    >
                                        {isEquipped ? 'Equipped' : 'Equip'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

export function EriCustomize({ onBack }: EriCustomizeProps) {
    const appSettings = useAppSettings();
    const progress = useGameProgress();

    const handleBuy = (item: EriShopItem) => {
        purchaseEriItem(item.type, item.id, item.price);
    };

    const handleEquip = (item: EriShopItem) => {
        equipEriItem(item.type, item.id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
                        >
                            <ChevronLeft size={24} className="text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Customize Eri</h1>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
                        <Coins size={15} className="text-amber-600" />
                        <span className="text-sm font-bold text-amber-700">{progress.coins}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-5">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card padding="md" className="bg-gradient-to-r from-[#6C5CE7]/5 to-[#8B7FE8]/10 border-[#6C5CE7]/20">
                        <div className="flex items-center gap-4">
                            <EriCharacterSvg
                                state="idle"
                                reduceMotion={appSettings.reduceMotion}
                                colorVariant={appSettings.eriColor}
                                hatId={progress.equippedHat}
                                clothesId={progress.equippedClothes}
                                size={92}
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-900">Badge Journey Coins Shop</p>
                                <p className="text-xs text-gray-600 mt-1">Buy once, then switch between owned hats and clothes anytime.</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <ShopSection
                        title="Hats"
                        items={ERI_HAT_ITEMS}
                        owned={progress.ownedHats}
                        equipped={progress.equippedHat}
                        onBuy={handleBuy}
                        onEquip={handleEquip}
                        coins={progress.coins}
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <ShopSection
                        title="Clothes"
                        items={ERI_CLOTHES_ITEMS}
                        owned={progress.ownedClothes}
                        equipped={progress.equippedClothes}
                        onBuy={handleBuy}
                        onEquip={handleEquip}
                        coins={progress.coins}
                    />
                </motion.div>
            </div>
        </div>
    );
}
