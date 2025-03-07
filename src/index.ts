import { guard_before_query } from "./guard_before_query";
import { test_after_response } from "./test_after_response";

if (pm.info.eventName === "beforeQuery") {
  guard_before_query();
} else {
  test_after_response();
}
