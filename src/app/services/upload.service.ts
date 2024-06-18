import axios from 'axios';

export const uploadService = async (file: any) => {
  try {
    const form = new FormData();
    form.append('files', file);
    return axios.post(process.env.NEXT_PUBLIC_API_URL + '/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
}