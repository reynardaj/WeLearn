const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;