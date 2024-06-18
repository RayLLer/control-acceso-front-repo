'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { paths } from './routes/paths';
import { useAppDispatch } from './store/hooks';
import { setTheme } from './store/settings/settingsSlice';

export default function Home(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const theme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    dispatch(setTheme(theme));
    !localStorage.getItem('token')
      ? router.push('auth/login')
      : router.push(paths.tests.root);
  }, []);

  return (
    <></>
  );
}
