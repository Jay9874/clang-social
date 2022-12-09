import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';

import useAuthStore from '../store/authStore';
import NoResults from './NoResults';
import { IUser } from '../types';
import { MdScheduleSend } from 'react-icons/md';
import { AiOutlineSend } from 'react-icons/ai';


interface IProps {
  isPostingComment: Boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}
interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: {
    _ref: string;
    _id: string;
  }
}

const Comments = ({ comment, setComment, addComment, comments, isPostingComment }: IProps) => {
  const { userProfile, allUsers } = useAuthStore();

  return (
    <>
      {userProfile && (
        <form className="flex gap-4 mt-5 mb-2 lg:hidden" onSubmit={addComment}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add Comment"
            className="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 rounded-full flex-1" />
          <button
            className="text-md text-gray-400"
            onClick={addComment}
          >
            {isPostingComment ? <MdScheduleSend className=' w-5 h-5' /> : <AiOutlineSend className='text-[#F51997] w-5 h-5' />}
          </button>
        </form>)}
      <div className="border-t-2 border-gray-200 pt-4 px-10 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]">
        <p className="text-lg underline mb-5">Comments</p>
        <div className="lg:h-[475px] ">
          {comments?.length ?
            (
              <div>{comments?.length ?
                (
                  comments.map((item, idx) => (
                    <>
                      {allUsers.map((user: IUser) => (
                        user._id === (item.postedBy._id || item.postedBy._ref) && (
                          <div className="p-2" key={idx}>
                            <Link href={`/profile/${user._id}`}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 cursor-pointer">
                                  <Image
                                    src={user.image}
                                    width={34}
                                    height={34}
                                    className="rounded-full"
                                    alt="Profile Image"
                                    layout='responsive' />
                                </div>
                                <div className="-mt-1 cursor-pointer">
                                  <p className="flex gap-1 items-center text-md font-semibold capitalize text-primary">
                                    {user.userName}
                                    <GoVerified className="text-blue-400" />
                                  </p>
                                  <p className="lowercase text-gray-400 text-xs">
                                    {`@${user.userName.replaceAll(' ', '')}`}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            <div className="mt-2 w-full border-b-2">
                              <p className="">
                                {item.comment}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
                    </>
                  ))
                ) :
                (<div></div>)}</div>
            ) :
            (
              <NoResults text="No comments yet!" />
            )}
        </div>

        {userProfile && (
          <div className="absolute bottom-0 left-0 pb-6 hidden lg:block px-2 md:px-10">
            <form className="flex gap-4" onSubmit={addComment}>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add Comment"
                className="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 rounded-full flex-1" />
              <button
                className="text-md text-gray-400"
                onClick={addComment}
              >
                {isPostingComment ? <MdScheduleSend className=' w-5 h-5' /> : <AiOutlineSend className='text-[#F51997] w-5 h-5' />}
              </button>
            </form>
          </div>
        )}
      </div></>
  )
}

export default Comments