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
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("@babylonjs/core/node");
var GUI = require("@babylonjs/gui");
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
var MyScript = /** @class */ (function (_super) {
    __extends(MyScript, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function MyScript() {
        var _this = this;
        _this.score = 0;
        _this.targetScore = 5;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    MyScript.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    MyScript.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    MyScript.prototype.onStart = function () {
        var _this = this;
        // ...
        this.createScoreUI();
        MessageBus_1.MessageBus.add(function (msg) {
            _this.onMessage(msg.name, msg.data, msg.sender);
        });
    };
    /**
     * Called each frame.
     */
    MyScript.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    MyScript.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param name defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    MyScript.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case "ScoreUpdate":
                this.score = data.score;
                // Do something...
                this.incrementScore(data.score);
                // if (this.scoreText) {
                //     this.scoreText.text = `Score: ${this.score}`;
                // } 
                break;
        }
    };
    MyScript.prototype.createScoreUI = function () {
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.scoreText = new GUI.TextBlock();
        this.scoreText.text = "Score: ".concat(this.score, " / ").concat(this.targetScore);
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
    };
    MyScript.prototype.increaseTarget = function () {
        // For example: double the target
        //this.score = 0;
        this.targetScore *= 2;
        this.scoreText.text = "Score: ".concat(this.score, " / ").concat(this.targetScore);
    };
    MyScript.prototype.incrementScore = function (amount) {
        this.score = amount;
        this.scoreText.text = "Score: ".concat(this.score, " / ").concat(this.targetScore);
        if (this.score >= this.targetScore) {
            //this.playJoyAnimation();
            this.increaseTarget();
        }
    };
    return MyScript;
}(node_1.Node));
exports.default = MyScript;
//# sourceMappingURL=ScoringManager.js.map