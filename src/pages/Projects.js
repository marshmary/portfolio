import React from 'react';
import '../styles/Common.css';
import '../styles/Projects.css';
import PageWrapper from '../components/PageWrapper';
import ProjectCard from '../components/ProjectCard';
import Fade from 'react-reveal/Fade';

const Projects = () => {
    const projectList = [
        {
            info: {
                type: "Personal",
                name: "Self profile",
                description: "My online profile, I will support multiple languages in the future.",
                url: "",
            },
            styling: {
                colorPrimary: "#F79DA4",
                colorSecondary: "#F3DCE0"
            },
            isHorizontal: false
        },
        {
            info: {
                type: "Group",
                name: "Kronii",
                description: "A web system in which FPT Soft Academy can reduce the time to manage all processes including student management, class management, cost management, and third party companies management by automating almost all main parts of the processes",
                url: "https://kronii.netlify.app/",
            },
            styling: {
                colorPrimary: "#37A5C1",
                colorSecondary: "#CAE0ED"
            },
            isHorizontal: true
        },
        {
            info: {
                type: "Group",
                name: "Angeloid",
                description: "An anime wiki website – a platform for user to search, view detail, rating or review their favorite anime and create their own discussion thread. Our most improment is that help user to search anmime with image by Deep Learning.",
                url: "",
            },
            styling: {
                colorPrimary: "#73a6a4",
                colorSecondary: "#d6e1df"
            },
            isHorizontal: false
        },
        {
            info: {
                type: "Unknown",
                name: "Future",
                description: "ꋖꍩꈼ ꍩꌅꈼꄞ ꁲꋖꋖꌅꂑꋰꐇꋖꈼ ꌅꈼꁷꐇꂑꌅꈼꌚ ꁲ ꀰꁲ꒒ꂑꂠ ꀰꁲ꒒ꐇꈼ ꋖꂦ ꋰꈼ ꁲꀯꀯꈼꌚꌚꂑꋰ꒒ꈼ. ꉣꌅꂦꀰꂑꂠꈼ ꁲ ꀰꁲ꒒ꂑꂠ, ꋊꁲꀰꂑꁅꁲꋰ꒒ꈼ ꁲꂠꂠꌅꈼꌚꌚ ꁲꌚ ꋖꍩꈼ ꍩꌅꈼꄞ ꀰꁲ꒒ꐇꈼ. ꂑꄞ ꐞꂦꐇ ꀯꁲꋊꋊꂦꋖ ꉣꌅꂦꀰꂑꂠꈼ ꁲ ꀰꁲ꒒ꂑꂠ ꍩꌅꈼꄞ, ꋰꐇꋖ ꌚꋖꂑ꒒꒒ ꋊꈼꈼꂠ ꋖꍩꈼ ꈼ꒒ꈼꂵꈼꋊꋖ ꋖꂦ ꌅꈼꌚꈼꂵꋰ꒒ꈼ ꁲ ꒒ꂑꋊꀗ",
                url: "",
            },
            styling: {
                colorPrimary: "#152432",
                colorSecondary: "#969B9B"
            },
            isHorizontal: true
        },
        {
            info: {
                type: "Unknown",
                name: "ꋰꈼ ꁲꀯꀯꈼꌚꌚꂑꋰ꒒ꈼ.",
                description: "ꋖꍩꈼ ꍩꌅꈼꄞ ꁲꋖꋖꌅꂑꋰꐇꋖꈼ ꌅꈼꁷꐇꂑꌅꈼꌚ ꁲ ꀰꁲ꒒ꂑꂠ ꀰꁲ꒒ꐇꈼ ꋖꂦ ꋰꈼ ꁲꀯꀯꈼꌚꌚꂑꋰ꒒ꈼ. ꉣꌅꂦꀰꂑꂠꈼ ꁲ ꀰꁲ꒒ꂑꂠ, ꋊꁲꀰꂑꁅꁲꋰ꒒ꈼ ꁲꂠꂠꌅꈼꌚꌚ ꁲꌚ ꋖꍩꈼ ꍩꌅꈼꄞ ꀰꁲ꒒ꐇꈼ. ꂑꄞ ꐞꂦꐇ ꀯꁲꋊꋊꂦꋖ ꉣꌅꂦꀰꂑꂠꈼ ꁲ ꀰꁲ꒒ꂑꂠ ꍩꌅꈼꄞ, ꋰꐇꋖ ꌚꋖꂑ꒒꒒ ꋊꈼꈼꂠ ꋖꍩꈼ ꈼ꒒ꈼꂵꈼꋊꋖ ꋖꂦ ꌅꈼꌚꈼꂵꋰ꒒ꈼ ꁲ ꒒ꂑꋊꀗ, ꐇꌚꈼ ꁲ ꋰꐇꋖꋖꂦꋊ ꁲꋊꂠ ꀯꍩꁲꋊꁅꈼ ꂑꋖ ꅏꂑꋖꍩ ꁲꉣꉣꌅꂦꉣꌅꂑꁲꋖꈼ ꌚꋖꐞ꒒ꈼꌚ. ꒒ꈼꁲꌅꋊ ꂵꂦꌅꈼ: ꍩꋖꋖꉣꌚ://ꁅꂑꋖꍩꐇꋰ",
                url: "",
            },
            styling: {
                colorPrimary: "#D0A78A",
                colorSecondary: "#EFD8C5"
            },
            isHorizontal: false
        },
        {
            info: {
                type: "Unknown",
                name: "Future",
                description: "T͎̟͍̝ͣ̄̀̔͞h͆̏͏̫͇e͋͏̻̫̥͚͈̱̣ͅ ̙̜͑̋̚͝h̸̻̜̫̒̾ͅr̹̦̀̾͑̒́ẽ̏͏̝͕̣̹f̳̫̤̜͙͎̓͘ ̵̜̠̪͒̅͆a̶̻͎̤͖̰̗̳̎͌̔͋t̢̥͙̮̱̫̳̉͗̚t̵̘̹͖̝̣͛̂ͪ̌r̬̲̗̓̄́i̢̮̯̙̠͉̱̻̭̎̐̎̚b̧͖̬̎̐u̧͚͔̪̥̒̽̍t̸̰͖̣͉͖͙̓ẻ̢̱̹̞͕͙͕̜̄ͅ ͯͩ̿ͨ͏͙͙r̻̲̳͓̖͉̦̟̊͞e̩͍̼͓̓ͧ͞q̴̜̠̹͔̝͖̮̒͛̑ͣͅu̔ͩ̎҉͔̹̥̹̲̘̖i̮̳͙̭̰͙̒͊͠ř̛̹̭͛͐e̬̰͇̞̺̦̩ͯ̑̽̊͜ͅs̛̤̠̲̞͔͖ͨͬͅ ̛̗͇̮̯̜̙̲̘̒ͩͭ̓ḁ̸̖̻̝̭̖̹ͯͪ̓ ̱͈̬̈́̏ͦ̾́v̢͈̜̣̙̰̯͉̚ͅa̹̤͍̩͍̙̩͗̋ͦ̃͟l̎͒̚҉̼̟̪͇i̵͕̜̳̙̫̰̳̒ḍ̴͔̩̹̲̯̪͍̄ͭ̅ ͩ̍ͯ̅͏͖̤̞͇̫͔̘v̜̞̭͌̀a̡̮̯̭͚̟̳̩͎͛̏̾̒l̪̰̟͕ͩͥ͢u̷͉̹̳͈͇͙̎e̝̱̞̪ͪ́̈͋͢ ̞̱̬̬̝̓̓̂͟t̷̳̣̝̲̗̳̅ͣ͐͊ǫ̙̲͚̈́ ͈̖̇ͮ͜b̡̹̦̠̠̹̺ͪ͂̋̅e̗͔̺̹̯̻̤̿̄̿̀ ̘̞̖̙͍ͪ͒͜a͎͇̦͈̯̤͌͝ć̴͎̖̮͆̅̃c̲͈̑ͬ́ë̢̜͍̩̂̆͛s̻͈̃͠s͒̎҉̼̣͈ǐ̛̜̗b̞̯̥̜ͦ̚͠ļ͖̣ͥ̊ͬ́e̝̱̲̫͚̯̔͆͞ͅ.̧͚̖͚͉̯̞̎ ̛̯̥̹͕̅ͮP̵̪̱̣̖̝̙̱̪̓rͦ̎̅͏̪̗̜̟̜o̥̠̠̱̗̳ͩ͌͟v̪͈̀̏ͨ͝ĩ̲̯̦̖͎͓ͮͮ̅͟d̝̙̥̪̘̒͘e̢̮͓͙͇ͪ̋ ̵͚͓͎̲̦̣̂ͨͤ̈́ͅa̵͈̝̭̦̗͊̅ ̜̖̮̫̪͕̱́̔̅ͪ̀ṿ̘̞͍ͭ̋ͨ́å̘̪̓͝l͎͔̩ͤ͢ì̈́͌҉̜̳̥̘ͅd͓̪̭͔̻͇ͩ̾ͪ̒͡",
                url: "",
            },
            styling: {
                colorPrimary: "#66B8F1",
                colorSecondary: "#DEF1FA"
            },
            isHorizontal: false
        },
        {
            info: {
                type: "Unknown",
                name: "Future",
                description: "Lorem isumn",
                url: "",
            },
            styling: {
                colorPrimary: "#73a6a4",
                colorSecondary: "#d6e1df"
            },
            isHorizontal: false
        },
    ]

    return (
        <div id="projects">
            <PageWrapper>

                {/* Title */}
                <div className="section_title h-100">
                    Projects
                </div>

                {/* Content */}
                <div className="row mx-0 mt-3" data-masonry='{"percentPosition": true }'>
                    {
                        projectList.map(pro => {
                            if (pro.isHorizontal) {
                                return (
                                    <Fade bottom key={Math.random()}>
                                        <div className="col-sm-12 col-md-6 mb-4">
                                            <ProjectCard cardInfo={pro} isHorizontal={pro.isHorizontal}></ProjectCard>
                                        </div>
                                    </Fade>
                                );
                            }
                            return (
                                <Fade bottom key={Math.random()}>
                                    <div className="col-sm-6 col-md-3 mb-4">
                                        <ProjectCard cardInfo={pro} isHorizontal={pro.isHorizontal}></ProjectCard>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </div>
            </PageWrapper>
        </div>
    );
}

export default Projects;