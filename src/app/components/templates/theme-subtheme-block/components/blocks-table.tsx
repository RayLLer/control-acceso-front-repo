import MagicTable from "@/app/components/table-v2/table-custom";
import { IBlock, IBlockResponse } from "@/app/interfaces/question";
import { block_columns } from "./blocks-columns";
import { useState } from "react";
import BlockForm from "./blocks-form";
import { BASE_FILTER } from "@/utils/constants/constants";
import { questionService } from "@/app/services/question.service";
import axios from "axios";

const BlockTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<number | undefined>();
  const [refetch, setRefetch] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlockId(undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      const responseQuestion = await questionService.get({
        filters: {
          $and: [
            { block: { id: id } },
            {
              deleted: { $eq: false },
            },
          ],
        },
        fields: "id",
      });
      if (responseQuestion.data.data.length > 0) {
        return "No se puede eliminar. Existen preguntas asociadas";
      } else {
        return true;
      }
    } catch (error) {
      return axios.isAxiosError(error)
        ? error.response?.data.message
        : "Ha ocurrido un error";
    }
  };

  return (
    <>
      <MagicTable<IBlockResponse, IBlock>
        columns={block_columns}
        url={"blocks"}
        crud
        onAdd={handleShowModal}
        onEdit={(id: number): void => {
          handleShowModal();
          setSelectedBlockId(id);
        }}
        setRefetch={setRefetch}
        onDelete={handleDelete}
        refetch={refetch}
        defaultParameters={{
          populate: { sub_theme: "*" },
          filters: { ...BASE_FILTER },
        }}
      />
      {showModal && (
        <BlockForm
          blockId={selectedBlockId}
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

export default BlockTable;
