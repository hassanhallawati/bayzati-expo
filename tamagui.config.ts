import { createTamagui, createTokens } from 'tamagui'
import { config } from '@tamagui/config/v3'

// Custom color tokens for the expense tracker
const customTokens = createTokens({
  ...config.tokens,
  color: {
    // Brand Colors
    primaryDeepGreen: '#0B3D2E',
    primaryGreen: '#176458',
    primaryBg: '#F4F4F5',
    primaryCard: '#FAFAFA',
    white: '#FFFFFF',
    black: '#000000',

    // Semantic Colors
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    error: '#EF4444',
    expense: '#EF4444',
    success: '#22C55E',
    income: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Keep existing tokens for compatibility
    ...config.tokens.color,
  },
})

const tamaguiConfig = createTamagui({
  ...config,
  tokens: customTokens,
  shorthands: config.shorthands,
  themes: {
    light: {
      background: customTokens.color.primaryBg,
      backgroundHover: customTokens.color.primaryCard,
      backgroundPress: customTokens.color.primaryCard,
      backgroundFocus: customTokens.color.primaryCard,
      borderColor: customTokens.color.border,
      borderColorHover: customTokens.color.border,
      borderColorFocus: customTokens.color.primaryGreen,
      borderColorPress: customTokens.color.primaryGreen,
      color: customTokens.color.textPrimary,
      colorHover: customTokens.color.textPrimary,
      colorPress: customTokens.color.textPrimary,
      colorFocus: customTokens.color.textPrimary,
      colorTransparent: 'rgba(0,0,0,0)',
      placeholderColor: customTokens.color.textSecondary,
      shadowColor: customTokens.color.black,
      shadowColorHover: customTokens.color.black,
      shadowColorPress: customTokens.color.black,
      shadowColorFocus: customTokens.color.black,
    },
    dark: {
      background: '#1F2937',
      backgroundHover: '#374151',
      backgroundPress: '#374151',
      backgroundFocus: '#374151',
      borderColor: '#4B5563',
      borderColorHover: '#4B5563',
      borderColorFocus: customTokens.color.primaryGreen,
      borderColorPress: customTokens.color.primaryGreen,
      color: '#F9FAFB',
      colorHover: '#F9FAFB',
      colorPress: '#F9FAFB',
      colorFocus: '#F9FAFB',
      colorTransparent: 'rgba(0,0,0,0)',
      placeholderColor: '#9CA3AF',
      shadowColor: customTokens.color.black,
      shadowColorHover: customTokens.color.black,
      shadowColorPress: customTokens.color.black,
      shadowColorFocus: customTokens.color.black,
    },
  },
})

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
