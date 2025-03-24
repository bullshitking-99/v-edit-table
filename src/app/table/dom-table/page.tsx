"use client";

import React, { useMemo, useRef } from "react";
import { Form, Table, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { cities, districts, provinces, streets, villages } from "./data";
import ShowPerformance, {
  ShowPerformanceRef,
} from "@/app/components/ShowPerformance";

const { Option } = Select;

// 定义每行数据的类型
// 定义数据行的类型
export interface DataRecord {
  key: string;
  personnelNo: string;
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  village?: string;
}

// 定义表单值的类型
interface FormValues {
  records: DataRecord[];
}

const DomTable: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [recordNum, setRecordNum] = React.useState<number>(10);

  // 初始数据，每一行包含人员编号及省、市、区、街道、村字段
  const initialData: DataRecord[] = useMemo(
    () =>
      new Array(recordNum).fill(null).map((_, index) => ({
        key: index.toString(),
        personnelNo: `${index + 1}`,
        province: undefined,
        city: undefined,
        district: undefined,
        street: undefined,
        village: undefined,
      })),
    [recordNum]
  );

  // 定义表格列，泛型指定为 DataRecord
  const columns: ColumnsType<DataRecord> = [
    {
      title: "人员编号",
      dataIndex: "personnelNo",
      key: "personnelNo",
      render: (text: string) => <span>{text}</span>,
      width: 100,
    },
    {
      title: "省",
      dataIndex: "province",
      key: "province",
      render: (_, record: DataRecord, index: number) => (
        // shouldUpdate 仅监听除当前行外其它行省份拼接字符串的变化
        <Form.Item
          shouldUpdate={(prev, cur) => {
            const prevProvinces = (prev.records || [])
              .filter((_: DataRecord, idx: number) => idx !== index)
              .map((r: DataRecord) => r.province)
              .join("|");
            const curProvinces = (cur.records || [])
              .filter((_: DataRecord, idx: number) => idx !== index)
              .map((r: DataRecord) => r.province)
              .join("|");
            return prevProvinces !== curProvinces;
          }}
          noStyle
        >
          {({ getFieldValue }) => {
            const records: DataRecord[] = getFieldValue("records") || [];
            // 收集除当前行外，已选择的省份
            const selectedProvinces = new Set(
              records
                .filter((r, idx) => idx !== index && r.province)
                .map((r) => r.province)
            );
            return (
              <Form.Item
                name={["records", index, "province"]}
                rules={[{ required: true, message: "请选择省份" }]}
              >
                <Select
                  placeholder="请选择省份"
                  allowClear
                  onChange={() => {
                    // 省份变化时清空下级字段：市、区、街道、村
                    form.setFields([
                      { name: ["records", index, "city"], value: undefined },
                      {
                        name: ["records", index, "district"],
                        value: undefined,
                      },
                      { name: ["records", index, "street"], value: undefined },
                      { name: ["records", index, "village"], value: undefined },
                    ]);
                  }}
                >
                  {provinces.map((item) => (
                    <Option
                      key={item.value}
                      value={item.value}
                      disabled={selectedProvinces.has(item.value)}
                    >
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      ),
    },
    {
      title: "市",
      dataIndex: "city",
      key: "city",
      render: (_, record: DataRecord, index: number) => (
        <Form.Item
          shouldUpdate={(prev, cur) =>
            prev.records?.[index]?.province !== cur.records?.[index]?.province
          }
          noStyle
        >
          {({ getFieldValue }) => {
            const province = getFieldValue(["records", index, "province"]);
            return (
              <Form.Item
                name={["records", index, "city"]}
                rules={[{ required: true, message: "请选择市" }]}
              >
                <Select
                  placeholder="请选择市"
                  allowClear
                  disabled={!province}
                  onChange={() => {
                    // 市变化时清空下级字段：区、街道、村
                    form.setFields([
                      {
                        name: ["records", index, "district"],
                        value: undefined,
                      },
                      { name: ["records", index, "street"], value: undefined },
                      { name: ["records", index, "village"], value: undefined },
                    ]);
                  }}
                >
                  {(province
                    ? cities[province as keyof typeof cities] || []
                    : []
                  ).map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      ),
    },
    {
      title: "区",
      dataIndex: "district",
      key: "district",
      render: (_, record: DataRecord, index: number) => (
        <Form.Item dependencies={[["records", index, "city"]]} noStyle>
          {({ getFieldValue }) => {
            const city = getFieldValue(["records", index, "city"]);
            return (
              <Form.Item
                name={["records", index, "district"]}
                rules={[{ required: true, message: "请选择区" }]}
              >
                <Select
                  placeholder="请选择区"
                  allowClear
                  disabled={!city}
                  onChange={() => {
                    // 区变化时清空下级字段：街道、村
                    form.setFields([
                      { name: ["records", index, "street"], value: undefined },
                      { name: ["records", index, "village"], value: undefined },
                    ]);
                  }}
                >
                  {(city
                    ? districts[city as keyof typeof districts] || []
                    : []
                  ).map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      ),
    },
    {
      title: "街道",
      dataIndex: "street",
      key: "street",
      render: (_, record: DataRecord, index: number) => (
        <Form.Item dependencies={[["records", index, "district"]]} noStyle>
          {({ getFieldValue }) => {
            const district = getFieldValue(["records", index, "district"]);
            return (
              <Form.Item
                name={["records", index, "street"]}
                rules={[{ required: true, message: "请选择街道" }]}
              >
                <Select
                  placeholder="请选择街道"
                  allowClear
                  disabled={!district}
                  onChange={() => {
                    // 街道变化时清空村字段
                    form.setFields([
                      { name: ["records", index, "village"], value: undefined },
                    ]);
                  }}
                >
                  {(district
                    ? streets[district as keyof typeof streets] || []
                    : []
                  ).map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      ),
    },
    {
      title: "村",
      dataIndex: "village",
      key: "village",
      render: (_, record: DataRecord, index: number) => (
        <Form.Item dependencies={[["records", index, "street"]]} noStyle>
          {({ getFieldValue }) => {
            const street = getFieldValue(["records", index, "street"]);
            return (
              <Form.Item
                name={["records", index, "village"]}
                rules={[{ required: true, message: "请选择村" }]}
              >
                <Select placeholder="请选择村" allowClear disabled={!street}>
                  {(street
                    ? villages[street as keyof typeof villages] || []
                    : []
                  ).map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      ),
    },
  ];

  const performanceRef = useRef<ShowPerformanceRef>(null);

  const handleInputStart = () => {
    // 调用 ShowPerformance 内部的 startInputMark 方法
    performanceRef.current?.startInputMark();
  };

  return (
    <>
      <ShowPerformance ref={performanceRef} />
      <Select
        defaultValue={recordNum}
        style={{ width: 200 }}
        onChange={(value) => {
          handleInputStart();
          setRecordNum(value);
        }}
        prefix={<span>表格数据量：</span>}
      >
        <Option value={10}>10</Option>
        <Option value={20}>20</Option>
        <Option value={50}>50</Option>
        <Option value={100}>100</Option>
      </Select>
      <Form
        form={form}
        onValuesChange={handleInputStart}
        initialValues={{ records: initialData }}
      >
        <Table<DataRecord>
          rowKey="key"
          dataSource={initialData}
          columns={columns}
          pagination={false}
        />
      </Form>
    </>
  );
};

export default DomTable;
