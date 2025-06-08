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
var decorators_1 = require("../scenes/decorators");
var PlayerController = /** @class */ (function (_super) {
    __extends(PlayerController, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function PlayerController() {
        var _this = this;
        // ✅ Declare these so TypeScript knows about them
        //public scene!: BABYLON.Scene;
        //public object!: BABYLON.Node;
        //private inputMap: { [key: string]: boolean } = {};
        _this.speed = 0.1;
        return _this;
    }
    PlayerController.prototype.onStart = function () {
        // console.log("Scene:", this.scene);
        // console.log("Object:", this.object);
        // if (!this.scene) {
        //     console.error("scene is undefined in PlayerController.onStart");
        //     //return;
        // }
        // if (!this.object) {
        //     console.error("object is undefined in PlayerController.onStart");
        //     //return;
        // }
        //const player = this.object as TransformNode;
        // this.scene.onKeyboardObservable.add((kbInfo) => {
        //     const key = kbInfo.event.key.toLowerCase();
        //     if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        //         this.inputMap[key] = true;
        //     } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        //         this.inputMap[key] = false;
        //     }
        // });
        // console.log("PlayerController initialized");
    };
    PlayerController.prototype.onUpdate = function () {
        //const player = this.object as TransformNode;
        // const direction = new Vector3(0, 0, 0);
        // if (this.inputMap["w"]) direction.z += 1;
        // if (this.inputMap["s"]) direction.z -= 1;
        // if (this.inputMap["a"]) direction.x -= 1;
        // if (this.inputMap["d"]) direction.x += 1;
        //direction.normalize().scaleInPlace(this.speed);
        //player.position.addInPlace(direction);
    };
    PlayerController.prototype.moveLeft = function () {
        this.position.z += 5;
    };
    __decorate([
        (0, decorators_1.onKeyboardEvent)(65, core_1.KeyboardEventTypes.KEYDOWN)
    ], PlayerController.prototype, "moveLeft", null);
    return PlayerController;
}(core_1.Mesh));
exports.default = PlayerController;
//# sourceMappingURL=PlayerController.js.map