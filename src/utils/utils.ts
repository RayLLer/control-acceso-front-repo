import { TableParams } from './table';

export const isNullOrUndefined = (value: any): boolean =>
  value == null || value == undefined;

export async function urlToFile(url: string, filename: string, mimeType: any) {
  // Fetch the image from the URL
  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + url);
  // Get the image as a blob
  const blob = await response.blob();
  // Create a file from the blob
  const file = new File([blob], filename, { type: mimeType });
  return file;
}

export const changeUndefinedToNull = (value: any) => {
  for (const key in value) {
    if (value[key] === undefined) {
      value[key] = null;
    }
  }
  return value;
}