import { Node } from "@babylonjs/core/node";
import * as GUI from "@babylonjs/gui";
import { MessageBus } from './MessageBus'; // if using modules

/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameras
 *      - Transform nodes
 * 
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class MyScript extends Node {
    private scoreText: GUI.TextBlock;
    private score: number = 0;
    private targetScore: number = 5;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    protected constructor() { }

    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    public onInitialize(): void {
        // ...
    }

    /**
     * Called on the node has been fully initialized and is ready.
     */
    public onInitialized(): void {
        // ...
    }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        // ...
        this.createScoreUI();
        MessageBus.add((msg) => {
            this.onMessage(msg.name, msg.data, msg.sender);
        });
        
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // ...
    }

    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    public onStop(): void {
        // ...
    }

    /**
     * Called on a message has been received and sent from a graph.
     * @param name defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    public onMessage(name: string, data: any, sender: any): void {
        switch (name) {
            case "ScoreUpdate":
                this.score = data.score

                // Do something...
                this.incrementScore(data.score);
                // if (this.scoreText) {
                //     this.scoreText.text = `Score: ${this.score}`;
                // } 
                break;
        }
    }

    private createScoreUI() {
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.scoreText = new GUI.TextBlock();
        this.scoreText.text = `Score: ${this.score} / ${this.targetScore}`;
        this.scoreText.color = "white";
        this.scoreText.fontSize = 24;

        // Use pixel coordinates
        this.scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.scoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.scoreText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.scoreText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this.scoreText.left = "10px";
        this.scoreText.top = "10px";

        advancedTexture.addControl(this.scoreText);
    }

    private increaseTarget() {
        // For example: double the target
        //this.score = 0;
        this.targetScore *= 2;
        this.scoreText.text = `Score: ${this.score} / ${this.targetScore}`;
    }

    private incrementScore(amount: number) {
    this.score = amount;
    this.scoreText.text = `Score: ${this.score} / ${this.targetScore}`;

    if (this.score >= this.targetScore) {
        //this.playJoyAnimation();
        this.increaseTarget();
    }
    }

    

    

}
