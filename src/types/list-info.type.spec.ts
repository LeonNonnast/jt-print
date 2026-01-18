import { Systems } from './systems.enum';
import { ListInfo } from './list-info.type';

export function createListInfo(
  system: Systems,
  category: string,
  size: number,
  athleteCount: number,
): ListInfo {
  return {
    system,
    category,
    size,
    athleteCount,
  };
}

describe('test document info type', () => {
  it('should create document info', () => {
    const system = Systems.BestOfThree;
    const category = 'U18 | -66';
    const size = 3;
    const athleteCount = 2;

    const listInfo = createListInfo(system, category, size, athleteCount);
    expect(listInfo).not.toBeNull();
    expect(listInfo.system).toEqual(system);
    expect(listInfo.category).toEqual(category);
    expect(listInfo.size).toEqual(size);
    expect(listInfo.athleteCount).toEqual(athleteCount);
  });
});
