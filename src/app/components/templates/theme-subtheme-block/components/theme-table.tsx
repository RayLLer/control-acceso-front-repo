"use client";
import MagicTable from "@/app/components/table-v2/table-custom";
import { ITheme, IThemeResponse } from "@/app/interfaces/theme";
import React, { useState } from "react";
import { theme_columns } from "./theme-columns";
import ThemeForm from "./theme-form";
import { BASE_FILTER } from "@/utils/constants/constants";
import { themeService } from "@/app/services/themes.service";
import axios from "axios";
import { testService } from "@/app/services/test.service";
import { questionService } from "@/app/services/question.service";

const ThemeTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<number | undefined>();
  const [refetch, setRefetch] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedThemeId(undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      const responseTest = await testService.get({
        filters: {
          $and: [
            { theme: { id: id } },
            {
              deleted: { $eq: false },
            },
          ],
        },
        fields: "id",
      });
      const responseQuestion = await questionService.get({
        filters: {
          $and: [
            { theme: { id: id } },
            {
              deleted: { $eq: false },
            },
          ],
        },
        fields: "id",
      });

      if (
        responseTest.data.data.length > 0 ||
        responseQuestion.data.data.length > 0
      ) {
        return "No se puede eliminar. Existen tests o preguntas asociadas";
      } else {
        const response = await themeService.getById(id, {
          populate: ["sub_themes"],
        });
        const theme = response.data.data;
        const hasActiveSubthemes = theme.attributes.sub_themes.data?.some(
          (subTheme) => !subTheme.attributes.deleted
        );
        return !hasActiveSubthemes;
      }
    } catch (error) {
      return axios.isAxiosError(error)
        ? error.response?.data.message
        : "Ha ocurrido un error";
    }
  };

  return (
    <>
      <MagicTable<IThemeResponse, ITheme>
        columns={theme_columns}
        url={"themes"}
        crud
        onAdd={handleShowModal}
        onEdit={(id: number): void => {
          handleShowModal();
          setSelectedThemeId(id);
        }}
        onDelete={handleDelete}
        defaultParameters={{
          populate: { category_themes: { populate: "category" } },
          filters: { ...BASE_FILTER },
        }}
        setRefetch={setRefetch}
        refetch={refetch}
      />
      {showModal && (
        <ThemeForm
          themeId={selectedThemeId}
          open={showModal}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            setRefetch(true);
          }}
        />
      )}
    </>
  );
};

export default ThemeTable;
