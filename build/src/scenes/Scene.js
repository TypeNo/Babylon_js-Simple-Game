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
var decorators_1 = require("./decorators");
var GUI = require("@babylonjs/gui");
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
var ScenePhysicsSetup = /** @class */ (function (_super) {
    __extends(ScenePhysicsSetup, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function ScenePhysicsSetup() {
        var _this = this;
        _this.ringUIMap = new Map();
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    ScenePhysicsSetup.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    ScenePhysicsSetup.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    ScenePhysicsSetup.prototype.onStart = function () {
        this.scene = this.ground.getScene();
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
        this.spawnRings(100);
    };
    /**
     * Called each frame.
     */
    ScenePhysicsSetup.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    ScenePhysicsSetup.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param name defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    ScenePhysicsSetup.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case "removeRing":
                // Do something...
                var mesh = data;
                var gui = this.ringUIMap.get(mesh);
                if (gui) {
                    gui.forEach(function (control) { return control.dispose(); });
                    this.ringUIMap.delete(mesh);
                }
                mesh.dispose();
                break;
        }
    };
    ScenePhysicsSetup.prototype.spawnRings = function (count) {
        var _this = this;
        //const bounds = 50; // Adjust this based on your terrain size
        this.ground.computeWorldMatrix(true);
        this.ground.refreshBoundingInfo();
        var boundingInfo = this.ground.getBoundingInfo();
        var min = boundingInfo.boundingBox.minimumWorld;
        var max = boundingInfo.boundingBox.maximumWorld;
        console.log("Ground Bounds:", min, max);
        var ringPrefab = core_1.MeshBuilder.CreateTorus("ring", {
            diameter: 1.5,
            thickness: 0.1,
            tessellation: 24,
        }, this.scene);
        var material = new core_1.StandardMaterial("ringMat", this.scene);
        material.diffuseColor = core_1.Color3.Random();
        material.emissiveColor = core_1.Color3.White();
        ringPrefab.material = material;
        ringPrefab.setEnabled(false);
        // Create full-screen UI only once
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        for (var i = 0; i < count; i++) {
            var x = Math.random() * (max.x - min.x) + min.x;
            var z = Math.random() * (max.z - min.z) + min.z;
            // Cast a ray downward to find height
            var ray = new core_1.Ray(new core_1.Vector3(x, 500, z), core_1.Vector3.Down(), 1000);
            var hit = this.scene.pickWithRay(ray, function (mesh) { return mesh === _this.ground; });
            console.log("Trying position: x=".concat(x.toFixed(2), " z=").concat(z.toFixed(2)));
            if ((hit === null || hit === void 0 ? void 0 : hit.hit) && hit.pickedPoint) {
                console.log("Hit at:", hit.pickedPoint);
                var y = hit.pickedPoint.y + 0.2; // Slightly above ground
                var ringInstance = ringPrefab.clone("ringInstance_".concat(i));
                ringInstance.position = new core_1.Vector3(x, y, z);
                ringInstance.setEnabled(true);
                // Rectangle label
                var rect = new GUI.Rectangle();
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
                var label = new GUI.TextBlock();
                label.text = "Pick";
                rect.addControl(label);
                // Ellipse marker
                var ellipse = new GUI.Ellipse();
                ellipse.width = "40px";
                ellipse.height = "40px";
                ellipse.color = "Orange";
                ellipse.thickness = 4;
                ellipse.background = "green";
                advancedTexture.addControl(ellipse);
                ellipse.linkWithMesh(ringInstance);
                ellipse.isVisible = true;
                // Line between ellipse and rectangle
                var line = new GUI.Line();
                line.lineWidth = 4;
                line.color = "Orange";
                line.y2 = 20;
                line.linkOffsetY = -20;
                advancedTexture.addControl(line);
                line.linkWithMesh(ringInstance);
                line.connectedControl = rect;
                line.isVisible = true;
                var guiControls = [rect, label, ellipse, line];
                this.ringUIMap.set(ringInstance, guiControls);
            }
            else {
                console.warn("No hit for ray at:", x, z);
            }
        }
        // Optional: remove the original ring prefab
        ringPrefab.dispose();
    };
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "Wreckage")
    ], ScenePhysicsSetup.prototype, "Wreckage", void 0);
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "Ground")
    ], ScenePhysicsSetup.prototype, "ground", void 0);
    return ScenePhysicsSetup;
}(core_1.Scene));
exports.default = ScenePhysicsSetup;
//# sourceMappingURL=Scene.js.map