import * as React from 'react';

export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  // React.useEffect(() => {
  //   const handleScroll = () => {
  //     console.log('window.innerHeight', window.innerHeight);
  //     console.log('window.scrollY', window.scrollY);

  //     console.log('document.body.offsetHeight', document.body.offsetHeight);

  //     setIsAtBottom(
  //       window.innerHeight + window.scrollY >=
  //         document.body.offsetHeight - offset
  //     );
  //   };

  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   handleScroll();

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [offset]);

  return { isAtBottom };
}
