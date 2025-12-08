export type configType = {
  username: string;
  password: string;
  consId: string;
  secretKey: string;
  userKey: string;
  mode: "dev" | "prod";
};
// src/core/configHelper.ts
/**
 * @deprecated
 */
export function resolveConfig(globalCfg: configType, serviceCfg: configType) {
  return {
    consId: serviceCfg?.consId ?? globalCfg?.consId,
    secretKey: serviceCfg?.secretKey ?? globalCfg?.secretKey,
    userKey: serviceCfg?.userKey ?? globalCfg?.userKey,
    username: serviceCfg?.username ?? globalCfg?.username,
    password: serviceCfg?.password ?? globalCfg?.password,
  };
}
