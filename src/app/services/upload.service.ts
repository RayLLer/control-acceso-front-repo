import axios from 'axios';
import secureStorage from 'react-secure-storage';

export const uploadService = async (file: any) => {
  try {
    const form = new FormData();
    form.append('files', file);
    return axios.post(process.env.NEXT_PUBLIC_API_URL + '/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${secureStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const uploadQuestions = async (file: any) => {
  const form = new FormData();
  form.append('files.file', file);
  form.append('data', '{}');
  return axios.post(
    process.env.NEXT_PUBLIC_API_URL + '/questions/import/',
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${secureStorage.getItem('token')}`,
      },
    }
  );
};
