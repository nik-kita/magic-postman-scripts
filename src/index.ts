import magic from "./magic";
import guard from "./guard";

!(
  magic && guard
) || console.log("This script is not running in postman...");
