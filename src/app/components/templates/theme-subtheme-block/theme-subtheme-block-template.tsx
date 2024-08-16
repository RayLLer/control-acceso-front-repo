"use client";
import { Tabs } from "antd";
import React from "react";
import ThemeTable from "./components/theme-table";
import SubThemeTable from "./components/sub-theme-table";
import BlockTable from "./components/blocks-table";

const ThemeSubthemeBlockTemplate = () => {
  const [selectedIndex, setSelectedIndex] = React.useState("theme");
  return (
    <Tabs defaultActiveKey="theme" onChange={setSelectedIndex}>
      <Tabs.TabPane tab="Temas" key="theme">
        <ThemeTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Subtemas" key="sub-theme">
        <SubThemeTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Bloques" key="block">
        <BlockTable />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ThemeSubthemeBlockTemplate;
