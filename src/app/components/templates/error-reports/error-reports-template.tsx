"use client";
import { Tabs } from "antd";
import React from "react";
import ErrorReportsGeneral from "./error-reports-general";
import ErrorReportsResolved from "./error-reports-resolved";
import ErrorReportsUnanswered from "./error-reports-unanswered";
const ErrorReportsTemplate = () => {
  const [selectedIndex, setSelectedIndex] = React.useState("general");
  const items = [
    {
      key: 'general',
      label: 'Todos',
      children: (
        <ErrorReportsGeneral />
      )
    },
    {
      key: 'unanswered',
      label: 'No Respondidos',
      children: (
        <ErrorReportsUnanswered />
      )
    },
    {
      key: 'resolved',
      label: 'Resueltos',
      children: (
        <ErrorReportsResolved />
      )
    }
  ]
  return (
    <>
    <Tabs defaultActiveKey="general" onChange={setSelectedIndex} items={items} />
    </>
  );
};

export default ErrorReportsTemplate;
