import {Mesh ,Scene, Node, TransformNode, Vector3, KeyboardEventTypes } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { onKeyboardEvent } from "../scenes/decorators";

export default class PlayerController extends Mesh {
    // ✅ Declare these so TypeScript knows about them
    //public scene!: BABYLON.Scene;
    //public object!: BABYLON.Node;

    //private inputMap: { [key: string]: boolean } = {};
    private speed: number = 0.1;

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    protected constructor() { }

    public onStart(): void {

        // console.log("Scene:", this.scene);
        // console.log("Object:", this.object);
        
        // if (!this.scene) {
        //     console.error("scene is undefined in PlayerController.onStart");
        //     //return;
        // }

        // if (!this.object) {
        //     console.error("object is undefined in PlayerController.onStart");
        //     //return;
        // }

        //const player = this.object as TransformNode;

        // this.scene.onKeyboardObservable.add((kbInfo) => {
        //     const key = kbInfo.event.key.toLowerCase();
        //     if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        //         this.inputMap[key] = true;
        //     } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        //         this.inputMap[key] = false;
        //     }
        // });

        // console.log("PlayerController initialized");
    }

    public onUpdate(): void {
        //const player = this.object as TransformNode;

        
        // const direction = new Vector3(0, 0, 0);
        // if (this.inputMap["w"]) direction.z += 1;
        // if (this.inputMap["s"]) direction.z -= 1;
        // if (this.inputMap["a"]) direction.x -= 1;
        // if (this.inputMap["d"]) direction.x += 1;

        //direction.normalize().scaleInPlace(this.speed);
        //player.position.addInPlace(direction);
    }

    @onKeyboardEvent(65, KeyboardEventTypes.KEYDOWN)
    protected moveLeft(): void {
        this.position.z += 5;
    }
}




