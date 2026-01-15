import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
