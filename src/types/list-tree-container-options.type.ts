export type ContainerOptions = {
  /**
   * width for athlete name
   * will be used for athlete container and result line
   * @type {number}
   */
  w: number;

  /**
   * height of container row height
   *
   * @type {number}
   */
  h: number;

  /**
   * padding left defines padding between text start and left border
   * default: 1px
   * @type {number}
   */
  pl: number;
};

export function buildContainerOptions(
  w: number,
  h: number,
  pl = 1,
): ContainerOptions {
  return {
    w,
    h,
    pl,
  };
}
