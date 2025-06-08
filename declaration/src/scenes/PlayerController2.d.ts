import { Node } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
export default class PlayerController2 extends Node {
    scene: BABYLON.Scene;
    private camera;
    private inputMap;
    private speed;
    private lastMoveDirection;
    private currentAnim?;
    private nextAnim?;
    private blendDuration;
    private blendTime;
    private isBlending;
    private isGrounded;
    private shouldFocusNpc;
    private isPicking;
    private score;
    private targetScore;
    private unlock1;
    private unlock2;
    private isPerformingEmote;
    private _sunTogglePrssed;
    object: BABYLON.Node;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    protected constructor();
    onInitialize(): void;
    onStart(): void;
    onUpdate(): void;
    onMessage(name: string, data: any, sender: any): void;
    private playAnimation;
}
