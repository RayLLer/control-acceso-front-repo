'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { paths } from './routes/paths';
import { useAppDispatch } from './store/hooks';
import { setTheme } from './store/settings/settingsSlice';
import secureStorage from 'react-secure-storage';

export default function Home(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const theme = secureStorage.getItem('theme') as 'light' | 'dark' || 'light';
    dispatch(setTheme(theme));
    !secureStorage.getItem('token')
      ? router.push('auth/login')
      : router.push(paths.usuarios.root);
  }, []);

  return (
    <></>
  );
}
