/**
 * Official Dota 2 hero_grid_config.json schema definitions (Source 2 Panorama UI).
 * Located at: Steam/userdata/<account_id>/570/remote/cfg/hero_grid_config.json
 */

export interface DotaCategory {
  category_name: string
  x_position: number
  y_position: number
  width: number
  height: number
  hero_ids: number[]
}

export interface DotaHeroGridConfig {
  config_name: string
  categories: DotaCategory[]
}

export interface DotaConfigFileRoot {
  version: number
  configs: DotaHeroGridConfig[]
}

export const DOTA_CONFIG_VERSION = 3
