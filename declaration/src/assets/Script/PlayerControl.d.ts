import { Scene, TransformNode } from "@babylonjs/core";
export default class CharacterController {
    private scene;
    private entity;
    private inputMap;
    private speed;
    private character;
    constructor(scene: Scene, entity: TransformNode);
    private _updateMovement;
}
