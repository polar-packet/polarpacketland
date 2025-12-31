declare module 'astro-icon/components' {
  // Minimal ambient declaration to allow importing Icon in .astro files.
  // Replace `any` with more specific types if desired.
  export const Icon: any;
  export default Icon;
}

declare module 'astro-icon' {
  const _default: any;
  export default _default;
}
