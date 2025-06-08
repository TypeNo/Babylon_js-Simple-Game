import { Scene, TransformNode } from "@babylonjs/core";
export default class CharacterController {
    scene: Scene;
    transform: TransformNode;
    private inputMap;
    private speed;
    onInitialize(): void;
    onStart(): void;
    private _updateMovement;
}
