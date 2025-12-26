/**
 * Convert a File/Blob to base64 data URL string.
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/**
 * Capture a still frame from the user's camera if available.
 * Returns a data URL string or throws on failure.
 * Note: Must be called in response to a user gesture.
 * @returns {Promise<string>}
 */
export async function captureFromCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera not supported");
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  try {
    const track = stream.getVideoTracks()[0];
    const imageCapture = "ImageCapture" in window ? new window.ImageCapture(track) : null;

    // Create a video element to draw a frame
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    // Stop the stream
    track.stop();
    video.srcObject = null;

    return canvas.toDataURL("image/jpeg", 0.85);
  } catch (e) {
    stream.getTracks().forEach(t => t.stop());
    throw e;
  }
}
