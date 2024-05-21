import {saveAs} from 'file-saver'

export const handleDownloadDocument = async (url: string) => {
  try {
    const urlTemp = url.split('opt/public')[1];
    const responsePdf = await fetch(process.env.NEXT_PUBLIC_BASE_URL + urlTemp);
    const blob = await responsePdf.blob();

    const fileName = urlTemp.substring(urlTemp.lastIndexOf('/') + 1);

    saveAs(blob, fileName);
  } catch (error) {
    throw new Error(error);
  }
};
