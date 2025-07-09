import BaseMode from './BaseMode.js';
import BoneMode from './BoneMode.js';
import ChurchMode from './ChurchMode.js';
import GardelMode from './GardelMode.js';
import KrustyMode from './KrustyMode.js';
import MAMode from './MAMode.js';
import RickMode from './RickMode.js';

export const ModeRegistry = {
    "BaseMode": () => new BaseMode(),
    "Lacrimosa": () => new ChurchMode(),
    "BadToTheBone": () => new BoneMode(),
    "MA": () => new MAMode(),
    "ForOneHead": () => new GardelMode(),
    "KrustyKrabTheme": () => new KrustyMode(),
    "NGGYU": () => new RickMode(),
};
