const dummy = (blogs) => {
  blogs.sort();
  return 1;
};

const totalLikes = (blogsList) => {
  let result = 0;
  blogsList.forEach((blog) => {
    result += blog.likes;
  });

  return result;
};

module.exports = {
  dummy,
  totalLikes
};