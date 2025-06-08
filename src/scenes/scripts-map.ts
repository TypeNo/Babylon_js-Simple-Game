import { ScriptMap } from "./tools";

/**
 * Defines the interface that exposes all exported scripts in this project.
 */
export interface ISceneScriptMap {
	"src/scenes/Dune.ts": ScriptMap;
	"src/scenes/MessageBus.ts": ScriptMap;
	"src/scenes/NPC.ts": ScriptMap;
	"src/scenes/PlayerController.ts": ScriptMap;
	"src/scenes/PlayerController2.ts": ScriptMap;
	"src/scenes/rotator.ts": ScriptMap;
	"src/scenes/ScenePhysicsSetup.ts": ScriptMap;
	"src/scenes/ScoringManager.ts": ScriptMap;
}

/**
 * Defines the map of all available scripts in the project.
 */
export const scriptsMap: ISceneScriptMap = {
	"src/scenes/Dune.ts": require("./Dune"),
	"src/scenes/MessageBus.ts": require("./MessageBus"),
	"src/scenes/NPC.ts": require("./NPC"),
	"src/scenes/PlayerController.ts": require("./PlayerController"),
	"src/scenes/PlayerController2.ts": require("./PlayerController2"),
	"src/scenes/rotator.ts": require("./rotator"),
	"src/scenes/ScenePhysicsSetup.ts": require("./ScenePhysicsSetup"),
	"src/scenes/ScoringManager.ts": require("./ScoringManager"),
}
