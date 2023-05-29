// import { useBreedsStore } from '@/lib/store/store';
// import { capitalize } from '@/lib/utils';
import React from 'react';

type LayoutProps = {
  children: React.ReactElement | React.ReactElement[];
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const { breeds } = useBreedsStore();
  // const breedsArr = Object.keys(breeds.message);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-200 sticky top-0 h-14 flex justify-center items-center font-semibold uppercase">
        Choose the breed
      </header>
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="bg-grey-100 w-full md:w-60 h-screen">
          <nav>
            <ul className=" h-[calc(100vh-56px)] overflow-auto">
              {/* {breedsArr.map((breed) => (
                <li className="m-2" key={breed}>
                  <div
                    className={`flex p-2 bg-gray-200 rounded hover:bg-gray-400 cursor-pointer`}
                  >
                    {capitalize(breed)}
                  </div>
                </li>
              ))} */}
            </ul>
          </nav>
        </aside>
        <main className="h-[calc(100vh-74px)] flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
