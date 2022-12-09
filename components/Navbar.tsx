import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineLogout } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import Logo from '../utils/logo.gif';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { createOrGetUser } from '../utils';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { userProfile, addUser, removeUser }: any = useAuthStore();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchValue) {
      router.push(`/search/${searchValue}`)
    }
  }

  return (
    <div className='flex flex-col w-auto'>
      <div className="w-full flex justify-between items-center border-b-2 border-transparent py-2 px-4">
        <Link href="/">
          <div className="w-[140px] md:w-[250px]">
            <Image
              className="cursor-pointer"
              src={Logo}
              alt="Clang Social"
              layout="responsive"
            />
          </div>
        </Link>
        {userProfile ? (
          <div className="relative md:hidden xl:hidden">
            <form
              onSubmit={handleSearch}
              className=" bg-white"
            >
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search here..."
                className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus-border-2 focus:border-gray-300 w-[200px] md:w-[350px] rounded-full md:top-0"
              />
              <button
                onClick={() => { handleSearch }}
                className="absolute md:right-2 right-2 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-[#F51997]"
              >
                <BiSearch />
              </button>
            </form>
          </div>) : (
          <div className="md:hidden xl:hidden">
            <GoogleLogin
              onSuccess={(response) => createOrGetUser(response, addUser)}
              onError={() => console.log('Error')}
            />
          </div>
        )}
        <div className="relative hidden md:block xl:block">
          <form
            onSubmit={handleSearch}
            className=" bg-white"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search here..."
              className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus-border-2 focus:border-gray-300 w-[200px] md:w-[350px] rounded-full md:top-0"
            />
            <button
              onClick={() => { handleSearch }}
              className="absolute md:right-2 right-2 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-[#F51997]"
            >
              <BiSearch />
            </button>
          </form>
        </div>
        <div className="hidden md:block xl:block">
          {userProfile ?
            (
              <div className="flex gap-5 md:gap-10">
                <Link href="/upload">
                  <button className="border-2 p-2 px-2 md:px-4 text-md font-semibold flex  items-center rounded-full gap-2">
                    <IoMdAdd className="text-xl" /> {`  `}
                    <span className="hidden md:block">New Post</span>
                  </button>
                </Link>
                {userProfile.image && (
                  <Link href="/">
                    <div className="w-[40px] md:w-[40px] flex">
                      <Image
                        className="cursor-pointer rounded-full"
                        width={40}
                        height={40}
                        src={userProfile.image}
                        alt="Profile Photo"
                      />
                    </div>
                  </Link>
                )}
                <button
                  type="button"
                  className="px-2"
                  onClick={() => {
                    googleLogout();
                    removeUser();
                  }}
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              </div>
            ) :
            (
              <GoogleLogin
                onSuccess={(response) => createOrGetUser(response, addUser)}
                onError={() => console.log('Error')}
              />
            )
          }
        </div>
      </div>

    </div>
  )
}

export default Navbar