import {Mesh ,Scene, Node, Quaternion, Scalar, Matrix, TransformNode, PhysicsImpostor, Vector3, KeyboardEventTypes, AnimationGroup, Ray, TmpVectors, RayHelper, Color3 } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import {onKeyboardEvent, visibleInInspector } from "./decorators";
import { MessageBus } from './MessageBus'; // if using modules
import ScenePhysicsSetup from "./ScenePhysicsSetup";


export default class PlayerController2 extends Node {
    //✅ Declare these so TypeScript knows about them
    public scene!: BABYLON.Scene;
    private camera!: BABYLON.ArcRotateCamera;
    private inputMap: { [key: string]: boolean } = {};
    private speed: number = 20;
    private lastMoveDirection = new Vector3(0, 0, 1); // Default facing forward
    private currentAnim?: AnimationGroup;
    private nextAnim?: AnimationGroup;
    private blendDuration = 0.3; // seconds
    private blendTime = 0;
    private isBlending = false;
    private isGrounded: boolean = false;
    private shouldFocusNpc = false;
    private isPicking = false;
    private score: number = 0;
    private targetScore: number = 5;
    private unlock1 : boolean = false;
    private unlock2 : boolean = false;
    private isPerformingEmote: boolean = false;
    private _sunTogglePrssed: boolean = false;




    @visibleInInspector("Node", "Player Object")
    public object!: BABYLON.Node; // Player Object

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    protected constructor() { }

    public onInitialize(): void {

    }
    
    public onStart(): void {

        this.scene = this.object.getScene();

        const player = this.object as Mesh ;

        if (!player) return;

        // Dispose any existing impostor
        if (player.physicsImpostor) {
            player.physicsImpostor.dispose();
        }

        // Use HeightmapImpostor for terrain if generated from heightmap
        player.physicsImpostor = new PhysicsImpostor(
            player,
            PhysicsImpostor.SphereImpostor,
            {
                mass: 1,            // static
                friction: 1,
                restitution: 0
            },
            this.scene
        );

        player.physicsImpostor.physicsBody.linearDamping = 0.9;
        player.physicsImpostor.physicsBody.angularDamping = 1.0;
        player.physicsImpostor.physicsBody.sleepSpeedLimit = 0.1;
        player.physicsImpostor.physicsBody.sleepTimeLimit = 0.1; // seconds before sleep

        this.scene.onKeyboardObservable.add((kbInfo) => {
            const key = kbInfo.event.key.toLowerCase();
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                this.inputMap[key] = true;
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                this.inputMap[key] = false;
            }
        });

        // Get the camera from the scene
        this.camera = this.scene.activeCamera as BABYLON.ArcRotateCamera;

        if (this.camera) {
            this.camera.radius = 10;
            this.camera.alpha = Math.PI / 2;
            this.camera.beta = Math.PI / 3;
        }

        this.playAnimation("Idle") // true = loop

        MessageBus.add((msg) => {
            this.onMessage(msg.name, msg.data, msg.sender);
        });

        
    }

    public onUpdate(): void {
        if (!this.camera || !this.object) return;

        const player = this.object as Mesh;

        // Step 1: Handle animation blending (unchanged)
        if (this.isBlending && this.currentAnim && this.nextAnim) {
            this.blendTime += this.scene.getEngine().getDeltaTime() / 1000;
            const t = Math.min(this.blendTime / this.blendDuration, 1);
            this.currentAnim.setWeightForAllAnimatables(1 - t);
            this.nextAnim.setWeightForAllAnimatables(t);
            if (t >= 1) {
                this.currentAnim.stop();
                this.currentAnim = this.nextAnim;
                this.nextAnim = undefined;
                this.isBlending = false;
            }
        }

        // Step 2: Calculate camera-relative input
        const inputDir = TmpVectors.Vector3[0].set(0, 0, 0);
        inputDir.z = (this.inputMap["w"] ? 1 : 0) - (this.inputMap["s"] ? 1 : 0);
        inputDir.x = (this.inputMap["d"] ? 1 : 0) - (this.inputMap["a"] ? 1 : 0);

        if(this.inputMap["1"] && this.unlock1 && !this.isPerformingEmote){
            this.isPerformingEmote = true;
            this.playAnimation("Joy");
            setTimeout(() => {
                this.playAnimation("Idle");
                this.isPerformingEmote = false;
            }, 3000);
        }

        if(this.inputMap["2"] && this.unlock2 && !this.isPerformingEmote){
            this.isPerformingEmote = true;
            this.playAnimation("Dance");
            setTimeout(() => {
                this.playAnimation("Idle");
                this.isPerformingEmote = false;
            }, 3000);
        }

        // Toggle sunlight with "L"
        if (this.inputMap["l"] && !this._sunTogglePrssed) {
            this._sunTogglePrssed = true; // Set toggle state to true
            const sun = this.scene.getLightByName("sun");
            if (sun) {
                sun.setEnabled(!sun.isEnabled());
                console.log(`Sunlight toggled: ${sun.isEnabled() ? "ON" : "OFF"}`);
            }
        }
        if(!this.inputMap["l"]){
            this._sunTogglePrssed = false; // Reset toggle state when "L" is not pressed
        }


        const hasInput = inputDir.lengthSquared() > 0.001;

        // Step 3: Compute camera vectors
        const camForward = this.camera.getForwardRay().direction;
        camForward.y = 0;
        camForward.normalize();

        const camRight = TmpVectors.Vector3[1].copyFrom(Vector3.Cross(Vector3.Up(), camForward)).normalize();

        if (hasInput && !this.isPicking) {
            this.playAnimation("Run");
            inputDir.normalize();
            const moveDir = TmpVectors.Vector3[2]
                .copyFrom(camRight).scaleInPlace(inputDir.x)
                .addInPlace(camForward.scale(inputDir.z))
                .normalize();

            // Ground-adaptive movement via raycasting
            const origin = player.position.clone();
            const down = TmpVectors.Vector3[3].set(0, -1, 0);
            const ray = new Ray(origin, down, 1.5);
            // Debug draw
            //RayHelper.CreateAndShow(ray, this.scene, Color3.Red());
            const hit = this.scene.pickWithRay(ray, (mesh) => mesh.isPickable && mesh != player);

            this.isGrounded = hit?.hit ?? false;

            let finalMoveDir = moveDir.clone();

            if (hit?.hit && hit.getNormal()) {
                const groundNormal = hit.getNormal()!;
                finalMoveDir = projectVectorOntoPlane(moveDir, groundNormal).normalize();
            }

            this.lastMoveDirection = finalMoveDir.clone();

            if (player.physicsImpostor) {
                const vel = player.physicsImpostor.getLinearVelocity();
                let verticalVelocity = vel?.y ?? 0;

                // If the player is not grounded, apply manual gravity
                if (!this.isGrounded) {
                    verticalVelocity -= 9.81; // Adjust gravity strength as needed
                }

                const newVelocity = new Vector3(
                    finalMoveDir.x * this.speed,
                    verticalVelocity,
                    finalMoveDir.z * this.speed
                );
                player.physicsImpostor.setLinearVelocity(newVelocity);
            }

            // Rotate player
            const yaw = Math.atan2(this.lastMoveDirection.x, this.lastMoveDirection.z);
            const targetQuat = Quaternion.FromEulerAngles(0, yaw, 0);
            player.rotationQuaternion = Quaternion.Slerp(
                player.rotationQuaternion ?? Quaternion.Identity(),
                targetQuat,
                0.2
            );
        } else if (!this.isPicking &&!this.isPerformingEmote){
            this.playAnimation("Idle");

            // Keep rotating toward last move direction
            if (this.lastMoveDirection && this.lastMoveDirection.lengthSquared() > 0.001) {
                const yaw = Math.atan2(this.lastMoveDirection.x, this.lastMoveDirection.z);
                const targetQuat = Quaternion.FromEulerAngles(0, yaw, 0);
                player.rotationQuaternion = Quaternion.Slerp(
                    player.rotationQuaternion ?? Quaternion.Identity(),
                    targetQuat,
                    0.1
                );
            }
        }

        // Step 4: Camera follow logic using TmpVectors
        const desiredDistance = 20;
        const verticalOffset = TmpVectors.Vector3[4].set(0, 10, 0);
        const camDir = TmpVectors.Vector3[5].copyFrom(camForward).normalize();

        const desiredOffset = TmpVectors.Vector3[6].copyFrom(camDir)
            .scale(-desiredDistance)
            .addInPlace(verticalOffset);

        const desiredCameraPosition = TmpVectors.Vector3[7].copyFrom(player.position).addInPlace(desiredOffset);
        const lerpFactor = 0.1;

        this.camera.position = Vector3.Lerp(this.camera.position, desiredCameraPosition, lerpFactor);

        const boundingCenter = player.getBoundingInfo().boundingBox.centerWorld;
        this.camera.target = TmpVectors.Vector3[8].copyFrom(boundingCenter);

        //Pick the ring
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
                const pickedMesh = pointerInfo.pickInfo?.pickedMesh;

                if (pickedMesh?.name.startsWith("ringInstance_") && player) {
                    const distance = BABYLON.Vector3.Distance(pickedMesh.position, player.position);

                    const pickupRange = 3.0; // Max distance allowed to pick up

                    if (distance <= pickupRange && !this.isPicking) {
                        this.isPicking = true;
                        this.playAnimation("Pick");
                        console.log(`Picked up: ${pickedMesh.name} (distance: ${distance.toFixed(2)})`);

                        // Send the message to remove the ring
                        ScenePhysicsSetup.Instance?.onMessage("removeRing", pickedMesh, this);

                        // Increase score
                        this.score += 1; // or any value
                        console.log(`Score: ${this.score}`);
                        
                        // 🔔 Broadcast message
                        MessageBus.notifyObservers({
                            name: "ScoreUpdate",
                            data: { score: this.score },
                            sender: this
                        });

                        // Set a timeout to go back to Idle after animation ends
                        setTimeout(() => {
                            this.isPicking = false;
                            this.playAnimation("Idle"); // Return to idle
                        }, 3000); // Adjust to match the length of the Pick animation (in ms)

                        if (this.score >= this.targetScore) {
                            switch(this.targetScore){
                                case 5 :
                                    this.playAnimation("Joy");                                                            // Set a timeout to go back to Idle after animation ends
                                    setTimeout(() => {
                                        //this.isPicking = false;
                                        this.playAnimation("Idle"); // Return to idle
                                    }, 3000); // Adjust to match the length of the Pick animation (in ms)
                                    this.unlock1 = true
                                    break;
                                case 10:
                                    this.playAnimation("Dance");
                                    setTimeout(() => {
                                        //this.isPicking = false;
                                        this.playAnimation("Idle"); // Return to idle
                                    }, 3000); // Adjust to match the length of the Pick animation (in ms)
                                    this.unlock2 = true
                                    break;
                            }
                            this.targetScore *= 2;
                        }


                        

                        // Optionally hide or dispose GUI here
                    } else {
                        console.log(`Too far to pick up: ${distance.toFixed(2)} units away`);
                    }
                }
            }
        });
    }

    public onMessage(name: string, data: any, sender: any): void {
        switch (name) {
            case "npcFacingToggled":
                console.log("NPC facing toggled. Is now facing player?", data.facing);
                this.shouldFocusNpc = data.facing === true;
                // Do something...
                break;
        }
    }


    private playAnimation(name: string) {
        if (this.currentAnim?.name === name || this.nextAnim?.name === name) return;

        const newAnim = this.scene.animationGroups.find(a => a.name === name);
        if (!newAnim) return;

        if (this.currentAnim) {
            this.nextAnim = newAnim;
            this.blendTime = 0;
            this.isBlending = true;

            // Start newAnim muted
            this.nextAnim.start(true);
            this.nextAnim.setWeightForAllAnimatables(0);

            // Ensure currentAnim is running with full weight
            this.currentAnim.start(true);
            this.currentAnim.setWeightForAllAnimatables(1);
        } else {
            newAnim.start(true);
            newAnim.setWeightForAllAnimatables(1);
            this.currentAnim = newAnim;
        }
    }
}

function projectVectorOntoPlane(vector: Vector3, planeNormal: Vector3): Vector3 {
    const dot = Vector3.Dot(vector, planeNormal);
    const projection = planeNormal.scale(dot);
    return vector.subtract(projection);
}




