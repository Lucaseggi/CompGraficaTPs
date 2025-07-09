import BaseMode from './BaseMode.js';
import BoneMode from './BoneMode.js';
import GardelMode from './GardelMode.js';
import KrustyMode from './KrustyMode.js';
import MAMode from './MAMode.js';
import RickMode from './RickMode.js';

export const ModeRegistry = {
    "BaseMode": () => new BaseMode(),
    // "Lacrimosa": () => new MAMode(),
    "BadToTheBone": () => new BoneMode(),
    "MA": () => new MAMode(),
    "ForOneHead": () => new GardelMode(),
    "KrustyKrabTheme": () => new KrustyMode(),
    "NGGYU": () => new RickMode(),
};
