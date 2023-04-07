class CourseView {
  constructor() {
    this.courseList = document.querySelector(".course-list");
    this.courseSelection = document.querySelector(".course-selection");
    this.addBtn = document.querySelector("#addbtn");
    this.actionText = document.querySelector("#action-text");
  }

  renderCourses(courses) {
    this.courseList.innerHTML = "";
    courses.forEach((course) => {
      const courseElem = this.createCourseElement(course);
      this.courseList.appendChild(courseElem);
    });
  }
  createCourseElement(course) {
    const courseElem = document.createElement("div");
    courseElem.classList.add("course-element");
    courseElem.setAttribute("course-id", course.courseId);
    courseElem.setAttribute("course-credit", course.credit);
    courseElem.setAttribute("course-info", [
      course.courseName,
      course.required,
      course.credit,
    ]);
    const courseTitle = document.createElement("div");
    courseTitle.classList.add("course-title");
    courseTitle.innerText = course.courseName;
    const courseType = document.createElement("div");
    courseType.classList.add("course-type");
    courseType.innerText = course.required
      ? "Course Type : Compulsory"
      : "Course Type : Elective";
    const courseCredit = document.createElement("div");
    courseCredit.classList.add("course-credit");
    courseCredit.innerText = course.credit;

    courseElem.appendChild(courseTitle);
    courseElem.appendChild(courseType);
    courseElem.appendChild(courseCredit);
    // if (course.required) {
    //   courseType.innerText = "Course Type : Compulsory";
    // } else {
    //   courseType.innerText = "Course Type : Elective";
    // }
    return courseElem;
  }
}
class CourseModel {
  #courses;
  constructor() {
    this.#courses = [];
    this.totalCredits = 0;
    this.selected = new Map();
  }
  async fetchCourses() {
    const courses = await API.getCourses();
    this.courses = courses;
    return courses;
  }
}
class CourseControl {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }
  init() {
    this.model.fetchCourses().then(() => {
      const courses = this.model.courses;
      this.view.renderCourses(courses);
    });
    this.setUpSelect();
  }
  setUpSelect() {
    this.view.courseList.addEventListener("click", (e) => {
      let target = e.target;
      if (!target.classList.contains("course-element")) {
        target = target.parentElement;
      }
      if (this.model.selected.has(target.getAttribute("course-id"))) {
        target.classList.remove("course-selected");
        this.model.selected.delete(target.getAttribute("course-id"));
        this.model.totalCredits -= Number(target.getAttribute("course-credit"));
      } else {
        if (
          this.model.totalCredits +
            Number(target.getAttribute("course-credit")) >
          18
        ) {
          alert("You can only choose up to 18 credits in one semester");
          return;
        }
        target.classList.add("course-selected");
        this.model.selected.set(
          target.getAttribute("course-id"),
          target.getAttribute("course-info")
        );
        this.model.totalCredits += Number(target.getAttribute("course-credit"));
      }
      this.view.actionText.innerHTML = "";
      this.view.actionText.innerHTML = this.model.totalCredits;
      console.log(this.model.selected);
    });
    this.view.addBtn.addEventListener("click", () => {
      const response = confirm(
        "You have chosen " +
          this.model.totalCredits +
          " credits for this semester. You cannot change once you submit. Do you want to confirm?"
      );
      if (!response) {
        return;
      }
      const courses = Array.from(this.model.selected.values());
      courses.forEach((course) => {
        const info = course.split(",");
        const courseElem = document.createElement("div");
        courseElem.classList.add("course-element");
        const courseTitle = document.createElement("div");
        courseTitle.classList.add("course-title");
        courseTitle.innerText = info[0];
        const courseType = document.createElement("div");
        courseType.classList.add("course-type");
        if (info[1] === "true") {
          courseType.innerText = "Course Type : Compulsory";
        } else {
          courseType.innerText = "Course Type : Elective";
        }
        const courseCredit = document.createElement("div");
        courseCredit.classList.add("course-credit");
        courseCredit.innerText = info[2];

        courseElem.appendChild(courseTitle);
        courseElem.appendChild(courseType);
        courseElem.appendChild(courseCredit);
        this.view.courseSelection.appendChild(courseElem);
        this.view.addBtn.disabled = true;
      });
    });
  }
}
const app = new CourseControl(new CourseModel(), new CourseView());
