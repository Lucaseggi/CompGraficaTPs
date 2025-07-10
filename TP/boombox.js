import * as THREE from 'three';
import { ModeRegistry } from './warehouse/modes/ModeRegistry';

const boomboxColors = [0xA52A2A, 0x0000ff, 0x00ff00];
const BoomboxMaterial = THREE.MeshStandardMaterial;

class Boombox {
    constructor(scene, gui, camera, shaderManager, warehouse) {
        this.scene = scene;
        this.gui = gui;
        this.shaderManager = shaderManager;
        this.sceneWarehouse = warehouse;

        this.songs = [
            './TP/songs/ForOneHead.mp3',
            './TP/songs/BadToTheBone.mp3',
            // './TP/songs/Bonetrousle.mp3',
            './TP/songs/MA.mp3',
            './TP/songs/KrustyKrabTheme.mp3',
            './TP/songs/NGGYU.mp3',
            './TP/songs/Lacrimosa.mp3',
        ];

        this.currentSongIndex = 0;

        // Initialize Audio
        this.listener = new THREE.AudioListener();
        if (camera) camera.add(this.listener);
        // this.createStaticNoise(listener);

        this.sound = new THREE.PositionalAudio(this.listener);
        this.sound.setRefDistance(5);
        this.sound.setRolloffFactor(0.6);
        this.sound.setDistanceModel('inverse');

        this.audioLoader = new THREE.AudioLoader();

        this.loadSong(this.currentSongIndex);

        this.addBoomboxToGui();

        // Physical Boombox
        this.height = 2;
        this.width = 6;
        this.depth = 1;

        this.structure = this.buildBoombox();
        this.updateBarPosition();
        this.updateVolumeSpinnerRotation();

        this.structure.add(this.sound);
    }

    togglePlayback = () => {
        if (!this.sound || !this.sound.buffer) {
            console.warn('Sound not ready');
            return;
        }

        if (this.sound.isPlaying) {
            this.sound.pause();
            this.params.isPlaying = false;
            this.playPauseController.name('▶️ Play');
            this.shaderManager.clearShaderPasses();
            this.sceneWarehouse?.applyMode(ModeRegistry["BaseMode"]?.())
        } else {
            this.sound.play();
            this.params.isPlaying = true;
            this.playPauseController.name('⏸️ Pausa');

            const songFile = this.songs[this.currentSongIndex];
            const songName = this.getSongName(songFile);
            this.shaderManager.applyShaderStack(songName);
            const mode = ModeRegistry[songName]?.();
            if (mode) this.sceneWarehouse?.applyMode(mode);
        }
    };

    prevSong = () => {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        this.updateBarPosition();

        if (this.params.isPlaying) {
            const songFile = this.songs[this.currentSongIndex];
            const songName = this.getSongName(songFile);
            this.shaderManager.applyShaderStack(songName);
            this.sound.play();
            const mode = ModeRegistry[songName]?.();
            if (mode) this.sceneWarehouse?.applyMode(mode);
        } else {
            this.shaderManager.clearShaderPasses();
        }
    };

    nextSong = () => {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        this.updateBarPosition();

        if (this.params.isPlaying) {
            const songFile = this.songs[this.currentSongIndex];
            const songName = this.getSongName(songFile);
            this.shaderManager.applyShaderStack(songName);
            this.sound.play();
            const mode = ModeRegistry[songName]?.();
            if (mode) this.sceneWarehouse?.applyMode(mode);
        } else {
            this.shaderManager.clearShaderPasses();
        }
    };

    addBoomboxToGui() {
        const boomboxFolder = this.gui.addFolder('Radio');

        this.params = {
            isPlaying: false,
            volume: 0.5,

        };

        this.playPauseController = boomboxFolder.add({ playPause: () => this.togglePlayback() }, 'playPause').name('▶️ Play');
        boomboxFolder.add({ prev: () => this.prevSong() }, 'prev').name('⏪ Prev');
        boomboxFolder.add({ next: () => this.nextSong() }, 'next').name('⏩ Prox');
        boomboxFolder.add(this.params, 'volume', 0, 1).step(0.01).name('Volumen').onChange((value) => {
            this.sound.setVolume(value);
            this.updateVolumeSpinnerRotation();
        });

    }

    getSongName(filePath) {
        const base = filePath.split('/').pop();
        return base.replace('.mp3', '');
    }


    loadSong(index) {
        this.audioLoader.load(this.songs[index], (buffer) => {
            this.sound.stop();
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(this.params.volume);
            if (this.params.isPlaying) this.sound.play();
        });
    }

    updateVolumeSpinnerRotation() {
        if (!this.volumeSpinner) return;
        const maxRotation = Math.PI;
        this.volumeSpinner.rotation.z = Math.PI / 2 - this.params.volume * maxRotation;
    }

    buildVolumeSpinner() {
        const group = new THREE.Group();

        const spinGeometry = new THREE.CylinderGeometry(this.height / 2.5, this.height / 2.5, this.depth);
        const spinMaterial = new BoomboxMaterial({
            color: boomboxColors[1],
        });
        const spin = new THREE.Mesh(spinGeometry, spinMaterial);
        spin.rotation.x = Math.PI / 2;
        group.add(spin);

        const barGeometry = new THREE.BoxGeometry(0.1, this.height / 5, this.depth + 0.1);
        const barMaterial = new BoomboxMaterial({
            color: boomboxColors[2],
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.y = this.height / 2.5 - 0.16;
        group.add(bar);

        this.volumeSpinner = group;
        return group;
    }

    updateBarPosition() {
        if (!this.songMiniBar) return;
        this.songMiniBar.position.x = - this.width / 6 - 0.4 + this.currentSongIndex / this.songs.length * 3.32;
    }

    buildSongBar() {
        const group = new THREE.Group();

        const longBarGeometry = new THREE.BoxGeometry(this.width / 2, this.height / 4, this.depth);
        const longBarMaterial = new BoomboxMaterial({
            color: boomboxColors[1],
        });
        const longBar = new THREE.Mesh(longBarGeometry, longBarMaterial);
        group.add(longBar);

        const barGeometry = new THREE.BoxGeometry(0.1, this.height / 5, this.depth + 0.1);
        const barMaterial = new BoomboxMaterial({
            color: boomboxColors[2],
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        group.add(bar);

        group.position.x = - this.width / 6;
        this.songMiniBar = bar;
        return group;
    }

    buildBoombox() {
        const boombox = new THREE.Group();

        const boomboxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const boomboxMaterial = new BoomboxMaterial({
            color: boomboxColors[0],
        });
        const boomboxCarcass = new THREE.Mesh(boomboxGeometry, boomboxMaterial);
        boombox.add(boomboxCarcass);

        const volumeSpinner = this.buildVolumeSpinner();
        volumeSpinner.position.z = 0.2;
        volumeSpinner.position.x = this.width / 3.4;
        boombox.add(volumeSpinner);

        const songBar = this.buildSongBar();
        songBar.position.z = 0.2;
        boombox.add(songBar);

        return boombox;
    }

    createStaticNoise(listener) {
        // Create noise gain node
        this.staticGain = listener.context.createGain();
        this.staticGain.gain.value = 0.0; // start muted

        // Create noise generator
        const noiseNode = listener.context.createScriptProcessor(4096, 1, 1);
        noiseNode.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < output.length; i++) {
                output[i] = (Math.random() * 2 - 1) * 0.2; // white noise [-0.2, 0.2]
            }
        };

        // Connect: noiseNode -> gain -> destination
        noiseNode.connect(this.staticGain);
        this.staticGain.connect(listener.context.destination);

        this.staticNode = noiseNode;
    }

    updateStaticVolume(cameraPosition) {
        const boomboxPosition = new THREE.Vector3();
        this.structure.getWorldPosition(boomboxPosition);

        const distance = cameraPosition.distanceTo(boomboxPosition);

        // Map distance to gain: close = 0, far = max
        const maxDistance = 20;
        const minGain = 0.0;
        const maxGain = 0.4;

        const t = Math.min(distance / maxDistance, 1);
        const gain = minGain + t * (maxGain - minGain);

        if (this.staticGain) {
            this.staticGain.gain.value = gain;
        }
    }

}

export default Boombox;