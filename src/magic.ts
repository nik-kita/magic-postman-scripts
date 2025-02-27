import { mapping } from "./lib/mapping";
import * as _types from "./types";
_types;

pm.test(pm.request.name, () => {
  const {
    res_codes = [200, 201, 202, 203, 204],
    res_jbody_to_env,
    res_jbody_to_col,
    res_jbody_to_globals,
    req_jbody_to_env,
    req_jbody_to_col,
    req_jbody_to_globals,
    req_fbody_to_env,
    req_fbody_to_globals,
    req_fbody_to_col,
    prefix,
  } = magic;
  const actual_res_code = pm.response.code ||
    pm.response.transport.http?.statusCode;
  if (!actual_res_code) {
    console.warn("Unable to get res status code... Please open the issue");
  } else if (!res_codes.includes(actual_res_code)) {
    console.warn("Response code is not declared in <magic.res_codes>");
    pm.expect(res_codes).includes(actual_res_code);
    return;
  }

  let jData = {};

  try {
    jData = pm.response.json();
  } catch (err) {
    try {
      jData = pm.response.data || {};
    } catch (err2) {
      console.warn(
        "Unable to parse data as json both from res.json() or res as already json",
      );
      jData = {};
    }
  }
  const rawReqBody = JSON.parse(pm.request.body?.raw || "{}");
  let fData = {};
  try {
    fData = pm.request.body.formdata.toObject();
  } catch {}

  mapping(res_jbody_to_env, jData, "environment", prefix);
  mapping(res_jbody_to_col, jData, "collectionVariables", prefix);
  mapping(res_jbody_to_globals, jData, "globals", prefix);
  mapping(req_jbody_to_env, rawReqBody, "environment", prefix);
  mapping(req_jbody_to_col, rawReqBody, "collectionVariables", prefix);
  mapping(req_jbody_to_globals, rawReqBody, "globals", prefix);
  mapping(req_fbody_to_env, fData, "environment", prefix);
  mapping(req_fbody_to_col, fData, "collectionVariables", prefix);
  mapping(req_fbody_to_globals, fData, "globals", prefix);
});

export default magic;
