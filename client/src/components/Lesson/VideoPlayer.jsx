// Simple Video Player using an iframe for YouTube
const VideoPlayer = ({ videoId, timestamps }) => {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full object-cover"
    ></iframe>
  );
};

export default VideoPlayer;
