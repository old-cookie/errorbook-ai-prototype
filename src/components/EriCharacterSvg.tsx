import { useState, useEffect, useId } from 'react';
import { motion } from 'motion/react';
import { EriColorVariant, getEriColorTheme } from '../data/eriColor';
import { EriEvolutionPath } from '../data/appState';

export type EriCharacterState = 'idle' | 'thinking' | 'hint' | 'correct' | 'wrong' | 'speaking' | 'listening';

interface EriCharacterSvgProps {
  state: EriCharacterState;
  reduceMotion?: boolean;
  size?: number;
  className?: string;
  showLabel?: boolean;
  colorVariant?: EriColorVariant;
  hatId?: string;
  clothesId?: string;
  evolutionPath?: EriEvolutionPath;
}

const stateLabelMap: Record<EriCharacterState, string> = {
  idle: 'Ready',
  thinking: 'Thinking',
  hint: 'Hint ready',
  correct: 'Great job',
  wrong: 'Try again',
  speaking: 'Speaking',
  listening: 'Listening',
};

export function EriCharacterSvg({
  state,
  reduceMotion = false,
  size = 128,
  className = '',
  showLabel = true,
  colorVariant = 'violet',
  hatId = 'hat-basic',
  clothesId = 'clothes-basic',
  evolutionPath = 3,
}: EriCharacterSvgProps) {
  const shouldAnimate = !reduceMotion;
  const theme = getEriColorTheme(colorVariant);
  const resolvedHatId = evolutionPath === 3 ? hatId : evolutionPath === 2 ? 'hat-basic' : '';
  const resolvedClothesId = evolutionPath === 3 ? clothesId : evolutionPath === 2 ? 'clothes-basic' : '';
  const isEggStage = evolutionPath === 1;
  const svgId = useId().replace(/:/g, '');
  const bodyGradientId = `eriBody-${svgId}`;
  const highlightGradientId = `eriHighlight-${svgId}`;
  const dropShadowId = `dropShadow-${svgId}`;

  const [idleVariant, setIdleVariant] = useState<number>(0);

  useEffect(() => {
    if (state !== 'idle' || !shouldAnimate) {
      setIdleVariant(0);
      return;
    }

    const interval = setInterval(() => {
      setIdleVariant(Math.floor(Math.random() * 4));
    }, 3000);

    return () => clearInterval(interval);
  }, [state, shouldAnimate]);

  // 動態計算表情參數
  const eyeY = state === 'thinking' ? 38 : state === 'wrong' ? 42 : state === 'listening' ? 39 : 40;
  const eyeScaleY = state === 'correct' ? 0.2 : 1; // 答對時笑眼

  // 嘴巴路徑
  const mouthPath =
    state === 'correct'
      ? 'M42 52 Q50 60 58 52' // 大笑
      : state === 'wrong'
        ? 'M44 54 Q50 50 56 54' // 難過/波浪
        : state === 'hint'
          ? 'M45 51 Q50 54 55 51' // 微笑
          : state === 'speaking'
            ? 'M46 52 A4 3 0 1 0 54 52 A4 3 0 1 0 46 52' // 說話（橢圓）
            : state === 'thinking'
              ? 'M46 52 Q50 52 54 52' // 抿嘴
              : 'M45 52 Q50 54 55 52'; // 預設微笑

  const speakingMouthFrames = [
    'M47 52 A3 2.2 0 1 0 53 52 A3 2.2 0 1 0 47 52',
    'M44 52 A6 4.8 0 1 0 56 52 A6 4.8 0 1 0 44 52',
    'M45 52 A5 3.6 0 1 0 55 52 A5 3.6 0 1 0 45 52',
  ];

  // 眉毛路徑
  const leftEyebrow = state === 'wrong' ? 'M32 32 Q36 30 40 34' : state === 'thinking' ? 'M32 34 Q36 32 40 32' : state === 'correct' ? 'M32 34 Q36 30 40 34' : 'M32 32 Q36 30 40 32';
  const rightEyebrow = state === 'wrong' ? 'M68 32 Q64 30 60 34' : state === 'thinking' ? 'M68 32 Q64 32 60 34' : state === 'correct' ? 'M68 34 Q64 30 60 34' : 'M68 32 Q64 30 60 32';

  const clothesOverlay =
    resolvedClothesId === 'clothes-hoodie' ? (
      <g>
        <path d="M32 86 Q50 83 68 86 L72 108 Q50 112 28 108 Z" fill="#7C3AED" opacity="0.88" />
        <path d="M40 84 Q50 79 60 84 Q54 90 50 90 Q46 90 40 84" fill="#A78BFA" opacity="0.95" />
        <path d="M43 90 Q50 94 57 90" stroke="#DDD6FE" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ) : resolvedClothesId === 'clothes-jacket' ? (
      <g>
        <path d="M30 84 Q50 81 70 84 L74 109 Q50 114 26 109 Z" fill="#1D4ED8" opacity="0.9" />
        <rect x="48" y="84" width="4" height="26" rx="1.6" fill="#BFDBFE" opacity="0.95" />
        <path d="M34 92 L46 90" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M66 92 L54 90" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ) : null;

  const hatOverlay =
    resolvedHatId === 'hat-cap' ? (
      <g>
        <path d="M28 22 Q50 10 72 22 Q50 28 28 22" fill="#2563EB" />
        <path d="M56 22 Q72 24 78 30 Q64 30 54 27" fill="#1D4ED8" />
        <ellipse cx="50" cy="22" rx="22" ry="4" fill="#93C5FD" opacity="0.75" />
      </g>
    ) : resolvedHatId === 'hat-star' ? (
      <g>
        <path d="M26 22 Q50 8 74 22 L70 27 Q50 20 30 27 Z" fill="#7C3AED" />
        <path d="M50 9 L52.4 14.2 L58 14.7 L53.8 18.3 L55 24 L50 21 L45 24 L46.2 18.3 L42 14.7 L47.6 14.2 Z" fill="#FDE68A" />
      </g>
    ) : null;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 120"
        role="img"
        aria-label={`Eri ${stateLabelMap[state]}`}
        initial={false}
        animate={
          shouldAnimate
            ? {
              y: state === 'thinking' ? [0, -4, 0] : state === 'idle' && idleVariant === 2 ? [0, -8, 0, -8, 0] : [0, -2, 0],
            }
            : undefined
        }
        transition={
          shouldAnimate
            ? {
              duration: state === 'thinking' ? 1.5 : state === 'idle' && idleVariant === 2 ? 1.5 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
            : undefined
        }
      >
        <defs>
          {/* 主體漸層 */}
          <linearGradient id={bodyGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.bodyStart} />
            <stop offset="50%" stopColor={theme.bodyMid} />
            <stop offset="100%" stopColor={theme.bodyEnd} />
          </linearGradient>

          {/* 內部發光/高光 */}
          <radialGradient id={highlightGradientId} cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* 陰影 */}
          <filter id={dropShadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={theme.shadow} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 背景光暈 */}
        <motion.circle
          cx="50"
          cy="46"
          r="44"
          fill={theme.halo}
          initial={false}
          animate={shouldAnimate ? { scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] } : undefined}
          transition={shouldAnimate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {isEggStage && (
          <motion.g
            initial={false}
            animate={shouldAnimate ? { y: [0, -2, 0] } : undefined}
            transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
          >
            <path d="M50 16 Q76 30 74 62 Q72 98 50 108 Q28 98 26 62 Q24 30 50 16 Z" fill={`url(#${bodyGradientId})`} filter={`url(#${dropShadowId})`} />
            <path d="M50 16 Q76 30 74 62 Q72 98 50 108 Q28 98 26 62 Q24 30 50 16 Z" fill={`url(#${highlightGradientId})`} />
            <ellipse cx="50" cy="46" rx="18" ry="13" fill="#1E1B4B" opacity="0.72" />
            <circle cx="42" cy="46" r="3" fill="#4ADE80" />
            <circle cx="58" cy="46" r="3" fill="#4ADE80" />
            <path d="M44 55 Q50 58 56 55" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" fill="none" />
          </motion.g>
        )}

        {/* 身體 (下半部) */}
        {!isEggStage && (
          <motion.g
            initial={false}
            animate={shouldAnimate ? { scaleY: state === 'thinking' ? [1, 0.95, 1] : [1, 0.98, 1] } : undefined}
            transition={shouldAnimate ? { duration: state === 'thinking' ? 1.5 : 2.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
            style={{ transformOrigin: '50px 100px' }}
          >
            {/* 脖子關節 */}
            <rect x="42" y="76" width="16" height="10" rx="2" fill={theme.bodyEnd} />
            <rect x="44" y="78" width="12" height="2" fill="#1E1B4B" opacity="0.3" />
            <rect x="44" y="82" width="12" height="2" fill="#1E1B4B" opacity="0.3" />

            {/* 軀幹 */}
            <path d="M30 84 Q50 80 70 84 L76 110 Q50 116 24 110 Z" fill={`url(#${bodyGradientId})`} filter={`url(#${dropShadowId})`} />
            <path d="M30 84 Q50 80 70 84 L76 110 Q50 116 24 110 Z" fill={`url(#${highlightGradientId})`} />

            {clothesOverlay}

            {/* 肚子上的螢幕/核心 */}
            <circle cx="50" cy="96" r="8" fill="#1E1B4B" opacity="0.8" />
            <motion.circle
              cx="50"
              cy="96"
              r="4"
              fill={state === 'correct' ? '#4ADE80' : state === 'wrong' ? '#F87171' : state === 'hint' ? '#FDE68A' : theme.accent}
              animate={shouldAnimate ? { opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] } : undefined}
              transition={shouldAnimate ? { duration: 2, repeat: Infinity } : undefined}
            />
          </motion.g>
        )}

        {/* 左手 */}
        {!isEggStage && (
          <motion.g
            initial={false}
            style={{ transformOrigin: '30px 86px' }}
          >
            <path d="M30 86 Q20 96 24 106" stroke={`url(#${bodyGradientId})`} strokeWidth="8" strokeLinecap="round" fill="none" filter={`url(#${dropShadowId})`} />
            <circle cx="24" cy="106" r="5" fill={theme.accent} />
          </motion.g>
        )}

        {/* 右手 */}
        {!isEggStage && (
          <motion.g
            initial={false}
            style={{ transformOrigin: '70px 86px' }}
          >
            <path d="M70 86 Q80 96 76 106" stroke={`url(#${bodyGradientId})`} strokeWidth="8" strokeLinecap="round" fill="none" filter={`url(#${dropShadowId})`} />
            <circle cx="76" cy="106" r="5" fill={theme.accent} />
          </motion.g>
        )}

        {/* 頭部群組 */}
        {!isEggStage && (
          <motion.g
            initial={false}
            animate={
              shouldAnimate
                ? { rotate: state === 'thinking' ? [-2, 2, -2] : state === 'listening' ? 0 : state === 'idle' && idleVariant === 1 ? [0, -8, 8, 0] : [-1, 1, -1] }
                : undefined
            }
            transition={shouldAnimate ? { duration: state === 'idle' && idleVariant === 1 ? 3 : 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
            style={{ transformOrigin: '50px 76px' }}
          >
            {/* 機器人耳朵/天線 (左) */}
            <motion.g
              initial={false}
              animate={
                shouldAnimate
                  ? { rotate: state === 'thinking' ? [-5, 5, -5] : state === 'listening' ? 0 : state === 'idle' && idleVariant === 3 ? [0, -15, 15, -10, 10, 0] : [-2, 2, -2] }
                  : undefined
              }
              transition={shouldAnimate ? { duration: state === 'idle' && idleVariant === 3 ? 1.5 : 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
              style={{ transformOrigin: '20px 46px' }}
            >
              <rect x="12" y="38" width="8" height="16" rx="4" fill={theme.accent} />
              <circle cx="12" cy="46" r="4" fill={theme.accentSoft} />
            </motion.g>

            {/* 機器人耳朵/天線 (右) */}
            <motion.g
              initial={false}
              animate={
                shouldAnimate
                  ? { rotate: state === 'thinking' ? [5, -5, 5] : state === 'listening' ? 0 : state === 'idle' && idleVariant === 3 ? [0, 15, -15, 10, -10, 0] : [2, -2, 2] }
                  : undefined
              }
              transition={shouldAnimate ? { duration: state === 'idle' && idleVariant === 3 ? 1.5 : 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 } : undefined}
              style={{ transformOrigin: '80px 46px' }}
            >
              <rect x="80" y="38" width="8" height="16" rx="4" fill={theme.accent} />
              <circle cx="88" cy="46" r="4" fill={theme.accentSoft} />
            </motion.g>

            {/* 頭部主體 */}
            <circle cx="50" cy="46" r="36" fill={`url(#${bodyGradientId})`} filter={`url(#${dropShadowId})`} />
            <circle cx="50" cy="46" r="36" fill={`url(#${highlightGradientId})`} />

            {hatOverlay}

            {/* 臉部面板 (深色玻璃感) */}
            <rect x="26" y="28" width="48" height="36" rx="18" fill="#1E1B4B" opacity="0.8" />
            <rect x="28" y="30" width="44" height="32" rx="16" fill="white" opacity="0.05" />

            {/* 眉毛 */}
            <motion.path
              d={leftEyebrow}
              stroke={theme.accent}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ d: leftEyebrow }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d={rightEyebrow}
              stroke={theme.accent}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ d: rightEyebrow }}
              transition={{ duration: 0.3 }}
            />

            {/* 眼睛 (左) */}
            <motion.circle
              cx="36"
              cy={eyeY}
              r="4"
              fill={state === 'wrong' ? '#F87171' : '#4ADE80'}
              initial={false}
              animate={
                shouldAnimate
                  ? {
                    scaleY: state === 'correct' ? [0.2, 0.2, 0.2] : state === 'speaking' ? [1, 1, 1, 1] : [1, 1, 0.1, 1],
                    cx: state === 'idle' && idleVariant === 1 ? [36, 30, 42, 36] : 36,
                    cy: eyeY
                  }
                  : { cy: eyeY, scaleY: eyeScaleY, cx: 36 }
              }
              transition={
                shouldAnimate && state !== 'correct'
                  ? {
                    duration: state === 'idle' && idleVariant === 1 ? 3 : 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: state === 'idle' && idleVariant === 1 ? [0, 0.4, 0.8, 1] : [0, 0.92, 0.96, 1],
                  }
                  : { duration: 0.3 }
              }
            />

            {/* 眼睛 (右) */}
            <motion.circle
              cx="64"
              cy={eyeY}
              r="4"
              fill={state === 'wrong' ? '#F87171' : '#4ADE80'}
              initial={false}
              animate={
                shouldAnimate
                  ? {
                    scaleY: state === 'correct' ? [0.2, 0.2, 0.2] : state === 'speaking' ? [1, 1, 1, 1] : [1, 1, 0.1, 1],
                    cx: state === 'idle' && idleVariant === 1 ? [64, 58, 70, 64] : 64,
                    cy: eyeY
                  }
                  : { cy: eyeY, scaleY: eyeScaleY, cx: 64 }
              }
              transition={
                shouldAnimate && state !== 'correct'
                  ? {
                    duration: state === 'idle' && idleVariant === 1 ? 3 : 3.5,
                    delay: state === 'idle' && idleVariant === 1 ? 0 : 0.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: state === 'idle' && idleVariant === 1 ? [0, 0.4, 0.8, 1] : [0, 0.92, 0.96, 1],
                  }
                  : { duration: 0.3 }
              }
            />

            {/* 腮紅 */}
            {state === 'correct' && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 0.5 }}>
                <ellipse cx="30" cy="48" rx="4" ry="2" fill="#F472B6" />
                <ellipse cx="70" cy="48" rx="4" ry="2" fill="#F472B6" />
              </motion.g>
            )}

            {/* 嘴巴 */}
            <motion.path
              d={mouthPath}
              stroke={state === 'wrong' ? '#F87171' : '#4ADE80'}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={
                state === 'speaking' && shouldAnimate
                  ? { d: speakingMouthFrames }
                  : { d: mouthPath }
              }
              transition={
                state === 'speaking' && shouldAnimate
                  ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 300, damping: 20 }
              }
            />

            {/* 狀態特效：思考中 (載入點點) */}
            {state === 'thinking' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={shouldAnimate ? { opacity: 1 } : { opacity: 1 }}
              >
                <motion.circle cx="42" cy="18" r="2" fill={theme.accent} animate={shouldAnimate ? { opacity: [0.3, 1, 0.3] } : undefined} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} />
                <motion.circle cx="50" cy="16" r="2.5" fill={theme.accentSoft} animate={shouldAnimate ? { opacity: [0.3, 1, 0.3] } : undefined} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                <motion.circle cx="58" cy="18" r="2" fill={theme.accent} animate={shouldAnimate ? { opacity: [0.3, 1, 0.3] } : undefined} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
              </motion.g>
            )}
          </motion.g>
        )}

        {/* 狀態特效：提示 (燈泡光芒) */}
        {state === 'hint' && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={
              shouldAnimate
                ? {
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.6, 1, 0.6],
                }
                : { scale: 1, opacity: 1 }
            }
            transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
            style={{ transformOrigin: '50px 10px' }}
          >
            <path d="M50 6 L50 12 M42 10 L46 14 M58 10 L54 14" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}

        {/* 狀態特效：答對 (星星) */}
        {state === 'correct' && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={shouldAnimate ? { opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8], rotate: [0, 45, 90] } : { opacity: 1, scale: 1 }}
            transition={shouldAnimate ? { duration: 1.5, repeat: Infinity } : undefined}
            style={{ transformOrigin: '80px 16px' }}
          >
            <path d="M80 8 L82 14 L88 15 L83 19 L84 25 L80 22 L76 25 L77 19 L72 15 L78 14 Z" fill="#FDE68A" />
          </motion.g>
        )}

        {/* 狀態特效：答錯 (驚嘆號/汗滴) */}
        {state === 'wrong' && (
          <motion.g
            initial={{ opacity: 0, y: -5 }}
            animate={shouldAnimate ? { opacity: [0, 1, 0], y: [-5, 0, 5] } : { opacity: 1, y: 0 }}
            transition={shouldAnimate ? { duration: 1.5, repeat: Infinity } : undefined}
          >
            <path d="M80 16 Q85 21 80 26 Q75 21 80 16" fill="#60A5FA" opacity="0.6" />
          </motion.g>
        )}

        {state === 'speaking' && (
          <motion.g
            initial={{ opacity: 0.3 }}
            animate={shouldAnimate ? { opacity: [0.3, 0.9, 0.3], scale: [0.95, 1.05, 0.95] } : { opacity: 0.9 }}
            transition={shouldAnimate ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
          >
            <path d="M66 47 Q74 52 66 57" stroke="#86EFAC" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M70 43 Q80 52 70 61" stroke="#60A5FA" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M74 39 Q86 52 74 65" stroke="#38BDF8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </motion.g>
        )}

        {state === 'listening' && (
          <motion.g
            initial={{ opacity: 0.2 }}
            animate={shouldAnimate ? { opacity: [0.2, 0.8, 0.2] } : { opacity: 0.8 }}
            transition={shouldAnimate ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : undefined}
          >
            <path d="M16 35 Q6 46 16 57" stroke="#86EFAC" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M12 31 Q0 46 12 61" stroke="#60A5FA" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M8 27 Q-6 46 8 65" stroke="#38BDF8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </motion.g>
        )}
      </motion.svg>

      {showLabel && <p className="mt-2 text-xs font-semibold text-gray-600">Eri • {stateLabelMap[state]}</p>}
    </div>
  );
}
