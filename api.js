const API = (() => {
  const API_URL = "http://localhost:3000/courseList";

  //Create a promise to get all courses
  const getCourses = async () => {
    const res = await fetch(API_URL);
    return await res.json();
  };
  return {
    getCourses,
  };
})();
