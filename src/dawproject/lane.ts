import { Referenceable } from "./referenceable";
import { ILane } from "./types";

export abstract class Lane extends Referenceable implements ILane {
  // Lane is an abstract base class, no specific properties beyond Referenceable
}
