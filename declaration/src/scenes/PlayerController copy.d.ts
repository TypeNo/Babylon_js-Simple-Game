import { Mesh } from "@babylonjs/core";
export default class PlayerController extends Mesh {
    private speed;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    protected constructor();
    onStart(): void;
    onUpdate(): void;
    protected moveLeft(): void;
}
