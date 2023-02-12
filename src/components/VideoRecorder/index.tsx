import { useState, useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";

export interface VideoControllerProps {
  onRecordComplete: (video: any, thumbnail: any) => void;
  onClose: () => void;
}
const VideoController: React.FC<VideoControllerProps> = ({
  onRecordComplete,
  onClose,
}) => {
  const canvasRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const [videoConstraints, setVideoConstraints] = useState<any>({
    width: 1280,
    height: 720,
    facingMode: "user",
  });
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const [processing, setProcessing] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const onCameraToggle = () => {
    if (videoConstraints?.facingMode === "user") {
      setVideoConstraints({
        ...videoConstraints,
        facingMode: { exact: "environment" },
      });
    } else {
      setVideoConstraints({
        ...videoConstraints,
        facingMode: "user",
      });
    }
  };

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }: { data: any }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const generateVideoThumbnail = async (chunks: any) => {
    const blob = new Blob(chunks, {
      type: "video/mp4",
    });
    videoRef.current.src = URL.createObjectURL(blob);
    videoRef.current.onloadeddata = () => {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth / 4;
      canvas.height = videoRef.current.videoHeight / 4;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL();
      const video = blob;
      onRecordComplete(video, thumbnail);
    };
  };

  const handleStopCaptureClick = () => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setProcessing(true);
  };

  const onUserMediaError = () => {
    // TODO - Add alert for user media error like permission etc,
  };

  useEffect(() => {
    if (processing && recordedChunks.length) {
      generateVideoThumbnail(recordedChunks);
    }
  }, [recordedChunks, processing]);

  return (
    <div className="fixed w-screen h-screen top-0 left-0 flex flex-col justify-start bg-black z-100">
      <div className="md:max-w-[700px] mx-auto block w-full h-full">
        <div className="p-4">
          <Webcam
            audio={true}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
            className="w-full h-auto block"
            ref={webcamRef}
            onUserMediaError={onUserMediaError}
          />
          <canvas ref={canvasRef} className="hidden" />
          <video ref={videoRef} className="hidden" autoPlay muted />
          <div className="flex flex-nowrap justify-center align-middle items-center">
            <button
              onClick={onCameraToggle}
              className="text-xs bg-blue-800 text-white p-2 m-1"
            >
              Toggle Camera
            </button>
            {capturing ? (
              <button
                onClick={handleStopCaptureClick}
                className="text-xs bg-blue-800 text-white p-2 m-1"
              >
                Stop Record
              </button>
            ) : (
              <>
                <button
                  onClick={handleStartCaptureClick}
                  className="text-xs bg-blue-800 text-white p-2 m-1"
                >
                  Record Video
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoController;
