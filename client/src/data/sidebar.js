import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import logo from "../Assets/logo.jpg"
import { RiRobot3Fill } from "react-icons/ri";

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Inventory",
    icon: <BiImageAdd />,
    path: "/add-inventory",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  
  {
    title: "AI Chat",
    icon: <RiRobot3Fill />,
    path: "/aichat",
  },

  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
