"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var CharacterController = /** @class */ (function () {
    function CharacterController(scene, entity) {
        var _this = this;
        this.scene = scene;
        this.entity = entity;
        this.inputMap = {};
        this.speed = 0.1;
        this.character = this.entity;
        // Keyboard input setup
        this.scene.actionManager = new core_1.ActionManager(this.scene);
        this.scene.onKeyboardObservable.add(function (kbInfo) {
            var key = kbInfo.event.key.toLowerCase();
            if (kbInfo.type === core_1.KeyboardEventTypes.KEYDOWN) {
                _this.inputMap[key] = true;
            }
            else if (kbInfo.type === core_1.KeyboardEventTypes.KEYUP) {
                _this.inputMap[key] = false;
            }
        });
        // Register update loop
        this.scene.onBeforeRenderObservable.add(function () {
            _this._updateMovement();
        });
    }
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
        move = move.normalize().scale(this.speed);
        this.character.translate(move, 1, core_1.Space.LOCAL);
    };
    return CharacterController;
}());
exports.default = CharacterController;
//# sourceMappingURL=PlayerControl.js.map