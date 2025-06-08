import {
    Scene,
    TransformNode,
    Vector3,
    KeyboardEventTypes,
    ActionManager,
    Space
} from "@babylonjs/core";

export default class CharacterController {
    // These are injected by the Babylon.js Editor
    public scene: Scene;
    public transform: TransformNode;

    private inputMap: { [key: string]: boolean } = {};
    private speed: number = 0.1;

    public onInitialize(): void {
        // Setup keyboard input tracking
        if (!this.scene.actionManager) {
            this.scene.actionManager = new ActionManager(this.scene);
        }

        this.scene.onKeyboardObservable.add((kbInfo) => {
            const key = kbInfo.event.key.toLowerCase();
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                this.inputMap[key] = true;
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                this.inputMap[key] = false;
            }
        });

        // Movement update per frame
        this.scene.onBeforeRenderObservable.add(() => {
            this._updateMovement();
        });
    }

    public onStart(): void {
        // Called once when the scene starts playing
        console.log("CharacterController started for", this.transform.name);
    }

    private _updateMovement(): void {
        let move = new Vector3(0, 0, 0);

        if (this.inputMap["w"]) move.z += 1;
        if (this.inputMap["s"]) move.z -= 1;
        if (this.inputMap["a"]) move.x -= 1;
        if (this.inputMap["d"]) move.x += 1;

        if (move.lengthSquared() > 0) {
            move = move.normalize().scale(this.speed);
            this.transform.translate(move, 1, Space.LOCAL);
        }
    }
}
