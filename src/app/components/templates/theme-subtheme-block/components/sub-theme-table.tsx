import MagicTable from "@/app/components/table-v2/table-custom";
import { ISubTheme, ISubThemeResponse } from "@/app/interfaces/question";
import { subtheme_columns } from "./sub-theme-columns";
import { useState } from "react";
import SubThemeForm from "./sub-theme-form";
import { BASE_FILTER } from "@/utils/constants/constants";
import { subThemeService } from "@/app/services/subthemes.service";
import axios from "axios";
import { testService } from "@/app/services/test.service";
import { questionService } from "@/app/services/question.service";

const SubThemeTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState<
    number | undefined
  >();
  const [refetch, setRefetch] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubThemeId(undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      const responseTest = await testService.get({
        filters: {
          $and: [
            { sub_theme: { id: id } },
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
            { sub_theme: { id: id } },
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
        const response = await subThemeService.getById(id, {
          populate: ["blocks"],
        });
        const subTheme = response.data.data;
        const hasActiveBlocks = subTheme.attributes.blocks.data?.some(
          (block) => !block.attributes.deleted
        );
        return !hasActiveBlocks;
      }
    } catch (error) {
      return axios.isAxiosError(error)
        ? error.response?.data.message
        : "Ha ocurrido un error";
    }
  };

  return (
    <>
      <MagicTable<ISubThemeResponse, ISubTheme>
        columns={subtheme_columns}
        url={"sub-themes"}
        crud
        onAdd={handleShowModal}
        onEdit={(id: number): void => {
          handleShowModal();
          setSelectedSubThemeId(id);
        }}
        onDelete={handleDelete}
        setRefetch={setRefetch}
        refetch={refetch}
        defaultParameters={{
          populate: { theme: "*" },
          filters: { ...BASE_FILTER },
        }}
      />
      {showModal && (
        <SubThemeForm
          subThemeId={selectedSubThemeId}
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

export default SubThemeTable;
