import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiFillHome, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import Discover from './Discover';
import SuggestedAccounts from './SuggestedAccounts';
import Footer from './Footer';
import useAuthStore from '../store/authStore';
import Image from 'next/image';
import { IoMdAdd } from 'react-icons/io';
import { googleLogout } from '@react-oauth/google';

const Sidebar = () => {

  const [showSidebar, setShowSidebar] = useState(true);
  const normalLink = 'flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F51997] rounded';
  const { userProfile, addUser, removeUser }: any = useAuthStore();

  return (
    <div className="flex flex-col justify-center items-center">
      <div onClick={() => setShowSidebar((prev) => !prev)} className=" mt-3 text-xl cursor-pointer">
        {showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
      </div>
      {showSidebar && (
        <div className="flex flex-col justify-start xl:w-400 w-20 overflow-y-scroll h-[500px] lg:h-[1000px] md:h-[1000px] mb-7 p-3">
        {/* <div className="flex flex-col justify-start xl:w-400 w-20 overflow-scroll h-[500px] lg:h-[1000px] md:h-[1000px] mb-7 border-r-2 border-gray-100 xl:border-0 p-3"> */}
          <div className=" md:pb-4">
            <Link href="/">
              <div className={normalLink}>
                <p className="text-2xl"><AiFillHome /></p>
                <span className="text-xl hidden xl:block">For You</span>
              </div>
            </Link>
          </div>
          <Discover />
          <SuggestedAccounts />
          <Footer />
        </div>
      )}
      {!showSidebar && userProfile && (
        <div className="flex flex-col ml-2 md:hidden xl:hidden mt-5 gap-5 md:gap-10">
          <Link href="/upload">
            <button className="border-2 px-2 md:px-4 p-2 text-md font-semibold rounded-full flex items-center">
              <IoMdAdd className="text-xl" /> {`  `}
              <span className="hidden md:block">New Post</span>
            </button>
          </Link>
          {userProfile?.image && (
            <Link href={`/profile/${userProfile?._id}`}>
              <div className="w-[43px] md:w-[43px] flex">
                <Image
                  className="border-2 cursor-pointer text-md font-semibold flex items-center rounded-full"
                  width={45}
                  height={45}
                  src={userProfile?.image}
                  alt="Profile Photo"
                />
              </div>
            </Link>
          )}
          <button
            type="button"
            className="border-2 px-2 md:px-4 p-2 text-md font-semibold rounded-full flex items-center"
            onClick={() => {
              googleLogout();
              removeUser();
            }}
          >
            <AiOutlineLogout color="red" fontSize={21} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar