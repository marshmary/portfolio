import React from "react";
import "../styles/Common.css";
import "../styles/Projects.css";
import PageWrapper from "../components/PageWrapper";
import ProjectCard from "../components/ProjectCard";
import Fade from "react-reveal/Fade";

const Projects = () => {
  const projectList = [
    {
      info: {
        type: "Personal",
        name: "Neru",
        description: "Landing page for my favorite Vsinger",
        url: "https://neru.netlify.app/",
        stack: "ReactTS",
      },
      styling: {
        colorPrimary: "#73a6a4",
        colorSecondary: "#d6e1df",
      },
      isHorizontal: false,
    },
    {
      info: {
        type: "Group",
        name: "Avis",
        description:
          "My capstone project in university - hum to song & song sharing platform",
        url: "https://avisapp.netlify.app/",
        stack: "ReactTS, Dotnet, FastAPI, MongoDB, PostgreSQL AWS",
      },
      styling: {
        colorPrimary: "#152432",
        colorSecondary: "#969B9B",
      },
      isHorizontal: true,
    },
    {
      info: {
        type: "Group",
        name: "Draplus",
        description:
          "Online group communication when discussing projects is always a pain when sharing ideas among group members. We design a solution for this problem by providing online collaborating drawing and group chat included.",
        url: "https://draplus.netlify.app/",
        stack: "ReactTS, Dotnet, SignalR, MongoDB",
      },
      styling: {
        colorPrimary: "#66B8F1",
        colorSecondary: "#DEF1FA",
      },
      isHorizontal: false,
    },
    {
      info: {
        type: "Group",
        name: "Kronii",
        description:
          "A web system in which FSoft Academy can reduce the time to manage all processes including student management, class management, cost management, and third party companies management by automating almost all main parts of the processes",
        url: "https://kronii.netlify.app/",
        stack: "ReactJS, Dotnet, PostgreSQL",
      },
      styling: {
        colorPrimary: "#37A5C1",
        colorSecondary: "#CAE0ED",
      },
      isHorizontal: true,
    },
    {
      info: {
        type: "Group",
        name: "Hocsu",
        description: "A timeline for learning Viet Nam history",
        url: "https://hocsu.netlify.app/",
        stack: "ReactTS, Firebase",
      },
      styling: {
        colorPrimary: "#73a6a4",
        colorSecondary: "#d6e1df",
      },
      isHorizontal: false,
    },
    {
      info: {
        type: "Personal",
        name: "Lapis",
        description: "Anime wallpaper every day",
        url: "https://lapis.netlify.app/",
        stack: "VueJS, Dotnet, MongoDB",
      },
      styling: {
        colorPrimary: "#D0A78A",
        colorSecondary: "#EFD8C5",
      },
      isHorizontal: false,
    },
    // {
    //   info: {
    //     type: "Personal",
    //     name: "Self profile",
    //     description:
    //       "My online profile, I will support multiple languages in the future.",
    //     url: "https://phutt.netlify.app/",
    //   },
    //   styling: {
    //     colorPrimary: "#F79DA4",
    //     colorSecondary: "#F3DCE0",
    //   },
    //   isHorizontal: false,
    // },
  ];

  return (
    <div id="projects">
      <PageWrapper>
        {/* Title */}
        <div className="section_title h-100">Projects</div>

        {/* Content */}
        <div
          className="row mx-0 mt-3"
          data-masonry='{"percentPosition": true }'
        >
          {projectList.map((pro) => {
            if (pro.isHorizontal) {
              return (
                <Fade bottom key={Math.random()}>
                  <div className="col-sm-12 col-md-6 mb-4">
                    <ProjectCard
                      cardInfo={pro}
                      isHorizontal={pro.isHorizontal}
                    ></ProjectCard>
                  </div>
                </Fade>
              );
            }
            return (
              <Fade bottom key={Math.random()}>
                <div className="col-sm-6 col-md-3 mb-4">
                  <ProjectCard
                    cardInfo={pro}
                    isHorizontal={pro.isHorizontal}
                  ></ProjectCard>
                </div>
              </Fade>
            );
          })}
        </div>
      </PageWrapper>
    </div>
  );
};

export default Projects;
