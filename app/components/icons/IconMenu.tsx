import {m} from 'framer-motion';

export function IconMenu(props: {className?: string; menuState: boolean}) {
  const {className = '', menuState} = props;
  return (
    <m.div
      animate={{
        rotate: menuState ? 180 : 0,
        transition: {duration: 0.3},
      }}
      initial={false}
    >
      <svg
        className={className}
        fill="none"
        viewBox="0 0 144 104"
        xmlns="http://www.w3.org/2000/svg"
      >
        <m.path
          animate={{
            opacity: menuState ? 0: 1,
            transition: {duration: 0.2},
          }}
          d="M2 22L142 22"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <m.path
          animate={{
            opacity: menuState ? 0: 1,
            transition: {duration: 0.2},
          }}
          d="M2 52L142 52"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <m.path
          animate={{
            opacity: menuState ? 0: 1,
            transition: {duration: 0.2},
          }}
          d="M2 82L142 82"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />

        <m.path
          animate={{
            opacity: menuState ? 1 : 0,
            transition: {duration: 0.3},
          }}
          d="M22.5024 101.497L121.497 2.50237"
          initial={false}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <m.path
          animate={{
            opacity: menuState ? 1 : 0,
            transition: {duration: 0.3},
          }}
          d="M22.5024 2.50244L121.497 101.497"
          initial={false}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
    </m.div>
  );
}
