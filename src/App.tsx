import { useState } from "react";
import VideoRecorder from "./components/VideoRecorder";

function App() {
  const [showRecorder, setShowRecorder] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<any>(null);
  const [previewVideo, setPreviewVideo] = useState<any>(null);
  const toggleShow = () => setShowRecorder((val) => !val);
  const onRecordComplete = (video: any, thumbnail: any) => {
    if (thumbnail) {
      setPreviewThumbnail(thumbnail);
    }
    if (video) {
      setPreviewVideo(video);
    }
    setShowRecorder(false);
  };
  return (
    <div className="App">
      <h1 className="text-lg text-blue-500">Hello</h1>
      {previewThumbnail && previewVideo ? (
        <div className="relative w-full h-auto">
          <video
            width="320"
            height="240"
            controls
            playsInline
            className="relative mx-auto w-96 h-auto block"
            poster={previewThumbnail}
          >
            <source src={URL.createObjectURL(previewVideo)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={toggleShow}
            className="bg-slate-500 m-1 p-2 rounded-md text-sm text-white"
          >
            Open Camera
          </button>
          <button
            type="button"
            className="bg-slate-500 m-1 p-2 rounded-md text-sm text-white"
          >
            Upload File
          </button>
          {showRecorder ? (
            <VideoRecorder
              onClose={toggleShow}
              onRecordComplete={onRecordComplete}
            />
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}

export default App;
