import { Node, Mesh, PhysicsImpostor, Vector3, CannonJSPlugin } from "@babylonjs/core";
import * as CANNON from "cannon"; // Make sure you installed cannon with `npm i cannon` if using modules
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import {onKeyboardEvent, visibleInInspector } from "./decorators";


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
export default class Dune extends Node {

    @visibleInInspector("Node", "Dune")
    public ground!: BABYLON.Mesh; // Player Object
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
        const ground = this.ground;

        if (!ground) return;

        // Dispose any existing impostor
        if (ground.physicsImpostor) {
            ground.physicsImpostor.dispose();
        }

        // Use HeightmapImpostor for terrain if generated from heightmap
        ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.HeightmapImpostor,
            {
                mass: 0,            // static
                friction: 100,
                restitution: 0
            },
            ground.getScene()
        );

        ground.physicsImpostor.physicsBody.linearDamping = 1.0;
        ground.physicsImpostor.physicsBody.angularDamping = 1.0;
        
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
            case "myMessage":
                // Do something...
                break;
        }
    }
}
