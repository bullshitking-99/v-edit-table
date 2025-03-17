"use client";

import React, { useRef } from "react";
import { Form, Table, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { cities, districts, provinces } from "./data";
import ShowPerformance, {
  ShowPerformanceRef,
} from "@/app/components/ShowPerformance";

const { Option } = Select;

// 定义每行数据的类型
interface DataRecord {
  key: string;
  personnelNo: string;
  province?: string;
  city?: string;
  district?: string;
}

// 定义表单值的类型
interface FormValues {
  records: DataRecord[];
}

const DomTable: React.FC = () => {
  const [form] = Form.useForm<FormValues>();

  // 初始数据，每一行包含人员编号、以及省、市、区字段
  const initialData: DataRecord[] = new Array(100)
    .fill(null)
    .map((_, index) => ({
      key: index.toString(),
      personnelNo: `${index + 1}`,
      province: undefined,
      city: undefined,
      district: undefined,
    }));

  // 定义表格列，泛型指定为 DataRecord
  const columns: ColumnsType<DataRecord> = [
    {
      title: "人员编号",
      dataIndex: "personnelNo",
      key: "personnelNo",
      // 该列不可编辑，直接展示
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "省",
      dataIndex: "province",
      key: "province",
      render: (_, record: DataRecord, index: number) => (
        <Form.Item
          name={["records", index, "province"]}
          rules={[{ required: true, message: "请选择省份" }]}
        >
          <Select
            placeholder="请选择省份"
            onChange={() => {
              // 当省份改变时，清空当前行的市和区的值
              form.setFields([
                { name: ["records", index, "city"], value: undefined },
                { name: ["records", index, "district"], value: undefined },
              ]);
            }}
          >
            {provinces.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "市",
      dataIndex: "city",
      key: "city",
      render: (_, record: DataRecord, index: number) => (
        // 使用 shouldUpdate 监控省份变化
        <Form.Item
          shouldUpdate={(prevValues, curValues) =>
            prevValues.records?.[index]?.province !==
            curValues.records?.[index]?.province
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
                  onChange={() => {
                    // 当市改变时，清空当前行的区的值
                    form.setFields([
                      {
                        name: ["records", index, "district"],
                        value: undefined,
                      },
                    ]);
                  }}
                >
                  {(cities[province as keyof typeof cities] || []).map(
                    (item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    )
                  )}
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
        // 使用 dependencies 监听市的变化
        <Form.Item dependencies={[["records", index, "city"]]} noStyle>
          {({ getFieldValue }) => {
            const city = getFieldValue(["records", index, "city"]);
            return (
              <Form.Item
                name={["records", index, "district"]}
                rules={[{ required: true, message: "请选择区" }]}
              >
                <Select placeholder="请选择区">
                  {(districts[city as keyof typeof districts] || []).map(
                    (item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    )
                  )}
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
