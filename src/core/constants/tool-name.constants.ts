export const Tool = {
  WEATHER: 'weather',
} as const;

export type ToolName = (typeof Tool)[keyof typeof Tool];
