import { GameLauncher } from "./gameLauncher";
import { Tower } from "./tower";

const tour = new Tower('Ganon\'s Tower');
const gameLauncher = new GameLauncher(tour);
gameLauncher.launcher(tour, gameLauncher);