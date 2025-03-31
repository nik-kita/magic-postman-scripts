import { expect } from "chai";
import { Response } from "postman-collection";

export const VAR_CONVERT_TYPE_all = Object.keys(
  {
    string: null,
    number: null,
    boolean: null,
    object: null,
    array: null,
  } satisfies Record<VarConvertType, null>,
) as readonly VarConvertType[];

declare global {
  type VarConvertType = "string" | "boolean" | "number" | "object" | "array";
  type Mapping = Record<
    string,
    MayBePath
  >;
  type MayBePath = string[] | [...string[], { type: VarConvertType }];
  type MayBeOptions = { type: VarConvertType };
  type VarScopeName = "environment" | "collectionVariables" | "globals";
  type VarScope = Record<VarScopeName, {
    get: <T = string>(name: string) => T | null;
    set: (name: string, value: any, type?: VarConvertType) => void;
  }>;
  /// === custom global variables ===
  const res_code: number;
  const magic: Record<`ctx_${VarScopeName}`, {}> & {
    /// general info
    name?: string;
    description?: string;
    /// common testing over res.status codes
    res_codes: number[];
    /// === mapping res data to postman variables ===
    res_jbody_to_env?: Mapping;
    res_jbody_to_col?: Mapping;
    res_jbody_to_globals?: Mapping;
    /// === mapping req data to postman variables ===
    req_jbody_to_env?: Mapping;
    req_jbody_to_col?: Mapping;
    req_jbody_to_globals?: Mapping;
    req_fbody_to_env?: Mapping;
    req_fbody_to_globals?: Mapping;
    req_fbody_to_col?: Mapping;
    /// === use extra-prefix for variables to avoid conflicts ===
    prefix?: string;
    /// === possible prevention of running request ===
    guard?: {
      env_name_like?: RegExp | RegExp[];
    };
  };
  /// === aka Postman types ===
  const pm: VarScope & {
    environment: {
      name: string;
    };
    info: {
      eventName: "beforeQuery" | "afterResponse";
    };
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
    response: Response & {
      transport: {
        http?: {
          statusCode: number;
          headers: { key: string; value: string }[];
        };
      };
    };
    expect: typeof expect;
  };
}

export {};
