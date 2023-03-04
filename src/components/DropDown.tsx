import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BookmarkIcon } from "@heroicons/react/24/outline";

/**
 * DropDown w/ group-hover:opacity
 */
export default function DropDown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* <div> */}
      <Menu.Button
        onMouseUp={(e) => e.stopPropagation()}
        className="group-hover:opacity-100 opacity-0 self-center inline-flex w-full justify-center items-center rounded-md bg-white hover:bg-neutral-200 px-2 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        {/* Options */}
        <BookmarkIcon
          className="h-5 w-5 text-neutral-700 hover:text-black"
          aria-hidden="true"
        />
      </Menu.Button>
      {/* </div> */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-50 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <div className="text-sm p-2 text-neutral-500">Save to list</div>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-neutral-800 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {/* {active ? (
                    <EditActiveIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <EditInactiveIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )} */}
                  Favorites
                </button>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-neutral-800 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Read later
                </button>
              )}
            </Menu.Item> */}
          </div>
          {/* <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-neutral-800 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Artists
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-neutral-800 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Designers
                </button>
              )}
            </Menu.Item>
          </div> */}
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-neutral-800 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  + New list
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
