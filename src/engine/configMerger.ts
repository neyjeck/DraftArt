import { DotaConfigFileRoot, DotaHeroGridConfig } from '@/types/dotaConfig'

/**
 * Merges a generated layout into an existing Dota 2 hero_grid_config.json.
 * If a layout with the exact same config_name exists, it updates it;
 * otherwise it appends the new layout, keeping all existing grids intact.
 */
export function mergeDotaGridConfigs(
  existingJsonString: string,
  newConfig: DotaHeroGridConfig
): DotaConfigFileRoot {
  let existingRoot: DotaConfigFileRoot

  try {
    existingRoot = JSON.parse(existingJsonString)
  } catch (err) {
    throw new Error('Invalid JSON format in existing hero_grid_config.json')
  }

  if (!existingRoot || !Array.isArray(existingRoot.configs)) {
    throw new Error('Unrecognized Dota 2 config schema: missing "configs" array')
  }

  const configs = [...existingRoot.configs]
  const existingIndex = configs.findIndex(
    (c) => c.config_name.trim().toLowerCase() === newConfig.config_name.trim().toLowerCase()
  )

  if (existingIndex >= 0) {
    configs[existingIndex] = newConfig
  } else {
    configs.push(newConfig)
  }

  return {
    version: existingRoot.version || 3,
    configs,
  }
}

/**
 * Validates and extracts layout names from an existing Dota 2 config file.
 */
export function extractExistingLayoutNames(jsonString: string): string[] {
  try {
    const parsed = JSON.parse(jsonString)
    if (parsed && Array.isArray(parsed.configs)) {
      return parsed.configs.map((c: DotaHeroGridConfig) => c.config_name || 'Unnamed Layout')
    }
  } catch {
    // Ignore parse errors
  }
  return []
}
