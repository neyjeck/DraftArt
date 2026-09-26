import {
  DotaConfigFileRoot,
  DotaHeroGridConfig,
  DOTA_CONFIG_VERSION,
} from '@/types/dotaConfig'

export interface GeneratorOptions {
  startX?: number
  startY?: number
  rowHeight?: number
  categoryWidth?: number
}

/**
 * Builds a valid Dota 2 hero_grid_config JSON structure from an array of Braille lines.
 */
export function buildDotaHeroGridConfig(
  configName: string,
  brailleLines: string[],
  options: GeneratorOptions = {}
): DotaConfigFileRoot {
  const {
    startX = 0,
    startY = 0,
    rowHeight = 16,
    categoryWidth = 1100,
  } = options

  const categories = brailleLines.map((line, index) => ({
    category_name: line,
    x_position: startX,
    y_position: startY + index * rowHeight,
    width: categoryWidth,
    height: rowHeight,
    hero_ids: [],
  }))

  const newConfig: DotaHeroGridConfig = {
    config_name: configName || 'GhoulGrid Anime Art',
    categories,
  }

  return {
    version: DOTA_CONFIG_VERSION,
    configs: [newConfig],
  }
}
