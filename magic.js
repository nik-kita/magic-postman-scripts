pm.test(pm.request.name, () => {
  const {
    res_codes = [200, 201, 202, 203, 204],
    res_jbody_to_env,
    res_jbody_to_col,
    req_jbody_to_env,
    req_jbody_to_col,
  } = magic;
  const actual_res_code = pm.response.code;

  if (!res_codes.include(actual_res_code)) {
    pm.expect(res_code).to.be.equals(res_code);
    return;
  }

  if (res_jbody_to_env) {
    const [source, options] = res_jbody_to_env;
    mapping(source, pm.response.json(), "environment", options);
  }
  if (res_jbody_to_col) {
    const [source, options] = res_jbody_to_col;
    mapping(source, pm.response.json(), "collectionVariables", options);
  }
  if (req_jbody_to_env) {
    const [source, options] = req_jbody_to_env;
    mapping(source, JSON.parse(pm.request.body.raw), "environment", options);
  }
  if (req_jbody_to_col) {
    const [source, options] = req_jbody_to_col;
    mapping(
      source,
      JSON.parse(pm.request.body.raw),
      "collectionVariables",
      options
    );
  }
});

function mapping(mapping, source, destination, options = {}) {
  if (!mapping) return;
  const { override = true } = options;
  Object.entries(mapping).forEach(([k, path]) => {
    const value = path.reduce((acc, p) => acc[p], source);
    console.log(value, override, pm[destination].has(k));
    if (!override && pm[destination].has(k)) return;

    pm[destination].set(k, value);
  });
}
