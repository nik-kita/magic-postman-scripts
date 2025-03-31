import { deep_merge } from "../helpers/deep_merge";

export function mapping(
  mapping: Mapping | undefined,
  source: Record<string, any>,
  destination: VarScopeName,
  prefix = "",
) {
  if (!mapping) return;
  Object.entries(mapping).forEach(([k, mayBePath]) => {
    const last = mayBePath.pop(); /// possibly object with data-type clarification
    const path = mayBePath as string[];
    if (!last) {
      /// nothing to do...
      return;
    }
    const options: Required<MayBeOptions> = {
      type: "string",
      strategy: "replace",
    };
    if (typeof last === "string") {
      /// all items are strings - so it was only path
      path.push(last);
    } else {
      /// otherwise <last> is the type clarification
      last.type && (options.type = last.type);
      last.strategy && (options.strategy = last.strategy);
    }

    let value: any = path.reduce((acc, p) => acc[p], source); /// move into object/array key/index by key/index

    const key = prefix + k;
    const prev = pm[destination].get<any>(key);

    if (prev && options.strategy === "propose") {
      /// for <propose> strategy we do not touch existed value and ignore new
      value = prev;
      console.debug(
        "The old value will be used. New will be ignored. Becase of <propose> strategy.",
      );
    } else if (
      options.strategy === "replace" ||
      /// this is the exactly strategy that will be used for all another inline or-like conditions
      !prev ||
      /// nothing to do with strategies
      options.type !== typeof prev ||
      /// for types mismatch between prev and new values we use default <replace> strategy
      !["object", "array"].includes(options.type)
      /// <merge*> strategies are not possible for primitives and <propose> variant was already eliminated
    ) {
      /// so <replace> means simply to use recently obtained <value>
    } else {
      if (options.strategy === "merge") {
        value = Array.isArray(value)
          ? [...prev, ...value]
          : { ...prev, ...value };
      } else if (options.strategy === "deep-merge") {
        value = deep_merge(prev, value);
      } else {
        throw new Error(
          "MAGIC_ERROR: not exhaustive condition pipe was used to check <strategy>",
        );
      }
    }

    console.debug(`Set ${destination}.${prefix + k} = ${value}`);

    pm[destination].set(
      key,
      value,
      options.type,
    );
  });
}
