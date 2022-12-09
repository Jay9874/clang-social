import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { AiOutlineSend } from 'react-icons/ai';
import { MdScheduleSend } from 'react-icons/md';

import useAuthStore from '../store/authStore';
import NoResults from './NoResults';


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

const CommentsHome = ({ comment, setComment, addComment, comments, isPostingComment }: IProps) => {
  const { userProfile } = useAuthStore();

  return (
    <div>
      {userProfile && (
        <div className="mt-2">
          <form className="flex gap-5" onSubmit={addComment}>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment here..."
              className="bg-primary w-[200px] md:w-[300px] lg:w-[300px] px-3 py-3 text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 rounded-full"
            />
            <button
              className="text-md text-gray-400"
              onClick={addComment}
            >
                {isPostingComment ? <MdScheduleSend className='w-5 h-5' /> : <AiOutlineSend className='text-[#F51997] w-5 h-5 ' />}
              
            </button>
          </form>

        </div>
      )}
    </div>
  )
}

export default CommentsHome