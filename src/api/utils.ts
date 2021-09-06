export const getYouTubeThumbnailImageUrls = (videoUrl: string, count: number = 1) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const split = videoUrl.split("/");
    const id = split[split.length - 1];
    result.push(`https://img.youtube.com/vi/${id}/${i}.jpg`);
  }

  return result;
};
