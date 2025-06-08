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
var GUI = require("@babylonjs/gui");
var BABYLON = require("@babylonjs/core/Legacy/legacy");
var decorators_1 = require("./decorators");
var MessageBus_1 = require("./MessageBus"); // if using modules
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
var NPC = /** @class */ (function (_super) {
    __extends(NPC, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function NPC() {
        var _this = this;
        _this.isFacingPlayer = false;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    NPC.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    NPC.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    NPC.prototype.onStart = function () {
        var _this = this;
        var _a, _b;
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
        var label = new GUI.TextBlock();
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
        var scene = this.npc.getScene();
        // Use HeightmapImpostor for terrain if generated from heightmap
        this.npc.physicsImpostor = new core_1.PhysicsImpostor(this.npc, core_1.PhysicsImpostor.MeshImpostor, {
            mass: 0,
            friction: 1,
            restitution: 0
        }, scene);
        // Store the original rotation when scene starts
        if (this.npc) {
            this.npcOriginalRotation = (_b = (_a = this.npc.rotationQuaternion) === null || _a === void 0 ? void 0 : _a.clone()) !== null && _b !== void 0 ? _b : BABYLON.Quaternion.FromEulerVector(this.npc.rotation);
            this.npc.rotationQuaternion = this.npcOriginalRotation.clone(); // ensure consistent rotation
        }
        // Listen to E key press
        window.addEventListener("keydown", function (event) {
            if ((event.key === "e" || event.key === "E") && _this.rect1.isVisible) {
                _this.toggleNpcFacing();
            }
        });
    };
    /**
     * Called each frame.
     */
    NPC.prototype.onUpdate = function () {
        // ...
        if (!this.player || !this.npc)
            return;
        var distance = BABYLON.Vector3.Distance(this.player.position, this.npc.position);
        var visible = distance < 4;
        this.rect1.isVisible = visible;
        this.target.isVisible = visible;
        this.line.isVisible = visible;
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    NPC.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param name defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    NPC.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case "myMessage":
                // Do something...
                break;
        }
    };
    NPC.prototype.toggleNpcFacing = function () {
        if (!this.npc || !this.player)
            return;
        if (!this.isFacingPlayer) {
            // Make NPC face player
            var directionToPlayer = this.player.position.subtract(this.npc.position).normalize();
            // Extract original pitch and roll from quaternion
            var originalEuler = this.npcOriginalRotation.toEulerAngles();
            var pitch = originalEuler.x;
            var roll = originalEuler.z;
            var targetRotation = BABYLON.Quaternion.RotationYawPitchRoll(-Math.atan2(directionToPlayer.x, directionToPlayer.z), // yaw
            pitch, // pitch
            roll // roll
            );
            this.npc.rotationQuaternion = targetRotation;
            this.isFacingPlayer = true;
        }
        else {
            // Restore original rotation
            this.npc.rotationQuaternion = this.npcOriginalRotation.clone();
            this.isFacingPlayer = false;
        }
        // 🔔 Broadcast message
        MessageBus_1.MessageBus.notifyObservers({
            name: "npcFacingToggled",
            data: { facing: this.isFacingPlayer },
            sender: this
        });
    };
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "Player")
    ], NPC.prototype, "player", void 0);
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "NPC")
    ], NPC.prototype, "npc", void 0);
    return NPC;
}(core_1.Mesh));
exports.default = NPC;
//# sourceMappingURL=NPC.js.map