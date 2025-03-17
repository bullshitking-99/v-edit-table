// 模拟省、市、区的数据
const provinces = [
  { value: "zhejiang", label: "浙江" },
  { value: "jiangsu", label: "江苏" },
];

const cities = {
  zhejiang: [
    { value: "hangzhou", label: "杭州" },
    { value: "ningbo", label: "宁波" },
  ],
  jiangsu: [
    { value: "nanjing", label: "南京" },
    { value: "suzhou", label: "苏州" },
  ],
};

// 模拟区数据，对应各市
const districts = {
  hangzhou: [
    { value: "xihu", label: "西湖区" },
    { value: "binjiang", label: "滨江区" },
  ],
  ningbo: [
    { value: "haishu", label: "海曙区" },
    { value: "jiangbei", label: "江北区" },
  ],
  nanjing: [
    { value: "gulou", label: "鼓楼区" },
    { value: "jianye", label: "建邺区" },
  ],
  suzhou: [
    { value: "gusu", label: "姑苏区" },
    { value: "xiangcheng", label: "相城区" },
  ],
};

export { provinces, cities, districts };
