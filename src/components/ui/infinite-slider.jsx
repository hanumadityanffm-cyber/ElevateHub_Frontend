import { motion } from 'framer-motion';
import useMeasure from 'react-use-measure';

export function InfiniteSlider({ children, direction = 'left', speed = 50, className }) {
  const [ref, { width }] = useMeasure();
  
  return (
    <div className={`overflow-hidden flex w-full relative ${className || ''}`}>
      <motion.div
        ref={ref}
        className="flex min-w-full w-max shrink-0 items-center justify-around gap-12 sm:gap-24 px-6 sm:px-12"
        initial={{ x: direction === 'left' ? 0 : '-100%' }}
        animate={{ x: direction === 'left' ? '-100%' : 0 }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: width ? width / speed : 20,
        }}
        style={{ display: 'flex' }}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex min-w-full w-max shrink-0 items-center justify-around gap-12 sm:gap-24 px-6 sm:px-12"
        initial={{ x: direction === 'left' ? 0 : '-100%' }}
        animate={{ x: direction === 'left' ? '-100%' : 0 }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: width ? width / speed : 20,
        }}
        style={{ display: 'flex' }}
        aria-hidden="true"
      >
        {children}
      </motion.div>
    </div>
  );
}
