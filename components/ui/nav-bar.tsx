import React from "react";
import Link from "next/link";

// import "./styles/navBar.css";

const NAV_ACTION = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '#about' },
    { name: 'Projects', to: '#projects' },
    { name: 'Contact', to: '#contact' }
]

const NavBar = (props: any) => {
	return (
		<React.Fragment>
			<div className="flex justify-center items-center">
				<nav className="flex justify-center items-center fixed z-999 top-[3vh] ml-[25%] md:ml-[0%] mr-[25%] md:mr-[0%] w-[80%] md:w-full text-[80%] md:text-base">
					<div className="w-[80%] md:w-[380px] h-[40px] pl-[0%] pr-[0%] rounded-[40px] bg-white dark:bg-zinc-950 shadow-md dark:shadow-lg dark:ring dark:ring-zinc-500/50">
						<ul className="flex justify-between items-center list-none ml-[20px] mr-[20px] mt-[10px]">
                            {NAV_ACTION.map((action: any) => (
                            <li key={action.name} className={"font-bold text-base md:text-[80%] text-zinc-600 dark:text-zinc-400 transition duration-300 ease-in-out hover:text-[#14b8a6] dark:hover:text-[#14b8a6]"}>
								<Link href={action.to}>{action.name}</Link>
							</li>))}
						</ul>
					</div>
				</nav>
			</div>
		</React.Fragment>
	);
};

export default NavBar;
