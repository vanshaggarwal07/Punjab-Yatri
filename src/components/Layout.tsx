import { ReactNode } from 'react';
import SOSButton from './SOSButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen">
      <SOSButton />
      <main className="pb-16">{children}</main>
    </div>
  );
};

export default Layout;
