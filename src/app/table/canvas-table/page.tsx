"use client";

import ShowPerformance from "@/app/components/ShowPerformance";

const CanvasTable = () => {
  return (
    <>
      <ShowPerformance />
      <canvas id="canvas" width="800" height="600" />
    </>
  );
};

export default CanvasTable;
