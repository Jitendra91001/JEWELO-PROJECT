import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

const ScreenTopLoader = () => {
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    setProgress(100);
    return () => {
      setProgress(0);
    };
  }, []);
  return (
    <div>
      <LoadingBar
        color="blue"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    </div>
  );
};

export default ScreenTopLoader;
