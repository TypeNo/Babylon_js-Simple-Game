import { Scene, Mesh, Vector3, PhysicsAggregate, PhysicsImpostor, MeshBuilder, StandardMaterial, Color3, Ray} from "@babylonjs/core";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import {onKeyboardEvent, visibleInInspector } from "./decorators";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import * as GUI from '@babylonjs/gui'
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
export default class ScenePhysicsSetup extends Scene {
    
    // @visibleInInspector("Node", "Player")
    // private playerMesh: Mesh;
    // @visibleInInspector("Node", "Ground")
    // private groundMesh: Mesh;
    // private playerAggregate: PhysicsAggregate;
    //private scene: Scene;
    @visibleInInspector("Node", "Wreckage")
    private Wreckage: BABYLON.Mesh;
    @visibleInInspector("Node", "Ground")
    private ground: BABYLON.Mesh;
    private scene: Scene;
    private ringUIMap = new Map<BABYLON.Mesh, GUI.Control[]>();
    public static Instance: ScenePhysicsSetup;

    

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

        ScenePhysicsSetup.Instance = this;
        this.scene = this.ground.getScene();
        this.scene.lights.forEach(light => {
        if ('shadowEnabled' in light) {
            light.shadowEnabled = true;
            
            
        }
    });
        // this.Wreckage.physicsImpostor = new PhysicsImpostor(
        //     this.Wreckage,
        //     PhysicsImpostor.MeshImpostor,
        //     {
        //         mass: 0,
        //         friction:1,
        //         restitution:0
        //     },
        //     this.scene
        // );
        this.spawnRings(10);
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
            case "removeRing":
                // Do something...
                const mesh = data as BABYLON.Mesh;
                const gui = this.ringUIMap.get(mesh);
                if (gui) {
                    gui.forEach(control => control.dispose());
                    this.ringUIMap.delete(mesh);
                }
                mesh.dispose();
                break;
        }
    }

    private spawnRings(count: number): void {
    //const bounds = 50; // Adjust this based on your terrain size
    this.ground.computeWorldMatrix(true);
    this.ground.refreshBoundingInfo();
    const boundingInfo = this.ground.getBoundingInfo();
    const min = boundingInfo.boundingBox.minimumWorld;
    const max = boundingInfo.boundingBox.maximumWorld;
    console.log("Ground Bounds:", min, max);

    const ringPrefab = MeshBuilder.CreateTorus("ring", {
        diameter: 1.5,
        thickness: 0.1,
        tessellation: 24,
    }, this.scene);

    const material = new StandardMaterial("ringMat", this.scene);
    material.diffuseColor = Color3.Random();
    material.emissiveColor = Color3.White();
    ringPrefab.material = material;
    ringPrefab.setEnabled(false);

    // Create full-screen UI only once
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    for (let i = 0; i < count; i++) {
        const x = Math.random() * (max.x - min.x) + min.x;
        const z = Math.random() * (max.z - min.z) + min.z;

        // Cast a ray downward to find height
        const ray = new Ray(new Vector3(x, 500, z), Vector3.Down(), 1000);
        const hit = this.scene.pickWithRay(ray, (mesh) => mesh === this.ground);
        console.log(`Trying position: x=${x.toFixed(2)} z=${z.toFixed(2)}`);

        if (hit?.hit && hit.pickedPoint) {
            console.log("Hit at:", hit.pickedPoint);

            const y = hit.pickedPoint.y + 0.2; // Slightly above ground
            const ringInstance = ringPrefab.clone(`ringInstance_${i}`);
            ringInstance.position = new Vector3(x, y, z);
            ringInstance.setEnabled(true);

                        // Rectangle label
            const rect = new GUI.Rectangle();
            rect.width = 0.2;
            rect.height = "40px";
            rect.cornerRadius = 20;
            rect.color = "Orange";
            rect.thickness = 4;
            rect.background = "green";
            advancedTexture.addControl(rect);
            rect.linkWithMesh(ringInstance);
            rect.linkOffsetY = -150;
            rect.isVisible = true;

            const label = new GUI.TextBlock();
            label.text = "Pick";
            rect.addControl(label);

            // Ellipse marker
            const ellipse = new GUI.Ellipse();
            ellipse.width = "40px";
            ellipse.height = "40px";
            ellipse.color = "Orange";
            ellipse.thickness = 4;
            ellipse.background = "green";
            advancedTexture.addControl(ellipse);
            ellipse.linkWithMesh(ringInstance);
            ellipse.isVisible = true;

            // Line between ellipse and rectangle
            const line = new GUI.Line();
            line.lineWidth = 4;
            line.color = "Orange";
            line.y2 = 20;
            line.linkOffsetY = -20;
            advancedTexture.addControl(line);
            line.linkWithMesh(ringInstance);
            line.connectedControl = rect;
            line.isVisible = true;

            const guiControls = [rect, label, ellipse, line];
            this.ringUIMap.set(ringInstance, guiControls);

        }else{
            console.warn("No hit for ray at:", x, z);
        }
    }

    // Optional: remove the original ring prefab
    ringPrefab.dispose();
    }

}
