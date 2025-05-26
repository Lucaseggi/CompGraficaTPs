class KeyboardManager {
    constructor() {
        this.keyStates = {};
        this.justPressedKeys = {};
        
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (!this.keyStates[key]) {
                this.justPressedKeys[key] = true; // mark as just pressed
            }
            this.keyStates[key] = true;
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keyStates[key] = false;
            this.justPressedKeys[key] = false;
        });
    }

    isPressed(key) {
        return !!this.keyStates[key.toLowerCase()];
    }

    isJustPressed(key) {
        const lower = key.toLowerCase();
        if (this.justPressedKeys[lower]) {
            this.justPressedKeys[lower] = false;
            return true;
        }
        return false;
    }
}

const keyboardManager = new KeyboardManager();

export default keyboardManager;