const env_name_like = guard?.env_name_like;
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
