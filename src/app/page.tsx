import React from "react";
import { Button } from "antd";
import Link from "next/link";

const Home = () => {
  return (
    <div className="p-6 min-h-screen min-w-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">可视化表格编辑器</h1>
      <p className="text-gray-600">
        这是一个基于Canvas的表格编辑器，提供灵活的单元格编辑功能和高性能的渲染体验。
      </p>
      <Link href="/table/canvas-table">
        <Button type="primary">开始体验</Button>
      </Link>
    </div>
  );
};

export default Home;
