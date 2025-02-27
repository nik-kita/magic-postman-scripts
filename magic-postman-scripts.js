'use strict';

const env_name_like = magic.guard?.env_name_like;
const curr = pm.environment.name;
let ok = env_name_like ? false : true;
if (env_name_like) {
  if (Array.isArray(env_name_like)) {
    ok = env_name_like.some((like) => new RegExp(like).test(curr));
  } else {
    ok = new RegExp(env_name_like).test(curr);
  }
}
if (!ok) {
  throw new Error(`Use with "${env_name_like}"-like named environment!`);
}

function mapping(mapping2, source, destination, prefix = "") {
  if (!mapping2) return;
  Object.entries(mapping2).forEach(([k, _path]) => {
    const value = _path.reduce((acc, p) => acc[p], source);
    console.debug(`Set ${destination}.${prefix + k} = ${value}`);
    value !== void 0 && pm[destination].set(prefix + k, value);
  });
}

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
    prefix
  } = magic;
  const actual_res_code = pm.response.code || pm.response.transport.http?.statusCode;
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
    jData = pm.response;
  }
  const rawReqBody = JSON.parse(pm.request.body?.raw || "{}");
  let fData = {};
  try {
    fData = pm.request.body.formdata.toObject();
  } catch {
  }
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
magic;
