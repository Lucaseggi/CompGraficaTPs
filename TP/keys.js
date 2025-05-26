class KeyboardManager {
    constructor() {
        this.keyStates = {};

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (!this.keyStates[key]) {
                this.keyStates[key] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keyStates[key] = false;
        });
    }

    isPressed(key) {
        return !!this.keyStates[key.toLowerCase()];
    }
}

const keyboardManager = new KeyboardManager();

export default keyboardManager;