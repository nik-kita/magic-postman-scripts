declare global {
  type Mapping = Record<string, string[]>;
  type VarScopeName = "environment" | "collectionVariables" | "globals";
  type VarScope = Record<VarScopeName, {
    get: (name: string) => string | null;
    set: (name: string, value: string) => void;
  }>;
  /// === custom global variables ===
  const res_code: number;
  const magic: {
    res_codes: number[];
    res_jbody_to_env?: Mapping;
    res_jbody_to_col?: Mapping;
    res_jbody_to_globals?: Mapping;
    res_data_to_env?: Mapping;
    res_data_to_col?: Mapping;
    res_data_to_globals?: Mapping;
    req_jbody_to_env?: Mapping;
    req_jbody_to_col?: Mapping;
    req_jbody_to_globals?: Mapping;
    req_fbody_to_env?: Mapping;
    req_fbody_to_globals?: Mapping;
    req_fbody_to_col?: Mapping;
    prefix?: string;
  };

  /// === aka Postman types ===
  const pm: VarScope & {
    test: Function;
    request: {
      name: string;
      body: {
        raw: string;
        formdata: {
          toObject: Function;
        };
      };
    };
    response: {
      code: number;
      json: Function;
      data?: object;
    };
    expect: Function;
  };
}

export {};
