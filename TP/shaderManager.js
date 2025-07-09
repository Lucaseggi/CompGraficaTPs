import { VignetteShader } from "./shaders/VignetteShader";
import { NoiseShader } from "./shaders/NoiseShader";
import { HueShader } from "./shaders/HueShader";
import { SepiaShader } from "./shaders/SepiaShader";
import { RippleShader } from "./shaders/RippleShader";
import { NGGYU } from "./shaders/NGGYU";

import { ShaderPass } from "three/examples/jsm/Addons.js";
import { DitherShader } from "./shaders/DitherShader";

class ShaderManager {
    constructor(composer) {
        this.composer = composer;
        this.shaderPasses = new Map();

        this.initShaderPasses();
    }

    initShaderPasses() {
        this.shaderPasses.set('Lacrimosa', [
            new ShaderPass(VignetteShader),
            // new ShaderPass(FilmShader)
        ]);

        this.shaderPasses.set('BadToTheBone', [
            // new ShaderPass(NoiseShader),
            new ShaderPass(DitherShader)
        ]);

        this.shaderPasses.set('MA', [
            new ShaderPass(HueShader)
        ]);

        this.shaderPasses.set('ForOneHead', [
            new ShaderPass(SepiaShader),
            // new ShaderPass(FilmShader)
        ]);

        this.shaderPasses.set('KrustyKrabTheme', [
            new ShaderPass(RippleShader)
        ]);

        this.shaderPasses.set('NGGYU', [
            new ShaderPass(NGGYU)
            // new ShaderPass(FilmShader)
        ]);
    }

    applyShaderStack(songName) {
        this.clearShaderPasses();

        const passes = this.shaderPasses.get(songName);
        if (passes) {
            passes.forEach(pass => this.composer.addPass(pass));
        }
    }

    clearShaderPasses() {
        // Clear all non-RenderPass passes from the composer
        while (this.composer.passes.length > 1) {
            this.composer.removePass(this.composer.passes[this.composer.passes.length - 1]);
        }
    }
}

export default ShaderManager;