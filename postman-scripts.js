"use strict";

var magic$1 = magic || {};
pm.test(pm.request.name, () => {
  const {
    res_codes = [200, 201, 202, 203, 204],
    res_jbody_to_env,
    res_jbody_to_col,
    res_jbody_to_globals,
    res_data_to_env,
    res_data_to_col,
    res_data_to_globals,
    req_jbody_to_env,
    req_jbody_to_col,
    req_jbody_to_globals,
    req_fbody_to_env,
    req_fbody_to_globals,
    req_fbody_to_col,
    prefix,
  } = magic;
  const actual_res_code = pm.response.code;
  if (!res_codes.includes(actual_res_code)) {
    pm.expect(res_code).to.be.equals(res_code);
    return;
  }
  const jData = pm.response.json();
  const rawReqBody = JSON.parse(pm.request.body?.raw || "{}");
  let fData = {};
  const data = pm.response.data;
  try {
    fData = pm.request.body.formdata.toObject();
  } catch {
  }
  mapping(res_jbody_to_env, jData, "environment", prefix);
  mapping(res_jbody_to_col, jData, "collectionVariables", prefix);
  mapping(res_jbody_to_globals, jData, "globals", prefix);
  mapping(res_data_to_env, data, "environment", prefix);
  mapping(res_data_to_col, data, "collectionVariables", prefix);
  mapping(res_data_to_globals, data, "globals", prefix);
  mapping(req_jbody_to_env, rawReqBody, "environment", prefix);
  mapping(req_jbody_to_col, rawReqBody, "collectionVariables", prefix);
  mapping(req_jbody_to_globals, rawReqBody, "globals", prefix);
  mapping(req_fbody_to_env, fData, "environment", prefix);
  mapping(req_fbody_to_col, fData, "collectionVariables", prefix);
  mapping(req_fbody_to_globals, fData, "globals", prefix);
});
function mapping(mapping2, source, destination, prefix = "") {
  if (!mapping2) return;
  Object.entries(mapping2).forEach(([k, _path]) => {
    const value = _path.reduce((acc, p) => acc[p], source);
    console.debug(`Set ${destination}.${prefix + k} = ${value}`);
    value !== void 0 && pm[destination].set(prefix + k, value);
  });
}

console.log(magic$1 || "This script is not running in postman...");
