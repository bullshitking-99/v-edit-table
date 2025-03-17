import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// 定义导出给外部调用的 ref 类型
export interface ShowPerformanceRef {
  startInputMark: () => void;
}

const ShowPerformance = forwardRef<ShowPerformanceRef>((_, ref) => {
  // 用于记录组件渲染耗时
  const [renderTime, setRenderTime] = useState<number | null>(null);
  // 用 useRef 保存开始时间，确保每次渲染不重新赋值
  const startTimeRef = useRef<number>(performance.now());

  // 保存 INP 指数（毫秒）
  const [inp, setInp] = useState<number | null>(null);
  // 标记是否已经开始输入，避免重复标记
  const [isInputStarted, setIsInputStarted] = useState<boolean>(false);

  useImperativeHandle(
    ref,
    () => ({
      startInputMark: () => {
        if (!isInputStarted) {
          setIsInputStarted(true);
          // 标记输入开始
          performance.mark("input-start");
          // 立即请求下一帧，在下一帧中标记结束并计算耗时
          requestAnimationFrame(() => {
            performance.mark("input-end");
            performance.measure("inp", "input-start", "input-end");
            const measures = performance.getEntriesByName("inp");
            if (measures.length > 0) {
              const lastMeasure = measures[measures.length - 1];
              setInp(lastMeasure.duration);
            }
            // 清理标记和测量数据
            performance.clearMarks("input-start");
            performance.clearMarks("input-end");
            performance.clearMeasures("inp");
            setIsInputStarted(false);
          });
        }
      },
    }),
    [isInputStarted]
  );

  useLayoutEffect(() => {
    // 组件挂载后记录结束时间
    const endTime = performance.now();
    setRenderTime(endTime - startTimeRef.current);
  }, []);

  return (
    <>
      <div>
        组件渲染耗时:{" "}
        {renderTime !== null ? `${renderTime.toFixed(2)} ms` : "计算中..."}
      </div>
      <div>
        INP 指数: {inp !== null ? `${inp.toFixed(2)} ms` : "等待输入..."}
      </div>
    </>
  );
});

ShowPerformance.displayName = "ShowPerformance";

export default ShowPerformance;
