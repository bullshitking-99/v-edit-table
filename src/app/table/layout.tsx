"use client";

import { ReactNode } from "react";
import { Segmented } from "antd";
import { usePathname, useRouter } from "next/navigation";

const DisplayTable = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const options = [
    { value: "/table/dom-table", label: "DOM Table" },
    { value: "/table/canvas-table", label: "Canvas Table" },
  ];

  return (
    <div className="p-4 flex flex-col item-center justify-center gap-4">
      <div className="flex justify-center">
        <Segmented
          value={pathname}
          options={options}
          onChange={(value) => router.push(value.toString())}
          size="large"
          className="text-lg"
        />
      </div>
      {children}
    </div>
  );
};

export default DisplayTable;
