import { Node, Mesh, PhysicsImpostor } from "@babylonjs/core";
import * as GUI from '@babylonjs/gui'
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import {onKeyboardEvent, visibleInInspector } from "./decorators";
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
export default class NPC extends Mesh {

    private advancedTexture: GUI.AdvancedDynamicTexture;
    private rect1: GUI.Rectangle;
    private target: GUI.Ellipse;
    private line: GUI.Line;
    @visibleInInspector("Node", "Player")
    private player: BABYLON.Mesh;
    @visibleInInspector("Node", "NPC")
    private npc: BABYLON.Mesh;
    private npcOriginalRotation: BABYLON.Quaternion;
    private isFacingPlayer: boolean = false;
    

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
        // ✅ Create GUI Texture for full screen
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        // Rectangle label
        this.rect1 = new GUI.Rectangle();
        this.rect1.width = 0.2;
        this.rect1.height = "40px";
        this.rect1.cornerRadius = 20;
        this.rect1.color = "Orange";
        this.rect1.thickness = 4;
        this.rect1.background = "green";
        this.advancedTexture.addControl(this.rect1);
        this.rect1.linkWithMesh(this.npc);
        this.rect1.linkOffsetY = -150;
        this.rect1.isVisible = false;


        const label = new GUI.TextBlock();
        label.text = "Talk";
        this.rect1.addControl(label);

        // Ellipse marker
        this.target = new GUI.Ellipse();
        this.target.width = "40px";
        this.target.height = "40px";
        this.target.color = "Orange";
        this.target.thickness = 4;
        this.target.background = "green";
        this.advancedTexture.addControl(this.target);
        this.target.linkWithMesh(this.npc);
        this.target.isVisible = false;


        // Line between ellipse and rectangle
        this.line = new GUI.Line();
        this.line.lineWidth = 4;
        this.line.color = "Orange";
        this.line.y2 = 20;
        this.line.linkOffsetY = -20;
        this.advancedTexture.addControl(this.line);
        this.line.linkWithMesh(this.npc);
        this.line.connectedControl = this.rect1;
        this.line.isVisible = false;
        
        const scene = this.npc.getScene();

        // Use HeightmapImpostor for terrain if generated from heightmap
        this.npc.physicsImpostor = new PhysicsImpostor(
            this.npc,
            PhysicsImpostor.MeshImpostor,
            {
                mass: 0,            // static
                friction: 1,
                restitution: 0
            },
            scene
        );

        // Store the original rotation when scene starts
        if (this.npc) {
            this.npcOriginalRotation = this.npc.rotationQuaternion?.clone() ?? BABYLON.Quaternion.FromEulerVector(this.npc.rotation);
            this.npc.rotationQuaternion = this.npcOriginalRotation.clone(); // ensure consistent rotation
        }

        // Listen to E key press
        window.addEventListener("keydown", (event) => {
            if ((event.key === "e" || event.key === "E")&& this.rect1.isVisible)  {
                this.toggleNpcFacing();
            }
        });

        
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // ...
        if (!this.player || !this.npc) return;

        const distance = BABYLON.Vector3.Distance(this.player.position, this.npc.position);
        const visible = distance < 4;

        this.rect1.isVisible = visible;
        this.target.isVisible = visible;
        this.line.isVisible = visible;
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

    private toggleNpcFacing(): void {
    if (!this.npc || !this.player) return;

    if (!this.isFacingPlayer) {
        // Make NPC face player
        const directionToPlayer = this.player.position.subtract(this.npc.position).normalize();
        // Extract original pitch and roll from quaternion
        const originalEuler = this.npcOriginalRotation.toEulerAngles();
        const pitch = originalEuler.x;
        const roll = originalEuler.z;
        const targetRotation = BABYLON.Quaternion.RotationYawPitchRoll(
            -Math.atan2(directionToPlayer.x, directionToPlayer.z), // yaw
            pitch, // pitch
            roll  // roll
        );
        this.npc.rotationQuaternion = targetRotation;
        this.isFacingPlayer = true;
    } else {
        // Restore original rotation
        this.npc.rotationQuaternion = this.npcOriginalRotation.clone();
        this.isFacingPlayer = false;
    }

    // 🔔 Broadcast message
    MessageBus.notifyObservers({
        name: "npcFacingToggled",
        data: { facing: this.isFacingPlayer },
        sender: this
    });
    }
}
