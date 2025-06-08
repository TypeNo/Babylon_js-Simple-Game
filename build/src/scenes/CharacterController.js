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
var core_1 = require("@babylonjs/core");
var BABYLON = require("@babylonjs/core/Legacy/legacy");
var CharacterController = /** @class */ (function (_super) {
    __extends(CharacterController, _super);
    function CharacterController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputMap = {};
        _this.speed = 0.1;
        return _this;
    }
    CharacterController.prototype.onInitialize = function () {
        // // Setup keyboard input tracking
        // if (!this.scene.actionManager) {
        //     this.scene.actionManager = new ActionManager(this.scene);
        // }
        // this.scene.onKeyboardObservable.add((kbInfo) => {
        //     const key = kbInfo.event.key.toLowerCase();
        //     if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        //         this.inputMap[key] = true;
        //     } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        //         this.inputMap[key] = false;
        //     }
        // });
        // Movement update per frame
        // this.scene.onBeforeRenderObservable.add(() => {
        //     this._updateMovement();
        // });
    };
    CharacterController.prototype.onStart = function () {
        // Called once when the scene starts playing
        console.log("CharacterController started for" + BABYLON.get);
    };
    CharacterController.prototype._updateMovement = function () {
        var move = new core_1.Vector3(0, 0, 0);
        if (this.inputMap["w"])
            move.z += 1;
        if (this.inputMap["s"])
            move.z -= 1;
        if (this.inputMap["a"])
            move.x -= 1;
        if (this.inputMap["d"])
            move.x += 1;
        if (move.lengthSquared() > 0) {
            move = move.normalize().scale(this.speed);
            this.transform.translate(move, 1, core_1.Space.LOCAL);
        }
    };
    return CharacterController;
}(Mesh));
exports.default = CharacterController;
//# sourceMappingURL=CharacterController.js.map