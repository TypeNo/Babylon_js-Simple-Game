"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var BABYLON = require("@babylonjs/core/Legacy/legacy");
var decorators_1 = require("./decorators");
var MessageBus_1 = require("./MessageBus"); // if using modules
var ScenePhysicsSetup_1 = require("./ScenePhysicsSetup");
var PlayerController2 = /** @class */ (function (_super) {
    __extends(PlayerController2, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function PlayerController2() {
        var _this = this;
        _this.inputMap = {};
        _this.speed = 20;
        _this.lastMoveDirection = new core_1.Vector3(0, 0, 1); // Default facing forward
        _this.blendDuration = 0.3; // seconds
        _this.blendTime = 0;
        _this.isBlending = false;
        _this.isGrounded = false;
        _this.shouldFocusNpc = false;
        _this.isPicking = false;
        _this.score = 0;
        _this.targetScore = 5;
        _this.unlock1 = false;
        _this.unlock2 = false;
        _this.isPerformingEmote = false;
        _this._sunTogglePrssed = false;
        return _this;
    }
    PlayerController2.prototype.onInitialize = function () {
    };
    PlayerController2.prototype.onStart = function () {
        var _this = this;
        this.scene = this.object.getScene();
        var player = this.object;
        if (!player)
            return;
        // Dispose any existing impostor
        if (player.physicsImpostor) {
            player.physicsImpostor.dispose();
        }
        // Use HeightmapImpostor for terrain if generated from heightmap
        player.physicsImpostor = new core_1.PhysicsImpostor(player, core_1.PhysicsImpostor.SphereImpostor, {
            mass: 1,
            friction: 1,
            restitution: 0
        }, this.scene);
        player.physicsImpostor.physicsBody.linearDamping = 0.9;
        player.physicsImpostor.physicsBody.angularDamping = 1.0;
        player.physicsImpostor.physicsBody.sleepSpeedLimit = 0.1;
        player.physicsImpostor.physicsBody.sleepTimeLimit = 0.1; // seconds before sleep
        this.scene.onKeyboardObservable.add(function (kbInfo) {
            var key = kbInfo.event.key.toLowerCase();
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                _this.inputMap[key] = true;
            }
            else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                _this.inputMap[key] = false;
            }
        });
        // Get the camera from the scene
        this.camera = this.scene.activeCamera;
        if (this.camera) {
            this.camera.radius = 10;
            this.camera.alpha = Math.PI / 2;
            this.camera.beta = Math.PI / 3;
        }
        this.playAnimation("Idle"); // true = loop
        MessageBus_1.MessageBus.add(function (msg) {
            _this.onMessage(msg.name, msg.data, msg.sender);
        });
    };
    PlayerController2.prototype.onUpdate = function () {
        var _this = this;
        var _a, _b, _c, _d;
        if (!this.camera || !this.object)
            return;
        var player = this.object;
        // Step 1: Handle animation blending (unchanged)
        if (this.isBlending && this.currentAnim && this.nextAnim) {
            this.blendTime += this.scene.getEngine().getDeltaTime() / 1000;
            var t = Math.min(this.blendTime / this.blendDuration, 1);
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
        var inputDir = core_1.TmpVectors.Vector3[0].set(0, 0, 0);
        inputDir.z = (this.inputMap["w"] ? 1 : 0) - (this.inputMap["s"] ? 1 : 0);
        inputDir.x = (this.inputMap["d"] ? 1 : 0) - (this.inputMap["a"] ? 1 : 0);
        if (this.inputMap["1"] && this.unlock1 && !this.isPerformingEmote) {
            this.isPerformingEmote = true;
            this.playAnimation("Joy");
            setTimeout(function () {
                _this.playAnimation("Idle");
                _this.isPerformingEmote = false;
            }, 3000);
        }
        if (this.inputMap["2"] && this.unlock2 && !this.isPerformingEmote) {
            this.isPerformingEmote = true;
            this.playAnimation("Dance");
            setTimeout(function () {
                _this.playAnimation("Idle");
                _this.isPerformingEmote = false;
            }, 3000);
        }
        // Toggle sunlight with "L"
        if (this.inputMap["l"] && !this._sunTogglePrssed) {
            this._sunTogglePrssed = true; // Set toggle state to true
            var sun = this.scene.getLightByName("sun");
            if (sun) {
                sun.setEnabled(!sun.isEnabled());
                console.log("Sunlight toggled: ".concat(sun.isEnabled() ? "ON" : "OFF"));
            }
        }
        if (!this.inputMap["l"]) {
            this._sunTogglePrssed = false; // Reset toggle state when "L" is not pressed
        }
        var hasInput = inputDir.lengthSquared() > 0.001;
        // Step 3: Compute camera vectors
        var camForward = this.camera.getForwardRay().direction;
        camForward.y = 0;
        camForward.normalize();
        var camRight = core_1.TmpVectors.Vector3[1].copyFrom(core_1.Vector3.Cross(core_1.Vector3.Up(), camForward)).normalize();
        if (hasInput && !this.isPicking) {
            this.playAnimation("Run");
            inputDir.normalize();
            var moveDir = core_1.TmpVectors.Vector3[2]
                .copyFrom(camRight).scaleInPlace(inputDir.x)
                .addInPlace(camForward.scale(inputDir.z))
                .normalize();
            // Ground-adaptive movement via raycasting
            var origin_1 = player.position.clone();
            var down = core_1.TmpVectors.Vector3[3].set(0, -1, 0);
            var ray = new core_1.Ray(origin_1, down, 1.5);
            // Debug draw
            //RayHelper.CreateAndShow(ray, this.scene, Color3.Red());
            var hit = this.scene.pickWithRay(ray, function (mesh) { return mesh.isPickable && mesh != player; });
            this.isGrounded = (_a = hit === null || hit === void 0 ? void 0 : hit.hit) !== null && _a !== void 0 ? _a : false;
            var finalMoveDir = moveDir.clone();
            if ((hit === null || hit === void 0 ? void 0 : hit.hit) && hit.getNormal()) {
                var groundNormal = hit.getNormal();
                finalMoveDir = projectVectorOntoPlane(moveDir, groundNormal).normalize();
            }
            this.lastMoveDirection = finalMoveDir.clone();
            if (player.physicsImpostor) {
                var vel = player.physicsImpostor.getLinearVelocity();
                var verticalVelocity = (_b = vel === null || vel === void 0 ? void 0 : vel.y) !== null && _b !== void 0 ? _b : 0;
                // If the player is not grounded, apply manual gravity
                if (!this.isGrounded) {
                    verticalVelocity -= 9.81; // Adjust gravity strength as needed
                }
                var newVelocity = new core_1.Vector3(finalMoveDir.x * this.speed, verticalVelocity, finalMoveDir.z * this.speed);
                player.physicsImpostor.setLinearVelocity(newVelocity);
            }
            // Rotate player
            var yaw = Math.atan2(this.lastMoveDirection.x, this.lastMoveDirection.z);
            var targetQuat = core_1.Quaternion.FromEulerAngles(0, yaw, 0);
            player.rotationQuaternion = core_1.Quaternion.Slerp((_c = player.rotationQuaternion) !== null && _c !== void 0 ? _c : core_1.Quaternion.Identity(), targetQuat, 0.2);
        }
        else if (!this.isPicking && !this.isPerformingEmote) {
            this.playAnimation("Idle");
            // Keep rotating toward last move direction
            if (this.lastMoveDirection && this.lastMoveDirection.lengthSquared() > 0.001) {
                var yaw = Math.atan2(this.lastMoveDirection.x, this.lastMoveDirection.z);
                var targetQuat = core_1.Quaternion.FromEulerAngles(0, yaw, 0);
                player.rotationQuaternion = core_1.Quaternion.Slerp((_d = player.rotationQuaternion) !== null && _d !== void 0 ? _d : core_1.Quaternion.Identity(), targetQuat, 0.1);
            }
        }
        // Step 4: Camera follow logic using TmpVectors
        var desiredDistance = 20;
        var verticalOffset = core_1.TmpVectors.Vector3[4].set(0, 10, 0);
        var camDir = core_1.TmpVectors.Vector3[5].copyFrom(camForward).normalize();
        var desiredOffset = core_1.TmpVectors.Vector3[6].copyFrom(camDir)
            .scale(-desiredDistance)
            .addInPlace(verticalOffset);
        var desiredCameraPosition = core_1.TmpVectors.Vector3[7].copyFrom(player.position).addInPlace(desiredOffset);
        var lerpFactor = 0.1;
        this.camera.position = core_1.Vector3.Lerp(this.camera.position, desiredCameraPosition, lerpFactor);
        var boundingCenter = player.getBoundingInfo().boundingBox.centerWorld;
        this.camera.target = core_1.TmpVectors.Vector3[8].copyFrom(boundingCenter);
        //Pick the ring
        this.scene.onPointerObservable.add(function (pointerInfo) {
            var _a, _b;
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
                var pickedMesh = (_a = pointerInfo.pickInfo) === null || _a === void 0 ? void 0 : _a.pickedMesh;
                if ((pickedMesh === null || pickedMesh === void 0 ? void 0 : pickedMesh.name.startsWith("ringInstance_")) && player) {
                    var distance = BABYLON.Vector3.Distance(pickedMesh.position, player.position);
                    var pickupRange = 3.0; // Max distance allowed to pick up
                    if (distance <= pickupRange && !_this.isPicking) {
                        _this.isPicking = true;
                        _this.playAnimation("Pick");
                        console.log("Picked up: ".concat(pickedMesh.name, " (distance: ").concat(distance.toFixed(2), ")"));
                        // Send the message to remove the ring
                        (_b = ScenePhysicsSetup_1.default.Instance) === null || _b === void 0 ? void 0 : _b.onMessage("removeRing", pickedMesh, _this);
                        // Increase score
                        _this.score += 1; // or any value
                        console.log("Score: ".concat(_this.score));
                        // 🔔 Broadcast message
                        MessageBus_1.MessageBus.notifyObservers({
                            name: "ScoreUpdate",
                            data: { score: _this.score },
                            sender: _this
                        });
                        // Set a timeout to go back to Idle after animation ends
                        setTimeout(function () {
                            _this.isPicking = false;
                            _this.playAnimation("Idle"); // Return to idle
                        }, 3000); // Adjust to match the length of the Pick animation (in ms)
                        if (_this.score >= _this.targetScore) {
                            switch (_this.targetScore) {
                                case 5:
                                    _this.playAnimation("Joy"); // Set a timeout to go back to Idle after animation ends
                                    setTimeout(function () {
                                        //this.isPicking = false;
                                        _this.playAnimation("Idle"); // Return to idle
                                    }, 3000); // Adjust to match the length of the Pick animation (in ms)
                                    _this.unlock1 = true;
                                    break;
                                case 10:
                                    _this.playAnimation("Dance");
                                    setTimeout(function () {
                                        //this.isPicking = false;
                                        _this.playAnimation("Idle"); // Return to idle
                                    }, 3000); // Adjust to match the length of the Pick animation (in ms)
                                    _this.unlock2 = true;
                                    break;
                            }
                            _this.targetScore *= 2;
                        }
                        // Optionally hide or dispose GUI here
                    }
                    else {
                        console.log("Too far to pick up: ".concat(distance.toFixed(2), " units away"));
                    }
                }
            }
        });
    };
    PlayerController2.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case "npcFacingToggled":
                console.log("NPC facing toggled. Is now facing player?", data.facing);
                this.shouldFocusNpc = data.facing === true;
                // Do something...
                break;
        }
    };
    PlayerController2.prototype.playAnimation = function (name) {
        var _a, _b;
        if (((_a = this.currentAnim) === null || _a === void 0 ? void 0 : _a.name) === name || ((_b = this.nextAnim) === null || _b === void 0 ? void 0 : _b.name) === name)
            return;
        var newAnim = this.scene.animationGroups.find(function (a) { return a.name === name; });
        if (!newAnim)
            return;
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
        }
        else {
            newAnim.start(true);
            newAnim.setWeightForAllAnimatables(1);
            this.currentAnim = newAnim;
        }
    };
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "Player Object")
    ], PlayerController2.prototype, "object", void 0);
    return PlayerController2;
}(core_1.Node));
exports.default = PlayerController2;
function projectVectorOntoPlane(vector, planeNormal) {
    var dot = core_1.Vector3.Dot(vector, planeNormal);
    var projection = planeNormal.scale(dot);
    return vector.subtract(projection);
}
//# sourceMappingURL=PlayerController2.js.map