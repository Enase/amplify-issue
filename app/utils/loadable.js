import { Suspense, lazy } from 'react';

const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props /* eslint-disable-line react/jsx-props-no-spreading */} />
    </Suspense>
  );
};

export default loadable;
