import { FC } from 'react';
import Image from 'next/image';

interface Props { }

export const ChatLoader: FC<Props> = () => {
  return (
    <div
      className="group border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100"
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] items-end">
          <Image alt="user" src="/gener.png" width="30" height="30" />
        </div>
        {/* <span className="animate-pulse cursor-default mt-1">▍</span> */}
        <svg id="dots" className="animate-pulse cursor-default mt-1" width="14px" height="9px" viewBox="0 0 132 58" version="1.1" xmlns="http://www.w3.org/2000/svg" >
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
            <g id="dots" fill="#A3A3A3">
              <circle id="dot1" cx="25" cy="30" r="13"></circle>
              <circle id="dot2" cx="65" cy="30" r="13"></circle>
              <circle id="dot3" cx="105" cy="30" r="13"></circle>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
