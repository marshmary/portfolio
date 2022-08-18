import React from 'react';
import LogoBar from './LogoBar';

const LogoList = ({ className = "", style = {} }) => {
    // Icon & Page url list
    const frontEndList = [
        {
            title: "React",
            page: "https://reactjs.org/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        },
        {
            title: "NextJS",
            page: "https://nextjs.org/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        },
        {
            title: "Vue",
            page: "https://v3.vuejs.org/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        },
        {
            title: "Bootstrap",
            page: "https://getbootstrap.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg',
        },
        {
            title: "Tailwind",
            page: "https://tailwindcss.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
        },
        {
            title: "Figma",
            page: "https://www.figma.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
        },
        {
            title: "Adobe XD",
            page: "https://www.adobe.com/hk_en/products/xd.html",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg',
        },
        {
            title: "HTML5",
            page: "https://developer.mozilla.org/en-US/docs/Glossary/HTML5",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        },
        {
            title: "CSS3",
            page: "https://developer.mozilla.org/en-US/docs/Web/CSS",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
        },
        {
            title: "JS",
            page: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        },
    ]

    const backEndList = [
        {
            title: "ASP.NET Core",
            page: "https://dotnet.microsoft.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
        },
        {
            title: "FastAPI",
            page: "https://fastapi.tiangolo.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
        },
        {
            title: "Laravel",
            page: "https://laravel.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
        },
        {
            title: "C#",
            page: "https://docs.microsoft.com/en-us/dotnet/csharp/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
        },
        {
            title: "Python",
            page: "https://www.python.org/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        },
        {
            title: "PHP",
            page: "https://www.php.net/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
        },
    ]

    const databaseList = [
        {
            title: "SQL Server",
            page: "https://www.microsoft.com/en-us/sql-server/sql-server-downloads",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
        },
        {
            title: "Mongo",
            page: "https://www.mongodb.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        },
        {
            title: "PostgreSQL",
            page: "https://www.postgresql.org/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        },
        {
            title: "MySQL",
            page: "https://www.mysql.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        },
        {
            title: "Redis",
            page: "https://redis.io/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
        },
        {
            title: "DynamoDB",
            page: "https://aws.amazon.com/dynamodb/",
            url: 'https://amazon-dynamodb-labs.com/images/Amazon-DynamoDB.png',
        },
    ]

    const otherList = [
        {
            title: "Git",
            page: "https://git-scm.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        },
        {
            title: "Docker",
            page: "https://www.docker.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain.svg',
        },
        {
            title: "Kubernetes",
            page: "https://kubernetes.io/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
        },
        {
            title: "Github",
            page: "https://github.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        },
        {
            title: "Gitlab",
            page: "https://gitlab.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
        },
        {
            title: "Heroku",
            page: "https://www.heroku.com",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-plain.svg',
        },
        {
            title: "Unity",
            page: "https://unity.com/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
        },
        {
            title: "Arduino",
            page: "https://www.arduino.cc/",
            url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
        },
    ]

    return (
        <div style={{ ...style }} className={`row mx-0 ${className}`}>
            <LogoBar key={"front-end"} className="col-12 px-0 mb-3" title="Front-end" iconList={frontEndList}></LogoBar>

            {/* 2 col in a row */}
            <div className="col-6 ps-0 pe-2 mb-3">
                <LogoBar key={"back-end"} className="col-12" half={true} title="Back-end" iconList={backEndList}></LogoBar>
            </div>
            <div className="col-6 ps-2 pe-0 mb-3">
                <LogoBar key={"database"} className="col-12" half={true} title="Database" iconList={databaseList}></LogoBar>
            </div>

            <LogoBar key={"other"} className="col-12 px-0" title="Other" iconList={otherList}></LogoBar>
        </div>
    );
}

export default LogoList;