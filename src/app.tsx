import RouterComponent from "./router/Router";

export default () => {
  if (typeof document === 'undefined') {
    return <div />;
  }
  return (
    <RouterComponent />
  );
};

