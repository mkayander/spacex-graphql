export const getYouTubeThumbnailImageUrls = (videoUrl: string) => {
  const split = videoUrl.split("/");
  const id = split[split.length - 1];
  return `https://i.ytimg.com/vi/${id}/hq720.jpg`;
  // return `https://img.youtube.com/vi/${id}/${i}.jpg`;
};
