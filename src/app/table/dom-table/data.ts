// 定义区域的接口
export interface Area {
  value: string;
  label: string;
}

// 生成省份（10个）
export const provinces: Area[] = Array.from({ length: 10 }).map((_, i) => {
  const index = i + 1;
  return { value: `province${index}`, label: `省${index}` };
});

// 生成城市，每个省 2 个市
export const cities: { [provinceValue: string]: Area[] } = provinces.reduce(
  (acc, province) => ({
    ...acc,
    [province.value]: [1, 2].map((num) => ({
      value: `${province.value}-city${num}`,
      label: `${province.label}市${num}`,
    })),
  }),
  {} as { [provinceValue: string]: Area[] }
);

// 生成区，每个市 2 个区
export const districts: { [cityValue: string]: Area[] } = Object.values(
  cities
).reduce((acc, cityList) => {
  cityList.forEach((city) => {
    acc[city.value] = [1, 2].map((num) => ({
      value: `${city.value}-district${num}`,
      label: `${city.label}区${num}`,
    }));
  });
  return acc;
}, {} as { [cityValue: string]: Area[] });

// 生成街道，每个区 2 个街道
export const streets: { [districtValue: string]: Area[] } = Object.values(
  districts
).reduce((acc, districtList) => {
  districtList.forEach((district) => {
    acc[district.value] = [1, 2].map((num) => ({
      value: `${district.value}-street${num}`,
      label: `${district.label}街道${num}`,
    }));
  });
  return acc;
}, {} as { [districtValue: string]: Area[] });

// 生成村，每个街道 2 个村
export const villages: { [streetValue: string]: Area[] } = Object.values(
  streets
).reduce((acc, streetList) => {
  streetList.forEach((street) => {
    acc[street.value] = [1, 2].map((num) => ({
      value: `${street.value}-village${num}`,
      label: `${street.label}村${num}`,
    }));
  });
  return acc;
}, {} as { [streetValue: string]: Area[] });
