"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var CharacterController = /** @class */ (function () {
    function CharacterController() {
        this.inputMap = {};
        this.speed = 0.1;
    }
    CharacterController.prototype.onInitialize = function () {
        var _this = this;
        // Setup keyboard input tracking
        if (!this.scene.actionManager) {
            this.scene.actionManager = new core_1.ActionManager(this.scene);
        }
        this.scene.onKeyboardObservable.add(function (kbInfo) {
            var key = kbInfo.event.key.toLowerCase();
            if (kbInfo.type === core_1.KeyboardEventTypes.KEYDOWN) {
                _this.inputMap[key] = true;
            }
            else if (kbInfo.type === core_1.KeyboardEventTypes.KEYUP) {
                _this.inputMap[key] = false;
            }
        });
        // Movement update per frame
        this.scene.onBeforeRenderObservable.add(function () {
            _this._updateMovement();
        });
    };
    CharacterController.prototype.onStart = function () {
        // Called once when the scene starts playing
        console.log("CharacterController started for", this.transform.name);
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
}());
exports.default = CharacterController;
//# sourceMappingURL=CharacterController.js.map