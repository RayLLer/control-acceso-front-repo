"use client";
import { Tabs } from "antd";
import React, { Children } from "react";
import ThemeTable from "./components/theme-table";
import SubThemeTable from "./components/sub-theme-table";
import BlockTable from "./components/blocks-table";

const ThemeSubthemeBlockTemplate = () => {
  const [selectedIndex, setSelectedIndex] = React.useState("theme");
  const items = [
    {
      key: "theme",
      label: "Temas",
      children: (<ThemeTable />)
    },
    {
      key: "sub-theme",
      label: "Subtemas",
      children: (<SubThemeTable />)
    },
    {
      key: "block",
      label: "Bloques",
      children: (<BlockTable />)
    }
  ]
  return (
    <Tabs defaultActiveKey="theme" onChange={setSelectedIndex} items={items} />
      
  );
};

export default ThemeSubthemeBlockTemplate;
