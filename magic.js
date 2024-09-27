pm.test(pm.request.name, () => {
  const {
    res_codes = [200, 201, 202, 203, 204],
    res_jbody_to_env,
    res_jbody_to_col,
    res_jbody_to_globals,
    req_jbody_to_env,
    req_jbody_to_col,
    req_jbody_to_globals,
    prefix,
  } = magic;
  const actual_res_code = pm.response.code;
  if (!res_codes.include(actual_res_code)) {
    pm.expect(res_code).to.be.equals(res_code);
    return;
  }
  const jData = pm.response.json();
  const rawReqBody = JSON.parse(pm.request.body.raw || "{}");
  mapping(res_jbody_to_env, jData, "environment", prefix);
  mapping(res_jbody_to_col, jData, "collectionVariables", prefix);
  mapping(res_jbody_to_globals, jData, "globals", prefix);
  mapping(req_jbody_to_env, rawReqBody, "environment", prefix);
  mapping(req_jbody_to_col, rawReqBody, "collectionVariables", prefix);
  mapping(req_jbody_to_globals, rawReqBody, "globals", prefix);
});

function mapping(mapping, source, destination, prefix = "") {
  if (!mapping) return;
  Object.entries(mapping).forEach(([k, path]) => {
    const value = path.reduce((acc, p) => acc[p], source);
    console.debug(`Set ${destination}.${prefix + k} = ${value}`);
    value !== undefined && pm[destination].set(prefix + k, value);
  });
}
