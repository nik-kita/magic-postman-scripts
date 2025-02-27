import guard from "./guard";
import magic from "./magic";

!(guard && magic) || console.log("This script is not running in postman...");
